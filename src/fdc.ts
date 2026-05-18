import { NutrientDose, Product, Nutrient, NutrientUnit, Micronutrient, Macronutrient, NutrientAmount } from "./types/nutrient"
import {
	ProductSourceDefinition,
	ProductSourceParser,
	getProductSource,
} from "./productSources"
import {
	ensureProductSourceStorageReady,
	loadSourceProducts,
	saveSourceProducts,
	hasSourceCache,
	needsSourceDownload,
	getCachedSourceIds,
} from "./productSourceDb"

export type { SourceCacheStatus } from "./productSourceDb"
export { getSourceCacheStatus } from "./productSourceDb"

const foodNutrientToMicronutrient: { [key: string]: Micronutrient } = {
	'Vitamin A, RAE': Micronutrient.VitaminA,
	'Thiamin': Micronutrient.VitaminB1,
	'Riboflavin': Micronutrient.VitaminB2,
	'Niacin': Micronutrient.VitaminB3,
	'Pantothenic acid': Micronutrient.VitaminB5,
	'vitamin b-6': Micronutrient.VitaminB6,
	'Biotin': Micronutrient.VitaminB7,
	'Folate': Micronutrient.VitaminB9,
	'Vitamin B-12': Micronutrient.VitaminB12,
	'vitamin c': Micronutrient.VitaminC,
	'Vitamin E': Micronutrient.VitaminE,
	'Vitamin K': Micronutrient.VitaminK,
	'Calcium': Micronutrient.Calcium,
	'Copper': Micronutrient.Copper,
	'Iodine': Micronutrient.Iodine,
	'Iron': Micronutrient.Iron,
	'Magnesium': Micronutrient.Magnesium,
	'Manganese': Micronutrient.Manganese,
	'Molybdenum': Micronutrient.Molybdenum,
	'Phosphorus': Micronutrient.Phosphorus,
	'Potassium': Micronutrient.Potassium,
	'Sodium': Micronutrient.Sodium,
	'Selenium': Micronutrient.Selenium,
	'Zinc': Micronutrient.Zinc,
	'Chromium': Micronutrient.Chromium,
	'Fiber': Micronutrient.Fiber,
}

const foodNutrientToMacronutrient: { [key: string]: Macronutrient } = {
	'protein': Macronutrient.Protein,
	'fat': Macronutrient.Fat,
	'carbohydrate': Macronutrient.Carbohydrate,
}

function nutrientNameToEnum(name: string): Nutrient | undefined {
	if (!name) return undefined
	const lowercaseName = name.toLowerCase()
	const microKey = Object.keys(foodNutrientToMicronutrient).find(key => lowercaseName.includes(key.toLowerCase()))
	if (microKey) {
		return foodNutrientToMicronutrient[microKey]
	}

	const macroKey = Object.keys(foodNutrientToMacronutrient).find(key => lowercaseName.includes(key.toLowerCase()))
	if (macroKey) {
		return foodNutrientToMacronutrient[macroKey]
	}

	return undefined
}

const unitNameToNutritionUnit: { [key: string]: NutrientUnit } = {
	'mg': NutrientUnit.MG,
	'µg': NutrientUnit.MCG,
	'mcg': NutrientUnit.MCG,
	'g': NutrientUnit.G,
}

function nutrientUnit(stringUnit: string, name: string): NutrientUnit | undefined {
	if (name.includes('RAE')) return NutrientUnit.MCG_RAE
	if (name.includes('Niacin')) return NutrientUnit.MG_NE
	if (name.includes('Folate')) return NutrientUnit.MCG_DFE
	return unitNameToNutritionUnit[stringUnit]
}

function nutrientAmount(value: number, stringUnit: string, name: string): NutrientAmount | undefined {
	const unit = nutrientUnit(stringUnit, name)
	if (!unit || value === 0) return undefined

	return { value, unit }
}

function parseNutrientDose(food: any): NutrientDose | undefined {
	const nutrient = nutrientNameToEnum(food.nutrient.name)
	const amount = nutrientAmount(food.amount, food.nutrient.unitName, food.nutrient.name)

	if (!nutrient || !amount) return undefined
	if (amount!.value <= 0) return undefined

	return {
		nutrient,
		amount,
	}
}

function isUniqueNutrientDose(nd: NutrientDose, index: number, array: NutrientDose[]) {
	if (!nd) return false
	const ndIndex = array.findIndex(dose => dose?.nutrient === nd.nutrient)
	return index === ndIndex
}

function parseFood(food: any, idPrefix: string): Product {
	return {
		id: `${idPrefix}:${food.fdcId}`,
		name: food.description,
		nutrientsPer100g: food.foodNutrients.map(parseNutrientDose).filter(isUniqueNutrientDose),
	}
}

function getCategoryDescription(food: any): string {
	const wweia = food.wweiaFoodCategory?.wweiaFoodCategoryDescription
	if (wweia) return String(wweia).toLowerCase()
	const foundation = food.foodCategory?.description || food.foodCategory
	return String(foundation || "").toLowerCase()
}

function isExcludedFoodCategory(category: string) {
	return category.includes("nutrition")
		|| category.includes("juice")
		|| category.includes("drink")
		|| category.includes("candy")
		|| category.includes("chips")
		|| category.includes("baby food")
		|| category.includes("cookies")
		|| category.includes("not included in a food category")
}

function isBasicSurveyFood(f: any) {
	return (f.inputFoods?.length ?? 0) <= 1
		&& !isExcludedFoodCategory(getCategoryDescription(f))
}

