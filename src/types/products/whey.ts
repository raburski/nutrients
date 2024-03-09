import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../nutrient";

const wheyProtein: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 4.7, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Fat, amount: { value: 3, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 81.5, unit: NutrientUnit.G } },
]

export const wheyProduct: Product = {
    id: 'whey',
    name: 'Whey Protein',
    nutrientsPer100g: wheyProtein,
}

export default wheyProduct