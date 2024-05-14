import { styled } from "goober";
import { NutrientAmount, NutrientDose, NutrientUnit, allNutrients, nutrientsToxicity, waterSoluableNutrients } from "./types/nutrient";
import { calcCalorieDoes, subAmounts } from "./nutrients";
import { allDosesNutrients } from "./types/doses";

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

    &:hover {
        background-color: ${props => props.onClick ? '#e5e5e5' : 'transparent'};
        cursor: ${props => props.onClick ? 'pointer' : 'default'};
    }
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

function NutrientRow({ onClick, nutrient, showName, nutrientDose = {}, optimalNutrientDose = {}, separated = false }) {
    const isCovered = nutrientDose.amount && nutrientDose.amount.value < 0
    const isTooHigh = nutrientDose.amount && optimalNutrientDose.amount && (-1 * nutrientDose.amount.value > optimalNutrientDose.amount.value * 1.2)
    const isTooLow = nutrientDose.amount && optimalNutrientDose.amount && nutrientDose.amount.value !== optimalNutrientDose.amount.value && (nutrientDose.amount.value > optimalNutrientDose.amount.value * 0.3)
    const isToxic = nutrientDose.amount && nutrientsToxicity[nutrient] && subAmounts(nutrientDose.amount, nutrientsToxicity[nutrient]).value >= 0 
    const value = nutrientDose?.amount ? Math.round(nutrientDose?.amount?.value * 100)/100 : undefined
    const tooHighIcon = waterSoluableNutrients.includes(nutrient) ? '💧' : '⬆️'
    return (
        <Row separated={separated} onClick={onClick}>
            <RowTitle>
                {isCovered ? '✅ ' : null}
                {isTooHigh ? `${tooHighIcon} ` : null}
                {isTooLow ? '🟡 ' : null}
                {isToxic ? '🆘 TOXIC 🆘 ' : null}
                {showName ? nutrient : ''}
            </RowTitle> 
            <RowValue>{value} {nutrientDose?.amount?.unit}</RowValue>
        </Row>
    )
}

const CALORIE_NUTRIENT = 'Calories'

export default function NutrientList({ onNutrientClick, nutrientDoses = [], optimalNutrientDoses = [], showNames = false, onlyProvided = false }) {
    const nutrients = onlyProvided ? allNutrients.filter(nutrient => nutrientDoses.filter(dose => dose.nutrient === nutrient).length > 0) : allDosesNutrients
    const calorieDose = calcCalorieDoes(nutrientDoses)
    function shouldSeparate(nutrient) {
        return nutrient === 'Fat' || nutrient === 'Zinc'
    }
    return (
        <Container>
            {calorieDose ? <NutrientRow separated nutrient={CALORIE_NUTRIENT} showName={showNames} nutrientDose={calorieDose}/> : null}
            {nutrients.map(nutrient => {
                return (
                    <NutrientRow
                        key={nutrient}
                        onClick={onNutrientClick ? () => onNutrientClick(nutrient) : null}
                        separated={shouldSeparate(nutrient)}
                        nutrient={nutrient}
                        showName={showNames}
                        nutrientDose={nutrientDoses.find(dose => dose.nutrient === nutrient )}
                        optimalNutrientDose={optimalNutrientDoses.find(dose => dose.nutrient === nutrient )}
                    />
                )
            })}
        </Container>
    )
}