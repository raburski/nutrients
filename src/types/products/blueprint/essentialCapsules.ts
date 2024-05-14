import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

// Nicotinamide Ribose Chloride (NR) 300 mg - N/A
// Vitamin B1, Thiamine HCL 1.1 mg 1.2 N/A
// Vitamin B2, Riboflavin 1.4 mg 1.3 N/A
// Vitamin B3, Niacinamide 15 mg 16 N/A
// Vitamin B5, D-Calcium Pantothenate 6 mg 5 N/A
// Vitamin B6, Pyridoxine HCL 1.4 mg 1.7 N/A
// Vitamin B7, Biotin 50 mcg 30 N/A
// Vitamin B9, Calcium L-5-Methyltetrahydrofolate
// (0.5% Folic Acid) MTHFR friendly pre-metabolised 200 mcg 400 N/A
// Vitamin B12, Methylcobalamin 125 mcg 2.4* Yes *RDA is too low, per evidence
// Vitamin D3, VegD3 2700 IU 800* N/A *RDA is too low, per evidence
// PRODUCT NUTRITIONAL OVERVIEW
// Vitamin E, d-alpha tocopherol, natural 67
// Boron, as Boron Glycinate 3 mg - Yes
// Manganese, as Manganese Citrate 1 mg 2.3 N/A
// Zinc, as Zinc Bisglycinate 15 mg 11 N/A
// Iodide as Potassium Iodide 200 mcg 150 N/A
// Lithium, as Lithium Orotate 1 mg 1 Yes
// Selenium, as L-selenomethionine 30 mcg 55 N/A
// Ubiquinol (CoQ10 Reduced) 50 mg - Yes
// Glucoraphanin, from broccoli 20 mg - Yes
// Rhodiola rosea extract, 3% Rosavins/1%
// Salidroside 300 mg - Yes
// Fisetin, from Smoketree 100 mg - Yes
// Spermidine, as Spermidine trihydrochloride 10 mg - Yes
// Genistein, from Japonica 300 mg - Yes
// Luteolin 100 mg - Yes
// Lactobacillus acidophilus probiotic 4 billion CFU - Yes
// Calcium (from 182 mg calcium carbonate, 300 mg


const nutrients: NutrientDose[] = [
    { nutrient: Micronutrient.VitaminB1, amount: { value: 1.1, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB2, amount: { value: 1.4, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB3, amount: { value: 15, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB5, amount: { value: 6, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB6, amount: { value: 1.4, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.VitaminB7, amount: { value: 50, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.VitaminB9, amount: { value: 200, unit: NutrientUnit.MCG_DFE } },
    { nutrient: Micronutrient.VitaminB12, amount: { value: 125, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.VitaminD, amount: { value: 50, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.VitaminE, amount: { value: 67, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Manganese, amount: { value: 1, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Zinc, amount: { value: 15, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Iodine, amount: { value: 200, unit: NutrientUnit.MCG } },
    // { nutrient: Micronutrient.Lithium, amount: { value: 1, unit: NutrientUnit.MG } },
    { nutrient: Micronutrient.Selenium, amount: { value: 30, unit: NutrientUnit.MCG } },
    { nutrient: Micronutrient.Calcium, amount: { value: 50, unit: NutrientUnit.MG } },
]

export const product: Product = {
    id: 'bluprintEssentialCapsules',
    name: 'Blueprint Essential Capsules',
    nutrientsPerServing: nutrients
}

export default product