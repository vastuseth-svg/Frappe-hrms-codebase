# Phase 1 Software Requirement Specification (SRS)

## 1. Purpose and Scope

### 1.1 Purpose

This Software Requirement Specification defines Phase 1 requirements for the Modern SaaS HRMS platform. It converts the Phase 1 Detailed BPMN Flow Document into clear, testable software requirements for business analysis, solution design, development, testing, and UAT.

This SRS will be used later to create:

* Technical Requirement Document (TRD)
* Entity Relationship Diagram (ERD) and Frappe DocType design
* Role/Auth Matrix
* API Contracts
* Frontend and Mobile Contracts
* Vertical Slice Specifications
* Test Cases and UAT Scripts

### 1.2 Project Stack

| Layer | Technology |
| --- | --- |
| Frontend Web | Vue.js + Tailwind CSS |
| Backend | Frappe/ERPNext HRMS |
| Mobile App | React Native or Flutter |
| Database | MariaDB through Frappe DocTypes |
| Architecture | Multi-tenant SaaS |

### 1.3 Phase 1 Scope

Phase 1 includes foundational HRMS features required before advanced shift, leave, payroll, lifecycle, reporting, and integrations.

| Module | Phase 1 Scope |
| --- | --- |
| Authentication/Login | Web and mobile login, logout, session handling, OTP/password flow baseline. |
| Role-based Access | Role-based screen, action, API, and data visibility controls. |
| Tenant/Company Setup | Tenant creation, company setup, branch/location setup, setup status. |
| Employee Setup | Employee master, organization mapping, user account linking, sales employee identification. |
| Basic Attendance Setup | Attendance policy, punch channels, GPS/selfie flags, duplicate punch rules. |
| Web/Mobile Punch In-Out | Employee attendance capture from allowed web/mobile channel. |
| GPS/Selfie Validation | Basic policy-based GPS and selfie/face capture validation. |
| Kiosk Device Setup | Kiosk registration, binding, activation, admin control. |
| Shared Kiosk Attendance | Multi-employee attendance from registered shared kiosk device. |
| Admin/HR Dashboard Basics | Foundation dashboard for tenant/company, employees, attendance, kiosk, and exceptions. |
| Attendance Exception Review | Review of GPS, selfie, duplicate, kiosk, and validation exceptions. |

### 1.4 Out of Scope for Phase 1

| Area | Reason |
| --- | --- |
| Full payroll processing | Planned after attendance, shift, leave, and salary setup. |
| Advanced shift/roster/OT | Planned for later workforce phase. |
| Leave management | Planned for later phase. |
| Full sales tracking | Phase 1 supports basics only if using common attendance; detailed sales field tracking is later. |
| Performance, helpdesk, asset, exit/F&F | Planned after foundation and payroll dependencies. |
| Advanced MIS builder | Planned after transaction modules are stable. |

## 2. User Roles

| Role | Description | Phase 1 Access Summary |
| --- | --- | --- |
| Super Admin | Platform-level SaaS administrator. | Tenant setup, tenant status, platform dashboard basics. |
| Tenant Admin | Company/tenant administrator. | Company setup, role assignment, branch/location setup, dashboard basics. |
| HR Admin | HR operations user. | Employee setup, attendance setup, kiosk setup support, attendance exceptions, HR dashboard. |
| Payroll Admin | Payroll user. | Limited Phase 1 visibility to employee/attendance data for future payroll readiness. |
| Reporting Manager | Manager with team responsibility. | Team attendance visibility and exception/regularization view where configured. |
| Employee | Standard employee self-service user. | Own login, own profile basics, own web/mobile punch, own attendance status. |
| Sales Employee | Employee with sales/field designation. | Own login and attendance; detailed sales tracking later. |
| Kiosk Admin / Device Admin | User responsible for kiosk device setup and support. | Kiosk registration, binding, activation, device status, kiosk exception support. |
| Auditor | Read-only audit/report user. | View audit logs and foundation reports if configured. |
| System | Automated backend services. | Validation, permission checks, attendance rules, logs, dashboard aggregation. |

