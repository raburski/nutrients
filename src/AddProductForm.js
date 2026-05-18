import { useState } from "react"
import { Macronutrient, Micronutrient } from "./types/nutrient"
import TextField, { NumberField } from "./TextField"
import { createCustomProduct } from "./customProducts"
import Button from "./Button"
import {
	ModalContent,
	ModalTitle,
	ModalSubtitle,
	ModalBody,
	ModalActions,
	ModalFieldRow,
	ModalFieldLabel,
	ModalFieldUnit,
	ModalError,
} from "./modalContent"

function parseMacroValue(value) {
	if (value === "" || value === undefined) return undefined
	const parsed = parseFloat(value)
	return Number.isFinite(parsed) ? parsed : NaN
}

export default function AddProductForm({ onSave, onCancel }) {
	const [name, setName] = useState("")
	const [carbohydrate, setCarbohydrate] = useState("")
	const [protein, setProtein] = useState("")
	const [fat, setFat] = useState("")
	const [fiber, setFiber] = useState("")
	const [error, setError] = useState("")

	const carb = parseMacroValue(carbohydrate)
	const prot = parseMacroValue(protein)
	const fatVal = parseMacroValue(fat)
	const fiberVal = parseMacroValue(fiber)

	const macrosValid = carb !== undefined && prot !== undefined && fatVal !== undefined
		&& !Number.isNaN(carb) && !Number.isNaN(prot) && !Number.isNaN(fatVal)
	const canSave = name.trim().length > 0 && macrosValid

	function onSubmit(e) {
		e.preventDefault()
		if (!canSave) {
			setError("Enter a name and values for carbohydrate, protein, and fat.")
			return
		}
		if (fiber !== "" && Number.isNaN(fiberVal)) {
			setError("Fiber must be a number or left empty.")
			return
		}
		const product = createCustomProduct(name, {
			carbohydrate: carb,
			protein: prot,
			fat: fatVal,
			fiber: fiber !== "" ? fiberVal : undefined,
		})
		onSave(product)
	}

	return (
		<form onSubmit={onSubmit}>
		<ModalContent>
			<ModalTitle>Add product</ModalTitle>
			<ModalSubtitle>Values per 100 g</ModalSubtitle>
			<ModalBody>
				<ModalFieldRow>
					<ModalFieldLabel>Name</ModalFieldLabel>
					<TextField value={name} onChange={e => setName(e.target.value)} style={{ flex: 1, alignSelf: "stretch" }} />
				</ModalFieldRow>
				<ModalFieldRow>
					<ModalFieldLabel>{Macronutrient.Carbohydrate}</ModalFieldLabel>
					<NumberField value={carbohydrate} onChange={e => setCarbohydrate(e.target.value)} />
					<ModalFieldUnit>g</ModalFieldUnit>
				</ModalFieldRow>
				<ModalFieldRow>
					<ModalFieldLabel>{Macronutrient.Protein}</ModalFieldLabel>
					<NumberField value={protein} onChange={e => setProtein(e.target.value)} />
					<ModalFieldUnit>g</ModalFieldUnit>
				</ModalFieldRow>
				<ModalFieldRow>
					<ModalFieldLabel>{Macronutrient.Fat}</ModalFieldLabel>
					<NumberField value={fat} onChange={e => setFat(e.target.value)} />
					<ModalFieldUnit>g</ModalFieldUnit>
				</ModalFieldRow>
				<ModalFieldRow>
					<ModalFieldLabel>{Micronutrient.Fiber} (optional)</ModalFieldLabel>
					<NumberField value={fiber} onChange={e => setFiber(e.target.value)} />
					<ModalFieldUnit>g</ModalFieldUnit>
				</ModalFieldRow>
				{error ? <ModalError>{error}</ModalError> : null}
			</ModalBody>
			<ModalActions>
				<Button type="button" onClick={onCancel}>Cancel</Button>
				<Button type="submit" variant="primary" disabled={!canSave}>Save</Button>
			</ModalActions>
		</ModalContent>
		</form>
	)
}
