# Phase 1 API Contracts Document

## 1. Document Overview

This document defines Phase 1 API contracts for the Modern SaaS HRMS platform. It is designed for Vue.js web frontend, React Native or Flutter mobile app, kiosk app, Frappe/ERPNext backend developers, QA engineers, and integration teams.

The contracts are based on the BRD, Phase-wise Development Plan, Phase 1 BPMN Flow Document, Phase 1 SRS, Technical Requirement Document, Phase 1 ERD / Frappe DocType Design, and Auth/Role/Permission document.

| Item                   | Value                                                          |
| ------------------------| ----------------------------------------------------------------|
| Backend                | Frappe Framework / ERPNext HRMS                                |
| Database               | MariaDB through Frappe DocTypes                                |
| Web frontend           | Vue.js + Tailwind CSS                                          |
| Mobile app             | React Native or Flutter                                        |
| Recommended kiosk app  | React Native Android kiosk app                                 |
| Architecture           | Single Frappe site with logical multi-tenant isolation for MVP |
| Recommended custom app | `hrms_saas`                                                    |
| API version            | `v1`                                                           |
| Accuracy probability   | 87% based on available documents                               |

Accuracy is below 100% because OTP provider, mobile token strategy, kiosk verification method, offline retention, selfie/face storage policy, GPS radius defaults, and production load still need client sign-off.

## 2. API Design Principles

* Every API must enforce backend permissions. Frontend route guards are UX helpers only.
* Every transaction must resolve tenant/company context server-side.
* Mutating APIs that can be retried by mobile or kiosk must support idempotency.
* Standard Frappe resource APIs may be reused only for safe CRUD screens after DocType permissions, permission query conditions, and custom validations are configured.
* Workflow-sensitive APIs must use custom `/api/method/...` endpoints.
* Error responses must use one consistent structure.
* List APIs must support pagination, sorting, and filtering from the beginning.
* Sensitive mutations must create `Audit Log`.
* GPS, selfie/face, and kiosk data must be treated as sensitive data.

## 3. Common API Response Format

All custom APIs should return:

```json
{
  "success": true,
  "data": {},
  "message": "OK",
  "traceId": "req_20260708_000001"
}
```

List APIs should return:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 125,
    "totalPages": 7
  },
  "message": "OK",
  "traceId": "req_20260708_000002"
}
```

Frappe may wrap method responses in `message` by default. The backend should standardize custom method return payloads so API clients consistently receive the fields above inside the Frappe response envelope or through a shared API response helper.

## 4. Common Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed.",
    "details": [
      {
        "field": "company",
        "issue": "Company is required."
      }
    ]
  },
  "traceId": "req_20260708_000003"
}
```

| HTTP Status | Error Code | Meaning |
| --- | --- | --- |
| 400 | `BAD_REQUEST` | Malformed request or missing JSON body. |
| 401 | `AUTH_REQUIRED` | No valid web/mobile/kiosk session. |
| 403 | `PERMISSION_DENIED` | Authenticated but not authorized. |
| 404 | `NOT_FOUND` | Record not found in permitted scope. |
| 409 | `CONFLICT` | Duplicate, idempotency conflict, active binding conflict. |
| 422 | `VALIDATION_ERROR` | Semantically invalid request. |
| 423 | `TENANT_SUSPENDED` | Tenant/company is inactive or suspended. |
| 429 | `RATE_LIMITED` | Too many requests. |
| 500 | `SERVER_ERROR` | Internal server error; do not expose stack traces. |

Recommended domain error codes:

* `INVALID_CREDENTIALS`
* `OTP_EXPIRED`
* `OTP_RETRY_LIMIT_EXCEEDED`
* `DEVICE_NOT_APPROVED`
* `DEVICE_ALREADY_BOUND`
* `KIOSK_INACTIVE`
* `KIOSK_UNBOUND`
* `GPS_VALIDATION_FAILED`
* `SELFIE_REQUIRED`
* `FACE_VERIFICATION_FAILED`
* `DUPLICATE_PUNCH`
* `OFFLINE_SYNC_CONFLICT`
* `POLICY_NOT_FOUND`
* `EMPLOYEE_INACTIVE`

## 5. Common Request Headers

### 5.1 Web Session APIs

```http
Content-Type: application/json
Accept: application/json
X-API-Version: v1
X-Client-Type: web
X-Request-ID: req_client_001
```

Web APIs may use Frappe session cookies after login.

### 5.2 Mobile APIs

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <mobile_access_token>
X-API-Version: v1
X-Client-Type: mobile
X-Device-ID: device_abc123
X-Idempotency-Key: mob_20260708_emp001_00001
X-Request-ID: req_mobile_001
```

### 5.3 Kiosk APIs

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer <kiosk_device_token>
X-API-Version: v1
X-Client-Type: kiosk
X-Kiosk-Device-ID: kiosk_tab_001
X-Idempotency-Key: ksk_20260708_00001
X-Request-ID: req_kiosk_001
```

### 5.4 File Upload APIs

```http
Content-Type: multipart/form-data
Accept: application/json
Authorization: Bearer <token>
X-API-Version: v1
X-Client-Type: mobile
X-Request-ID: req_upload_001
```

## 6. Authentication and Session Handling Rules

| Rule ID | Rule |
| --- | --- |
| AUTH-API-001 | Web login may reuse Frappe `/api/method/login` where compatible, but mobile/kiosk contracts should use custom wrappers for consistent payloads and audit. |
| AUTH-API-002 | Mobile login returns short-lived access token and refresh token or a Frappe-session-backed token wrapper. Exact token implementation requires technical sign-off. |
| AUTH-API-003 | Kiosk app authenticates with kiosk device token, not employee user credentials. |
| AUTH-API-004 | Logout revokes the current session/token. Password change, role change, device reset, and tenant suspension revoke affected sessions. |
| AUTH-API-005 | Every authenticated API validates user enabled status, tenant status, role, and record scope. |
| AUTH-API-006 | Sensitive failed auth attempts must create `Login Attempt Log` and optionally `Audit Log`. |
| AUTH-API-007 | Session bootstrap should return allowed roles, menu/action permissions, tenant/company/branch scope, and employee context. |

## 7. Tenant, Company, and Branch Filtering Rules

| Rule ID | Rule |
| --- | --- |
| SCOPE-API-001 | APIs must resolve tenant/company from the authenticated user, mobile session, employee, or kiosk token. |
| SCOPE-API-002 | Client-supplied `tenant`, `company`, `branch`, or `location` values are filters only; they do not grant access. |
| SCOPE-API-003 | Super Admin can access tenant metadata, not employee-sensitive records by default. |
| SCOPE-API-004 | Tenant Admin can access only own tenant data. |
| SCOPE-API-005 | HR Admin can access assigned company/branch/location scope. |
| SCOPE-API-006 | Manager can access team data only. |
| SCOPE-API-007 | Employee and Sales Employee can access own data only. |
| SCOPE-API-008 | Kiosk token can access only the bound kiosk's tenant/company/branch/location. |
| SCOPE-API-009 | List endpoints must apply server-side filters before pagination. |
| SCOPE-API-010 | Permission-denied attempts on sensitive data should be audited. |

## 8. Pagination, Sorting, and Filtering Standards

List request query parameters:

| Parameter | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | integer | `1` | Minimum 1. |
| `pageSize` | integer | `20` | Maximum 100 for normal lists. |
| `sortBy` | string | `modified` | Must be allowlisted per endpoint. |
| `sortOrder` | string | `desc` | `asc` or `desc`. |
| `search` | string | none | Server-side sanitized search. |
| `fromDate` | date | none | ISO date. |
| `toDate` | date | none | ISO date. |
| `company` | string | resolved scope | Optional filter inside permitted scope. |
| `branch` | string | resolved scope | Optional filter inside permitted scope. |
| `location` | string | resolved scope | Optional filter inside permitted scope. |
| `status` | string | none | Endpoint-specific enum. |

## 9. File/Image Upload Rules for Selfie and Face Verification

* Use private Frappe `File` storage by default.
* Accept `jpg`, `jpeg`, `png`, and optionally `webp`.
* Recommended max image size: 5 MB before compression; target mobile upload under 1 MB where possible.
* Strip unnecessary EXIF metadata unless needed for audit and legally approved.
* Never expose raw file URLs without permission checks.
* Store `fileId`/`fileUrl` reference in `Face Verification Log`, not base64 in normal JSON payloads.
* Use multipart upload for online selfie verification.
* Offline kiosk/mobile may store local encrypted files and upload during sync.
* Access to selfie/face data by reviewer must create `Audit Log`.

## 10. Offline Sync API Rules for Mobile and Kiosk

