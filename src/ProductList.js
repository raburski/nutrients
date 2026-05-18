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
    border: 1px solid #d4d4d4;
    border-radius: 12px;
    padding: 4px;
    overflow: scroll;
    background-color: #fafafa;
`

const Row = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #e4e4e4;
    padding: 8px 6px;
    min-width: 0;
    cursor: pointer;

    &:last-child {
        border-bottom: none;
    }

    &:hover {
        background-color: #f0f0f0;
    }
`

const RowMain = styled('div')`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
`

const TopLine = styled('div')`
    display: flex;
    align-items: center;
    min-width: 0;
`

const BottomLine = styled('div')`
    font-size: 11px;
    line-height: 1.35;
    color: #6b6b6b;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const SourceIcon = styled('img')`
    width: 18px;
    height: 18px;
    margin-right: 8px;
    flex-shrink: 0;
    border-radius: 4px;
    object-fit: contain;
    background-color: #eee;
`

const ProductName = styled('span')`
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
    color: #1a1a1a;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`

const RowActions = styled('div')`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 2px;
`

function getBottomLineText(product, highlightNutrient, nutrientDose, sourceDisplay) {
	if (highlightNutrient && nutrientDose) {
		return `${highlightNutrient}: ${nutrientDose.amount.value} ${nutrientDose.amount.unit}`
	}
	if (sourceDisplay) return sourceDisplay.name
	if (product.nutrientsPerServing?.length) return "Per serving"
	return null
}

function ProductRow({ product, highlightNutrient, onAddClick, onClick, onLinkClick }) {
	const nutrientDose = highlightNutrient
		? (product.nutrientsPer100g?.find(n => n.nutrient === highlightNutrient)
			|| product.nutrientsPerServing?.find(n => n.nutrient === highlightNutrient))
		: undefined
	const sourceDisplay = getProductSourceDisplay(product)
	const bottomLine = getBottomLineText(product, highlightNutrient, nutrientDose, sourceDisplay)
	const iconWidth = sourceDisplay ? 26 : 0

	return (
		<Row onClick={onClick}>
			<RowMain>
				<TopLine>
					{sourceDisplay ? (
						<SourceIcon
							src={sourceDisplay.faviconUrl}
							alt=""
							title={sourceDisplay.name}
						/>
					) : null}
					<ProductName>{product.name}</ProductName>
				</TopLine>
				{bottomLine ? (
					<BottomLine style={{ paddingLeft: iconWidth }}>
						{bottomLine}
					</BottomLine>
				) : null}
			</RowMain>
			<RowActions>
				{onLinkClick ? <EmojiButton onClick={onLinkClick}>🔗</EmojiButton> : null}
				<EmojiButton onClick={onAddClick}>➕</EmojiButton>
			</RowActions>
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
