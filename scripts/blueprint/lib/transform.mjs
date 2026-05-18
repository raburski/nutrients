/**
 * Maps Blueprint raw scrape records to app Product JSON.
 */

const Macronutrient = {
	Carbohydrate: "Carbohydrate",
	Protein: "Protein",
	Fat: "Fat",
}

const Micronutrient = {
	VitaminA: "Vitamin A",
	VitaminB1: "Thiamin (Vitamin B1)",
	VitaminB2: "Riboflavin (Vitamin B2)",
	VitaminB3: "Niacin (Vitamin B3)",
	VitaminB5: "Pantothenic Acid (Vitamin B5)",
	VitaminB6: "Vitamin B6",
	VitaminB7: "Biotin (Vitamin B7)",
	VitaminB9: "Folate / Folic Acid (Vitamin B9)",
	VitaminB12: "Vitamin B12",
	VitaminC: "Vitamin C",
	VitaminD: "Vitamin D",
	VitaminE: "Vitamin E",
	VitaminK: "Vitamin K",
	Calcium: "Calcium",
	Copper: "Copper",
	Iodine: "Iodine",
	Iron: "Iron",
	Magnesium: "Magnesium",
	Manganese: "Manganese",
	Phosphorus: "Phosphorus",
	Potassium: "Potassium",
	Selenium: "Selenium",
	Sodium: "Sodium",
	Zinc: "Zinc",
	Fiber: "Fiber",
}

const NutrientUnit = {
	G: "g",
	MG: "mg",
	MCG: "mcg",
	MCG_DFE: "mcg DFE",
	MCG_RAE: "mcg RAE",
}

const SKIP_LINES = new Set([
	"Nutrition Facts",
	"Supplement Facts",
	"Serving Size",
	"Servings Per Container",
	"Amount Per",
	"Serving",
	"% Daily",
	"Value",
	"Calories",
])

const NUTRIENT_RULES = [
	{ pattern: /vitamin\s*a\b|retinol/i, nutrient: Micronutrient.VitaminA, unit: NutrientUnit.MCG_RAE },
	{ pattern: /thiamin|vitamin\s*b\s*1\b/i, nutrient: Micronutrient.VitaminB1, unit: NutrientUnit.MG },
	{ pattern: /riboflavin|vitamin\s*b\s*2\b/i, nutrient: Micronutrient.VitaminB2, unit: NutrientUnit.MG },
	{ pattern: /niacin|vitamin\s*b\s*3\b/i, nutrient: Micronutrient.VitaminB3, unit: NutrientUnit.MG },
	{ pattern: /pantothenic|vitamin\s*b\s*5\b/i, nutrient: Micronutrient.VitaminB5, unit: NutrientUnit.MG },
	{ pattern: /vitamin\s*b\s*6\b|pyridoxine/i, nutrient: Micronutrient.VitaminB6, unit: NutrientUnit.MG },
	{ pattern: /biotin|vitamin\s*b\s*7\b/i, nutrient: Micronutrient.VitaminB7, unit: NutrientUnit.MCG },
	{ pattern: /folate|folic|vitamin\s*b\s*9\b/i, nutrient: Micronutrient.VitaminB9, unit: NutrientUnit.MCG_DFE },
	{ pattern: /vitamin\s*b\s*12\b|methylcobalamin|cobalamin/i, nutrient: Micronutrient.VitaminB12, unit: NutrientUnit.MCG },
	{ pattern: /vitamin\s*c|ascorbic/i, nutrient: Micronutrient.VitaminC, unit: NutrientUnit.MG },
	{ pattern: /vitamin\s*d|cholecalciferol/i, nutrient: Micronutrient.VitaminD, unit: NutrientUnit.MCG },
	{ pattern: /vitamin\s*e|tocopherol/i, nutrient: Micronutrient.VitaminE, unit: NutrientUnit.MG },
	{ pattern: /vitamin\s*k/i, nutrient: Micronutrient.VitaminK, unit: NutrientUnit.MCG },
	{ pattern: /calcium/i, nutrient: Micronutrient.Calcium, unit: NutrientUnit.MG },
	{ pattern: /copper/i, nutrient: Micronutrient.Copper, unit: NutrientUnit.MG },
	{ pattern: /iodine|iodide/i, nutrient: Micronutrient.Iodine, unit: NutrientUnit.MCG },
	{ pattern: /iron/i, nutrient: Micronutrient.Iron, unit: NutrientUnit.MG },
	{ pattern: /magnesium/i, nutrient: Micronutrient.Magnesium, unit: NutrientUnit.MG },
	{ pattern: /manganese/i, nutrient: Micronutrient.Manganese, unit: NutrientUnit.MG },
	{ pattern: /phosphorus/i, nutrient: Micronutrient.Phosphorus, unit: NutrientUnit.MG },
	{ pattern: /potassium/i, nutrient: Micronutrient.Potassium, unit: NutrientUnit.MG },
	{ pattern: /selenium/i, nutrient: Micronutrient.Selenium, unit: NutrientUnit.MCG },
	{ pattern: /sodium/i, nutrient: Micronutrient.Sodium, unit: NutrientUnit.MG },
	{ pattern: /zinc/i, nutrient: Micronutrient.Zinc, unit: NutrientUnit.MG },
	{ pattern: /dietary fiber|fiber|fibre/i, nutrient: Micronutrient.Fiber, unit: NutrientUnit.G },
	{ pattern: /total carbohydrate|carbohydrate/i, nutrient: Macronutrient.Carbohydrate, unit: NutrientUnit.G },
	{ pattern: /total fat|^fat$/i, nutrient: Macronutrient.Fat, unit: NutrientUnit.G },
	{ pattern: /protein/i, nutrient: Macronutrient.Protein, unit: NutrientUnit.G },
]

