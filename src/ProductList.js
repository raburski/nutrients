import { styled } from "goober";
import EmojiButton from "./EmojiButton";

const Container = styled('div')`
    display: flex;
    align-self: stretch;
    flex: 1;
    flex-direction: column;
    margin-top: 12px;
    max-height: 80vh;
    border: 1px solid #B0B0B0;
    border-radius: 12px;
    padding: 4px;
    overflow: scroll;
`

const Row = styled('div')`
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid black;
    padding: 4px;
    min-width: 0;
    cursor: pointer;

    &:hover {
        background-color: #f6f6f6;
    }
`

const RowTitle = styled('div')`
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    font-size: 12px;
    text-align: center;
`

const RowValue = styled('div')`
    display: flex;
    margin-right: 12px;
    font-size: 12px;
`

const Button = styled('button')`
    font-size: 12px;
`

function ProductRow({ product, highlightNutrient, onAddClick, onClick, onLinkClick }) {
    const nutrientDose = highlightNutrient ? product.nutrientsPer100g?.find(n => n.nutrient === highlightNutrient) : undefined
    const value = nutrientDose ? `${nutrientDose.amount.value} ${nutrientDose.amount.unit}` : undefined
    return (
        <Row onClick={onClick}><RowTitle>{product.name}</RowTitle> <RowValue>{value}</RowValue>{onLinkClick ? <EmojiButton onClick={onLinkClick}>🔗</EmojiButton> : null}<EmojiButton onClick={onAddClick}>➕</EmojiButton></Row>
    )
}

export default function ProductList({ products = [], highlightNutrient, onAddClick, onClick }) {
    const onLinkClick = (product) => product.url ? (e) => {
        e.cancelBubble = true
        e.stopPropagation && e.stopPropagation()
        window.open(product.url)
    } : null
    return (
        <Container>
            {products.map(product => 
                <ProductRow
                    product={product}   
                    highlightNutrient={highlightNutrient}
                    onAddClick={(e) => {
                        e.cancelBubble = true
                        e.stopPropagation && e.stopPropagation()
                        onAddClick(product)
                    }}
                    onClick={() => onClick(product)}
                    onLinkClick={onLinkClick(product)}
                />
            )}
        </Container>
    )
}