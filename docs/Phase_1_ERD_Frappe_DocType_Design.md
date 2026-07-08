# Phase 1 ERD / Frappe DocType Design Document

## 1. Document Overview

This document defines the Phase 1 entity relationship model and Frappe DocType design for the Modern SaaS HRMS platform. It is based on the BRD, Phase-wise Development Plan, Phase 1 Detailed BPMN Flow Document, Phase 1 SRS, Technical Requirement Document, Auth/Role/Permission document, and the latest chat handoff.

The design is written as Frappe DocTypes, not raw SQL tables. MariaDB storage, naming, indexes, permissions, and validation should be implemented through Frappe DocType metadata, controllers, hooks, fixtures, permission query conditions, and service-layer validations.

| Item | Value |
| --- | --- |
| Project | Modern SaaS HRMS |
| Backend | Frappe Framework / ERPNext HRMS |
| Database | MariaDB through Frappe DocTypes |
| Frontend | Vue.js + Tailwind CSS |
| Mobile/Kiosk | React Native or Flutter, recommended React Native for MVP |
| Architecture | Single Frappe site with logical multi-tenant isolation for MVP |
| Recommended custom app | `hrms_saas` |
| Phase | Phase 1 foundation, attendance, kiosk, and exception review |
| Accuracy probability | 88% based on available documents |

Accuracy is not 100% because the tenant model, mobile token strategy, OTP provider, kiosk hardware, kiosk verification method, offline sync limit, GPS radius, face/selfie retention policy, and production load still require client sign-off.

## 2. Source Alignment Notes

The BRD originally treated shared kiosk attendance as unconfirmed. Later documents and client clarification supersede that assumption. This document treats kiosk attendance as confirmed Phase 1 scope.

Phase 1 includes:

* Authentication and login.
* Role-based access.
* Tenant and company setup.
* Employee setup.
* Basic attendance setup.
* Web and mobile punch in/out.
* GPS and selfie/face validation.
* Kiosk device setup.
* Shared kiosk attendance for multiple employees on one registered device.
* Admin/HR dashboard basics.
* Attendance exception review.

## 3. ERD Overview and Design Assumptions

### 3.1 Core Design Assumptions

| Area | Assumption |
| --- | --- |
| Tenant model | Single Frappe site with logical tenant isolation using a custom `Tenant` DocType. |
| Company model | Reuse ERPNext `Company`; link it to `Tenant`. One tenant may have one or more companies if the SaaS plan allows. |
| Branch/location model | Reuse ERPNext `Branch` where available. Use a controlled `Location` or custom `Work Location` pattern for attendance geo-fence coordinates. This document names it `Location` to match existing project docs. |
| Employee model | Reuse ERPNext/Frappe HR `Employee` and extend it using custom fields where needed. |
| Attendance source | Reuse `Employee Checkin` for canonical raw punch records where possible. Store rich channel-specific metadata in custom validation and kiosk logs. |
| Daily attendance | Reuse ERPNext/Frappe HR `Attendance` for daily attendance result/status. |
| Mobile device binding | Use custom `Employee Device`. |
| Kiosk device binding | Use custom `Kiosk Device`, `Kiosk Device Binding`, and `Kiosk Policy`. |
| GPS/selfie | Store metadata and validation outcome in custom logs. Store files using Frappe `File` with restricted access. |
| Exceptions | Store reviewable attendance problems in `Attendance Exception`. |
| Audit | Use Frappe `Version` and `Activity Log` for standard change trace, plus custom `Audit Log` for security-sensitive business events. |

### 3.2 Design Principles

* Reuse standard DocTypes before creating custom DocTypes.
* Store tenant/company context on every custom business DocType.
* Prefer links to standard `Employee Checkin` and `Attendance` instead of duplicating their responsibilities.
* Keep raw punch events immutable after creation except controlled status fields.
* Keep GPS, selfie, kiosk, and exception records auditable and queryable.
* Use service-layer validation for tenant isolation, employee status, device authorization, duplicate punch checks, GPS radius checks, and kiosk state.
* Use idempotency keys for mobile/kiosk offline sync.

## 4. Standard Frappe/ERPNext DocTypes to Reuse

| DocType | Purpose in Phase 1 | Reuse Notes |
| --- | --- | --- |
| `User` | Login identity for web/mobile users. | Extend with custom fields only if required for tenant bootstrap; prefer linking through Employee and User Permission. |
| `Role` | Role-based access control. | Create project roles through fixtures. |
| `User Permission` | Record-level restriction by Company, Branch, Location, Department, Employee. | Required for tenant/company/branch isolation. |
| `Company` | Company master. | Add `tenant` custom link field if not available. |
| `Branch` | Branch master. | Add `tenant`, `company`, and optional default `location`. |
| `Location` | Work/kiosk/GPS location. | If standard ERPNext Location is unsuitable, create custom `Work Location`; keep API label as Location. |
| `Department` | Department master. | Reuse; enforce company/tenant context. |
| `Designation` | Designation master. | Reuse; optionally add sales/field flags through custom fields. |
| `Employee` | Employee master. | Reuse; add tenant, branch, location, attendance policy, sales employee flag as custom fields if needed. |
| `Employee Checkin` | Canonical raw punch log. | Use for web/mobile/kiosk accepted punch events. Add custom fields for source and linked validation logs if required. |
| `Attendance` | Daily attendance result. | Generated or updated from checkins and approved exceptions. |
| `File` | Selfie/face image reference and documents. | Store sensitive images as private files with restricted permissions. |
| `Version` | Standard document change history. | Keep enabled on sensitive setup DocTypes. |
| `Activity Log` | Standard activity trace. | Use alongside custom audit for security events. |

## 5. Required Custom DocTypes

