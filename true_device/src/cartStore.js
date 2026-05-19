import { reactive, computed } from 'vue'

const state = reactive({
  items: []
})

function addToCart(product) {
  const item = state.items.find(item => item.id === product.id)
  if (item) {
    item.quantity += 1
  } else {
    state.items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category || 'Товар',
      quantity: 1
    })
  }
}

function removeFromCart(id) {
  state.items = state.items.filter(item => item.id !== id)
}

function clearCart() {
  state.items = []
}

const total = computed(() => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0))

const itemCount = computed(() => state.items.reduce((sum, item) => sum + item.quantity, 0))

export default {
  state,
  addToCart,
  removeFromCart,
  clearCart,
  total,
  itemCount
}
