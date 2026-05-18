import { styled } from "goober"
import Spacer from "./Spacer"
import { ModalContent, ModalTitle, ModalBody } from "./modalContent"

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

export default function Cart({ productDoses }) {
    const products = productDoses.filter(p => (p.grams > 0 || p.servings > 0)).map(pd => pd.product)
    const filteredProducts = products.filter((p, index) => {
        const firstIndex = products.findIndex(p_ => p_.id === p.id)
        return firstIndex === index
    })

    const onProductClick = (product) => product.url ? () => {
        window.open(product.url)
    } : null

    return (
        <ModalContent>
            <ModalTitle>All products</ModalTitle>
            <ModalBody>
            {filteredProducts.map(product => <ProductRow key={product.id || product.name} onClick={onProductClick(product)}>{product.name}<Spacer />{product.url ? '🔗' : ''}</ProductRow>)}
            </ModalBody>
        </ModalContent>
    )
}