| DocType | Purpose | Phase 1 Status |
| --- | --- | --- |
| `Tenant` | SaaS tenant master and status. | Required |
| `Login Attempt Log` | Login success/failure audit. | Required if standard logs are insufficient |
| `OTP Log` | OTP generation, verification, expiry, retry tracking. | Required if OTP enabled |
| `User Session` | Extended web/mobile session and refresh-token tracking. | Recommended |
| `Employee Device` | Mobile device binding for employee/sales attendance. | Required |
| `Device Reset Request` | Controlled employee mobile device replacement workflow. | Recommended in Phase 1 foundation |
| `Attendance Policy` | Attendance channel, GPS, selfie, duplicate, offline settings. | Required |
| `GPS Validation Log` | GPS coordinate validation audit. | Required |
| `Face Verification Log` | Selfie/face validation audit. | Required |
| `Attendance Exception` | Review queue for failed validation, duplicate, kiosk, device, offline conflicts. | Required |
| `Kiosk Device` | Registered kiosk hardware/device. | Required |
| `Kiosk Device Binding` | Kiosk mapping to tenant, company, branch, and location. | Required |
| `Kiosk Policy` | Kiosk verification, admin PIN, offline, duplicate rules. | Required |
| `Kiosk Attendance Log` | Kiosk punch metadata and offline sync status. | Required |
| `Audit Log` | Sensitive business/security audit events. | Required |
| `Export Log` | Export/report download audit. | Later phase, design placeholder only |

## 6. DocType-wise Field Design

### 6.1 `Tenant`

| Attribute | Design |
| --- | --- |
| Purpose | SaaS tenant container for client organization isolation and status control. |
| Type | Custom DocType |
| Key fields | `tenant_code` Data, `tenant_name` Data, `status` Select, `primary_company` Link Company, `plan_name` Data/Link, `setup_status` Select, `go_live_date` Date, `support_access_enabled` Check |
| Mandatory fields | `tenant_code`, `tenant_name`, `status` |
| Linked DocTypes | Company, User, Audit Log |
| Validation rules | `tenant_code` unique; inactive/suspended tenant blocks login and transactional APIs; at least one Tenant Admin before activation. |
| Permission notes | Super Admin full access; Tenant Admin read own tenant; Auditor read as configured. |
| Audit/logging notes | Create `Audit Log` for create, activate, suspend, reactivate, support access changes. |

### 6.2 `User`

| Attribute | Design |
| --- | --- |
| Purpose | Standard Frappe login identity for web/mobile users. |
| Type | Standard DocType |
| Key fields | Existing fields plus optional custom `default_tenant`, `default_company`, `employee` if not already available through Employee/User link. |
| Mandatory fields | Standard Frappe required fields. |
| Linked DocTypes | Role, User Permission, Employee, Tenant, Login Attempt Log, User Session |
| Validation rules | User must be enabled; tenant/company must be active; user must have at least one valid role for portal access. |
| Permission notes | User self access limited; admins manage users within tenant/company scope. |
| Audit/logging notes | Use Version plus `Audit Log` for role changes, disabled/enabled changes, password reset, support access. |

### 6.3 `Role`

| Attribute | Design |
| --- | --- |
| Purpose | Defines project roles for screen/API/action access. |
| Type | Standard DocType |
| Key fields | `role_name`, `desk_access`, standard role metadata. |
| Mandatory fields | `role_name` |
| Linked DocTypes | User, DocPerm |
| Validation rules | Project roles should be maintained through fixtures to avoid environment drift. |
| Permission notes | Roles include Super Admin, Tenant Admin, HR Admin, Payroll Admin, Reporting Manager, Employee, Sales Employee, Kiosk Admin, Auditor, Support User. |
| Audit/logging notes | Role creation/permission changes must be audited. |

### 6.4 `User Permission`

| Attribute | Design |
| --- | --- |
| Purpose | Enforces record-level scope for company, branch, location, department, employee, and tenant-linked records. |
| Type | Standard DocType |
| Key fields | `user`, `allow`, `for_value`, `applicable_for`, `is_default` |
| Mandatory fields | Standard Frappe required fields. |
| Linked DocTypes | User, Company, Branch, Location, Department, Employee |
| Validation rules | Tenant users must have scoped User Permission records unless their role is explicitly platform-level. |
| Permission notes | Managed by Super Admin/Tenant Admin; HR can be delegated limited user scope setup. |
| Audit/logging notes | Permission additions/removals are sensitive and must create `Audit Log`. |

### 6.5 `Company`

| Attribute | Design |
| --- | --- |
| Purpose | Legal/company master for HRMS operations. |
| Type | Standard DocType |
| Key fields | Standard company fields plus custom `tenant` Link Tenant, `company_status` Select if needed. |
| Mandatory fields | Standard company required fields, `tenant` |
| Linked DocTypes | Tenant, Branch, Department, Employee, Attendance, Attendance Policy |
| Validation rules | Company must belong to active tenant; company abbreviation unique per site; business APIs must validate tenant/company match. |
| Permission notes | Tenant Admin configure; HR Admin view/edit within scope; Employee no direct access except derived profile context. |
| Audit/logging notes | Company setup and status changes audited. |

### 6.6 `Branch`

| Attribute | Design |
| --- | --- |
| Purpose | Branch/office unit used for employee assignment, kiosk binding, permissions, and reporting. |
| Type | Standard if available, otherwise Custom |
| Key fields | `branch_name` Data, `tenant` Link Tenant, `company` Link Company, `default_location` Link Location, `status` Select |
| Mandatory fields | `branch_name`, `tenant`, `company`, `status` |
| Linked DocTypes | Tenant, Company, Location, Employee, Kiosk Device Binding |
| Validation rules | Branch company must belong to same tenant; inactive branch cannot be used for new employee/kiosk bindings. |
| Permission notes | Tenant Admin/HR Admin manage; branch-scoped users view assigned branch only. |
| Audit/logging notes | Create audit for create, deactivate, default location changes. |

### 6.7 `Location`

| Attribute | Design |
| --- | --- |
| Purpose | Physical work location used for GPS validation and kiosk mapping. |
| Type | Standard if suitable, otherwise Custom `Work Location` |
| Key fields | `location_name` Data, `tenant` Link Tenant, `company` Link Company, `branch` Link Branch, `latitude` Float, `longitude` Float, `allowed_radius_meters` Int, `gps_required` Check, `status` Select |
| Mandatory fields | `location_name`, `tenant`, `company`, `branch`, `status` |
| Linked DocTypes | Tenant, Company, Branch, Attendance Policy, GPS Validation Log, Kiosk Device Binding |
| Validation rules | Latitude between -90 and 90; longitude between -180 and 180; radius positive when GPS validation is enabled. |
| Permission notes | Tenant Admin/HR Admin manage; branch/location-scoped users read only assigned locations. |
| Audit/logging notes | GPS coordinate/radius changes must be audited because they affect attendance approval. |

### 6.8 `Department`

