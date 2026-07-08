# Phase 1, Slice 2 Documentation: Tenant/Company Setup

## Slice Overview

- **Slice ID:** VS-02
- **Status:** IN PROGRESS
- **Started:** 2026-07-08
- **Depends on:** VS-01 (Authentication/Login + Role Permission)

> [!IMPORTANT]
> **How this doc differs from Slice 1.**
> Slice 1 was split horizontally: all backend steps first, then all frontend steps, then E2E last.
> That approach caused integration pain because the two sides evolved in isolation.
>
> **VS-02 is split into true vertical sub-slices.**
> Each sub-slice ships one complete business action — database schema → API → frontend screen →
> API integration tests → E2E tests — before moving to the next.
> A sub-slice is not done until its own E2E passes.

---

## Sub-Slice Map

| Sub-Slice | Business Action | DB | API | Frontend | API Tests | E2E | Status |
|-----------|----------------|----|-----|----------|-----------|-----|--------|
| VS-02-A | Tenant creation (Super Admin) | ✅ | ✅ | ✅ | ✅ | ✅ | ⏳ AWAITING TEST |
| VS-02-B | Company create / update (Tenant Admin) | ✅ | ✅ | ✅ | ✅ | ✅ | 🔒 LOCKED |
| VS-02-C | Tenant status management (activate / suspend) | — | ✅ | ✅ | ✅ | ✅ | 🔒 LOCKED |
| VS-02-D | Setup checklist (read + completeness indicator) | — | ✅ | ✅ | ✅ | ✅ | 🔒 LOCKED |

Each row is executed and verified before moving to the next.

---

## VS-02-A: Tenant Creation (Super Admin)

### Objective

A Super Admin can create a new tenant with a unique code, name, and admin contact.
The created tenant starts in `Pending` status. Accessible from the admin shell built in VS-01.

### Database Schema

**DocType: `Tenant`** (new)

| Field | Type | Constraints |
|---|---|---|
| `name` | Data | Frappe PK (auto) |
| `tenant_code` | Data | Unique, required |
| `tenant_name` | Data | Required |
| `status` | Select | `Pending / Active / Suspended`, default `Pending` |
| `admin_email` | Data | Required, valid email |
| `admin_mobile` | Data | Optional |
| `plan` | Data | Placeholder, nullable |
| `created_by_user` | Link → User | Set on insert |
| `notes` | Text | Optional |

### API Contract

**POST `/api/method/hrms_saas.api.tenant.create_tenant`**

Request:
```json
{ "tenant_code": "ACME", "tenant_name": "Acme Corp", "admin_email": "admin@acme.com" }
```

Success `200`:
```json
{ "success": true, "tenant_code": "ACME", "status": "Pending" }
```

Error `409` duplicate:
```json
{ "success": false, "error": "TENANT_EXISTS", "message": "Tenant code already exists." }
```

Error `403` wrong role:
```json
{ "success": false, "error": "PERMISSION_DENIED" }
```

**GET `/api/method/hrms_saas.api.tenant.list_tenants`**

Returns paginated list (Super Admin only). Fields: `tenant_code`, `tenant_name`, `status`, `admin_email`, `creation`.

### Frontend Screens

| Route | Component | Note |
|---|---|---|
| `/admin/tenants` | `TenantList.vue` | Table + status badge + "New Tenant" button |
| `/admin/tenants/new` | `TenantForm.vue` | Create form with field validation |

### Files Created / Modified

| Action | Path |
|--------|------|
| NEW | `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/tenant/tenant.json` |
| NEW | `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/tenant/__init__.py` |
| NEW | `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/tenant/tenant.py` |
| NEW | `backend/apps/hrms_saas/hrms_saas/shreehrms/services/tenant_service.py` |
| NEW | `backend/apps/hrms_saas/hrms_saas/api/tenant.py` |
| NEW | `backend/apps/hrms_saas/hrms_saas/tests/test_tenant_api.py` |
| NEW | `frontend/src/views/admin/TenantList.vue` |
| NEW | `frontend/src/views/admin/TenantForm.vue` |
| MODIFY | `frontend/src/router/index.ts` |
| NEW | `frontend/tests/e2e/vs02_a_tenant_creation.spec.ts` |

### API Integration Tests

File: `backend/apps/hrms_saas/hrms_saas/tests/test_tenant_api.py`

| # | Scenario | Expected |
|---|---|---|
| 1 | Super Admin creates tenant | 200, `status: Pending` |
| 2 | Duplicate `tenant_code` | 409 |
| 3 | Non-Super-Admin role | 403 |
| 4 | Missing `tenant_code` | 400 |

