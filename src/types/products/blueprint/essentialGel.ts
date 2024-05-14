import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";


const nutrients: NutrientDose[] = [
    { nutrient: Micronutrient.VitaminK, amount: { value: 1500, unit: NutrientUnit.MCG } },
]

export const product: Product = {
    id: 'bluprintEssentialGel',
    name: 'Blueprint Essential Gel',
    nutrientsPerServing: nutrients
}

export default product