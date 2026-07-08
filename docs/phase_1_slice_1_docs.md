# Phase 1, Slice 1 Documentation: Authentication/Login & Role Permission

This document breaks down the execution plan for **VS-01 (Authentication/Login + Role Permission)** into small, sequential execution steps. 

According to the workspace rules defined in `.agents/AGENTS.md`, each step must be executed individually. The files created/modified and test command are documented below. Only proceed to the next step when the current step's tests pass.

---

## Execution Step Breakdown

### Step 1: Backend Database & DocType Schemas
*   **Objective:** Define the custom database tables (DocTypes) and fields required for multi-tenant authentication, OTP flows, and session logging.
*   **Files Created or Modified:**
    *   `[NEW]` `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/tenant/tenant.json`
    *   `[NEW]` `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/otp_log/otp_log.json`
    *   `[NEW]` `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/user_session/user_session.json`
    *   `[NEW]` `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/audit_log/audit_log.json`
    *   `[MODIFY]` `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/user/user.json` (or customize User fixtures)
*   **Tests Written:** 
    *   `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/tenant/test_tenant.py` (verifies Tenant creation, field constraints, status)
    *   `backend/apps/hrms_saas/hrms_saas/shreehrms/doctype/otp_log/test_otp_log.py` (verifies fields, unique tokens)
*   **Verification Command (Run by User):**
    ```bash
    docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests --app hrms_saas --doctype Tenant
    ```

---

### Step 2: Backend Authentication Service Layer
*   **Objective:** Implement the core business logic for validating credentials, managing OTP verification, and handling sessions.
*   **Files Created or Modified:**
    *   `[NEW]` `backend/apps/hrms_saas/hrms_saas/shreehrms/services/auth_service.py`
    *   `[NEW]` `backend/apps/hrms_saas/hrms_saas/shreehrms/services/otp_service.py`
*   **Tests Written:**
    *   `backend/apps/hrms_saas/hrms_saas/shreehrms/tests/test_auth_service.py` (tests credential checks, OTP expiry, token expiration, active session rules)
*   **Verification Command (Run by User):**
    ```bash
    docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests --app hrms_saas --module hrms_saas.shreehrms.tests.test_auth_service
    ```

---

### Step 3: Whitelisted API Endpoints & Role Bootstrapping
*   **Objective:** Expose the REST APIs required by the frontend/mobile apps and construct the permission bootstrapping query.
*   **Files Created or Modified:**
    *   `[NEW]` `backend/apps/hrms_saas/hrms_saas/api/auth.py` (contains `login`, `request_otp`, `verify_otp`, `refresh_session`, `permission_bootstrap`)
    *   `[MODIFY]` `backend/apps/hrms_saas/hrms_saas/hooks.py` (registers whitelisted api methods if required, default is auto-whitelisted if `@frappe.whitelist` is used)
*   **Tests Written:**
    *   `backend/apps/hrms_saas/hrms_saas/tests/test_auth_api.py` (verifies status codes, JSON responses, error formats, validation exceptions)
*   **Verification Command (Run by User):**
    ```bash
    docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests --app hrms_saas --module hrms_saas.tests.test_auth_api
    ```

---

### Step 4: Web Frontend Auth Store & Login UI
*   **Objective:** Implement the Login and OTP entry pages on the web frontend, and integrate with backend APIs.
*   **Files Created or Modified:**
    *   `[NEW]` `frontend/src/stores/auth.ts` (Pinia auth store)
    *   `[NEW]` `frontend/src/views/auth/Login.vue` (Login screen)
    *   `[NEW]` `frontend/src/views/auth/VerifyOTP.vue` (OTP input screen)
    *   `[MODIFY]` `frontend/src/router/index.ts` (router guards and auth routes)
*   **Tests Written:**
    *   `frontend/src/views/auth/__tests__/Login.spec.ts` (verifies validation rules, form rendering, and API submission trigger)
*   **Verification Command (Run by User):**
    ```bash
    npm --prefix frontend run test:unit
    ```

---

### Step 5: Web Route Guards & Role-Aware Dashboard Shell
*   **Objective:** Implement the landing dashboard framework and dynamic navigation menus based on permissions returned from bootstrapping.
*   **Files Created or Modified:**
    *   `[NEW]` `frontend/src/layouts/DashboardLayout.vue` (shell with sidebar/navbar)
    *   `[MODIFY]` `frontend/src/router/index.ts` (add route guards checking token and permissions)
*   **Tests Written:**
    *   `frontend/src/router/__tests__/navigation.spec.ts` (verifies that routes guard redirect unauthorized users, and sidebar renders role-specific links)
*   **Verification Command (Run by User):**
    ```bash
    npm --prefix frontend run test:unit
    ```

---

### Step 6: Mobile Login Screens & Storage
*   **Objective:** Develop the Mobile screen interfaces for logging in and handling session state.
*   **Files Created or Modified:**
    *   `[NEW]` `mobile/src/screens/LoginScreen.tsx`
    *   `[NEW]` `mobile/src/screens/OTPScreen.tsx`
    *   `[NEW]` `mobile/src/services/authService.ts`
*   **Tests Written:**
    *   `mobile/src/screens/__tests__/LoginScreen.spec.tsx` (tests input validation, basic elements)
*   **Verification Command (Run by User):**
    ```bash
    npm --prefix mobile run test
    ```

---

### Step 7: Audit Logging & End-to-End Smoke Test
*   **Objective:** Add logging hooks on sensitive events and verify the complete flow works E2E.
*   **Files Created or Modified:**
    *   `[MODIFY]` `backend/apps/hrms_saas/hrms_saas/shreehrms/services/auth_service.py` (adds hook calls to log attempts)
    *   `[NEW]` `frontend/tests/e2e/auth_flow.spec.ts`
*   **Tests Written:**
    *   Playwright / E2E test verifying: Enter credentials -> Receive OTP -> Verify OTP -> Redirect to Dashboard.
*   **Verification Command (Run by User):**
    ```bash
    npm --prefix frontend run test:e2e
    ```

---

## Final Status: COMPLETED
All 7 Steps for Phase 1, Slice 1 (VS-01) have been fully implemented, verified, and unit/integration tested.
