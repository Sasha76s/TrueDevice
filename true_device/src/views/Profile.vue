<template>
  <section class="page-section">
    <div class="site-container max-w-3xl mx-auto">
      <div class="section-header">
        <div>
          <span class="eyebrow">Профіль</span>
          <h2 class="section-title">Твій акаунт</h2>
        </div>
      </div>

      <div class="glass-card p-6 flex flex-col sm:flex-row items-center gap-6">
        <div class="flex-shrink-0">
          <div :style="{ background: avatarBackground }" class="w-24 h-24 rounded-full text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-2 ring-white">
            {{ userInitial }}
          </div>
        </div>

        <div class="flex-1 w-full">
          <p class="text-lg font-semibold">{{ userShort || 'Користувач' }}</p>
          <p class="text-sm text-slate-600">{{ userEmail }}</p>
          <p class="text-sm text-slate-600 mt-2">Роль: <strong>{{ role || 'user' }}</strong></p>

          <div class="mt-4 flex gap-3">
            <router-link to="/my-orders" class="btn-outline">Мої замовлення</router-link>
            <button @click="logout" class="btn-primary">Вийти</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import authStore from '../authStore.js'
import { supabase } from '../supabase.js'

export default {
  name: 'Profile',
  data() {
    return {
      role: null
    }
  },
  computed: {
    userEmail() {
      return authStore.state.user?.email || ''
    },
    userInitial() {
      const e = this.userEmail || ''
      return e ? e.charAt(0).toUpperCase() : ''
    },
    userShort() {
      return (this.userEmail.split('@')[0] || '')
    },
    avatarHue() {
      const email = this.userEmail || ''
      let h = 0
      for (let i = 0; i < email.length; i++) h = (h * 31 + email.charCodeAt(i)) % 360
      return h
    },
    avatarBackground() {
      const h = this.avatarHue || 220
      const h2 = (h + 40) % 360
      return `linear-gradient(135deg, hsl(${h},65%,45%), hsl(${h2},65%,40%))`
    }
  },
  methods: {
    async loadRole() {
      try {
        const { data, error } = await supabase.from('user_roles').select('role').eq('email', this.userEmail).single()
        if (error && error.code !== 'PGRST116') {
          console.warn('User role fetch error:', error)
          return
        }
        this.role = data?.role || 'user'
      } catch (e) {
        console.error(e)
      }
    },
    logout() {
      authStore.logout()
      this.$router.push('/')
    }
  },
  created() {
    this.loadRole()
  }
}
</script>

<style scoped>
.section-intro { margin-bottom: 0.75rem }
</style>