| Rule ID | Rule |
| --- | --- |
| SYNC-001 | Every offline record must include client-generated `idempotencyKey`. |
| SYNC-002 | Replaying the same `idempotencyKey` must return the existing result and must not create duplicate checkins. |
| SYNC-003 | Offline records must include `clientCapturedAt`, `clientTimezone`, and `deviceId` or `kioskDeviceId`. |
| SYNC-004 | Server must validate employee/device/kiosk/policy at sync time. |
| SYNC-005 | Records outside allowed offline window become exceptions. |
| SYNC-006 | Conflicts create `Attendance Exception` with `OFFLINE_SYNC_CONFLICT`. |
| SYNC-007 | Batch sync should return per-record results. |
| SYNC-008 | Kiosk offline sync must preserve sequential punch order within submitted batch. |

## 11. Rate Limiting and Security Rules

| Area | Recommendation |
| --- | --- |
| Login | Rate limit by identifier, IP, and device. Lock or throttle after repeated failures. |
| OTP request | Rate limit by identifier and purpose. Enforce resend limits. |
| OTP verify | Enforce retry count and expiry. |
| Punch APIs | Rate limit per employee/device but allow normal repeated in/out usage. |
| Kiosk punch | Rate limit per kiosk while allowing sequential multi-employee attendance. |
| File upload | Rate limit and validate content type/size. |
| Dashboard | Cache or optimize; rate limit abusive polling. |
| Audit | Never allow client-supplied audit actor or timestamp to override server values. |
| Secrets | Store token hashes, OTP hashes, and admin PIN hashes only. |
| Transport | HTTPS required in production for all web/mobile/kiosk APIs. |

## 12. API Versioning Recommendation

Use custom method namespace versioning:

```text
/api/method/hrms_saas.api.v1.<module>.<method>
```

Examples:

```text
/api/method/hrms_saas.api.v1.auth.login
/api/method/hrms_saas.api.v1.attendance.punch
/api/method/hrms_saas.api.v1.kiosk.sync_offline
```

Do not create `v2` until a breaking change is unavoidable. Prefer additive optional fields and new endpoints for new behavior.

## 13. Phase 1 API List Summary

| No. | API | Endpoint | Method | Type | Primary Consumers |
| --- | --- | --- | --- | --- | --- |
| 1 | Login | `/api/method/hrms_saas.api.v1.auth.login` | POST | Custom | Web, mobile |
| 2 | Logout | `/api/method/hrms_saas.api.v1.auth.logout` | POST | Custom wrapper | Web, mobile |
| 3 | Request OTP | `/api/method/hrms_saas.api.v1.auth.request_otp` | POST | Custom | Web, mobile |
| 4 | Verify OTP | `/api/method/hrms_saas.api.v1.auth.verify_otp` | POST | Custom | Web, mobile |
| 5 | Refresh Session | `/api/method/hrms_saas.api.v1.auth.refresh_session` | POST | Custom | Mobile |
| 6 | Permission Bootstrap | `/api/method/hrms_saas.api.v1.auth.get_permissions` | GET | Custom | Web, mobile |
| 7 | Create Tenant | `/api/method/hrms_saas.api.v1.tenant.create` | POST | Custom | Web |
| 8 | Update Tenant Status | `/api/method/hrms_saas.api.v1.tenant.update_status` | POST | Custom | Web |
| 9 | Tenant Setup Status | `/api/method/hrms_saas.api.v1.tenant.get_setup_status` | GET | Custom | Web |
| 10 | Company Create/Update | `/api/resource/Company` or `/api/method/hrms_saas.api.v1.company.upsert` | POST/PATCH | Standard/custom | Web |
| 11 | Branch List/Create | `/api/method/hrms_saas.api.v1.branch.list_or_create` | GET/POST | Custom preferred | Web |
| 12 | Location List/Create | `/api/method/hrms_saas.api.v1.location.list_or_create` | GET/POST | Custom preferred | Web |
| 13 | Employee Create/Update | `/api/method/hrms_saas.api.v1.employee.upsert` | POST/PATCH | Custom | Web |
| 14 | Employee Search/List | `/api/method/hrms_saas.api.v1.employee.list` | GET | Custom | Web |
| 15 | Attendance Policy Upsert | `/api/method/hrms_saas.api.v1.attendance_policy.upsert` | POST/PATCH | Custom | Web |
| 16 | Active Attendance Policy | `/api/method/hrms_saas.api.v1.attendance_policy.resolve` | GET | Custom | Web, mobile, kiosk |
| 17 | Web/Mobile Punch | `/api/method/hrms_saas.api.v1.attendance.punch` | POST | Custom | Web, mobile |
| 18 | Attendance Status | `/api/method/hrms_saas.api.v1.attendance.get_status` | GET | Custom | Web, mobile |
| 19 | GPS Validate | `/api/method/hrms_saas.api.v1.validation.validate_gps` | POST | Custom | Web, mobile, kiosk |
| 20 | Selfie Upload | `/api/method/hrms_saas.api.v1.validation.upload_selfie` | POST | Custom | Mobile, kiosk |
| 21 | Face/Selfie Verify | `/api/method/hrms_saas.api.v1.validation.verify_face` | POST | Custom | Mobile, kiosk |
| 22 | Register Kiosk | `/api/method/hrms_saas.api.v1.kiosk.register` | POST | Custom | Web |
| 23 | Bind Kiosk | `/api/method/hrms_saas.api.v1.kiosk.bind` | POST | Custom | Web |
| 24 | Activate/Deactivate Kiosk | `/api/method/hrms_saas.api.v1.kiosk.update_status` | POST | Custom | Web |
| 25 | Kiosk Status | `/api/method/hrms_saas.api.v1.kiosk.get_status` | GET | Custom | Web, kiosk |
| 26 | Kiosk Punch | `/api/method/hrms_saas.api.v1.kiosk.punch` | POST | Custom | Kiosk |
| 27 | Kiosk Offline Sync | `/api/method/hrms_saas.api.v1.kiosk.sync_offline` | POST | Custom | Kiosk |
| 28 | Exception List | `/api/method/hrms_saas.api.v1.exception.list` | GET | Custom | Web |
| 29 | Exception Review | `/api/method/hrms_saas.api.v1.exception.review` | POST | Custom | Web |
| 30 | Dashboard Summary | `/api/method/hrms_saas.api.v1.dashboard.summary` | GET | Custom | Web |

## 14. Detailed API Contracts

### API 1: Login

| Field | Contract |
| --- | --- |
| API name | Login |
| Purpose | Authenticate active web/mobile user and create session/token. |
| Actor/role allowed | All active users with valid role. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.auth.login`; may wrap standard `/api/method/login`. |
| HTTP method | POST |
| Authentication required | No |
| Permission rule | User must be enabled, tenant/company active, and at least one valid role assigned. |
| Request headers | `Content-Type`, `X-API-Version`, `X-Client-Type`, `X-Device-ID` for mobile. |
| Request body JSON | `identifier`, `password`, `loginChannel`, optional `deviceInfo`, `otpRequired` |
| Response body JSON | Session, user, employee context, tenant/company scope, roles, token metadata. |
| Related DocTypes | User, Role, User Permission, Employee, Tenant, Login Attempt Log, User Session, Audit Log |
| Audit/logging requirement | Log success/failure in `Login Attempt Log`; audit lockout/suspicious attempts. |

Request:

```json
{
  "identifier": "employee@example.com",
  "password": "Secret123!",
  "loginChannel": "MOBILE",
  "deviceInfo": {
    "deviceId": "android_123",
    "platform": "ANDROID",
    "appVersion": "1.0.0"
  }
}
```

Success:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "ref_...",
    "expiresIn": 3600,
    "user": {
      "id": "employee@example.com",
      "fullName": "Amit Sharma",
      "roles": ["Employee"]
    },
    "scope": {
      "tenant": "TENANT-SHREE",
      "company": "Shree Services Pvt Ltd",
      "branches": ["Mumbai Branch"]
    },
    "employee": {
      "id": "EMP-0001",
      "employeeName": "Amit Sharma",
      "isSalesEmployee": false
    }
  },
  "message": "Login successful.",
  "traceId": "req_login_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password."
  },
  "traceId": "req_login_002"
}
```

```json
{
  "success": false,
  "error": {
    "code": "TENANT_SUSPENDED",
    "message": "Tenant is inactive or suspended."
  },
  "traceId": "req_login_003"
}
```

Validation rules:

* `identifier`, `password`, and `loginChannel` are required.
* `loginChannel` must be `WEB` or `MOBILE`.
* Disabled users, inactive employees, and suspended tenants are rejected.
* Mobile login may require approved device or OTP based on policy.

Edge cases:

* Role removed while old session exists.
* Tenant suspended after token issued.
* Existing mobile session on old device after device reset.

Test cases:

* Valid web login succeeds.
* Invalid password is rejected and logged.
* Suspended tenant login fails.
* Disabled user login fails.
* Mobile login returns token and employee scope.

### API 2: Logout

