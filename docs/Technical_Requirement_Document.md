# Technical Requirement Document (TRD)

## 1. Document Overview

This Technical Requirement Document defines how the Modern SaaS HRMS platform should be technically built using Vue.js + Tailwind CSS, Frappe Framework / ERPNext HRMS customization, MariaDB, and React Native.

The TRD translates the BRD, phase-wise plan, Phase 1 BPMN flows, Phase 1 SRS, and Auth/Role/Permission document into a practical technical baseline. It is intended for solution architects, backend developers, frontend developers, mobile developers, QA engineers, DevOps engineers, and project stakeholders.

This document is not a detailed API contract, ERD, or database schema. It defines the technical direction and requirements needed to create those documents next.

| Item | Value |
| --- | --- |
| Project | Modern SaaS HRMS |
| Backend | Frappe Framework / ERPNext HRMS customization |
| Web Frontend | Vue.js + Tailwind CSS |
| Mobile App | React Native |
| Database | MariaDB via Frappe DocTypes |
| Architecture | Multi-tenant SaaS HRMS |
| Deployment | VPS/Cloud with SSL, backup, monitoring, and CI/CD |
| Accuracy Probability | 86% based on available documents. Remaining uncertainty is mainly around exact tenant model, OTP provider, kiosk verification method, offline limits, face/selfie storage policy, and production infrastructure sizing. |

## 2. Technical Goals and Scope

### 2.1 Technical Goals

| Goal ID | Technical Goal |
| --- | --- |
| TG-001 | Build a secure multi-tenant HRMS platform with tenant/company/branch/location data isolation. |
| TG-002 | Reuse ERPNext HRMS standard DocTypes where suitable and add custom DocTypes only where required. |
| TG-003 | Provide a modern Vue + Tailwind web portal for admins, HR, managers, employees, and reporting users. |
| TG-004 | Provide a React Native mobile app for employee login, device binding, mobile attendance, GPS/selfie capture, and future sales workflows. |
| TG-005 | Provide kiosk attendance capability for shared multi-employee punch from registered kiosk devices. |
| TG-006 | Enforce server-side role, permission, tenant, company, branch, location, and record-ownership checks. |
| TG-007 | Capture audit logs for sensitive authentication, admin, attendance, kiosk, permission, and data actions. |
| TG-008 | Build Phase 1 in vertical slices so backend, frontend, mobile, kiosk, permissions, and tests are delivered together per workflow. |
| TG-009 | Keep architecture extensible for later phases: shift, leave, payroll, statutory compliance, sales tracking, reports, data migration, and integrations. |

### 2.2 Phase 1 Technical Scope

| Module | Scope |
| --- | --- |
| Authentication/Login | Web login, mobile login, logout, OTP baseline, session handling, audit. |
| Role-based Access | Frappe roles, DocType permissions, User Permission, route/API guards. |
| Tenant/Company Setup | Tenant, company, branch, location, setup status. |
| Employee Setup | Employee master, user linking, role assignment, reporting manager. |
| Basic Attendance Setup | Attendance policy, channel rules, GPS/selfie flags, duplicate punch window. |
| Web/Mobile Punch | Punch in/out from allowed channels. |
| GPS/Selfie Validation | GPS coordinates, accuracy, selfie/face reference, validation status. |
| Kiosk Device Setup | Device registration, binding, activation, admin control. |
| Shared Kiosk Attendance | Multi-employee kiosk punch, identity validation, device/location audit. |
| Dashboard Basics | Tenant/company setup status, employee count, attendance summary, kiosk status, exception count. |
| Attendance Exceptions | GPS/selfie/kiosk/duplicate/device exception review. |

### 2.3 Later-Phase Technical Hooks

| Later Area | Phase 1 Hook Needed |
| --- | --- |
| Shift/Roster/OT | Attendance logs must preserve source, timestamp, punch type, employee, company, and location. |
| Leave/Holiday | Employee, company, branch, department, and reporting manager must be cleanly modeled. |
| Payroll | Employee, attendance, exception, audit, and tenant/company data must be reliable. |
| Sales Tracking | Mobile device binding, GPS capture, and Sales Employee role must exist. |
| Reports/MIS | Phase 1 records must support server-side scoped queries. |
| Data Migration | DocTypes must use stable naming and import-friendly fields. |

## 3. Recommended Technology Stack

| Layer | Recommended Technology | Notes |
| --- | --- | --- |
| Backend Framework | Frappe Framework | Core application framework, DocTypes, permissions, APIs, jobs, reports. |
| HRMS Base | ERPNext HRMS / Frappe HR | Reuse Employee, Attendance, Employee Checkin, Company, Department, Designation where suitable. |
| Database | MariaDB | Managed through Frappe ORM and DocTypes. |
| Web Frontend | Vue.js | Modern admin/HR/employee portal. |
| Styling | Tailwind CSS | Utility-first responsive UI. |
| Mobile App | React Native | Employee/sales mobile app and possible kiosk app if kiosk is mobile/tablet-based. |
| Kiosk App | React Native Android tablet mode or dedicated kiosk module | Must support shared-device attendance, offline queue if enabled, and kiosk admin PIN. |
| API Style | Frappe whitelisted methods + REST resources | Use custom whitelisted methods for business workflows. |
| Auth | Frappe session plus token-based mobile API auth | Mobile/kiosk require explicit token/session strategy. |
| Background Jobs | Frappe Scheduler / RQ workers | Offline sync processing, audit cleanup, notifications. |
| File Storage | Frappe File DocType / object storage optional | Selfie/face references, employee documents in later phases. |
| CI/CD | GitHub Actions or equivalent | Lint, tests, build, deploy. |
| Deployment | VPS/Cloud Linux server | Nginx, Supervisor, Redis, MariaDB, SSL. |
| Monitoring | Server metrics + application error logging | Uptime, disk, CPU, memory, worker errors, failed jobs. |

