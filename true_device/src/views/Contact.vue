<template>
  <section class="page-section">
    <div class="site-container max-w-5xl mx-auto">
      <div class="section-header">
        <div>
          <span class="eyebrow">Контакти</span>
          <h2 class="section-title">Зв'яжіться з нами</h2>
        </div>
      </div>

      <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="glass-card p-8 contact-card">
          <p class="section-intro">Маєте запитання щодо замовлення або товару? Напишіть нам, і ми відповімо протягом робочого дня.</p>

          <div class="space-y-6 mt-8">
            <div class="contact-detail">
              <h3>📍 Адреса</h3>
              <p>м. Київ, вул. Технічна, 14</p>
            </div>
            <div class="contact-detail">
              <h3>📞 Телефон</h3>
              <p>+38 (050) 123-45-67</p>
            </div>
            <div class="contact-detail">
              <h3>✉️ Email</h3>
              <p>support@truedevice.ua</p>
            </div>
            <div class="contact-detail">
              <h3>⏰ Графік роботи</h3>
              <p>Пн-Пт: 09:00 - 19:00</p>
              <p>Сб: 10:00 - 16:00</p>
              <p>Нд: вихідний</p>
            </div>
          </div>

          <div class="contact-extra-grid mt-10 gap-4 grid sm:grid-cols-2">
            <div class="contact-card-short">
              <h4>Підтримка замовлень</h4>
              <p>Допомога у виборі товарів, оформленні доставки та статусі замовлення.</p>
            </div>
            <div class="contact-card-short">
              <h4>Повернення і гарантія</h4>
              <p>Консультації з повернення, обміну та гарантійних зобов’язань.</p>
            </div>
          </div>
        </div>

        <div class="glass-card p-8 contact-form-card">
          <span class="tag-pill">Напишіть нам</span>
          <form @submit.prevent="sendMessage" class="mt-6 space-y-5">
            <div class="contact-form-field">
              <label class="contact-form-label">Ім’я</label>
              <input v-model="name" type="text" class="checkout-input" placeholder="Ваше ім’я" />
            </div>
            <div class="contact-form-field">
              <label class="contact-form-label">Email</label>
              <input v-model="email" type="email" class="checkout-input" placeholder="example@mail.com" />
            </div>
            <div class="contact-form-field">
              <label class="contact-form-label">Повідомлення</label>
              <textarea v-model="message" rows="5" class="checkout-input checkout-textarea" placeholder="Ваше повідомлення"></textarea>
            </div>
            <button :disabled="sending" type="submit" class="btn-primary w-full">{{ sending ? 'Відправляємо...' : 'Відправити повідомлення' }}</button>
            <p v-if="feedback" class="mt-2 text-sm">{{ feedback }}</p>
          </form>
        </div>
      </div>

      <div class="grid gap-8 mt-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div class="glass-card p-8 contact-map-card">
          <h3 class="section-title text-2xl">Ми поруч</h3>
          <p class="product-meta mt-4">Завітайте до нашого офісу або замовляйте онлайн — ми працюємо для вас щодня.</p>
          <div class="contact-map-placeholder mt-8">
            <p>Карта місця розташування</p>
          </div>
        </div>

        <div class="glass-card p-8 contact-social-card">
          <span class="tag-pill">Соціальні мережі</span>
          <div class="space-y-4 mt-6">
            <a href="#" class="contact-link">Facebook</a>
            <a href="#" class="contact-link">Instagram</a>
            <a href="#" class="contact-link">Telegram</a>
            <a href="#" class="contact-link">YouTube</a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { supabase } from '../supabase'

export default {
  name: 'Contact',
  data() {
    return {
      name: '',
      email: '',
      message: '',
      sending: false,
      feedback: ''
    }
  },
  methods: {
    async sendMessage() {
      this.feedback = ''
      if (!this.name || !this.email || !this.message) {
        this.feedback = 'Будь ласка, заповніть всі поля.'
        return
      }

      this.sending = true
      const { error } = await supabase.from('messages').insert([
        { name: this.name, email: this.email, message: this.message }
      ])

      this.sending = false
      if (error) {
        console.error('Supabase insert error:', error)
        const msg = error.message || JSON.stringify(error)
        this.feedback = `Помилка при надсиланні: ${msg}`
      } else {
        this.feedback = 'Дякуємо! Повідомлення надіслано.'
        this.name = ''
        this.email = ''
        this.message = ''
      }
    }
  }
}
</script>
