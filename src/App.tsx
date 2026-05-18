import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { setup as setupGoober, styled } from 'goober'
import { NutrientUnit, allNutrients, ProductDose, Product, Nutrient } from "./types/nutrient";
import { nutrientsMan32 } from "./types/doses";
import { atheticGreensOneServing, allProducts } from "./types/products";
import NutrientList from "./NutrientList";
import productsDatabase from "./fdc";
import useDebouncedInput from "./useDebouncedInput";
import TextField, { FieldSelect } from "./TextField";
import ProductList from "./ProductList";
import ProductDosesList from "./ProductDosesList";
import Modal from "./Modal";
import ProductInfo from "./ProductInfo";
import FetchingDatabase from "./FetchingDatabase";
import { useStorage } from "./storage";
import { downloadString, uploadFile } from "./functions";
import { addNutrientDoses, deepCopy, getNutrientDosesFromProductDose, getNutrientsMissing, getProductDoseNutrientAmount } from "./nutrients";
import EmojiButton from "./EmojiButton";
import Cart from "./Cart";
import Spacer from "./Spacer";
import SuppliedNutrientsBreakdown from "./SuppliedNutrientsBreakdown"
import AddProductForm from "./AddProductForm"
import ProductSourcesModal from "./ProductSourcesModal"
import SearchResultFiltersModal from "./SearchResultFiltersModal"
import { filterProductsByName, filterProductsByNutrient, isCustomProduct } from "./customProducts"
import { getProductListFilterId } from "./productSourceDisplay"
import { DEFAULT_ENABLED_SOURCE_IDS, getDefaultResultSourceFilters, getProductSource } from "./productSources"
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd"

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

const NutrientFilterRow = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  min-width: 0;
`

const SectionTitle = styled('div')`
  display: flex;
  flex-direction: row;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 12px;
  margin-right: 28px;
`

const ProductDosesContainer = styled('div', React.forwardRef)`
  display: flex;
  flex-direction: column;
  flex: 1;
  white-space: pre;
  overflow: scroll;
  padding-bottom: 12px;
