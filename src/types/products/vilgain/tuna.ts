import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 4.6, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 24, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 0, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 1.5, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'vilgainCannedTuna',
    name: 'Vilgain Canned Tuna',
    url: 'https://vilgain.pl/vilgain-tunczyk-w-sosie-wlasnym/6x33874',
    nutrientsPer100g: nutrients
}

export default product