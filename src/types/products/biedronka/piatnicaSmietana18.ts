import { Macronutrient, NutrientDose, NutrientUnit, Product } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 18, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 2.7, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 4.8, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'biedronkaPiatnicaSmietana',
    name: 'Piatnica Smietana 18%',
    nutrientsPer100g: nutrients,
    url: 'https://zakupy.biedronka.pl/piatnica-smietana-18%25-piatnica-200-g-0000002444.html',
}

export default product