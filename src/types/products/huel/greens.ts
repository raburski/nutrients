import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

export const doses: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 4, unit: NutrientUnit.G }},
    { nutrient: Macronutrient.Protein, amount: { value: 0.9, unit: NutrientUnit.G }},
    { nutrient: Macronutrient.Fat, amount: { value: 0.2, unit: NutrientUnit.G }},
    { nutrient: Micronutrient.Fiber, amount: { value: 1, unit: NutrientUnit.G }},

    { nutrient: Micronutrient.VitaminA, amount: { value: 900, unit: NutrientUnit.MCG_RAE }},
    { nutrient: Micronutrient.VitaminD, amount: { value: 46, unit: NutrientUnit.MCG_RAE }},
    { nutrient: Micronutrient.VitaminC, amount: { value: 425, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminE, amount: { value: 20, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminK, amount: { value: 138, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB1, amount: { value: 0.23, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB2, amount: { value: 0.31, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB3, amount: { value: 19, unit: NutrientUnit.MG_NE }},
    { nutrient: Micronutrient.VitaminB6, amount: { value: 3, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB9, amount: { value: 690, unit: NutrientUnit.MCG_DFE }},
    { nutrient: Micronutrient.VitaminB12, amount: { value: 5.3, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB7, amount: { value: 7.5, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB5, amount: { value: 5.1, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Calcium, amount: { value: 125, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Phosphorus, amount: { value: 108, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Magnesium, amount: { value: 57.5, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Zinc, amount: { value: 15, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Selenium, amount: { value: 26, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Copper, amount: { value: 0.15, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Manganese, amount: { value: 0.3, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Chromium, amount: { value: 38, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Sodium, amount: { value: 35, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Potassium, amount: { value: 375, unit: NutrientUnit.MG }},
]

const product: Product = {
    id: 'huelGreens',
    name: 'Huel Greens',
    url: 'https://pl.huel.com/pages/daily-greens-powder-benefits',
    nutrientsPerServing: doses,
}

export const huelOneServing: ProductDose = {
    product,
    servings: 1,
}

export default product