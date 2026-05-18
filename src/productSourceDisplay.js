import { PRODUCT_SOURCES } from "./productSources"

const SOURCE_BY_ID = Object.fromEntries(PRODUCT_SOURCES.map(source => [source.id, source]))

export function getFaviconUrl(domain) {
	if (!domain) return undefined
	return `https://favicon.im/${domain}`
}

export function getProductSourceId(product) {
	const id = product?.id || ""
	if (id.startsWith("paleo-robbie:")) return "paleo-robbie"
	if (id.startsWith("fdc-foundation:")) return "fdc-foundation"
	if (id.startsWith("fdc-survey:")) return "fdc-survey"
	if (id.startsWith("fdc:")) return "fdc-survey"
	if (id.startsWith("custom:")) return undefined
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
