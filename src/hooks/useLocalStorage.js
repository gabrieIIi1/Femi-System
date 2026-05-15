import { useState, useEffect } from "react"

/**
 * Igual useState, mas persiste no localStorage.
 * @param {string} key   - chave no localStorage
 * @param {*} initial    - valor inicial (usado se a chave não existir)
 */
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  return [value, setValue]
}
