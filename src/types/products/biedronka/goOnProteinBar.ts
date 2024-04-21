import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 16, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 20, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 53, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 1, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 0.8, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'zabkaGoOnProteinBar',
    name: 'GoOn Protein Cookies&Carmel Bar',
    nutrientsPer100g: nutrients
}

export default product