## 4. High-Level System Architecture

### 4.1 Architecture Overview

```text
Users / Devices
  -> Vue Web Portal
  -> React Native Mobile App
  -> React Native / Android Kiosk App

Applications
  -> Frappe API Layer
  -> Frappe DocType Models
  -> ERPNext HRMS Standard Modules
  -> Custom HRMS SaaS Modules
  -> Workflow / Permission / Audit Services

Data and Infrastructure
  -> MariaDB
  -> Redis / Queue Workers
  -> File Storage
  -> Nginx + SSL
  -> Backup + Monitoring + CI/CD
```

### 4.2 Main Components

| Component | Technical Responsibility |
| --- | --- |
| Vue Web Portal | Admin, HR, employee web, role-based dashboards, setup forms, exception review. |
| React Native Mobile App | Employee login, device binding, GPS/selfie capture, mobile punch, attendance status. |
| Kiosk App | Shared multi-employee attendance capture, kiosk device token, offline queue, sync. |
| Frappe Backend | Business logic, DocTypes, permissions, workflows, APIs, audit, reports. |
| ERPNext HRMS | Standard HR foundation where suitable, especially Employee, Attendance, Employee Checkin. |
| Custom SaaS Layer | Tenant, subscription-ready context, kiosk, device binding, custom attendance policy. |
| MariaDB | Transactional data storage via Frappe ORM. |
| Redis/Workers | Background jobs, notification processing, sync/retry queues. |
| Nginx/SSL | Secure web/API serving. |

### 4.3 Technical Build Principles

| Principle | Requirement |
| --- | --- |
| Server-side authority | Backend must own tenant filtering, permission checks, and business validation. |
| Vertical slice delivery | Web, mobile, backend, permissions, and tests should be built together only when they belong to the same workflow slice. |
| ERPNext reuse first | Use ERPNext/Frappe HRMS standard DocTypes before creating custom DocTypes. |
| Custom DocType only for gaps | Create custom DocTypes for tenant, kiosk, device binding, validation logs, and exceptions. |
| Audit by design | Sensitive actions must create audit records as part of the transaction. |
| Offline explicitness | Offline kiosk/mobile behavior must have queue, sync status, conflict rules, and audit. |

## 5. Multi-Tenant SaaS Architecture

### 5.1 Recommended Tenant Model

The recommended Phase 1 approach is a single Frappe site with logical tenant isolation using a custom `Tenant` DocType and mandatory tenant/company linkage on business records. This is suitable for faster MVP development and shared SaaS operations.

For high-isolation enterprise clients, a future multi-site-per-tenant model may be considered, but it increases operations, deployment, and upgrade complexity.

| Option | Recommendation | Notes |
| --- | --- | --- |
| Single Frappe site, logical tenant isolation | Recommended for MVP | Faster build, shared codebase, strict permission/query filters required. |
| Frappe site per tenant | Future enterprise option | Stronger isolation, higher DevOps complexity. |
| Database per tenant | Not recommended for Phase 1 | Too heavy for MVP unless required by compliance. |

### 5.2 Tenant Isolation Requirements

| Req ID | Requirement |
| --- | --- |
| MT-TRD-001 | Every Phase 1 business DocType shall include tenant/company context directly or through linked company. |
| MT-TRD-002 | APIs shall apply tenant/company filters server-side before returning data. |
| MT-TRD-003 | List views and reports shall use permission query conditions or explicit filters. |
| MT-TRD-004 | Background jobs shall process records within tenant context. |
| MT-TRD-005 | Super Admin shall manage tenant metadata but should not edit payroll/employee sensitive data unless support access is explicitly granted. |
| MT-TRD-006 | User Permission records shall restrict users by company, branch, location, employee, and department where applicable. |

### 5.3 Tenant Context Propagation

| Layer | Tenant Handling |
| --- | --- |
| Web frontend | Store active tenant/company scope from session/permissions API. |
| Mobile app | Receive employee tenant/company scope after login. |
| Kiosk app | Use device token mapped to tenant/company/branch/location. |
| Backend APIs | Resolve tenant from authenticated user or kiosk device token. |
| DocTypes | Store tenant/company fields and validate on save. |
| Reports | Enforce tenant/company scope in query layer. |

## 6. Recommended Project Folder Structure

### 6.1 Repository Structure

