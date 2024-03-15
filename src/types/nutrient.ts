export enum Micronutrient {
    VitaminA = 'Vitamin A',
    VitaminB1 = 'Thiamin (Vitamin B1)',
    VitaminB2 = 'Riboflavin (Vitamin B2)',
    VitaminB3 = 'Niacin (Vitamin B3)',
    VitaminB5 = 'Pantothenic Acid (Vitamin B5)',
    VitaminB6 = 'Vitamin B6',
    VitaminB7 = 'Biotin (Vitamin B7)',
    VitaminB9 = 'Folate (Vitamin B9)',
    VitaminB12 = 'Vitamin B12',
    VitaminC = 'Vitamin C',
    VitaminD = 'Vitamin D',
    VitaminE = 'Vitamin E',
    VitaminK = 'Vitamin K',
    Calcium = 'Calcium',
    Chromium = 'Chromium',
    Copper = 'Copper',
    Fluoride = 'Fluoride',
    Iodine = 'Iodine',
    Iron = 'Iron',
    Magnesium = 'Magnesium',
    Manganese = 'Manganese',
    Molybdenum = 'Molybdenum',
    Phosphorus = 'Phosphorus',
    Potassium = 'Potassium',
    Selenium = 'Selenium',
    Sodium = 'Sodium',
    Zinc = 'Zinc',

    Fiber = 'Fiber',
}

export enum Macronutrient {
    Carbohydrate = "Carbohydrate",
    Protein = "Protein",
    Fat = "Fat",
}  

export type Nutrient = Macronutrient | Micronutrient

export const allNutrients = [...Object.values(Macronutrient), ...Object.values(Micronutrient)]

export enum NutrientUnit {
    G = "g", // grams
    MCG = "mcg", // Micrograms
    MCG_RAE = "mcg RAE", // Micrograms of retinol activity equivalents
    MG = "mg", // Milligrams
    MG_NE = "mg NE", // Milligrams of niacin equivalents
    MCG_DFE = "mcg DFE", // Micrograms of dietary folate equivalents
}

export interface NutrientAmount {
    value: number
    unit: NutrientUnit
}
  
export interface NutrientDose {
    nutrient: Nutrient
    amount: NutrientAmount
}

export interface Product {
    id?: string
    name: string
    url?: string
    nutrientsPerServing?: NutrientDose[]
    nutrientsPer100g?: NutrientDose[]
}

export interface ProductDose {
    product: Product
    grams?: number
    servings?: number
}