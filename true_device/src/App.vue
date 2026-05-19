<template>
  <div id="app" class="app-shell">
    <header class="site-header">
      <div class="site-container">
        <router-link to="/" class="brand">
          <span class="brand-badge">TD</span>
          <div>
            <div class="brand-title">True Device</div>
            <p class="brand-subtitle">Магазин техніки та аксесуарів</p>
          </div>
        </router-link>

        <nav class="nav-links">
          <router-link to="/" class="nav-link">Головна</router-link>
          <router-link to="/products" class="nav-link">Товари</router-link>
          <router-link to="/contact" class="nav-link">Контакти</router-link>
          <router-link to="/cart" class="nav-link nav-link--cart">
            Кошик
            <span class="cart-badge" v-if="itemCount > 0">{{ itemCount }}</span>
          </router-link>
          <router-link v-if="!isAuthenticated" to="/login" class="nav-link">Авторизація</router-link>
          <div v-else class="relative" ref="profileRoot">
            <div class="flex items-center gap-3 cursor-pointer select-none" @click.stop="toggleMenu" :aria-expanded="menuOpen">
              <div class="relative inline-flex items-center justify-center rounded-full overflow-hidden shadow-lg" style="width:44px; height:44px; border:2px solid #ffffff; background:#111827;">
                <template v-if="userAvatarUrl">
                  <img :src="userAvatarUrl" alt="avatar" class="w-full h-full object-cover" />
                </template>
                <template v-else>
                  <div :style="{ background: avatarBackground }" class="w-full h-full flex items-center justify-center text-white font-semibold text-base">
                    {{ userInitial }}
                  </div>
                </template>
              </div>
              <div class="hidden sm:block text-sm font-medium text-slate-100">Привіт, {{ userShort }}</div>
            </div>

            <div v-if="menuOpen" class="profile-menu absolute right-0 mt-2 w-52 bg-slate-950 text-white shadow-2xl rounded-xl py-2 z-50 ring-1 ring-white/10">
              <router-link to="/my-orders" class="profile-menu-item">Мої замовлення</router-link>
              <router-link to="/profile" class="profile-menu-item">Профіль</router-link>
              <div class="profile-menu-divider"></div>
              <button @click="handleLogout" class="profile-menu-item profile-menu-item--danger">Вийти</button>
            </div>
          </div>
        </nav>
      </div>
    </header>

    <main class="site-main">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="site-container">
        <p>© 2026 True Device. Сучасна техніка та стильні аксесуари.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import cartStore from './cartStore.js'
import authStore from './authStore.js'

export default {
  name: 'App',
  data() {
    return {
      menuOpen: false
    }
  },
  computed: {
    itemCount() {
      return cartStore.itemCount.value
    },
    isAuthenticated() {
      return authStore.isAuthenticated.value
    },
    userEmail() {
      return authStore.state.user?.email || ''
    },
    userInitial() {
      const email = this.userEmail || ''
      return email ? email.charAt(0).toUpperCase() : ''
    },
    userShort() {
      const email = this.userEmail || ''
      const name = email.split('@')[0] || ''
      if (name.length > 12) return name.slice(0, 10) + '…'
      return name
    },
    userAvatarUrl() {
      return authStore.state.user?.user_metadata?.avatar_url || ''
    },
    avatarHue() {
      const email = this.userEmail || ''
      let h = 0
      for (let i = 0; i < email.length; i++) {
        h = (h * 31 + email.charCodeAt(i)) % 360
      }
      return h
    },
    avatarBackground() {
      const h = this.avatarHue || 220
      const h2 = (h + 40) % 360
      return `linear-gradient(135deg, hsl(${h},65%,45%), hsl(${h2},65%,40%))`
    }
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen
    },
    handleLogout() {
      this.menuOpen = false
      authStore.logout()
      this.$router.push('/')
    },
    logout() {
      authStore.logout()
      this.$router.push('/')
    },
    onDocClick(e) {
      if (!this.$refs.profileRoot) return
      if (!this.$refs.profileRoot.contains(e.target)) this.menuOpen = false
    }
  },
  mounted() {
    document.addEventListener('click', this.onDocClick)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.onDocClick)
  }
}
</script>
