import { NutrientAmount, NutrientDose, NutrientUnit, ProductDose } from "./types/nutrient"

const UNIT_CONVERSION_MATRIX: any = {
  [NutrientUnit.MCG]: {
    [NutrientUnit.MG]: 0.001
  },
  [NutrientUnit.MG]: {
    [NutrientUnit.MCG]: 1000
  },
}

export function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object))
}

export function amountOperation(a1: NutrientAmount, a2: NutrientAmount, operation: (n1: number, n2: number) => number): NutrientAmount {
    if (a1.unit === a2.unit) {
      return { unit: a1.unit, value: operation(a1.value, a2.value) }
    }
  
    const conversionMultiple = UNIT_CONVERSION_MATRIX[a2.unit][a1.unit]
    if (conversionMultiple !== undefined) {
      const convertedA2 = { unit: a1.unit, value: a2.value * conversionMultiple }
      return amountOperation(a1, convertedA2, operation)
    }
  
    throw Error(`different units not supported for now: ${a1.unit} and ${a2.unit}`)
  }
  
export function addAmounts(a1: NutrientAmount, a2: NutrientAmount): NutrientAmount {
    return amountOperation(a1, a2, (n1, n2) => n1 + n2)
  }
  
export function subAmounts(a1: NutrientAmount, a2: NutrientAmount): NutrientAmount {
    return amountOperation(a1, a2, (n1, n2) => n1 - n2)
  }
  
export function addNutrientDoses(doses: NutrientDose[]): NutrientDose[] {
    return doses.reduce((total, dose) => {
      const doseIndex = total.findIndex(d => d.nutrient === dose.nutrient)
      if (doseIndex >= 0) {
        const countedDose = total[doseIndex]
        countedDose.amount = addAmounts(countedDose.amount, dose.amount)
      } else {
        total.push({ nutrient: dose.nutrient, amount: { ...dose.amount } })
      }
      return total
    }, [] as NutrientDose[])
  }
  
export function subNutrientDoses(initial: NutrientDose[], subtracted: NutrientDose[]) {
    return subtracted.reduce((total, dose) => {
      const doseIndex = total.findIndex(d => d.nutrient === dose.nutrient)
      if (doseIndex >= 0) {
        const countedDose = total[doseIndex]
        // console.log('sub amnts', countedDose, dose)
        countedDose.amount = subAmounts(countedDose.amount, dose.amount)
      } else {
        total.push({ nutrient: dose.nutrient, amount: { unit: dose.amount.unit, value: -dose.amount.value } })
      }
      return total
    }, deepCopy(initial))
}
  
export function getNutrientsMissing(required: NutrientDose[], supplied: NutrientDose[]) {
    const totalSupplied = addNutrientDoses(supplied)
    const missing = subNutrientDoses(required, totalSupplied)
    return missing
}

export function getNutrientDosesFromProductDose(pd: ProductDose): NutrientDose[] {
  if (pd.servings !== undefined && pd.servings > 0 && pd.product.nutrientsPerServing) {
    return pd.product.nutrientsPerServing!.map(n => ({ nutrient: n.nutrient, amount: { value: n.amount.value * pd.servings!, unit: n.amount.unit } }))
  }
  if (pd.grams !== undefined && pd.grams > 0 && pd.product.nutrientsPer100g) {
    return pd.product.nutrientsPer100g!.map(n => ({ nutrient: n.nutrient, amount: { value: n.amount.value * pd.grams! / 100, unit: n.amount.unit } }))
  }
  return []
}