## 3. Functional Requirements Module-wise

### 3.1 Authentication/Login

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-AUTH-001 | The system shall allow active users to log in through the web portal using username/email/mobile and password. | Must | Login test with active user. |
| FR-AUTH-002 | The system shall support OTP-based login or OTP verification where configured. | Must | OTP request and verify test. |
| FR-AUTH-003 | The mobile app shall authenticate employees before allowing any self-service or attendance action. | Must | Mobile login test. |
| FR-AUTH-004 | The system shall reject login for disabled users. | Must | Disabled user login test. |
| FR-AUTH-005 | The system shall reject login for users belonging to inactive/suspended tenants. | Must | Suspended tenant login test. |
| FR-AUTH-006 | The system shall create a user session after successful login. | Must | Session/token validation test. |
| FR-AUTH-007 | The system shall invalidate the user session on logout. | Must | Logout/token invalidation test. |
| FR-AUTH-008 | The system shall show role-appropriate dashboard after successful login. | Must | Role dashboard test. |
| FR-AUTH-009 | The system shall log successful and failed login attempts. | Must | Audit log verification. |
| FR-AUTH-010 | The system shall provide forgot password and password reset flow. | Should | Password reset test. |

### 3.2 Role-Based Access Control

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-RBAC-001 | The system shall enforce role-based access for screens, menus, actions, reports, and APIs. | Must | Role permission test. |
| FR-RBAC-002 | The frontend shall display navigation items based on backend-returned permissions. | Must | UI permission test. |
| FR-RBAC-003 | The backend shall enforce permissions even if an unauthorized API is called directly. | Must | Direct API negative test. |
| FR-RBAC-004 | The system shall restrict employee users to their own data. | Must | Cross-employee access test. |
| FR-RBAC-005 | The system shall restrict managers to assigned team data. | Must | Team access test. |
| FR-RBAC-006 | The system shall restrict tenant users to their own tenant/company data. | Must | Tenant isolation test. |
| FR-RBAC-007 | The system shall log sensitive denied access attempts. | Should | Denied access audit test. |
| FR-RBAC-008 | The system shall support Super Admin, Tenant Admin, HR Admin, Payroll Admin, Manager, Employee, Sales Employee, Kiosk Admin, and Auditor roles. | Must | Role setup test. |

### 3.3 Tenant/Company Setup

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-TEN-001 | Super Admin shall be able to create a tenant. | Must | Tenant creation test. |
| FR-TEN-002 | The system shall prevent duplicate tenant identifiers. | Must | Duplicate tenant test. |
| FR-TEN-003 | The system shall create or link a company under the tenant. | Must | Company setup test. |
| FR-TEN-004 | The system shall allow Tenant Admin to complete company profile details. | Must | Company profile update test. |
| FR-TEN-005 | The system shall allow authorized users to create branch and location masters. | Must | Branch/location CRUD test. |
| FR-TEN-006 | The system shall maintain tenant/company/branch/location context for every Phase 1 business record. | Must | Record data validation. |
| FR-TEN-007 | The system shall show a setup checklist for incomplete tenant/company setup. | Should | Setup checklist test. |
| FR-TEN-008 | The system shall block kiosk binding if branch/location does not exist. | Must | Kiosk binding negative test. |

### 3.4 Employee Setup

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-EMP-001 | HR Admin shall be able to create an employee master record. | Must | Employee creation test. |
| FR-EMP-002 | The system shall require employee code, employee name, company, branch/location, department, designation, and status for active employees. | Must | Mandatory field validation. |
| FR-EMP-003 | The system shall prevent duplicate employee code within the same tenant/company. | Must | Duplicate employee test. |
| FR-EMP-004 | The system shall allow HR Admin to assign a reporting manager. | Must | Manager assignment test. |
| FR-EMP-005 | The system shall allow creation/linking of a user account for employee self-service access. | Must | User mapping test. |
| FR-EMP-006 | The system shall assign Employee or Sales Employee role based on employee category/designation. | Must | Role assignment test. |
| FR-EMP-007 | The system shall allow HR Admin to search and filter employees. | Must | Search/filter test. |
| FR-EMP-008 | The system shall audit employee creation and sensitive employee updates. | Must | Audit verification. |