```text
frappehrms/
  backend/
    apps/
      hrms_saas/
        hrms_saas/
          api/
          auth/
          attendance/
          dashboard/
          device/
          kiosk/
          tenant/
          overrides/
          patches/
          reports/
          hooks.py
        pyproject.toml
        README.md
    sites/
      common_site_config.json
    tests/
      unit/
      integration/
      e2e_api/

  frontend/
    src/
      app/
      assets/
      components/
      composables/
      layouts/
      modules/
        auth/
        dashboard/
        employee/
        attendance/
        kiosk/
        tenant/
      router/
      services/
      stores/
      types/
      utils/
    tests/
      unit/
      component/
      e2e/
    tailwind.config.js
    package.json

  mobile/
    src/
      app/
      components/
      modules/
        auth/
        device/
        attendance/
        kiosk/
      navigation/
      services/
      storage/
      utils/
    tests/
      unit/
      e2e/
    package.json

  docs/
    BRD/
    BPMN/
    SRS/
    TRD/
    API/
    ERD/
    UAT/

  deployment/
    nginx/
    supervisor/
    scripts/
    ci/
    backup/

  qa/
    test-cases/
    postman/
    playwright/
    mobile-tests/
```

### 6.2 Frappe App Module Structure

```text
hrms_saas/
  hrms_saas/
    tenant/
      doctype/tenant/
      doctype/subscription_plan/
    auth/
      doctype/otp_log/
      doctype/login_attempt_log/
      doctype/user_session/
      api.py
    device/
      doctype/employee_device/
      doctype/device_reset_request/
      api.py
    kiosk/
      doctype/kiosk_device/
      doctype/kiosk_device_binding/
      doctype/kiosk_policy/
      doctype/kiosk_attendance_log/
      api.py
    attendance/
      doctype/attendance_policy/
      doctype/gps_validation_log/
      doctype/face_verification_log/
      doctype/attendance_exception/
      api.py
      services.py
    dashboard/
      api.py
    audit/
      doctype/audit_log/
      services.py
    permissions.py
    hooks.py
```

## 7. Phase 1 Module-wise Technical Requirements

### 7.1 Authentication/Login

| Req ID | Technical Requirement |
| --- | --- |
| P1-AUTH-TRD-001 | Implement web login using Frappe authentication/session handling. |
| P1-AUTH-TRD-002 | Implement mobile login endpoint that returns secure API/session token strategy compatible with React Native. |
| P1-AUTH-TRD-003 | Implement OTP request and verification DocType/service if OTP is enabled. |
| P1-AUTH-TRD-004 | Store login success/failure in `Login Attempt Log` or custom `Audit Log`. |
| P1-AUTH-TRD-005 | Reject login when user is disabled, role missing, or tenant/company inactive. |
| P1-AUTH-TRD-006 | Provide permission/session bootstrap API for frontend and mobile. |

### 7.2 Role-Based Access

| Req ID | Technical Requirement |
| --- | --- |
| P1-RBAC-TRD-001 | Define Frappe roles for Super Admin, Tenant Admin, HR Admin, Payroll Admin, Manager, Employee, Sales Employee, Kiosk Admin, Auditor, and Support User. |
| P1-RBAC-TRD-002 | Configure DocType permissions for standard and custom DocTypes. |
| P1-RBAC-TRD-003 | Use `User Permission` records for company, branch, location, employee, and department scope. |
| P1-RBAC-TRD-004 | Implement server-side permission utility for all custom whitelisted APIs. |
| P1-RBAC-TRD-005 | Implement frontend route guards based on backend permissions. |
| P1-RBAC-TRD-006 | Log sensitive permission-denied attempts. |

### 7.3 Tenant/Company Setup

| Req ID | Technical Requirement |
| --- | --- |
| P1-TEN-TRD-001 | Create custom `Tenant` DocType if not available in selected SaaS architecture. |
| P1-TEN-TRD-002 | Link `Tenant` to ERPNext `Company`. |
| P1-TEN-TRD-003 | Add tenant/company references to custom Phase 1 DocTypes. |
| P1-TEN-TRD-004 | Reuse ERPNext `Company`; create or use `Branch` and `Location` masters. |
| P1-TEN-TRD-005 | Provide setup status API for Tenant Admin dashboard. |
| P1-TEN-TRD-006 | Enforce unique tenant identifier and active/inactive tenant status. |

### 7.4 Employee Setup

| Req ID | Technical Requirement |
| --- | --- |
| P1-EMP-TRD-001 | Reuse ERPNext/Frappe HR `Employee` DocType where possible. |
| P1-EMP-TRD-002 | Extend `Employee` with tenant, branch/location, sales category flag, and attendance policy links if required. |
| P1-EMP-TRD-003 | Implement employee creation APIs with tenant/company validation. |
| P1-EMP-TRD-004 | Implement user-account linking from employee to Frappe `User`. |
| P1-EMP-TRD-005 | Assign Employee or Sales Employee role based on employee category/designation. |
| P1-EMP-TRD-006 | Enforce unique employee code within tenant/company. |

### 7.5 Basic Attendance Setup

