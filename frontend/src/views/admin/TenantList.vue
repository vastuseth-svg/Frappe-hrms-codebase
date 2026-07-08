<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

// ---- Types ----
interface Tenant {
  tenant_code: string
  tenant_name: string
  status: string
  admin_email: string
  creation: string
}

// ---- State ----
const tenants = ref<Tenant[]>([])
const total = ref(0)
const page = ref(1)
const pageLength = 20
const search = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const showForm = ref(false)

// ---- Computed ----
const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'Active': return 'badge-active'
    case 'Suspended': return 'badge-suspended'
    default: return 'badge-pending'
  }
}

const totalPages = computed(() => Math.ceil(total.value / pageLength))

// ---- API helpers ----
function sessionToken() {
  return localStorage.getItem('auth_token') || ''
}

async function fetchTenants() {
  loading.value = true
  error.value = null
  try {
    const params = new URLSearchParams({
      page: String(page.value),
      page_length: String(pageLength),
      ...(search.value ? { search: search.value } : {}),
    })
    const res = await fetch(
      `/api/method/hrms_saas.api.tenant.list_tenants?${params}`,
      { headers: { Authorization: `Bearer ${sessionToken()}` } }
    )
    const data = await res.json()
    if (data.message) {
      tenants.value = data.message.tenants || []
      total.value = data.message.total || 0
    }
  } catch (e: any) {
    error.value = e.message || 'Failed to load tenants'
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  page.value = 1
  fetchTenants()
}

function prevPage() {
  if (page.value > 1) { page.value--; fetchTenants() }
}
function nextPage() {
  if (page.value < totalPages.value) { page.value++; fetchTenants() }
}

function onTenantCreated() {
  showForm.value = false
  fetchTenants()
}

onMounted(fetchTenants)
</script>

<template>
  <div class="admin-panel">

    <!-- Header row -->
    <div class="panel-header">
      <div>
        <span class="panel-tag">SUPER ADMIN · VS-02-A</span>
        <h1 class="panel-title">Tenant Management</h1>
        <p class="panel-subtitle">Create and manage SaaS tenants.</p>
      </div>
      <button id="btn-new-tenant" class="btn-primary" @click="showForm = !showForm">
        {{ showForm ? '✕ Close' : '+ New Tenant' }}
      </button>
    </div>

    <!-- Inline create form (VS-02-A) -->
    <TenantForm v-if="showForm" @created="onTenantCreated" class="mb-8" />

    <!-- Search bar -->
    <div class="search-row">
      <input
        id="tenant-search"
        v-model="search"
        type="text"
        placeholder="Search tenants…"
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <button class="btn-secondary" @click="handleSearch">Search</button>
    </div>

    <!-- Error -->
    <div v-if="error" class="error-banner">{{ error }}</div>

    <!-- Loading skeleton -->
    <div v-if="loading" class="skeleton-rows">
      <div v-for="i in 5" :key="i" class="skeleton-row"></div>
    </div>

    <!-- Table -->
    <div v-else-if="tenants.length > 0" class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Status</th>
            <th>Admin Email</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tenants" :key="t.tenant_code" class="table-row">
            <td class="font-mono text-xs text-indigo-600 font-semibold">{{ t.tenant_code }}</td>
            <td class="font-medium">{{ t.tenant_name }}</td>
            <td>
              <span :class="['status-badge', statusBadgeClass(t.status)]">
                {{ t.status }}
              </span>
            </td>
            <td class="text-sm text-gray-500">{{ t.admin_email }}</td>
            <td class="text-sm text-gray-400">{{ new Date(t.creation).toLocaleDateString() }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="pagination-row">
        <span class="text-sm text-gray-500">{{ total }} total</span>
        <div class="flex items-center gap-2">
          <button id="btn-prev-page" class="btn-page" :disabled="page <= 1" @click="prevPage">‹ Prev</button>
          <span class="text-sm font-medium">{{ page }} / {{ totalPages || 1 }}</span>
          <button id="btn-next-page" class="btn-page" :disabled="page >= totalPages" @click="nextPage">Next ›</button>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="empty-state">
      <span class="text-4xl">🏢</span>
      <p class="text-gray-500 mt-2">No tenants yet. Create the first one.</p>
    </div>

  </div>
</template>

<!-- Local script import for TenantForm -->
<script lang="ts">
import TenantForm from './TenantForm.vue'
export default { components: { TenantForm } }
</script>

<style scoped>
@reference "../../style.css";

.admin-panel { @apply space-y-6; }
.panel-header { @apply flex items-start justify-between gap-4; }
.panel-tag { @apply block text-xs font-mono uppercase tracking-wider text-indigo-500 mb-1; }
.panel-title { @apply text-2xl font-bold text-gray-900; }
.panel-subtitle { @apply text-sm text-gray-500 mt-1; }

.btn-primary {
  @apply px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg
    transition-all hover:-translate-y-px hover:shadow-md cursor-pointer whitespace-nowrap;
}
.btn-secondary {
  @apply px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium
    rounded-lg transition-all cursor-pointer;
}
.btn-page {
  @apply px-3 py-1 border border-gray-200 bg-white text-sm rounded-md
    disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer;
}

.search-row { @apply flex gap-3; }
.search-input {
  @apply flex-1 border border-gray-200 rounded-lg px-3.5 py-2 text-sm
    focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all;
}

.error-banner { @apply p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg; }

.skeleton-rows { @apply space-y-2; }
.skeleton-row { @apply h-12 bg-gray-100 rounded-lg animate-pulse; }

.table-card { @apply border border-gray-200 rounded-xl overflow-hidden bg-white; }
.data-table { @apply w-full text-sm; }
.data-table thead { @apply bg-gray-50; }
.data-table th { @apply px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide; }
.table-row { @apply border-t border-gray-100 hover:bg-gray-50 transition-colors; }
.table-row td { @apply px-4 py-3; }

.status-badge {
  @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold;
}
.badge-active { @apply bg-emerald-100 text-emerald-700; }
.badge-suspended { @apply bg-red-100 text-red-700; }
.badge-pending { @apply bg-yellow-100 text-yellow-700; }

.pagination-row {
  @apply flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50;
}

.empty-state { @apply flex flex-col items-center justify-center py-20 text-center; }
</style>
