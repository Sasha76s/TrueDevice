<template>
  <section class="page-section">
    <div class="site-container max-w-6xl mx-auto">
      <div class="section-header">
        <div>
          <span class="eyebrow">Повідомлення</span>
          <h2 class="section-title">Повідомлення від користувачів</h2>
        </div>
      </div>

      <div class="glass-card p-6">
        <div v-if="loading" class="text-center">Завантаження...</div>
        <div v-else-if="error" class="text-red-600">Помилка: {{ error }}</div>

        <div v-else>
          <div v-if="messages.length === 0" class="section-intro">Немає повідомлень.</div>

          <div v-else class="space-y-4">
            <div v-for="msg in messages" :key="msg.id" class="glass-card p-4">
              <div class="flex justify-between items-start gap-4">
                <div>
                  <div class="font-semibold">{{ msg.name || 'Анонім' }} <span class="text-sm text-muted">• {{ msg.email }}</span></div>
                  <div class="text-sm text-muted mt-1">{{ formatDate(msg.created_at) }}</div>
                </div>
                <div>
                  <button @click="deleteMessage(msg.id)" class="btn-danger btn-admin-small">Видалити</button>
                </div>
              </div>
              <p class="product-meta mt-3">{{ msg.message }}</p>
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
  name: 'Messages',
  data() {
    return {
      messages: [],
      loading: false,
      error: null
    }
  },
  async created() {
    // admin check
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase()
    const userEmail = (authStore.state.user?.email || '').toLowerCase()

    if (!adminEmail || userEmail !== adminEmail) {
      this.$router.push('/profile')
      return
    }

    await this.loadMessages()
  },
  methods: {
    formatDate(val) {
      if (!val) return ''
      try {
        return new Date(val).toLocaleString('uk-UA')
      } catch (e) {
        return val
      }
    },
    async loadMessages() {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
        if (error) throw error
        this.messages = data || []
      } catch (err) {
        console.error('Load messages error:', err)
        this.error = err.message || String(err)
      } finally {
        this.loading = false
      }
    },
    async deleteMessage(id) {
      if (!confirm('Видалити це повідомлення?')) return
      try {
        const { error } = await supabase.from('messages').delete().eq('id', id)
        if (error) throw error
        await this.loadMessages()
      } catch (err) {
        console.error('Delete message error:', err)
        alert('Не вдалося видалити повідомлення')
      }
    }
  }
}
</script>

<style scoped>
.section-intro { margin-bottom: 0.75rem }
</style>
