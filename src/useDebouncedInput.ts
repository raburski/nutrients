import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"

export type DebouncedInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => void

export default function useDebouncedInput(
	debounce = 500
): [string | undefined, DebouncedInputChangeHandler, Dispatch<SetStateAction<string | undefined>>] {
	const [currentValue, setCurrentValue] = useState<string | undefined>(undefined)
	const [delayedValue, setDelayedValue] = useState<string | undefined>(undefined)
	const onChange: DebouncedInputChangeHandler = (event) => {
		setCurrentValue(event.target.value)
	}
	useEffect(() => {
		const debounced = setTimeout(() => {
			setDelayedValue(currentValue)
		}, debounce)
		return () => clearTimeout(debounced)
	}, [currentValue, debounce])
	return [delayedValue, onChange, setCurrentValue]
}
