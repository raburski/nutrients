import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { setup as setupGoober, styled } from 'goober'
import { NutrientAmount, NutrientDose, NutrientUnit, allNutrients, Micronutrient, ProductDose, Product } from "./types/nutrient";
import { nutrientsMan32 } from "./types/doses";
import { athelticGreensDoses, atheticGreens, atheticGreensOneServing, bananaProduct, wheyProduct } from "./types/products";
import NutrientList from "./NutrientList";
import productsDatabase from "./fdc";
import useDebouncedInput from "./useDebouncedInput";
import TextField from "./TextField";
import ProductList from "./ProductList";
import ProductDosesList from "./ProductDosesList";
import Modal from "./Modal";
import ProductInfo from "./ProductInfo";
import FetchingDatabase from "./FetchingDatabase";
import { useStorage } from "./storage";

setupGoober(React.createElement)

function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object))
}

const UNIT_CONVERSION_MATRIX: any = {
  [NutrientUnit.MCG]: {
    [NutrientUnit.MG]: 0.001
  },
  [NutrientUnit.MG]: {
    [NutrientUnit.MCG]: 1000
  },
}

function amountOperation(a1: NutrientAmount, a2: NutrientAmount, operation: (n1: number, n2: number) => number): NutrientAmount {
  if (a1.unit === a2.unit) {
    return { unit: a1.unit, value: operation(a1.value, a2.value) }
  }

  const conversionMultiple = UNIT_CONVERSION_MATRIX[a2.unit][a1.unit]
  if (conversionMultiple !== undefined) {
    const convertedA2 = { unit: a1.unit, value: a2.value * conversionMultiple }
    return amountOperation(a1, convertedA2, operation)
  }

  throw Error(`different units not supported for now: ${a1.unit} and ${a2.unit}`)
}

function addAmounts(a1: NutrientAmount, a2: NutrientAmount): NutrientAmount {
  return amountOperation(a1, a2, (n1, n2) => n1 + n2)
}

function subAmounts(a1: NutrientAmount, a2: NutrientAmount): NutrientAmount {
  return amountOperation(a1, a2, (n1, n2) => n1 - n2)
}

function addNutrientDoses(doses: NutrientDose[]): NutrientDose[] {
  return doses.reduce((total, dose) => {
    const doseIndex = total.findIndex(d => d.nutrient === dose.nutrient)
    if (doseIndex >= 0) {
      const countedDose = total[doseIndex]
      countedDose.amount = addAmounts(countedDose.amount, dose.amount)
    } else {
      total.push({ nutrient: dose.nutrient, amount: { ...dose.amount } })
    }
    return total
  }, [] as NutrientDose[])
}

function subNutrientDoses(initial: NutrientDose[], subtracted: NutrientDose[]) {
  return subtracted.reduce((total, dose) => {
    const doseIndex = total.findIndex(d => d.nutrient === dose.nutrient)
    if (doseIndex >= 0) {
      const countedDose = total[doseIndex]
      // console.log('sub amnts', countedDose, dose)
      countedDose.amount = subAmounts(countedDose.amount, dose.amount)
    } else {
      total.push({ nutrient: dose.nutrient, amount: { unit: dose.amount.unit, value: -dose.amount.value } })
    }
    return total
  }, deepCopy(initial))
}

function getNutrientsMissing(required: NutrientDose[], supplied: NutrientDose[]) {
  const totalSupplied = addNutrientDoses(supplied)
  const missing = subNutrientDoses(required, totalSupplied)
  return missing
}

const AppContainer = styled('div')`
  display: flex;
  flex-directio: row;
  flex: 1;
  
`

const Column = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  white-space: pre;
  max-height: 100vh;
  overflow: scroll;

`

const Row = styled('div')`
  display: flex;
  flex-direction: row;
  flex: 1;
  white-space: pre;
