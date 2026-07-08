# Phase 1 Vertical Slice Specification Document

## 1. Document Overview

This document defines the Phase 1 vertical slice implementation plan for the Modern SaaS HRMS platform. A vertical slice means a complete, reviewable business flow from Frappe DocTypes and database changes through backend services, APIs, web/mobile/kiosk screens, permissions, audit, and tests.

| Item                  | Value                                                                                 |
| -----------------------| ---------------------------------------------------------------------------------------|
| Web frontend          | Vue.js + Tailwind CSS                                                                 |
| Backend               | Frappe Framework / ERPNext HRMS                                                       |
| Database              | MariaDB through Frappe DocTypes                                                       |
| Mobile app            | React Native or Flutter                                                               |
| Recommended kiosk app | React Native Android kiosk mode                                                       |
| Architecture          | Multi-tenant SaaS HRMS                                                                |
| Source contracts      | ERD, API Contracts, Frontend + Mobile Screen Contracts, Auth Document, TRD, SRS, BPMN |
| Accuracy probability  | 88% based on available documents                                                      |

Accuracy is below 100% because OTP provider, mobile token strategy, kiosk verification method, kiosk offline limit, face/selfie retention, GPS radius defaults, and expected production load still need client sign-off.

## 2. Vertical Slice Rules

* Each slice must be independently developable, testable, demoable, and reviewable.
* Each slice must leave the system in a working state.
* Do not build all database first, all APIs second, and all UI last. Build business flows end to end.
* Web and mobile/app screens should be built together only when they belong to the same business flow.
* Backend permissions are mandatory. Frontend route guards are not security controls.
* Every Phase 1 transaction must resolve tenant/company context server-side.
* Kiosk attendance is confirmed in scope.
* Sensitive events must create audit logs.

## 3. Phase 1 Slice Dependency Order

```text
VS-01 Authentication/Login + Role Permission
  -> VS-02 Tenant/Company Setup
    -> VS-03 Branch/Location Setup
      -> VS-04 Employee Setup
        -> VS-05 Attendance Policy Setup
          -> VS-06 Web/Mobile Punch In-Out
            -> VS-07 GPS/Selfie Validation
          -> VS-08 Kiosk Device Setup + Binding
            -> VS-09 Shared Kiosk Attendance
              -> VS-10 Attendance Exception Review
                -> VS-11 Admin/HR Dashboard Basics
```

Parallelization guidance:

| Workstream | Can Start After | Notes |
| --- | --- | --- |
| Web auth shell | VS-01 contract freeze | Can run with backend auth APIs once response shape is stable. |
| Tenant/company UI | VS-02 API stubs | Needs auth and permissions. |
| Employee UI | VS-03 master APIs | Needs branch/location lookups. |
| Mobile punch UI | VS-05 policy resolver stub | Needs auth, employee, device assumptions. |
| Kiosk app | VS-08 kiosk status/token contract | Needs kiosk registration and binding. |
| Dashboard | VS-06/VS-09 data availability | Depends on real attendance/kiosk/exception data. |

## 4. Slice-wise Development Checklist

For every slice:

* Confirm BPMN/SRS requirements and open clarifications.
* Update or create required DocTypes/custom fields/fixtures.
* Implement backend service layer before API handler logic.
* Implement whitelisted APIs and standard error format.
* Add backend permission checks and permission query conditions where applicable.
* Implement web/mobile/kiosk screens included in the slice.
* Add unit, API integration, frontend, mobile/kiosk, and E2E tests where applicable.
* Add audit logging for sensitive actions.
* Update relevant docs and sample test data.
* Run merge verification gates before review.

## 5. Verification Gates Before Merge

| Gate | Required Evidence |
| --- | --- |
| Build | Backend app installs/migrates; frontend/mobile builds for touched surfaces. |
| Unit tests | Backend service rules and validation tests pass. |
| API tests | Auth, permission, tenant scope, success, validation, and error paths pass. |
| UI tests | Main screen renders, loading/error/empty states work, permissions hide/block actions. |
| E2E smoke | Slice happy path works from UI/API to DocType records. |
| Security | Cross-tenant, cross-branch, cross-employee access denied. |
| Audit | Required audit/log records created. |
| Regression | Prior completed slices still pass smoke tests. |
| Documentation | Slice-specific docs/contracts updated if behavior changed. |

## 6. Required Documentation Updates Per Slice

