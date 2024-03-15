import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 7.5, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 54, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 14, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 11, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.01, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.VitaminB3, amount: { value: 4.3, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB1, amount: { value: 0.33, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Iron, amount: { value: 4.7, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Iodine, amount: { value: 20, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.Potassium, amount: { value: 414, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Magnesium, amount: { value: 142, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Phosphorus, amount: { value: 471, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Selenium, amount: { value: 12, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.Zinc, amount: { value: 3.6, unit: NutrientUnit.MG } },
]

export const vilgainOatmeal: Product = {
    id: 'vilgainOatmeal',
    name: 'Vilgain Oatmeal',
    url: 'https://vilgain.pl/vilgain-platki-owsiane-blyskawiczne/4x32076',
    nutrientsPer100g: nutrients
}

export default vilgainOatmeal