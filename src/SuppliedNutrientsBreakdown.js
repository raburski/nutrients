import { styled } from "goober"
import { getProductDoseNutrientAmount } from "./nutrients"
import Spacer from "./Spacer"
import { ModalContent, ModalTitle, ModalBody } from "./modalContent"

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid black;
    padding: 4px;
`

const Size = styled('div')`
    min-width: 50px;
`

export default function SuppliedNutrientsBreakdown({ doses, nutrient }) {
    return (
        <ModalContent>
            <ModalTitle>{nutrient}</ModalTitle>
            <ModalBody>
            {doses.map(d => {
                const nutrientAmount = getProductDoseNutrientAmount(d, nutrient)
                return (
                    <Row key={`${d.product.name}-${d.grams}-${d.servings}`}>
                        <Size>{d.servings ? `${d.servings} serv` : `${d.grams}g ` }</Size>
                        {d.product.name}
                        <Size/>
                        <Spacer/>
                        {Math.round(nutrientAmount.value * 100)/100} 
                        &nbsp;{nutrientAmount.unit}
                    </Row>
                )
            })}
            </ModalBody>
        </ModalContent>
    )
}