| Attribute | Design |
| --- | --- |
| Purpose | Organization unit for employee hierarchy, filters, and policy scoping. |
| Type | Standard DocType |
| Key fields | Standard fields plus optional `tenant`, `company`. |
| Mandatory fields | Department name, company where configured. |
| Linked DocTypes | Company, Employee, Attendance Policy |
| Validation rules | Department company must match employee company when assigned. |
| Permission notes | Tenant Admin/HR Admin manage; managers/employees read as needed. |
| Audit/logging notes | Standard Version is sufficient unless policy-critical changes require custom audit. |

### 6.9 `Designation`

| Attribute | Design |
| --- | --- |
| Purpose | Job title/classification used for employee setup and sales employee identification. |
| Type | Standard DocType |
| Key fields | Standard fields plus optional `company`, `is_sales_designation` Check. |
| Mandatory fields | Designation name. |
| Linked DocTypes | Company, Employee |
| Validation rules | Sales Employee role can be derived from employee category/designation when configured. |
| Permission notes | Tenant Admin/HR Admin manage; read for others as needed. |
| Audit/logging notes | Audit sales classification changes if they affect attendance policy. |

### 6.10 `Employee`

| Attribute | Design |
| --- | --- |
| Purpose | Employee master for HRMS transactions, attendance, reporting, and user linkage. |
| Type | Standard DocType |
| Key fields | Standard employee fields plus custom `tenant` Link Tenant, `branch` Link Branch, `work_location` Link Location, `attendance_policy` Link Attendance Policy, `is_sales_employee` Check, `employee_category` Select, `user_id` Link User |
| Mandatory fields | `employee`, `employee_name`, `company`, `tenant`, `branch`, `work_location`, `department`, `designation`, `status` for active employees |
| Linked DocTypes | Tenant, Company, Branch, Location, Department, Designation, User, Attendance Policy, Employee Device, Employee Checkin, Attendance |
| Validation rules | Employee code unique within tenant/company; active employee requires company/branch/location; reporting manager must belong to same tenant/company unless explicitly allowed. |
| Permission notes | HR Admin full within scope; Manager team read; Employee own read; Auditor read as configured; Super Admin should not access sensitive employee data by default. |
| Audit/logging notes | Create audit for create, status change, user link, branch/location change, manager change, sales flag change. |

### 6.11 `Employee Device`

| Attribute | Design |
| --- | --- |
| Purpose | Registered mobile device for employee/sales attendance and mobile session trust. |
| Type | Custom DocType |
| Key fields | `employee` Link Employee, `user` Link User, `tenant` Link Tenant, `company` Link Company, `device_id` Data, `device_fingerprint_hash` Data, `platform` Select, `app_version` Data, `status` Select, `is_primary` Check, `approved_by` Link User, `approved_on` Datetime, `last_seen_on` Datetime |
| Mandatory fields | `employee`, `tenant`, `company`, `device_id`, `platform`, `status` |
| Linked DocTypes | Tenant, Company, Employee, User, Device Reset Request, Audit Log |
| Validation rules | Default one active primary device per employee; device hash unique among active devices; employee/company/tenant must match. |
| Permission notes | Employee can request/register own device; HR Admin/Tenant Admin approve/reject/reset; Auditor read. |
| Audit/logging notes | Audit register, approve, reject, deactivate, reset, primary device change. |

### 6.12 `Device Reset Request`

| Attribute | Design |
| --- | --- |
| Purpose | Workflow for replacing an employee mobile device. |
| Type | Custom DocType |
| Key fields | `employee` Link Employee, `tenant` Link Tenant, `company` Link Company, `old_device` Link Employee Device, `new_device_id` Data, `reason` Small Text, `status` Select, `requested_by` Link User, `approved_by` Link User, `approved_on` Datetime, `remarks` Small Text |
| Mandatory fields | `employee`, `tenant`, `company`, `reason`, `status`, `requested_by` |
| Linked DocTypes | Employee, Employee Device, User, Audit Log |
| Validation rules | Only one open reset request per employee; approval deactivates old device and allows new registration. |
| Permission notes | Employee create own; HR Admin/Tenant Admin approve/reject within scope. |
| Audit/logging notes | Audit every workflow transition. |

### 6.13 `Attendance Policy`

| Attribute | Design |
| --- | --- |
| Purpose | Configures attendance channels, validation requirements, duplicate rule, and offline behavior. |
| Type | Custom DocType |
| Key fields | `policy_name` Data, `tenant` Link Tenant, `company` Link Company, `scope_type` Select, `branch` Link Branch, `location` Link Location, `department` Link Department, `employee_category` Select, `allow_web` Check, `allow_mobile` Check, `allow_kiosk` Check, `gps_required` Check, `selfie_required` Check, `face_required` Check, `duplicate_window_minutes` Int, `allow_exception_on_failure` Check, `allow_mobile_offline` Check, `allow_kiosk_offline` Check, `offline_max_hours` Int, `status` Select, `effective_from` Date |
| Mandatory fields | `policy_name`, `tenant`, `company`, `scope_type`, `duplicate_window_minutes`, `status`, `effective_from` |
| Linked DocTypes | Tenant, Company, Branch, Location, Department, Employee |
| Validation rules | At least one channel must be enabled; GPS/selfie/face rules must be compatible with channel; offline max required when offline enabled; only one active policy per exact scope and effective period. |
| Permission notes | Tenant Admin/HR Admin create and update; Employee read effective policy through API only; Auditor read. |
| Audit/logging notes | Audit create, activate, deactivate, validation rule changes, duplicate window changes. |

### 6.14 `Employee Checkin`

| Attribute | Design |
| --- | --- |
| Purpose | Canonical accepted raw attendance punch record. |
| Type | Standard DocType |
| Key fields | Standard fields plus suggested custom `tenant` Link Tenant, `company` Link Company, `branch` Link Branch, `location` Link Location, `source` Select, `employee_device` Link Employee Device, `kiosk_device` Link Kiosk Device, `gps_validation_log` Link GPS Validation Log, `face_verification_log` Link Face Verification Log, `idempotency_key` Data, `validation_status` Select |
| Mandatory fields | `employee`, `time`, `log_type`, `tenant`, `company`, `source` |
| Linked DocTypes | Employee, Tenant, Company, Branch, Location, Employee Device, Kiosk Device, GPS Validation Log, Face Verification Log |
| Validation rules | Employee must be active; source must be allowed by active policy; idempotency key unique for offline/retry flows; duplicate punch rules enforced before insert or marked as exception depending on policy. |
| Permission notes | Employee create own via controlled API only; HR Admin read/update through attendance workflows; direct manual edits restricted. |
| Audit/logging notes | Accepted punches should be immutable. Corrections should use regularization/exception workflows and Audit Log. |

