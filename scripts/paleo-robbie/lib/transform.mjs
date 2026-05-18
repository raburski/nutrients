/**
 * Maps persisted Paleo Robbie raw scrape records to app Product JSON.
 * Edit this file and re-run `npm run build:paleo-robbie` — no re-scrape needed.
 */

const Macronutrient = {
	Carbohydrate: "Carbohydrate",
	Protein: "Protein",
	Fat: "Fat",
}

const Micronutrient = {
	Fiber: "Fiber",
}

const NutrientUnit = {
	G: "g",
}

function parseServingGrams(uomName) {
	if (!uomName) return null
	const match = uomName.match(/(\d+(?:\.\d+)?)\s*g/i)
	return match ? parseFloat(match[1]) : null
}

function isPer100gBasis(uomName) {
	if (!uomName) return false
	const lower = uomName.toLowerCase()
	return lower.includes("100") && lower.includes("g")
}

function scaleValue(value, factor) {
	if (value === null || value === undefined || Number.isNaN(value)) return null
	return Math.round(value * factor * 1000) / 1000
}

function nutritionToDoses(nutrition, scaleFactor = 1) {
	if (!nutrition) return []

	const doses = []
	const carb = scaleValue(nutrition.carbohydrt_g, scaleFactor)
	const protein = scaleValue(nutrition.protein_g, scaleFactor)
	const fat = scaleValue(nutrition.lipid_tot_g, scaleFactor)
	const fiber = scaleValue(nutrition.fiber_td_g, scaleFactor)

	if (carb !== null) {
		doses.push({ nutrient: Macronutrient.Carbohydrate, amount: { value: carb, unit: NutrientUnit.G } })
	}
	if (protein !== null) {
		doses.push({ nutrient: Macronutrient.Protein, amount: { value: protein, unit: NutrientUnit.G } })
	}
	if (fat !== null) {
		doses.push({ nutrient: Macronutrient.Fat, amount: { value: fat, unit: NutrientUnit.G } })
	}
	if (fiber !== null) {
		doses.push({ nutrient: Micronutrient.Fiber, amount: { value: fiber, unit: NutrientUnit.G } })
	}

	return doses
}

export function rawRecordToProduct(record) {
	const data = record.data
	if (!data || !data.name) return null

	const nutrition = data.nutrition_id
	if (!nutrition) return null

	const uomName = nutrition.nutrition_uom_id?.name || ""
	const slug = record.slug
	const productId = data.id ?? record.productId

	const product = {
		id: `paleo-robbie:${productId}`,
		name: data.name,
		url: record.url || `https://paleorobbie.com/grocery_details/${slug}`,
	}

	if (isPer100gBasis(uomName)) {
		const doses = nutritionToDoses(nutrition, 1)
		if (doses.length === 0) return null
		product.nutrientsPer100g = doses
		return product
	}

	const servingGrams = parseServingGrams(uomName)
	if (servingGrams && servingGrams > 0) {
		const factor = 100 / servingGrams
		const doses = nutritionToDoses(nutrition, factor)
		if (doses.length === 0) return null
		product.nutrientsPer100g = doses
		return product
	}

	const doses = nutritionToDoses(nutrition, 1)
	if (doses.length === 0) return null
	product.nutrientsPerServing = doses
	return product
}

export function buildProductsFromRawRecords(records) {
	const products = []
	const seenIds = new Set()

	for (const record of records) {
		const product = rawRecordToProduct(record)
		if (!product || seenIds.has(product.id)) continue
		seenIds.add(product.id)
		products.push(product)
	}

	products.sort((a, b) => a.name.localeCompare(b.name))
	return products
}
