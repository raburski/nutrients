import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const oilNutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 92, unit: NutrientUnit.G } },
]

export const vilgainOliveOilProduct: Product = {
    id: 'vilgainOliveOil',
    name: 'Vilgain Olive Oil',
    nutrientsPer100g: oilNutrients
}

export default vilgainOliveOilProduct