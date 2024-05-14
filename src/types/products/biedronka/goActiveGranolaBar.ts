import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 30, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 27, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 14, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 21, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'biedronkaGoActiveGranolaBar',
    name: 'GoActive Granola Bar',
    nutrientsPer100g: nutrients
}

export default product