### E2E Tests

File: `frontend/tests/e2e/vs02_a_tenant_creation.spec.ts`

**Happy path:**
1. Super Admin logs in (reuses VS-01 E2E auth helper)
2. Navigates to `/admin/tenants/new`
3. Fills unique `tenant_code`, name, email → submits
4. Success toast shown → redirected to list → new row visible with `Pending` badge

**Edge cases:**
1. Duplicate `tenant_code` → inline error shown
2. Blank `tenant_code` → form validation blocks submission
3. Non-Super-Admin navigates to `/admin/tenants` → redirected (route guard / 403)

### Verification Commands

```bash
# 1. API integration tests
docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests \
  --app hrms_saas --module hrms_saas.tests.test_tenant_api

# 2. Frontend unit tests
npm --prefix frontend run test:unit -- --testPathPattern="TenantList|TenantForm"

# 3. E2E
npm --prefix frontend run test:e2e -- --grep "VS-02-A"
```

> **Stop here. Run tests. Only proceed to VS-02-B on PASS.**

---

## VS-02-B: Company Create / Update (Tenant Admin)

### Objective

A Tenant Admin can create the company record for their tenant and update it later.
Company is scoped to the tenant — a Tenant Admin cannot touch another tenant's company.

### Database Schema

**DocType: `Company`** — Frappe built-in. Add custom fields via fixtures:

| Custom field | Type | Constraints |
|---|---|---|
| `tenant` | Link → Tenant | Required on all companies in this app |
| `industry` | Data | Optional |
| `company_website` | Data | Optional |

> ponytail: Frappe's built-in `Company` already carries `company_name`, `abbr`, `country`,
> `default_currency`, `email`, `phone_no`. Not duplicated.

### API Contract

**POST `/api/method/hrms_saas.api.company.create_or_update_company`**

Request:
```json
{
  "company_name": "Acme Corp Ltd",
  "abbr": "ACL",
  "country": "US",
  "default_currency": "USD",
  "email": "info@acme.com",
  "tenant": "ACME"
}
```

Success `200`:
```json
{ "success": true, "company": "Acme Corp Ltd" }
```

Error `403` cross-tenant:
```json
{ "success": false, "error": "PERMISSION_DENIED", "message": "Tenant mismatch." }
```

**GET `/api/method/hrms_saas.api.company.get_company`**

Returns company fields for calling user's tenant. Returns `null` if not yet created.

### Frontend Screens

| Route | Component | Note |
|---|---|---|
| `/setup/company` | `CompanySetup.vue` | Create/update form — loads existing data if present |

### Files Created / Modified

| Action | Path |
|--------|------|
| NEW | `backend/apps/hrms_saas/hrms_saas/fixtures/custom_field_company_tenant.json` |
| NEW | `backend/apps/hrms_saas/hrms_saas/shreehrms/services/company_service.py` |
| NEW | `backend/apps/hrms_saas/hrms_saas/api/company.py` |
| NEW | `backend/apps/hrms_saas/hrms_saas/tests/test_company_api.py` |
| NEW | `frontend/src/views/setup/CompanySetup.vue` |
| MODIFY | `frontend/src/router/index.ts` |
| NEW | `frontend/tests/e2e/vs02_b_company_setup.spec.ts` |

### API Integration Tests

File: `backend/apps/hrms_saas/hrms_saas/tests/test_company_api.py`

| # | Scenario | Expected |
|---|---|---|
| 1 | Tenant Admin creates company for own tenant | 200 |
| 2 | Tenant Admin updates existing company | 200 |
| 3 | Tenant Admin sets `tenant` to other tenant's code | 403 |
| 4 | Super Admin reads any company | 200 |
| 5 | Missing `company_name` | 400 |

### E2E Tests

File: `frontend/tests/e2e/vs02_b_company_setup.spec.ts`

**Happy path:**
1. Tenant Admin logs in
2. Navigates to `/setup/company` — form is empty
3. Fills required fields → submits → success toast
4. Revisits page → form pre-filled with saved values
5. Updates `email` → saves → toast confirms update

**Edge cases:**
1. Tenant Admin sends `tenant` = other code in body → 403 shown as error
2. Blank `company_name` → validation blocks submission

### Verification Commands

```bash
docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests \
  --app hrms_saas --module hrms_saas.tests.test_company_api

npm --prefix frontend run test:unit -- --testPathPattern="CompanySetup"

npm --prefix frontend run test:e2e -- --grep "VS-02-B"
```

