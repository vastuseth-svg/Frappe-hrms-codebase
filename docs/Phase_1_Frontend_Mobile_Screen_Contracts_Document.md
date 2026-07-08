# Phase 1 Frontend + Mobile Screen Contracts Document

## 1. Document Overview

This document defines Phase 1 screen contracts for the Modern SaaS HRMS web, mobile, and kiosk applications. It is not a visual UI design document. It defines practical screen behavior, routes, inputs, display data, actions, API integration, permissions, states, and acceptance criteria for development and testing.

| Item | Value |
| --- | --- |
| Web frontend | Vue.js + Tailwind CSS |
| Mobile app | React Native or Flutter |
| Recommended kiosk app | React Native Android kiosk mode |
| Backend | Frappe Framework / ERPNext HRMS |
| Architecture | Multi-tenant SaaS HRMS |
| API source | `Phase_1_API_Contracts_Document.md` |
| ERD source | `Phase_1_ERD_Frappe_DocType_Design.md` |
| Accuracy probability | 87% based on available documents |

Accuracy is below 100% because OTP policy, mobile session strategy, kiosk hardware, kiosk verification method, face/selfie retention, offline sync limits, and exact dashboard card definitions still require client sign-off.

## 2. Contract Principles

* Web, mobile, kiosk, backend, permissions, and tests should be implemented together only when they belong to the same vertical slice.
* Frontend route guards must call backend permission bootstrap and must not replace server-side authorization.
* All screens must carry tenant/company/branch context from authenticated scope, not from user-trusted local state.
* Every form must validate locally for usability, but backend remains final authority.
* Screens must use the same field names and enums defined in the API contracts.
* Kiosk attendance is confirmed in scope and must not be treated as optional.
* GPS, selfie/face, device, kiosk token, and attendance exception data are sensitive.

## 3. Phase 1 Screen Summary Table

| No. | Screen | Platform | Vertical Slice | Primary Roles | Main APIs |
| --- | --- | --- | --- | --- | --- |
| 1 | Login / OTP / Forgot Password | Web | VS-01 | All web users | Login, Request OTP, Verify OTP |
| 2 | Role-based Dashboard Shell | Web | VS-01 | All web users | Permission Bootstrap, Logout |
| 3 | Tenant/Company Setup | Web | VS-02 | Super Admin, Tenant Admin | Create Tenant, Company Upsert, Setup Status |
| 4 | Branch/Location Setup | Web | VS-02 | Tenant Admin, HR Admin | Branch List/Create, Location List/Create |
| 5 | Employee List and Employee Form | Web | VS-03 | HR Admin, Tenant Admin, Auditor read | Employee List, Employee Upsert |
| 6 | Attendance Policy Setup | Web | VS-04 | Tenant Admin, HR Admin | Attendance Policy Upsert, Resolve |
| 7 | Web Punch In/Out | Web | VS-05 | Employee, Sales Employee | Attendance Punch, Attendance Status |
| 8 | Kiosk Device Setup and Binding | Web | VS-06 | Kiosk Admin, Tenant Admin, HR Admin | Register Kiosk, Bind Kiosk, Update Status |
| 9 | Attendance Exception Review | Web | VS-08 | HR Admin, Manager, Tenant Admin | Exception List, Exception Review |
| 10 | Admin/HR Dashboard | Web | VS-08 | Super Admin, Tenant Admin, HR Admin, Manager | Dashboard Summary, Setup Status |
| 11 | Mobile Login / OTP | Mobile | VS-01 | Employee, Sales Employee, Manager | Login, Request OTP, Verify OTP, Refresh Session |
| 12 | Employee Home | Mobile | VS-05 | Employee, Sales Employee, Manager | Permission Bootstrap, Attendance Status, Resolve Policy |
| 13 | Mobile Punch In/Out | Mobile | VS-05 | Employee, Sales Employee | Attendance Punch, Validate GPS, Upload Selfie, Verify Face |
| 14 | GPS Permission and Selfie Capture | Mobile | VS-05 | Employee, Sales Employee | Validate GPS, Upload Selfie, Verify Face |
| 15 | Attendance Status/History | Mobile | VS-05 | Employee, Sales Employee, Manager own/team | Attendance Status |
| 16 | Kiosk Activation/Binding | Kiosk | VS-06 | Kiosk Admin, registered kiosk device | Kiosk Status |
| 17 | Shared Kiosk Attendance Screen | Kiosk | VS-07 | Employees through kiosk device | Kiosk Punch, Upload Selfie, Verify Face |
| 18 | Kiosk Success/Failure Screen | Kiosk | VS-07 | Employees through kiosk device | Kiosk Punch result |
| 19 | Offline Sync Status | Kiosk/Mobile | VS-07 | Kiosk Admin, Employee where enabled | Kiosk Offline Sync, Kiosk Status |

## 4. Web Navigation Structure

### 4.1 Public Web Routes

| Route | Screen | Notes |
| --- | --- | --- |
| `/login` | Login | Public; redirects authenticated users to dashboard. |
| `/otp` | OTP | Public or semi-public after OTP request. |
| `/forgot-password` | Forgot Password | Public; OTP/password reset flow. |

