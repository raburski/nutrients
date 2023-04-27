import React from 'react';
import logo from './logo.svg';
import './App.css';
import { setup as setupGoober, styled } from 'goober'
import { NutrientAmount, NutrientDose, NutrientUnit, allNutrients } from "./types/nutrient";
import { nutrientsMan32 } from "./types/doses";
import { athelticGreensDoses } from "./types/products";
import NutrientList from "./NutrientList";

setupGoober(React.createElement)

function deepCopy<T>(object: T): T {
  return JSON.parse(JSON.stringify(object))
}

const UNIT_CONVERSION_MATRIX: any = {
  [NutrientUnit.MCG]: {
    [NutrientUnit.MG]: 0.001
  },
  [NutrientUnit.MG]: {
    [NutrientUnit.MCG]: 1000
  },
}

function amountOperation(a1: NutrientAmount, a2: NutrientAmount, operation: (n1: number, n2: number) => number): NutrientAmount {
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

function addAmounts(a1: NutrientAmount, a2: NutrientAmount): NutrientAmount {
  return amountOperation(a1, a2, (n1, n2) => n1 + n2)
}

function subAmounts(a1: NutrientAmount, a2: NutrientAmount): NutrientAmount {
  return amountOperation(a1, a2, (n1, n2) => n1 - n2)
}

function addNutrientDoses(doses: NutrientDose[]): NutrientDose[] {
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

function subNutrientDoses(initial: NutrientDose[], subtracted: NutrientDose[]) {
  return subtracted.reduce((total, dose) => {
    const doseIndex = total.findIndex(d => d.nutrient === dose.nutrient)
    if (doseIndex >= 0) {
      const countedDose = total[doseIndex]
      // console.log('sub amnts', countedDose, dose)
      console.log('sub ammmmm', countedDose.amount, dose.amount, subAmounts(countedDose.amount, dose.amount))
      countedDose.amount = subAmounts(countedDose.amount, dose.amount)
    } else {
      total.push({ nutrient: dose.nutrient, amount: { unit: dose.amount.unit, value: -dose.amount.value } })
    }
    return total
  }, deepCopy(initial))
}

function getNutrientsMissing(required: NutrientDose[], supplied: NutrientDose[]) {
  const totalSupplied = addNutrientDoses(supplied)
  const missing = subNutrientDoses(required, totalSupplied)
  return missing
}

const AppContainer = styled('div')`
  display: flex;
  flex-directio: row;
  flex: 1;
  min-height: 100vh;
  padding: 32px;
`

const Column = styled('div')`
  display: flex;
  flex-direction: column;
  flex: 1;
  white-space: pre;
`


function App() {
  const missing = getNutrientsMissing(nutrientsMan32, athelticGreensDoses)
  return (
    <AppContainer>
      <Column>
        REQUIRED (Man 32):<br/><br/>
        <NutrientList nutrientDoses={nutrientsMan32}/>
      </Column>
      <Column>
        SUPPLIED (AG1):<br/><br/>
        <NutrientList nutrientDoses={athelticGreensDoses}/>
      </Column>
      <Column>
        MISSING:<br/><br/>
        <NutrientList nutrientDoses={missing}/>
      </Column>
      
    </AppContainer>
  );
}

export default App;