### 6.15 `Attendance`

| Attribute | Design |
| --- | --- |
| Purpose | Daily attendance result/status used by later shift, leave, payroll, and reports. |
| Type | Standard DocType |
| Key fields | Standard fields plus suggested `tenant`, `branch`, `location`, `source_summary`, `has_exception` if needed. |
| Mandatory fields | Standard required fields plus `tenant`, `company`, `employee`, `attendance_date`, `status`. |
| Linked DocTypes | Employee, Company, Tenant, Attendance Exception |
| Validation rules | Attendance date and employee unique per company unless ERPNext standard rules differ; updates from checkins must respect employee tenant/company. |
| Permission notes | HR Admin manage within scope; Manager team read/approve exceptions where configured; Employee own read. |
| Audit/logging notes | Attendance status changes and manual corrections audited. |

### 6.16 `GPS Validation Log`

| Attribute | Design |
| --- | --- |
| Purpose | Stores captured GPS metadata and validation result for mobile/web/kiosk punch. |
| Type | Custom DocType |
| Key fields | `tenant` Link Tenant, `company` Link Company, `employee` Link Employee, `source` Select, `employee_device` Link Employee Device, `kiosk_device` Link Kiosk Device, `location` Link Location, `latitude` Float, `longitude` Float, `accuracy_meters` Float, `captured_on` Datetime, `allowed_radius_meters` Int, `distance_meters` Float, `result` Select, `failure_reason` Small Text, `employee_checkin` Link Employee Checkin |
| Mandatory fields | `tenant`, `company`, `employee`, `source`, `latitude`, `longitude`, `accuracy_meters`, `captured_on`, `result` |
| Linked DocTypes | Tenant, Company, Employee, Location, Employee Device, Kiosk Device, Employee Checkin, Attendance Exception |
| Validation rules | Coordinates must be valid ranges; accuracy must be positive; if GPS required and result fails, punch must block or create exception based on policy. |
| Permission notes | HR Admin/Manager scoped read; Employee own limited read; raw coordinate access restricted; Auditor read. |
| Audit/logging notes | Treat as append-only log; do not edit coordinates after creation. |

### 6.17 `Face Verification Log`

| Attribute | Design |
| --- | --- |
| Purpose | Stores selfie/face capture reference and verification result. |
| Type | Custom DocType |
| Key fields | `tenant` Link Tenant, `company` Link Company, `employee` Link Employee, `source` Select, `verification_method` Select, `selfie_file` Link File, `face_template_ref` Data, `match_score` Float, `result` Select, `failure_reason` Small Text, `captured_on` Datetime, `employee_device` Link Employee Device, `kiosk_device` Link Kiosk Device, `employee_checkin` Link Employee Checkin |
| Mandatory fields | `tenant`, `company`, `employee`, `source`, `verification_method`, `result`, `captured_on` |
| Linked DocTypes | Tenant, Company, Employee, File, Employee Device, Kiosk Device, Employee Checkin, Attendance Exception |
| Validation rules | Selfie file required when selfie capture enabled; match score range 0 to 100 if face matching is used; failed required verification cannot silently approve attendance. |
| Permission notes | Very restricted access; HR Admin/authorized reviewer only; Employee may see status, not raw image unless policy permits. |
| Audit/logging notes | Append-only. Access to selfie/face data should be audit logged. |

### 6.18 `Kiosk Device`

| Attribute | Design |
| --- | --- |
| Purpose | Registered shared kiosk hardware/device master. |
| Type | Custom DocType |
| Key fields | `device_name` Data, `device_id` Data, `device_fingerprint_hash` Data, `tenant` Link Tenant, `status` Select, `platform` Select, `app_version` Data, `registered_by` Link User, `registered_on` Datetime, `activated_on` Datetime, `deactivated_on` Datetime, `last_seen_on` Datetime, `token_hash` Password/Data |
| Mandatory fields | `device_name`, `device_id`, `tenant`, `status`, `registered_by` |
| Linked DocTypes | Tenant, Kiosk Device Binding, Kiosk Policy, Kiosk Attendance Log, Audit Log |
| Validation rules | Active device ID/fingerprint must be unique; activation requires active binding and kiosk policy; token is generated server-side and stored hashed. |
| Permission notes | Kiosk Admin/Tenant Admin/HR Admin manage within scope; kiosk API authenticates by device token, not employee login. |
| Audit/logging notes | Audit register, bind, activate, deactivate, token rotate, admin PIN reset. |

### 6.19 `Kiosk Device Binding`

| Attribute | Design |
| --- | --- |
| Purpose | Maps kiosk device to tenant, company, branch, and location. |
| Type | Custom DocType |
| Key fields | `kiosk_device` Link Kiosk Device, `tenant` Link Tenant, `company` Link Company, `branch` Link Branch, `location` Link Location, `status` Select, `effective_from` Datetime, `effective_to` Datetime, `bound_by` Link User |
| Mandatory fields | `kiosk_device`, `tenant`, `company`, `branch`, `location`, `status`, `effective_from` |
| Linked DocTypes | Kiosk Device, Tenant, Company, Branch, Location, User |
| Validation rules | Kiosk, company, branch, and location must belong to same tenant; only one active binding per kiosk at a time; inactive branch/location blocks binding. |
| Permission notes | Kiosk Admin/Tenant Admin/HR Admin manage; branch-scoped Kiosk Admin only assigned branch. |
| Audit/logging notes | Audit binding create, change, deactivate. |

### 6.20 `Kiosk Policy`

