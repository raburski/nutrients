import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 1.6, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 6.3, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 10.6, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.13, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'mullermilchProtein',
    name: 'Mullermilch Protein',
    nutrientsPer100g: nutrients
}

export default product