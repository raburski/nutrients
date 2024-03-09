import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 12.8, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 27.5, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 24, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 54.5, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 300, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Potassium, amount: { value: 100, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Magnesium, amount: { value: 88, unit: NutrientUnit.MG } },
]

export const vilgainGreensMix: Product = {
    id: 'vilgainGreensMix',
    name: 'Vilgain Greens Mix',
    nutrientsPer100g: nutrients
}

export default vilgainGreensMix