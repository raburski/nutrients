import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 0.1, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 10, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 4.5, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.1, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 0, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'biedronkaGoActiveProteinDrink',
    name: 'GoActive Protein Drink',
    nutrientsPer100g: nutrients
}

export default product