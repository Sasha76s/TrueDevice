<template>
  <section class="page-section">
    <div class="site-container">
      <div class="section-header">
        <div>
          <span class="eyebrow">Управління</span>
          <h2 class="section-title">Адмін-панель</h2>
        </div>
      </div>

      <!-- Форма додавання товару -->
      <div class="admin-form">
        <h3 class="text-2xl font-bold mb-6">
          {{ editingProductId ? 'Редагувати товар' : 'Додати новий товар' }}
        </h3>
        <p v-if="editingProductId" class="text-muted mb-6">
          Ви редагуєте товар: <strong>{{ newProduct.title || 'Оберіть товар' }}</strong>
        </p>

        <form @submit.prevent="submitProduct" class="form-grid">
          <div class="form-group">
            <label for="title" class="form-label">Назва товару *</label>
            <input
              id="title"
              v-model="newProduct.title"
              type="text"
              required
              class="form-input"
              placeholder="Наприклад: iPhone 15"
            />
          </div>

          <div class="form-group">
            <label for="category" class="form-label">Категорія *</label>
            <select
              id="category"
              v-model="newProduct.category"
              required
              class="form-input"
            >
              <option disabled value="">Виберіть категорію</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="price" class="form-label">Ціна (₴) *</label>
            <input
              id="price"
              v-model.number="newProduct.price"
              type="number"
              inputmode="decimal"
              required
              min="0"
              step="0.001"
              class="form-input"
              placeholder="0.000"
            />
          </div>

          <div class="form-group">
            <label for="image_url" class="form-label">URL зображення</label>
            <input
              id="image_url"
              v-model="newProduct.image_url"
              type="url"
              class="form-input"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div class="form-group form-group--full">
            <label for="description" class="form-label">Опис товару</label>
            <textarea
              id="description"
              v-model="newProduct.description"
              class="form-input form-textarea"
              rows="4"
              placeholder="Детальний опис товару..."
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="isLoading" class="btn-primary">
              {{ isLoading ? (editingProductId ? 'Зберігаємо...' : 'Додаємо...') : (editingProductId ? 'Зберегти зміни' : 'Додати товар') }}
            </button>
            <button type="reset" @click="resetForm" class="btn-secondary">
              {{ editingProductId ? 'Скасувати' : 'Очистити форму' }}
            </button>
          </div>

          <div v-if="successMessage" class="alert alert--success">
            {{ successMessage }}
          </div>
          <div v-if="errorMessage" class="alert alert--error">
            {{ errorMessage }}
          </div>
        </form>
      </div>

      <!-- Список товарів -->
      <div class="admin-products mt-12">
        <h3 class="text-2xl font-bold mb-6">Список товарів ({{ products.length }})</h3>

        <div v-if="products.length === 0" class="text-center py-8">
          <p class="text-muted">Немає товарів. Додайте перший товар вище.</p>
        </div>

        <div v-else class="products-table">
          <div class="table-header">
            <div class="table-cell">Назва</div>
            <div class="table-cell">Категорія</div>
            <div class="table-cell">Ціна</div>
            <div class="table-cell">Дії</div>
          </div>

          <div v-for="product in products" :key="product.id" class="table-row">
            <div class="table-cell" data-label="Назва">
              <span class="font-semibold">{{ product.title }}</span>
              <p class="text-sm text-muted">{{ product.description }}</p>
            </div>
            <div class="table-cell" data-label="Категорія">
              <span class="tag-pill">{{ product.category }}</span>
            </div>
            <div class="table-cell" data-label="Ціна">
              <span class="price">{{ product.price }} ₴</span>
            </div>
            <div class="table-cell" data-label="Дії">
              <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
              <button
                type="button"
                @click="startEditing(product)"
                class="btn-secondary btn-admin-small"
              >
                Редагувати
              </button>
              <button
                @click="deleteProduct(product.id)"
                :disabled="isDeleting"
                class="btn-danger btn-admin-small"
              >
                {{ isDeleting ? '...' : 'Видалити' }}
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase'
import authStore from '../authStore.js'

