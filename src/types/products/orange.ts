import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 11.8, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Fat, amount: { value: 0.2, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 0.9, unit: NutrientUnit.G } },

    { nutrient: Micronutrient.VitaminC, amount: { value: 53.2, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Fiber, amount: { value: 2.4, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB1, amount: { value: 0.09, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB2, amount: { value: 0.04, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB3, amount: { value: 0.28, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB5, amount: { value: 0.25, unit: NutrientUnit.MG } },

    { nutrient: Micronutrient.VitaminB6, amount: { value: 0.06, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB9, amount: { value: 30, unit: NutrientUnit.MCG_DFE } },
    { nutrient: Micronutrient.VitaminA, amount: { value: 11, unit: NutrientUnit.MCG_RAE } },
    { nutrient: Micronutrient.VitaminE, amount: { value: 0.18, unit: NutrientUnit.MG } },

    { nutrient: Micronutrient.Calcium, amount: { value: 40, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Potassium, amount: { value: 181, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Magnesium, amount: { value: 10, unit: NutrientUnit.MG } },
]

export const orangeProduct: Product = {
    id: 'orange',
    name: 'Orange',
    nutrientsPer100g: nutrients
}

export default orangeProduct