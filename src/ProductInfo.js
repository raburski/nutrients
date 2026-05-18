import NutrientList from "./NutrientList"
import Button from "./Button"
import { ModalContent, ModalTitle, ModalSubtitle, ModalActions } from "./modalContent"

export default function ProductInfo({ product, onDelete }) {
	const doses = product.nutrientsPer100g || product.nutrientsPerServing
	const per = product.nutrientsPer100g ? 'per 100g' : 'per serving'
	return (
		<ModalContent>
			<ModalTitle>{product.name}</ModalTitle>
			<ModalSubtitle>{per}</ModalSubtitle>
			<NutrientList showNames onlyProvided nutrientDoses={doses} />
			{onDelete ? (
				<ModalActions align="start">
					<Button variant="danger" onClick={() => onDelete(product)}>Delete custom product</Button>
				</ModalActions>
			) : null}
		</ModalContent>
	)
}