### 3.5 Basic Attendance Setup

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-ATTSET-001 | HR Admin shall be able to configure allowed attendance channels: web, mobile, and kiosk. | Must | Attendance policy test. |
| FR-ATTSET-002 | HR Admin shall be able to enable or disable GPS validation. | Must | GPS setting test. |
| FR-ATTSET-003 | HR Admin shall be able to enable or disable selfie/face validation. | Must | Selfie setting test. |
| FR-ATTSET-004 | The system shall support duplicate punch prevention window configuration. | Must | Duplicate rule test. |
| FR-ATTSET-005 | The system shall allow attendance policy mapping by company, branch/location, or employee group where configured. | Must | Policy scope test. |
| FR-ATTSET-006 | The system shall validate policy completeness before activation. | Must | Incomplete policy test. |
| FR-ATTSET-007 | The system shall audit attendance policy changes. | Must | Audit verification. |

### 3.6 Web/Mobile Punch In-Out

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-PUNCH-001 | An authenticated employee shall be able to punch in from an allowed web or mobile channel. | Must | Punch-in test. |
| FR-PUNCH-002 | An authenticated employee shall be able to punch out from an allowed web or mobile channel. | Must | Punch-out test. |
| FR-PUNCH-003 | The system shall validate active employee status before accepting punch. | Must | Inactive employee test. |
| FR-PUNCH-004 | The system shall validate attendance channel permission before accepting punch. | Must | Disabled channel test. |
| FR-PUNCH-005 | The system shall validate approved mobile device if device binding is enabled. | Must | Unauthorized device test. |
| FR-PUNCH-006 | The system shall capture punch type, timestamp, source, employee, tenant, company, and device where applicable. | Must | Data record verification. |
| FR-PUNCH-007 | The system shall block or flag duplicate punches based on configured duplicate window. | Must | Duplicate punch test. |
| FR-PUNCH-008 | The system shall show punch success/failure status to the employee. | Must | UI feedback test. |
| FR-PUNCH-009 | The system shall create or update attendance status after successful punch. | Must | Attendance status test. |

### 3.7 GPS/Selfie Validation

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-VAL-001 | The system shall request GPS coordinates when GPS validation is enabled for the employee/channel. | Must | GPS prompt test. |
| FR-VAL-002 | The system shall capture latitude, longitude, accuracy, timestamp, and source for GPS validation. | Must | GPS log verification. |
| FR-VAL-003 | The system shall validate GPS against configured branch/location radius where configured. | Must | Geo-radius test. |
| FR-VAL-004 | The system shall request selfie/face capture when validation is enabled. | Must | Selfie capture test. |
| FR-VAL-005 | The system shall store selfie/face verification status and reference. | Must | Verification log test. |
| FR-VAL-006 | The system shall block or create exception for failed GPS/selfie validation based on policy. | Must | Failed validation test. |
| FR-VAL-007 | The system shall not silently approve attendance when required validation fails. | Must | Negative validation test. |

### 3.8 Kiosk Device Setup

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-KIOSKSET-001 | Kiosk Admin/authorized admin shall be able to register a kiosk device. | Must | Kiosk registration test. |
| FR-KIOSKSET-002 | The system shall store kiosk device identifier/fingerprint. | Must | Device data verification. |
| FR-KIOSKSET-003 | The system shall prevent duplicate active kiosk device registration. | Must | Duplicate device test. |
| FR-KIOSKSET-004 | The system shall require kiosk binding to tenant, company, branch, and location. | Must | Binding validation test. |
| FR-KIOSKSET-005 | The system shall block kiosk activation until required binding and policy are complete. | Must | Activation negative test. |
| FR-KIOSKSET-006 | The system shall support kiosk activation and deactivation. | Must | Status change test. |
| FR-KIOSKSET-007 | The system shall support kiosk admin PIN setup for kiosk mode control. | Must | PIN setup test. |
| FR-KIOSKSET-008 | The system shall audit kiosk registration, binding, activation, deactivation, and policy changes. | Must | Audit verification. |

