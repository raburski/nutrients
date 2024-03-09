import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../nutrient";

const bananaNutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 22, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Fat, amount: { value: 0.2, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 1.1, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.VitaminC, amount: { value: 8.7, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Potassium, amount: { value: 358, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Magnesium, amount: { value: 27, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB6, amount: { value: 0.4, unit: NutrientUnit.MG } },
]

export const bananaProduct: Product = {
    id: 'banana',
    name: 'Banana',
    nutrientsPer100g: bananaNutrients
}

export default bananaProduct