| Slice | Docs to Update if Behavior Changes |
| --- | --- |
| VS-01 | Auth document, API contracts, screen contracts, test cases. |
| VS-02 | ERD, API contracts, screen contracts, setup checklist. |
| VS-03 | ERD, API contracts, frontend contracts, role/auth matrix. |
| VS-04 | ERD, API contracts, frontend/mobile contracts. |
| VS-05 | API contracts, mobile/web contracts, test/UAT scenarios. |
| VS-06 | API contracts, validation rules, privacy/storage notes. |
| VS-07 | ERD/API/screen contracts, kiosk security notes. |
| VS-08 | ERD/API/screen contracts, kiosk/offline contract. |
| VS-09 | Exception workflow docs, API contracts, UAT scripts. |
| VS-10 | Dashboard card definitions, report scope notes. |

## 7. Vertical Slice Specifications

### VS-01: Authentication/Login + Role Permission

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-01 Authentication/Login + Role Permission |
| Business goal | Let active users securely log in and land in a role-appropriate app shell with backend-driven permissions. |
| User roles involved | Super Admin, Tenant Admin, HR Admin, Payroll Admin, Reporting Manager, Employee, Sales Employee, Kiosk Admin, Auditor, Support User. |
| BPMN/SRS reference | User Authentication and Login Flow; Role-Based Access and Permission Resolution Flow; FR-AUTH-001 to FR-AUTH-010; FR-RBAC-001 to FR-RBAC-008. |
| Scope included | Web/mobile login, OTP baseline, logout, refresh session, permission bootstrap, role-aware shell, login audit. |
| Scope excluded | Full MFA policy, SSO, advanced password policy UI, support break-glass workflow. |
| Backend work | Auth service wrappers, OTP service, session registry, permission bootstrap service, role fixtures, tenant active check. |
| Frappe DocTypes / database changes | Reuse `User`, `Role`, `User Permission`; custom `Tenant`, `Login Attempt Log`, `OTP Log`, `User Session`, `Audit Log`; custom user fields if needed. |
| API contracts involved | Login, Logout, Request OTP, Verify OTP, Refresh Session, Permission Bootstrap. |
| Web screens involved | Login / OTP / Forgot Password, Role-based Dashboard Shell. |
| Mobile/kiosk screens involved | Mobile Login / OTP. |
| Frontend business logic | Store session safely, call Permission Bootstrap after login, render routes/menus from permissions, handle tenant suspended and role missing states. |
| Backend business logic | Validate credentials, enabled user, tenant status, roles, OTP, token/session lifecycle, permission scope. |
| Validation rules | Identifier/password required; OTP expiry/retry; user enabled; tenant active; at least one valid role. |
| Permission rules | Public only for login/OTP; all app routes require authenticated session and backend permission bootstrap. |
| Audit/logging rules | Log login success/failure, OTP request/verify, lockout, logout-all, role/permission denied sensitive events. |
| Edge cases | Tenant suspended after token issue; role removed mid-session; OTP provider failure; mobile app resumes expired token. |
| Unit test cases | Credential validation; OTP expiry/retry; tenant status check; permission resolver by role. |
| API integration test cases | Login success/failure; OTP request/verify; refresh revoked token; permission bootstrap by role/scope. |
| Frontend test cases | Login form validation; route guard blocks unauthorized route; menu renders from permissions; session expired redirect. |
| Mobile/kiosk test cases | Mobile login stores token; expired token refresh; device metadata sent; no offline login. |
| E2E test cases | Login -> permission bootstrap -> dashboard shell; disabled user rejected; tenant suspended rejected. |
| Acceptance criteria | Valid users log in; invalid/suspended/disabled users are rejected; users see only allowed navigation; direct unauthorized API/route is blocked. |
| Definition of Done | Auth APIs, screens, role fixtures, audit logs, permission tests, and session handling pass merge gates. |
| Dependencies | None, first slice. |
| Developer handoff notes | Keep Frappe standard login compatibility, but expose consistent custom response shape for web/mobile. |