`

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function useProductDatabaseSync(enabledSourceIds: string[], syncKey: number) {
  const [fetching, setFetching] = useState(false)
  const [progress, setProgress] = useState("")
  const [revision, setRevision] = useState(0)
  const [syncFailed, setSyncFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const isUserSync = syncKey > 0
    const startedAt = Date.now()

    async function run() {
      setFetching(true)
      setSyncFailed(false)
      setProgress("Preparing product databases…")

      let failed = false
      try {
        await productsDatabase.syncSources(
          enabledSourceIds,
          message => {
            if (!cancelled) setProgress(message)
          },
          { force: isUserSync }
        )
      } catch (error) {
        failed = true
        if (!cancelled) {
          setSyncFailed(true)
          setProgress(error instanceof Error ? error.message : "Failed to load product databases.")
        }
      }

      if (!cancelled && isUserSync) {
        const elapsed = Date.now() - startedAt
        const minDisplayMs = failed ? 4000 : 600
        if (elapsed < minDisplayMs) {
          await sleep(minDisplayMs - elapsed)
        }
      }

      if (!cancelled) {
        setFetching(false)
        if (!failed) {
          setRevision(r => r + 1)
        }
      }
    }

    run()
    return () => { cancelled = true }
  }, [enabledSourceIds, syncKey])

  return { fetching, progress, revision, syncFailed }
}

function reordered(list: Array<any>, startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const DEFAULT_SECTION_TITLE = '_default'
const DEFAULT_SECTIONS = { [DEFAULT_SECTION_TITLE]: [atheticGreensOneServing] }

const DEFAULT_SEARCH_LIST = allProducts

function App() {
  const [selectedSection, setSelectedSection] = useState(DEFAULT_SECTION_TITLE)
  const [selectedSuppliedNutrient, setSelectedSuppliedNutrient] = useState<Nutrient>()
  const [enabledProductSources, setEnabledProductSources] = useStorage('enabledProductSources', DEFAULT_ENABLED_SOURCE_IDS)
  const [sourcesSyncKey, setSourcesSyncKey] = useState(0)
  const [syncErrorDismissed, setSyncErrorDismissed] = useState(false)
  const activeProductSources = useMemo(() => {
    if (!Array.isArray(enabledProductSources)) return DEFAULT_ENABLED_SOURCE_IDS
    return enabledProductSources.filter((id: string) => !!getProductSource(id))
  }, [enabledProductSources])
  const { fetching: fetchingDatabase, progress: fetchProgress, revision: databaseRevision, syncFailed } = useProductDatabaseSync(activeProductSources, sourcesSyncKey)
  const [searchPhrase, onSearchChange] = useDebouncedInput()
  const [selectedNutrient, setSelectedNutrient] = useState()
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>()
  const [sections, setSections] = useStorage('sections', DEFAULT_SECTIONS)
  const [selectedSections, setSelectedSections] = useStorage('selectedSections', [DEFAULT_SECTION_TITLE])
  const [collapsedSections, setCollapsedSections] = useStorage('collapsedSections', [])
  const [isShowingCart, setIsShowingCart] = useState(false)
  const [isShowingAddProduct, setIsShowingAddProduct] = useState(false)
  const [isShowingProductSources, setIsShowingProductSources] = useState(false)
  const [isShowingSearchFilters, setIsShowingSearchFilters] = useState(false)
  const [customProducts, setCustomProducts] = useStorage('customProducts', [] as Product[])
  const [resultSourceFilters, setResultSourceFilters] = useStorage(
    'resultSourceFilters',
    getDefaultResultSourceFilters(DEFAULT_ENABLED_SOURCE_IDS)
  )
  const [sectionNames, setSectionNames] = useStorage('sectionNames', Object.keys(sections))

  useEffect(() => {
    setResultSourceFilters((current: string[]) => {
      const valid = getDefaultResultSourceFilters(activeProductSources)
      const selected = Array.isArray(current)
        ? current.filter((id: string) => valid.includes(id))
        : []
      const added = valid.filter(id => !selected.includes(id))
      if (!added.length) return current
      return [...selected, ...added]
    })
  }, [activeProductSources, setResultSourceFilters])

  const activeResultSourceFilters = useMemo(() => {
    const valid = getDefaultResultSourceFilters(activeProductSources)
    if (!Array.isArray(resultSourceFilters)) return valid
    const selected = resultSourceFilters.filter((id: string) => valid.includes(id))
    return selected.length > 0 ? selected : valid
  }, [resultSourceFilters, activeProductSources])

  const onCartClick = () => setIsShowingCart(!isShowingCart)

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
    setSectionNames([...sectionNames, name])
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
    const index = sections[name].indexOf(dose)
    const parsed = parseFloat(newValue)
    if (dose.product.nutrientsPerServing) {
      newSections[name][index].servings = parsed
    } else {
      newSections[name][index].grams = parsed
    }
    setSections(newSections)
  }

  const onCustomProductSave = (product: Product) => {
    setCustomProducts([...customProducts, product])
    setIsShowingAddProduct(false)
  }

  const onCustomProductDelete = (product: Product) => {
    if (!product.id || !isCustomProduct(product)) return
    setCustomProducts(customProducts.filter((p: Product) => p.id !== product.id))
    setSelectedProduct(undefined)
  }

  const onProductSourcesSave = (sourceIds: string[]) => {
    setIsShowingProductSources(false)
    setSyncErrorDismissed(false)
    setEnabledProductSources(sourceIds)
    const valid = getDefaultResultSourceFilters(sourceIds)
    const pruned = activeResultSourceFilters.filter((id: string) => valid.includes(id))
    setResultSourceFilters(pruned.length > 0 ? pruned : valid)
    setSourcesSyncKey(key => key + 1)
  }

  const onSearchFiltersSave = (resultFilters: string[]) => {
    setIsShowingSearchFilters(false)
    setResultSourceFilters(resultFilters)
  }

  async function onUploadClick() {
    const file = await uploadFile('json')
    const meals = await JSON.parse(file)
    Object.keys(meals).forEach(name => {
      if (sections[name]) {
        meals[`${name}_`] = meals[name]
        delete meals[name]
      }
    })

    const newSections = { ...sections, ...meals }
    setSections(newSections)
  }

  const onSectionCollapseClick = (section: string) => async function _onSectionCollapseClick() {
    let newCollapsedSections
    if (collapsedSections.includes(section)) {
      newCollapsedSections = collapsedSections.filter((e:any) => e !== section)
    } else {
      newCollapsedSections = [...collapsedSections, section]
    }
    await setCollapsedSections(newCollapsedSections)
  }

  const onDownloadClick = () => {
    const { "_default": def, ...meals } = sections
    const string = JSON.stringify(meals)
    downloadString(string, 'json', `meals.json`)
  }

  function productHasNutrient(product: Product, nutrient: Nutrient) {
    return product.nutrientsPer100g?.find(n => n.nutrient === nutrient) !== undefined 
      || product.nutrientsPerServing?.find(n => n.nutrient === nutrient) !== undefined
  }

  function getSortedProductDoses(nutrient: Nutrient | undefined) {
    if (!nutrient) return null
    const doses = selectedSections
      .map((name: string) => sections[name])
      .filter((n: any) => n && n.length)
      .flatMap((n: any) => n)
      .filter((dose: ProductDose) => productHasNutrient(dose.product, nutrient))
    const unitsUsed = doses.reduce((acc: any, dose: ProductDose) => {
      const nutrientAmount = getProductDoseNutrientAmount(dose, nutrient)
      if (nutrientAmount) {
        acc[nutrientAmount.unit] = (acc[nutrientAmount.unit] || 0) + 1
      }
      return acc
    }, {})
    const mostUnitsUsed = Object.keys(unitsUsed).sort((a: string, b: string) => unitsUsed[b] - unitsUsed[a])
    const mostUsedUnit = mostUnitsUsed[0]
    doses.sort((a: ProductDose, b: ProductDose) => {
      return getProductDoseNutrientAmount(b, nutrient, mostUsedUnit as NutrientUnit)!.value - getProductDoseNutrientAmount(a, nutrient, mostUsedUnit as NutrientUnit)!.value
    })
    return doses
  }

  const onNutrientClick = (nutrient: Nutrient) => {
    setSelectedSuppliedNutrient(nutrient)
  }

  function sectionExists(name: string) {
    return sections[name] !== undefined
  }

  function onDragEnd(result: DropResult) {
    if (!result.destination) {
      return
    }
    const newSectionNames = reordered(
      sectionNames.filter((name: string) => Object.keys(sections).includes(name)),
      result.source.index,
      result.destination!.index
    )
    setSectionNames(newSectionNames)
  }

  const productsFound = useMemo(() => {
    if (!searchPhrase) return undefined
    void databaseRevision
    return productsDatabase.getFood(searchPhrase)
  }, [searchPhrase, databaseRevision])
  const topNutrientProducts = useMemo(() => {
    if (!selectedNutrient) return DEFAULT_SEARCH_LIST
    void databaseRevision
    return productsDatabase.getFoodsWithMost(selectedNutrient as Nutrient, 200)
  }, [selectedNutrient, databaseRevision])
  const baseDisplayProducts = productsFound ? productsFound : topNutrientProducts
  const displayProducts = useMemo(() => {
    const curatedForList = searchPhrase
      ? filterProductsByName(allProducts, searchPhrase)
      : (selectedNutrient ? filterProductsByNutrient(allProducts, selectedNutrient as Nutrient) : [])
    const customForList = searchPhrase
      ? filterProductsByName(customProducts, searchPhrase)
      : (selectedNutrient ? filterProductsByNutrient(customProducts, selectedNutrient as Nutrient) : customProducts)
    const merged = [...curatedForList, ...customForList, ...(baseDisplayProducts || [])]
    return merged.filter(product =>
      activeResultSourceFilters.includes(getProductListFilterId(product))
    )
  }, [searchPhrase, selectedNutrient, customProducts, baseDisplayProducts, activeResultSourceFilters])

  const allSectionsProductDoses = sectionNames.map((name: string) => selectedSections.includes(name) ? sections[name] : null).filter(Boolean).flatMap((f: any) => f) as ProductDose[]
  const allProductNutrientDoses = addNutrientDoses(allSectionsProductDoses.flatMap(getNutrientDosesFromProductDose))
  const missing = getNutrientsMissing(nutrientsMan32, allProductNutrientDoses)

  return (
    <AppContainer>
      <Row>
        <Column style={{marginRight: 22, marginLeft: 12, flex: 0, flexBasis: 400, maxWidth: 400}}>
          <SectionTitle>
            SEARCH:
            <Spacer />
            <EmojiButton onClick={() => setIsShowingProductSources(true)} title="Product databases">🗄️</EmojiButton>
            <EmojiButton onClick={() => setIsShowingAddProduct(true)} title="Add custom product">📝</EmojiButton>
          </SectionTitle>
          <TextField onChange={onSearchChange} style={{alignSelf: 'stretch', marginBottom: 12}}/>
          <NutrientFilterRow>
            <FieldSelect
              value={selectedNutrient || ""}
              onChange={onNutrientSelectChange}
              style={selectedNutrient ? undefined : { color: "#707070" }}
            >
              <option value="">Select nutrient…</option>
              {allNutrients.map(n => <option key={n} value={n}>{n}</option>)}
            </FieldSelect>
            <EmojiButton
              onClick={() => setIsShowingSearchFilters(true)}
              title="Show in search results"
            >
              🎛️
            </EmojiButton>
          </NutrientFilterRow>
          <ProductList products={displayProducts} highlightNutrient={selectedNutrient} onAddClick={onAddProductClick} onClick={onProductClick}/>
        </Column>
        <Column>
          <SectionTitle>
            SELECTED:
            <Spacer />
            <EmojiButton onClick={onUploadClick}>⬆️</EmojiButton>
            <EmojiButton onClick={onDownloadClick}>⬇️</EmojiButton>
            <EmojiButton onClick={onCartClick}>🛒</EmojiButton>
          </SectionTitle>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sectionsList" key="sectionList">
              {(provided, snapshot) => (
                <ProductDosesContainer ref={provided.innerRef} {...provided.droppableProps}>
                  {sectionNames ? sectionNames.filter(sectionExists).map((s: string, index: number) => 
                    (<Draggable key={s} draggableId={s} isDragDisabled={s === '_default'} index={index}>
                      {(provided, snapshot) => (
                        <ProductDosesList
                          innerRef={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          name={s}
                          isSelected={s === selectedSection}
                          isCollapsed={collapsedSections.includes(s)}
                          isDefault={s === DEFAULT_SECTION_TITLE}
                          checked={selectedSections.includes(s)}
                          productDoses={sections[s]}
                          onClick={() => setSelectedSection(s)}
                          onRemoveProductDoseClick={onRemoveProductDoseClick}
                          onCollapse={onSectionCollapseClick(s)}
                          onSave={onProductDosesSectionSave}
                          onCheckChange={onProductDoseCheckChange}
                          onProductDoseClick={onProductDoseClick}
                          onRemoveClick={onProductDoseListRemoveClick(s)}
                          onProductDoseValueChange={onProductDoseValueChange(s)}
                        />
                      )}
                    </Draggable>)
                  ) : null}
                  {provided.placeholder}
                </ProductDosesContainer>
              )}
            </Droppable>
          </DragDropContext>
        </Column>
      </Row>
      <Row style={{flex: 0.7}}>
        <Column style={{flex: 1.7}}>
          <SectionTitle>REQUIRED (Man 32):</SectionTitle>
          {/* @ts-ignore */} 
          <NutrientList nutrientDoses={nutrientsMan32} showNames/>
        </Column>
        <Column>
          <SectionTitle>SUPPLIED:</SectionTitle>
          <NutrientList
            nutrientDoses={allProductNutrientDoses}
            onNutrientClick={onNutrientClick}
          />
        </Column>
        <Column>
          <SectionTitle>MISSING:</SectionTitle>
          {/* @ts-ignore */} 
          <NutrientList nutrientDoses={missing} optimalNutrientDoses={nutrientsMan32}/>
        </Column>
      </Row>
      <Modal isOpen={!!selectedProduct} onClickAway={() => setSelectedProduct(undefined)}>
         {selectedProduct ? <ProductInfo product={selectedProduct} onDelete={isCustomProduct(selectedProduct) ? onCustomProductDelete : undefined}/> : null}
      </Modal>
      <Modal isOpen={isShowingAddProduct} onClickAway={() => setIsShowingAddProduct(false)}>
        <AddProductForm onSave={onCustomProductSave} onCancel={() => setIsShowingAddProduct(false)} />
      </Modal>
      <Modal isOpen={isShowingProductSources} onClickAway={() => setIsShowingProductSources(false)}>
        <ProductSourcesModal
          enabledSourceIds={activeProductSources}
          cacheRevision={databaseRevision}
          onSave={onProductSourcesSave}
          onCancel={() => setIsShowingProductSources(false)}
        />
      </Modal>
      <Modal isOpen={isShowingSearchFilters} onClickAway={() => setIsShowingSearchFilters(false)}>
        <SearchResultFiltersModal
          enabledSourceIds={activeProductSources}
          resultSourceFilterIds={activeResultSourceFilters}
          onSave={onSearchFiltersSave}
          onCancel={() => setIsShowingSearchFilters(false)}
        />
      </Modal>
      <Modal isOpen={isShowingCart} onClickAway={onCartClick}>
          <Cart productDoses={allSectionsProductDoses}/>
      </Modal>
      <Modal isOpen={selectedSuppliedNutrient} onClickAway={() => setSelectedSuppliedNutrient(undefined)}>
          <SuppliedNutrientsBreakdown nutrient={selectedSuppliedNutrient} doses={getSortedProductDoses(selectedSuppliedNutrient)}/>
      </Modal>
      {fetchingDatabase || (syncFailed && !syncErrorDismissed) ? (
        <FetchingDatabase
          message={fetchProgress}
          failed={syncFailed}
          onDismiss={() => setSyncErrorDismissed(true)}
        />
      ) : null}
    </AppContainer>
  );
}

export default App;
