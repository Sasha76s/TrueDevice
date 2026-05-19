<template>
  <section class="page-section">
    <div class="site-container max-w-6xl mx-auto">
      <div class="section-header">
        <div>
          <span class="eyebrow">Оформлення замовлення</span>
          <h2 class="section-title">Введіть ваші дані для доставки</h2>
        </div>
      </div>

      <div v-if="orderPlaced" class="glass-card checkout-confirmation-card p-10 text-center">
        <span class="tag-pill">Підтвердження</span>
        <h3 class="text-3xl font-semibold mt-4">Дякуємо за ваше замовлення!</h3>
        <p class="product-meta mt-4">Ми отримали ваше замовлення і зв’яжемося з вами найближчим часом.</p>
        <div class="mt-6 text-left max-w-md mx-auto">
          <p v-if="orderId" class="product-meta"><strong>Номер замовлення:</strong> {{ orderId }}</p>
          <p class="product-meta"><strong>Ім’я та прізвище:</strong> {{ fullName }}</p>
          <p class="product-meta"><strong>Телефон:</strong> {{ phone }}</p>
          <p class="product-meta"><strong>Місто:</strong> {{ city }}</p>
          <p class="product-meta"><strong>Відділення Нової Пошти:</strong> {{ novaBranch }}</p>
          <p class="product-meta"><strong>Сума замовлення:</strong> {{ orderTotal }} ₴</p>
        </div>
        <router-link to="/products" class="btn-primary mt-8 inline-flex">Продовжити покупки</router-link>
      </div>

      <div v-else-if="cart.length > 0" class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="glass-card checkout-form-card p-8">
          <p class="section-intro">Заповніть дані, щоб ми могли оформити доставку.</p>
          <form @submit.prevent="submitOrder" class="space-y-6 mt-8">
            <div class="checkout-form-field">
              <label class="checkout-form-label">Ім’я та прізвище</label>
              <input v-model.trim="fullName" type="text" required class="checkout-input" placeholder="Ім’я та прізвище" />
            </div>
            <div class="checkout-form-field">
              <label class="checkout-form-label">Телефон</label>
              <input v-model.trim="phone" type="tel" required class="checkout-input" placeholder="+380 63 123 45 67" />
            </div>
            <div class="checkout-form-field">
              <label class="checkout-form-label">Місто</label>
              <input v-model.trim="city" type="text" required class="checkout-input" placeholder="Наприклад, Львів" />
            </div>
            <div class="checkout-form-field">
              <label class="checkout-form-label">Відділення Нової Пошти</label>
              <input v-model.trim="novaBranch" type="text" required class="checkout-input" placeholder="№ відділення або адреса" />
            </div>
            <div class="checkout-form-field">
              <label class="checkout-form-label">Коментар до замовлення</label>
              <textarea v-model.trim="comment" rows="4" class="checkout-input checkout-textarea" placeholder="Додаткові побажання"></textarea>
            </div>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <p class="product-meta">Загальна сума: <strong>{{ total }} ₴</strong></p>
              <button type="submit" class="btn-primary">Підтвердити замовлення</button>
            </div>
          </form>
        </div>

        <div class="glass-card checkout-summary-card p-8">
          <span class="tag-pill">Підсумок</span>
          <div class="mt-6 space-y-4">
            <div v-for="item in cart" :key="item.id" class="border-b border-slate-200 pb-4">
              <div class="flex items-center gap-4">
                <img :src="item.image" :alt="item.name" class="w-20 h-20 rounded-3xl object-cover" />
                <div>
                  <h4 class="font-semibold text-lg">{{ item.name }}</h4>
                  <p class="text-sm text-slate-600">{{ item.quantity }} x {{ item.price }} ₴</p>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-6">
            <p class="product-meta">Всього товарів: <strong>{{ itemCount }}</strong></p>
            <p class="text-xl font-semibold mt-2">Сума: {{ total }} ₴</p>
          </div>
        </div>
      </div>

      <div v-else class="glass-card text-center p-10">
        <p class="section-intro">Ваш кошик порожній, додайте товар для оформлення замовлення.</p>
        <router-link to="/products" class="btn-primary mt-6 inline-flex">Переглянути товари</router-link>
      </div>
    </div>
  </section>
</template>

<script>
import cartStore from '../cartStore.js'
import authStore from '../authStore.js'
import { supabase } from '../supabase.js'

export default {
  name: 'Checkout',
  data() {
    return {
      fullName: '',
      phone: '',
      city: '',
      novaBranch: '',
      comment: '',
      orderPlaced: false,
      orderTotal: 0,
      orderId: null
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
    },
    isAuthenticated() {
      return authStore.isAuthenticated.value
    }
  },
  methods: {
    async submitOrder() {
      if (!this.isAuthenticated) {
        alert('Будь ласка, увійдіть або зареєструйтесь, щоб зберегти замовлення в базі даних.')
        return
      }

      if (!this.fullName || !this.phone || !this.city || !this.novaBranch) {
        alert('Будь ласка, заповніть усі обов’язкові поля.')
        return
      }

      const orderPayload = {
        user_id: authStore.state.user?.id || null,
        user_email: authStore.state.user?.email || null,
        full_name: this.fullName,
        phone: this.phone,
        city: this.city,
        nova_branch: this.novaBranch,
        comment: this.comment,
        order_items: this.cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: this.total
      }

      const { data, error } = await supabase.from('orders').insert([orderPayload])

      if (error) {
        console.error('Order save error:', error)
        alert('Не вдалося зберегти замовлення. Спробуйте ще раз.')
        return
      }

      this.orderTotal = this.total
      this.orderId = data?.[0]?.id || null
      this.orderPlaced = true
      cartStore.clearCart()
    }
  }
}
</script>
