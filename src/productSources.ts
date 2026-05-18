export type ProductSourceParser = "fdc-survey" | "fdc-foundation" | "paleo-robbie"

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
]

export const DEFAULT_ENABLED_SOURCE_IDS = PRODUCT_SOURCES.map(source => source.id)

export const ENABLED_SOURCES_STORAGE_KEY = "enabledProductSources"

export function getProductSource(id: string): ProductSourceDefinition | undefined {
	return PRODUCT_SOURCES.find(source => source.id === id)
}
