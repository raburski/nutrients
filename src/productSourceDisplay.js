import { isCustomProduct } from "./customProducts"
import {
	CURATED_PRODUCT_FILTER_ID,
	CUSTOM_PRODUCT_FILTER_ID,
	PRODUCT_SOURCES,
} from "./productSources"

const SOURCE_BY_ID = Object.fromEntries(PRODUCT_SOURCES.map(source => [source.id, source]))

export function getFaviconUrl(domain) {
	if (!domain) return undefined
	return `https://favicon.im/${domain}`
}

export function getProductSourceId(product) {
	const id = product?.id || ""
	if (id.startsWith("blueprint:")) return "blueprint"
	if (id.startsWith("paleo-robbie:")) return "paleo-robbie"
	if (id.startsWith("fdc-foundation:")) return "fdc-foundation"
	if (id.startsWith("fdc-survey:")) return "fdc-survey"
	if (id.startsWith("fdc:")) return "fdc-survey"
	if (id.startsWith("custom:")) return undefined
	if (product.url?.includes("blueprint.bryanjohnson.com")) return "blueprint"
	if (product.url?.includes("paleorobbie.com")) return "paleo-robbie"
	return undefined
}

export function getProductSourceDisplay(product) {
	const sourceId = getProductSourceId(product)
	if (!sourceId) return undefined
	const source = SOURCE_BY_ID[sourceId]
	if (!source) return undefined
	return {
		sourceId,
		name: source.name,
		faviconUrl: getFaviconUrl(source.faviconDomain),
	}
}

export function getProductListFilterId(product) {
	if (isCustomProduct(product)) return CUSTOM_PRODUCT_FILTER_ID
	const sourceId = getProductSourceId(product)
	if (sourceId) return sourceId
	return CURATED_PRODUCT_FILTER_ID
}