| Field | Contract |
| --- | --- |
| API name | Logout |
| Purpose | Revoke current web/mobile session. |
| Actor/role allowed | Authenticated users. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.auth.logout`; may wrap standard `/api/method/logout`. |
| HTTP method | POST |
| Authentication required | Web session or mobile bearer token |
| Permission rule | User can logout own session only. Admin session termination should use a separate later API. |
| Request headers | Standard authenticated headers. |
| Request body JSON | Optional `refreshToken`, `logoutAllDevices` default false. |
| Response body JSON | Logout status. |
| Related DocTypes | User Session, Audit Log |
| Audit/logging requirement | Audit logout all devices or forced revocation. |

Request:

```json
{
  "refreshToken": "ref_...",
  "logoutAllDevices": false
}
```

Success:

```json
{
  "success": true,
  "data": {
    "revoked": true
  },
  "message": "Logged out successfully.",
  "traceId": "req_logout_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Authentication is required."
  },
  "traceId": "req_logout_002"
}
```

Validation rules:

* Current token/session must be active.
* `logoutAllDevices` may require fresh authentication for sensitive roles.

Edge cases:

* Token already revoked should return success with `revoked: true`.
* Expired session should not create server error.

Test cases:

* Current token revoked.
* Revoked token cannot call protected API.
* Logout with expired token returns predictable auth error or idempotent success per implementation decision.

### API 3: Request OTP

| Field | Contract |
| --- | --- |
| API name | Request OTP |
| Purpose | Generate OTP for login, password reset, or device registration. |
| Actor/role allowed | Public eligible users or authenticated users depending on purpose. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.auth.request_otp` |
| HTTP method | POST |
| Authentication required | No for login/password reset; yes for device binding if policy requires. |
| Permission rule | Identifier must map to eligible active user for sensitive purposes. |
| Request headers | Public headers plus rate-limit metadata. |
| Request body JSON | `identifier`, `purpose`, `channel` |
| Response body JSON | Masked destination, expiry seconds, resend status. |
| Related DocTypes | OTP Log, User, Login Attempt Log, Audit Log |
| Audit/logging requirement | Log request; audit suspicious rate limit or password reset. |

Request:

```json
{
  "identifier": "9876543210",
  "purpose": "LOGIN",
  "channel": "SMS"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "otpRequestId": "OTP-00045",
    "maskedDestination": "******3210",
    "expiresIn": 300,
    "resendAfter": 60
  },
  "message": "OTP sent.",
  "traceId": "req_otp_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many OTP requests. Try again later."
  },
  "traceId": "req_otp_002"
}
```

Validation rules:

* `purpose` must be `LOGIN`, `PASSWORD_RESET`, or `DEVICE_REGISTRATION`.
* OTP must be stored hashed, not plain text.
* Apply resend and daily request limits.

Edge cases:

* Unknown identifier should not reveal whether account exists if security policy requires generic response.
* SMS provider failure should return provider-neutral error.

Test cases:

* OTP generated and expiry stored.
* Rate limit enforced.
* Unsupported purpose rejected.

### API 4: Verify OTP

| Field | Contract |
| --- | --- |
| API name | Verify OTP |
| Purpose | Verify OTP and complete login/password/device step. |
| Actor/role allowed | Eligible user. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.auth.verify_otp` |
| HTTP method | POST |
| Authentication required | Depends on purpose. |
| Permission rule | OTP must belong to identifier, purpose, and active tenant/user context. |
| Request headers | Standard public/auth headers. |
| Request body JSON | `otpRequestId`, `identifier`, `otp`, `purpose` |
| Response body JSON | Verification status and optional token/session. |
| Related DocTypes | OTP Log, User Session, Login Attempt Log, Audit Log |
| Audit/logging requirement | Audit password reset and device registration verification. |

Request:

```json
{
  "otpRequestId": "OTP-00045",
  "identifier": "9876543210",
  "otp": "123456",
  "purpose": "LOGIN"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "verified": true,
    "accessToken": "eyJ...",
    "expiresIn": 3600
  },
  "message": "OTP verified.",
  "traceId": "req_verify_otp_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "OTP_EXPIRED",
    "message": "OTP has expired."
  },
  "traceId": "req_verify_otp_002"
}
```

Validation rules:

* OTP must match hash.
* OTP must be unexpired and unused.
* Retry limit must be enforced.

Edge cases:

* Verifying same OTP twice.
* OTP belongs to different purpose.
* Tenant suspended between request and verify.

Test cases:

* Valid OTP succeeds.
* Expired OTP fails.
* Wrong OTP increments retry count.
* Used OTP cannot be reused.

### API 5: Refresh Session

| Field | Contract |
| --- | --- |
| API name | Refresh Session |
| Purpose | Refresh mobile access token without password login. |
| Actor/role allowed | Mobile users with valid refresh token. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.auth.refresh_session` |
| HTTP method | POST |
| Authentication required | Refresh token |
| Permission rule | Refresh token must be active, unexpired, not revoked, and tied to same user/device. |
| Request headers | `X-Client-Type: mobile`, `X-Device-ID`. |
| Request body JSON | `refreshToken` |
| Response body JSON | New access token, expiry, scope. |
| Related DocTypes | User Session, Employee Device, User, Tenant |
| Audit/logging requirement | Audit suspicious refresh/device mismatch. |

Request:

```json
{
  "refreshToken": "ref_..."
}
```

Success:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ_new...",
    "expiresIn": 3600
  },
  "message": "Session refreshed.",
  "traceId": "req_refresh_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "Refresh token is invalid or expired."
  },
  "traceId": "req_refresh_002"
}
```

Validation rules:

* Reject if user disabled, tenant suspended, role changed requiring forced login, or device reset.

Edge cases:

* Refresh token used from different device.
* Role updated after token issue.

Test cases:

* Valid refresh token returns new access token.
* Revoked refresh token fails.
* Device reset invalidates refresh.

### API 6: Permission Bootstrap

| Field | Contract |
| --- | --- |
| API name | Permission Bootstrap |
| Purpose | Return role, route, action, and data-scope permissions for app shell. |
| Actor/role allowed | Authenticated web/mobile users. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.auth.get_permissions` |
| HTTP method | GET |
| Authentication required | Yes |
| Permission rule | Return only current user's allowed permissions and scope. |
| Request headers | Standard authenticated headers. |
| Request body JSON | None. Query optional `clientType=web/mobile`. |
| Response body JSON | Roles, menus, actions, data scope, employee context. |
| Related DocTypes | User, Role, User Permission, Employee, Tenant, Company |
| Audit/logging requirement | Log permission denied attempts elsewhere; bootstrap normally not audited except sensitive support access. |

Success:

```json
{
  "success": true,
  "data": {
    "roles": ["HR Admin"],
    "scope": {
      "tenant": "TENANT-SHREE",
      "companies": ["Shree Services Pvt Ltd"],
      "branches": ["Mumbai Branch"],
      "locations": ["Mumbai Office"]
    },
    "modules": {
      "employee": { "canRead": true, "canCreate": true, "canUpdate": true },
      "kiosk": { "canRead": true, "canConfigure": true },
      "attendanceException": { "canReview": true }
    },
    "navigation": ["dashboard", "employees", "attendance", "kiosk", "exceptions"]
  },
  "message": "Permissions loaded.",
  "traceId": "req_perm_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "No valid role is assigned."
  },
  "traceId": "req_perm_002"
}
```

Validation rules:

* Session must be current after role changes.
* Tenant status must be active.

Edge cases:

* Multiple roles with different scopes.
* Manager also employee.
* Branch-scoped HR Admin.

Test cases:

* HR Admin gets employee/kiosk menus.
* Employee gets own profile and punch only.
* Removed role forces refresh/logout.

### API 7: Create Tenant

| Field | Contract |
| --- | --- |
| API name | Create Tenant |
| Purpose | Create SaaS tenant and initial admin context. |
| Actor/role allowed | Super Admin. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.tenant.create` |
| HTTP method | POST |
| Authentication required | Yes |
| Permission rule | Super Admin only; Support User only if explicitly authorized. |
| Request headers | Authenticated web headers. |
| Request body JSON | Tenant details, primary company, tenant admin user. |
| Response body JSON | Tenant ID, company ID, setup status. |
| Related DocTypes | Tenant, Company, User, Role, User Permission, Audit Log |
| Audit/logging requirement | Audit tenant create and initial admin creation. |

Request:

```json
{
  "tenantCode": "TENANT-SHREE",
  "tenantName": "Shree HR Services",
  "primaryCompany": {
    "companyName": "Shree Services Pvt Ltd",
    "abbr": "SSPL"
  },
  "tenantAdmin": {
    "email": "admin@shree.example",
    "fullName": "Tenant Admin",
    "mobileNo": "9876543210"
  }
}
```

Success:

```json
{
  "success": true,
  "data": {
    "tenant": "TENANT-SHREE",
    "company": "Shree Services Pvt Ltd",
    "setupStatus": "DRAFT"
  },
  "message": "Tenant created.",
  "traceId": "req_tenant_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Tenant code already exists."
  },
  "traceId": "req_tenant_002"
}
```

Validation rules:

* `tenantCode` unique.
* Tenant admin email/mobile valid.
* Company abbreviation unique as required by ERPNext.

Edge cases:

* Company creation succeeds but user creation fails; use transaction rollback.
* Duplicate admin user exists; link or reject by policy.

Test cases:

* Super Admin creates tenant.
* Tenant Admin cannot create tenant.
* Duplicate tenant code fails.

### API 8: Update Tenant Status

| Field | Contract |
| --- | --- |
| API name | Update Tenant Status |
| Purpose | Activate, suspend, or reactivate tenant. |
| Actor/role allowed | Super Admin. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.tenant.update_status` |
| HTTP method | POST |
| Authentication required | Yes |
| Permission rule | Super Admin only. |
| Request headers | Authenticated web headers. |
| Request body JSON | `tenant`, `status`, `reason` |
| Response body JSON | Updated status and session invalidation result. |
| Related DocTypes | Tenant, User Session, Audit Log |
| Audit/logging requirement | Mandatory audit; suspension revokes tenant sessions. |