`

const SectionTitle = styled('div')`
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 12px;
`

function getNutrientDosesFromProductDose(pd: ProductDose): NutrientDose[] {
  if (pd.servings !== undefined && pd.servings > 0 && pd.product.nutrientsPerServing) {
    return pd.product.nutrientsPerServing!.map(n => ({ nutrient: n.nutrient, amount: { value: n.amount.value * pd.servings!, unit: n.amount.unit } }))
  }
  if (pd.grams !== undefined && pd.grams > 0 && pd.product.nutrientsPer100g) {
    return pd.product.nutrientsPer100g!.map(n => ({ nutrient: n.nutrient, amount: { value: n.amount.value * pd.grams! / 100, unit: n.amount.unit } }))
  }
  return []
}

function useFetchDatabase() {
  const [fetching, setFetching] = useState(false)
  useEffect(() => {
    if (productsDatabase.isLoaded) return

    setFetching(true)
    productsDatabase.fetchDatabase().then(() => setFetching(false))
  }, [])
  return [fetching]
}

const DEFAULT_SECTION_TITLE = '_default'
const DEFAULT_SECTIONS = { [DEFAULT_SECTION_TITLE]: [atheticGreensOneServing] }

const DEFAULT_SEARCH_LIST = [
  atheticGreens,
  bananaProduct,
  wheyProduct,
]

function App() {
  const [selectedSection, setSelectedSection] = useState(DEFAULT_SECTION_TITLE)
  const [fetchingDatabase] = useFetchDatabase()
  const [searchPhrase, onSearchChange, setSearchPhrase] = useDebouncedInput()
  const [selectedNutrient, setSelectedNutrient] = useState()
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [sections, setSections] = useStorage('sections', DEFAULT_SECTIONS)
  const [selectedSections, setSelectedSections] = useStorage('selectedSections', [DEFAULT_SECTION_TITLE])
  const sectionNames = Object.keys(sections)

  const onNutrientSelectChange = (e: any) => {
    setSelectedNutrient(e.target.value)
  }
  const onAddProductClick = (product: Product) => {
    const doses = deepCopy(sections[selectedSection])
    const newDose = { product, grams: product.nutrientsPer100g ? 100 : undefined, servings: product.nutrientsPerServing ? 1 : undefined }
    setSections({ ...sections, [selectedSection]: [ ...doses, newDose ]})
  }
  const onRemoveProductDoseClick = (sectionName: string, productDose: ProductDose) => {
    const productDoses = sections[sectionName]
    const doseIndex = productDoses.indexOf(productDose)
    const newDoses = [...productDoses.slice(0, doseIndex), ...productDoses.slice(doseIndex + 1)]
    setSections({ ...sections, [sectionName]: newDoses })
  }
  const onProductClick = (product: Product) => setSelectedProduct(product)
  const onProductDoseClick = (productDose: ProductDose) => setSelectedProduct(productDose.product)

  const onProductDosesSectionSave = (productDose: ProductDose, name: string) => {
    if (!name) return
    setSections({ ...sections, [name]: productDose, [DEFAULT_SECTION_TITLE]: [] })
    setSelectedSections([ ...selectedSections, name ])
  }

  const onProductDoseCheckChange = (name: string, value: boolean) => {
    if (value && !selectedSections.includes(name)) {
      setSelectedSections([ ...selectedSections, name ])
    } else if (!value && selectedSections.includes(name)) {
      const newSections = selectedSections.filter((s: string) => s !== name)
      setSelectedSections(newSections)
    }
  }

  const onProductDoseListRemoveClick = (name: string) => () => {
    if (window.confirm('Are you sure you want to remove this sections?')) {
      const { [name]: _, ...newSections } = sections
      setSections(newSections)
    }
  }

  const onProductDoseValueChange = (name: string) => (dose: ProductDose, newValue: any) => {
    const newSections = deepCopy(sections)
    newSections[name][sections[name].indexOf(dose)].grams = parseFloat(newValue)
    setSections(newSections)
  }

  const productsFound = searchPhrase ? productsDatabase.getFood(searchPhrase as any as string) : undefined
  const topNutrientProducts = selectedNutrient ? productsDatabase.getFoodsWithMost(selectedNutrient, 200) : DEFAULT_SEARCH_LIST
  const displayProducts = productsFound ? productsFound : topNutrientProducts

  const allSectionsProductDoses = sectionNames.map(name => selectedSections.includes(name) ? sections[name] : null).filter(Boolean).flatMap(f => f) as ProductDose[]
  const allProductNutrientDoses = addNutrientDoses(allSectionsProductDoses.flatMap(getNutrientDosesFromProductDose))
  const missing = getNutrientsMissing(nutrientsMan32, allProductNutrientDoses)
  return (
    <AppContainer>
      <Row>
        <Column style={{marginRight: 22, marginLeft: 12, flex: 0, flexBasis: 400, maxWidth: 400}}>
          <SectionTitle>SEARCH:</SectionTitle>
          <TextField onChange={onSearchChange} style={{alignSelf: 'stretch', marginBottom: 12}}/>
          <select onChange={onNutrientSelectChange}>
            <option value=""> - select nutrient - </option>
            {allNutrients.map(n => <option value={n}>{n}</option>)}
          </select>
          {displayProducts ? <ProductList products={displayProducts} highlightNutrient={selectedNutrient} onAddClick={onAddProductClick} onClick={onProductClick}/> : null}
        </Column>
        <Column>
          <SectionTitle>SELECTED:</SectionTitle>
          {sectionNames ? sectionNames.map(s => 
            <ProductDosesList
              key={s}
              name={s}
              isSelected={s === selectedSection}
              isDefault={s === DEFAULT_SECTION_TITLE}
              checked={selectedSections.includes(s)}
              productDoses={sections[s]}
              onClick={() => setSelectedSection(s)}
              onRemoveProductDoseClick={onRemoveProductDoseClick}
              onSave={onProductDosesSectionSave}
              onCheckChange={onProductDoseCheckChange}
              onProductDoseClick={onProductDoseClick}
              onRemoveClick={onProductDoseListRemoveClick(s)}
              onProductDoseValueChange={onProductDoseValueChange(s)}
            />) : null}
        </Column>
      </Row>
      <Row style={{flex: 0.7}}>
        <Column style={{flex: 1.7}}>
          <SectionTitle>REQUIRED (Man 32):</SectionTitle>
          <NutrientList nutrientDoses={nutrientsMan32} showNames/>
        </Column>
        <Column>
          <SectionTitle>SUPPLIED:</SectionTitle>
          <NutrientList nutrientDoses={allProductNutrientDoses}/>
        </Column>
        <Column>
          <SectionTitle>MISSING:</SectionTitle>
          <NutrientList nutrientDoses={missing}/>
        </Column>
      </Row>
      <Modal isOpen={!!selectedProduct} onClickAway={() => setSelectedProduct(undefined)}>
         {selectedProduct ? <ProductInfo product={selectedProduct}/> : null}
      </Modal>
      {fetchingDatabase ? <FetchingDatabase /> : null}
    </AppContainer>
  );
}

export default App;