### VS-02: Tenant/Company Setup

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-02 Tenant/Company Setup |
| Business goal | Create a tenant and company foundation so all later data can be scoped safely. |
| User roles involved | Super Admin, Tenant Admin, Auditor read. |
| BPMN/SRS reference | Tenant and Company Setup Flow; FR-TEN-001 to FR-TEN-004, FR-TEN-006, FR-DASH setup indicators. |
| Scope included | Tenant creation, company create/update, tenant status, setup checklist, initial tenant admin scope. |
| Scope excluded | Subscription billing, plan enforcement beyond placeholder fields, multi-site tenant deployment. |
| Backend work | Tenant service, company upsert wrapper, setup checklist service, tenant status/session revocation. |
| Frappe DocTypes / database changes | Custom `Tenant`; custom tenant link on `Company`; `User Permission`; `Audit Log`; `User Session`. |
| API contracts involved | Create Tenant, Update Tenant Status, Tenant Setup Status, Company Create/Update. |
| Web screens involved | Tenant/Company Setup, Role-based Dashboard Shell. |
| Mobile/kiosk screens involved | None. |
| Frontend business logic | Create tenant form, company setup form, setup checklist, status actions with confirmation. |
| Backend business logic | Enforce tenant uniqueness, company link to tenant, active/suspended state, setup completeness. |
| Validation rules | Unique tenant code; company required fields; tenant admin email/mobile valid; suspension reason required. |
| Permission rules | Super Admin creates tenants; Tenant Admin updates own company only; cross-tenant access blocked. |
| Audit/logging rules | Audit tenant create, activate, suspend, reactivate, company profile-sensitive changes. |
| Edge cases | Company created but admin user fails; duplicate company name; suspended tenant with active sessions. |
| Unit test cases | Tenant uniqueness; company tenant match; setup checklist computation; status transition rules. |
| API integration test cases | Create tenant; duplicate tenant conflict; Tenant Admin cross-tenant update blocked; suspend revokes sessions. |
| Frontend test cases | Form validation; checklist updates; status confirmation; permission denied state. |
| Mobile/kiosk test cases | Not applicable. |
| E2E test cases | Super Admin creates tenant/company -> Tenant Admin sees setup checklist. |
| Acceptance criteria | Tenant and company can be created and updated within scope; inactive tenant blocks login; checklist is accurate. |
| Definition of Done | Tenant/company DocTypes, APIs, UI, audit, permission tests, and E2E smoke pass. |
| Dependencies | VS-01. |
| Developer handoff notes | Treat `tenant` on Company as mandatory for this SaaS model. |

### VS-03: Branch/Location Setup

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-03 Branch/Location Setup |
| Business goal | Configure branch and physical work locations for employee assignment, GPS validation, kiosk binding, and reporting. |
| User roles involved | Tenant Admin, HR Admin, Kiosk Admin read, Auditor read. |
| BPMN/SRS reference | Tenant/Company Setup Flow; FR-TEN-005, FR-TEN-008; Branch/Location Master screen. |
| Scope included | Branch list/create/update status, location list/create/update GPS coordinates/radius, scoped lookups. |
| Scope excluded | Complex geo-fence polygons, map UI, territory/client sales locations. |
| Backend work | Branch service, location service, permission query filters, setup checklist update. |
| Frappe DocTypes / database changes | Reuse or customize `Branch`; reuse `Location` or custom `Work Location`; add tenant/company/branch fields and indexes. |
| API contracts involved | Branch List/Create, Location List/Create, Tenant Setup Status. |
| Web screens involved | Branch/Location Setup. |
| Mobile/kiosk screens involved | None directly. |
| Frontend business logic | Branch/location CRUD, GPS field validation, list filters, active/inactive status display. |
| Backend business logic | Validate branch-company-tenant consistency, coordinate ranges, radius, active state. |
| Validation rules | Latitude -90 to 90; longitude -180 to 180; radius positive; inactive branch blocked for new bindings. |
| Permission rules | Tenant Admin/HR Admin manage within scope; Kiosk Admin read assigned branch/location only. |
| Audit/logging rules | Audit create/deactivate/default location and GPS radius/coordinate changes. |
| Edge cases | Deactivate branch with active employees/kiosks; location used by active policy; duplicate branch name. |
| Unit test cases | Coordinate validation; branch tenant match; duplicate active branch; inactive branch behavior. |
| API integration test cases | Create/list branch; create/list location; cross-company location blocked; scoped list. |
| Frontend test cases | Empty state; invalid coordinates; filters; permission denied; successful save refreshes list. |
| Mobile/kiosk test cases | Not applicable. |
| E2E test cases | Tenant Admin creates branch/location -> available in employee and kiosk setup lookup. |
| Acceptance criteria | Branch/location setup works and is tenant/company scoped; invalid GPS data is blocked. |
| Definition of Done | Master APIs, UI, scope tests, audit logs, and lookup integration pass. |
| Dependencies | VS-02. |
| Developer handoff notes | Use the same Location naming across ERD, API, and UI even if implemented as custom Work Location. |

