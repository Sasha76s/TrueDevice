<template>
  <div class="auth-page">
    <!-- Background -->
    <div class="auth-bg">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="bg-shape shape-3"></div>
    </div>

    <!-- Main Container -->
    <div class="auth-container">
      <!-- Logo Section -->
      <div class="auth-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h1 class="logo-text">True Device</h1>
        </div>
        <p class="auth-subtitle">Ваш надійний партнер у світі технологій</p>
      </div>

      <!-- Auth Card -->
      <div class="auth-card">
        <!-- Tab Switcher -->
        <div class="auth-tabs">
          <button
            @click="setMode(true)"
            :class="['tab-button', { 'active': isLogin }]"
          >
            Вхід
          </button>
          <button
            @click="setMode(false)"
            :class="['tab-button', { 'active': !isLogin }]"
          >
            Реєстрація
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- Email Field -->
          <div class="form-group">
            <label class="form-label">Email адреса</label>
            <div class="input-group">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                class="form-input"
                :class="{ 'error': formErrors.email }"
                placeholder="your@email.com"
                required
              />
            </div>
            <span v-if="formErrors.email" class="error-text">{{ formErrors.email }}</span>
          </div>

          <!-- Password Field -->
          <div class="form-group">
            <label class="form-label">Пароль</label>
            <div class="input-group">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                  <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
                  <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <input
                v-model="form.password"
                type="password"
                class="form-input"
                :class="{ 'error': formErrors.password }"
                placeholder="Мінімум 6 символів"
                required
              />
            </div>
            <span v-if="formErrors.password" class="error-text">{{ formErrors.password }}</span>
          </div>

          <!-- Confirm Password (only for registration) -->
          <div v-if="!isLogin" class="form-group">
            <label class="form-label">Підтвердіть пароль</label>
            <div class="input-group">
              <div class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                </svg>
              </div>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="form-input"
                :class="{ 'error': formErrors.confirmPassword }"
                placeholder="Повторіть пароль"
                required
              />
            </div>
            <span v-if="formErrors.confirmPassword" class="error-text">{{ formErrors.confirmPassword }}</span>
          </div>

          <!-- Remember Me (only for login) -->
          <div v-if="isLogin" class="form-options">
            <label class="checkbox-group">
              <input v-model="rememberMe" type="checkbox" class="checkbox">
              <span class="checkmark"></span>
              <span class="checkbox-label">Запам'ятати мене</span>
            </label>
            <a href="#" class="forgot-link">Забули пароль?</a>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="auth-button"
            :disabled="isSubmitting"
          >
            <span v-if="isSubmitting" class="spinner"></span>
            {{ isSubmitting ? 'Обробка...' : (isLogin ? 'Увійти' : 'Зареєструватися') }}
          </button>
        </form>

        <!-- Message -->
        <div v-if="message" class="auth-message" :class="'message-' + messageType">
          <div class="message-icon">
            <svg v-if="messageType === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M15 9L9 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 9L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="message-text">{{ message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authStore from '../authStore.js'

export default {
  name: 'Login',
  data() {
    return {
      isLogin: true,
      isSubmitting: false,
      rememberMe: false,
      message: '',
      messageType: '',
      form: {
        email: '',
        password: '',
        confirmPassword: ''
      },
      formErrors: {
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    setMode(loginMode) {
      this.isLogin = loginMode
      this.clearForm()
      this.clearMessages()
    },

    clearForm() {
      this.form = {
        email: '',
        password: '',
        confirmPassword: ''
      }
      this.formErrors = {
        email: '',
        password: '',
        confirmPassword: ''
      }
    },

    clearMessages() {
      this.message = ''
      this.messageType = ''
    },

    validateForm() {
      this.clearMessages()
      this.formErrors = { email: '', password: '', confirmPassword: '' }
      let isValid = true

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!this.form.email) {
        this.formErrors.email = 'Email обов\'язковий'
        isValid = false
      } else if (!emailRegex.test(this.form.email)) {
        this.formErrors.email = 'Введіть коректний email'
        isValid = false
      }

      // Password validation
      if (!this.form.password) {
        this.formErrors.password = 'Пароль обов\'язковий'
        isValid = false
      } else if (this.form.password.length < 6) {
        this.formErrors.password = 'Пароль має містити мінімум 6 символів'
        isValid = false
      }

      // Confirm password validation (only for registration)
      if (!this.isLogin) {
        if (!this.form.confirmPassword) {
          this.formErrors.confirmPassword = 'Підтвердіть пароль'
          isValid = false
        } else if (this.form.password !== this.form.confirmPassword) {
          this.formErrors.confirmPassword = 'Паролі не співпадають'
          isValid = false
        }
      }

      return isValid
    },

    async handleSubmit() {
      if (!this.validateForm()) return

      this.isSubmitting = true
      this.clearMessages()

      try {
        if (this.isLogin) {
          await this.login()
        } else {
          await this.register()
        }
      } catch (error) {
        this.showMessage('Сталася помилка. Спробуйте ще раз.', 'error')
      } finally {
        this.isSubmitting = false
      }
    },

    async login() {
      const result = await authStore.login(this.form.email, this.form.password)
      if (result.success) {
        this.showMessage('Успішний вхід!', 'success')
        setTimeout(() => {
          const redirect = this.$route.query.redirect || '/'
          this.$router.push(redirect)
        }, 1000)
      } else {
        this.showMessage(result.error || 'Невірний email або пароль', 'error')
      }
    },

    async register() {
      const result = await authStore.register(this.form.email, this.form.password)
      if (result.success) {
        this.showMessage('Акаунт створено успішно! Тепер увійдіть.', 'success')
        setTimeout(() => {
          this.isLogin = true
          this.clearForm()
        }, 2000)
      } else {
        this.showMessage(result.error || 'Помилка при створенні акаунту', 'error')
      }
    },

    showMessage(text, type) {
      this.message = text
      this.messageType = type
    }
  }
}
</script>