### 4.2 Authenticated Web Routes

| Route | Screen | Permission Key |
| --- | --- | --- |
| `/app` | Role-based shell | Authenticated user. |
| `/app/dashboard` | Admin/HR dashboard | `dashboard.canRead` |
| `/app/tenant/setup` | Tenant/company setup | `tenant.canCreate` or `company.canUpdate` |
| `/app/branches` | Branch/location setup | `branch.canRead` |
| `/app/employees` | Employee list | `employee.canRead` |
| `/app/employees/new` | Employee form | `employee.canCreate` |
| `/app/employees/:id` | Employee form/detail | `employee.canRead` or own profile |
| `/app/attendance/policy` | Attendance policy setup | `attendancePolicy.canUpdate` |
| `/app/attendance/punch` | Web punch | `attendance.canCreateOwn` |
| `/app/kiosk/devices` | Kiosk device setup | `kiosk.canRead` |
| `/app/exceptions` | Exception review | `attendanceException.canReview` or `canRead` |

Navigation must be generated from Permission Bootstrap and hidden items must also be blocked by route guards.

## 5. Mobile Navigation Structure

| Stack/Tab | Screen | Notes |
| --- | --- | --- |
| Auth Stack | Mobile Login, OTP | Shown before authenticated session. |
| Main Tab | Home | Default after login. |
| Main Tab | Punch | Quick attendance action. |
| Main Tab | Status | Attendance status/history. |
| Utility Flow | GPS Permission | Opened only when policy requires GPS. |
| Utility Flow | Selfie Capture | Opened only when policy requires selfie/face. |
| Utility Flow | Offline Sync Status | Shown only if offline queue is enabled or pending. |

Mobile should store tokens only in platform secure storage. It must refresh session through the API and clear local sensitive state on logout, role change, device reset, or tenant suspension.

## 6. Kiosk Mode Navigation Rules

* Kiosk app starts at activation/status check.
* Active and bound kiosk enters locked shared attendance screen.
* Employees must not access admin setup, OS navigation, or another employee profile from kiosk.
* Exit kiosk mode requires admin PIN or authorized admin flow.
* After each punch attempt, kiosk shows success/failure briefly and returns to ready state.
* Offline state must be visible to the kiosk operator without exposing sensitive employee data.
* Kiosk token must be bound to one active kiosk device and one active tenant/company/branch/location binding.

## 7. Shared UI Component List

| Component | Platforms | Purpose |
| --- | --- | --- |
| AuthForm | Web, Mobile | Identifier/password login. |
| OTPInput | Web, Mobile | 6-digit OTP with resend timer. |
| AppShell | Web | Sidebar/topbar, role menu, company/branch scope. |
| MobileAppShell | Mobile | Main tabs and secure session state. |
| DataTable | Web | Paginated employee, branch, kiosk, exception lists. |
| FilterBar | Web | Search, status, date, company, branch filters. |
| FormField | Web, Mobile | Label, input, helper/error text. |
| SelectLookup | Web | Company, branch, employee, department, designation lookup. |
| StatusBadge | Web, Mobile, Kiosk | Active/pending/failed/synced status. |
| PermissionGate | Web, Mobile | Hide/disable actions based on bootstrap permissions. |
| EmptyState | Web, Mobile | Meaningful empty lists/setup states. |
| ErrorState | Web, Mobile, Kiosk | API/network/permission error display. |
| LoadingSkeleton | Web, Mobile | Content loading state. |
| PunchButton | Web, Mobile, Kiosk | Punch in/out action with disabled/loading states. |
| CameraCapture | Mobile, Kiosk | Selfie/face capture wrapper. |
| GPSPermissionPrompt | Mobile | Runtime location permission request. |
| OfflineQueueBadge | Mobile, Kiosk | Pending sync count and sync status. |
| ConfirmDialog | Web | Review/approve/reject confirmation. |

## 8. Form Validation Standards

* Required fields show inline validation before submit.
* Server validation errors map to field errors where possible.
* Use consistent enum labels from API contracts.
* Dates and times must be timezone-aware.
* Employee code, tenant code, device ID, and kiosk ID must trim whitespace.
* Latitude/longitude validation must run before API submit when manually entered.
* OTP accepts digits only and supports paste.
* File uploads validate type and size before upload.
* Forms must prevent double-submit while request is pending.
* Destructive or security-sensitive actions require confirmation and remarks where backend requires them.

## 9. API Integration Pattern

* Use a centralized API client with base URL, auth headers, `X-API-Version: v1`, `X-Client-Type`, and request ID.
* Use server-state caching for list/detail/dashboard data.
* Keep form drafts as local component state until submit.
* Use optimistic updates only for low-risk UI state. Do not optimistically approve attendance exceptions or create attendance punches.
* Normalize errors into the common API error format.
* On `AUTH_REQUIRED`, redirect to login or refresh token once.
* On `TENANT_SUSPENDED`, logout and show tenant status message.
* On `PERMISSION_DENIED`, show access-denied state and refresh Permission Bootstrap.
* On idempotent mobile/kiosk retries, reuse the same `idempotencyKey`.