### 3.9 Shared Kiosk Attendance

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-KIOSKATT-001 | An active registered kiosk shall allow multiple employees to mark attendance sequentially. | Must | Multi-employee kiosk test. |
| FR-KIOSKATT-002 | The kiosk shall validate active device session before accepting attendance. | Must | Inactive session test. |
| FR-KIOSKATT-003 | The system shall reject attendance from inactive or unbound kiosk devices. | Must | Inactive/unbound kiosk test. |
| FR-KIOSKATT-004 | The kiosk shall identify employee using configured verification method. | Must | Employee identification test. |
| FR-KIOSKATT-005 | The system shall validate employee active status before saving kiosk attendance. | Must | Inactive employee kiosk test. |
| FR-KIOSKATT-006 | Kiosk attendance shall capture kiosk device ID, branch, location, employee, punch type, timestamp, and verification status. | Must | Kiosk log verification. |
| FR-KIOSKATT-007 | The kiosk shall reset to ready state after each attendance attempt. | Must | Sequential user test. |
| FR-KIOSKATT-008 | The system shall block or flag duplicate kiosk punches based on configured rule. | Must | Duplicate kiosk punch test. |
| FR-KIOSKATT-009 | The system shall support offline kiosk queue if offline mode is enabled. | Should | Offline queue test. |
| FR-KIOSKATT-010 | Offline kiosk records shall sync with audit status when network is restored. | Should | Sync test. |

### 3.10 Attendance Exception Review

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-EXC-001 | The system shall create attendance exceptions for failed GPS, selfie/face, duplicate, kiosk, device, or validation issues where policy allows review. | Must | Exception creation test. |
| FR-EXC-002 | HR Admin shall be able to view attendance exception list. | Must | Exception list test. |
| FR-EXC-003 | HR Admin shall be able to filter exceptions by date, employee, source, type, status, and branch/location. | Should | Filter test. |
| FR-EXC-004 | Authorized users shall be able to mark exception status as reviewed, approved, rejected, or pending based on workflow. | Must | Exception action test. |
| FR-EXC-005 | Exception actions shall be audited with actor, timestamp, status, and remarks. | Must | Audit test. |

### 3.11 Admin/HR Dashboard Basics

| Req ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| FR-DASH-001 | Super Admin shall see tenant/platform dashboard basics. | Must | Super Admin dashboard test. |
| FR-DASH-002 | Tenant Admin shall see company setup and configuration status. | Must | Tenant dashboard test. |
| FR-DASH-003 | HR Admin shall see employee count, attendance summary, kiosk status, and exception count. | Must | HR dashboard test. |
| FR-DASH-004 | Dashboard data shall be filtered by tenant/company/branch permissions. | Must | Dashboard permission test. |
| FR-DASH-005 | Dashboard quick actions shall follow user permissions. | Must | Quick action access test. |
| FR-DASH-006 | Dashboard shall show setup pending indicators for missing foundation configuration. | Should | Setup indicator test. |

## 4. Non-Functional Requirements

| NFR ID | Requirement | Priority | Verification |
| --- | --- | --- | --- |
| NFR-SEC-001 | All authenticated APIs shall validate session token and role permission server-side. | Must | API security test. |
| NFR-SEC-002 | All tenant-scoped APIs shall enforce tenant/company filtering server-side. | Must | Tenant isolation test. |
| NFR-SEC-003 | Sensitive events shall create audit logs. | Must | Audit verification. |
| NFR-SEC-004 | Passwords and tokens shall be handled using Frappe security standards. | Must | Security review. |
| NFR-PRV-001 | Selfie/face and GPS data shall be stored securely with restricted access. | Must | Access/security test. |
| NFR-PERF-001 | Login and dashboard summary APIs should respond within 3 seconds under agreed Phase 1 load. | Should | Performance test. |
| NFR-PERF-002 | Attendance punch API should return success/failure within 3 seconds when online. | Should | Performance test. |
| NFR-AVL-001 | Kiosk shall show clear offline/online status where offline queue is enabled. | Should | Offline test. |
| NFR-UX-001 | Web UI shall be responsive for desktop and tablet admin use. | Must | UI test. |
| NFR-UX-002 | Mobile attendance screens shall be optimized for small screens and quick punch flow. | Must | Mobile UI test. |
| NFR-COMP-001 | System shall be compatible with MariaDB through Frappe DocTypes. | Must | Technical review. |
| NFR-MAINT-001 | Requirements shall be traceable from SRS to BPMN, API, frontend, backend, and test cases. | Must | Traceability review. |

