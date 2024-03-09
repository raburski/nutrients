import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const cacaoNutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 11, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 20, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 33, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 28, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.1, unit: NutrientUnit.G } },
]

export const vilgainCacaoPowderProduct: Product = {
    id: 'vilgainCacaoPowder',
    name: 'Vilgain Cacao Powder',
    nutrientsPer100g: cacaoNutrients
}

export default vilgainCacaoPowderProduct