| Req ID | Technical Requirement |
| --- | --- |
| P1-ATTSET-TRD-001 | Create custom `Attendance Policy` DocType for Phase 1 channel and validation controls. |
| P1-ATTSET-TRD-002 | Policy shall support web/mobile/kiosk channel flags, GPS required flag, selfie/face required flag, duplicate punch window, and scope. |
| P1-ATTSET-TRD-003 | Implement policy resolver service that returns active policy for employee/source/device. |
| P1-ATTSET-TRD-004 | Audit all policy activation and changes. |
| P1-ATTSET-TRD-005 | Validate policy completeness before activation. |

### 7.6 Web/Mobile Punch In-Out

| Req ID | Technical Requirement |
| --- | --- |
| P1-PUNCH-TRD-001 | Use ERPNext `Employee Checkin` for raw punch where compatible. |
| P1-PUNCH-TRD-002 | Create custom detailed `Attendance Log` only if ERPNext `Employee Checkin` cannot store required metadata. |
| P1-PUNCH-TRD-003 | Punch service shall validate employee status, channel policy, device binding, duplicate punch, GPS/selfie requirements, and tenant scope. |
| P1-PUNCH-TRD-004 | Punch service shall create validation logs and attendance exceptions where needed. |
| P1-PUNCH-TRD-005 | Attendance status API shall return last punch and current in/out state. |

### 7.7 GPS/Selfie Validation

| Req ID | Technical Requirement |
| --- | --- |
| P1-VAL-TRD-001 | Create `GPS Validation Log` with latitude, longitude, accuracy, timestamp, result, and source. |
| P1-VAL-TRD-002 | Create `Face Verification Log` or `Selfie Verification Log` with employee, source, result, and file/reference. |
| P1-VAL-TRD-003 | Store selfie files in Frappe `File` with restricted access or external secure storage if later approved. |
| P1-VAL-TRD-004 | Implement GPS radius validation using configured `Location` latitude, longitude, and radius. |
| P1-VAL-TRD-005 | Implement fallback exception creation if validation fails and policy allows review. |

### 7.8 Kiosk Device Setup

| Req ID | Technical Requirement |
| --- | --- |
| P1-KIOSKSET-TRD-001 | Create custom `Kiosk Device` DocType. |
| P1-KIOSKSET-TRD-002 | Create `Kiosk Device Binding` DocType linking kiosk to tenant, company, branch, and location. |
| P1-KIOSKSET-TRD-003 | Create `Kiosk Policy` DocType for admin PIN, offline setting, verification method, and duplicate window. |
| P1-KIOSKSET-TRD-004 | Generate secure kiosk device token for active kiosk session. |
| P1-KIOSKSET-TRD-005 | Kiosk APIs shall reject inactive, unbound, or wrong-tenant devices. |
| P1-KIOSKSET-TRD-006 | Audit kiosk register, bind, activate, deactivate, and policy update actions. |

### 7.9 Shared Kiosk Attendance

| Req ID | Technical Requirement |
| --- | --- |
| P1-KIOSKATT-TRD-001 | Kiosk punch API shall accept requests only from registered active kiosk device token. |
| P1-KIOSKATT-TRD-002 | Kiosk punch shall validate employee identity using configured method: face/selfie/code fallback pending client sign-off. |
| P1-KIOSKATT-TRD-003 | Kiosk punch shall store kiosk device, branch, location, employee, punch type, timestamp, verification result, and sync status. |
| P1-KIOSKATT-TRD-004 | Kiosk app shall reset to ready state after each attendance attempt. |
| P1-KIOSKATT-TRD-005 | Kiosk offline queue shall store records locally with idempotency keys and sync status if offline mode is enabled. |
| P1-KIOSKATT-TRD-006 | Offline sync API shall prevent duplicate processing using idempotency keys. |

### 7.10 Dashboard and Exception Review

| Req ID | Technical Requirement |
| --- | --- |
| P1-DASH-TRD-001 | Dashboard summary API shall return role-scoped employee count, attendance summary, kiosk status, and exception count. |
| P1-DASH-TRD-002 | Dashboard queries shall enforce tenant/company/branch filters server-side. |
| P1-EXC-TRD-001 | Create `Attendance Exception` DocType with type, source, employee, device/kiosk, status, remarks, and audit fields. |
| P1-EXC-TRD-002 | Exception review API shall allow authorized users to mark pending/reviewed/approved/rejected. |
| P1-EXC-TRD-003 | Exception status changes shall be audited. |

## 8. Backend/Frappe Technical Requirements

### 8.1 Frappe App Strategy

| Requirement | Description |
| --- | --- |
| Custom app | Build a dedicated custom Frappe app, recommended name `hrms_saas`. |
| ERPNext HRMS reuse | Reuse Employee, Company, Department, Designation, Attendance, Employee Checkin where practical. |
| Custom DocTypes | Add custom DocTypes for tenant, device, kiosk, policy, validation logs, exceptions, audit, and session extensions. |
| Whitelisted methods | Use whitelisted methods for workflow APIs such as punch, kiosk sync, dashboard, device registration. |
| Permission utilities | Centralize tenant, role, company, branch, employee ownership checks. |
| Hooks | Use hooks for permission query conditions, scheduler events, document events, and boot/session info where needed. |