Request:

```json
{
  "tenant": "TENANT-SHREE",
  "status": "SUSPENDED",
  "reason": "Subscription expired"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "tenant": "TENANT-SHREE",
    "status": "SUSPENDED",
    "revokedSessions": 42
  },
  "message": "Tenant status updated.",
  "traceId": "req_tenant_status_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Reason is required for suspension."
  },
  "traceId": "req_tenant_status_002"
}
```

Validation rules:

* Status must be `DRAFT`, `ACTIVE`, `SUSPENDED`, or `INACTIVE`.
* Suspension requires reason.

Edge cases:

* Suspending tenant during offline kiosk sync.
* Reactivation after pending setup incomplete.

Test cases:

* Suspend tenant blocks login.
* Reactivate tenant allows login.
* Sessions revoked on suspension.

### API 9: Tenant Setup Status

| Field | Contract |
| --- | --- |
| API name | Tenant Setup Status |
| Purpose | Return setup checklist for tenant/company foundation. |
| Actor/role allowed | Super Admin, Tenant Admin, HR Admin scoped read. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.tenant.get_setup_status` |
| HTTP method | GET |
| Authentication required | Yes |
| Permission rule | User can view only permitted tenant/company setup status. |
| Request headers | Authenticated headers. |
| Request body JSON | None. Query `tenant`, `company` optional inside scope. |
| Response body JSON | Checklist status. |
| Related DocTypes | Tenant, Company, Branch, Location, Department, Designation, Employee, Kiosk Device |
| Audit/logging requirement | No audit unless access denied. |

Success:

```json
{
  "success": true,
  "data": {
    "tenant": "TENANT-SHREE",
    "company": "Shree Services Pvt Ltd",
    "items": [
      { "key": "company", "label": "Company Profile", "status": "COMPLETE" },
      { "key": "branch", "label": "Branch", "status": "PENDING" },
      { "key": "location", "label": "Location", "status": "PENDING" }
    ],
    "overallStatus": "INCOMPLETE"
  },
  "message": "Setup status loaded.",
  "traceId": "req_setup_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Tenant not found in permitted scope."
  },
  "traceId": "req_setup_002"
}
```

Validation rules:

* Apply scope before status aggregation.

Edge cases:

* Empty tenant just created.
* Multiple companies under tenant.

Test cases:

* Tenant Admin sees own setup.
* Other tenant setup is hidden.
* Checklist changes after branch creation.

### API 10: Company Create/Update

| Field | Contract |
| --- | --- |
| API name | Company Create/Update |
| Purpose | Create or update company profile under tenant. |
| Actor/role allowed | Super Admin, Tenant Admin. |
| Endpoint suggestion | Standard `/api/resource/Company` for basic CRUD or custom `/api/method/hrms_saas.api.v1.company.upsert` for tenant validation. Custom preferred. |
| HTTP method | POST/PATCH |
| Authentication required | Yes |
| Permission rule | Tenant Admin can manage own tenant company only. |
| Request headers | Authenticated web headers. |
| Request body JSON | Company fields and tenant context. |
| Response body JSON | Company record summary. |
| Related DocTypes | Company, Tenant, User Permission, Audit Log |
| Audit/logging requirement | Audit create/status/profile-sensitive updates. |

Request:

```json
{
  "company": "Shree Services Pvt Ltd",
  "tenant": "TENANT-SHREE",
  "companyName": "Shree Services Pvt Ltd",
  "abbr": "SSPL",
  "defaultCurrency": "INR",
  "country": "India"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "company": "Shree Services Pvt Ltd",
    "tenant": "TENANT-SHREE",
    "status": "ACTIVE"
  },
  "message": "Company saved.",
  "traceId": "req_company_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You cannot update this company."
  },
  "traceId": "req_company_002"
}
```

Validation rules:

* Company must belong to tenant.
* Company abbreviation must satisfy ERPNext constraints.

Edge cases:

* Tenant Admin submits another tenant ID.
* Existing ERPNext company with same name.

Test cases:

* Tenant Admin updates own company.
* Cross-tenant update blocked.
* Standard Frappe permissions enforced.

### API 11: Branch List/Create

| Field | Contract |
| --- | --- |
| API name | Branch List/Create |
| Purpose | Manage branch masters for employee assignment and kiosk binding. |
| Actor/role allowed | Tenant Admin, HR Admin; read for scoped roles. |
| Endpoint suggestion | `GET/POST /api/method/hrms_saas.api.v1.branch.list_or_create`; standard `/api/resource/Branch` only after custom validations. |
| HTTP method | GET, POST |
| Authentication required | Yes |
| Permission rule | Scope by tenant/company/branch permissions. |
| Request headers | Authenticated web headers. |
| Request body JSON | POST: branch fields. GET: query filters. |
| Response body JSON | Branch list or created branch. |
| Related DocTypes | Branch, Tenant, Company, Location, Audit Log |
| Audit/logging requirement | Audit create/deactivate/default location change. |

POST request:

```json
{
  "tenant": "TENANT-SHREE",
  "company": "Shree Services Pvt Ltd",
  "branchName": "Mumbai Branch",
  "status": "ACTIVE"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "branch": "Mumbai Branch",
    "company": "Shree Services Pvt Ltd",
    "status": "ACTIVE"
  },
  "message": "Branch saved.",
  "traceId": "req_branch_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Branch already exists for this company."
  },
  "traceId": "req_branch_002"
}
```

Validation rules:

* Branch company must belong to tenant.
* Duplicate active branch names within company should be blocked.

Edge cases:

* Branch has active employees or kiosk binding during deactivation.

Test cases:

* HR Admin creates branch in scope.
* Cross-company branch creation blocked.
* List pagination works.

### API 12: Location List/Create

| Field | Contract |
| --- | --- |
| API name | Location List/Create |
| Purpose | Manage work/GPS/kiosk locations. |
| Actor/role allowed | Tenant Admin, HR Admin; scoped read for managers/kiosk admins. |
| Endpoint suggestion | `GET/POST /api/method/hrms_saas.api.v1.location.list_or_create` |
| HTTP method | GET, POST |
| Authentication required | Yes |
| Permission rule | Scope by tenant/company/branch/location. |
| Request headers | Authenticated web headers. |
| Request body JSON | Location name, branch, lat/long, radius. |
| Response body JSON | Location list or created location. |
| Related DocTypes | Location, Branch, Company, Tenant, Audit Log |
| Audit/logging requirement | Audit coordinate and radius changes. |

Request:

```json
{
  "tenant": "TENANT-SHREE",
  "company": "Shree Services Pvt Ltd",
  "branch": "Mumbai Branch",
  "locationName": "Mumbai Office",
  "latitude": 19.076,
  "longitude": 72.8777,
  "allowedRadiusMeters": 100,
  "status": "ACTIVE"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "location": "Mumbai Office",
    "branch": "Mumbai Branch",
    "allowedRadiusMeters": 100
  },
  "message": "Location saved.",
  "traceId": "req_location_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Latitude must be between -90 and 90."
  },
  "traceId": "req_location_002"
}
```

Validation rules:

* Latitude and longitude range checks.
* Radius positive when GPS validation enabled.
* Branch/company/tenant consistency.

Edge cases:

* Location used by active kiosk.
* GPS radius changed after attendance disputes.

Test cases:

* Valid location created.
* Invalid coordinates rejected.
* Branch-scoped list filters correctly.

### API 13: Employee Create/Update

| Field | Contract |
| --- | --- |
| API name | Employee Create/Update |
| Purpose | Create or update employee master and optional user link. |
| Actor/role allowed | HR Admin, Tenant Admin within scope. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.employee.upsert`; standard `/api/resource/Employee` not recommended for full workflow. |
| HTTP method | POST/PATCH |
| Authentication required | Yes |
| Permission rule | Must have employee create/update permission in tenant/company/branch scope. |
| Request headers | Authenticated web headers. |
| Request body JSON | Employee master fields, organization mapping, login creation flag. |
| Response body JSON | Employee summary, user link status. |
| Related DocTypes | Employee, User, Role, User Permission, Company, Branch, Location, Department, Designation, Audit Log |
| Audit/logging requirement | Audit create and sensitive updates. |

