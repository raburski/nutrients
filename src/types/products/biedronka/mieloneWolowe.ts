import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product } from "../../nutrient";

const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Fat, amount: { value: 20, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Protein, amount: { value: 17, unit: NutrientUnit.G } },
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 0, unit: NutrientUnit.G } },

    // https://wszystkoojedzeniu.pl/mieso-mielone-wolowe-wartosci-odzywcze-witaminy
    { nutrient: Micronutrient.VitaminA, amount: { value: 2.7, unit: NutrientUnit.MCG_RAE } },
    { nutrient: Micronutrient.VitaminB1, amount: { value: 0.051, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB2, amount: { value: 0.171, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB3, amount: { value: 4.026, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB6, amount: { value: 0.311, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminE, amount: { value: 0.12, unit: NutrientUnit.MG } },

    { nutrient: Micronutrient.Potassium, amount: { value: 241, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Phosphorus, amount: { value: 2.9, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Magnesium, amount: { value: 17, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Calcium, amount: { value: 33, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Sodium, amount: { value: 73, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Iron, amount: { value: 2.27, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Zinc, amount: { value: 2.9, unit: NutrientUnit.MG } },
]

export const product: Product = {
    id: 'biedronkaMieloneWolowe',
    name: 'Minced Beef (Biedra)',
    nutrientsPer100g: nutrients,
    url: 'https://zakupy.biedronka.pl/kraina-mies-kraina-mies-mieso-mielone-wolowe-400-g-0000003307.html',
}

export default product