<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import Login from './views/auth/Login.vue'
import VerifyOTP from './views/auth/VerifyOTP.vue'
import TenantList from './views/admin/TenantList.vue'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.sessionToken.value) {
    authStore.bootstrapPermissions()
  }
})

const activeTab = ref<'tenant-setup' | 'dashboard' | 'punch' | 'tenants'>('tenant-setup')

watch(() => authStore.permittedModules.value, (newModules) => {
  if (newModules && newModules.length > 0) {
    if (newModules.includes('Tenant Setup')) {
      activeTab.value = 'tenant-setup'
    } else if (newModules.includes('Punch In-Out')) {
      activeTab.value = 'punch'
    } else {
      activeTab.value = 'dashboard'
    }
  }
}, { immediate: true })

// Mock state for Tenant Setup
const tenantCode = ref('')
const companyName = ref('')
const adminEmail = ref('')
const isTenantCreated = ref(false)

// Preferences check switches (as toggles)
const enableMfa = ref(false)
const enableAuditLog = ref(true)

// Mock state for Web Punch
const punchStatus = ref<'out' | 'in'>('out')
const simulatedGpsStatus = ref<'idle' | 'locating' | 'success'>('idle')
const selfieUpload = ref<string | null>(null)
const punchLogs = ref([
  { time: '09:02 AM', type: 'PUNCH IN', status: 'Success (Office GPS)', semantic: 'success' },
  { time: '06:05 PM', type: 'PUNCH OUT', status: 'Success (Selfie Match 98%)', semantic: 'neutral' }
])

const handleCreateTenant = () => {
  if (tenantCode.value && companyName.value && adminEmail.value) {
    isTenantCreated.value = true
  }
}

const triggerGpsLocating = () => {
  simulatedGpsStatus.value = 'locating'
  setTimeout(() => {
    simulatedGpsStatus.value = 'success'
  }, 1000)
}

const handleSelfieUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const reader = new FileReader()
    reader.onload = (event) => {
      selfieUpload.value = event.target?.result as string
    }
    reader.readAsDataURL(target.files[0])
  }
}

const handlePunch = () => {
  if (simulatedGpsStatus.value !== 'success') {
    alert('Please verify GPS coordinates before punching.')
    return
  }
  const now = new Date()
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const nextStatus = punchStatus.value === 'out' ? 'in' : 'out'
  
  punchLogs.value.unshift({
    time: timeStr,
    type: nextStatus === 'in' ? 'PUNCH IN' : 'PUNCH OUT',
    status: selfieUpload.value ? 'Success (Selfie + GPS)' : 'Success (GPS Only)',
    semantic: nextStatus === 'in' ? 'success' : 'warning'
  })
  
  punchStatus.value = nextStatus
  simulatedGpsStatus.value = 'idle'
  selfieUpload.value = null
}
</script>