function isBasicFoundationFood(f: any) {
	return !isExcludedFoodCategory(getCategoryDescription(f))
}

function hasUsableNutrients(product: Product) {
	return (product.nutrientsPer100g?.length ?? 0) > 0
		|| (product.nutrientsPerServing?.length ?? 0) > 0
}

function getProductNutrientDose(product: Product, nutrient: Nutrient): NutrientDose | undefined {
	return product.nutrientsPer100g?.find(n => n.nutrient === nutrient)
		|| product.nutrientsPerServing?.find(n => n.nutrient === nutrient)
}

function compareProductsByNutrient(nutrient: Nutrient) {
	return function compareProducts(a: Product, b: Product) {
		const aValue = getProductNutrientDose(a, nutrient)?.amount.value || 0
		const bValue = getProductNutrientDose(b, nutrient)?.amount.value || 0

		return bValue - aValue
	}
}

function filterHasNutrient(nutrient: Nutrient) {
	return function hasNutrient(product: Product) {
		return getProductNutrientDose(product, nutrient) !== undefined
	}
}

function extractFoodsFromJson(json: any, parser: ProductSourceParser): any[] {
	if (parser === "fdc-survey") {
		return json.SurveyFoods || []
	}
	if (parser === "fdc-foundation") {
		return json.FoundationFoods || []
	}
	return []
}

export type FetchProgressCallback = (message: string) => void

export class ProductsDatabase {
	foodProducts: Product[]
	isLoaded: boolean
	enabledSourceIds: string[]
	private storageReady: Promise<void>

	constructor() {
		this.foodProducts = []
		this.isLoaded = false
		this.enabledSourceIds = []
		this.storageReady = ensureProductSourceStorageReady()
	}

	private async ensureStorage() {
		await this.storageReady
	}

	async isSourceCached(sourceId: string): Promise<boolean> {
		await this.ensureStorage()
		return hasSourceCache(sourceId)
	}

	async getCachedSourceIds(): Promise<string[]> {
		await this.ensureStorage()
		return getCachedSourceIds()
	}

	async mergeEnabledSources(enabledSourceIds: string[]) {
		await this.ensureStorage()
		const seenIds = new Set<string>()
		const merged: Product[] = []

		for (const sourceId of enabledSourceIds) {
			const products = await loadSourceProducts(sourceId)
			for (const product of products) {
				if (!product.id || seenIds.has(product.id)) continue
				seenIds.add(product.id)
				merged.push(product)
			}
		}

		this.foodProducts = merged
		this.enabledSourceIds = enabledSourceIds
		this.isLoaded = true
	}

	clearMerged() {
		this.foodProducts = []
		this.enabledSourceIds = []
		this.isLoaded = true
	}

	async fetchSource(source: ProductSourceDefinition, onProgress?: FetchProgressCallback) {
		onProgress?.(`Downloading ${source.name}…`)
		const response = await fetch(source.file)
		if (!response.ok) {
			throw new Error(`Failed to download ${source.name}`)
		}

		onProgress?.(`Parsing ${source.name}…`)
		const json = await response.json()

		let products: Product[]
		if (source.parser === "paleo-robbie" || source.parser === "blueprint") {
			products = Array.isArray(json) ? json : (json.products || [])
		} else if (source.parser === "fdc-foundation") {
			const foods = extractFoodsFromJson(json, source.parser)
			products = foods
				.filter(isBasicFoundationFood)
				.map(food => parseFood(food, "fdc-foundation"))
				.filter(hasUsableNutrients)
		} else {
			const foods = extractFoodsFromJson(json, source.parser)
			products = foods
				.filter(isBasicSurveyFood)
				.map(food => parseFood(food, "fdc-survey"))
				.filter(hasUsableNutrients)
		}

		onProgress?.(`Saving ${source.name} to browser storage…`)
		await saveSourceProducts(source.id, products)
		onProgress?.(`Saved ${source.name} (${products.length.toLocaleString()} products)`)
		return products
	}

	async syncSources(
		enabledSourceIds: string[],
		onProgress?: FetchProgressCallback,
		options?: { force?: boolean }
	): Promise<{ downloaded: boolean }> {
		await this.ensureStorage()
		void options

		const validIds = enabledSourceIds.filter(id => !!getProductSource(id))

		if (validIds.length === 0) {
			this.clearMerged()
			onProgress?.("No product databases enabled.")
			return { downloaded: false }
		}

		const missingIds: string[] = []
		for (const sourceId of validIds) {
			if (await needsSourceDownload(sourceId)) {
				missingIds.push(sourceId)
			}
		}

		let downloaded = false
		for (const sourceId of missingIds) {
			const source = getProductSource(sourceId)!
			await this.fetchSource(source, onProgress)
			downloaded = true
		}

		onProgress?.("Merging product databases…")
		await this.mergeEnabledSources(validIds)
		onProgress?.(`Ready — ${this.foodProducts.length.toLocaleString()} products from ${validIds.length} source(s).`)

		return { downloaded }
	}

	getFood(name: string) {
		if (!name) return undefined
		const lowerCaseName = name.toLowerCase()
		return this.foodProducts.filter(f => f.name.toLowerCase().includes(lowerCaseName))
	}

	getFoodsWithMost(nutrient: Nutrient, limit = 20): Product[] {
		const products = [...this.foodProducts].filter(filterHasNutrient(nutrient))
		products.sort(compareProductsByNutrient(nutrient))
		return products.slice(0, limit)
	}
}

const productsDatabase = new ProductsDatabase()
export default productsDatabase
