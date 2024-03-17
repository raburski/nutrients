import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit } from "./nutrient"

// based on https://alexvarga.substack.com/p/ive-calculated-nutrients-in-bryan
export const macronutrientsMan32: NutrientDose[] = [
  {
    nutrient: Macronutrient.Carbohydrate,
    amount: { value: 160, unit: NutrientUnit.G },
  },
  {
    nutrient: Macronutrient.Protein,
    amount: { value: 160, unit: NutrientUnit.G },
  },
  {
    nutrient: Macronutrient.Fat,
    amount: { value: 140, unit: NutrientUnit.G },
  },
]

export const micronutrientsMan32: NutrientDose[] = [
    {
      nutrient: Micronutrient.VitaminA, // Bryan 1800
      amount: { value: 1300, unit: NutrientUnit.MCG_RAE },
    },
    {
      nutrient: Micronutrient.VitaminC, // 950
      amount: { value: 950, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.VitaminD,
      amount: { value: 20, unit: NutrientUnit.MCG },
    },
    {
      nutrient: Micronutrient.VitaminE,
      amount: { value: 15, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.VitaminK, // 580
      amount: { value: 400, unit: NutrientUnit.MCG },
    },
    {
      nutrient: Micronutrient.VitaminB1, // Bryan 2.8
      amount: { value: 2, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.VitaminB2, // Brayn 2.0
      amount: { value: 2, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.VitaminB3, // 2.8
      amount: { value: 16, unit: NutrientUnit.MG_NE },
    },
    {
      nutrient: Micronutrient.VitaminB6, // 3.5
      amount: { value: 3, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.VitaminB9,
      amount: { value: 400, unit: NutrientUnit.MCG_DFE },
    },
    {
      nutrient: Micronutrient.VitaminB12,
      amount: { value: 2.4, unit: NutrientUnit.MCG },
    },
    {
      nutrient: Micronutrient.VitaminB7, // 42
      amount: { value: 42, unit: NutrientUnit.MCG },
    },
    {
      nutrient: Micronutrient.VitaminB5,
      amount: { value: 5, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Calcium, // 2500
      amount: { value: 2000, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Iron,
      amount: { value: 10, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Magnesium,
      amount: { value: 410, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Phosphorus, // Bryan has lower
      amount: { value: 700, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Potassium, // Bryan has lower
      amount: { value: 4700, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Sodium,
      amount: { value: 2300, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Zinc,
      amount: { value: 11, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Copper,
      amount: { value: 900, unit: NutrientUnit.MCG },
    },
    {
        nutrient: Micronutrient.Selenium,
        amount: { value: 55, unit: NutrientUnit.MCG },
    },
    {
        nutrient: Micronutrient.Chromium,
        amount: { value: 35, unit: NutrientUnit.MCG },
    },
    {
        nutrient: Micronutrient.Manganese,
        amount: { value: 2.3, unit: NutrientUnit.MG },
    },
    {
        nutrient: Micronutrient.Molybdenum,
        amount: { value: 45, unit: NutrientUnit.MCG },
    },
    {
        nutrient: Micronutrient.Iodine,
        amount: { value: 150, unit: NutrientUnit.MCG },
    },
    {
      nutrient: Micronutrient.Fluoride,
      amount: { value: 4, unit: NutrientUnit.MG },
    },
    {
      nutrient: Micronutrient.Fiber,
      amount: { value: 38, unit: NutrientUnit.G },
    }
]

export const nutrientsMan32 = [...macronutrientsMan32, ...micronutrientsMan32]