import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

// serving = 3 capsules

// Witamina A
// 1200 μg (150% RWS*)
// Witamina B1
// 1,65 mg (150% RWS)
// Witamina B2
// 2,1 mg (150% RWS)
// Witamina B3
// 24 mg (150% RWS)
// Witamina B5
// 9 mg (150% RWS)
// Witamina B6
// 2,1 mg (150% RWS)
// Witamina B7
// 75 μg (150% RWS)
// Witamina B9
// 300 μg (150% RWS)
// Witamina B12	5 μg (200% RWS)
// Witamina C	120 mg (120% RWS)
// Witamina D3	5 μg (100% RWS)
// Witamina E	18 mg (150% RWS)
// Witamina K2‑MK7	75 μg (100% RWS)
// Magnez	75 mg (20% RWS)
// Cynk	10 mg (100% RWS)
// Mangan	2 mg (100% RWS)
// Chrom	40 μg (100% RWS)
// Miedź	1 mg (100% RWS)
// Molibden	50 μg (100% RWS)
// Selen	55 μg (100% RWS)
// Żelazo	14 mg (100% RWS)
// Kurkumina C3 Complex® (95% kurkuminoidów)	140 mg
// BioPerine® (95% piperyny)	5 mg
// Synbiotyki LactoWise®	100 mg
// - w tym kultury probiotyczne LactoSpore®	1,5 x 10^9 CFU/CFU
// - w tym błonnik prebiotyczny FenuFibers®	45 mg
// Beta‑glukany z drożdży	200 mg

const nutrients: NutrientDose[] = [
    { nutrient: Micronutrient.VitaminA, amount: { value: 1200, unit: NutrientUnit.MCG_RAE } },
    { nutrient: Micronutrient.VitaminB1, amount: { value: 1.65, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB2, amount: { value: 2.1, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB3, amount: { value: 24, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB5, amount: { value: 9, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB6, amount: { value: 2.1, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB7, amount: { value: 75, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.VitaminB9, amount: { value: 300, unit: NutrientUnit.MCG_DFE } },
    { nutrient: Micronutrient.VitaminB12, amount: { value: 5, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.VitaminC, amount: { value: 120, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminD, amount: { value: 5, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.VitaminE, amount: { value: 18, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminK, amount: { value: 75, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.Magnesium, amount: { value: 75, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Zinc, amount: { value: 10, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Manganese, amount: { value: 2, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Chromium, amount: { value: 40, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.Copper, amount: { value: 1, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Molybdenum, amount: { value: 50, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.Selenium, amount: { value: 55, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.Iron, amount: { value: 14, unit: NutrientUnit.MG } },
]

export const product: Product = {
    id: 'vilgainMultivitaminComplex',
    name: 'Vilgain Multivitamin Complex',
    url: 'https://vilgain.pl/vilgain-multivitamin-complex/90-kapsulek-42640',
    nutrientsPerServing: nutrients
}

export default product