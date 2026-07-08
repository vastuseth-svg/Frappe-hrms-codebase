<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const username = ref('')
const password = ref('')

const authStore = useAuthStore()

const handleLogin = async () => {
  if (!username.value || !password.value) {
    return
  }
  await authStore.login(username.value, password.value)
}
</script>

<template>
  <div class="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <!-- Logo / Title -->
      <div class="flex flex-col items-center justify-center text-center">
        <div class="flex items-center gap-2 mb-2">
          <span class="font-display font-bold text-3xl tracking-tight text-[#6366F1]">Shree <span class="text-[#20970B]">HRMS</span></span>
        </div>
        <h2 class="mt-4 text-center text-2xl font-bold text-[#0A0A0A] font-display">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-[#6B6B6B]">
          Enter your email and password to receive a one-time OTP
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow-sm rounded-xl sm:px-10 border border-[#E8E8EC] transition-all hover:shadow-card-hover duration-300">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Error Message Banner -->
          <div v-if="authStore.error.value" class="bg-[#EF4444]/10 border border-[#EF4444]/25 text-[#EF4444] px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ authStore.error.value }}</span>
          </div>

          <!-- Email Input -->
          <div>
            <label for="username" class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
              Email Address
            </label>
            <div class="mt-1">
              <input
                id="username"
                v-model="username"
                type="email"
                required
                autocomplete="email"
                placeholder="you@domain.com"
                class="block w-full px-4 py-3 rounded-lg border border-[#E8E8EC] focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 bg-white placeholder-[#9C9C9C] text-[#0A0A0A] outline-none transition-all duration-200"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-xs font-semibold uppercase tracking-wider text-[#6B6B6B] mb-2">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="password"
                type="password"
                required
                autocomplete="current-password"
                placeholder="••••••••"
                class="block w-full px-4 py-3 rounded-lg border border-[#E8E8EC] focus:border-[#6366F1] focus:ring-4 focus:ring-[#6366F1]/10 bg-white placeholder-[#9C9C9C] text-[#0A0A0A] outline-none transition-all duration-200"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="authStore.loading.value"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-[#6366F1] hover:bg-[#4F46E5] focus:outline-none focus:ring-4 focus:ring-[#6366F1]/20 cursor-pointer shadow-btn-hover transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <template v-if="authStore.loading.value">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </template>
              <template v-else>
                Continue with OTP
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
