import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 0, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Fat, amount: { value: 5, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 24, unit: NutrientUnit.G } },
]

export const bananaProduct: Product = {
    id: 'porkLoin',
    name: 'Pork Loin',
    nutrientsPer100g: nutrients
}

export default bananaProduct