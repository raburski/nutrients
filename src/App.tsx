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
import { uploadFile } from "./functions";
import { addNutrientDoses, deepCopy, getNutrientDosesFromProductDose, getNutrientsMissing } from "./nutrients";

setupGoober(React.createElement)

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

  async function onUploadClick() {
    const file = await uploadFile('json')
    const meal = await JSON.parse(file)
    const newSections = { ...sections, [meal.name]: meal.doses }
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
              onUploadClick={onUploadClick}
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