## 10. State Management Notes

| State Area | Recommended Storage |
| --- | --- |
| Auth session | Web: secure cookie/session; Mobile: secure storage. |
| Permission bootstrap | App-level store, refreshed on login/role change/403. |
| Tenant/company/branch scope | App-level store from backend scope only. |
| List filters/pagination | URL query params on web; local screen state on mobile. |
| Form draft | Local component state; optional autosave later. |
| Punch state | Server state from Attendance Status; do not trust local-only state. |
| Offline queue | Mobile/kiosk encrypted local storage where enabled. |
| Kiosk token | Secure device storage; never shown after activation except one-time activation response. |

## 11. Responsive Design Rules

* Web admin screens are desktop-first but must work on tablet width.
* Tables collapse to filterable stacked rows below tablet width.
* Forms use single column on narrow viewports and two columns on desktop where it improves scanning.
* Primary actions stay visible without overlapping content.
* Kiosk screens must be touch-first, high contrast, and usable from a tablet stand distance.
* Mobile punch flow must be optimized for one-hand use and low bandwidth.
* Avoid decorative layouts; this is an operational HRMS interface.

## 12. Accessibility Basics

* All interactive elements must be keyboard accessible on web.
* Inputs require visible labels and programmatic labels.
* Error messages must be associated with fields.
* Status changes such as OTP sent, punch success, and sync failure must be announced through accessible status regions on web.
* Do not rely only on color for success/failure/pending states.
* Focus moves to the first invalid field after failed validation.
* Dialogs trap focus and return focus to triggering button.
* Minimum contrast should meet WCAG 2.1 AA.
* Kiosk buttons must have large tap targets and clear focus/pressed states.

## 13. Web + Mobile Screen Dependency Map

```text
VS-01 Auth and Permission Bootstrap
  Web Login / OTP / Forgot Password
  Mobile Login / OTP
  Role-based Dashboard Shell

VS-02 Tenant and Company Setup
  Tenant/Company Setup
  Branch/Location Setup

VS-03 Employee Setup
  Employee List and Employee Form
  Employee Home depends on employee-user link

VS-04 Attendance Policy Setup
  Attendance Policy Setup
  Mobile/Web/Kiosk punch screens depend on active policy

VS-05 Mobile/Web Punch
  Web Punch In/Out
  Employee Home
  Mobile Punch In/Out
  GPS Permission and Selfie Capture
  Attendance Status/History

VS-06 Kiosk Device Setup
  Kiosk Device Setup and Binding
  Kiosk Activation/Binding

VS-07 Shared Kiosk Attendance
  Shared Kiosk Attendance Screen
  Kiosk Success/Failure Screen
  Offline Sync Status

VS-08 Dashboard and Exceptions
  Admin/HR Dashboard
  Attendance Exception Review
```

## 14. Screen Contracts

### 14.1 Login / OTP / Forgot Password

| Field | Contract |
| --- | --- |
| Screen name | Login / OTP / Forgot Password |
| Platform | Web |
| Purpose | Authenticate web users, support OTP verification, and initiate password recovery. |
| User roles allowed | Public entry for all configured web users; redirects by role after login. |
| Route/path suggestion | `/login`, `/otp`, `/forgot-password` |
| Related APIs | Login, Request OTP, Verify OTP, Logout where switching user |
| Related DocTypes | User, Role, User Permission, Tenant, Login Attempt Log, OTP Log, User Session |
| Input fields | Identifier, password, OTP, mobile/email, new password only in reset flow if enabled. |
| Display data | Tenant/product name, form state, masked OTP destination, resend timer, lockout message. |
| Buttons/actions | Login, request OTP, verify OTP, resend OTP, forgot password, back to login. |
| Validation rules | Identifier and password required; OTP digits only; prevent resend before timer; password policy from auth config. |
| Loading/empty/error states | Button loading; invalid credentials; expired OTP; rate limited; tenant suspended; network retry. |
| Permission rules | No app route access until login and permission bootstrap succeed. |
| Success behavior | Store web session, call Permission Bootstrap, redirect to first permitted dashboard route. |
| Edge cases | Tenant suspended after credentials valid; user has no role; OTP provider failure; account locked. |
| Acceptance criteria | Valid user logs in; invalid attempt is shown and logged; OTP flow works; disabled/suspended users cannot enter app. |

### 14.2 Role-based Dashboard Shell

