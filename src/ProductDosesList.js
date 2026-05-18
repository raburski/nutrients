import { styled } from "goober";
import React, { useEffect, useState } from "react";
import useDebouncedInput from "./useDebouncedInput";
import EmojiButton from "./EmojiButton"
import Button from "./Button"
import { addNutrientDoses, calcCalorieDoes, getNutrientDosesFromProductDose } from "./nutrients";

const Container = styled('div', React.forwardRef)`
    display: flex;
    flex-direction: column;
    margin-right: 22px;
    border-radius: 12px;
    border: 1px solid;
    background-color: ${props => props.isSelected ? '#ebebeb' : '#F5F5F5'};
    border-color: ${props => props.isSelected ? '#d6d6d6' : 'white'};
    margin-bottom: 12px;

    cursor: pointer;
    overflow: hidden;
    flex-shrink: 0;
`

const Title = styled('h2')`
    margin-bottom: 2px;
    margin-top: 2px;
    margin-left: 4px;
    font-size: 20px;
    padding-bottom: 2px;
`

const Subtitle = styled('div')`
    margin-bottom: 6px;
    margin-top: 8px;
    margin-left: 8px;
    font-size: 12px;
`

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: 1px solid #BABABA;
    padding: 6px;
    padding-left: 10px;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        background-color: #e5e5e5;
    }
`

const RowTitle = styled('div')`
    display: flex;
    flex: 1;
    font-size: 12px;
`

const RowValueInput = styled('input')`
    text-align: right;
    margin-right: 4px;
    width: 60px;
    background-color: transparent;
    border-width: 0px;
    font-size: 12px;
    border-radius: 4px;

    &:hover {
        background-color: #F5F5F5;
    }
`

const Controls = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: stretch;
    padding-top: 8px;
    padding-bottom: 8px;
    padding-right: 6px;
    padding-left: 6px;
`

const Spread = styled('div')`
    display: flex;
    flex: 1;
`

function cancelEvent(e) {
    e.cancelBubble = true
    e.stopPropagation && e.stopPropagation()
}

const truncateString = (string = '', maxLength = 50) => 
  string.length > maxLength 
    ? `${string.substring(0, maxLength)}…`
    : string

function ProductDoseRow({ productDose, onRemoveClick, onClick, onValueChange }) {
    const initialValue = productDose.servings ? productDose.servings : productDose.grams
    const [value, onInputValueChange] = useDebouncedInput()
    // const value = productDose.servings ? productDose.servings : productDose.grams
    const unit = productDose.servings ? `servings` : `g`
    useEffect(() => {
        if (value !== undefined) {
            onValueChange(productDose, value)
        }
    }, [value, onValueChange, productDose])
    return (
        <Row onClick={onClick}><RowTitle>{truncateString(productDose.product.name, 50)}</RowTitle> <RowValueInput type="text" defaultValue={initialValue} onFocus={cancelEvent} onClick={cancelEvent} onChange={onInputValueChange}/> {unit}{onRemoveClick ? <Button type="button" variant="ghost" size="small" onClick={onRemoveClick}>✕</Button> : null }</Row>
    )
}

export default function ProductDosesList({ innerRef, isDefault, isSelected, isCollapsed, name, checked = false, productDoses = [], onRemoveProductDoseClick, onClick, onProductDoseClick, onCollapse, onRemoveClick = () => {}, onCheckChange = (a, b) => {}, onSave = (prod, name) => {}, onProductDoseValueChange, ...props }) {
    const [saveName, setSaveName] = useState('')
    const onSaveChange = (e) => setSaveName(e.target.value)
    const onSaveClick = (e) => {
        cancelEvent(e); 
        setSaveName('')
        onSave(productDoses, saveName)
    }
    const onCheckboxClick = (e) => onCheckChange(name, e.target.checked)
    const onContainerClick = (e) => { cancelEvent(e); onClick() }

    const onCollapseClick = (e) => {
        cancelEvent(e)
        onCollapse()
    }

    const allProductNutrientDoses = addNutrientDoses(productDoses.flatMap(getNutrientDosesFromProductDose))
    const carbs = allProductNutrientDoses.find(d => d.nutrient === 'Carbohydrate')
    const fat = allProductNutrientDoses.find(d => d.nutrient === 'Fat')
    const protein = allProductNutrientDoses.find(d => d.nutrient === 'Protein')
    const calorieDose = calcCalorieDoes(allProductNutrientDoses)
    const macroString = carbs ? `C: ${carbs ? Math.round(carbs.amount.value) : 0}, P: ${protein ? Math.round(protein.amount.value) : 0}, F: ${fat ? Math.round(fat.amount.value) : 0}, ${calorieDose?.amount?.value} calories` : null

    return (
        <Container isSelected={isSelected} ref={innerRef} onClick={onContainerClick} {...props}>
            <Controls>
                {isDefault ? <><input type="text" value={saveName} onChange={onSaveChange} placeholder="Meal name"/><Button type="button" variant="primary" size="small" onClick={onSaveClick}>Save meal</Button><Spread /></> : null}
                {!isDefault ? 
                    <>
                        <Title><input checked={checked} type="checkbox" onClick={onCheckboxClick}/> {name}</Title>
                        <Subtitle>{macroString}</Subtitle>
                        <Spread />
                        <EmojiButton onClick={onCollapseClick}>{isCollapsed ? '🔽' : '🔼'}</EmojiButton>
                        <Button type="button" variant="ghost" size="small" onClick={onRemoveClick}>✕</Button>
                    </> : null}
            </Controls>
            {!isCollapsed && productDoses.map(productDose => 
                <ProductDoseRow
                    key={`${name}:${productDose.product.name}`}
                    productDose={productDose}
                    onClick={(e) => { cancelEvent(e); onProductDoseClick(productDose)} }
                    onValueChange={onProductDoseValueChange}
                    onRemoveClick={(e) => {
                        cancelEvent(e)
                        onRemoveProductDoseClick(name, productDose)
                    }}
            />)}
        </Container>
    )
}