### VS-04: Employee Setup

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-04 Employee Setup |
| Business goal | Create employee master records with organization mapping and optional user account for self-service/mobile attendance. |
| User roles involved | HR Admin, Tenant Admin, Payroll Admin read, Reporting Manager team read, Employee own read, Auditor read. |
| BPMN/SRS reference | Employee Setup Flow; FR-EMP-001 to FR-EMP-008. |
| Scope included | Employee create/update/list, branch/location/department/designation/manager mapping, user link, role assignment, sales flag. |
| Scope excluded | Full onboarding, documents, lifecycle, bulk import, payroll fields. |
| Backend work | Employee service, user-link service, role assignment, employee list with scoped filters, audit hooks. |
| Frappe DocTypes / database changes | Reuse `Employee`, `User`, `Role`, `User Permission`, `Department`, `Designation`; custom Employee fields `tenant`, `branch`, `work_location`, `is_sales_employee`, `attendance_policy` if needed. |
| API contracts involved | Employee Create/Update, Employee Search/List, Permission Bootstrap, Branch/Location lookups. |
| Web screens involved | Employee List and Employee Form. |
| Mobile/kiosk screens involved | Employee Home depends on linked employee/user later. |
| Frontend business logic | Employee table filters, form validation, user creation flag, manager lookup, sales role indicator. |
| Backend business logic | Unique employee code, active employee required fields, manager tenant/company validation, user role assignment. |
| Validation rules | Employee code unique per tenant/company; active employee requires branch/location/department/designation; valid email/mobile if creating user. |
| Permission rules | HR Admin full within scope; Manager team read; Employee own read; no cross-tenant employee access. |
| Audit/logging rules | Audit create, status change, user link, branch/location change, manager change, sales flag change. |
| Edge cases | Existing user email; manager outside scope; branch inactive; changing sales flag after role assigned. |
| Unit test cases | Employee uniqueness; mandatory fields; manager validation; role assignment. |
| API integration test cases | Create employee; duplicate rejected; list scoped by HR/Manager/Employee; user link creates role/User Permission. |
| Frontend test cases | Employee form validation; duplicate error mapping; filters/pagination; read-only role behavior. |
| Mobile/kiosk test cases | Mobile login recognizes linked employee in later auth smoke. |
| E2E test cases | HR creates employee with user -> employee can log in and see own home after VS-01/VS-05. |
| Acceptance criteria | HR can create/search employee records; employee can be linked to user; roles and scope are assigned correctly. |
| Definition of Done | Employee APIs/UI/permissions/audit/tests pass; employee data usable by attendance slices. |
| Dependencies | VS-03. |
| Developer handoff notes | Avoid exposing direct `/api/resource/Employee` for create/update because user linking and role assignment are workflow-sensitive. |

### VS-05: Attendance Policy Setup

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-05 Attendance Policy Setup |
| Business goal | Configure policy-driven attendance channels and validation rules before accepting punches. |
| User roles involved | Tenant Admin, HR Admin, Auditor read, Employee read effective policy through API. |
| BPMN/SRS reference | Basic Attendance Setup Flow; FR-ATTSET-001 to FR-ATTSET-007. |
| Scope included | Policy create/update/activate/deactivate, channel flags, GPS/selfie/face flags, duplicate window, offline flags, policy resolver. |
| Scope excluded | Full shift/late/OT/payroll rule engine, advanced policy inheritance UI. |
| Backend work | Attendance policy DocType/controller, resolver service, conflict detection, activation rules, API. |
| Frappe DocTypes / database changes | Custom `Attendance Policy`; links to Tenant, Company, Branch, Location, Department, Employee/category. |
| API contracts involved | Attendance Policy Upsert, Active Attendance Policy. |
| Web screens involved | Attendance Policy Setup. |
| Mobile/kiosk screens involved | Employee Home/Punch and Kiosk Attendance consume resolved policy later. |
| Frontend business logic | Policy form, scope selector, channel toggles, duplicate/offline validation, activate/deactivate workflow. |
| Backend business logic | Resolve most-specific policy; ensure one active policy per exact scope/effective date; validate channel compatibility. |
| Validation rules | At least one channel enabled; offline max hours required when offline enabled; duplicate window positive. |
| Permission rules | Tenant Admin/HR Admin configure within scope; Employee/kiosk can read effective policy only. |
| Audit/logging rules | Audit create, activate, deactivate, validation rule changes, duplicate/offline changes. |
| Edge cases | No active policy; conflicting policies; policy changed while mobile/kiosk app open. |
| Unit test cases | Policy completeness; conflict detection; resolver precedence; offline flag validation. |
| API integration test cases | Upsert active policy; resolve for employee/source; disabled source rejected; cross-scope update blocked. |
| Frontend test cases | Form toggles; invalid policy blocked; activation confirmation; empty state. |
| Mobile/kiosk test cases | Resolve policy on mobile/kiosk stubs returns expected flags. |
| E2E test cases | HR creates policy -> employee home sees punch requirements. |
| Acceptance criteria | Attendance policy can be configured and resolved; incomplete/conflicting policy is blocked; changes audited. |
| Definition of Done | Policy DocType, resolver, APIs, UI, and tests pass. |
| Dependencies | VS-04. |
| Developer handoff notes | Keep policy resolver API stable; many later slices depend on it. |

