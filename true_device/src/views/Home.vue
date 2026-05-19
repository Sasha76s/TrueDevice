<template>
  <section class="page-section page-hero">
    <div class="site-container grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
      <div>
        <span class="eyebrow">True Device</span>
        <h1 class="page-title">Професійні рішення для сучасних технологій</h1>
        <p class="page-description">Надійна техніка та аксесуари для роботи, навчання і повсякденних завдань. Чіткий вибір для ділового стилю життя.</p>
        <div class="hero-actions">
          <router-link to="/products" class="btn-primary">Переглянути асортимент</router-link>
          <router-link to="/cart" class="btn-secondary">Перейти до кошика</router-link>
        </div>
      </div>

      <div class="grid gap-5">
        <div class="glass-card">
          <span class="card-accent">Нові колекції</span>
          <h2 class="text-3xl font-semibold text-[#0f172a]">Сучасні рішення для ефективної роботи</h2>
          <p class="product-meta mt-4">Функціональні смартфони й ноутбуки, підібрані для клієнтів, що цінують якість та професіоналізм.</p>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="panel-card">
            <span class="card-accent">Вибір експертів</span>
            <p class="product-meta">Тільки актуальні моделі з перевіреною надійністю і технічними характеристиками.</p>
          </div>
          <div class="panel-card">
            <span class="card-accent">Комфортні умови</span>
            <p class="product-meta">Швидка доставка, прозорі умови оплати та підтримка на кожному етапі.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="site-container">
      <div class="section-header">
        <div>
          <span class="eyebrow">Категорії</span>
          <h2 class="section-title">Основні напрямки</h2>
        </div>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <article class="product-card">
          <span class="tag-pill">Смартфони</span>
          <h3 class="text-2xl font-semibold mt-5">Оптимальна продуктивність</h3>
          <p class="product-meta mt-4">Моделі з професійними камерами, стабільним зв’язком і довгим часом роботи батареї.</p>
        </article>
        <article class="product-card">
          <span class="tag-pill">Аксесуари</span>
          <h3 class="text-2xl font-semibold mt-5">Функціональний стиль</h3>
          <p class="product-meta mt-4">Підсилюють продуктивність та комфорт: кабелі, зарядні пристрої, чохли й навушники.</p>
        </article>
        <article class="product-card">
          <span class="tag-pill">Ноутбуки</span>
          <h3 class="text-2xl font-semibold mt-5">Продуктивність без компромісів</h3>
          <p class="product-meta mt-4">Потужні, легкі та елегантні рішення для бізнесу і творчих завдань.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="page-section">
    <div class="site-container">
      <div class="section-header">
        <div>
          <span class="eyebrow">Ми пропонуємо</span>
          <h2 class="section-title">Тверді переваги для впевнених виборів</h2>
        </div>
      </div>

      <div class="feature-grid">
        <article class="feature-card">
          <h3>Техніка з гарантією</h3>
          <p>Всі товари супроводжуються офіційною гарантією та перевіреною технічною підтримкою.</p>
        </article>
        <article class="feature-card">
          <h3>Консультації експертів</h3>
          <p>Ми допоможемо підібрати обладнання, яке відповідає вашим бізнес-завданням.</p>
        </article>
        <article class="feature-card">
          <h3>Безпечна покупка</h3>
          <p>Зрозумілі умови оплати та повернення без зайвих запитань.</p>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Home'
}
</script>