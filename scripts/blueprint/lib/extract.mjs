export function extractNutritionPanel(html) {
	const match = html.match(/<template data-variant-id="(\d+)" data-nutrition-panel>([\s\S]*?)<\/template>/)
	if (!match) return null

	const texts = [...match[2].matchAll(/<tspan[^>]*>([^<]*)<\/tspan>/g)]
		.map(part => part[1].trim())
		.filter(Boolean)

	return {
		variantId: match[1],
		texts,
	}
}

export async function fetchShopifyProducts(productsJsonUrl, userAgent) {
	const response = await fetch(productsJsonUrl, {
		headers: { "User-Agent": userAgent, Accept: "application/json" },
	})
	if (!response.ok) {
		throw new Error(`Failed to fetch product list: HTTP ${response.status}`)
	}
	const json = await response.json()
	return json.products || []
}