<template>
  <template v-if="authStore.step.value === 'login'">
    <Login />
  </template>
  <template v-else-if="authStore.step.value === 'verify-otp'">
    <VerifyOTP />
  </template>
  <template v-else>
    <div class="min-h-screen bg-[#FAFAFA] text-[#0A0A0A] font-sans flex flex-col">
    
    <!-- Sticky Navigation (56px, backdrop-blur, 1px bottom border) -->
    <header class="sticky top-0 z-50 h-[56px] border-b border-[#E8E8EC] backdrop-blur-nav flex items-center px-6">
      <div class="max-w-[1280px] w-full mx-auto flex items-center justify-between">
        
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <span class="font-display font-bold text-lg tracking-tight text-[#6366F1]">Shree <span class="text-[#20970B]">HRMS</span></span>
        </div>

        <!-- Navigation Links (Desktop) -->
        <nav class="hidden md:flex items-center gap-1">
          <button
            v-if="authStore.permittedModules.value.includes('Tenant Setup')"
            @click="activeTab = 'tenant-setup'"
            :class="[
              'px-3 py-1.5 text-[14px] font-medium transition-all rounded-[6px] cursor-pointer',
              activeTab === 'tenant-setup' ? 'bg-[#E8E8EC]/60 text-[#0A0A0A]' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
            ]"
          >
            Tenant Setup
          </button>
          <button
            v-if="authStore.permittedModules.value.includes('Super Admin Panel') || authStore.permittedModules.value.includes('Tenant Setup')"
            @click="activeTab = 'dashboard'"
            :class="[
              'px-3 py-1.5 text-[14px] font-medium transition-all rounded-[6px] cursor-pointer',
              activeTab === 'dashboard' ? 'bg-[#E8E8EC]/60 text-[#0A0A0A]' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
            ]"
          >
            HR Dashboard
          </button>
          <button
            v-if="authStore.permittedModules.value.includes('Punch In-Out')"
            @click="activeTab = 'punch'"
            :class="[
              'px-3 py-1.5 text-[14px] font-medium transition-all rounded-[6px] cursor-pointer',
              activeTab === 'punch' ? 'bg-[#E8E8EC]/60 text-[#0A0A0A]' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
            ]"
          >
            Web Punch
          </button>
          <button
            v-if="authStore.permittedModules.value.includes('Super Admin Panel')"
            @click="activeTab = 'tenants'"
            :class="[
              'px-3 py-1.5 text-[14px] font-medium transition-all rounded-[6px] cursor-pointer',
              activeTab === 'tenants' ? 'bg-[#E8E8EC]/60 text-[#0A0A0A]' : 'text-[#6B6B6B] hover:text-[#0A0A0A]'
            ]"
          >
            Tenants
          </button>
        </nav>

        <!-- Right User Avatar & Logout -->
        <div class="flex items-center gap-4">
          <span class="h-2 w-2 rounded-full bg-[#10B981]"></span>
          <div class="h-8 w-8 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-display font-bold text-xs uppercase" :title="authStore.user.value || ''">
            {{ (authStore.user.value || 'AD').substring(0, 2) }}
          </div>
          <button 
            @click="authStore.logout()"
            class="text-xs font-semibold text-[#6B6B6B] hover:text-[#EF4444] px-2 py-1 rounded-[4px] hover:bg-[#EF4444]/10 transition-all cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="flex-grow max-w-[1280px] w-full mx-auto px-6 py-12">
      
      <!-- 0. TENANT MANAGEMENT (Super Admin) -->
      <section v-if="activeTab === 'tenants'" class="animate-fade-in">
        <TenantList />
      </section>

      <!-- 1. TENANT SETUP WIZARD -->
      <section v-if="activeTab === 'tenant-setup'" class="max-w-[540px] mx-auto space-y-8 animate-fade-in">
        
        <!-- Header Text -->
        <div class="space-y-2">
          <span class="text-[11px] font-mono uppercase text-[#6366F1] tracking-wider">PHASE 1 / VS-02</span>
          <h1 class="text-[32px] font-display font-bold leading-none tracking-tight text-[#0A0A0A]">
            Provision Tenant Sandbox
          </h1>
          <p class="text-[#6B6B6B] text-[15px]">
            Set up the SaaS environment context, database constraints, and Super Admin boundaries.
          </p>
        </div>

        <!-- Flat Card -->
        <div class="bg-white border border-[#E8E8EC] rounded-[12px] p-8 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
          <div v-if="!isTenantCreated" class="space-y-6">
            
            <div class="space-y-2">
              <label for="tenant-code" class="block text-[13px] font-medium text-[#6B6B6B]">Tenant Code (Unique slug)</label>
              <input
                id="tenant-code"
                type="text"
                v-model="tenantCode"
                placeholder="e.g. acme"
                class="w-full bg-[#FFFFFF] border border-[#E8E8EC] rounded-[6px] px-3.5 py-2.5 text-[14px] text-[#0A0A0A] placeholder-[#9C9C9C] focus:outline-none focus:border-[#6366F1] focus:shadow-focus transition-all"
              />
            </div>

            <div class="space-y-2">
              <label for="company-name" class="block text-[13px] font-medium text-[#6B6B6B]">Primary Company Name</label>
              <input
                id="company-name"
                type="text"
                v-model="companyName"
                placeholder="e.g. Acme Industries Ltd"
                class="w-full bg-[#FFFFFF] border border-[#E8E8EC] rounded-[6px] px-3.5 py-2.5 text-[14px] text-[#0A0A0A] placeholder-[#9C9C9C] focus:outline-none focus:border-[#6366F1] focus:shadow-focus transition-all"
              />
            </div>

            <div class="space-y-2">
              <label for="admin-email" class="block text-[13px] font-medium text-[#6B6B6B]">Super Admin Email Address</label>
              <input
                id="admin-email"
                type="email"
                v-model="adminEmail"
                placeholder="e.g. admin@acme.com"
                class="w-full bg-[#FFFFFF] border border-[#E8E8EC] rounded-[6px] px-3.5 py-2.5 text-[14px] text-[#0A0A0A] placeholder-[#9C9C9C] focus:outline-none focus:border-[#6366F1] focus:shadow-focus transition-all"
              />
            </div>

            <!-- Toggles (using 20px rounded-full checkboxes as preferences) -->
            <div class="border-t border-[#E8E8EC] pt-5 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-[13px] font-medium text-[#6B6B6B]">Enable Multi-Factor OTP Auth</span>
                <button
                  @click="enableMfa = !enableMfa"
                  :class="[
                    'h-[20px] w-[20px] rounded-full border flex items-center justify-center transition-all cursor-pointer',
                    enableMfa ? 'border-[#6366F1] bg-[#6366F1]' : 'border-[#E8E8EC] bg-white'
                  ]"
                >
                  <span v-if="enableMfa" class="text-white text-[10px] font-bold">✓</span>
                </button>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-[13px] font-medium text-[#6B6B6B]">Activate Detailed Audit Logging</span>
                <button
                  @click="enableAuditLog = !enableAuditLog"
                  :class="[
                    'h-[20px] w-[20px] rounded-full border flex items-center justify-center transition-all cursor-pointer',
                    enableAuditLog ? 'border-[#6366F1] bg-[#6366F1]' : 'border-[#E8E8EC] bg-white'
                  ]"
                >
                  <span v-if="enableAuditLog" class="text-white text-[10px] font-bold">✓</span>
                </button>
              </div>
            </div>

            <!-- Primary button (shifts up 1px on hover, 6px radius, glow shadow) -->
            <button
              id="btn-provision"
              @click="handleCreateTenant"
              class="w-full h-[38px] bg-[#6366F1] hover:bg-[#4F46E5] hover:shadow-btn-hover hover:-translate-y-[1px] text-white font-medium text-[14px] rounded-[6px] transition-all cursor-pointer flex items-center justify-center"
            >
              Provision Tenant
            </button>
          </div>

          <!-- Successful state -->
          <div v-else class="text-center py-4 space-y-6">
            <div class="mx-auto h-12 w-12 rounded-full bg-[#10B981]/10 text-[#10B981] flex items-center justify-center text-xl font-bold">
              ✓
            </div>
            <div class="space-y-1">
              <h3 class="text-lg font-display font-bold text-[#0A0A0A]">SaaS Environment Ready</h3>
              <p class="text-[13px] text-[#6B6B6B]">Database logical partitioning completed successfully.</p>
            </div>
            
            <div class="border border-[#E8E8EC] rounded-[8px] bg-[#FAFAFA] p-4 text-left font-mono text-[12px] space-y-1.5">
              <div><span class="text-[#6B6B6B]">tenant_id:</span> TN-{{ tenantCode.toUpperCase() }}</div>
              <div><span class="text-[#6B6B6B]">company:</span> {{ companyName }}</div>
              <div><span class="text-[#6B6B6B]">admin:</span> {{ adminEmail }}</div>
              <div>
                <span class="text-[#6B6B6B]">status:</span> 
                <span class="px-2 py-0.5 rounded-full text-[11px] bg-[#10B981]/10 text-[#10B981] font-semibold font-sans ml-2">Published</span>
              </div>
            </div>

            <button
              id="btn-reset"
              @click="isTenantCreated = false; tenantCode = ''; companyName = ''; adminEmail = ''"
              class="px-4 py-2 border border-[#E8E8EC] hover:bg-[#FAFAFA] text-[13px] font-medium text-[#6B6B6B] rounded-[6px] transition-all cursor-pointer"
            >
              Reset Form
            </button>
          </div>
        </div>
      </section>

      <!-- 2. HR DASHBOARD VIEW -->
      <section v-if="activeTab === 'dashboard'" class="space-y-8 animate-fade-in">
        
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E8EC] pb-6">
          <div class="space-y-1">
            <span class="text-[11px] font-mono uppercase text-[#6366F1] tracking-wider">PHASE 1 / VS-11</span>
            <h1 class="text-[32px] font-display font-bold leading-none tracking-tight">HR Control Panel</h1>
            <p class="text-[#6B6B6B] text-[15px]">Overview of active tenants, kiosk devices, and pending exceptions.</p>
          </div>
        </div>

        <!-- Metric Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Card 1 -->
          <div class="bg-white border border-[#E8E8EC] rounded-[12px] p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
            <span class="text-[11px] font-mono uppercase text-[#6B6B6B] tracking-wider">Active Tenants</span>
            <div class="text-[28px] font-display font-bold mt-2">12</div>
            <div class="mt-2 text-[12px] text-[#10B981] font-medium">✓ Scoped logically</div>
          </div>
          <!-- Card 2 -->
          <div class="bg-white border border-[#E8E8EC] rounded-[12px] p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
            <span class="text-[11px] font-mono uppercase text-[#6B6B6B] tracking-wider">Configured Devices</span>
            <div class="text-[28px] font-display font-bold mt-2">18</div>
            <div class="mt-2 text-[12px] text-[#6B6B6B] font-medium">Mapped to branches</div>
          </div>
          <!-- Card 3 -->
          <div class="bg-white border border-[#E8E8EC] rounded-[12px] p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5">
            <span class="text-[11px] font-mono uppercase text-[#6B6B6B] tracking-wider">Attendance Logs</span>
            <div class="text-[28px] font-display font-bold mt-2">842</div>
            <div class="mt-2 text-[12px] text-[#10B981] font-medium">Published today</div>
          </div>
          <!-- Card 4 (Semantic Alert State) -->
          <div class="bg-white border border-[#E8E8EC] rounded-[12px] p-6 transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 border-l-4 border-l-[#EF4444]">
            <span class="text-[11px] font-mono uppercase text-[#EF4444] tracking-wider">Pending Exceptions</span>
            <div class="text-[28px] font-display font-bold text-[#EF4444] mt-2">3</div>
            <div class="mt-2 text-[12px] text-[#6B6B6B] font-medium">Requires validation</div>
          </div>
        </div>

        <!-- Detailed Lists (Stacked rows with dividers, hover bg-alt) -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <!-- Kiosk Status List -->
          <div class="lg:col-span-2 bg-white border border-[#E8E8EC] rounded-[12px] p-6">
            <h3 class="text-[20px] font-display font-bold border-b border-[#E8E8EC] pb-4 mb-2">Registered Shared Kiosks</h3>
            
            <div class="divide-y divide-[#E8E8EC]">
              <div class="py-4 flex items-center justify-between hover:bg-[#FAFAFA]/60 px-2 transition-all">
                <div class="space-y-1">
                  <h4 class="font-display font-bold text-[15px]">HQ Office Entry Terminal</h4>
                  <p class="text-[12px] text-[#6B6B6B]">Bound to branch: <span class="font-semibold">Headquarters</span></p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] bg-[#10B981]/10 text-[#10B981] font-semibold">Published</span>
                  <span class="text-[12px] text-[#6B6B6B] font-mono">142 punches</span>
                </div>
              </div>
              
              <div class="py-4 flex items-center justify-between hover:bg-[#FAFAFA]/60 px-2 transition-all">
                <div class="space-y-1">
                  <h4 class="font-display font-bold text-[15px]">Logistics Dock Gate B</h4>
                  <p class="text-[12px] text-[#6B6B6B]">Bound to branch: <span class="font-semibold">East Warehouse</span></p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] bg-[#10B981]/10 text-[#10B981] font-semibold">Published</span>
                  <span class="text-[12px] text-[#6B6B6B] font-mono">82 punches</span>
                </div>
              </div>

              <div class="py-4 flex items-center justify-between hover:bg-[#FAFAFA]/60 px-2 transition-all">
                <div class="space-y-1">
                  <h4 class="font-display font-bold text-[15px]">Downtown Retail Hub</h4>
                  <p class="text-[12px] text-[#6B6B6B]">Bound to branch: <span class="font-semibold">Retail Center</span></p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[11px] bg-[#F59E0B]/10 text-[#F59E0B] font-semibold">Pending</span>
                  <span class="text-[12px] text-[#6B6B6B] font-mono">0 punches</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Audit Log Section -->
          <div class="bg-white border border-[#E8E8EC] rounded-[12px] p-6">
            <h3 class="text-[20px] font-display font-bold border-b border-[#E8E8EC] pb-4 mb-4">Security Logs</h3>
            <div class="space-y-5 text-[13px]">
              <div class="space-y-1">
                <p class="font-medium text-[#0A0A0A]">Environment Configuration updated</p>
                <div class="flex items-center gap-2 text-[11px] text-[#9C9C9C] font-mono">
                  <span>admin@nexus.com</span>
                  <span>•</span>
                  <span>10 mins ago</span>
                </div>
              </div>
              <div class="space-y-1">
                <p class="font-medium text-[#0A0A0A]">Kiosk Device Bound</p>
                <div class="flex items-center gap-2 text-[11px] text-[#9C9C9C] font-mono">
                  <span>Retail Center terminal</span>
                  <span>•</span>
                  <span>1 hr ago</span>
                </div>
              </div>
              <div class="space-y-1">
                <p class="font-medium text-[#EF4444]">Verification Mismatch Alert</p>
                <div class="flex items-center gap-2 text-[11px] text-[#9C9C9C] font-mono">
                  <span>Selfie low confidence</span>
                  <span>•</span>
                  <span>2 hrs ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. WEB/MOBILE PUNCH PAGE -->
      <section v-if="activeTab === 'punch'" class="max-w-[960px] mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in">
        
        <!-- Punch Card -->
        <div class="lg:col-span-3 bg-white border border-[#E8E8EC] rounded-[12px] p-8">
          <div class="border-b border-[#E8E8EC] pb-4 mb-6">
            <span class="text-[11px] font-mono uppercase text-[#6366F1] tracking-wider">PHASE 1 / VS-06</span>
            <h2 class="text-[24px] font-display font-bold tracking-tight text-[#0A0A0A]">Employee Attendance Punch</h2>
            <p class="text-[#6B6B6B] text-[13px] mt-1">Submit geofenced coordinate coordinates and selfie validation.</p>
          </div>

          <div class="space-y-6">
            <!-- GPS Row -->
            <div class="flex items-center justify-between border border-[#E8E8EC] rounded-[6px] p-4 bg-[#FAFAFA]">
              <div class="space-y-1">
                <h4 class="font-display font-bold text-[14px]">1. Geolocation Check</h4>
                <p class="text-[12px] text-[#6B6B6B]">Retrieve and check device coordinates.</p>
              </div>
              <button
                id="btn-gps"
                @click="triggerGpsLocating"
                :disabled="simulatedGpsStatus === 'success'"
                class="px-4 py-2 border border-[#E8E8EC] hover:bg-[#FAFAFA] text-[13px] font-medium text-[#6366F1] rounded-[6px] transition-all cursor-pointer disabled:opacity-60"
              >
                <span v-if="simulatedGpsStatus === 'idle'">Verify GPS</span>
                <span v-else-if="simulatedGpsStatus === 'locating'">Locating...</span>
                <span v-else class="text-[#10B981]">✓ Verified</span>
              </button>
            </div>

            <!-- Selfie Row -->
            <div class="border border-[#E8E8EC] rounded-[6px] p-4 bg-[#FAFAFA]">
              <div class="flex items-center justify-between">
                <div class="space-y-1">
                  <h4 class="font-display font-bold text-[14px]">2. Selfie Photo Validation</h4>
                  <p class="text-[12px] text-[#6B6B6B]">Secure authentication via biometrics.</p>
                </div>
                <div>
                  <label
                    for="selfie-file"
                    class="px-4 py-2 border border-[#E8E8EC] hover:bg-[#FAFAFA] text-[13px] font-medium text-[#6366F1] rounded-[6px] cursor-pointer inline-block transition-all"
                  >
                    Take Photo
                  </label>
                  <input
                    id="selfie-file"
                    type="file"
                    accept="image/*"
                    @change="handleSelfieUpload"
                    class="hidden"
                  />
                </div>
              </div>
              <div v-if="selfieUpload" class="mt-4 flex justify-center">
                <img :src="selfieUpload" class="h-32 w-32 object-cover rounded-[6px] border border-[#E8E8EC] shadow-sm" />
              </div>
            </div>

            <!-- Primary Punch Button -->
            <button
              id="btn-punch"
              @click="handlePunch"
              class="w-full h-[44px] bg-[#6366F1] hover:bg-[#4F46E5] hover:shadow-btn-hover hover:-translate-y-[1px] text-white font-medium text-[14px] rounded-[6px] transition-all cursor-pointer flex items-center justify-center"
            >
              Confirm {{ punchStatus === 'out' ? 'PUNCH IN' : 'PUNCH OUT' }}
            </button>
          </div>
        </div>

        <!-- Punch Logs -->
        <div class="lg:col-span-2 bg-white border border-[#E8E8EC] rounded-[12px] p-6">
          <h3 class="text-[18px] font-display font-bold border-b border-[#E8E8EC] pb-3 mb-4">Log History</h3>
          <div class="space-y-3">
            <div
              v-for="(log, idx) in punchLogs"
              :key="idx"
              class="border border-[#E8E8EC] rounded-[6px] p-4 bg-[#FAFAFA]"
            >
              <div class="flex items-center justify-between">
                <span class="font-display font-bold text-[13px] text-[#0A0A0A]">{{ log.type }}</span>
                <span class="font-mono text-[11px] text-[#6B6B6B]">{{ log.time }}</span>
              </div>
              <p class="text-[12px] text-[#6B6B6B] mt-1.5 flex items-center gap-2">
                <span
                  :class="[
                    'h-1.5 w-1.5 rounded-full',
                    log.semantic === 'success' ? 'bg-[#10B981]' : 'bg-[#9C9C9C]'
                  ]"
                ></span>
                {{ log.status }}
              </p>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer -->
    <footer class="border-t border-[#E8E8EC] py-6 text-center text-[12px] text-[#6B6B6B] bg-white mt-auto">
      <div class="max-w-[1280px] w-full mx-auto px-6">
        <span>© 2026 Modern SaaS HRMS Platform. Active style: Shree HRMS System.</span>
      </div>
    </footer>
  </div>
  </template>
</template>

<style>
/* Reset font classes */
h1, h2, h3, h4 {
  font-family: var(--font-display), sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
}

body {
  font-family: var(--font-sans), sans-serif;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.25s ease-out forwards;
}
</style>
