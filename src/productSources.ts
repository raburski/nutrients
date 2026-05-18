export type ProductSourceParser = "fdc-survey" | "fdc-foundation" | "paleo-robbie" | "blueprint"

export interface ProductSourceDefinition {
	id: string
	name: string
	description: string
	file: string
	approximateSize: string
	parser: ProductSourceParser
	faviconDomain: string
}

export const PRODUCT_SOURCES: ProductSourceDefinition[] = [
	{
		id: "fdc-survey",
		name: "USDA FDC — Survey foods",
		description: "What We Eat in America survey foods (branded and common items).",
		file: "/fdc_database.json",
		approximateSize: "~65 MB",
		parser: "fdc-survey",
		faviconDomain: "fdc.nal.usda.gov",
	},
	{
		id: "fdc-foundation",
		name: "USDA FDC — Foundation foods",
		description: "Standard reference foods with detailed nutrient profiles.",
		file: "/fdc_database_foundation.json",
		approximateSize: "~13 MB",
		parser: "fdc-foundation",
		faviconDomain: "fdc.nal.usda.gov",
	},
	{
		id: "paleo-robbie",
		name: "Paleo Robbie",
		description: "Bangkok grocery catalog with macros from paleorobbie.com (built from local scrape).",
		file: "/paleo_robbie_products.json",
		approximateSize: "~1–3 MB",
		parser: "paleo-robbie",
		faviconDomain: "paleorobbie.com",
	},
	{
		id: "blueprint",
		name: "Blueprint Bryan Johnson",
		description: "Supplements and nutrition products from blueprint.bryanjohnson.com (built from local scrape).",
		file: "/blueprint_products.json",
		approximateSize: "~100 KB",
		parser: "blueprint",
		faviconDomain: "blueprint.bryanjohnson.com",
	},
]

export const DEFAULT_ENABLED_SOURCE_IDS = PRODUCT_SOURCES.map(source => source.id)

export const ENABLED_SOURCES_STORAGE_KEY = "enabledProductSources"

export const CURATED_PRODUCT_FILTER_ID = "curated"
export const CUSTOM_PRODUCT_FILTER_ID = "custom"

export interface SearchResultFilterOption {
	id: string
	name: string
	description: string
	faviconDomain?: string
	emoji?: string
}

export const SEARCH_RESULT_STATIC_FILTERS: SearchResultFilterOption[] = [
	{
		id: CURATED_PRODUCT_FILTER_ID,
		name: "Built-in catalog",
		description: "Products bundled with this app (supplements, staples, etc.).",
		emoji: "📋",
	},
	{
		id: CUSTOM_PRODUCT_FILTER_ID,
		name: "Custom products",
		description: "Products you added with the 📝 button.",
		emoji: "📝",
	},
]

export function getProductSource(id: string): ProductSourceDefinition | undefined {
	return PRODUCT_SOURCES.find(source => source.id === id)
}

export function getDefaultResultSourceFilters(enabledSourceIds: string[]): string[] {
	return [CURATED_PRODUCT_FILTER_ID, CUSTOM_PRODUCT_FILTER_ID, ...enabledSourceIds]
}

export function getSearchResultFilterOptions(enabledSourceIds: string[]): SearchResultFilterOption[] {
	const dynamic = enabledSourceIds
		.map(id => getProductSource(id))
		.filter((source): source is ProductSourceDefinition => !!source)
		.map(source => ({
			id: source.id,
			name: source.name,
			description: source.description,
			faviconDomain: source.faviconDomain,
		}))
	return [...SEARCH_RESULT_STATIC_FILTERS, ...dynamic]
}
