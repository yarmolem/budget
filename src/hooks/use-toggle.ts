import { useState } from 'react'

const useToggle = (initialState?: boolean) => {
  const [isOpen, setIsOpen] = useState(initialState ?? false)

  return {
    isOpen,
    onOpen: () => setIsOpen(true),
    onClose: () => setIsOpen(false),
    onToggle: () => setIsOpen((prev) => !prev)
  }
}

export default useToggle
