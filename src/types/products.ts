import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "./nutrient";

export const athelticGreensDoses: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 6, unit: NutrientUnit.G }},
    { nutrient: Macronutrient.Protein, amount: { value: 2, unit: NutrientUnit.G }},
    { nutrient: Macronutrient.Fat, amount: { value: 0, unit: NutrientUnit.G }},

    { nutrient: Micronutrient.VitaminA, amount: { value: 555, unit: NutrientUnit.MCG_RAE }},
    { nutrient: Micronutrient.VitaminC, amount: { value: 420, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminE, amount: { value: 83, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB1, amount: { value: 3, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB2, amount: { value: 2, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB3, amount: { value: 20, unit: NutrientUnit.MG_NE }},
    { nutrient: Micronutrient.VitaminB6, amount: { value: 3, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.VitaminB9, amount: { value: 680, unit: NutrientUnit.MCG_DFE }},
    { nutrient: Micronutrient.VitaminB12, amount: { value: 22, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB7, amount: { value: 330, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.VitaminB5, amount: { value: 4, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Calcium, amount: { value: 118, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Phosphorus, amount: { value: 130, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Magnesium, amount: { value: 26, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Zinc, amount: { value: 15, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Selenium, amount: { value: 20, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Copper, amount: { value: 195, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Manganese, amount: { value: 400, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Chromium, amount: { value: 25, unit: NutrientUnit.MCG }},
    { nutrient: Micronutrient.Sodium, amount: { value: 45, unit: NutrientUnit.MG }},
    { nutrient: Micronutrient.Potassium, amount: { value: 300, unit: NutrientUnit.MG }},
]

export const atheticGreens: Product = {
    id: 'athleticGreens',
    name: 'AG1',
    nutrientsPerServing: athelticGreensDoses,
}

export const atheticGreensOneServing: ProductDose = {
    product: atheticGreens,
    servings: 1,
}