| Field | Contract |
| --- | --- |
| Screen name | Role-based Dashboard Shell |
| Platform | Web |
| Purpose | Provide authenticated layout, navigation, permission gating, and scope display. |
| User roles allowed | All authenticated users. |
| Route/path suggestion | `/app` |
| Related APIs | Permission Bootstrap, Logout, Refresh Session if used |
| Related DocTypes | User, Role, User Permission, Employee, Tenant, Company |
| Input fields | None except optional company/branch scope selector for users with multiple scopes. |
| Display data | User name, roles, tenant/company/branch scope, permitted navigation, session state. |
| Buttons/actions | Open module, switch scope where allowed, logout. |
| Validation rules | Selected scope must be returned by Permission Bootstrap. |
| Loading/empty/error states | Permission loading skeleton; no-role access denied; session expired; tenant suspended. |
| Permission rules | Navigation and routes derive from backend permission bootstrap; direct route access blocked. |
| Success behavior | Shell renders only allowed modules and persists current allowed scope. |
| Edge cases | Role changed during session; company scope removed; user has multiple roles. |
| Acceptance criteria | User sees only allowed menu items; direct unauthorized route shows access denied; logout clears session. |

### 14.3 Tenant/Company Setup

| Field | Contract |
| --- | --- |
| Screen name | Tenant/Company Setup |
| Platform | Web |
| Purpose | Create tenant, configure company profile, and view setup checklist. |
| User roles allowed | Super Admin for tenant creation; Tenant Admin for own company setup; HR Admin read if configured. |
| Route/path suggestion | `/app/tenant/setup` |
| Related APIs | Create Tenant, Update Tenant Status, Tenant Setup Status, Company Create/Update |
| Related DocTypes | Tenant, Company, User, Role, User Permission, Audit Log |
| Input fields | Tenant code/name/status, company name, abbreviation, country, currency, tenant admin email/mobile. |
| Display data | Tenant status, setup checklist, company profile summary, pending setup items. |
| Buttons/actions | Create tenant, save company, activate/suspend tenant, refresh checklist. |
| Validation rules | Tenant code unique; company required fields; suspend requires reason; admin email/mobile valid. |
| Loading/empty/error states | New tenant empty checklist; duplicate tenant; company save failure; permission denied. |
| Permission rules | Tenant Admin cannot create other tenants; Super Admin limited to tenant metadata by default. |
| Success behavior | Checklist updates and next setup action becomes available. |
| Edge cases | Tenant created but company incomplete; existing admin email; suspended tenant sessions revoked. |
| Acceptance criteria | Tenant/company can be created; duplicate tenant blocked; setup status visible and scoped. |

### 14.4 Branch/Location Setup

| Field | Contract |
| --- | --- |
| Screen name | Branch/Location Setup |
| Platform | Web |
| Purpose | Configure branch and GPS/kiosk work locations. |
| User roles allowed | Tenant Admin, HR Admin; Kiosk Admin scoped read where needed. |
| Route/path suggestion | `/app/branches` |
| Related APIs | Branch List/Create, Location List/Create, Tenant Setup Status |
| Related DocTypes | Branch, Location, Company, Tenant, Audit Log |
| Input fields | Branch name/status; location name, branch, latitude, longitude, allowed radius, status. |
| Display data | Branch list, location list, active/inactive status, GPS radius, linked company. |
| Buttons/actions | Add branch, edit branch, add location, edit location, deactivate where allowed. |
| Validation rules | Branch/company/tenant match; valid coordinates; positive GPS radius; inactive branch cannot accept new kiosk binding. |
| Loading/empty/error states | No branches yet; invalid coordinates; duplicate branch; permission denied. |
| Permission rules | Branch/location list filtered to user scope. |
| Success behavior | New branch/location appears in lists and becomes available to employee/kiosk/policy screens. |
| Edge cases | Deactivating branch with active employees/kiosks; GPS radius changed after attendance captured. |
| Acceptance criteria | Branch/location CRUD works within scope; invalid cross-company location blocked. |

### 14.5 Employee List and Employee Form

| Field | Contract |
| --- | --- |
| Screen name | Employee List and Employee Form |
| Platform | Web |
| Purpose | Search, create, update, and link employees to organization, user account, and role. |
| User roles allowed | HR Admin full; Tenant Admin view/configured access; Payroll Admin/Auditor read; Manager team read; Employee own profile if reused. |
| Route/path suggestion | `/app/employees`, `/app/employees/new`, `/app/employees/:id` |
| Related APIs | Employee Search/List, Employee Create/Update, Branch/Location lists, Permission Bootstrap |
| Related DocTypes | Employee, User, Role, User Permission, Company, Branch, Location, Department, Designation, Audit Log |
| Input fields | Employee code/name, company, branch, location, department, designation, manager, status, sales flag, email/mobile, create user flag. |
| Display data | Employee table, filters, profile details, user link status, role assignment status. |
| Buttons/actions | Search, filter, create employee, save, link user, deactivate, reset form. |
| Validation rules | Employee code unique in tenant/company; active employee requires branch/location/department/designation; valid manager scope. |
| Loading/empty/error states | Empty employee list; duplicate employee; invalid manager; user email exists; permission denied. |
| Permission rules | List and form data filtered by role/scope; Employee role cannot browse all employees. |
| Success behavior | Employee saved, audit created, list refreshes, user roles assigned when requested. |
| Edge cases | Existing user email; sales designation toggled; manager outside branch; branch deactivated. |
| Acceptance criteria | HR can create/search employees; duplicate code blocked; employee-user role link works. |