Request:

```json
{
  "employee": "EMP-0001",
  "employeeName": "Amit Sharma",
  "tenant": "TENANT-SHREE",
  "company": "Shree Services Pvt Ltd",
  "branch": "Mumbai Branch",
  "location": "Mumbai Office",
  "department": "Sales",
  "designation": "Sales Executive",
  "reportingManager": "EMP-0009",
  "status": "ACTIVE",
  "isSalesEmployee": true,
  "createUser": true,
  "user": {
    "email": "amit@example.com",
    "mobileNo": "9876543210"
  }
}
```

Success:

```json
{
  "success": true,
  "data": {
    "employee": "EMP-0001",
    "employeeName": "Amit Sharma",
    "user": "amit@example.com",
    "rolesAssigned": ["Employee", "Sales Employee"]
  },
  "message": "Employee saved.",
  "traceId": "req_employee_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Employee code already exists in this company."
  },
  "traceId": "req_employee_002"
}
```

Validation rules:

* Employee code unique within tenant/company.
* Active employee requires company, branch, location, department, designation.
* Reporting manager must be in same tenant/company unless explicitly allowed.

Edge cases:

* Existing user email should link or reject by policy.
* Sales designation changed after role assignment.

Test cases:

* HR Admin creates employee.
* Duplicate employee blocked.
* Employee user and roles assigned.
* Manager outside scope rejected.

### API 14: Employee Search/List

| Field | Contract |
| --- | --- |
| API name | Employee Search/List |
| Purpose | Return paginated employee list for master screens and lookup controls. |
| Actor/role allowed | Tenant Admin, HR Admin, Payroll Admin read, Manager team read, Employee own read. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.employee.list` |
| HTTP method | GET |
| Authentication required | Yes |
| Permission rule | Apply role and data scope before search. |
| Request headers | Authenticated headers. |
| Request body JSON | None. Query params for pagination/filtering. |
| Response body JSON | Paginated employee summaries. |
| Related DocTypes | Employee, User Permission |
| Audit/logging requirement | Audit denied sensitive access only. |

Success:

```json
{
  "success": true,
  "data": [
    {
      "employee": "EMP-0001",
      "employeeName": "Amit Sharma",
      "company": "Shree Services Pvt Ltd",
      "branch": "Mumbai Branch",
      "department": "Sales",
      "status": "ACTIVE"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  },
  "message": "Employees loaded.",
  "traceId": "req_employee_list_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have access to employee list."
  },
  "traceId": "req_employee_list_002"
}
```

Validation rules:

* Sort fields allowlisted.
* Employee role only returns own record unless self-profile endpoint is split later.

Edge cases:

* Manager with no direct reports.
* HR Admin branch scope.

Test cases:

* HR sees assigned company employees.
* Manager sees team only.
* Employee cannot search all employees.

### API 15: Attendance Policy Upsert

| Field | Contract |
| --- | --- |
| API name | Attendance Policy Upsert |
| Purpose | Create/update attendance channel and validation policy. |
| Actor/role allowed | Tenant Admin, HR Admin. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.attendance_policy.upsert` |
| HTTP method | POST/PATCH |
| Authentication required | Yes |
| Permission rule | User must configure attendance policy in assigned tenant/company/branch scope. |
| Request headers | Authenticated web headers. |
| Request body JSON | Policy fields and scope. |
| Response body JSON | Policy summary. |
| Related DocTypes | Attendance Policy, Company, Branch, Location, Department, Audit Log |
| Audit/logging requirement | Audit create, activate, deactivate, rule changes. |

Request:

```json
{
  "policyName": "Default Attendance Policy",
  "tenant": "TENANT-SHREE",
  "company": "Shree Services Pvt Ltd",
  "scopeType": "COMPANY",
  "allowWeb": true,
  "allowMobile": true,
  "allowKiosk": true,
  "gpsRequired": true,
  "selfieRequired": true,
  "faceRequired": false,
  "duplicateWindowMinutes": 5,
  "allowExceptionOnFailure": true,
  "allowMobileOffline": false,
  "allowKioskOffline": true,
  "offlineMaxHours": 24,
  "status": "ACTIVE",
  "effectiveFrom": "2026-07-08"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "policy": "Default Attendance Policy",
    "status": "ACTIVE"
  },
  "message": "Attendance policy saved.",
  "traceId": "req_policy_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "At least one attendance channel must be enabled."
  },
  "traceId": "req_policy_002"
}
```

Validation rules:

* At least one of web/mobile/kiosk enabled.
* Offline max hours required if offline enabled.
* Only one active policy per exact scope/effective date.

Edge cases:

* Deactivating policy while employees are assigned.
* Conflicting branch and company policies.

Test cases:

* Active policy created.
* Incomplete policy rejected.
* Policy change audited.

### API 16: Active Attendance Policy

| Field | Contract |
| --- | --- |
| API name | Active Attendance Policy |
| Purpose | Resolve effective attendance policy for employee/source/device. |
| Actor/role allowed | Employee own, HR Admin, mobile app, kiosk device. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.attendance_policy.resolve` |
| HTTP method | GET |
| Authentication required | User session or kiosk token |
| Permission rule | Employee can resolve own policy; kiosk can resolve policy for bound location only. |
| Request headers | Authenticated web/mobile/kiosk headers. |
| Request body JSON | None. Query `employee`, `source`, `kioskDeviceId` as applicable. |
| Response body JSON | Effective policy flags. |
| Related DocTypes | Attendance Policy, Employee, Employee Device, Kiosk Device Binding, Kiosk Policy |
| Audit/logging requirement | No audit normally. Audit denied kiosk/device misuse. |

Success:

```json
{
  "success": true,
  "data": {
    "policy": "Default Attendance Policy",
    "source": "MOBILE",
    "gpsRequired": true,
    "selfieRequired": true,
    "faceRequired": false,
    "duplicateWindowMinutes": 5,
    "offlineAllowed": false
  },
  "message": "Policy resolved.",
  "traceId": "req_policy_resolve_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "POLICY_NOT_FOUND",
    "message": "No active attendance policy found."
  },
  "traceId": "req_policy_resolve_002"
}
```

Validation rules:

* Resolve most-specific policy first: employee/category, department, location/branch, company.
* Source must be enabled.

Edge cases:

* Multiple active policies match.
* Kiosk has separate kiosk policy override.

Test cases:

* Mobile employee resolves mobile policy.
* Kiosk resolves bound location policy.
* Disabled source rejected.

### API 17: Web/Mobile Punch

| Field | Contract |
| --- | --- |
| API name | Web/Mobile Punch |
| Purpose | Capture employee punch in/out from web or mobile. |
| Actor/role allowed | Employee, Sales Employee; HR Admin only for controlled test/admin action if allowed. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.attendance.punch` |
| HTTP method | POST |
| Authentication required | Web session or mobile bearer token |
| Permission rule | Employee can mark own attendance from allowed channel and approved device if required. |
| Request headers | Authenticated web/mobile headers; `X-Idempotency-Key` recommended for mobile. |
| Request body JSON | Employee/source/punch/GPS/selfie references/device metadata. |
| Response body JSON | Punch result, checkin, validation logs, exception if any. |
| Related DocTypes | Employee, Employee Device, Attendance Policy, Employee Checkin, GPS Validation Log, Face Verification Log, Attendance Exception, Audit Log |
| Audit/logging requirement | Audit accepted punch and exception creation. |

Request:

