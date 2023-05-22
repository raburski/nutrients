import { useState } from "react"

export function useStorage(storeName, defaultValue) {
    const [value, setStateValue] = useState(JSON.parse(localStorage.getItem(storeName)) || defaultValue)
    function setStoredValue(newValue) {
        localStorage.setItem(storeName, JSON.stringify(newValue))
        setStateValue(newValue)
    }
    return [value, setStoredValue]
}