| Attribute | Design |
| --- | --- |
| Purpose | Kiosk-specific operating policy for verification, offline sync, admin PIN, and duplicate rules. |
| Type | Custom DocType |
| Key fields | `policy_name` Data, `tenant` Link Tenant, `company` Link Company, `branch` Link Branch, `location` Link Location, `verification_method` Select, `employee_code_fallback` Check, `admin_pin_hash` Password/Data, `offline_enabled` Check, `offline_max_hours` Int, `duplicate_window_minutes` Int, `queue_max_records` Int, `status` Select |
| Mandatory fields | `policy_name`, `tenant`, `company`, `verification_method`, `duplicate_window_minutes`, `status` |
| Linked DocTypes | Tenant, Company, Branch, Location, Kiosk Device |
| Validation rules | Admin PIN required when kiosk mode control is enabled; offline max hours required if offline enabled; verification method must support selected hardware. |
| Permission notes | Tenant Admin/Kiosk Admin/HR Admin configure; kiosk device read only effective policy via API. |
| Audit/logging notes | Audit verification method, offline limit, PIN reset, duplicate window changes. |

### 6.21 `Kiosk Attendance Log`

| Attribute | Design |
| --- | --- |
| Purpose | Stores kiosk-specific punch metadata and offline sync state for shared kiosk attendance. |
| Type | Custom DocType |
| Key fields | `tenant` Link Tenant, `company` Link Company, `branch` Link Branch, `location` Link Location, `kiosk_device` Link Kiosk Device, `employee` Link Employee, `punch_type` Select, `punch_time` Datetime, `verification_method` Select, `verification_status` Select, `face_verification_log` Link Face Verification Log, `gps_validation_log` Link GPS Validation Log, `employee_checkin` Link Employee Checkin, `sync_status` Select, `idempotency_key` Data, `offline_captured_on` Datetime, `server_received_on` Datetime, `failure_reason` Small Text |
| Mandatory fields | `tenant`, `company`, `branch`, `location`, `kiosk_device`, `employee`, `punch_type`, `punch_time`, `verification_status`, `sync_status`, `idempotency_key` |
| Linked DocTypes | Tenant, Company, Branch, Location, Kiosk Device, Employee, Employee Checkin, Face Verification Log, GPS Validation Log, Attendance Exception |
| Validation rules | Kiosk must be active and bound; employee must be active and within allowed tenant/company policy; idempotency key unique; duplicate rule enforced. |
| Permission notes | Kiosk device can create via tokenized API; HR Admin/Kiosk Admin read; Employee own limited read; Auditor read. |
| Audit/logging notes | Append-only for punch metadata; sync status changes audited if conflict/retry occurs. |

### 6.22 `Attendance Exception`

| Attribute | Design |
| --- | --- |
| Purpose | Reviewable queue for attendance validation failures and conflicts. |
| Type | Custom DocType |
| Key fields | `tenant` Link Tenant, `company` Link Company, `branch` Link Branch, `location` Link Location, `employee` Link Employee, `exception_type` Select, `source` Select, `severity` Select, `status` Select, `employee_checkin` Link Employee Checkin, `kiosk_attendance_log` Link Kiosk Attendance Log, `gps_validation_log` Link GPS Validation Log, `face_verification_log` Link Face Verification Log, `employee_device` Link Employee Device, `kiosk_device` Link Kiosk Device, `description` Small Text, `reviewed_by` Link User, `reviewed_on` Datetime, `decision_remarks` Small Text |
| Mandatory fields | `tenant`, `company`, `employee`, `exception_type`, `source`, `status`, `description` |
| Linked DocTypes | Tenant, Company, Branch, Location, Employee, Employee Checkin, Kiosk Attendance Log, GPS Validation Log, Face Verification Log, User |
| Validation rules | Exception must link to at least one source event/log; approved/rejected status requires reviewer and remarks; reviewer must have scope over employee/branch. |
| Permission notes | HR Admin review within scope; Manager review team exceptions if configured; Employee may view own exception status; Auditor read. |
| Audit/logging notes | Audit create and every status transition. |

### 6.23 `Login Attempt Log`

| Attribute | Design |
| --- | --- |
| Purpose | Tracks login attempts for security audit and lockout decisions. |
| Type | Custom DocType |
| Key fields | `user` Link User, `identifier` Data, `tenant` Link Tenant, `login_channel` Select, `ip_address` Data, `device_info` Small Text, `status` Select, `failure_reason` Data, `attempted_on` Datetime |
| Mandatory fields | `identifier`, `login_channel`, `status`, `attempted_on` |
| Linked DocTypes | User, Tenant, Audit Log |
| Validation rules | Append-only; lock/throttle service can count failed attempts by identifier/IP/device. |
| Permission notes | Tenant Admin/Auditor read within scope; Super Admin platform security read; no employee access. |
| Audit/logging notes | This DocType is itself a security log; no edits except retention/archive jobs. |

### 6.24 `OTP Log`

| Attribute | Design |
| --- | --- |
| Purpose | Tracks OTP generation and verification for login, password reset, and device registration. |
| Type | Custom DocType |
| Key fields | `user` Link User, `identifier` Data, `tenant` Link Tenant, `purpose` Select, `otp_hash` Password/Data, `expires_on` Datetime, `status` Select, `retry_count` Int, `resend_count` Int, `verified_on` Datetime, `ip_address` Data |
| Mandatory fields | `identifier`, `purpose`, `otp_hash`, `expires_on`, `status` |
| Linked DocTypes | User, Tenant |
| Validation rules | OTP stored hashed; max retry/resend enforced; expired OTP cannot verify; purpose-specific verification only. |
| Permission notes | No normal user list access; only security/admin reports with restricted fields. |
| Audit/logging notes | Create audit for suspicious failures and password/device flows. |

### 6.25 `User Session`

| Attribute | Design |
| --- | --- |
| Purpose | Extended session registry for mobile, web, and support access monitoring. |
| Type | Custom DocType |
| Key fields | `user` Link User, `tenant` Link Tenant, `employee` Link Employee, `session_channel` Select, `session_id_hash` Data, `refresh_token_hash` Data, `employee_device` Link Employee Device, `kiosk_device` Link Kiosk Device, `status` Select, `issued_on` Datetime, `expires_on` Datetime, `revoked_on` Datetime, `revoked_reason` Data |
| Mandatory fields | `user`, `session_channel`, `session_id_hash`, `status`, `issued_on` |
| Linked DocTypes | User, Tenant, Employee, Employee Device, Kiosk Device |
| Validation rules | Logout, password change, role change, tenant suspension, and device reset must revoke affected sessions. |
| Permission notes | User own session read; Tenant Admin/HR Admin scoped session management; Auditor read. |
| Audit/logging notes | Audit revoke, refresh, suspicious session activity. |

