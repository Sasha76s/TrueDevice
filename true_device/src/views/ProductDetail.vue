<template>
  <section class="page-section">
    <div class="site-container max-w-6xl mx-auto">
      <router-link to="/products" class="back-link">← Повернутися до каталогу</router-link>

      <div v-if="product" class="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
        <div class="glass-card product-detail-image__wrapper">
          <img :src="product.image" :alt="product.name" class="product-detail-image__img" />
        </div>

        <div class="glass-card">
          <span class="tag-pill">Товар</span>
          <h1 class="section-title mt-4">{{ product.name }}</h1>
          <p class="product-meta mt-6">{{ product.description }}</p>
          <p class="price mt-8">{{ product.price }} ₴</p>
          <div class="mt-8 flex flex-wrap gap-4">
            <button @click="addToCart" class="btn-primary">Додати до кошика</button>
            <router-link to="/cart" class="btn-secondary">Перейти до кошика</router-link>
          </div>
        </div>
      </div>

      <div v-else class="glass-card text-center">
        <p class="product-meta">Товар не знайдено.</p>
      </div>
    </div>
  </section>
</template>

<script>
import cartStore from '../cartStore.js'
import productsFallback from '../productsData.js'
import { supabase } from '../supabase'

export default {
  name: 'ProductDetail',
  data() {
    return {
      productData: null
    }
  },
  async created() {
    const id = this.$route.params.id
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      this.productData = {
        id: data.id,
        name: data.title,
        description: data.description,
        price: data.price,
        image: data.image_url || '/images/placeholder.png',
        category: data.category || undefined
      }
    } catch (err) {
      console.warn('Failed to load product from Supabase, using fallback.', err)
      const numericId = parseInt(id)
      if (!Number.isNaN(numericId)) {
        this.productData = productsFallback.find(p => p.id === numericId) || null
      } else {
        this.productData = productsFallback.find(p => String(p.id) === String(id)) || null
      }
    }
  },
  computed: {
    product() {
      return this.productData
    }
  },
  methods: {
    addToCart() {
      if (this.product) {
        cartStore.addToCart(this.product)
        alert('Товар додано до кошика!')
      }
    }
  }
}
</script>