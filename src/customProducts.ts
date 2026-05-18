import { Macronutrient, Micronutrient, Nutrient, NutrientDose, NutrientUnit, Product } from "./types/nutrient"

export const CUSTOM_PRODUCT_ID_PREFIX = "custom:"

export function isCustomProduct(product: Product): boolean {
	return !!product.id?.startsWith(CUSTOM_PRODUCT_ID_PREFIX)
}

export interface CustomProductMacros {
	carbohydrate: number
	protein: number
	fat: number
	fiber?: number
}

export function createCustomProduct(name: string, macros: CustomProductMacros): Product {
	const trimmedName = name.trim()
	const nutrientsPer100g: NutrientDose[] = [
		{ nutrient: Macronutrient.Carbohydrate, amount: { value: macros.carbohydrate, unit: NutrientUnit.G } },
		{ nutrient: Macronutrient.Protein, amount: { value: macros.protein, unit: NutrientUnit.G } },
		{ nutrient: Macronutrient.Fat, amount: { value: macros.fat, unit: NutrientUnit.G } },
	]
	if (macros.fiber !== undefined && !Number.isNaN(macros.fiber)) {
		nutrientsPer100g.push({ nutrient: Micronutrient.Fiber, amount: { value: macros.fiber, unit: NutrientUnit.G } })
	}
	return {
		id: `${CUSTOM_PRODUCT_ID_PREFIX}${Date.now()}`,
		name: trimmedName,
		nutrientsPer100g,
	}
}

export function filterProductsByName(products: Product[], phrase: string): Product[] {
	const lower = phrase.trim().toLowerCase()
	if (!lower) return products
	return products.filter(p => p.name.toLowerCase().includes(lower))
}

export function filterProductsByNutrient(products: Product[], nutrient: Nutrient): Product[] {
	return products.filter(p =>
		p.nutrientsPer100g?.some(n => n.nutrient === nutrient)
		|| p.nutrientsPerServing?.some(n => n.nutrient === nutrient)
	)
}

export function getProductNutrientDose(product: Product, nutrient: Nutrient): NutrientDose | undefined {
	return product.nutrientsPer100g?.find(n => n.nutrient === nutrient)
		|| product.nutrientsPerServing?.find(n => n.nutrient === nutrient)
}
