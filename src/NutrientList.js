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
    min-height: 22px;
`

const RowValue = styled('div')`
    display: flex;
    margin-right: 22px;
`

function NutrientRow({ nutrient, nutrientDose = {} }) {
    const isCovered = nutrientDose.amount && nutrientDose.amount.value < 0
    return (
        <Row><RowTitle>{isCovered ? '✅ ' : null}{nutrient}</RowTitle> <RowValue>{nutrientDose?.amount?.value} {nutrientDose?.amount?.unit}</RowValue></Row>
    )
}

export default function NutrientList({ nutrientDoses = [] }) {
    return (
        <Container>
            {allNutrients.map(nutrient => {
                console.log('nutrient row', nutrient, nutrientDoses.find(dose => dose.nutrient === nutrient ))
                return <NutrientRow nutrient={nutrient} nutrientDose={nutrientDoses.find(dose => dose.nutrient === nutrient )} />
            }
            )}
        </Container>
    )
}