### 8.2 Backend Services

| Service | Responsibility |
| --- | --- |
| Auth Service | Login support, OTP, session checks, permission bootstrap. |
| Tenant Service | Tenant creation, status, company linkage, setup status. |
| Permission Service | Role/action/scope validation for APIs and reports. |
| Employee Service | Employee creation, user linking, sales category role assignment. |
| Device Service | Employee device registration, approval, reset, validation. |
| Attendance Policy Service | Resolve attendance policy by employee/source/scope. |
| Attendance Punch Service | Validate and record web/mobile punch. |
| GPS Validation Service | Validate location/radius and log result. |
| Selfie/Face Service | Store capture reference and verification result. |
| Kiosk Service | Register, bind, activate, punch, offline sync. |
| Exception Service | Create/review attendance exceptions. |
| Dashboard Service | Role-scoped Phase 1 dashboard summaries. |
| Audit Service | Common sensitive action logging. |

### 8.3 Frappe Implementation Rules

| Req ID | Requirement |
| --- | --- |
| BE-TRD-001 | Do not bypass Frappe ORM/permission model unless explicitly justified for performance and protected with manual checks. |
| BE-TRD-002 | All custom APIs must validate session/device token, tenant, role, and record scope. |
| BE-TRD-003 | All custom DocTypes must define role permissions in fixtures or install scripts. |
| BE-TRD-004 | All sensitive DocType changes must create `Audit Log` or rely on Frappe `Version` plus custom audit where needed. |
| BE-TRD-005 | All mobile/kiosk endpoints must return consistent error codes for unauthorized device, inactive kiosk, GPS failure, duplicate punch, and validation failure. |

## 9. Frontend Vue + Tailwind Requirements

### 9.1 Web App Technical Requirements

| Req ID | Requirement |
| --- | --- |
| FE-TRD-001 | Build Vue app with modular route groups: auth, tenant, employee, attendance, kiosk, dashboard. |
| FE-TRD-002 | Use Tailwind CSS for responsive layouts, forms, tables, cards, status badges, and dashboards. |
| FE-TRD-003 | Implement route guards that use backend permission bootstrap data. |
| FE-TRD-004 | Use centralized API client with token/session handling and standard error handling. |
| FE-TRD-005 | Use form validation for required fields before API submission, while backend remains final authority. |
| FE-TRD-006 | Display clear success, warning, validation, access denied, and exception states. |
| FE-TRD-007 | Support desktop-first admin screens and responsive tablet layouts. |

### 9.2 Web Screens for Phase 1

| Screen | Main Technical Notes |
| --- | --- |
| Login / OTP / Forgot Password | Auth forms, error states, loading states. |
| Role-based App Shell | Dynamic navigation from permissions API. |
| Tenant Setup | Create tenant, status, setup checklist. |
| Company Setup | Company profile and defaults. |
| Branch/Location Master | CRUD forms and tables. |
| Employee Master | List, filters, create/edit/view, user link. |
| Attendance Settings | Policy editor with scope and validation flags. |
| Web Punch | Simple punch status/action for enabled web channel. |
| Kiosk Device Setup | Register, bind, activate/deactivate kiosk. |
| Exception Review | Filter, view, approve/reject/review exceptions. |
| Admin/HR Dashboard | Role-scoped metrics and quick actions. |

## 10. Mobile App Technical Requirements

### 10.1 React Native App Requirements

| Req ID | Requirement |
| --- | --- |
| MOB-TRD-001 | Build React Native app with modules for auth, device binding, attendance, GPS/selfie, and status. |
| MOB-TRD-002 | Store tokens securely using platform secure storage. |
| MOB-TRD-003 | Capture device fingerprint/device ID for binding. |
| MOB-TRD-004 | Request runtime permissions for GPS and camera only when required. |
| MOB-TRD-005 | Capture GPS coordinates with accuracy metadata. |
| MOB-TRD-006 | Capture selfie/face image or reference when required. |
| MOB-TRD-007 | Provide offline queue only for approved offline attendance scenarios. |
| MOB-TRD-008 | Show clear status for punch success, validation failure, unauthorized device, and sync pending. |

### 10.2 Kiosk App Requirements

| Req ID | Requirement |
| --- | --- |
| KAPP-TRD-001 | Kiosk app shall run on Android tablet/device in locked or kiosk mode where possible. |
| KAPP-TRD-002 | Kiosk app shall authenticate using kiosk device token, not employee login. |
| KAPP-TRD-003 | Kiosk app shall show a ready screen for sequential employee attendance. |
| KAPP-TRD-004 | Kiosk app shall support configured employee identification method. |
| KAPP-TRD-005 | Kiosk app shall queue offline attendance records if offline mode is enabled. |
| KAPP-TRD-006 | Kiosk app shall sync queued records with idempotency keys. |
| KAPP-TRD-007 | Kiosk app shall require admin PIN or authorized admin flow to exit kiosk mode. |

## 11. Database / Frappe DocType Requirements

### 11.1 Standard Frappe/ERPNext DocTypes to Reuse

