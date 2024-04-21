import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 27.1, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 7.0, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 56.6, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.12, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'studentska',
    name: 'Studentska',
    nutrientsPer100g: nutrients
}

export default product