import { styled } from "goober"
import Spacer from "./Spacer"

const Container = styled('div')`
    padding: 12px;
`

const Title = styled('h2')`
    margin-top: 0px;

`

const ProductRow = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #BABABA;
    padding: 6px;
    padding-left: 10px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background-color: #e5e5e5;
    }
`

export default function Cart({ sections }) {
    const productDoses = Object.values(sections).flat()
    const products = productDoses.map(pd => pd.product)
    const filteredProducts = products.filter((p, index) => {
        const firstIndex = products.findIndex(p_ => p_.id === p.id)
        return firstIndex === index
    })

    const onProductClick = (product) => product.url ? () => {
        window.open(product.url)
    } : null

    return (
        <Container>
            <Title>All products</Title>
            {filteredProducts.map(product => <ProductRow onClick={onProductClick(product)}>{product.name}<Spacer />{product.url ? '🔗' : ''}</ProductRow>)}
        </Container>
    )
}