> **Stop here. Run tests. Only proceed to VS-02-C on PASS.**

---

## VS-02-C: Tenant Status Management (Activate / Suspend)

### Objective

A Super Admin can activate a `Pending` tenant or suspend/reactivate an existing one.
Suspending immediately revokes all active sessions for that tenant's users.

### Database Schema

No new DocTypes.

> ponytail: Check if VS-01 already added `tenant` to `User Session`. If yes, skip that field migration.

If `User Session` does not already have a `tenant` link, add it via fixture now.

### API Contract

**POST `/api/method/hrms_saas.api.tenant.update_tenant_status`**

Request:
```json
{ "tenant_code": "ACME", "status": "Active", "reason": "Onboarding complete" }
```

Valid transitions: `Pending → Active`, `Active → Suspended`, `Suspended → Active`.

Success `200`:
```json
{ "success": true, "tenant_code": "ACME", "status": "Active" }
```

Error `422` invalid transition:
```json
{ "success": false, "error": "INVALID_TRANSITION" }
```

Error `400` suspend without reason:
```json
{ "success": false, "error": "REASON_REQUIRED" }
```

### Frontend Screens

No new route. Extend `TenantList.vue` (VS-02-A) with action column.

| Component | Change |
|---|---|
| `TenantList.vue` | Add Activate / Suspend / Reactivate action column |
| `TenantStatusDialog.vue` | New modal: current status, reason textarea (suspend only), confirm button |

### Files Created / Modified

| Action | Path |
|--------|------|
| MODIFY | `backend/apps/hrms_saas/hrms_saas/shreehrms/services/tenant_service.py` |
| MODIFY | `backend/apps/hrms_saas/hrms_saas/api/tenant.py` |
| MODIFY | `backend/apps/hrms_saas/hrms_saas/tests/test_tenant_api.py` |
| MODIFY | `frontend/src/views/admin/TenantList.vue` |
| NEW | `frontend/src/components/admin/TenantStatusDialog.vue` |
| NEW | `frontend/tests/e2e/vs02_c_tenant_status.spec.ts` |

### API Integration Tests

Added to `test_tenant_api.py`:

| # | Scenario | Expected |
|---|---|---|
| 1 | `Pending → Active` | 200, status updated |
| 2 | `Active → Suspended` with reason | 200, sessions revoked |
| 3 | `Suspended → Active` | 200 |
| 4 | `Active → Pending` | 422 invalid transition |
| 5 | Suspend without `reason` | 400 |
| 6 | Non-Super-Admin calls endpoint | 403 |

### E2E Tests

File: `frontend/tests/e2e/vs02_c_tenant_status.spec.ts`

**Happy path:**
1. Super Admin opens Tenant List
2. Finds `Pending` tenant → clicks "Activate" → dialog → confirm → row shows `Active`
3. Clicks "Suspend" → reason required → enters reason → confirm → row shows `Suspended`
4. Clicks "Reactivate" → confirm → row shows `Active`

**Edge cases:**
1. Suspend without entering reason → confirm button stays disabled
2. Suspended tenant's user tries to log in → rejected (VS-01 logic; E2E verifies API response post-suspension)

### Verification Commands

```bash
docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests \
  --app hrms_saas --module hrms_saas.tests.test_tenant_api

npm --prefix frontend run test:unit -- --testPathPattern="TenantStatusDialog|TenantList"

npm --prefix frontend run test:e2e -- --grep "VS-02-C"
```

> **Stop here. Run tests. Only proceed to VS-02-D on PASS.**

---

## VS-02-D: Setup Checklist (Read + Completeness Indicator)

### Objective

A Tenant Admin sees a setup checklist indicating which setup steps are complete
(company, branches, employees, policy), so they know what to configure next.
This sub-slice is read-only — no new writes, no new DocTypes.

### Database Schema

No changes. Checklist is computed from existing records via `frappe.db.exists()`.

> ponytail: Four boolean checks, four `frappe.db.exists()` calls. No event-driven state machine
> needed until items exceed ~10 checks.

### API Contract

**GET `/api/method/hrms_saas.api.tenant.setup_status`**

Response `200`:
```json
{
  "success": true,
  "tenant_code": "ACME",
  "checklist": {
    "company": true,
    "branches": false,
    "employees": false,
    "attendance_policy": false
  },
  "completion_percent": 25
}
```

### Frontend Screens

