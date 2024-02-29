import { styled } from "goober";
import { NutrientAmount, NutrientDose, NutrientUnit, allNutrients } from "./types/nutrient";

const Container = styled('div')`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-right: 12px;
`

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    border-bottom: ${props => props.separated ? '2px' : '1px'} solid black;
    padding: 4px;
`

const RowTitle = styled('div')`
    display: flex;
    flex: 1;
    min-height: 16px;
    font-size: 12px;
`

const RowValue = styled('div')`
    display: flex;
    margin-right: 4px;
    font-size: 12px;
`

function NutrientRow({ nutrient, showName, nutrientDose = {}, separated = false }) {
    const isCovered = nutrientDose.amount && nutrientDose.amount.value < 0
    const value = nutrientDose?.amount ? Math.round(nutrientDose?.amount?.value * 100)/100 : undefined
    return (
        <Row separated={separated}><RowTitle>{isCovered ? '✅ ' : null}{showName ? nutrient : ''}</RowTitle> <RowValue>{value} {nutrientDose?.amount?.unit}</RowValue></Row>
    )
}

const CALORIE_NUTRIENT = 'Calories'

function calcCalorieDoes(doses) {
    console.log('nutrientDoses', doses)
    const carbs = doses.find(dose => dose.nutrient === 'Carbohydrate')
    const protein = doses.find(dose => dose.nutrient === 'Protein')
    const fat = doses.find(dose => dose.nutrient === 'Fat')
    console.log('??/', carbs, protein, fat)
    if (!carbs || !protein || !fat) return null
    return {
        nutrient: 'Calories',
        amount: {
            value: carbs.amount.value * 4 + protein.amount.value * 4 + fat.amount.value * 9,
            unit: 'calories',
        }
    }
}

export default function NutrientList({ nutrientDoses = [], showNames = false, onlyProvided = false }) {
    const nutrients = onlyProvided ? nutrientDoses.map(d => d.nutrient) : allNutrients
    const calorieDose = calcCalorieDoes(nutrientDoses)
    function shouldSeparate(nutrient) {
        return nutrient === 'Fat' || nutrient === 'Zinc'
    }
    return (
        <Container>
            {calorieDose ? <NutrientRow separated nutrient={CALORIE_NUTRIENT} showName={showNames} nutrientDose={calorieDose}/> : null}
            {nutrients.map(nutrient => {
                return <NutrientRow separated={shouldSeparate(nutrient)} nutrient={nutrient} showName={showNames} nutrientDose={nutrientDoses.find(dose => dose.nutrient === nutrient )} />
            }
            )}
        </Container>
    )
}