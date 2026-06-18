<template>
  <section class="page-section">
    <div class="site-container">
      <div class="section-header">
        <div>
          <span class="eyebrow">Колекція</span>
          <h2 class="section-title">Товари True Device</h2>
        </div>
        <span class="tag-pill">{{ filteredProducts.length }} товарів</span>
      </div>
      <p v-if="debugMessage" class="text-sm product-meta mt-2">{{ debugMessage }}</p>

      <!-- Пошук товарів -->
      <div class="search-bar mb-6">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Пошук товарів за назвою або описом..."
          class="search-input"
        />
      </div>

      <!-- Категорії -->
      <div class="category-filters">
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="['category-button', { 'category-button--active': selectedCategory === category }]"
        >
          {{ category }}
        </button>
      </div>

      <div class="products-grid">
        <article v-for="product in filteredProducts" :key="product.id" class="product-card">
          <div class="product-card-image">
            <img :src="product.image" :alt="product.name" class="product-card-image__img" />
          </div>
          <span class="tag-pill">#{{ product.id }}</span>
          <h3 class="text-2xl font-bold mt-4">{{ product.name }}</h3>
          <p class="product-meta mt-3">{{ product.description }}</p>
          <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span class="price">{{ product.price }} ₴</span>
            <div class="flex flex-wrap gap-3">
              <button @click="addToCart(product)" class="btn-primary">Додати до кошика</button>
              <router-link :to="`/product/${product.id}`" class="btn-secondary">Деталі</router-link>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
import cartStore from '../cartStore.js'
import productsFallback from '../productsData.js'
import { supabase } from '../supabase'

export default {
  name: 'Products',
  data() {
    return {
      selectedCategory: 'Усі',
      categories: ['Усі', 'Телефони', 'Аксесуари', 'Навушники', 'Ноутбуки', 'Планшети', 'Годинники'],
      products: [],
      searchQuery: '',
      debugMessage: ''
    }
  },
  async created() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      console.log('Supabase products response:', { data, error })

      if (error) throw error

      if (!data || data.length === 0) {
        console.warn('No products returned from Supabase, using fallback data.')
        this.debugMessage = 'Не знайдено товарів у Supabase — показуємо локальні дані.'
        this.products = productsFallback
      } else {
        this.debugMessage = `Завантажено ${data.length} товарів із Supabase.`
        this.products = data.map(p => ({
          id: p.id,
          name: p.title,
          description: p.description,
          price: p.price,
          image: p.image_url || '/images/placeholder.png',
          category: p.category || 'Аксесуари'
        }))
      }
    } catch (err) {
      console.warn('Failed to load products from Supabase, using fallback.', err)
      this.debugMessage = 'Помилка при завантаженні з Supabase — показуємо локальні дані.'
      console.error(err)
      this.products = productsFallback
    }
  },
  computed: {
    filteredProducts() {
      let filtered = this.products

      // Фільтр за категорією
      if (this.selectedCategory !== 'Усі') {
        filtered = filtered.filter(product => product.category === this.selectedCategory)
      }

      // Фільтр за пошуком
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query)
        )
      }

      return filtered
    }
  },
  methods: {
    addToCart(product) {
      cartStore.addToCart(product)
      alert('Товар додано до кошика!')
    }
  }
}
</script>