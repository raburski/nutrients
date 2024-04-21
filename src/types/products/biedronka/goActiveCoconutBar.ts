import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 15, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 32, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 30, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.1, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 9.3, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'biedronkaGoActiveBarCoconut',
    name: 'GoActive Coconut Bar',
    nutrientsPer100g: nutrients
}

export default product