### 14.6 Attendance Policy Setup

| Field | Contract |
| --- | --- |
| Screen name | Attendance Policy Setup |
| Platform | Web |
| Purpose | Configure allowed channels, GPS/selfie/face, duplicate window, and offline rules. |
| User roles allowed | Tenant Admin, HR Admin; Auditor read. |
| Route/path suggestion | `/app/attendance/policy` |
| Related APIs | Attendance Policy Upsert, Active Attendance Policy, Branch/Location lists |
| Related DocTypes | Attendance Policy, Company, Branch, Location, Department, Employee, Audit Log |
| Input fields | Policy name, scope type, company/branch/location/department/category, allow web/mobile/kiosk, GPS required, selfie required, face required, duplicate window, offline flags, effective date, status. |
| Display data | Active policy list, scope, channel flags, validation flags, effective date, status. |
| Buttons/actions | Create policy, save draft, activate, deactivate, resolve/test policy. |
| Validation rules | At least one channel enabled; offline max hours required if offline enabled; only one active policy per exact scope/effective date. |
| Loading/empty/error states | No policy configured; conflicting policy; incomplete policy; permission denied. |
| Permission rules | Only authorized admins configure policy in their scope. |
| Success behavior | Policy becomes available to web/mobile/kiosk punch flows. |
| Edge cases | Conflicting company/branch policies; policy changed while kiosk online; deactivation leaves no active policy. |
| Acceptance criteria | HR configures valid policy; invalid policy blocked; changes audited. |

### 14.7 Web Punch In/Out

| Field | Contract |
| --- | --- |
| Screen name | Web Punch In/Out |
| Platform | Web |
| Purpose | Allow employee to punch in/out from browser where web channel is enabled. |
| User roles allowed | Employee, Sales Employee if web allowed; Manager/HR only if own employee access exists. |
| Route/path suggestion | `/app/attendance/punch` |
| Related APIs | Attendance Status, Active Attendance Policy, Web/Mobile Punch, GPS Validate if policy requires |
| Related DocTypes | Employee, Attendance Policy, Employee Checkin, GPS Validation Log, Face Verification Log, Attendance Exception |
| Input fields | Punch type derived or selectable, optional browser GPS permission, optional selfie file if supported. |
| Display data | Current status, last punch, policy requirements, open exception count. |
| Buttons/actions | Punch in, punch out, retry validation, view status. |
| Validation rules | Web channel must be enabled; employee active; required GPS/selfie captured before submit. |
| Loading/empty/error states | Loading status; policy not found; channel disabled; GPS denied; duplicate punch; exception created. |
| Permission rules | Employee can punch own attendance only. |
| Success behavior | Status updates to punched in/out and checkin reference is shown. |
| Edge cases | Browser GPS unsupported; duplicate click; session expires during punch. |
| Acceptance criteria | Employee can punch through enabled web channel; disabled channel blocks; duplicate handled. |

### 14.8 Kiosk Device Setup and Binding

| Field | Contract |
| --- | --- |
| Screen name | Kiosk Device Setup and Binding |
| Platform | Web |
| Purpose | Register kiosk device, bind to branch/location, configure/activate/deactivate kiosk. |
| User roles allowed | Kiosk Admin, Tenant Admin, HR Admin; Auditor read. |
| Route/path suggestion | `/app/kiosk/devices` |
| Related APIs | Register Kiosk, Bind Kiosk, Activate/Deactivate Kiosk, Kiosk Status, Branch/Location lists |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Kiosk Policy, Branch, Location, Audit Log |
| Input fields | Device name, device ID/fingerprint, platform, app version, company, branch, location, effective date, activation reason. |
| Display data | Kiosk list, device status, binding, policy summary, last seen, pending sync count. |
| Buttons/actions | Register, bind, activate, deactivate, rotate token later if approved, refresh status. |
| Validation rules | Device ID unique; binding required before activation; branch/location active and same tenant/company. |
| Loading/empty/error states | No kiosk registered; unbound kiosk; inactive kiosk; duplicate device; pending offline records warning. |
| Permission rules | Kiosk Admin limited to assigned branch/location. |
| Success behavior | Activated kiosk receives one-time token and appears active in dashboard/status. |
| Edge cases | Token lost after activation; rebinding with unsynced records; device replacement. |
| Acceptance criteria | Kiosk registered, bound, activated, and blocked when inactive/unbound. |

### 14.9 Attendance Exception Review

