import { styled } from "goober"
import EmojiButton from "./EmojiButton"
import { getProductSourceDisplay } from "./productSourceDisplay"

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
    align-items: center;
    font-size: 12px;
    text-align: left;
    min-width: 0;
`

const SourceIcon = styled('img')`
    width: 16px;
    height: 16px;
    margin-right: 8px;
    flex-shrink: 0;
    border-radius: 3px;
    object-fit: contain;
    background-color: #f5f5f5;
`

const ProductName = styled('span')`
    overflow: hidden;
    text-overflow: ellipsis;
`

const RowValue = styled('div')`
    display: flex;
    margin-right: 12px;
    font-size: 12px;
    flex-shrink: 0;
`

function ProductRow({ product, highlightNutrient, onAddClick, onClick, onLinkClick }) {
    const nutrientDose = highlightNutrient
        ? (product.nutrientsPer100g?.find(n => n.nutrient === highlightNutrient)
            || product.nutrientsPerServing?.find(n => n.nutrient === highlightNutrient))
        : undefined
    const value = nutrientDose ? `${nutrientDose.amount.value} ${nutrientDose.amount.unit}` : undefined
    const sourceDisplay = getProductSourceDisplay(product)

    return (
        <Row onClick={onClick}>
            <RowTitle>
                {sourceDisplay ? (
                    <SourceIcon
                        src={sourceDisplay.faviconUrl}
                        alt=""
                        title={sourceDisplay.name}
                    />
                ) : null}
                <ProductName>{product.name}</ProductName>
            </RowTitle>
            <RowValue>{value}</RowValue>
            {onLinkClick ? <EmojiButton onClick={onLinkClick}>🔗</EmojiButton> : null}
            <EmojiButton onClick={onAddClick}>➕</EmojiButton>
        </Row>
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
                    key={product.id || product.name}
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
