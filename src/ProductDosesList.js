import { styled } from "goober";

const Container = styled('div')`
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-right: 22px;
`

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid black;
    padding: 4px;
    cursor: pointer;

    &:hover {
        background-color: #f6f6f6;
    }
`

const RowTitle = styled('div')`
    display: flex;
    flex: 1;
    font-size: 12px;
`

const RowValue = styled('div')`
    display: flex;
    font-size: 12px;
    margin-left: 12px;
`

const Button = styled('button')`
    font-size: 10px;
    margin-left: 12px;
`

function ProductDoseRow({ productDose, onRemoveClick, onClick }) {
    const value = productDose.servings ? `${productDose.servings} servings` : `${productDose.grams} g`
    return (
        <Row onClick={onClick}><RowTitle>{productDose.product.name}</RowTitle> <RowValue>{value}</RowValue><Button onClick={onRemoveClick}>✕</Button></Row>
    )
}

export default function ProductDosesList({ productDoses = [], onRemoveClick, onClick }) {
    return (
        <Container>
            {productDoses.map(productDose => <ProductDoseRow productDose={productDose} onClick={() => onClick(productDose)} onRemoveClick={(e) => {
                e.cancelBubble = true
                e.stopPropagation && e.stopPropagation()
                onRemoveClick(productDose)
            }}/>)}
        </Container>
    )
}