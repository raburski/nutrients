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
		setStateValue(prev => {
			const next = typeof newValue === "function" ? newValue(prev) : newValue
			if (next === undefined) return prev
			localStorage.setItem(storeName, JSON.stringify(next))
			return next
		})
	}
	return [value, setStoredValue]
}
