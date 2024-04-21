import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 17, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 25, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 23, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.2, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 21, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'biedronkaGoActiveBarOrzech',
    name: 'GoActive ONLY Peanut Bar',
    nutrientsPer100g: nutrients
}

export default product