import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 0, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 9.6, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 12, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Fiber, amount: { value: 0.6, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'biedronkaFruvitaSkyrJagoda',
    name: 'Fruvita Skyr Jagoda',
    nutrientsPer100g: nutrients,
    url: 'https://zakupy.biedronka.pl/fruvita-fruvita-jogurt-typu-islandzkiego-skyr-jagoda-150-g-0000005332.html',
}

export default product