import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Products from './views/Products.vue'
import ProductDetail from './views/ProductDetail.vue'
import Cart from './views/Cart.vue'
import Checkout from './views/Checkout.vue'
import Login from './views/Login.vue'
import Contact from './views/Contact.vue'
import MyOrders from './views/MyOrders.vue'
import Profile from './views/Profile.vue'
import Admin from './views/Admin.vue'
import Messages from './views/Messages.vue'
import authStore from './authStore.js'

const routes = [
  { path: '/', component: Home },
  { path: '/products', component: Products },
  { path: '/product/:id', component: ProductDetail },
  { path: '/cart', component: Cart },
  { path: '/checkout', component: Checkout, meta: { requiresAuth: true } },
  { path: '/contact', component: Contact },
  { path: '/my-orders', component: MyOrders, meta: { requiresAuth: true } },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/admin', component: Admin, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/messages', component: Messages, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.meta.requiresAuth
  const requiresAdmin = to.meta.requiresAdmin

  if (requiresAuth && !authStore.isAuthenticated.value) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (requiresAdmin) {
    const adminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').toLowerCase()
    const userEmail = (authStore.state.user?.email || '').toLowerCase()

    if (!adminEmail || userEmail !== adminEmail) {
      next({ path: '/profile' })
      return
    }
  }

  next()
})

export default router