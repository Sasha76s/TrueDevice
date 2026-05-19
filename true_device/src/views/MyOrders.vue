<template>
  <section class="page-section">
    <div class="site-container max-w-6xl mx-auto">
      <div class="section-header">
        <div>
          <span class="eyebrow">Мої замовлення</span>
          <h2 class="section-title">Перелік твоїх замовлень</h2>
        </div>
      </div>

      <div class="glass-card p-6">
        <div v-if="loading" class="text-center">Завантаження...</div>
        <div v-else-if="error" class="text-red-600">Помилка: {{ error }}</div>

        <div v-else>
          <p v-if="orders.length === 0" class="section-intro">Замовлень поки немає.</p>

          <div v-for="order in orders" :key="order.id" class="border-b py-4">
            <div class="flex justify-between items-start gap-4">
              <div>
                <div class="text-sm text-slate-500">{{ formatDate(order.created_at) }}</div>
                <div class="font-semibold">Замовлення #{{ order.id }}</div>
                <div class="text-sm text-slate-600">Статус: <strong>{{ order.status }}</strong></div>
              </div>
              <div class="text-right">
                <div class="text-lg font-semibold">{{ order.total }} ₴</div>
              </div>
            </div>

            <div class="mt-3">
              <div class="text-sm text-slate-700">Отримувач: {{ order.full_name }} — {{ order.phone }}</div>
              <div class="text-sm text-slate-700">Місто: {{ order.city }}, Відділення: {{ order.nova_branch }}</div>

              <div class="mt-2">
                <div class="text-sm font-medium">Товари:</div>
                <ul class="list-disc pl-5 text-sm">
                  <li v-for="item in order.order_items" :key="item.product_id">
                    {{ item.name }} — {{ item.quantity }} × {{ item.price }} ₴
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase.js'
import authStore from '../authStore.js'

export default {
  name: 'MyOrders',
  data() {
    return {
      orders: [],
      loading: false,
      error: null
    }
  },
  methods: {
    formatDate(val) {
      if (!val) return ''
      try {
        return new Date(val).toLocaleString('uk-UA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
      } catch (e) {
        return val
      }
    }
  },
  async created() {
    this.loading = true
    try {
      const userId = authStore.state.user?.id
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
      if (userId) query = query.eq('user_id', userId)

      const { data, error } = await query
      if (error) throw error
      // ensure order_items is an array (jsonb)
      this.orders = (data || []).map(o => ({ ...o, order_items: o.order_items || [] }))
    } catch (err) {
      console.error('Load orders error:', err)
      this.error = err.message || String(err)
    } finally {
      this.loading = false
    }
  }
}
</script>

<style scoped>
.section-intro { margin-bottom: 0.75rem }
</style>