### 6.26 `Audit Log`

| Attribute | Design |
| --- | --- |
| Purpose | Central business/security audit trail for sensitive custom events. |
| Type | Custom DocType |
| Key fields | `tenant` Link Tenant, `company` Link Company, `actor` Link User, `actor_role` Data, `module` Select, `action` Data, `reference_doctype` Link DocType, `reference_name` Dynamic Link, `event_status` Select, `ip_address` Data, `source` Select, `old_values_json` Code, `new_values_json` Code, `remarks` Small Text, `created_on` Datetime |
| Mandatory fields | `module`, `action`, `event_status`, `created_on` |
| Linked DocTypes | Tenant, Company, User, any referenced DocType |
| Validation rules | Append-only; old/new values should mask secrets, OTPs, token hashes, and sensitive face data. |
| Permission notes | Auditor read; Tenant Admin scoped read; Super Admin platform read; no write except service methods. |
| Audit/logging notes | This is the canonical sensitive event log. Retention policy must be client-approved. |

### 6.27 `Export Log`

| Attribute | Design |
| --- | --- |
| Purpose | Tracks report/data exports for compliance. |
| Type | Custom DocType, later phase placeholder |
| Key fields | `tenant` Link Tenant, `company` Link Company, `report_name` Data, `exported_by` Link User, `filters_json` Code, `format` Select, `row_count` Int, `exported_on` Datetime |
| Mandatory fields | `report_name`, `exported_by`, `format`, `exported_on` |
| Linked DocTypes | Tenant, Company, User |
| Validation rules | Export must be scoped to user permissions; sensitive exports must be logged before file response. |
| Permission notes | Auditor/Tenant Admin read; normal users no access. |
| Audit/logging notes | Export Log can also emit `Audit Log` for sensitive payroll/employee exports. |

## 7. Relationships Between DocTypes

| Parent / Source | Relationship | Child / Target | Cardinality |
| --- | --- | --- | --- |
| Tenant | contains | Company | 1 to many |
| Company | contains | Branch | 1 to many |
| Branch | maps to | Location | 1 to many |
| Company | contains | Department | 1 to many |
| Company | contains | Employee | 1 to many |
| Employee | links to | User | 0/1 to 1 |
| User | has | Role | many to many |
| User | has | User Permission | 1 to many |
| Employee | has | Employee Device | 1 to many |
| Employee Device | may be replaced through | Device Reset Request | 1 to many |
| Company/Branch/Location | scoped by | Attendance Policy | 1 to many |
| Employee | creates | Employee Checkin | 1 to many |
| Employee Checkin | may generate/update | Attendance | many to 1 per date |
| Employee Checkin | links to | GPS Validation Log | 0/1 to 1 |
| Employee Checkin | links to | Face Verification Log | 0/1 to 1 |
| Kiosk Device | has | Kiosk Device Binding | 1 to many historical, 1 active |
| Kiosk Device | uses | Kiosk Policy | many to 1 effective policy |
| Kiosk Device | creates | Kiosk Attendance Log | 1 to many |
| Kiosk Attendance Log | creates | Employee Checkin | 0/1 to 1 after accepted sync |
| Validation Logs / Kiosk Logs / Checkins | may create | Attendance Exception | 0/1 to many |
| Sensitive actions | create | Audit Log | many to many by reference |

## 8. Tenant, Company, and Branch Data Isolation Rules

| Rule ID | Rule |
| --- | --- |
| ISO-001 | Every custom Phase 1 business DocType must include `tenant` and usually `company`. |
| ISO-002 | Branch/location-scoped records must include `branch` and/or `location` when used for attendance, kiosk, dashboard, or permissions. |
| ISO-003 | Standard DocTypes used in Phase 1 should receive custom tenant/branch/location fields where required for filtering. |
| ISO-004 | All whitelisted methods must resolve tenant/company from authenticated user, employee, or kiosk token server-side. |
| ISO-005 | Client-provided tenant/company values must be validated against the resolved session/device scope. |
| ISO-006 | `User Permission` records should restrict tenant users by Company, Branch, Location, Department, and Employee where applicable. |
| ISO-007 | Permission query conditions must be implemented for list views, reports, dashboards, and custom APIs. |
| ISO-008 | Super Admin can manage tenant metadata but should not access employee/payroll-sensitive data unless explicit support access is granted and audited. |
| ISO-009 | Background jobs must process records inside a tenant/company scope and must not aggregate across tenants unless platform-level reporting is explicitly intended. |
| ISO-010 | Exported files must include only records permitted by the actor's role and scope. |

## 9. Role and Permission Impact on DocTypes

| Role | Main DocType Access |
| --- | --- |
| Super Admin | Tenant create/update/status; limited platform audit; no default employee sensitive edit. |
| Tenant Admin | Own tenant company, branch, location, roles, users, policy setup, dashboards, reports within tenant. |
| HR Admin | Employee, attendance policy, attendance logs, kiosk setup support, exceptions, dashboard within assigned company/branch. |
| Payroll Admin | Read employee/attendance foundation for future payroll readiness; no kiosk configuration by default. |
| Reporting Manager | Read team employee and attendance data; review team exceptions if configured. |
| Employee | Own profile, own sessions/devices, own attendance status, own punch via API. |
| Sales Employee | Employee permissions plus sales attendance eligibility; detailed field tracking later. |
| Kiosk Admin | Kiosk Device, Kiosk Device Binding, Kiosk Policy, Kiosk status/logs within assigned branch/location. |
| Auditor | Read audit logs, login attempts, exceptions, and reports within assigned scope. |
| Support User | Time-bound scoped access only; all actions audited. |

## 10. Attendance, GPS, Selfie, and Kiosk Data Model

### 10.1 Recommended Attendance Record Strategy

Use `Employee Checkin` as the canonical accepted punch record. Use custom logs for validation and source-specific details:

* `GPS Validation Log` stores location capture and geo-fence outcome.
* `Face Verification Log` stores selfie/face capture outcome and file reference.
* `Kiosk Attendance Log` stores kiosk device, binding, offline sync, and verification metadata.
* `Attendance Exception` stores failed validation, duplicate, unauthorized device, and offline conflicts for review.
* `Attendance` stores daily attendance status after checkin processing or manual review.

### 10.2 Source Handling

