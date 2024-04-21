import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 30, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 6, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 58, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 2.5, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.25, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'wedelMleczna',
    name: 'Wedel Czekolada Mleczna',
    nutrientsPer100g: nutrients
}

export default product