| Field | Contract |
| --- | --- |
| Screen name | Attendance Exception Review |
| Platform | Web |
| Purpose | Review GPS, selfie/face, duplicate, kiosk, device, and offline sync exceptions. |
| User roles allowed | HR Admin, Tenant Admin escalation, Reporting Manager for team if configured, Auditor read. |
| Route/path suggestion | `/app/exceptions` |
| Related APIs | Attendance Exception List, Attendance Exception Review |
| Related DocTypes | Attendance Exception, Employee Checkin, Attendance, GPS Validation Log, Face Verification Log, Kiosk Attendance Log, Audit Log |
| Input fields | Filters: date, employee, branch, source, exception type, status; review action, remarks, optional attendance update. |
| Display data | Exception list, employee, source, status, reason, linked logs, reviewer history. |
| Buttons/actions | Filter, view detail, mark reviewed, approve, reject, resolve. |
| Validation rules | Remarks required for approve/reject; closed exceptions cannot be changed without escalation; reviewer scope required. |
| Loading/empty/error states | No exceptions; filtered empty; concurrent review conflict; permission denied; sensitive image access blocked. |
| Permission rules | HR by assigned scope; Manager team only; Auditor read-only. |
| Success behavior | Exception status updates, audit created, affected attendance/checkin refreshed. |
| Edge cases | Two reviewers act at same time; linked checkin already exists; face image access restricted. |
| Acceptance criteria | Authorized reviewer can act; unauthorized access blocked; all actions audited. |

### 14.10 Admin/HR Dashboard

| Field | Contract |
| --- | --- |
| Screen name | Admin/HR Dashboard |
| Platform | Web |
| Purpose | Show Phase 1 operational summary for setup, employee, attendance, kiosk, and exceptions. |
| User roles allowed | Super Admin, Tenant Admin, HR Admin, Manager where configured. |
| Route/path suggestion | `/app/dashboard` |
| Related APIs | Dashboard Summary, Tenant Setup Status, Permission Bootstrap |
| Related DocTypes | Tenant, Company, Employee, Attendance, Employee Checkin, Kiosk Device, Attendance Exception |
| Input fields | Date, company, branch filters where scope allows. |
| Display data | Setup status, active employee count, attendance present/pending, exception count, kiosk active/inactive/pending sync. |
| Buttons/actions | Change date/filter, open setup, open employees, open kiosk, open exceptions. |
| Validation rules | Filters must be inside permission scope; date valid. |
| Loading/empty/error states | Skeleton cards; empty tenant setup checklist; partial data error; access denied. |
| Permission rules | Cards and quick actions appear only if allowed; counts scoped server-side. |
| Success behavior | Dashboard cards load under agreed performance target and link to allowed modules. |
| Edge cases | No employees yet; no kiosk configured; branch-scoped HR; slow aggregation. |
| Acceptance criteria | Role-scoped dashboard visible; cross-tenant data never appears; quick actions follow permissions. |

### 14.11 Mobile Login / OTP

| Field | Contract |
| --- | --- |
| Screen name | Mobile Login / OTP |
| Platform | Mobile |
| Purpose | Authenticate employee, sales employee, or manager and establish mobile session. |
| User roles allowed | Employee, Sales Employee, Reporting Manager; admin mobile access later if approved. |
| Route/path suggestion | `AuthStack/Login`, `AuthStack/OTP` |
| Related APIs | Login, Request OTP, Verify OTP, Refresh Session, Permission Bootstrap |
| Related DocTypes | User, Employee, Employee Device, OTP Log, User Session, Login Attempt Log |
| Input fields | Identifier, password or OTP, device ID/fingerprint metadata. |
| Display data | Login status, masked OTP destination, resend timer, device approval state. |
| Buttons/actions | Login, request OTP, verify OTP, resend OTP, forgot password, biometric unlock if enabled later. |
| Validation rules | Identifier required; OTP digits; mobile channel enabled; device policy checked after login. |
| Loading/empty/error states | Auth loading; invalid credentials; OTP expired; device not approved; tenant suspended; offline login not allowed. |
| Permission rules | Mobile must not expose another employee's data; device binding enforced by backend. |
| Success behavior | Store token securely, load permission bootstrap, navigate to Employee Home. |
| Edge cases | Device reset invalidates session; role removed; app resumes with expired token. |
| Acceptance criteria | Mobile user logs in; token refresh works; unauthorized device blocked where policy requires. |

### 14.12 Employee Home

| Field | Contract |
| --- | --- |
| Screen name | Employee Home |
| Platform | Mobile |
| Purpose | Show personal attendance readiness, current state, and quick actions. |
| User roles allowed | Employee, Sales Employee, Reporting Manager for own home. |
| Route/path suggestion | `MainTabs/Home` |
| Related APIs | Permission Bootstrap, Attendance Status, Active Attendance Policy |
| Related DocTypes | Employee, Attendance Policy, Employee Checkin, Attendance Exception |
| Input fields | None; optional date if status preview changes. |
| Display data | Employee name, current punch status, active policy requirements, last punch, pending sync, open exceptions. |
| Buttons/actions | Punch, view history/status, sync pending records, logout. |
| Validation rules | Current employee context required; active policy check before punch. |
| Loading/empty/error states | Loading home; no active policy; employee inactive; device pending approval; offline banner. |
| Permission rules | Own data only. Manager team views should use separate later screen or scoped history. |
| Success behavior | Clear next action: punch in/out or resolve required setup state. |
| Edge cases | Policy changes while app is open; offline state; tenant suspended. |
| Acceptance criteria | Employee sees only own status and can start punch only when policy allows. |