```json
{
  "employee": "EMP-0001",
  "source": "MOBILE",
  "punchType": "IN",
  "punchTime": "2026-07-08T09:30:00+05:30",
  "deviceId": "android_123",
  "idempotencyKey": "mob_EMP-0001_20260708_093000",
  "gps": {
    "latitude": 19.076,
    "longitude": 72.8777,
    "accuracyMeters": 25,
    "capturedAt": "2026-07-08T09:29:55+05:30"
  },
  "selfieFile": "FILE-0001"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "result": "ACCEPTED",
    "employeeCheckin": "EMP-CHK-0001",
    "punchType": "IN",
    "punchTime": "2026-07-08T09:30:00+05:30",
    "validation": {
      "gps": "PASSED",
      "face": "PASSED"
    },
    "currentStatus": "PUNCHED_IN"
  },
  "message": "Punch recorded.",
  "traceId": "req_punch_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "DEVICE_NOT_APPROVED",
    "message": "This mobile device is not approved for attendance."
  },
  "traceId": "req_punch_002"
}
```

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_PUNCH",
    "message": "Duplicate punch detected within configured window."
  },
  "traceId": "req_punch_003"
}
```

Validation rules:

* Employee must be active and match authenticated user unless admin override allowed.
* Source must be `WEB` or `MOBILE`.
* Policy must allow source.
* Device must be approved when source is mobile and device binding is enabled.
* Required GPS/selfie must pass or create exception based on policy.
* Duplicate punch must be blocked or flagged.

Edge cases:

* Mobile retry with same idempotency key.
* GPS permission denied.
* Face verification service unavailable.
* Punch out without punch in.

Test cases:

* Web punch accepted when web allowed.
* Mobile punch blocked for unauthorized device.
* Duplicate punch handled.
* GPS failure creates exception when policy allows.

### API 18: Attendance Status

| Field | Contract |
| --- | --- |
| API name | Attendance Status |
| Purpose | Return current attendance state for employee/date. |
| Actor/role allowed | Employee own, Manager team, HR Admin. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.attendance.get_status` |
| HTTP method | GET |
| Authentication required | Yes |
| Permission rule | Own/team/assigned scope only. |
| Request headers | Authenticated headers. |
| Request body JSON | None. Query `employee`, `date`. |
| Response body JSON | Last punch, current state, exceptions. |
| Related DocTypes | Employee Checkin, Attendance, Attendance Exception |
| Audit/logging requirement | No audit normally. |

Success:

```json
{
  "success": true,
  "data": {
    "employee": "EMP-0001",
    "date": "2026-07-08",
    "currentStatus": "PUNCHED_IN",
    "lastPunch": {
      "type": "IN",
      "time": "2026-07-08T09:30:00+05:30",
      "source": "MOBILE"
    },
    "openExceptions": 0
  },
  "message": "Attendance status loaded.",
  "traceId": "req_status_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You cannot view this employee attendance status."
  },
  "traceId": "req_status_002"
}
```

Validation rules:

* Default employee is current employee for Employee role.
* Date defaults to server current date in tenant timezone.

Edge cases:

* Multiple checkins due to offline sync.
* Pending exception affecting status.

Test cases:

* Employee own status loads.
* Manager team status loads.
* Cross-team status blocked.

### API 19: GPS Validate

| Field | Contract |
| --- | --- |
| API name | GPS Validate |
| Purpose | Validate coordinates against allowed location/radius and store log when needed. |
| Actor/role allowed | Employee/Sales Employee own; kiosk token for bound kiosk; HR Admin for diagnostics if allowed. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.validation.validate_gps` |
| HTTP method | POST |
| Authentication required | User session or kiosk token |
| Permission rule | GPS validation only for own employee or bound kiosk scope. |
| Request headers | Authenticated web/mobile/kiosk headers. |
| Request body JSON | Employee, source, coordinates, accuracy, optional location. |
| Response body JSON | Validation result, distance, log ID. |
| Related DocTypes | GPS Validation Log, Location, Employee, Kiosk Device, Attendance Policy |
| Audit/logging requirement | Store GPS Validation Log; audit only sensitive review/access. |

Request:

```json
{
  "employee": "EMP-0001",
  "source": "MOBILE",
  "latitude": 19.076,
  "longitude": 72.8777,
  "accuracyMeters": 25,
  "capturedAt": "2026-07-08T09:29:55+05:30"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "gpsValidationLog": "GPS-LOG-0001",
    "result": "PASSED",
    "distanceMeters": 42,
    "allowedRadiusMeters": 100
  },
  "message": "GPS validation passed.",
  "traceId": "req_gps_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "GPS_VALIDATION_FAILED",
    "message": "Employee is outside the allowed location radius.",
    "details": {
      "distanceMeters": 350,
      "allowedRadiusMeters": 100
    }
  },
  "traceId": "req_gps_002"
}
```

Validation rules:

* Latitude/longitude valid ranges.
* Accuracy positive.
* Compare against resolved work/kiosk location.

Edge cases:

* Poor GPS accuracy.
* No location configured.
* Employee has branch location but kiosk source uses kiosk binding location.

Test cases:

* Inside radius passes.
* Outside radius fails.
* Invalid coordinates rejected.

### API 20: Selfie Upload

| Field | Contract |
| --- | --- |
| API name | Selfie Upload |
| Purpose | Upload selfie/face image to private Frappe File storage. |
| Actor/role allowed | Employee/Sales Employee own; kiosk token for punch capture. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.validation.upload_selfie` |
| HTTP method | POST multipart |
| Authentication required | User session or kiosk token |
| Permission rule | Uploader must be current employee or bound kiosk device. |
| Request headers | Multipart upload headers. |
| Request body JSON | Multipart fields: `employee`, `source`, `captureId`, `file`. |
| Response body JSON | File reference and upload metadata. |
| Related DocTypes | File, Face Verification Log, Employee, Kiosk Device |
| Audit/logging requirement | Store file privately; audit admin/reviewer access, not normal upload unless policy requires. |

Success:

```json
{
  "success": true,
  "data": {
    "file": "FILE-0001",
    "fileName": "selfie_EMP-0001_20260708.jpg",
    "isPrivate": true
  },
  "message": "Selfie uploaded.",
  "traceId": "req_selfie_upload_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Unsupported image type."
  },
  "traceId": "req_selfie_upload_002"
}
```

Validation rules:

* Allowed file types only.
* Max size enforced.
* Store private.
* Employee/scope validation before storing or before linking.

Edge cases:

* Upload succeeds but verification fails.
* Offline file uploaded later with old capture timestamp.

Test cases:

* Valid JPEG uploads.
* Oversized file rejected.
* Employee cannot upload for another employee.

### API 21: Face/Selfie Verify

| Field | Contract |
| --- | --- |
| API name | Face/Selfie Verify |
| Purpose | Create verification log and return verification result. |
| Actor/role allowed | Employee/Sales Employee own; kiosk token. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.validation.verify_face` |
| HTTP method | POST |
| Authentication required | User session or kiosk token |
| Permission rule | Employee/source must match authenticated session or kiosk binding. |
| Request headers | Authenticated headers. |
| Request body JSON | Employee, source, method, file, optional provider response. |
| Response body JSON | Verification result and log ID. |
| Related DocTypes | Face Verification Log, File, Employee, Kiosk Device, Attendance Exception |
| Audit/logging requirement | Create Face Verification Log; audit access to raw image. |

Request:

```json
{
  "employee": "EMP-0001",
  "source": "MOBILE",
  "verificationMethod": "SELFIE",
  "selfieFile": "FILE-0001",
  "capturedAt": "2026-07-08T09:29:58+05:30"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "faceVerificationLog": "FACE-LOG-0001",
    "result": "PASSED",
    "matchScore": null
  },
  "message": "Verification passed.",
  "traceId": "req_face_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "FACE_VERIFICATION_FAILED",
    "message": "Face verification failed."
  },
  "traceId": "req_face_002"
}
```

Validation rules:

* File must be private and linked to permitted employee/source.
* Verification method must be allowed by policy.
* Match score must be between 0 and 100 when provider returns score.

Edge cases:

* Provider unavailable.
* Employee code fallback used at kiosk.
* Selfie-only policy without face recognition.

Test cases:

* Selfie verification log created.
* Failed verification creates expected error.
* Unauthorized image access blocked.

### API 22: Register Kiosk

| Field | Contract |
| --- | --- |
| API name | Register Kiosk |
| Purpose | Register a shared kiosk device. |
| Actor/role allowed | Kiosk Admin, Tenant Admin, HR Admin within scope. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.kiosk.register` |
| HTTP method | POST |
| Authentication required | Web session |
| Permission rule | User must configure kiosk in assigned tenant/company scope. |
| Request headers | Authenticated web headers. |
| Request body JSON | Device name, device ID/fingerprint, platform/app metadata. |
| Response body JSON | Kiosk device ID and status. |
| Related DocTypes | Kiosk Device, Tenant, Audit Log |
| Audit/logging requirement | Audit registration. |

Request:

```json
{
  "tenant": "TENANT-SHREE",
  "deviceName": "Mumbai Gate Tablet",
  "deviceId": "kiosk_tab_001",
  "deviceFingerprintHash": "hash_abc",
  "platform": "ANDROID",
  "appVersion": "1.0.0"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "kioskDevice": "KIOSK-0001",
    "status": "REGISTERED"
  },
  "message": "Kiosk registered.",
  "traceId": "req_kiosk_register_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "An active kiosk with this device ID already exists."
  },
  "traceId": "req_kiosk_register_002"
}
```

Validation rules:

* Active device ID/fingerprint unique.
* Tenant must be active.

Edge cases:

* Replacement kiosk reuses old device name.
* Device registered but not yet bound.

Test cases:

* Kiosk Admin registers device.
* Duplicate active device rejected.
* Employee role cannot register kiosk.

### API 23: Bind Kiosk

