import database from './fdc_database.json'
import databaseFoundation from './fdc_database_foundation.json'
import { NutrientDose, Product, Nutrient, NutrientUnit, Micronutrient, Macronutrient, NutrientAmount } from "./types/nutrient"

const foodNutrientToMicronutrient: { [key: string]: Micronutrient } = {
    'Vitamin A, RAE': Micronutrient.VitaminA,
    'Thiamin': Micronutrient.VitaminB1,
    'Riboflavin': Micronutrient.VitaminB2,
    'Niacin': Micronutrient.VitaminB3,
    'Pantothenic acid': Micronutrient.VitaminB5,
    'vitamin b-6': Micronutrient.VitaminB6,
    'Biotin': Micronutrient.VitaminB7,
    'Folate': Micronutrient.VitaminB9,
    'Vitamin B-12': Micronutrient.VitaminB12,
    'vitamin c': Micronutrient.VitaminC,
    'Vitamin E': Micronutrient.VitaminE,
    'Vitamin K': Micronutrient.VitaminK,
    'Calcium': Micronutrient.Calcium,
    'Copper': Micronutrient.Copper,
    'Iodine': Micronutrient.Iodine,
    'Iron': Micronutrient.Iron,
    'Magnesium': Micronutrient.Magnesium,
    'Manganese': Micronutrient.Manganese,
    'Molybdenum': Micronutrient.Molybdenum,
    'Phosphorus': Micronutrient.Phosphorus,
    'Potassium': Micronutrient.Potassium,
    'Sodium': Micronutrient.Sodium,
    'Selenium': Micronutrient.Selenium,
    'Zinc': Micronutrient.Zinc,

    // Nitrogen
    // Betaine
    // Choline
    // Fiber
    // Carotene
    // cis-beta-Carotene
    // trans-beta-Carotene
    // Cryptoxanthin
    // Lutein
    // cis-Lutein/Zeaxanthin
    // Zeaxanthin
    // Lycopene
    // cis-Lycopene
    // Tocotrienol
    // Tocopherol
    // Tocotrienol
    // Galactose
    // Lactose
    // Sucrose
    // Glucose
}

const foodNutrientToMacronutrient: { [key: string]: Macronutrient } = {
    'protein': Macronutrient.Protein,
    'fat': Macronutrient.Fat,
    'carbohydrate': Macronutrient.Carbohydrate,
}

function nutrientNameToEnum(name: string): Nutrient | undefined {
    if (!name) return undefined
    const lowercaseName = name.toLowerCase()
    const microKey = Object.keys(foodNutrientToMicronutrient).find(key => lowercaseName.includes(key.toLowerCase()))
    if (microKey) {
        return foodNutrientToMicronutrient[microKey]
    }

    const macroKey = Object.keys(foodNutrientToMacronutrient).find(key => lowercaseName.includes(key.toLowerCase()))
    if (macroKey) {
        return foodNutrientToMacronutrient[macroKey]
    }

    return undefined
}

const unitNameToNutritionUnit: { [key: string]: NutrientUnit } = {
    'mg': NutrientUnit.MG,
    'µg': NutrientUnit.MCG,
    'g': NutrientUnit.G,
}

function nutrientUnit(stringUnit: string, name: string): NutrientUnit | undefined {
    if (name.includes('RAE')) return NutrientUnit.MCG_RAE
    if (name.includes('Niacin')) return NutrientUnit.MG_NE // not sure if this is correct
    if (name.includes('Folate')) return NutrientUnit.MCG_DFE // not sure if this is correct
    return unitNameToNutritionUnit[stringUnit]
}

function nutrientAmount(value: number, stringUnit: string, name: string): NutrientAmount | undefined {
    const unit = nutrientUnit(stringUnit, name)
    if (!unit || value === 0) return undefined

    return { value, unit }
}

function parseNutrientDose(food: any): NutrientDose | undefined {
    const nutrient = nutrientNameToEnum(food.nutrient.name)
    const amount = nutrientAmount(food.amount, food.nutrient.unitName, food.nutrient.name)
    if (amount <= 0) return undefined

    if (!nutrient || !amount) return undefined

    return {
        nutrient,
        amount,
    }
}

function isUniqueNutrientDose(nd: NutrientDose, index: number, array: NutrientDose[]) {
    if (!nd) return false
    const ndIndex = array.findIndex(dose => dose?.nutrient === nd.nutrient)
    return index === ndIndex
}

function parseFood(food: any): Product {
    return {
        id: `fdc:${food.fdcId}`,
        name: food.description,
        nutrientsPer100g: food.foodNutrients.map(parseNutrientDose).filter(isUniqueNutrientDose)
    }
}

function isBasicFood(f: any) {
    return f.inputFoods.length <= 1
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('nutrition')
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('juice')
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('drink')
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('candy')
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('chips')
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('baby food')
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('cookies')
        && !f.wweiaFoodCategory.wweiaFoodCategoryDescription.toLowerCase().includes('not included in a food category')
}

const foods = [...database.SurveyFoods, ...databaseFoundation.FoundationFoods] as any[]
const foodProducts = foods.filter(isBasicFood).map(parseFood)

export function getFood(name: string) {
    if (!name) return undefined
    const lowerCaseName = name.toLowerCase()
    const db_foods = foods.filter(f => f.description.toLowerCase().includes(lowerCaseName))
    return db_foods.map(parseFood)
}

function compareProductsByNutrient(nutrient: Nutrient) {
    return function compareProducts(a: Product, b: Product) {
        const aNutrient = a.nutrientsPer100g?.find(n => n.nutrient === nutrient)
        const bNutrient = b.nutrientsPer100g?.find(n => n.nutrient === nutrient)
        const aValue = aNutrient?.amount.value || 0
        const bValue = bNutrient?.amount.value || 0

        return bValue - aValue
    }
}

function filterHasNutrient(nutrient: Nutrient) {
    return function hasNutrient(product: Product) {
        return product.nutrientsPer100g?.findIndex(n => n.nutrient === nutrient) > -1
    }
}

export function getFoodsWithMost(nutrient: Nutrient, limit = 20): Product[] {
    const products = [...foodProducts].filter(filterHasNutrient(nutrient))
    products.sort(compareProductsByNutrient(nutrient))
    return products.slice(0, limit)
}

export default {}