### 14.13 Mobile Punch In/Out

| Field | Contract |
| --- | --- |
| Screen name | Mobile Punch In/Out |
| Platform | Mobile |
| Purpose | Capture employee attendance from approved mobile device. |
| User roles allowed | Employee, Sales Employee. |
| Route/path suggestion | `MainTabs/Punch` |
| Related APIs | Attendance Status, Active Attendance Policy, GPS Validate, Selfie Upload, Face/Selfie Verify, Web/Mobile Punch |
| Related DocTypes | Employee, Employee Device, Attendance Policy, Employee Checkin, GPS Validation Log, Face Verification Log, Attendance Exception |
| Input fields | Punch type, GPS coordinates, selfie file, idempotency key generated by app. |
| Display data | Current punch state, validation checklist, GPS accuracy, selfie preview, policy requirements. |
| Buttons/actions | Start punch, capture GPS, capture selfie, submit punch, retry validation, cancel. |
| Validation rules | Approved device; source mobile enabled; required GPS/selfie complete; idempotency key per attempt. |
| Loading/empty/error states | GPS loading; camera loading; permission denied; upload failed; duplicate punch; exception created. |
| Permission rules | Employee can punch own attendance only. |
| Success behavior | Show success state, update attendance status, clear transient selfie/GPS state. |
| Edge cases | GPS poor accuracy; camera denied; network drops after upload; duplicate tap. |
| Acceptance criteria | Mobile punch records accepted checkin or clear exception; unauthorized device blocked. |

### 14.14 GPS Permission and Selfie Capture

| Field | Contract |
| --- | --- |
| Screen name | GPS Permission and Selfie Capture |
| Platform | Mobile |
| Purpose | Collect required GPS and selfie/face proof for attendance. |
| User roles allowed | Employee, Sales Employee. |
| Route/path suggestion | `PunchFlow/GPS`, `PunchFlow/Selfie` |
| Related APIs | GPS Validate, Selfie Upload, Face/Selfie Verify |
| Related DocTypes | GPS Validation Log, Face Verification Log, File, Employee, Attendance Policy |
| Input fields | Runtime GPS permission, camera permission, captured coordinates, selfie image. |
| Display data | Permission rationale, GPS accuracy, capture preview, verification status. |
| Buttons/actions | Allow permission, retry GPS, capture selfie, retake, continue, cancel. |
| Validation rules | GPS accuracy required by policy; file type/size; verification method allowed by policy. |
| Loading/empty/error states | Permission denied; GPS timeout; poor accuracy; camera unavailable; upload error; verification failed. |
| Permission rules | Capture allowed only for current employee and current punch attempt. |
| Success behavior | Return validation log/file references to Mobile Punch flow. |
| Edge cases | User grants approximate location only; camera hardware failure; offline capture if allowed. |
| Acceptance criteria | Required GPS/selfie captured or punch blocked/exception path clearly shown. |

### 14.15 Attendance Status/History

| Field | Contract |
| --- | --- |
| Screen name | Attendance Status/History |
| Platform | Mobile |
| Purpose | Show current and recent attendance status for employee. |
| User roles allowed | Employee, Sales Employee; Manager for team status if configured later. |
| Route/path suggestion | `MainTabs/Status` |
| Related APIs | Attendance Status |
| Related DocTypes | Employee Checkin, Attendance, Attendance Exception |
| Input fields | Date range filter optional. |
| Display data | Current state, last punch, daily records, pending exceptions, sync status. |
| Buttons/actions | Refresh, filter date, open exception status, retry sync if enabled. |
| Validation rules | Date range reasonable; employee defaults to authenticated employee. |
| Loading/empty/error states | No attendance yet; offline cached view; server unavailable; access denied. |
| Permission rules | Own data only for employee/sales employee. |
| Success behavior | Status/history refreshes and matches latest server state. |
| Edge cases | Offline records pending; approved exception changes status; timezone boundary. |
| Acceptance criteria | Employee can view own attendance status/history; cannot access another employee. |

### 14.16 Kiosk Activation/Binding

| Field | Contract |
| --- | --- |
| Screen name | Kiosk Activation/Binding |
| Platform | Kiosk |
| Purpose | Initialize kiosk app using device token and show binding readiness. |
| User roles allowed | Kiosk Admin during setup; kiosk device token after activation. |
| Route/path suggestion | `KioskStack/Activation` |
| Related APIs | Kiosk Status |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Kiosk Policy |
| Input fields | Device token or activation token if manual entry is used; admin PIN for local controls. |
| Display data | Device status, bound company/branch/location, policy, online/offline state. |
| Buttons/actions | Validate token, refresh status, enter kiosk mode, admin exit. |
| Validation rules | Kiosk must be registered, active, bound, and have active policy. |
| Loading/empty/error states | Token invalid; kiosk inactive; kiosk unbound; policy missing; network unavailable. |
| Permission rules | Kiosk token can read own kiosk status only. |
| Success behavior | App enters locked shared attendance screen. |
| Edge cases | Token rotated; device deactivated; binding changed while app is open. |
| Acceptance criteria | Only active bound kiosk can enter attendance mode. |

