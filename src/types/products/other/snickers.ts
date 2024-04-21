import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 23, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 8.7, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 60, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.52, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'snickersBar',
    name: 'Snickers Bar',
    nutrientsPer100g: nutrients
}

export default product