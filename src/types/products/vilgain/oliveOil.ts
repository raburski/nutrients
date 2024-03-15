import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const oilNutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 92, unit: NutrientUnit.G } },
]

export const vilgainOliveOilProduct: Product = {
    id: 'vilgainOliveOil',
    name: 'Vilgain Olive Oil',
    url: 'https://vilgain.pl/vilgain-oliwa-z-oliwek-extra-virgin-bio/750-ml-43267',
    nutrientsPer100g: oilNutrients
}

export default vilgainOliveOilProduct