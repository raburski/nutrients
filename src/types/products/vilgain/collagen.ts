import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

// Dose: 10g/day

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Protein, amount: { value: 91, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'vilgainCollagen',
    name: 'Vilgain Collagen',
    nutrientsPer100g: nutrients
}

export default product