| Standard DocType | Use |
| --- | --- |
| `User` | Login identity. |
| `Role` | RBAC role assignment. |
| `User Permission` | Record-level company/branch/employee restriction. |
| `Company` | Company master. |
| `Department` | Department master. |
| `Designation` | Designation master. |
| `Employee` | Employee master. |
| `Employee Checkin` | Raw punch log where metadata is sufficient. |
| `Attendance` | Daily attendance record. |
| `File` | Selfie/document/file references. |
| `Version` / `Activity Log` | Standard audit/change trace. |

### 11.2 Required Custom DocTypes

| Custom DocType | Purpose | Phase |
| --- | --- | --- |
| `Tenant` | SaaS tenant master and status. | Phase 1 |
| `Login Attempt Log` | Login success/failure tracking if standard logs are insufficient. | Phase 1 |
| `OTP Log` | OTP generation and verification audit. | Phase 1 |
| `User Session` | Extended mobile/kiosk session tracking if needed. | Phase 1 |
| `Employee Device` | Mobile device binding. | Phase 1 |
| `Device Reset Request` | Device reset workflow. | Phase 1/2 |
| `Attendance Policy` | Channel, GPS, selfie, duplicate settings. | Phase 1 |
| `GPS Validation Log` | Location validation audit. | Phase 1 |
| `Face Verification Log` | Selfie/face validation audit. | Phase 1 |
| `Attendance Exception` | GPS/selfie/duplicate/kiosk exception review. | Phase 1 |
| `Kiosk Device` | Kiosk device master. | Phase 1 |
| `Kiosk Device Binding` | Kiosk tenant/company/branch/location mapping. | Phase 1 |
| `Kiosk Policy` | Kiosk settings, admin PIN, offline, verification. | Phase 1 |
| `Kiosk Attendance Log` | Kiosk punch metadata and sync status. | Phase 1 |
| `Audit Log` | Sensitive custom audit events. | Phase 1 |
| `Export Log` | Report/export audit in later reports phase. | Later |

### 11.3 Data Modeling Requirements

| Req ID | Requirement |
| --- | --- |
| DB-TRD-001 | Custom DocTypes must include tenant/company fields where applicable. |
| DB-TRD-002 | Child tables should be used for scoped policy mappings when one policy applies to multiple branches/groups. |
| DB-TRD-003 | Time-based logs should include indexed fields for employee, company, date/time, source, and status. |
| DB-TRD-004 | Kiosk offline sync should use unique client-generated idempotency key. |
| DB-TRD-005 | GPS/selfie logs should store references and metadata, not expose sensitive data broadly. |

## 12. API Requirements

### 12.1 API Groups

| API Group | Required APIs |
| --- | --- |
| Auth | login, logout, request OTP, verify OTP, refresh session, get permissions. |
| Tenant | create tenant, update tenant status, get setup status. |
| Company | create/update company, branch, location. |
| Employee | create, update, search, get profile, link user. |
| Device | register device, approve device, reject device, request reset, approve reset, validate device. |
| Attendance Policy | create/update policy, activate policy, get active policy. |
| Attendance Punch | punch in/out, get current status, validate duplicate, create exception. |
| GPS/Selfie | validate GPS, upload/capture selfie reference, verify selfie/face, log result. |
| Kiosk | register kiosk, bind kiosk, activate/deactivate kiosk, kiosk punch, offline sync, get kiosk status. |
| Exception | list exceptions, filter exceptions, review/approve/reject exception. |
| Dashboard | get summary, get setup status, get kiosk status, get exception count. |
| Audit | view audit logs for authorized roles. |

### 12.2 API Standards

| Req ID | Requirement |
| --- | --- |
| API-TRD-001 | All APIs shall return consistent JSON response structure: success, data, error_code, message, trace_id where applicable. |
| API-TRD-002 | All authenticated APIs shall validate Frappe session or mobile/kiosk token. |
| API-TRD-003 | All APIs shall validate tenant/company scope server-side. |
| API-TRD-004 | APIs that mutate records shall be idempotent where retries are likely, especially kiosk/mobile sync. |
| API-TRD-005 | Sensitive mutation APIs shall create audit logs. |
| API-TRD-006 | API errors shall distinguish validation, permission, auth, not found, conflict, and server errors. |

## 13. Security and Role-Based Access Requirements

| Area | Requirement |
| --- | --- |
| Authentication | Use Frappe login/session for web; define token/session strategy for mobile and kiosk. |
| Authorization | Use Frappe roles, DocType permissions, User Permission, and custom server-side checks. |
| Tenant Isolation | Enforce tenant/company filtering on all queries and reports. |
| Device Binding | Store approved devices and block unauthorized mobile attendance when enabled. |
| Kiosk Security | Device token, active status, branch/location binding, admin PIN. |
| GPS/Selfie Privacy | Restrict access to location and face/selfie data. |
| Audit | Audit login, role changes, policy changes, punch, kiosk actions, exception decisions. |
| Secrets | Store secrets in environment/site config, not code. |
| Transport Security | Enforce HTTPS/SSL in production. |
| Session Security | Force logout/refresh on role changes, device reset, password change, tenant suspension. |

## 14. Performance and Scalability Requirements