function isPrimaryAmountLine(text) {
	const trimmed = text.trim()
	return /^(\d+(?:\.\d+)?)\s*(mg|mcg|g|iu)\b/i.test(trimmed)
		|| /^(\d+(?:\.\d+)?)(g)$/i.test(trimmed)
}

function isPercentLine(text) {
	return /^\d+(\.\d+)?%/.test(text) || text === "†" || text.endsWith("**")
}

function parseAmountLine(line, fallbackUnit) {
	const normalized = line.replace(/\s+/g, " ").trim()
	const dfeMatch = normalized.match(/(\d+(?:\.\d+)?)\s*mcg\s*dfe/i)
	if (dfeMatch) {
		return { value: parseFloat(dfeMatch[1]), unit: NutrientUnit.MCG_DFE }
	}

	const unitMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|g|iu)\b/i)
	if (unitMatch) {
		const unitToken = unitMatch[2].toLowerCase()
		const unit = unitToken === "iu"
			? NutrientUnit.MCG
			: unitToken === "mg"
				? NutrientUnit.MG
				: unitToken === "mcg"
					? NutrientUnit.MCG
					: NutrientUnit.G
		return { value: parseFloat(unitMatch[1]), unit }
	}

	const compactMatch = normalized.match(/^(\d+(?:\.\d+)?)(g)$/i)
	if (compactMatch) {
		return { value: parseFloat(compactMatch[1]), unit: NutrientUnit.G }
	}

	if (/^\d+(?:\.\d+)?$/.test(normalized) && fallbackUnit) {
		return { value: parseFloat(normalized), unit: fallbackUnit }
	}

	return null
}

function findFactsStartIndex(texts) {
	for (let i = 0; i < texts.length; i++) {
		const line = texts[i]
		if (SKIP_LINES.has(line)) continue
		if (isPrimaryAmountLine(line)) continue
		if (isPercentLine(line)) continue
		if (/^\d+$/.test(line)) continue
		if (/scoop|capsule|serving|container/i.test(line)) continue
		if (line.length < 2) continue
		return i
	}
	return texts.length
}

export function parseSupplementFactRows(texts) {
	const rows = []
	let i = findFactsStartIndex(texts)

	while (i < texts.length) {
		const line = texts[i]
		if (line.includes("Daily Value not established")) {
			i++
			continue
		}
		if (SKIP_LINES.has(line)) {
			i++
			continue
		}

		const nameParts = []
		while (i < texts.length) {
			const current = texts[i]
			if (isPrimaryAmountLine(current)) break
			if (isPercentLine(current) && nameParts.length > 0) break
			if (SKIP_LINES.has(current)) {
				i++
				continue
			}
			if (/^\d+$/.test(current) && nameParts.length === 0) {
				i++
				continue
			}
			nameParts.push(current)
			i++
		}

		if (i >= texts.length || nameParts.length === 0) {
			if (i >= texts.length) break
			i++
			continue
		}

		const amountLine = texts[i]
		if (!isPrimaryAmountLine(amountLine)) {
			i++
			continue
		}
		i++

		if (i < texts.length && isPercentLine(texts[i])) {
			i++
		}

		rows.push({
			name: nameParts.join(" "),
			amountLine,
		})
	}

	return rows
}

function rowToNutrientDose(row) {
	const name = row.name
	const rule = NUTRIENT_RULES.find(entry => entry.pattern.test(name))
	if (!rule) return null

	const amount = parseAmountLine(row.amountLine, rule.unit)
	if (!amount || amount.value <= 0) return null

	return {
		nutrient: rule.nutrient,
		amount,
	}
}

export function nutritionTextsToDoses(texts) {
	const rows = parseSupplementFactRows(texts)
	const doses = []
	const seen = new Set()

	for (const row of rows) {
		const dose = rowToNutrientDose(row)
		if (!dose || seen.has(dose.nutrient)) continue
		seen.add(dose.nutrient)
		doses.push(dose)
	}

	return doses
}

export function rawRecordToProduct(record) {
	const shopify = record.shopify
	const panel = record.nutritionPanel
	if (!shopify?.id || !shopify?.title || !panel?.texts?.length) return null

	const doses = nutritionTextsToDoses(panel.texts)
	if (doses.length === 0) return null

	const handle = shopify.handle
	return {
		id: `blueprint:${shopify.id}`,
		name: shopify.title,
		url: record.url || `https://blueprint.bryanjohnson.com/products/${handle}`,
		nutrientsPerServing: doses,
	}
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
