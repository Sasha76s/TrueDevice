<template>
  <section class="page-section">
    <div class="site-container">
      <div class="section-header">
        <div>
          <span class="eyebrow">Кошик</span>
          <h2 class="section-title">Ваші обрані товари</h2>
        </div>
      </div>

      <div class="cart-count-banner" v-if="itemCount > 0">
        У кошику зараз <strong>{{ itemCount }}</strong> {{ itemCount === 1 ? 'товар' : 'товарів' }}
      </div>

      <div v-if="cart.length > 0" class="cart-wrapper">
        <div class="cart-summary-top glass-card">
          <div>
            <p class="card-accent">Підсумок замовлення</p>
            <p class="product-meta">Всього товарів у кошику: <strong>{{ itemCount }}</strong></p>
            <p v-if="orderSuccess" class="text-sm text-emerald-600 mt-2">Замовлення оформлено успішно! Ми зв’яжемося з вами найближчим часом.</p>
          </div>
          <div class="cart-summary-top-actions">
            <p class="price cart-summary-total">{{ total }} ₴</p>
            <router-link to="/checkout" class="btn-primary">Оформити замовлення</router-link>
          </div>
        </div>

        <div class="glass-card cart-items-list">
          <div v-for="item in cart" :key="item.id" class="cart-item">
            <div class="cart-item-top">
              <img :src="item.image" :alt="item.name" class="cart-item-image" />
              <div class="cart-item-info">
                <h3 class="cart-item-title">{{ item.name }}</h3>
                <p class="product-meta cart-item-description">{{ item.category || 'Товар' }}</p>
                <p class="cart-item-price">{{ item.price }} ₴</p>
              </div>
            </div>

            <div class="cart-item-actions">
              <span class="tag-pill cart-item-quantity">x{{ item.quantity }}</span>
              <button @click="removeFromCart(item.id)" class="btn-secondary btn-secondary--small">Видалити</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="glass-card text-center">
        <p class="section-intro">Ваш кошик поки порожній.</p>
        <router-link to="/products" class="btn-primary mt-6 inline-flex">Переглянути товари</router-link>
      </div>
    </div>
  </section>
</template>

<script>
import cartStore from '../cartStore.js'

export default {
  name: 'Cart',
  data() {
    return {
      orderSuccess: false
    }
  },
  computed: {
    cart() {
      return cartStore.state.items
    },
    itemCount() {
      return cartStore.itemCount.value
    },
    total() {
      return cartStore.total.value
    }
  },
  methods: {
    removeFromCart(id) {
      cartStore.removeFromCart(id)
    }
  }
}
</script>