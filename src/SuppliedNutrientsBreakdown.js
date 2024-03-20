import { styled } from "goober"
import { getProductDoseNutrientAmount } from "./nutrients"
import Spacer from "./Spacer"

const Container = styled('div')`
    padding: 12px;
`

const Title = styled('h2')`
    margin-top: 0px;
    margin-bottom: 14px;
`

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    border-bottom: ${props => props.separated ? '2px' : '1px'} solid black;
    padding: 4px;
`

const Size = styled('div')`
    min-width: 50px;
`

export default function SuppliedNutrientsBreakdown({ doses, nutrient }) {
    return (
        <Container>
            <Title>{nutrient}</Title>
            {doses.map(d => {
                const nutrientAmount = getProductDoseNutrientAmount(d, nutrient)
                return (
                    <Row>
                        <Size>{d.grams ? `${d.grams}g ` : `${d.servings} serv`}</Size>
                        {d.product.name}
                        <Size/>
                        <Spacer/>
                        {Math.round(nutrientAmount.value * 100)/100} 
                        &nbsp;{nutrientAmount.unit}
                    </Row>
                )
            })}
        </Container>
    )
}