### VS-06: Web/Mobile Punch In-Out

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-06 Web/Mobile Punch In-Out |
| Business goal | Let employees punch in/out from allowed web/mobile channels with active policy and device checks. |
| User roles involved | Employee, Sales Employee, HR Admin read, Manager team read. |
| BPMN/SRS reference | Employee Mobile/Web Punch In and Punch Out Flow; FR-PUNCH-001 to FR-PUNCH-009. |
| Scope included | Attendance status, web punch, mobile punch shell, mobile device check, duplicate window, Employee Checkin creation. |
| Scope excluded | GPS/selfie enforcement details handled in VS-07; kiosk handled in VS-09; attendance regularization full workflow. |
| Backend work | Punch service, attendance status service, duplicate detector, idempotency support, device validation baseline. |
| Frappe DocTypes / database changes | `Employee Checkin` custom fields; `Attendance`; `Employee Device`; `Attendance Policy`; `Audit Log`; `Attendance Exception` placeholder. |
| API contracts involved | Web/Mobile Punch, Attendance Status, Active Attendance Policy. |
| Web screens involved | Web Punch In/Out. |
| Mobile/kiosk screens involved | Employee Home, Mobile Punch In/Out, Attendance Status/History. |
| Frontend business logic | Resolve status/policy, show punch action, prevent double-submit, handle duplicate/device/channel errors. |
| Backend business logic | Validate active employee, allowed source, device approval, idempotency key, duplicate window, checkin creation. |
| Validation rules | Source must be `WEB` or `MOBILE`; employee own; approved device if required; punch type valid; timestamp sane. |
| Permission rules | Employee/Sales Employee own punch only; HR/Manager read scoped status; direct Employee Checkin create blocked. |
| Audit/logging rules | Audit accepted punch and blocked sensitive attempts; log duplicate/device exceptions where policy says review. |
| Edge cases | Retry after timeout; duplicate click; mobile device not approved; punch out without punch in; session expires. |
| Unit test cases | Punch state machine; duplicate detection; device validation; idempotency replay. |
| API integration test cases | Web punch success; mobile unauthorized device blocked; duplicate returns conflict or exception; status updates. |
| Frontend test cases | Web punch loading/success/error; channel disabled; status refresh; access denied. |
| Mobile/kiosk test cases | Mobile punch screen sends device/idempotency; status/history own data; no cross-employee access. |
| E2E test cases | Employee web punch -> Employee Checkin -> status updates; mobile punch from approved device. |
| Acceptance criteria | Employee can punch from enabled source; disabled source/device/duplicate rules are enforced; checkin is created. |
| Definition of Done | Punch APIs, web/mobile screens, checkin writes, audit, and tests pass. |
| Dependencies | VS-05. |
| Developer handoff notes | GPS/selfie may be stubbed as not required unless policy from VS-07 requires it. |

### VS-07: GPS/Selfie Validation

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-07 GPS/Selfie Validation |
| Business goal | Enforce policy-driven GPS and selfie/face validation for attendance without silently approving failed validation. |
| User roles involved | Employee, Sales Employee, HR Admin reviewer, Manager reviewer if configured. |
| BPMN/SRS reference | GPS and Selfie Attendance Validation Flow; FR-VAL-001 to FR-VAL-007. |
| Scope included | GPS validation, selfie upload, face/selfie verification log, integration into web/mobile punch, exception creation on failure. |
| Scope excluded | Advanced liveness, production face recognition provider finalization, long-term biometric retention policy. |
| Backend work | GPS service, distance calculation, selfie upload wrapper, face verification adapter, validation-to-punch orchestration. |
| Frappe DocTypes / database changes | `GPS Validation Log`, `Face Verification Log`, `File`, `Attendance Exception`, `Employee Checkin` links. |
| API contracts involved | GPS Validate, Selfie Upload, Face/Selfie Verify, Web/Mobile Punch. |
| Web screens involved | Web Punch In/Out if browser GPS/selfie enabled. |
| Mobile/kiosk screens involved | GPS Permission and Selfie Capture, Mobile Punch In/Out. |
| Frontend business logic | Prompt runtime permissions, capture GPS/camera, upload selfie, submit validation references with punch, show retry/exception state. |
| Backend business logic | Validate coordinates/radius/accuracy, file privacy, verification method, failure behavior based on policy. |
| Validation rules | Coordinates valid; accuracy positive; required GPS/selfie cannot be bypassed; file type/size allowed; match score valid. |
| Permission rules | Employee validates own punch only; raw GPS/selfie access restricted; kiosk source only via kiosk token later. |
| Audit/logging rules | Append validation logs; audit admin access to face/selfie data; audit exception creation. |
| Edge cases | GPS denied; poor accuracy; camera unavailable; upload succeeds but punch fails; provider unavailable. |
| Unit test cases | Radius calculation; invalid coordinates; file validation; policy failure mode. |
| API integration test cases | GPS pass/fail; selfie upload private; verification log created; failed validation creates exception/block. |
| Frontend test cases | Permission denied state; poor GPS retry; selfie retake; upload failure. |
| Mobile/kiosk test cases | Mobile GPS/camera flow; offline capture rules if enabled; no image leak after logout. |
| E2E test cases | Mobile punch with GPS/selfie -> validation logs -> checkin; failed GPS -> exception. |
| Acceptance criteria | GPS/selfie required by policy is captured and auditable; failures block or create exception, never silently approve. |
| Definition of Done | Validation APIs, logs, mobile/web capture UI, privacy rules, and tests pass. |
| Dependencies | VS-06. |
| Developer handoff notes | Keep face provider behind adapter; Phase 1 can support selfie verification status before full recognition. |

