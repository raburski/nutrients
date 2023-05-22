import { styled } from "goober";
import { useState } from "react";

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    margin-right: 22px;
    border-radius: 12px;
    background-color: #F5F5F5;
    margin-bottom: 12px;
    padding-bottom: 2px;
    overflow: hidden;
`

const Title = styled('h2')`
    margin-bottom: 2px;
    margin-top: 2px;
    margin-left: 4px;
`

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: 1px solid #BABABA;
    padding: 6px;
    padding-left: 10px;
    cursor: pointer;

    &:hover {
        background-color: #e5e5e5;
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

const Controls = styled('div')`
    display: flex;
    flex-direction: row;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 6px;
    padding-left: 6px;
`

const Spread = styled('div')`
    display: flex;
    flex: 1;
`

function ProductDoseRow({ productDose, onRemoveClick, onClick }) {
    const value = productDose.servings ? `${productDose.servings} servings` : `${productDose.grams} g`
    return (
        <Row onClick={onClick}><RowTitle>{productDose.product.name}</RowTitle> <RowValue>{value}</RowValue>{onRemoveClick ? <Button onClick={onRemoveClick}>✕</Button> : null }</Row>
    )
}

export default function ProductDosesList({ title = '', checked = false, productDoses = [], onRemoveProductDoseClick, onClick, onRemoveClick = () => {}, onCheckChange = (a, b) => {}, onSave = (prod, name) => {} }) {
    const [saveName, setSaveName] = useState('')
    const onSaveChange = (e) => setSaveName(e.target.value)
    const onSaveClick = () => {
        setSaveName('')
        onSave(productDoses, saveName)
    }
    const onCheckboxClick = (e) => onCheckChange(title, e.target.checked)
    return (
        <Container>
            <Controls>
                {!title ? <><input type="text" value={saveName} onChange={onSaveChange} placeholder="Meal name"/><button onClick={onSaveClick}>save</button></> : null}
                {title ? <><Title><input checked={checked} type="checkbox" onClick={onCheckboxClick}/> {title}</Title><Spread /><Button onClick={onRemoveClick}>✕</Button></> : null}
            </Controls>
            {productDoses.map(productDose => 
                <ProductDoseRow
                    productDose={productDose}
                    onClick={() => onClick(productDose)}
                    onRemoveClick={!title ? ((e) => {
                        e.cancelBubble = true
                        e.stopPropagation && e.stopPropagation()
                        onRemoveProductDoseClick(productDose)
                    }) : undefined}
            />)}
        </Container>
    )
}