### 14.17 Shared Kiosk Attendance Screen

| Field | Contract |
| --- | --- |
| Screen name | Shared Kiosk Attendance Screen |
| Platform | Kiosk |
| Purpose | Allow multiple employees to mark attendance sequentially from shared registered kiosk. |
| User roles allowed | Employees and Sales Employees through active kiosk device; no personal login. |
| Route/path suggestion | `KioskStack/Attendance` |
| Related APIs | Kiosk Status, Kiosk Punch, Selfie Upload, Face/Selfie Verify |
| Related DocTypes | Kiosk Device, Kiosk Device Binding, Kiosk Attendance Log, Employee, Employee Checkin, Face Verification Log, Attendance Exception |
| Input fields | Employee code if fallback enabled, selfie/face capture, punch type if not auto-derived. |
| Display data | Ready state, branch/location, employee identification prompt, verification progress, offline indicator. |
| Buttons/actions | Start capture, enter employee code, capture selfie, punch, retry, admin PIN exit. |
| Validation rules | Kiosk active/bound; employee active; verification method allowed; duplicate window enforced by backend. |
| Loading/empty/error states | Camera unavailable; employee not found; verification failed; kiosk inactive; offline queue enabled/full. |
| Permission rules | Kiosk can submit only for bound tenant/company/branch/location. |
| Success behavior | Creates kiosk attendance log/checkin or exception and moves to success/failure screen. |
| Edge cases | Consecutive employees; same employee retries; network drops mid-punch; branch mismatch. |
| Acceptance criteria | Active kiosk captures multiple employees; failed verification does not approve attendance; screen resets after each attempt. |

### 14.18 Kiosk Success/Failure Screen

| Field | Contract |
| --- | --- |
| Screen name | Kiosk Success/Failure Screen |
| Platform | Kiosk |
| Purpose | Show clear result after kiosk attendance attempt and return to ready state. |
| User roles allowed | Employees through kiosk device. |
| Route/path suggestion | `KioskStack/Result` |
| Related APIs | Kiosk Punch result, Kiosk Status if retry needed |
| Related DocTypes | Kiosk Attendance Log, Employee Checkin, Attendance Exception |
| Input fields | None, except retry action. |
| Display data | Success/failure status, employee name/code where safe, punch type/time, reason, next action. |
| Buttons/actions | Done, retry, call admin, sync later if offline. |
| Validation rules | Do not expose another employee's sensitive details; failure reason must be user-safe. |
| Loading/empty/error states | Result missing; sync pending; server confirmation delayed. |
| Permission rules | Kiosk only displays result for current attempt and clears it after timeout. |
| Success behavior | Auto-return to ready screen after short timeout. |
| Edge cases | Offline success pending sync; duplicate punch failure; exception created. |
| Acceptance criteria | User sees understandable result; kiosk resets for next employee. |

### 14.19 Offline Sync Status

| Field | Contract |
| --- | --- |
| Screen name | Offline Sync Status |
| Platform | Kiosk/Mobile |
| Purpose | Show and manage pending offline attendance sync records where offline mode is enabled. |
| User roles allowed | Kiosk Admin on kiosk; Employee/Sales Employee own mobile pending records; HR Admin from web dashboard if later linked. |
| Route/path suggestion | `KioskStack/SyncStatus`, `Utility/OfflineSync` |
| Related APIs | Kiosk Offline Sync, Kiosk Status, Attendance Status |
| Related DocTypes | Kiosk Attendance Log, Employee Checkin, Attendance Exception, Audit Log |
| Input fields | None for auto-sync; optional manual sync trigger. |
| Display data | Pending count, last sync time, failed records count, conflict count, offline window warning. |
| Buttons/actions | Sync now, retry failed, view safe summary, contact admin. |
| Validation rules | Only sync records from current device; preserve idempotency keys; batch size limit. |
| Loading/empty/error states | No pending records; syncing; network unavailable; conflict created; offline window exceeded. |
| Permission rules | Kiosk token syncs own queue only; mobile user syncs own records only. |
| Success behavior | Pending count decreases; per-record results shown; conflicts become exceptions. |
| Edge cases | Kiosk deactivated while offline; branch binding changed; duplicate idempotency replay. |
| Acceptance criteria | Offline records sync without duplicates; conflicts are visible and reviewable. |

## 15. Final Recommendation

Implement the screens in vertical slices:

1. Auth and permission bootstrap.
2. Tenant/company/branch/location setup.
3. Employee setup.
4. Attendance policy setup.
5. Web/mobile punch with GPS/selfie.
6. Kiosk device setup and activation.
7. Shared kiosk attendance and offline sync.
8. Dashboard and exception review.

The frontend and mobile teams should consume the Phase 1 API contracts directly and keep route permissions, form fields, validation messages, and state transitions aligned with backend behavior. No Phase 1 screen should rely on client-side filtering as a security boundary.