## 5. Business Rules

| Rule ID | Business Rule | Applies To |
| --- | --- | --- |
| BR-P1-001 | Every Phase 1 business record must include tenant/company context. | All modules |
| BR-P1-002 | Branch/location is required before kiosk device binding. | Kiosk |
| BR-P1-003 | Employee code must be unique within tenant/company. | Employee |
| BR-P1-004 | Active employee status is required before attendance can be marked. | Attendance |
| BR-P1-005 | Attendance channel must be enabled before punch is accepted. | Attendance |
| BR-P1-006 | Mobile punch requires approved device when device binding is enabled. | Mobile attendance |
| BR-P1-007 | Kiosk attendance requires registered, active, bound kiosk device. | Kiosk attendance |
| BR-P1-008 | One kiosk can capture attendance for multiple employees. | Kiosk attendance |
| BR-P1-009 | GPS/selfie validation is policy-driven. | Attendance validation |
| BR-P1-010 | Failed required validation must not be silently approved. | Attendance validation |
| BR-P1-011 | Duplicate punch must be blocked or flagged based on configured duplicate window. | Attendance |
| BR-P1-012 | Dashboard and reports must respect role and tenant scope. | Dashboard |
| BR-P1-013 | Sensitive setup, login, permission, attendance, and kiosk actions must be audited. | Audit |

## 6. Data Requirements

### 6.1 Core Data Entities / Suggested Frappe DocTypes

| Entity / DocType | Purpose | Key Data Fields |
| --- | --- | --- |
| `User` | Login identity | email, mobile, enabled, roles |
| `Role` | Role definition | role name, permissions |
| `User Permission` | Record-level restriction | user, allowed doctype, allowed value |
| `Tenant` | SaaS tenant | tenant ID, name, status, plan |
| `Company` | Company master | company name, tenant, status |
| `Branch` | Branch master | branch name, company, location |
| `Location` | Work/kiosk/GPS location | name, latitude, longitude, radius |
| `Department` | Department master | department name, company |
| `Designation` | Designation master | designation name, company |
| `Employee` | Employee master | code, name, company, branch, department, designation, manager, status |
| `Employee Device` | Mobile device binding | employee, device ID, status, approved by |
| `Attendance Policy` | Basic attendance rules | channel flags, GPS flag, selfie flag, duplicate window, scope |
| `Employee Checkin` | Raw punch record | employee, log type, time, device/source |
| `Attendance` | Attendance result | employee, date, status, company |
| `Kiosk Device` | Kiosk master | device ID, name, status, token |
| `Kiosk Device Binding` | Kiosk mapping | kiosk, tenant, company, branch, location |
| `Kiosk Policy` | Kiosk settings | admin PIN flag, offline flag, verification rule |
| `Kiosk Attendance Log` | Kiosk punch detail | kiosk, employee, punch type, timestamp, verification status |
| `GPS Validation Log` | GPS audit | employee, latitude, longitude, accuracy, result |
| `Face Verification Log` | Selfie/face audit | employee, image reference/status, result |
| `Attendance Exception` | Review queue | employee, exception type, source, status, remarks |
| `Audit Log` | Sensitive event audit | actor, action, module, timestamp, old/new values |

### 6.2 Data Validation Requirements