| Source | Required Data |
| --- | --- |
| Web | Employee, timestamp, punch type, source, tenant, company, optional GPS/selfie if policy requires. |
| Mobile | Employee, timestamp, punch type, approved device, GPS, selfie/face if required, idempotency key for retry/offline. |
| Kiosk | Kiosk device, binding branch/location, employee, timestamp, punch type, verification result, sync status, idempotency key. |

### 10.3 Exception Types

Recommended `Attendance Exception.exception_type` options:

* `GPS Failed`
* `GPS Missing`
* `GPS Poor Accuracy`
* `Selfie Missing`
* `Face Verification Failed`
* `Duplicate Punch`
* `Unauthorized Device`
* `Inactive Employee`
* `Inactive Kiosk`
* `Kiosk Binding Mismatch`
* `Offline Sync Conflict`
* `Policy Violation`
* `Manual Review`

Recommended statuses:

* `Pending`
* `Reviewed`
* `Approved`
* `Rejected`
* `Resolved`
* `Cancelled`

## 11. Audit Log and Exception Data Model

### 11.1 Events That Must Create `Audit Log`

* Tenant create, activate, suspend, reactivate.
* User role or User Permission changes.
* Login failure threshold/lockout.
* OTP verification for password reset or device registration.
* Employee creation and sensitive employee updates.
* Employee status, branch/location, manager, or user link changes.
* Employee device register, approve, reject, reset, deactivate.
* Attendance policy activation and validation rule changes.
* Kiosk register, bind, activate, deactivate, token rotate, admin PIN reset.
* Attendance punch accepted from mobile/web/kiosk.
* Attendance exception reviewed, approved, rejected, or resolved.
* Selfie/face data access by admin/reviewer.
* Report/export events when export functionality is enabled.

### 11.2 Exception Review Model

`Attendance Exception` is the operational queue. `Audit Log` is the immutable trail. A status change in `Attendance Exception` should:

1. Validate reviewer role and branch/company scope.
2. Require remarks for approval/rejection.
3. Update linked checkin/attendance only through controlled service methods.
4. Create an `Audit Log` with previous and new status.

## 12. Validation Rules and Constraints

| Area | Rule |
| --- | --- |
| Tenant | `tenant_code` unique; inactive/suspended tenant blocks login and transactional APIs. |
| Company | Must link to active tenant. |
| Branch | Must link to same tenant/company; inactive branch not allowed for new assignment. |
| Location | Valid lat/long; positive radius when GPS is required. |
| Employee | Unique employee code within tenant/company; active employee requires branch/location/department/designation. |
| User link | Employee user must belong to same tenant/company scope. |
| Device | One primary active device per employee by default. |
| Kiosk | Active kiosk requires active device, active binding, and active policy. |
| Attendance policy | At least one channel enabled; only one active policy for the same scope/effective period. |
| Punch | Requires active employee, valid source, allowed channel, tenant/company match, and duplicate rule check. |
| GPS | Required GPS failure must block or create exception based on policy, never silently approve. |
| Face/selfie | Required verification failure must block or create exception based on policy. |
| Offline sync | Idempotency key required and unique for mobile/kiosk offline records. |
| Exception | Must link to a source event/log; decision requires reviewer and remarks. |
| Audit | Append-only; secrets and sensitive biometric values must be masked. |

## 13. Suggested Indexes for Performance

Frappe creates standard indexes for names and link fields in many cases, but the following indexes should be explicitly considered for high-volume Phase 1 records.

| DocType | Suggested Index |
| --- | --- |
| Tenant | `tenant_code`, `status` |
| Company | `tenant`, `company_name` |
| Branch | `tenant`, `company`, `status` |
| Location | `tenant`, `company`, `branch`, `status` |
| Employee | `tenant`, `company`, `employee`, `employee_number`, `branch`, `department`, `status`, `user_id` |
| Employee Device | `employee`, `tenant`, `company`, `device_id`, `device_fingerprint_hash`, `status`, `is_primary` |
| Device Reset Request | `employee`, `status`, `requested_by`, `approved_by` |
| Attendance Policy | `tenant`, `company`, `scope_type`, `branch`, `location`, `department`, `status`, `effective_from` |
| Employee Checkin | `tenant`, `company`, `employee`, `time`, `log_type`, `source`, `idempotency_key`, `kiosk_device`, `employee_device` |
| Attendance | `tenant`, `company`, `employee`, `attendance_date`, `status` |
| GPS Validation Log | `tenant`, `company`, `employee`, `captured_on`, `source`, `result`, `location` |
| Face Verification Log | `tenant`, `company`, `employee`, `captured_on`, `source`, `result` |
| Kiosk Device | `tenant`, `device_id`, `device_fingerprint_hash`, `status`, `last_seen_on` |
| Kiosk Device Binding | `kiosk_device`, `tenant`, `company`, `branch`, `location`, `status`, `effective_from` |
| Kiosk Policy | `tenant`, `company`, `branch`, `location`, `status` |
| Kiosk Attendance Log | `tenant`, `company`, `branch`, `location`, `kiosk_device`, `employee`, `punch_time`, `sync_status`, `idempotency_key`, `verification_status` |
| Attendance Exception | `tenant`, `company`, `branch`, `location`, `employee`, `exception_type`, `source`, `status`, `creation` |
| Login Attempt Log | `identifier`, `user`, `tenant`, `status`, `attempted_on`, `ip_address` |
| OTP Log | `identifier`, `purpose`, `status`, `expires_on` |
| User Session | `user`, `tenant`, `employee`, `session_channel`, `status`, `expires_on` |
| Audit Log | `tenant`, `company`, `actor`, `module`, `action`, `reference_doctype`, `reference_name`, `created_on` |

## 14. Text-based ERD Relationship Diagram

```text
Tenant
  -> Company
      -> Branch
          -> Location
      -> Department
      -> Designation
      -> Employee
          -> User
              -> Role
              -> User Permission
              -> User Session
          -> Employee Device
              -> Device Reset Request
          -> Employee Checkin
              -> Attendance
              -> GPS Validation Log
              -> Face Verification Log
              -> Attendance Exception

Company / Branch / Location / Department
  -> Attendance Policy

Tenant
  -> Kiosk Device
      -> Kiosk Device Binding
          -> Company
          -> Branch
          -> Location
      -> Kiosk Policy
      -> Kiosk Attendance Log
          -> Employee
          -> Employee Checkin
          -> GPS Validation Log
          -> Face Verification Log
          -> Attendance Exception

Security and audit
  User -> Login Attempt Log
  User -> OTP Log
  Any sensitive record/action -> Audit Log
  Reports/exports -> Export Log
```