export default {
  name: 'Admin',
  data() {
    return {
      newProduct: {
        title: '',
        category: '',
        price: 0,
        image_url: '',
        description: ''
      },
      editingProductId: null,
      categories: ['Телефони', 'Аксесуари', 'Навушники', 'Ноутбуки', 'Планшети', 'Годинники'],
      products: [],
      isLoading: false,
      isDeleting: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  async created() {
    // Перевірка, чи поточний користувач — адміністратор (за email)
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase()
    const userEmail = (authStore.state.user?.email || '').toLowerCase()

    if (!adminEmail || userEmail !== adminEmail) {
      // Якщо не адміністратор — перенаправити на профіль
      this.$router.push('/profile')
      return
    }

    await this.loadProducts()
  },
  methods: {
    async submitProduct() {
      // Валідація
      const priceVal = this.newProduct.price
      if (!this.newProduct.title || !this.newProduct.category || priceVal === null || priceVal === '' || isNaN(priceVal) || Number(priceVal) < 0) {
        this.errorMessage = 'Заповніть всі обов\'язкові поля і вкажіть коректну ціну'
        return
      }

      this.isLoading = true
      this.successMessage = ''
      this.errorMessage = ''

      try {
        if (this.editingProductId) {
          const { error } = await supabase
            .from('products')
            .update({
              title: this.newProduct.title,
              category: this.newProduct.category,
              price: this.newProduct.price,
              image_url: this.newProduct.image_url,
              description: this.newProduct.description
            })
            .eq('id', this.editingProductId)

          if (error) throw error

          this.successMessage = '✓ Товар успішно оновлено!'
          this.editingProductId = null
        } else {
          const { data, error } = await supabase
            .from('products')
            .insert([
              {
                title: this.newProduct.title,
                category: this.newProduct.category,
                price: this.newProduct.price,
                image_url: this.newProduct.image_url,
                description: this.newProduct.description
              }
            ])
            .select()

          if (error) throw error

          this.successMessage = '✓ Товар успішно додано!'
        }

        this.resetForm()
        await this.loadProducts()

        // Приховати повідомлення через 3 секунди
        setTimeout(() => {
          this.successMessage = ''
        }, 3000)
      } catch (err) {
        console.error('Error adding product:', err)
        this.errorMessage = `Помилка: ${err.message || 'Не вдалося додати товар'}`
      } finally {
        this.isLoading = false
      }
    },

    async loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        this.products = data || []
      } catch (err) {
        console.error('Error loading products:', err)
        this.errorMessage = 'Не вдалося завантажити товари'
      }
    },

    async deleteProduct(productId) {
      if (!confirm('Ви впевнені, що хочете видалити цей товар?')) return

      if (this.editingProductId === productId) {
        this.resetForm()
      }

      this.isDeleting = true
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)

        if (error) throw error

        this.successMessage = '✓ Товар видалено!'
        await this.loadProducts()

        setTimeout(() => {
          this.successMessage = ''
        }, 3000)
      } catch (err) {
        console.error('Error deleting product:', err)
        this.errorMessage = 'Не вдалося видалити товар'
      } finally {
        this.isDeleting = false
      }
    },

    startEditing(product) {
      this.editingProductId = product.id
      this.newProduct = {
        title: product.title,
        category: product.category,
        price: product.price,
        image_url: product.image_url,
        description: product.description
      }
      this.successMessage = ''
      this.errorMessage = ''
    },

    resetForm() {
      this.editingProductId = null
      this.newProduct = {
        title: '',
        category: '',
        price: 0,
        image_url: '',
        description: ''
      }
      this.errorMessage = ''
    }
  }
}
</script>

<style scoped>
.admin-form {
  background: var(--surface);
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text);
  font-size: 0.95rem;
}

.form-input {
  padding: 0.85rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--surface);
  color: var(--text);
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--secondary);
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.alert {
  grid-column: 1 / -1;
  padding: 1rem;
  border-radius: 8px;
  font-weight: 500;
}

.alert--success {
  background: rgba(22, 163, 74, 0.1);
  color: #15803d;
  border: 1px solid rgba(22, 163, 74, 0.3);
}

.alert--error {
  background: rgba(220, 38, 38, 0.1);
  color: #991b1b;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

.products-table {
  overflow-x: auto;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
}

.table-header {
  background: var(--surface-strong);
  font-weight: 600;
  color: var(--secondary);
  border-bottom: 2px solid var(--border);
}

.table-row {
  background: var(--surface);
  transition: background 0.2s ease;
}

.table-row:hover {
  background: var(--surface-strong);
}

.table-cell {
  overflow: hidden;
}

.btn-danger {
  padding: 0.6rem 1rem;
  background: rgba(220, 38, 38, 0.1);
  color: #991b1b;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease;
}

.btn-danger:hover:not(:disabled) {
  background: rgba(220, 38, 38, 0.2);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-admin-small {
  padding: 0.75rem 1rem;
  min-width: 110px;
  border-radius: 10px;
  font-size: 0.95rem;
}

@media (max-width: 900px) {
  .admin-form {
    padding: 1.25rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group--full {
    grid-column: auto;
  }

  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .form-actions button {
    width: 100%;
  }

  .products-table {
    overflow: visible;
  }

  .table-header {
    display: none;
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid rgba(15, 23, 42, 0.08);
  }

  .table-cell {
    display: grid;
    gap: 0.35rem;
    overflow: visible;
  }

  .table-cell::before {
    content: attr(data-label);
    font-size: 0.85rem;
    color: var(--muted);
    font-weight: 700;
  }

  .table-cell:last-child {
    padding-top: 0.25rem;
  }

  .table-row .price {
    font-size: 1.15rem;
  }

  .table-row .tag-pill {
    justify-self: flex-start;
  }
}
</style>