| Req ID | Requirement |
| --- | --- |
| DR-001 | Tenant, company, and branch/location references shall be validated before saving dependent records. |
| DR-002 | Employee code shall be unique within tenant/company. |
| DR-003 | Kiosk device ID/fingerprint shall be unique for active kiosk devices. |
| DR-004 | Attendance punch shall not be saved without employee, punch type, timestamp, source, and tenant/company context. |
| DR-005 | GPS records shall include coordinates, accuracy, timestamp, and validation result. |
| DR-006 | Exception records shall include exception type, source, employee/device reference, status, and created timestamp. |

## 7. Interface Requirements

### 7.1 Web Interface Requirements: Vue.js + Tailwind CSS

| UI ID | Screen / UI Area | Users | Requirement |
| --- | --- | --- | --- |
| UI-WEB-001 | Login Screen | All web users | Shall allow username/email/mobile and password login. |
| UI-WEB-002 | OTP Screen | Configured users | Shall allow OTP entry, resend, and expiry messaging. |
| UI-WEB-003 | Role-based App Shell | All web users | Shall render menu/sidebar based on backend permissions. |
| UI-WEB-004 | Tenant Setup | Super Admin | Shall support tenant creation and activation status. |
| UI-WEB-005 | Company Setup | Tenant Admin | Shall support company profile setup. |
| UI-WEB-006 | Branch/Location Master | Tenant Admin, HR Admin | Shall support CRUD for branch and location. |
| UI-WEB-007 | Employee Master | HR Admin | Shall support create, edit, view, search, and filter employees. |
| UI-WEB-008 | Attendance Settings | HR Admin | Shall configure channels, GPS/selfie, duplicate rules, and scope. |
| UI-WEB-009 | Web Punch | Employee | Shall allow punch in/out where web channel is enabled. |
| UI-WEB-010 | Kiosk Device Setup | Kiosk Admin, HR Admin | Shall register, bind, activate, deactivate kiosk. |
| UI-WEB-011 | Attendance Exception Review | HR Admin | Shall list, filter, review, and update exception status. |
| UI-WEB-012 | Admin/HR Dashboard | Super Admin, Tenant Admin, HR Admin | Shall show role-based Phase 1 metrics and setup status. |

### 7.2 Mobile App Interface Requirements: React Native or Flutter

| UI ID | Screen / UI Area | Users | Requirement |
| --- | --- | --- | --- |
| UI-MOB-001 | Mobile Login | Employee, Sales Employee, Manager | Shall authenticate user before app access. |
| UI-MOB-002 | Mobile OTP | Mobile users | Shall verify OTP where configured. |
| UI-MOB-003 | Device Registration | Employee, Sales Employee | Shall register device for attendance where binding is enabled. |
| UI-MOB-004 | Mobile Punch | Employee, Sales Employee | Shall allow quick punch in/out from approved device. |
| UI-MOB-005 | GPS Permission Prompt | Mobile attendance users | Shall request GPS permission when required. |
| UI-MOB-006 | Selfie Capture | Mobile attendance users | Shall capture selfie/face when required. |
| UI-MOB-007 | Attendance Status | Employee, Sales Employee | Shall show last/current punch status. |
| UI-MOB-008 | Validation Error | Employee, Sales Employee | Shall show clear blocked/exception/retry messages. |

### 7.3 Kiosk Interface Requirements

| UI ID | Screen / UI Area | Users | Requirement |
| --- | --- | --- | --- |
| UI-KSK-001 | Kiosk Attendance Screen | Employees | Shall allow shared sequential employee attendance. |
| UI-KSK-002 | Kiosk Employee Identification | Employees | Shall support configured face/selfie/code method. |
| UI-KSK-003 | Kiosk Success/Failure Feedback | Employees | Shall show clear confirmation after each attempt. |
| UI-KSK-004 | Kiosk Offline Status | Kiosk Admin | Shall show offline queue/sync status if enabled. |
| UI-KSK-005 | Kiosk Admin PIN | Kiosk Admin | Shall require admin PIN for kiosk mode exit/control. |

### 7.4 Backend/API Interface Requirements

