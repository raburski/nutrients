import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 3.2, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 56, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 24.4, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 3.9, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.05, unit: NutrientUnit.G } },
]

export const vilgainCinamonPowderProduct: Product = {
    id: 'vilgainCinamonPowder',
    name: 'Vilgain Cinamon Powder',
    url: 'https://vilgain.pl/vilgain-cynamon-cejlonski-bio/mielona-150-g-37469',
    nutrientsPer100g: nutrients
}

export default vilgainCinamonPowderProduct