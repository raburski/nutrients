import { Macronutrient, Micronutrient, NutrientDose, NutrientUnit, Product, ProductDose } from "../../nutrient";

// Glucosamine Sulfate Potassium 1.5 g - Yes
// Creatine Monohydrate (CreaPure) 99.5%% 2.5 g - Yes
// Sodium Hyaluronate (Hyaluronic acid) 120 mg - Yes
// Taurine 1.5 g - Yes
// L-Lysine HCL 1 g 1.5-2.5 Yes
// Glycine 1.2 g - Yes
// L-Theanine 200 mg - Yes
// Vitamin C (Ascorbic Acid) 250 mg 90 NA
// Magnesium Citrate Anhydrous 150 mg See end See end
// Ashwagandha KSM66 Root Extract 600 mg - Yes
// CaAKG 2 g - Yes
// Calcium (from CaAKG) 350 mg See end See end
// L-Glutathione Reduced 250 mg - Yes
// Allulose 4 g - Yes 


const nutrients: NutrientDose[] = [
    { nutrient: Macronutrient.Carbohydrate, amount: { value: 3, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.VitaminC, amount: { value: 0.25, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Magnesium, amount: { value: 0.15, unit: NutrientUnit.G } },
    { nutrient: Micronutrient.Calcium, amount: { value: 0.35, unit: NutrientUnit.G } },
]

export const product: Product = {
    id: 'blueprintLongevityMix',
    name: 'Blueprint Longevity Mix',
    nutrientsPerServing: nutrients
}

export default product