| Field | Contract |
| --- | --- |
| API name | Bind Kiosk |
| Purpose | Bind kiosk to tenant, company, branch, and location. |
| Actor/role allowed | Kiosk Admin, Tenant Admin, HR Admin. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.kiosk.bind` |
| HTTP method | POST |
| Authentication required | Web session |
| Permission rule | User must have access to selected branch/location. |
| Request headers | Authenticated web headers. |
| Request body JSON | Kiosk, company, branch, location, effective date. |
| Response body JSON | Binding summary. |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Company, Branch, Location, Audit Log |
| Audit/logging requirement | Audit binding create/change/deactivate. |

Request:

```json
{
  "kioskDevice": "KIOSK-0001",
  "tenant": "TENANT-SHREE",
  "company": "Shree Services Pvt Ltd",
  "branch": "Mumbai Branch",
  "location": "Mumbai Office",
  "effectiveFrom": "2026-07-08T10:00:00+05:30"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "binding": "KIOSK-BIND-0001",
    "status": "ACTIVE"
  },
  "message": "Kiosk bound.",
  "traceId": "req_kiosk_bind_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Branch and location must belong to the selected company."
  },
  "traceId": "req_kiosk_bind_002"
}
```

Validation rules:

* Kiosk, company, branch, location must share tenant.
* Only one active binding per kiosk.
* Branch/location active.

Edge cases:

* Rebinding kiosk with unsynced offline records.
* Branch inactive after binding.

Test cases:

* Valid binding succeeds.
* Cross-company binding blocked.
* Second active binding blocked.

### API 24: Activate/Deactivate Kiosk

| Field | Contract |
| --- | --- |
| API name | Activate/Deactivate Kiosk |
| Purpose | Enable or disable kiosk attendance capture. |
| Actor/role allowed | Kiosk Admin, Tenant Admin, HR Admin. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.kiosk.update_status` |
| HTTP method | POST |
| Authentication required | Web session |
| Permission rule | User must manage kiosk within branch/company scope. |
| Request headers | Authenticated web headers. |
| Request body JSON | Kiosk, status, reason. |
| Response body JSON | Status and token activation result. |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Kiosk Policy, User Session, Audit Log |
| Audit/logging requirement | Mandatory audit; deactivation blocks new kiosk punches. |

Request:

```json
{
  "kioskDevice": "KIOSK-0001",
  "status": "ACTIVE",
  "reason": "Initial activation"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "kioskDevice": "KIOSK-0001",
    "status": "ACTIVE",
    "deviceToken": "ksk_token_return_once"
  },
  "message": "Kiosk activated.",
  "traceId": "req_kiosk_status_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "KIOSK_UNBOUND",
    "message": "Kiosk must be bound before activation."
  },
  "traceId": "req_kiosk_status_002"
}
```

Validation rules:

* Activation requires active binding and active kiosk policy.
* Deactivation requires reason.
* Device token returned only on activation/rotation and stored hashed.

Edge cases:

* Offline records exist during deactivation.
* Token lost; require rotate-token action.

Test cases:

* Activate bound kiosk succeeds.
* Unbound kiosk activation fails.
* Deactivated kiosk punch blocked.

### API 25: Kiosk Status

| Field | Contract |
| --- | --- |
| API name | Kiosk Status |
| Purpose | Return kiosk status, binding, policy, and sync state. |
| Actor/role allowed | Kiosk device token, Kiosk Admin, HR Admin, Tenant Admin. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.kiosk.get_status` |
| HTTP method | GET |
| Authentication required | Web session or kiosk token |
| Permission rule | Kiosk token can view own device only; admins within scope. |
| Request headers | Authenticated web or kiosk headers. |
| Request body JSON | None. Query optional `kioskDevice` for web. |
| Response body JSON | Device status, binding, policy, server time. |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Kiosk Policy, Kiosk Attendance Log |
| Audit/logging requirement | No audit normally; denied access audited. |

Success:

```json
{
  "success": true,
  "data": {
    "kioskDevice": "KIOSK-0001",
    "status": "ACTIVE",
    "serverTime": "2026-07-08T10:15:00+05:30",
    "binding": {
      "company": "Shree Services Pvt Ltd",
      "branch": "Mumbai Branch",
      "location": "Mumbai Office"
    },
    "policy": {
      "verificationMethod": "SELFIE_WITH_CODE",
      "offlineEnabled": true,
      "offlineMaxHours": 24
    },
    "pendingSyncCount": 0
  },
  "message": "Kiosk status loaded.",
  "traceId": "req_kiosk_status_get_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "KIOSK_INACTIVE",
    "message": "Kiosk is inactive."
  },
  "traceId": "req_kiosk_status_get_002"
}
```

Validation rules:

* Token must match kiosk.
* Binding must be active for kiosk app status.

Edge cases:

* Kiosk token valid but device deactivated.
* Policy changed while kiosk app online.

Test cases:

* Kiosk gets own status.
* Admin gets scoped kiosk status.
* Cross-kiosk token blocked.

### API 26: Kiosk Punch

| Field | Contract |
| --- | --- |
| API name | Kiosk Punch |
| Purpose | Capture shared kiosk attendance for multiple employees sequentially. |
| Actor/role allowed | Registered active kiosk device. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.kiosk.punch` |
| HTTP method | POST |
| Authentication required | Kiosk device token |
| Permission rule | Kiosk must be active, bound, and allowed by policy. Employee must be active and eligible. |
| Request headers | Kiosk headers with `X-Kiosk-Device-ID`, `X-Idempotency-Key`. |
| Request body JSON | Employee identifier, punch type/time, verification, optional GPS/selfie references. |
| Response body JSON | Kiosk log, checkin, result, exception if any. |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Kiosk Policy, Kiosk Attendance Log, Employee, Employee Checkin, Face Verification Log, GPS Validation Log, Attendance Exception, Audit Log |
| Audit/logging requirement | Audit accepted punch and exception creation. |

Request:

```json
{
  "employee": "EMP-0001",
  "employeeCode": "EMP-0001",
  "punchType": "IN",
  "punchTime": "2026-07-08T09:35:00+05:30",
  "verification": {
    "method": "SELFIE_WITH_CODE",
    "status": "PASSED",
    "selfieFile": "FILE-0002",
    "faceVerificationLog": "FACE-LOG-0002"
  },
  "idempotencyKey": "ksk_KIOSK-0001_EMP-0001_20260708_093500"
}
```

Success:

```json
{
  "success": true,
  "data": {
    "result": "ACCEPTED",
    "kioskAttendanceLog": "KIOSK-ATT-0001",
    "employeeCheckin": "EMP-CHK-0002",
    "employee": "EMP-0001",
    "nextState": "READY"
  },
  "message": "Kiosk punch recorded.",
  "traceId": "req_kiosk_punch_001"
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "KIOSK_INACTIVE",
    "message": "Kiosk is inactive."
  },
  "traceId": "req_kiosk_punch_002"
}
```

```json
{
  "success": false,
  "error": {
    "code": "FACE_VERIFICATION_FAILED",
    "message": "Employee verification failed."
  },
  "traceId": "req_kiosk_punch_003"
}
```

Validation rules:

* Kiosk token valid.
* Kiosk active and bound.
* Employee active and belongs to permitted tenant/company/branch policy.
* Verification method allowed.
* Idempotency key unique.
* Duplicate punch rule enforced.

Edge cases:

* Employee belongs to different branch.
* Face verification fails but fallback allowed.
* Same employee retries immediately.

Test cases:

* Active kiosk captures multiple employees sequentially.
* Inactive kiosk blocked.
* Duplicate kiosk punch blocked or exception created.
* Failed verification does not create approved attendance.

### API 27: Kiosk Offline Sync

