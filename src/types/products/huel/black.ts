import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

// Salty carmel

export const doses: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 16, unit: NutrientUnit.G }},
    { nutrient: Macronutrient.Protein, amount: { value: 40, unit: NutrientUnit.G }},
    { nutrient: Macronutrient.Fat, amount: { value: 18, unit: NutrientUnit.G }},
    { nutrient: Micronutrient.Fiber, amount: { value: 7.1, unit: NutrientUnit.G }},

    { nutrient: Micronutrient.VitaminA, amount: { value: 180, unit: NutrientUnit.MCG_RAE }},
    { nutrient: Micronutrient.VitaminD, amount: { value: 2.2, unit: NutrientUnit.MCG_RAE }},
    { nutrient: Micronutrient.VitaminC, amount: { value: 60, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminE, amount: { value: 3.2, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminK, amount: { value: 35, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB1, amount: { value: 0.24, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB2, amount: { value: 0.28, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB3, amount: { value: 3.2, unit: NutrientUnit.MG_NE }},
    { nutrient: Micronutrient.VitaminB6, amount: { value: 0.34, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB9, amount: { value: 80, unit: NutrientUnit.MCG_DFE }},
    { nutrient: Micronutrient.VitaminB12, amount: { value: 0.8, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB7, amount: { value: 12, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB5, amount: { value: 1.2, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Calcium, amount: { value: 260, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Phosphorus, amount: { value: 370, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Magnesium, amount: { value: 100, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Zinc, amount: { value: 4.8, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Selenium, amount: { value: 32, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Copper, amount: { value: 0.66, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Manganese, amount: { value: 1, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Chromium, amount: { value: 12, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Sodium, amount: { value: 30, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Potassium, amount: { value: 700, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Molybdenum, amount: { value: 40, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Iron, amount: { value: 10, unit: NutrientUnit.MG }},
]

const product: Product = {
    id: 'huelBlack',
    name: 'Huel Black',
    url: 'https://pl.huel.com/pages/the-huel-black-edition-formula-explained',
    nutrientsPerServing: doses,
}

export const huelOneServing: ProductDose = {
    product,
    servings: 1,
}

export default product