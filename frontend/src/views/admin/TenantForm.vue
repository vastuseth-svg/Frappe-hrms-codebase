<script setup lang="ts">
import { ref } from 'vue'

// ---- Emits ----
const emit = defineEmits<{ (e: 'created', tenantCode: string): void }>()

// ---- State ----
const form = ref({
  tenant_code: '',
  tenant_name: '',
  admin_email: '',
  admin_mobile: '',
  notes: '',
})
const loading = ref(false)
const error = ref<string | null>(null)
const fieldErrors = ref<Record<string, string>>({})

// ---- Helpers ----
function sessionToken() {
  return localStorage.getItem('auth_token') || ''
}

function validate(): boolean {
  fieldErrors.value = {}
  if (!form.value.tenant_code.trim()) {
    fieldErrors.value.tenant_code = 'Tenant code is required.'
  } else if (!/^[a-z0-9]+$/.test(form.value.tenant_code)) {
    fieldErrors.value.tenant_code = 'Lowercase letters and digits only (no spaces or special chars).'
  }
  if (!form.value.tenant_name.trim()) {
    fieldErrors.value.tenant_name = 'Tenant name is required.'
  }
  if (!form.value.admin_email.trim()) {
    fieldErrors.value.admin_email = 'Admin email is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.admin_email)) {
    fieldErrors.value.admin_email = 'Enter a valid email address.'
  }
  return Object.keys(fieldErrors.value).length === 0
}

async function submit() {
  if (!validate()) return

  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/method/hrms_saas.api.tenant.create_tenant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken()}`,
      },
      body: JSON.stringify(form.value),
    })
    const data = await res.json()
    const msg = data.message

    if (msg?.success) {
      emit('created', msg.tenant_code)
      // Reset form
      form.value = { tenant_code: '', tenant_name: '', admin_email: '', admin_mobile: '', notes: '' }
    } else if (msg?.error === 'TENANT_EXISTS') {
      fieldErrors.value.tenant_code = msg.message || 'Tenant code already exists.'
    } else {
      // Frappe server exception format
      const serverMsg = data._server_messages
        ? JSON.parse(JSON.parse(data._server_messages)[0]).message
        : (msg?.message || 'Failed to create tenant.')
      error.value = serverMsg
    }
  } catch (e: any) {
    error.value = e.message || 'Network error'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="form-card" role="form" aria-label="Create Tenant Form">
    <h2 class="form-title">Create New Tenant</h2>

    <!-- Global error -->
    <div v-if="error" id="tenant-form-error" role="alert" class="error-banner">{{ error }}</div>

    <div class="form-grid">
      <!-- Tenant Code -->
      <div class="form-field">
        <label for="input-tenant-code" class="field-label">
          Tenant Code <span class="required">*</span>
        </label>
        <input
          id="input-tenant-code"
          v-model="form.tenant_code"
          type="text"
          placeholder="e.g. acme (lowercase, no spaces)"
          :class="['field-input', fieldErrors.tenant_code ? 'field-input--error' : '']"
          autocomplete="off"
        />
        <p v-if="fieldErrors.tenant_code" id="tenant-code-error" class="field-error">
          {{ fieldErrors.tenant_code }}
        </p>
      </div>

      <!-- Tenant Name -->
      <div class="form-field">
        <label for="input-tenant-name" class="field-label">
          Tenant Name <span class="required">*</span>
        </label>
        <input
          id="input-tenant-name"
          v-model="form.tenant_name"
          type="text"
          placeholder="e.g. Acme Corp"
          :class="['field-input', fieldErrors.tenant_name ? 'field-input--error' : '']"
        />
        <p v-if="fieldErrors.tenant_name" class="field-error">{{ fieldErrors.tenant_name }}</p>
      </div>

      <!-- Admin Email -->
      <div class="form-field">
        <label for="input-admin-email" class="field-label">
          Admin Email <span class="required">*</span>
        </label>
        <input
          id="input-admin-email"
          v-model="form.admin_email"
          type="email"
          placeholder="admin@acme.com"
          :class="['field-input', fieldErrors.admin_email ? 'field-input--error' : '']"
        />
        <p v-if="fieldErrors.admin_email" class="field-error">{{ fieldErrors.admin_email }}</p>
      </div>

      <!-- Admin Mobile (optional) -->
      <div class="form-field">
        <label for="input-admin-mobile" class="field-label">Admin Mobile (optional)</label>
        <input
          id="input-admin-mobile"
          v-model="form.admin_mobile"
          type="tel"
          placeholder="+1-555-0100"
          class="field-input"
        />
      </div>
    </div>

    <!-- Notes -->
    <div class="form-field mt-4">
      <label for="input-notes" class="field-label">Notes (optional)</label>
      <textarea
        id="input-notes"
        v-model="form.notes"
        rows="2"
        placeholder="Any internal notes…"
        class="field-input resize-none"
      />
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button
        id="btn-submit-tenant"
        type="button"
        class="btn-submit"
        :disabled="loading"
        @click="submit"
      >
        <span v-if="loading" class="spinner"></span>
        {{ loading ? 'Creating…' : 'Create Tenant' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
@reference "../../style.css";

.form-card {
  @apply bg-white border border-gray-200 rounded-xl p-6 shadow-sm;
}
.form-title { @apply text-lg font-bold text-gray-900 mb-4; }
.error-banner { @apply p-3 mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg; }

.form-grid { @apply grid grid-cols-1 md:grid-cols-2 gap-4; }
.form-field { @apply flex flex-col gap-1; }
.field-label { @apply text-sm font-medium text-gray-600; }
.required { @apply text-red-500; }
.field-input {
  @apply border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-900
    placeholder-gray-400 focus:outline-none focus:border-indigo-400
    focus:ring-1 focus:ring-indigo-400 transition-all bg-white;
}
.field-input--error { @apply border-red-400 focus:border-red-400 focus:ring-red-400; }
.field-error { @apply text-xs text-red-600; }

.form-actions { @apply flex justify-end mt-5; }
.btn-submit {
  @apply px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold
    rounded-lg transition-all hover:-translate-y-px hover:shadow-md
    disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2;
}
.spinner {
  @apply w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin;
}
</style>