| API Area | Requirement |
| --- | --- |
| Authentication API | Shall support login, logout, OTP request, OTP verification, session validation. |
| Permission API | Shall return user menu/action/data permissions. |
| Tenant API | Shall support tenant creation, status update, and setup status. |
| Company API | Shall support company, branch, and location setup. |
| Employee API | Shall support employee create, update, search, view, and user linking. |
| Attendance Policy API | Shall support policy create/update/activate and fetch active policy. |
| Punch API | Shall support web/mobile punch in/out. |
| GPS/Selfie API | Shall validate GPS and selfie/face status. |
| Kiosk API | Shall support register, bind, activate, deactivate, punch, and offline sync. |
| Exception API | Shall support list, filter, review, approve/reject, and audit exceptions. |
| Dashboard API | Shall return role-filtered summary and setup status. |

## 8. Reporting Requirements

| Report ID | Report | Users | Requirement |
| --- | --- | --- | --- |
| RPT-P1-001 | Tenant Setup Status | Super Admin, Tenant Admin | Show tenant/company setup completion. |
| RPT-P1-002 | Employee Master Summary | HR Admin, Tenant Admin | Show employee count by status, branch, department. |
| RPT-P1-003 | Daily Attendance Summary | HR Admin, Manager | Show present, absent/pending, punch source summary. |
| RPT-P1-004 | Kiosk Device Status | HR Admin, Kiosk Admin | Show active/inactive kiosks, branch/location, sync status. |
| RPT-P1-005 | Kiosk Attendance Log | HR Admin, Kiosk Admin | Show kiosk punches by employee, date, device, location. |
| RPT-P1-006 | Attendance Exception Report | HR Admin, Manager | Show exception type, employee, source, status, date. |
| RPT-P1-007 | Login and Access Audit Report | Tenant Admin, Auditor | Show login attempts and sensitive access events. |

## 9. Acceptance Criteria

### 9.1 Authentication and RBAC

* Active users can login and logout successfully.
* Disabled users cannot login.
* Suspended tenant users cannot login.
* Role-based dashboard opens after login.
* Employee cannot access another employee’s data.
* Manager can access only reporting team data.
* Backend blocks unauthorized direct API calls.

### 9.2 Tenant/Company Foundation

* Super Admin can create tenant.
* Tenant Admin can configure company profile.
* Branch and location masters can be created.
* Duplicate tenant identifiers are blocked.
* Business records carry tenant/company context.

### 9.3 Employee Setup

* HR Admin can create employee records.
* Duplicate employee code is blocked.
* Employee can be linked to company, branch, department, designation, and manager.
* Employee user account can be created and assigned role.
* Sales Employee category/role can be identified.

### 9.4 Attendance Setup and Punch

* HR Admin can configure attendance policy.
* Employee can punch in/out from enabled channel.
* Disabled attendance channel blocks punch.
* Unauthorized mobile device is blocked if device binding is enabled.
* Duplicate punch is blocked or flagged.
* Attendance log captures employee, time, type, source, and validation result.

### 9.5 GPS/Selfie Validation

* GPS is requested and captured when required.
* Selfie/face is requested and captured when required.
* Failed GPS/selfie validation blocks punch or creates exception based on policy.
* Validation logs are stored and auditable.

### 9.6 Kiosk

* Kiosk device can be registered.
* Kiosk can be bound to tenant/company/branch/location.
* Kiosk cannot capture attendance until active.
* Active kiosk can capture attendance for multiple employees sequentially.
* Kiosk attendance stores device, branch/location, employee, timestamp, punch type, and verification status.
* Kiosk resets after each attendance attempt.
* Kiosk exceptions are created for failed or blocked attempts.

### 9.7 Dashboard and Exceptions

* Super Admin, Tenant Admin, and HR Admin see role-based dashboard.
* Dashboard data is tenant/company/branch filtered.
* HR Admin can view attendance exception queue.
* Exception actions are audited.
* Kiosk status and attendance exception counts are visible to authorized roles.

## 10. Risks and Open Client Questions

### 10.1 Risks

