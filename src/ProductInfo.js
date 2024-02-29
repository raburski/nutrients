import { styled } from "goober"
import NutrientList from "./NutrientList"

const Container = styled('div')`
    padding: 12px;
`

const Title = styled('h2')`
    margin-top: 0px;
    margin-bottom: 0px;
`

const Subtitle = styled('div')`
    margin-top: 0px;
    margin-bottom: 16px;
    font-size: 12px;
`

export default function ProductInfo({ product }) {
    const doses = product.nutrientsPer100g || product.nutrientsPerServing
    const per = product.nutrientsPer100g ? 'per 100g' : 'per serving'
    return (
        <Container>
            <Title>{product.name}</Title>
            <Subtitle>{per}</Subtitle>
            <NutrientList showNames onlyProvided nutrientDoses={doses} />
        </Container>
    )
}