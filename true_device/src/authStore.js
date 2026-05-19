import { reactive, computed } from 'vue'
import { supabase } from './supabase.js'

const state = reactive({
  user: null
})

async function initAuth() {
  const { data, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Supabase getSession error:', error)
  }

  state.user = data?.session?.user || null

  if (state.user?.email) {
    await addUserRole(state.user.email)
  }

  supabase.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user || null
    if (state.user?.email) {
      addUserRole(state.user.email)
    }
  })
}

async function addUserRole(email, role = 'user') {
  if (!email) {
    return { error: { message: 'Email не переданий' } }
  }

  const { data, error } = await supabase.from('user_roles').upsert(
    [{ email, role }],
    { onConflict: 'email', ignoreDuplicates: true }
  )

  return { data, error }
}

async function login(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email і пароль обов\'язкові' }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { success: false, error: error.message }
    }

    state.user = data.user

    const roleResult = await addUserRole(email)
    if (roleResult.error) {
      console.error('Failed to insert user role on login:', roleResult.error)
      return { success: false, error: roleResult.error.message || 'Не вдалося зберегти користувача у таблиці user_roles' }
    }

    return { success: true }
  } catch (error) {
    console.error('Supabase login failed:', error)
    return { success: false, error: error.message || 'Failed to fetch' }
  }
}

async function register(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Email і пароль обов\'язкові' }
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      return { success: false, error: error.message }
    }

    const roleResult = await addUserRole(email)
    if (roleResult.error) {
      console.error('Failed to insert user role on register:', roleResult.error)
      return { success: false, error: roleResult.error.message || 'Не вдалося зберегти користувача у таблиці user_roles' }
    }

    if (data?.session) {
      state.user = data.user
    }

    return { success: true }
  } catch (error) {
    console.error('Supabase registration failed:', error)
    return { success: false, error: error.message || 'Failed to fetch' }
  }
}

async function logout() {
  await supabase.auth.signOut()
  state.user = null
}

const isAuthenticated = computed(() => !!state.user)

export default {
  state,
  initAuth,
  login,
  register,
  logout,
  isAuthenticated
}