| Req ID | Requirement |
| --- | --- |
| PERF-TRD-001 | Login, permission bootstrap, and dashboard summary should respond within 3 seconds under agreed Phase 1 load. |
| PERF-TRD-002 | Online attendance punch should respond within 3 seconds under agreed Phase 1 load. |
| PERF-TRD-003 | Kiosk punch should be optimized for sequential use and reset quickly after each attempt. |
| PERF-TRD-004 | Attendance and kiosk log tables should be indexed by company, employee, timestamp/date, source, and status. |
| PERF-TRD-005 | Dashboard queries should use aggregated counts or optimized reports rather than heavy full-table scans. |
| PERF-TRD-006 | Offline sync should process batches safely and avoid duplicate records. |
| PERF-TRD-007 | Background workers should be available for notification, sync retry, and future report jobs. |

## 15. Deployment Requirements

### 15.1 Infrastructure

| Area | Requirement |
| --- | --- |
| Server | Linux VPS/cloud server sized for Frappe, MariaDB, Redis, workers, and frontend hosting. |
| Web Server | Nginx reverse proxy with SSL. |
| Process Management | Supervisor or Frappe bench standard process management. |
| Database | MariaDB with scheduled backups. |
| Cache/Queue | Redis for Frappe cache and queue. |
| SSL | HTTPS required for all web/mobile/kiosk APIs. |
| Storage | Local or object storage for files/selfies depending on privacy decision. |
| Monitoring | Uptime, disk, CPU, memory, queue, failed jobs, error logs. |

### 15.2 CI/CD

| Req ID | Requirement |
| --- | --- |
| DEP-TRD-001 | CI pipeline should run backend tests, frontend build/lint, and mobile checks where feasible. |
| DEP-TRD-002 | Deployment should support staging and production environments. |
| DEP-TRD-003 | Database migrations/patches should run through Frappe migration process. |
| DEP-TRD-004 | Production deployment must include rollback plan and database backup before release. |
| DEP-TRD-005 | Environment variables and secrets must not be committed to source control. |

### 15.3 Backup and Recovery

| Area | Requirement |
| --- | --- |
| Database backup | Daily automated backups minimum; retention client-approved. |
| File backup | Include Frappe files and private files. |
| Restore test | Periodic restore test before go-live. |
| Release backup | Backup before every production migration. |
| Monitoring alerts | Alert on backup failure, disk usage, service downtime. |

## 16. Testing Requirements

| Testing Type | Required Coverage |
| --- | --- |
| Unit Tests | Backend service rules: tenant filtering, punch validation, duplicate detection, kiosk validation, policy resolver. |
| API Tests | Auth, permissions, tenant, employee, device, attendance, kiosk, exception, dashboard APIs. |
| Permission Tests | Employee own data, manager team data, HR assigned scope, tenant isolation, unauthorized API access. |
| UI Tests | Login, setup screens, employee master, attendance policy, web punch, kiosk setup, exception review, dashboard. |
| Mobile Tests | Login, device binding, punch, GPS permission, selfie capture, offline states. |
| Kiosk Tests | Device token, activation, branch binding, multi-employee punch, offline queue, sync, admin PIN. |
| Integration Tests | Mobile/web/kiosk to backend punch, GPS/selfie logs, exception creation, audit log creation. |
| E2E Tests | Tenant setup -> employee setup -> attendance policy -> device/kiosk setup -> punch -> dashboard/exception. |
| Security Tests | Session expiry, role change logout, tenant isolation, permission denied, token misuse. |
| Performance Tests | Punch API, kiosk sequential punch, dashboard summary under agreed load. |
| UAT Tests | Client-facing scenarios from Phase 1 SRS acceptance criteria. |

## 17. Technical Risks and Mitigation

| Risk ID | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| TRD-RISK-001 | Logical tenant isolation missed in an API/report. | Data leakage. | Central permission utilities, test tenant isolation for every API/report. |
| TRD-RISK-002 | ERPNext standard Attendance fields insufficient for custom metadata. | Rework around attendance logs. | Use `Employee Checkin` plus custom `Kiosk Attendance Log`/validation logs. |
| TRD-RISK-003 | Kiosk verification method not finalized. | Kiosk app/API changes. | Abstract verification service; support configured method. |
| TRD-RISK-004 | Offline kiosk sync creates duplicates. | Attendance disputes. | Use idempotency keys and sync audit status. |
| TRD-RISK-005 | GPS accuracy inconsistent. | False exceptions. | Store accuracy and allow exception review. |
| TRD-RISK-006 | Selfie/face privacy rules unclear. | Compliance issue. | Store restricted references and obtain client policy sign-off. |
| TRD-RISK-007 | Vue frontend and Frappe desk overlap creates duplicate UI. | UX inconsistency. | Decide which screens are custom Vue portal vs Frappe Desk admin. |
| TRD-RISK-008 | Mobile token/session strategy unclear. | Security and implementation delays. | Finalize mobile auth architecture before mobile slice. |
| TRD-RISK-009 | Production sizing unknown. | Performance risk. | Define expected tenants/employees/punch volume before deployment. |

## 18. Recommended Phase 1 Vertical Slice Development Approach

