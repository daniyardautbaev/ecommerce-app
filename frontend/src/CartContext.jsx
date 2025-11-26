// src/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const CART_KEY = 'cart_items'

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // [{ product, quantity }]

  // загрузка из localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CART_KEY)
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {
        setItems([])
      }
    }
  }, [])

  // сохранение в localStorage
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  function addToCart(product, quantity = 1) {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id)
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  function removeFromCart(productId) {
    setItems(prev => prev.filter(i => i.product.id !== productId))
  }

  function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      return removeFromCart(productId)
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId ? { ...i, quantity } : i
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const totalPrice = items.reduce(
    (sum, i) => sum + Number(i.product.price) * i.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