### VS-08: Kiosk Device Setup + Binding

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-08 Kiosk Device Setup + Binding |
| Business goal | Register, bind, and activate shared kiosk devices before they can capture attendance. |
| User roles involved | Kiosk Admin, Tenant Admin, HR Admin, Auditor read. |
| BPMN/SRS reference | Kiosk Device Setup and Binding Flow; FR-KIOSKSET-001 to FR-KIOSKSET-008. |
| Scope included | Kiosk registration, branch/location binding, kiosk policy baseline, activation/deactivation, kiosk status/token. |
| Scope excluded | Actual employee kiosk punch, offline sync processing beyond status readiness. |
| Backend work | Kiosk device service, token generation/hash, binding service, activation rules, status API. |
| Frappe DocTypes / database changes | `Kiosk Device`, `Kiosk Device Binding`, `Kiosk Policy`, `Audit Log`, links to Tenant/Company/Branch/Location. |
| API contracts involved | Register Kiosk, Bind Kiosk, Activate/Deactivate Kiosk, Kiosk Status. |
| Web screens involved | Kiosk Device Setup and Binding. |
| Mobile/kiosk screens involved | Kiosk Activation/Binding. |
| Frontend business logic | Register/bind forms, active status list, one-time token display, pending sync warning placeholder. |
| Backend business logic | Unique device ID, one active binding, active policy required for activation, branch/location tenant match. |
| Validation rules | Kiosk active requires binding and policy; device ID unique; activation/deactivation reason rules. |
| Permission rules | Kiosk Admin scoped to assigned branch; kiosk token can read own status only. |
| Audit/logging rules | Audit register, bind, activate, deactivate, token generation/rotation, policy changes. |
| Edge cases | Token lost; rebinding active kiosk; branch inactive; kiosk deactivated with offline records. |
| Unit test cases | Device uniqueness; binding tenant match; activation prerequisites; token hash storage. |
| API integration test cases | Register kiosk; bind kiosk; activate; unbound activation fails; kiosk status with token. |
| Frontend test cases | Register/bind forms; activation token one-time display; inactive/unbound states. |
| Mobile/kiosk test cases | Kiosk app validates token/status; inactive/unbound kiosk cannot enter attendance mode. |
| E2E test cases | Web registers/binds/activates kiosk -> kiosk app enters ready status. |
| Acceptance criteria | Only registered, active, bound kiosk can proceed to attendance screen; all setup actions audited. |
| Definition of Done | Kiosk setup DocTypes, APIs, web/kiosk screens, token security, and tests pass. |
| Dependencies | VS-03, VS-05. |
| Developer handoff notes | Device token is returned once; store only hash server-side. |

