import { useState } from "react"

function readStoredValue(storeName, defaultValue) {
	try {
		const raw = localStorage.getItem(storeName)
		if (raw === null || raw === "") return defaultValue
		if (raw === "undefined") {
			localStorage.removeItem(storeName)
			return defaultValue
		}
		const parsed = JSON.parse(raw)
		if (parsed === undefined) return defaultValue
		return parsed
	} catch {
		localStorage.removeItem(storeName)
		return defaultValue
	}
}

export function useStorage(storeName, defaultValue) {
	const [value, setStateValue] = useState(() => readStoredValue(storeName, defaultValue))
	function setStoredValue(newValue) {
		if (newValue === undefined) return
		localStorage.setItem(storeName, JSON.stringify(newValue))
		setStateValue(newValue)
	}
	return [value, setStoredValue]
}