Web, mobile, kiosk, backend, permissions, and tests should be built together only when they belong to the same vertical slice. Avoid building all backend first or all UI first because Phase 1 workflows require end-to-end validation.

| Slice No. | Vertical Slice | Backend | Web | Mobile/Kiosk | Tests |
| --- | --- | --- | --- | --- | --- |
| VS-01 | Auth and Permission Bootstrap | Login, OTP, permissions API, audit | Login, OTP, role shell | Mobile login baseline | Auth/API/role tests |
| VS-02 | Tenant and Company Setup | Tenant, Company, Branch, Location APIs | Tenant/company setup UI | Not required | Tenant isolation tests |
| VS-03 | Employee Setup | Employee create/update/search, user link | Employee master UI | Employee profile read if needed | Employee CRUD/permission tests |
| VS-04 | Attendance Policy Setup | Attendance Policy DocType/API | Attendance settings UI | Fetch policy support | Policy validation tests |
| VS-05 | Mobile/Web Punch | Punch service, device validation, logs | Web punch/status | Mobile punch, GPS/selfie capture | Punch/E2E tests |
| VS-06 | Kiosk Device Setup | Kiosk Device, Binding, Policy APIs | Kiosk setup UI | Kiosk activation/token support | Kiosk setup tests |
| VS-07 | Shared Kiosk Attendance | Kiosk punch API, logs, exceptions | Kiosk monitoring/exception UI | Kiosk attendance UI | Multi-employee kiosk tests |
| VS-08 | Dashboard and Exceptions | Dashboard API, exception review API | HR dashboard, exception review | Status screens if needed | Dashboard/exception tests |

## 19. Open Technical Questions for Client

| Question ID | Area | Question | Recommended Default |
| --- | --- | --- | --- |
| TQ-001 | Tenant model | Single shared Frappe site with logical tenant isolation, or separate site per tenant? | Single shared site for MVP. |
| TQ-002 | OTP provider | Which SMS/OTP provider should be used? | Pluggable provider interface. |
| TQ-003 | Mobile auth | Should mobile use API key/secret, OAuth-like token, or Frappe session wrapper? | Token service wrapping Frappe user session. |
| TQ-004 | Device binding | One active device per employee or multiple approved devices? | One primary active device. |
| TQ-005 | Kiosk hardware | Android tablet/device specs, OS version, camera quality, storage? | Android tablet with reliable front camera and local storage. |
| TQ-006 | Kiosk verification | Face recognition, selfie capture, employee code fallback, or combination? | Selfie/face with employee code fallback. |
| TQ-007 | Kiosk offline | Maximum offline storage period and conflict handling? | 24 hours with admin review for conflicts. |
| TQ-008 | Face/selfie storage | Store image, face template, verification result only, or short-term image? | Store restricted image/reference for Phase 1 until policy finalized. |
| TQ-009 | GPS radius | Default branch/location radius? | Configurable per location. |
| TQ-010 | Expected load | Number of tenants, employees, daily punches, kiosk devices? | Required before production sizing. |
| TQ-011 | Frontend hosting | Host Vue app inside Frappe site or separate static frontend? | Separate Vue build served via Nginx, integrated with Frappe APIs. |
| TQ-012 | Kiosk app form | React Native app, Android native wrapper, or browser kiosk mode? | React Native Android kiosk app for device access/offline queue. |
| TQ-013 | Monitoring | Preferred monitoring stack? | Basic VPS monitoring plus application error logs for MVP. |
| TQ-014 | CI/CD | GitHub Actions or another CI system? | GitHub Actions if repository is GitHub-hosted. |

## 20. Final Technical Recommendation

Build Phase 1 as a custom Frappe app named `hrms_saas` on top of ERPNext/Frappe HRMS, with a separate Vue + Tailwind web portal and React Native mobile/kiosk apps consuming secured Frappe APIs.

Use ERPNext standard DocTypes wherever they fit: `User`, `Role`, `User Permission`, `Company`, `Department`, `Designation`, `Employee`, `Employee Checkin`, `Attendance`, `File`, and standard Frappe audit capabilities. Add custom DocTypes for SaaS tenant isolation, device binding, kiosk device management, attendance policy, GPS/selfie validation logs, attendance exceptions, and custom audit events.

For MVP and Phase 1, use logical multi-tenancy within one Frappe site, but enforce tenant/company/branch/location filtering at DocType, API, report, and permission layers. This must be tested as a first-class security requirement.

Implement Phase 1 through vertical slices:

1. Auth and permission bootstrap.
2. Tenant/company setup.
3. Employee setup.
4. Attendance policy setup.
5. Web/mobile punch with GPS/selfie basics.
6. Kiosk device setup.
7. Shared kiosk attendance.
8. Dashboard and exception review.

Do not build web, mobile, and kiosk screens independently from backend workflows. Each screen should be delivered with its backend API, DocType changes, permissions, audit behavior, and tests when it belongs to the same vertical slice.

Before coding starts, the client should sign off on tenant model, OTP provider, mobile token/session strategy, device binding policy, kiosk hardware, kiosk verification method, kiosk offline limit, face/selfie data retention, GPS radius defaults, and expected production load.