### VS-09: Shared Kiosk Attendance

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-09 Shared Kiosk Attendance |
| Business goal | Allow multiple employees to mark attendance sequentially from one active registered kiosk. |
| User roles involved | Employees/Sales Employees through kiosk device, Kiosk Admin, HR Admin reviewer. |
| BPMN/SRS reference | Shared Kiosk Multi-Employee Attendance Flow; FR-KIOSKATT-001 to FR-KIOSKATT-010. |
| Scope included | Kiosk punch, employee identification fallback, selfie/face verification status, Kiosk Attendance Log, Employee Checkin creation, offline sync. |
| Scope excluded | Advanced face recognition/liveness, biometric hardware, full sales field tracking. |
| Backend work | Kiosk punch service, kiosk token auth, employee eligibility, duplicate detection, idempotency, offline sync processor. |
| Frappe DocTypes / database changes | `Kiosk Attendance Log`, `Employee Checkin`, `GPS Validation Log`, `Face Verification Log`, `Attendance Exception`, `Kiosk Device`. |
| API contracts involved | Kiosk Punch, Kiosk Offline Sync, Kiosk Status, Selfie Upload, Face/Selfie Verify. |
| Web screens involved | Kiosk status area in Kiosk Device Setup; exception visibility later. |
| Mobile/kiosk screens involved | Shared Kiosk Attendance Screen, Kiosk Success/Failure Screen, Offline Sync Status. |
| Frontend business logic | Locked ready screen, employee code/selfie flow, result screen, auto-reset, offline queue state. |
| Backend business logic | Validate kiosk active/bound/policy, employee active, branch eligibility, verification result, duplicate, idempotency. |
| Validation rules | Kiosk token valid; employee active; idempotency key required; verification method allowed; offline max window enforced. |
| Permission rules | Kiosk token only for bound tenant/company/branch/location; no employee personal login on kiosk. |
| Audit/logging rules | Audit accepted kiosk punch, failed verification exception, offline conflict, kiosk deactivation impact. |
| Edge cases | Consecutive employees; same employee retries; offline queue full; branch binding changed while offline; duplicate replay. |
| Unit test cases | Kiosk eligibility; employee branch check; idempotency; offline window; duplicate punch. |
| API integration test cases | Kiosk punch success; inactive kiosk blocked; failed verification exception; offline sync replay idempotent. |
| Frontend test cases | Web kiosk status reflects active/pending sync; no sensitive employee data leak. |
| Mobile/kiosk test cases | Ready -> capture -> success/failure -> reset; offline queue; admin PIN exit. |
| E2E test cases | Active kiosk captures two employees sequentially; offline sync creates checkins without duplicates. |
| Acceptance criteria | Shared kiosk records attendance for multiple employees; failures create clear error/exception; screen resets after each attempt. |
| Definition of Done | Kiosk punch/offline APIs, kiosk screens, logs, exceptions, and tests pass. |
| Dependencies | VS-08, VS-07. |
| Developer handoff notes | Treat kiosk app as device-authenticated, not user-authenticated. |

### VS-10: Attendance Exception Review

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-10 Attendance Exception Review |
| Business goal | Give authorized reviewers a controlled queue for GPS, selfie, duplicate, device, kiosk, and offline conflicts. |
| User roles involved | HR Admin, Reporting Manager if configured, Tenant Admin escalation, Auditor read, Kiosk Admin kiosk-related read. |
| BPMN/SRS reference | Attendance Exception Review; FR-EXC-001 to FR-EXC-005. |
| Scope included | Exception list/filter, review/approve/reject/resolve, remarks, audit, optional checkin/attendance update. |
| Scope excluded | Full attendance regularization employee request workflow, payroll adjustment workflow. |
| Backend work | Exception service, review workflow, reviewer scope validation, attendance/checkin update service, concurrency control. |
| Frappe DocTypes / database changes | `Attendance Exception`, `Employee Checkin`, `Attendance`, `Audit Log`, validation log links. |
| API contracts involved | Attendance Exception List, Attendance Exception Review. |
| Web screens involved | Attendance Exception Review. |
| Mobile/kiosk screens involved | Mobile status may show own exception status; kiosk failure creates exception in VS-09. |
| Frontend business logic | Filter queue, detail view, safe sensitive data display, review dialog with remarks, refresh after action. |
| Backend business logic | Validate action/status transition, reviewer scope, remarks, linked record update, audit. |
| Validation rules | Exception links to source; approve/reject requires remarks; closed exception protected; concurrent update conflict handled. |
| Permission rules | HR by company/branch; Manager team only; Auditor read-only; Employee own status only. |
| Audit/logging rules | Audit every exception create/status transition and sensitive log/image access. |
| Edge cases | Two reviewers act concurrently; linked checkin already exists; exception source record deleted/hidden; image access restricted. |
| Unit test cases | Status transition; reviewer scope; remarks required; concurrency/version check. |
| API integration test cases | List filters; approve; reject; cross-team review denied; audit created. |
| Frontend test cases | Empty/filter states; review dialog validation; conflict refresh; read-only auditor. |
| Mobile/kiosk test cases | Mobile own exception status visible if included; kiosk sees failure state only. |
| E2E test cases | Failed GPS creates exception -> HR approves -> checkin/attendance updated. |
| Acceptance criteria | Authorized reviewers can process exceptions; unauthorized users cannot; actions are audited. |
| Definition of Done | Exception APIs/UI/workflow/audit/concurrency tests pass. |
| Dependencies | VS-07, VS-09. |
| Developer handoff notes | Do not expose raw selfie/GPS details in list; use detail access with audit if needed. |

### VS-11: Admin/HR Dashboard Basics

