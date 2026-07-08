# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vs02_a_tenant_creation.spec.ts >> VS-02-A: Tenant Creation (Super Admin) >> Employee role does not see the Tenants nav button
- Location: tests/e2e/vs02_a_tenant_creation.spec.ts:167:3

# Error details

```
TimeoutError: page.waitForSelector: Timeout 8000ms exceeded.
Call log:
  - waiting for locator('header') to be visible

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - generic [ref=e7]: Shree HRMS
    - heading "Sign in to your account" [level=2] [ref=e8]
    - paragraph [ref=e9]: Enter your email and password to receive a one-time OTP
  - generic [ref=e12]:
    - generic [ref=e13]:
      - img [ref=e14]
      - generic [ref=e16]: Invalid credentials
    - generic [ref=e17]:
      - generic [ref=e18]: Email Address
      - textbox "Email Address" [ref=e20]:
        - /placeholder: you@domain.com
        - text: limited@test.com
    - generic [ref=e21]:
      - generic [ref=e22]: Password
      - textbox "Password" [ref=e24]:
        - /placeholder: ••••••••
        - text: testpass123
    - button "Continue with OTP" [ref=e26] [cursor=pointer]
```

# Test source

```ts
  1   | /**
  2   |  * VS-02-A: Tenant Creation E2E Tests
  3   |  *
  4   |  * Run with:
  5   |  *   npm --prefix frontend run test:e2e -- --grep "VS-02-A"
  6   |  *
  7   |  * Requires the app to be running locally (npm run dev) and the backend
  8   |  * to have a Super Admin test user.
  9   |  */
  10  | 
  11  | import { test, expect, Page } from '@playwright/test'
  12  | 
  13  | // ---------------------------------------------------------------------------
  14  | // Helpers
  15  | // ---------------------------------------------------------------------------
  16  | 
  17  | const BASE_URL = process.env.BASE_URL || 'http://localhost:5173'
  18  | const SUPER_ADMIN_USER = process.env.TEST_SUPER_ADMIN_USER || 'Administrator'
  19  | const SUPER_ADMIN_PASS = process.env.TEST_SUPER_ADMIN_PASS || 'admin'
  20  | const EMPLOYEE_USER = process.env.TEST_EMPLOYEE_USER || 'limited@test.com'
  21  | const EMPLOYEE_PASS = process.env.TEST_EMPLOYEE_PASS || 'testpass123'
  22  | 
  23  | /** Log in via the OTP login flow used by VS-01. */
  24  | async function loginAs(page: Page, user: string, pass: string) {
  25  |   page.on('console', msg => console.log('PAGE LOG:', msg.text()))
  26  |   page.on('response', response => {
  27  |     if (response.url().includes('/api/method/')) {
  28  |       console.log(`API ${response.status()} ${response.url()}`)
  29  |     }
  30  |   })
  31  | 
  32  |   await page.goto(`${BASE_URL}/`)
  33  |   await page.waitForSelector('#username', { state: 'visible' })
  34  |   await page.waitForTimeout(500) // Ensure Vue hydration is complete
  35  |   await page.fill('#username', user)
  36  |   await page.fill('#password', pass)
  37  |   
  38  |   // Submit the form and wait for the UI fetch to finish
  39  |   const [response] = await Promise.all([
  40  |     page.waitForResponse(res => res.url().includes('/api/method/hrms_saas.api.auth.login')),
  41  |     page.click('#btn-login')
  42  |   ])
  43  | 
  44  |   // The UI fetch response in test mode contains the OTP
  45  |   const otpResponse = await response.json()
  46  |   console.log('OTP RESPONSE:', otpResponse)
  47  | 
  48  |   // Verify we got the dev_otp
  49  |   let otp = process.env.TEST_OTP || '000000'
  50  |   console.log('OTP RESPONSE:', otpResponse)
  51  |   if (otpResponse?.message?.dev_otp) {
  52  |     otp = otpResponse.message.dev_otp
  53  |   } else if (otpResponse?.message?.message?.dev_otp) {
  54  |     otp = otpResponse.message.message.dev_otp
  55  |   }
  56  |   
  57  |   console.log('OTP string parsed:', otp)
  58  |   
  59  |   await page.waitForSelector('#otp', { timeout: 5000 }).catch(e => console.log('Wait for #otp failed:', e))
  60  |   const otpField = page.locator('#otp')
  61  |   const visible = await otpField.isVisible()
  62  |   console.log('Is #otp visible?', visible)
  63  |   
  64  |   if (visible) {
  65  |     console.log('Filling OTP and clicking verify...')
  66  |     await otpField.fill(otp)
  67  |     await page.click('#btn-verify-otp')
  68  |     console.log('Clicked verify!')
  69  |   } else {
  70  |     console.log('OTP field NOT visible! Body HTML:', await page.locator('body').innerHTML())
  71  |   }
  72  | 
  73  |   // Wait for dashboard
  74  |   console.log('Waiting for header...')
> 75  |   await page.waitForSelector('header', { timeout: 8000 })
      |              ^ TimeoutError: page.waitForSelector: Timeout 8000ms exceeded.
  76  |   console.log('Header found!')
  77  | }
  78  | 
  79  | // ---------------------------------------------------------------------------
  80  | // Tests
  81  | // ---------------------------------------------------------------------------
  82  | 
  83  | test.describe('VS-02-A: Tenant Creation (Super Admin)', () => {
  84  | 
  85  |   // -------------------------------------------------------------------------
  86  |   // Happy Path 1: Create tenant successfully
  87  |   // -------------------------------------------------------------------------
  88  |   test('Super Admin creates a new tenant successfully', async ({ page }) => {
  89  |     await loginAs(page, SUPER_ADMIN_USER, SUPER_ADMIN_PASS)
  90  | 
  91  |     // Navigate to Tenants tab
  92  |     const tenantsBtn = page.locator('button', { hasText: 'Tenants' })
  93  |     await expect(tenantsBtn).toBeVisible({ timeout: 5000 })
  94  |     await tenantsBtn.click()
  95  | 
  96  |     // Open new tenant form
  97  |     const newBtn = page.locator('#btn-new-tenant')
  98  |     await newBtn.click()
  99  | 
  100 |     // Fill form fields
  101 |     const uniqueCode = `e2etest${Date.now()}`.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 12)
  102 |     await page.fill('#input-tenant-code', uniqueCode)
  103 |     await page.fill('#input-tenant-name', 'E2E Test Corp')
  104 |     await page.fill('#input-admin-email', `admin@${uniqueCode}.com`)
  105 | 
  106 |     // Submit
  107 |     await page.click('#btn-submit-tenant')
  108 | 
  109 |     // Success: form should close and the new row should appear in the table
  110 |     await expect(page.locator('#btn-new-tenant')).toHaveText('+ New Tenant', { timeout: 5000 })
  111 | 
  112 |     // The tenant code should appear in the list
  113 |     await expect(page.locator(`td:has-text("${uniqueCode}")`)).toBeVisible({ timeout: 5000 })
  114 |   })
  115 | 
  116 |   // -------------------------------------------------------------------------
  117 |   // Happy Path 2: Duplicate tenant_code shows inline error
  118 |   // -------------------------------------------------------------------------
  119 |   test('Duplicate tenant_code shows TENANT_EXISTS error inline', async ({ page }) => {
  120 |     await loginAs(page, SUPER_ADMIN_USER, SUPER_ADMIN_PASS)
  121 | 
  122 |     // Pre-create via API to guarantee a collision
  123 |     const dupCode = `dup${Date.now()}`.slice(-10)
  124 |     await page.evaluate(async (code) => {
  125 |       await fetch('/api/method/hrms_saas.api.tenant.create_tenant', {
  126 |         method: 'POST',
  127 |         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('auth_token')}` },
  128 |         body: JSON.stringify({ tenant_code: code, tenant_name: 'Dup Pre', admin_email: `a@${code}.com` }),
  129 |       })
  130 |     }, dupCode)
  131 | 
  132 |     // Navigate and try same code
  133 |     await page.locator('button', { hasText: 'Tenants' }).click()
  134 |     await page.locator('#btn-new-tenant').click()
  135 |     await page.fill('#input-tenant-code', dupCode)
  136 |     await page.fill('#input-tenant-name', 'Dup Attempt')
  137 |     await page.fill('#input-admin-email', `b@${dupCode}.com`)
  138 |     await page.click('#btn-submit-tenant')
  139 | 
  140 |     // Inline error should appear for tenant_code field
  141 |     const errLocator = page.locator('#tenant-code-error')
  142 |     await expect(errLocator).toBeVisible({ timeout: 5000 })
  143 |     await expect(errLocator).toContainText(/already exists/i)
  144 |   })
  145 | 
  146 |   // -------------------------------------------------------------------------
  147 |   // Edge Case 1: Blank tenant_code blocks form submission (client validation)
  148 |   // -------------------------------------------------------------------------
  149 |   test('Blank tenant_code is caught by client validation before submission', async ({ page }) => {
  150 |     await loginAs(page, SUPER_ADMIN_USER, SUPER_ADMIN_PASS)
  151 | 
  152 |     await page.locator('button', { hasText: 'Tenants' }).click()
  153 |     await page.locator('#btn-new-tenant').click()
  154 | 
  155 |     // Leave tenant_code blank, fill others
  156 |     await page.fill('#input-tenant-name', 'No Code Corp')
  157 |     await page.fill('#input-admin-email', 'nocode@test.com')
  158 |     await page.click('#btn-submit-tenant')
  159 | 
  160 |     // Validation error should appear immediately without any network request
  161 |     await expect(page.locator('#tenant-code-error')).toBeVisible({ timeout: 2000 })
  162 |   })
  163 | 
  164 |   // -------------------------------------------------------------------------
  165 |   // Edge Case 2: Non-Super-Admin cannot see the Tenants nav tab
  166 |   // -------------------------------------------------------------------------
  167 |   test('Employee role does not see the Tenants nav button', async ({ page }) => {
  168 |     await loginAs(page, EMPLOYEE_USER, EMPLOYEE_PASS)
  169 | 
  170 |     // Tenants button should NOT be visible for Employee role
  171 |     const tenantsBtn = page.locator('button', { hasText: 'Tenants' })
  172 |     await expect(tenantsBtn).not.toBeVisible({ timeout: 3000 }).catch(() => {
  173 |       // If it IS visible but navigating to it causes a 403, that's also acceptable.
  174 |       // But per our role guard it should not be visible at all.
  175 |     })
```