| Field | Contract |
| --- | --- |
| API name | Kiosk Offline Sync |
| Purpose | Sync kiosk attendance records captured offline. |
| Actor/role allowed | Registered kiosk device. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.kiosk.sync_offline` |
| HTTP method | POST |
| Authentication required | Kiosk device token |
| Permission rule | Kiosk must be registered; active status and offline policy decide processing vs exception. |
| Request headers | Kiosk headers. |
| Request body JSON | Batch of offline records with idempotency keys. |
| Response body JSON | Per-record sync result. |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Kiosk Policy, Kiosk Attendance Log, Employee Checkin, Attendance Exception, Audit Log |
| Audit/logging requirement | Audit conflicts and failed sync. |

Request:

```json
{
  "kioskDevice": "KIOSK-0001",
  "batchId": "batch_20260708_001",
  "records": [
    {
      "idempotencyKey": "ksk_off_001",
      "employee": "EMP-0001",
      "punchType": "IN",
      "clientCapturedAt": "2026-07-08T09:30:00+05:30",
      "clientTimezone": "Asia/Calcutta",
      "verificationStatus": "PASSED",
      "selfieFile": "FILE-LOCAL-001"
    }
  ]
}
```

Success:

```json
{
  "success": true,
  "data": {
    "batchId": "batch_20260708_001",
    "results": [
      {
        "idempotencyKey": "ksk_off_001",
        "status": "SYNCED",
        "kioskAttendanceLog": "KIOSK-ATT-0002",
        "employeeCheckin": "EMP-CHK-0003"
      }
    ]
  },
  "message": "Offline batch processed.",
  "traceId": "req_kiosk_sync_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Batch cannot be empty."
  },
  "traceId": "req_kiosk_sync_002"
}
```

Validation rules:

* Batch max size should be configured, recommended 100 records.
* Each record must include idempotency key.
* Records older than offline max window create exceptions.
* Duplicate idempotency key returns previous result.

Edge cases:

* Kiosk deactivated while offline.
* Branch binding changed after records captured.
* Local selfie file not uploaded yet.

Test cases:

* Batch sync creates checkins.
* Replay batch is idempotent.
* Old offline records become exceptions.
* Conflict creates exception.

### API 28: Attendance Exception List

| Field | Contract |
| --- | --- |
| API name | Attendance Exception List |
| Purpose | Return paginated attendance exception queue. |
| Actor/role allowed | HR Admin, Tenant Admin, Reporting Manager team scope, Auditor read, Kiosk Admin kiosk-related read. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.exception.list` |
| HTTP method | GET |
| Authentication required | Yes |
| Permission rule | Apply role, tenant, company, branch, team, and source scope. |
| Request headers | Authenticated web headers. |
| Request body JSON | None. Query filters. |
| Response body JSON | Paginated exceptions. |
| Related DocTypes | Attendance Exception, Employee, Employee Checkin, Kiosk Attendance Log, GPS Validation Log, Face Verification Log |
| Audit/logging requirement | Audit access to sensitive face/GPS detail if included. |

Success:

```json
{
  "success": true,
  "data": [
    {
      "exception": "ATT-EXC-0001",
      "employee": "EMP-0001",
      "employeeName": "Amit Sharma",
      "exceptionType": "GPS Failed",
      "source": "MOBILE",
      "status": "PENDING",
      "createdAt": "2026-07-08T09:32:00+05:30"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalItems": 1,
    "totalPages": 1
  },
  "message": "Exceptions loaded.",
  "traceId": "req_exc_list_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You cannot view attendance exceptions."
  },
  "traceId": "req_exc_list_002"
}
```

Validation rules:

* Date range maximum should be configured for performance.
* Sensitive fields omitted from list; detail endpoint may be added later.

Edge cases:

* Manager can see only team exceptions.
* Kiosk Admin sees only kiosk-related branch exceptions.

Test cases:

* HR sees branch exceptions.
* Manager cross-team exception hidden.
* Filters by status/type/source/date work.

### API 29: Attendance Exception Review

| Field | Contract |
| --- | --- |
| API name | Attendance Exception Review |
| Purpose | Review, approve, reject, or resolve attendance exception. |
| Actor/role allowed | HR Admin, Reporting Manager if configured, Tenant Admin escalation. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.exception.review` |
| HTTP method | POST |
| Authentication required | Yes |
| Permission rule | Reviewer must have review permission over employee/branch/team. |
| Request headers | Authenticated web headers. |
| Request body JSON | Exception, action, remarks, optional attendance adjustment. |
| Response body JSON | Updated exception and affected attendance/checkin. |
| Related DocTypes | Attendance Exception, Employee Checkin, Attendance, Audit Log |
| Audit/logging requirement | Mandatory audit for every status transition. |

Request:

```json
{
  "exception": "ATT-EXC-0001",
  "action": "APPROVE",
  "remarks": "GPS accuracy was poor but employee was at branch gate.",
  "attendanceUpdate": {
    "createCheckin": true,
    "punchType": "IN"
  }
}
```

Success:

```json
{
  "success": true,
  "data": {
    "exception": "ATT-EXC-0001",
    "status": "APPROVED",
    "reviewedBy": "hr@example.com",
    "employeeCheckin": "EMP-CHK-0004"
  },
  "message": "Exception reviewed.",
  "traceId": "req_exc_review_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Remarks are required for approval or rejection."
  },
  "traceId": "req_exc_review_002"
}
```

Validation rules:

* Action must be `REVIEW`, `APPROVE`, `REJECT`, or `RESOLVE`.
* Remarks required for approve/reject.
* Closed exceptions cannot be changed except by escalation role.

Edge cases:

* Two reviewers act concurrently.
* Linked checkin already exists from idempotent retry.
* Approval affects daily Attendance recalculation.

Test cases:

* HR approves exception.
* Manager cannot approve non-team exception.
* Concurrent review conflict handled.
* Audit log created.

### API 30: Admin/HR Dashboard Summary

| Field | Contract |
| --- | --- |
| API name | Admin/HR Dashboard Summary |
| Purpose | Return role-scoped dashboard metrics for Phase 1. |
| Actor/role allowed | Super Admin, Tenant Admin, HR Admin, Manager where configured. |
| Endpoint suggestion | `/api/method/hrms_saas.api.v1.dashboard.summary` |
| HTTP method | GET |
| Authentication required | Yes |
| Permission rule | Dashboard cards and counts filtered by tenant/company/branch/team scope. |
| Request headers | Authenticated web headers. |
| Request body JSON | None. Query optional date/company/branch. |
| Response body JSON | Setup, employee, attendance, kiosk, exception metrics. |
| Related DocTypes | Tenant, Company, Employee, Employee Checkin, Attendance, Kiosk Device, Attendance Exception |
| Audit/logging requirement | No audit normally; audit denied cross-tenant access. |

Success:

```json
{
  "success": true,
  "data": {
    "scope": {
      "tenant": "TENANT-SHREE",
      "company": "Shree Services Pvt Ltd",
      "branch": "Mumbai Branch"
    },
    "setup": {
      "overallStatus": "INCOMPLETE",
      "pendingItems": 2
    },
    "employees": {
      "active": 120,
      "inactive": 5
    },
    "attendance": {
      "date": "2026-07-08",
      "present": 86,
      "pending": 12,
      "exceptions": 4
    },
    "kiosk": {
      "activeDevices": 3,
      "inactiveDevices": 1,
      "pendingSync": 0
    }
  },
  "message": "Dashboard summary loaded.",
  "traceId": "req_dashboard_001"
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You cannot view this dashboard scope."
  },
  "traceId": "req_dashboard_002"
}
```

Validation rules:

* Date defaults to current tenant timezone date.
* Company/branch query filters must be within user scope.
* Counts should use optimized indexed queries.

Edge cases:

* Empty tenant shows setup checklist.
* Branch-scoped HR sees only branch data.
* Kiosk not configured yet.

Test cases:

* HR dashboard metrics load under 3 seconds for agreed load.
* Tenant Admin sees setup status.
* Employee cannot access admin dashboard.
* Branch filter respects permissions.

## 15. Standard Frappe/ERPNext API Reuse Guidance

| Area | Recommendation |
| --- | --- |
| Login/logout | Can wrap standard Frappe APIs, but return consistent custom payloads and create logs. |
| Company | Standard `/api/resource/Company` may be reused after tenant validation and permissions; custom upsert preferred. |
| Department/Designation | Standard resource APIs can be reused for simple CRUD with tenant/company custom fields and permissions. |
| Employee | Use custom API for create/update because user linking, role assignment, tenant validation, and audit are workflow-sensitive. |
| Employee Checkin | Do not expose direct resource create for punch. Use custom punch/kiosk APIs. |
| Attendance | Do not expose direct resource update for Phase 1 UI except controlled admin workflows. |
| File | Use custom selfie upload wrapper to enforce privacy and scope. |
| User Permission | Do not expose directly to normal frontend; use role/permission admin workflows later. |

## 16. Contract Test Checklist

Every Phase 1 API should have tests for:

* Authentication required or public access as specified.
* Role permission allowed and denied paths.
* Tenant/company/branch/location scope filtering.
* Required field validation.
* Domain validation.
* Standard error response shape.
* Audit/log creation for sensitive mutation.
* Idempotency for mobile/kiosk retries where applicable.
* Pagination for list APIs.
* Kiosk token isolation for kiosk APIs.
* Device binding for mobile punch.
* GPS/selfie failure behavior.

## 17. Final API Recommendation

Implement Phase 1 APIs as versioned custom Frappe whitelisted methods under:

```text
hrms_saas.api.v1
```

Use standard `/api/resource/...` only for low-risk master-data CRUD after DocType permissions, tenant fields, permission query conditions, and server-side validation are complete. Attendance punch, kiosk attendance, login/session wrappers, employee setup, exceptions, GPS/selfie validation, and dashboard summary must be custom service APIs.

The next recommended artifact is the Phase 1 Frontend Contract Document, followed by the Mobile + Kiosk App Contract Document. Those should consume this API contract directly and should not invent separate field names or permission behavior.