| Route | Component | Note |
|---|---|---|
| `/setup/checklist` | `SetupChecklist.vue` | Full page with progress bar and "Go" links per item |
| `DashboardLayout.vue` | patch | Compact progress card in sidebar (Tenant Admin only) |

### Files Created / Modified

| Action | Path |
|--------|------|
| MODIFY | `backend/apps/hrms_saas/hrms_saas/shreehrms/services/tenant_service.py` |
| MODIFY | `backend/apps/hrms_saas/hrms_saas/api/tenant.py` |
| NEW | `backend/apps/hrms_saas/hrms_saas/tests/test_setup_status_api.py` |
| NEW | `frontend/src/views/setup/SetupChecklist.vue` |
| MODIFY | `frontend/src/layouts/DashboardLayout.vue` |
| MODIFY | `frontend/src/router/index.ts` |
| NEW | `frontend/tests/e2e/vs02_d_setup_checklist.spec.ts` |

### API Integration Tests

File: `backend/apps/hrms_saas/hrms_saas/tests/test_setup_status_api.py`

| # | Scenario | Expected |
|---|---|---|
| 1 | Fresh tenant (no company yet) | All `false`, `completion_percent: 0` |
| 2 | After VS-02-B company created | `company: true`, percent increases |
| 3 | Tenant Admin queries own tenant | 200 |
| 4 | Super Admin queries any tenant | 200 |
| 5 | Employee role | 403 |

### E2E Tests

File: `frontend/tests/e2e/vs02_d_setup_checklist.spec.ts`

**Happy path:**
1. Tenant Admin logs in
2. Dashboard sidebar shows progress card (e.g. "1/4 complete")
3. Navigates to `/setup/checklist`
4. Sees four items; "Company" checked, others unchecked
5. Clicks "Go" next to "Branches" → navigates to `/setup/branches` (built in VS-03)

**Edge cases:**
1. Super Admin visits checklist for specific tenant → sees that tenant's data
2. Employee navigates to `/setup/checklist` → redirected (route guard / 403)

### Verification Commands

```bash
docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests \
  --app hrms_saas --module hrms_saas.tests.test_setup_status_api

npm --prefix frontend run test:unit -- --testPathPattern="SetupChecklist"

npm --prefix frontend run test:e2e -- --grep "VS-02-D"
```

> **Stop here. Run tests. Declare VS-02 COMPLETE only after VS-02-D passes.**

---

## Slice-Level E2E Run (after all sub-slices pass)

```bash
npm --prefix frontend run test:e2e -- --grep "VS-02"
```

---

## Files Summary (All Affected Files)

### New Files

| File | Sub-Slice |
|------|-----------|
| `backend/.../doctype/tenant/tenant.json` | VS-02-A |
| `backend/.../doctype/tenant/__init__.py` | VS-02-A |
| `backend/.../doctype/tenant/tenant.py` | VS-02-A |
| `backend/.../services/tenant_service.py` | VS-02-A / C / D |
| `backend/.../api/tenant.py` | VS-02-A / C / D |
| `backend/.../api/company.py` | VS-02-B |
| `backend/.../services/company_service.py` | VS-02-B |
| `backend/.../fixtures/custom_field_company_tenant.json` | VS-02-B |
| `backend/.../tests/test_tenant_api.py` | VS-02-A / C |
| `backend/.../tests/test_company_api.py` | VS-02-B |
| `backend/.../tests/test_setup_status_api.py` | VS-02-D |
| `frontend/src/views/admin/TenantList.vue` | VS-02-A / C |
| `frontend/src/views/admin/TenantForm.vue` | VS-02-A |
| `frontend/src/components/admin/TenantStatusDialog.vue` | VS-02-C |
| `frontend/src/views/setup/CompanySetup.vue` | VS-02-B |
| `frontend/src/views/setup/SetupChecklist.vue` | VS-02-D |
| `frontend/tests/e2e/vs02_a_tenant_creation.spec.ts` | VS-02-A |
| `frontend/tests/e2e/vs02_b_company_setup.spec.ts` | VS-02-B |
| `frontend/tests/e2e/vs02_c_tenant_status.spec.ts` | VS-02-C |
| `frontend/tests/e2e/vs02_d_setup_checklist.spec.ts` | VS-02-D |

### Modified Files

| File | Sub-Slice |
|------|-----------|
| `frontend/src/router/index.ts` | VS-02-A / B / D |
| `frontend/src/layouts/DashboardLayout.vue` | VS-02-D |

---

## Final Status: IN PROGRESS
