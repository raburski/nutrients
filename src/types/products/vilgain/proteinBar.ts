import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 19, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 30, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 17, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Sodium, amount: { value: 0.73, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 10, unit: NutrientUnit.G } },
]

export const vilgainOliveOilProduct: Product = {
    id: 'vilgainNutsProteinBar',
    name: 'Vilgain Protein Bar Orzeszki Karmel',
    url: 'https://vilgain.pl/vilgain-double-trouble-protein-bar/12x43140',
    nutrientsPer100g: nutrients
}

export default vilgainOliveOilProduct