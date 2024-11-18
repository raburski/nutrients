import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";


const nutrients: NutrientDose[] = [
    { nutrient: Micronutrient.VitaminC, amount: { value: 1000, unit: NutrientUnit.MG } },
]

export const product: Product = {
    id: 'vitC',
    name: 'Vitamin C Supplement',
    nutrientsPerServing: nutrients
}

export default product