## 15. Phase 1 Data Flow Examples

### 15.1 Tenant and Company Setup

1. Super Admin creates `Tenant`.
2. System creates or links `Company`.
3. Tenant Admin creates `Branch` and `Location`.
4. Tenant Admin/HR Admin creates `Department` and `Designation`.
5. User Permissions are generated for Tenant Admin/HR Admin scope.
6. `Audit Log` records tenant/company setup actions.

### 15.2 Employee Setup

1. HR Admin creates `Employee` with tenant, company, branch, location, department, designation, and manager.
2. System validates unique employee code within tenant/company.
3. Optional linked `User` is created.
4. Employee/Sales Employee role and User Permissions are assigned.
5. `Audit Log` records employee creation and user linkage.

### 15.3 Mobile Punch with GPS/Selfie

1. Employee logs in and mobile session is recorded in `User Session`.
2. Mobile app sends punch request with employee, device, GPS, selfie, source, and idempotency key.
3. Service validates tenant/company, active employee, active policy, allowed mobile channel, and approved `Employee Device`.
4. Service creates `GPS Validation Log` and `Face Verification Log`.
5. If validation passes, service creates `Employee Checkin`.
6. If validation fails and policy allows review, service creates `Attendance Exception`.
7. Attendance status is updated or queued for processing.
8. `Audit Log` records sensitive punch/exception outcome.

### 15.4 Web Punch

1. Employee uses web session to request punch.
2. Service resolves employee and tenant/company scope from logged-in user.
3. Service validates web channel in active `Attendance Policy`.
4. If policy requires GPS/selfie, related validation logs are created.
5. Service creates `Employee Checkin` or `Attendance Exception`.
6. Dashboard summary reads scoped checkin/attendance/exception counts.

### 15.5 Kiosk Device Setup

1. Kiosk Admin registers `Kiosk Device`.
2. Admin binds kiosk through `Kiosk Device Binding` to tenant, company, branch, and location.
3. Admin creates or selects `Kiosk Policy`.
4. System validates active binding and active policy before activation.
5. System generates kiosk token and stores token hash.
6. `Audit Log` records registration, binding, policy, and activation.

### 15.6 Shared Kiosk Attendance

1. Kiosk app authenticates using kiosk device token.
2. Backend validates active `Kiosk Device`, active `Kiosk Device Binding`, and effective `Kiosk Policy`.
3. Employee identifies by face/selfie/employee code fallback.
4. Service validates active employee and tenant/company/branch eligibility.
5. Service creates `Kiosk Attendance Log` with idempotency key and verification result.
6. If accepted, service creates linked `Employee Checkin`.
7. If failed, duplicate, offline conflict, or mismatch, service creates `Attendance Exception`.
8. Kiosk app resets to ready state for next employee.

### 15.7 Offline Kiosk Sync

1. Kiosk stores local records with idempotency keys while offline.
2. When online, kiosk sends batch to sync API.
3. Backend validates device token, binding, policy, employee status, and each idempotency key.
4. Existing idempotency keys return previous result without duplicate checkin creation.
5. Conflicts create `Attendance Exception`.
6. `Kiosk Attendance Log.sync_status` is updated to synced, duplicate, conflict, or failed.

## 16. Risks and Open Database Questions

| Risk / Question | Impact | Recommended Default |
| --- | --- | --- |
| Single site vs site-per-tenant not finalized | Affects all tenant fields, deployment, permissions, backups. | Single shared Frappe site for MVP. |
| Whether ERPNext `Location` is suitable for attendance geo-fence | Could require custom Work Location DocType. | Evaluate standard Location; create custom Work Location if fields/permissions conflict. |
| Exact mobile token/session strategy | Affects User Session and mobile APIs. | Token service wrapping Frappe user session with revocable refresh token. |
| OTP provider and limits | Affects OTP Log fields and security workflow. | Pluggable provider, 5-minute expiry, 3 retries. |
| Device binding policy | Affects Employee Device uniqueness and reset workflow. | One primary active device per employee. |
| Kiosk hardware/specs | Affects Kiosk Policy and verification method. | Android tablet with camera and local storage. |
| Kiosk verification method | Affects Face Verification Log and kiosk attendance flow. | Selfie/face with employee code fallback. |
| Kiosk offline duration | Affects sync indexes, retention, conflict policy. | 24 hours with admin review for conflicts. |
| Face/selfie storage and retention | Privacy/compliance risk. | Private File references, restricted access, retention policy pending sign-off. |
| GPS radius and accuracy threshold | False approvals/rejections. | Configurable per Location. |
| Production load unknown | Index and archiving strategy uncertain. | Confirm tenants, employees, punches/day, kiosk devices before go-live. |
| Attendance regularization timing | May require separate DocType in Phase 1 or later. | Use ERPNext standard regularization if available; otherwise design in next artifact. |

## 17. Final DocType Design Recommendation

Build Phase 1 on a custom Frappe app named `hrms_saas`.

Reuse the following standard DocTypes wherever possible:

* `User`
* `Role`
* `User Permission`
* `Company`
* `Branch`
* `Location` or a controlled custom `Work Location`
* `Department`
* `Designation`
* `Employee`
* `Employee Checkin`
* `Attendance`
* `File`
* `Version`
* `Activity Log`

Create the following custom DocTypes for Phase 1:

* `Tenant`
* `Login Attempt Log`
* `OTP Log`
* `User Session`
* `Employee Device`
* `Device Reset Request`
* `Attendance Policy`
* `GPS Validation Log`
* `Face Verification Log`
* `Attendance Exception`
* `Kiosk Device`
* `Kiosk Device Binding`
* `Kiosk Policy`
* `Kiosk Attendance Log`
* `Audit Log`

Keep `Export Log` as a later-phase DocType unless Phase 1 report export is explicitly included.

The most important implementation rule is that every custom API and report must resolve tenant/company/branch scope server-side. Frontend filters and hidden buttons are helpful for UX, but they must never be treated as security controls.

The next recommended artifact is the Phase 1 API Contract Document. It should use this ERD as the source for request/response fields, permission checks, idempotency behavior, validation error codes, and audit events.