| Field | Specification |
| --- | --- |
| Slice ID and name | VS-11 Admin/HR Dashboard Basics |
| Business goal | Provide scoped operational visibility for setup, employees, attendance, kiosk status, and exceptions. |
| User roles involved | Super Admin, Tenant Admin, HR Admin, Reporting Manager where configured, Auditor read where configured. |
| BPMN/SRS reference | Admin and HR Dashboard Basics Flow; FR-DASH-001 to FR-DASH-006. |
| Scope included | Dashboard summary API, setup status card, employee counts, attendance counts, kiosk status, exception counts, quick actions. |
| Scope excluded | Advanced MIS, exports, charts beyond Phase 1 cards, payroll/leave/shift metrics. |
| Backend work | Dashboard aggregation service, scoped query filters, performance indexes/use optimized counts, partial-data handling. |
| Frappe DocTypes / database changes | Reads Tenant, Company, Employee, Attendance, Employee Checkin, Kiosk Device, Kiosk Attendance Log, Attendance Exception. |
| API contracts involved | Dashboard Summary, Tenant Setup Status, Permission Bootstrap. |
| Web screens involved | Admin/HR Dashboard. |
| Mobile/kiosk screens involved | Employee Home/status consumes subset but not admin dashboard. |
| Frontend business logic | Role-specific card rendering, date/company/branch filters, quick actions hidden by permission, partial error display. |
| Backend business logic | Apply tenant/company/branch/team scope before aggregation; current date tenant timezone; query performance guardrails. |
| Validation rules | Date valid; filters inside user scope; dashboard card set based on role. |
| Permission rules | Super Admin platform tenant metadata; Tenant/HR scoped counts; Manager team counts only; Employee no admin dashboard. |
| Audit/logging rules | No audit for normal dashboard read; audit denied cross-tenant or sensitive access attempts. |
| Edge cases | Empty tenant; no employees; no kiosk configured; slow query; branch-scoped HR. |
| Unit test cases | Scope filter builder; count aggregation; date default; empty data. |
| API integration test cases | HR dashboard; Tenant Admin setup dashboard; Employee denied; branch filter respects scope. |
| Frontend test cases | Skeleton cards; empty setup state; quick action permissions; partial error state. |
| Mobile/kiosk test cases | Not applicable. |
| E2E test cases | After employee/punch/kiosk/exception data exists, dashboard counts match scoped records. |
| Acceptance criteria | Dashboard loads scoped Phase 1 metrics and quick actions; no cross-tenant data appears. |
| Definition of Done | Dashboard API/UI/performance smoke/permission tests pass. |
| Dependencies | VS-02 through VS-10 for meaningful data. |
| Developer handoff notes | Freeze Phase 1 dashboard cards to avoid scope creep. |

## 8. Final Phase 1 Release Readiness Checklist

### Functional Readiness

* VS-01 through VS-11 are complete and accepted.
* Kiosk attendance is implemented as confirmed scope.
* Web/mobile punch and kiosk punch create auditable records.
* GPS/selfie validation failures do not silently approve attendance.
* Attendance exceptions can be reviewed by authorized roles.
* Dashboard reflects scoped setup, employee, attendance, kiosk, and exception data.

### Security and Permission Readiness

* Tenant/company/branch/location filtering is tested for every API and report.
* Employee cannot access another employee's data.
* Manager cannot access non-team data.
* Kiosk token cannot access another kiosk or tenant.
* Direct DocType/resource access is blocked where workflow APIs are required.
* Sensitive GPS/selfie access is restricted and audited.

### Data and Audit Readiness

* Required custom DocTypes and custom fields are migrated through Frappe migration.
* Required indexes are added for high-volume logs.
* Audit logs are created for tenant, permission, employee, policy, device, kiosk, punch, and exception actions.
* Offline sync uses idempotency keys and creates exceptions for conflicts.
* Test data covers at least two tenants to verify isolation.

### QA and UAT Readiness

* Unit, API, frontend, mobile/kiosk, and E2E tests pass for every slice.
* Browser smoke tests pass for all Phase 1 web screens.
* Mobile smoke tests pass for login, home, punch, GPS/selfie, and status.
* Kiosk smoke tests pass for activation, attendance, result reset, and offline sync.
* UAT scenarios are traceable to SRS acceptance criteria.

### Deployment Readiness

* Environment config and secrets are documented.
* HTTPS is enabled in staging/production.
* Backup and restore procedure is defined before production migration.
* Monitoring covers server, workers, queue failures, failed jobs, and API errors.
* Rollback plan exists for DocType migrations and app release.

## 9. Final Recommendation

Build Phase 1 through the 11 vertical slices in this document. Keep each slice small enough to merge after its DocType/API/UI/test path works end to end. Do not start advanced shift, leave, payroll, sales tracking, or reports until the Phase 1 foundation, attendance, kiosk, exception, and dashboard flows are accepted.

The next recommended artifact is the Phase 1 Test Case and UAT Document, using these slices as the test organization structure.
