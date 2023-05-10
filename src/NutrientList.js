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
    border-bottom: 1px solid black;
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

function NutrientRow({ nutrient, showName, nutrientDose = {} }) {
    const isCovered = nutrientDose.amount && nutrientDose.amount.value < 0
    const value = nutrientDose?.amount ? Math.round(nutrientDose?.amount?.value * 100)/100 : undefined
    return (
        <Row><RowTitle>{isCovered ? '✅ ' : null}{showName ? nutrient : ''}</RowTitle> <RowValue>{value} {nutrientDose?.amount?.unit}</RowValue></Row>
    )
}

export default function NutrientList({ nutrientDoses = [], showNames, onlyProvided }) {
    const nutrients = onlyProvided ? nutrientDoses.map(d => d.nutrient) : allNutrients
    return (
        <Container>
            {nutrients.map(nutrient => {
                return <NutrientRow nutrient={nutrient} showName={showNames} nutrientDose={nutrientDoses.find(dose => dose.nutrient === nutrient )} />
            }
            )}
        </Container>
    )
}