| Risk ID | Risk | Impact | Mitigation |
| --- | --- | --- | --- |
| RISK-P1-001 | Tenant isolation not designed correctly at the DocType/API level. | Cross-tenant data leakage. | Enforce tenant/company in DocTypes, permissions, and server-side filters. |
| RISK-P1-002 | Device binding policy unclear. | Attendance disputes and rework. | Get client sign-off on one-device/multiple-device rules. |
| RISK-P1-003 | Kiosk hardware or verification method not finalized. | Kiosk attendance implementation delay. | Confirm device specs and verification fallback. |
| RISK-P1-004 | GPS accuracy varies by device/location. | False punch rejection. | Capture accuracy and allow exception review. |
| RISK-P1-005 | Selfie/face storage privacy requirements unclear. | Security/compliance issue. | Confirm storage, retention, and access rules. |
| RISK-P1-006 | Offline kiosk behavior unclear. | Sync conflicts and attendance disputes. | Confirm offline duration and conflict handling. |
| RISK-P1-007 | Dashboard expectations expand beyond Phase 1. | Scope creep. | Freeze Phase 1 dashboard cards. |

### 10.2 Open Client Questions

| Question ID | Area | Question | Suggested Default |
| --- | --- | --- | --- |
| Q-P1-001 | OTP | What should be OTP expiry, retry, and resend limits? | 5-minute expiry, 3 retries; client approval required. |
| Q-P1-002 | Password | What password complexity should be enforced? | 8-12 chars with uppercase, lowercase, number, special char; client approval required. |
| Q-P1-003 | Device Binding | Should employee attendance allow one primary device only? | One primary active device; client approval required. |
| Q-P1-004 | Device Reset | Who approves device replacement? | HR Admin approval, Tenant Admin escalation. |
| Q-P1-005 | Kiosk Verification | Should kiosk use face recognition, selfie, employee code fallback, or a combination? | Face/selfie with employee code fallback; client approval required. |
| Q-P1-006 | Kiosk Offline | How long can kiosk store offline punches? | 24 hours; client approval required. |
| Q-P1-007 | GPS Radius | What radius should be used for branch/location validation? | Branch/location configurable radius; client approval required. |
| Q-P1-008 | Duplicate Punch | What duplicate punch window should be applied? | 5 minutes; client approval required. |
| Q-P1-009 | Exception Approval | Who can approve GPS/selfie/kiosk attendance exceptions? | HR Admin and Reporting Manager based on workflow. |
| Q-P1-010 | Dashboard | Which exact dashboard cards are required in Phase 1? | Employee count, present count, absent/pending count, kiosk status, exception count. |

## 11. Traceability to Phase 1 BPMN Processes

| BPMN Process | SRS Modules Covered |
| --- | --- |
| User Authentication and Login Flow | Authentication/Login |
| Role-Based Access and Permission Resolution Flow | Role-based Access Control |
| Tenant and Company Setup Flow | Tenant/Company Setup |
| Employee Setup Flow | Employee Setup |
| Basic Attendance Setup Flow | Basic Attendance Setup |
| Employee Mobile/Web Punch In and Punch Out Flow | Web/Mobile Punch In-Out |
| Kiosk Device Setup and Binding Flow | Kiosk Device Setup |
| Shared Kiosk Multi-Employee Attendance Flow | Shared Kiosk Attendance |
| GPS and Selfie Attendance Validation Flow | GPS/Selfie Validation |
| Admin and HR Dashboard Basics Flow | Admin/HR Dashboard Basics |

## 12. Phase 1 SRS Sign-off Checklist

| Item | Status |
| --- | --- |
| Phase 1 modules confirmed | Required |
| Kiosk included in Phase 1 scope | Required |
| Role list approved | Required |
| Tenant/company isolation approach approved | Required |
| Employee mandatory fields approved | Required |
| Attendance policy defaults approved | Required |
| Device binding policy approved | Required |
| GPS/selfie policy approved | Required |
| Kiosk verification method approved | Required |
| Kiosk offline policy approved | Required |
| Dashboard cards approved | Required |
| Exception review ownership approved | Required |
