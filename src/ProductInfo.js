import { styled } from "goober"
import NutrientList from "./NutrientList"

const Container = styled('div')`
    padding: 12px;
`

export default function ProductInfo({ product }) {
    const doses = product.nutrientsPer100g || product.nutrientsPerServing
    return (
        <Container>
            {product.name}<br/><br/>
            <NutrientList showNames onlyProvided nutrientDoses={doses} />
        </Container>
    )
}