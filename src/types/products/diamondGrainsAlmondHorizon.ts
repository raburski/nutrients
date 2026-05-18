import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product } from "../nutrient"

// Per 100g from 38g label serving (Eat This Much, Diamond Grains Two Way granola line)
const nutrientsPer100g: NutrientDose[] = [
	{ nutrient: Macronutrient.Fat, amount: { value: 15.8, unit: NutrientUnit.G } },
	{ nutrient: Macronutrient.Carbohydrate, amount: { value: 52.6, unit: NutrientUnit.G } },
	{ nutrient: Macronutrient.Protein, amount: { value: 13.2, unit: NutrientUnit.G } },
	{ nutrient: Micronutrient.Fiber, amount: { value: 7.9, unit: NutrientUnit.G } },
	{ nutrient: Micronutrient.Calcium, amount: { value: 137, unit: NutrientUnit.MG } },
	{ nutrient: Micronutrient.Iron, amount: { value: 7.9, unit: NutrientUnit.MG } },
]

export const diamondGrainsAlmondHorizon: Product = {
	id: "diamondGrainsAlmondHorizon500g",
	name: "Diamond Grains Two Way Almond Horizon 500g",
	url: "https://gourmetmarketthailand.com/en/diamondgrains_almond_500g_8859114901022",
	nutrientsPer100g,
}

export default diamondGrainsAlmondHorizon
