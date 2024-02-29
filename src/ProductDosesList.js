import { styled } from "goober";
import { useEffect, useState } from "react";
import useDebouncedInput from "./useDebouncedInput";
import { downloadString } from "./functions";
import EmojiButton from "./EmojiButton";
import { addNutrientDoses, getNutrientDosesFromProductDose } from "./nutrients";

const Container = styled('div')`
    display: flex;
    flex-direction: column;
    margin-right: 22px;
    border-radius: 12px;
    background-color: ${props => props.isSelected ? '#ebebeb' : '#F5F5F5'};
    margin-bottom: 12px;
    padding-bottom: 2px;
    cursor: pointer;
`

const Title = styled('h2')`
    margin-bottom: 2px;
    margin-top: 2px;
    margin-left: 4px;
    font-size: 20px;
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

const RowValue = styled('div')`
    display: flex;
    font-size: 12px;
    margin-left: 12px;
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

const Button = styled('button')`
    font-size: 10px;
    margin-left: 12px;
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

function ProductDoseRow({ productDose, onRemoveClick, onClick, onValueChange }) {
    const initialValue = productDose.servings ? productDose.servings : productDose.grams
    const [value, onInputValueChange] = useDebouncedInput()
    // const value = productDose.servings ? productDose.servings : productDose.grams
    const unit = productDose.servings ? `servings` : `g`
    useEffect(() => {
        if (value !== undefined) {
            onValueChange(productDose, value)
        }
    }, [value])
    return (
        <Row onClick={onClick}><RowTitle>{productDose.product.name}</RowTitle> <RowValueInput type="text" defaultValue={initialValue} onFocus={cancelEvent} onClick={cancelEvent} onChange={onInputValueChange}/> {unit}{onRemoveClick ? <Button onClick={onRemoveClick}>✕</Button> : null }</Row>
    )
}

export default function ProductDosesList({ isDefault, isSelected, name, checked = false, productDoses = [], onRemoveProductDoseClick, onClick, onProductDoseClick, onRemoveClick = () => {}, onCheckChange = (a, b) => {}, onSave = (prod, name) => {}, onProductDoseValueChange, onUploadClick }) {
    const [saveName, setSaveName] = useState('')
    const onSaveChange = (e) => setSaveName(e.target.value)
    const onSaveClick = (e) => {
        cancelEvent(e); 
        setSaveName('')
        onSave(productDoses, saveName)
    }
    const onCheckboxClick = (e) => onCheckChange(name, e.target.checked)
    const onContainerClick = (e) => { cancelEvent(e); onClick() }
    const onDownloadClick = () => {
        const string = JSON.stringify({
            name,
            doses: productDoses,
        })
        downloadString(string, 'json', `${name}.json`)
    }

    const allProductNutrientDoses = addNutrientDoses(productDoses.flatMap(getNutrientDosesFromProductDose))
    const carbs = allProductNutrientDoses.find(d => d.nutrient === 'Carbohydrate')
    const fat = allProductNutrientDoses.find(d => d.nutrient === 'Fat')
    const protein = allProductNutrientDoses.find(d => d.nutrient === 'Protein')
    const macroString = carbs ? `Carb: ${carbs.amount.value}, Protein: ${protein.amount.value}, Fat: ${fat.amount.value}` : null

    return (
        <Container isSelected={isSelected} onClick={onContainerClick}>
            <Controls>
                {isDefault ? <><input type="text" value={saveName} onChange={onSaveChange} placeholder="Meal name"/><button onClick={onSaveClick}>save</button><Spread /><EmojiButton onClick={onUploadClick}>⬆️</EmojiButton></> : null}
                {!isDefault ? <><Title><input checked={checked} type="checkbox" onClick={onCheckboxClick}/> {name}</Title><Subtitle>{macroString}</Subtitle><Spread /><EmojiButton onClick={onDownloadClick}>⬇️</EmojiButton><Button onClick={onRemoveClick}>✕</Button></> : null}
            </Controls>
            {productDoses.map(productDose => 
                <ProductDoseRow
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