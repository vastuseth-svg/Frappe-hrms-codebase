# Phase-wise Development Planning Document

## 1. Document Overview

This document defines the practical, dependency-based development phases for the Shree HRMS SaaS Platform.

The purpose of this document is to convert the RFP, BRD, BPMN Process Diagram Index, and client clarification into an implementation-ready phase plan. It explains what should be built first, why each phase comes in that order, which BPMN processes belong to each phase, and what must be ready for development, testing, and UAT.

Phase planning is required because HRMS modules are highly dependent on each other. Employee master, organization hierarchy, roles, and company setup must exist before attendance, leave, payroll, approvals, mobile workflows, kiosk attendance, and reports can work correctly.

This document will be used later to create:

* Phase-wise detailed BPMN step flow documents
* Phase-wise SRS documents
* Phase-wise vertical slices
* Phase-wise API contracts
* Phase-wise frontend contracts
* Phase-wise test cases
* Phase-wise UAT documents

## 2. Source Documents Analyzed

| Document Name | Purpose | Used For Phase Planning |
| ------------- | ------- | ----------------------- |
| `1.1ShreeHrms_RFP.md` | Defines full HRMS SaaS scope, modules, mobile app, kiosk attendance, payroll, workflow, reports, SaaS management, migration, and acceptance criteria. | Used to identify complete module scope, actor coverage, delivery expectations, and high-level business priorities. |
| `1.2Shree_HRMS_Attendence_payrol.md` | Defines attendance, salary days, salary cycle, overtime, weekly off, late mark, salary components, mobile attendance, kiosk attendance, and sales face mapping rules. | Used to identify attendance/payroll dependencies, rule-engine phases, kiosk flows, mobile flows, exception flows, and payroll calculation sequence. |
| `Shree_HRMS_BRD.md` | Consolidates requirements into business baseline and defines employee, attendance, payroll, mobile, sales, leave, workflow, reporting, migration, and implementation assumptions. | Used to structure scope, business rules, actors, acceptance criteria, and phase readiness. |
| `BPMN_Process_Diagram_Index_Document.md` | Lists all BPMN process diagrams required for development planning. | Used to map BPMN process IDs to development phases and identify missing phase-specific BPMN diagrams. |
| Additional Client Meeting Clarification | Confirms kiosk attendance is in scope. | Used to include kiosk device setup, kiosk binding, shared kiosk attendance, kiosk verification, offline sync, and exception handling in early development phases. |

## 3. Phase Planning Methodology

The phases are created using business priority, technical dependency, module dependency, testing order, and UAT readiness.

The methodology follows these rules:

* Foundation modules are planned first because all transactions depend on tenant, company, roles, permissions, and master data.
* Security and access control are planned before employee, attendance, payroll, reports, and mobile workflows.
* Employee master and organization hierarchy are planned before attendance, leave, payroll, assets, performance, and exit.
* Mobile login and device binding are planned before mobile attendance.
* Kiosk device registration, kiosk device binding, and kiosk branch/location mapping are planned before shared kiosk attendance.
* Attendance capture is planned before shift, overtime, weekly off, leave, and payroll calculations.
* Sales attendance is planned after mobile security and before advanced payroll dependency.
* Shift, roster, overtime, weekly off, and comp-off are planned before payroll because they affect payable days and earnings.
* Leave and holiday are planned before payroll because leave, weekly off, and holiday policies affect salary days and deductions.
* Payroll core is planned after attendance, shift, leave, holiday, and salary structure setup.
* Payroll extensions such as loans, advances, salary revision, arrears, and statutory reports are planned after payroll core.
* Reports, notifications, audit logs, and integrations are planned after core transactions are stable.
* Data migration, UAT, deployment, and go-live are planned at the end after core workflows are ready for validation.

## 4. Confirmed Scope Summary

| Scope Area | Included? | Notes |
| ---------- | --------- | ----- |
| SaaS tenant setup | Yes | Required for multi-tenant HRMS platform. |
| Company setup | Yes | Required before employee and policy setup. |
| Role and permission | Yes | Required before all transaction modules. |
| Employee master | Yes | Required before attendance, leave, payroll, assets, performance, and exit. |
| Organization hierarchy | Yes | Required for reporting manager, workflows, approvals, and dashboards. |
| Mobile app login | Yes | Required before mobile employee self-service and mobile attendance. |
| Device binding | Yes | Required for secure mobile attendance and sales attendance. |
| Mobile attendance | Yes | Individual employee login-based attendance. |
| Sales attendance | Yes | Sales employee attendance with GPS tracking and face/selfie verification. |
| GPS validation | Yes | Required for mobile and sales attendance. |
| Face/selfie verification | Yes | Required for mobile, sales, and kiosk attendance policies. |
| Kiosk attendance | Yes | Confirmed in scope by client. |
| Kiosk offline sync | Yes | Required for kiosk operation where network is unavailable. |
| Attendance rules | Yes | Required for grace, late, early exit, half-day, full-day, missing punch, and exceptions. |
| Shift management | Yes | Required for shift-based attendance and payroll. |
| Overtime | Yes | Required for shift-based, cross-day, holiday, and weekly off OT. |
| Weekly off / comp-off | Yes | Required for payroll and leave integration. |
| Leave management | Yes | Required before payroll payable-days calculation. |
| Holiday management | Yes | Required before attendance and payroll processing. |
| Payroll | Yes | Core salary processing required. |
| Payslip | Yes | Required after payroll approval. |
| Statutory compliance | Yes | PF, ESIC, PT, TDS, LWF, bonus, gratuity, arrears, and reports. |
| Loans and advances | Yes | Required as payroll extension. |
| Salary revision | Yes | Required with approval, history, bulk upload, and arrears. |
| Employee lifecycle | Yes | Onboarding, confirmation, profile, and document flows. |
| Exit management | Yes | Required with clearance and full and final settlement. |
| Asset management | Yes | Required for allocation, return, and exit clearance. |
| Helpdesk | Yes | Required for HR ticketing and SLA flow. |
| Performance | Yes | Required for PMS, KPI, KRA, appraisal, and recommendations. |
| Reports and analytics | Yes | Required for HR, attendance, leave, payroll, workforce, and MIS. |
| Notifications | Yes | Required for workflow, mobile, attendance, payroll, and reminders. |
| Audit logs | Yes | Required across critical modules. |
| Data migration | Yes | Required before production UAT/go-live. |
| Deployment and UAT | Yes | Required for final acceptance and go-live. |

## 5. Development Phase Summary

| Phase No. | Phase Name | Main Goal | Main Modules | Priority | Output |
| --------- | ---------- | --------- | ------------ | -------- | ------ |
| Phase 0 | Scope Freeze and Requirement Finalization | Confirm scope, priorities, kiosk policies, payroll rules, and UAT boundaries. | Requirements, BPMN planning, UAT planning | High | Signed scope baseline and phase plan. |
| Phase 1 | Platform Foundation and Master Setup | Build tenant, company, roles, employee master, and organization foundation. | SaaS, company, roles, employee master, hierarchy | High | Usable HRMS foundation. |
| Phase 2 | Mobile Security, Device Binding, and Kiosk Foundation | Build secure mobile access and kiosk device setup before attendance. | Mobile login, device binding, kiosk registration, kiosk mapping | High | Secure mobile/kiosk foundation. |
| Phase 3 | Attendance Core | Build standard attendance capture, rules, regularization, GPS, face/selfie verification, and kiosk attendance. | Attendance, kiosk attendance, GPS, verification, offline sync | High | Attendance capture ready for UAT. |
| Phase 4 | Sales Attendance and Field Tracking | Build sales mobile attendance, GPS tracking, face mapping, and territory/client tagging. | Sales attendance, field tracking, sales reports base | High | Sales attendance operational. |
| Phase 5 | Shift, Roster, Overtime, and Weekly Off | Build shift scheduling, cross-day shifts, OT, weekly off, and comp-off. | Shift, roster, OT, weekly off, comp-off | High | Workforce rules ready for payroll. |
| Phase 6 | Leave and Holiday Management | Build leave, holiday, balances, approvals, and payroll integration points. | Leave, holiday, leave balance, calendar | High | Leave/holiday ready for payroll. |
| Phase 7 | Payroll Core | Build payroll cycles, salary structure, payable days, payroll processing, and payslips. | Payroll, salary components, payable days, payslip | High | Core payroll run ready. |
| Phase 8 | Payroll Extensions | Build compliance, loans, advances, salary revision, bulk upload, arrears, and statutory outputs. | Compliance, loans, advances, revision, arrears | Medium | Extended payroll capability. |
| Phase 9 | Employee Lifecycle and Exit Management | Build onboarding, documents, letters, probation, resignation, exit, and F&F. | Onboarding, documents, lifecycle, exit | Medium | Employee lifecycle complete. |
| Phase 10 | Helpdesk, Performance, and Assets | Build supporting HR operations. | Helpdesk, PMS, asset management | Medium | HR operations extended. |
| Phase 11 | Reports, Notifications, Audit, and Integrations | Build dashboards, MIS, notifications, audit logs, exports, and external integrations. | Reports, notifications, audit, integrations | High | Management visibility and system automation ready. |
| Phase 12 | Data Migration, UAT, Deployment, and Go-Live | Migrate data, execute UAT, deploy, train, and go live. | Migration, deployment, UAT, training | High | Production-ready release. |

## 6. Detailed Phase Breakdown

---

## Phase 0: Scope Freeze and Requirement Finalization

### 1. Phase Objective

Finalize the business, functional, technical, kiosk, attendance, payroll, compliance, reporting, and UAT scope before development starts.

### 2. Why This Phase Comes Here

* Scope must be frozen before SRS, BPMN, API, frontend, and test planning.
* Kiosk is now confirmed in scope and must be clarified before mobile/kiosk architecture.
* Payroll and attendance rules are complex and need sign-off before development.
* Unclear policies create rework in attendance, payroll, mobile, kiosk, and reports.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Requirement Management | Freeze scope, assumptions, exclusions, and priorities. |
| BPMN Planning | Confirm BPMN index and phase-wise BPMN creation plan. |
| UAT Planning | Define UAT owners, scenarios, and acceptance criteria. |
| Policy Clarification | Confirm attendance, kiosk, mobile, sales, payroll, leave, and compliance rules. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-055 | Data Migration Import and Verification Process | Migration scope and templates must be planned early. |
| BPMN-056 | Production Deployment and Go-Live Handover Process | Deployment and UAT acceptance criteria must be understood early. |
| NEW-BPMN-P0-001 | Scope Freeze and Change Control Process | Should be added to BPMN index to control approved scope and change requests. |
| NEW-BPMN-P0-002 | Phase-wise UAT Sign-off Process | Should be added to BPMN index to define client approval checkpoints. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Client Management | Approves scope, priorities, and phase plan. |
| Client SPOC | Confirms business rules and missing information. |
| Business Analyst | Documents scope, assumptions, risks, and clarification log. |
| Product Architect | Confirms technical dependency and phase order. |
| Project Manager | Finalizes timeline, phase boundaries, and sign-off gates. |
| Implementation Partner | Confirms delivery approach and risk areas. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P0-BR-001 | No development should start until phase-wise scope is approved. | Full project |
| P0-BR-002 | Kiosk attendance is confirmed in scope and must be included in early planning. | Kiosk |
| P0-BR-003 | Attendance and payroll rules require client sign-off before development. | Attendance, Payroll |
| P0-BR-004 | Any new requirement after sign-off should follow change control. | Project governance |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Requirement Sign-off Tracker | BA, PM, Client SPOC | Track approved and pending requirements. |
| Clarification Log | BA, Client SPOC | Track open questions and responses. |
| Phase Roadmap View | PM, Client Management | Review and approve phase plan. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Requirement Item | Track each requirement and status. |
| Clarification Log | Track open questions, decisions, and owners. |
| Phase Plan | Store phase name, scope, dependency, and status. |
| Change Request | Track post-sign-off scope changes. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Requirement Status Service | Track approval status of requirements. |
| Change Request Service | Manage new or changed requirements. |
| Document Export Service | Export approved phase and requirement documents. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Document Repository | Store signed-off documents | Yes |
| Email Notification | Send sign-off reminders | Optional |
| Project Management Tool | Track phase tasks | Optional |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Approved Phase Plan | Final phase-wise development planning document. |
| Clarification Register | List of answered and pending client questions. |
| Scope Baseline | Approved scope including kiosk confirmation. |
| UAT Strategy Draft | Initial module-wise UAT plan. |

### 12. Acceptance Criteria

* Scope areas are confirmed by the client.
* Kiosk attendance is explicitly included in the approved scope.
* Phase order is approved by client and internal delivery team.
* Critical open clarifications are listed with owners.
* Development team has a clear sequence for BPMN, SRS, APIs, frontend, and testing.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Not applicable in this phase. |
| API testing | Not applicable in this phase. |
| Integration testing | Not applicable in this phase. |
| UI testing | Requirement tracker usability, if implemented. |
| Role permission testing | Access to requirement and approval records. |
| E2E testing | Scope approval workflow, if implemented. |
| UAT testing | Client validates phase scope and sign-off process. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Payroll policies are not fully finalized | Payroll rework | Conduct payroll workshop. |
| Kiosk verification method is unclear | Mobile/kiosk architecture risk | Confirm face, selfie, employee code fallback, and offline rules. |
| Sales tracking frequency is unclear | Privacy and mobile design risk | Confirm punch-only, visit-based, or continuous tracking. |
| Statutory states are unclear | Compliance gaps | Confirm state-wise PT/LWF requirements. |

---

## Phase 1: Platform Foundation and Master Setup

### 1. Phase Objective

Build the foundational HRMS platform including tenant setup, company setup, roles, permissions, employee master, department, designation, and organization hierarchy.

### 2. Why This Phase Comes Here

* SaaS tenant and company setup must exist before any client-specific configuration.
* Roles and permissions must exist before HR, payroll, mobile, and admin transactions.
* Employee master must exist before attendance, leave, payroll, shift, asset, performance, and exit.
* Organization hierarchy is required for reporting manager and approval workflows.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| SaaS Tenant Setup | Tenant onboarding, activation, company registration. |
| Company Setup | Company profile, branch, location, department, designation. |
| Role and Permission | Role-based access control for all modules. |
| Employee Master | Employee profile, contact, employment, reporting manager, status. |
| Organization Hierarchy | Department, designation, reporting structure, branch/location mapping. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-001 | Tenant Onboarding and Company Activation Process | Required before tenant-specific configuration. |
| BPMN-004 | Role and Permission Configuration Process | Required before secure module access. |
| BPMN-005 | Employee Master Creation and Approval Process | Required before employee transactions. |
| BPMN-006 | Employee Profile Update Process | Employee profile self-service depends on master data. |
| BPMN-007 | Department, Designation, and Organization Hierarchy Setup Process | Required for workflows, reporting, approvals, and payroll grouping. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Super Admin | Creates tenants and global settings. |
| Tenant Admin | Configures company and tenant-level settings. |
| HR Admin | Creates employee records and hierarchy. |
| Employee | Views or updates permitted profile details. |
| Reporting Manager | Linked to employees for approvals. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P1-BR-001 | Each tenant must have isolated data. | SaaS |
| P1-BR-002 | Every employee must belong to one tenant/company. | Employee Master |
| P1-BR-003 | Employee code must be unique within tenant/company. | Employee Master |
| P1-BR-004 | Reporting manager is required where approvals are enabled. | Workflow |
| P1-BR-005 | Roles define access to all HRMS modules. | Security |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Tenant Setup | Super Admin | Create and activate tenant. |
| Company Profile | Tenant Admin | Configure company details. |
| Branch and Location Master | Tenant Admin, HR Admin | Configure work locations. |
| Department Master | HR Admin | Create departments. |
| Designation Master | HR Admin | Create designations. |
| Role and Permission Manager | Super Admin, Tenant Admin | Assign access. |
| Employee Master List | HR Admin | Search, create, and manage employees. |
| Employee Profile | HR Admin, Employee | View and update employee data. |
| Organization Hierarchy View | HR Admin, Management | View reporting structure. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Tenant | Multi-tenant company container. |
| Company | Company profile and configuration. |
| Branch | Branch-level organization unit. |
| Location | Attendance and branch location mapping. |
| Department | Department master. |
| Designation | Designation master. |
| Employee | Employee master profile. |
| Employee Document | Link documents to employee. |
| Role | Role definition. |
| Permission Rule | Module and record access control. |
| Reporting Structure | Employee-manager relationship. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Tenant Management API | Create and update tenant records. |
| Company Setup API | Manage company profile and settings. |
| Master Data API | Manage branch, location, department, designation. |
| Employee API | Create, update, search, and view employees. |
| Role Permission API | Manage roles and access control. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Email Service | Tenant and employee setup notifications | Optional |
| Document Storage | Employee documents | Partial |
| Authentication Service | User login foundation | Yes |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Tenant Setup | Tenant/company can be created and activated. |
| Company Masters | Branch, location, department, designation available. |
| Role Permissions | User roles and permissions configured. |
| Employee Master | Employee records can be created and managed. |
| Organization Hierarchy | Reporting manager and hierarchy available. |

### 12. Acceptance Criteria

* Super Admin can create and activate a tenant.
* Tenant Admin can configure company, branch, and location.
* HR Admin can create department and designation masters.
* HR Admin can create employee records.
* Employee records can be searched and filtered.
* Reporting manager can be assigned.
* Role-based access controls are enforced.
* Tenant data is isolated.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Validation for tenant, company, employee, branch, role, permission. |
| API testing | CRUD APIs for tenant, company, employee, and master data. |
| Integration testing | Authentication and document storage basics. |
| UI testing | Master forms, lists, filters, and profile screens. |
| Role permission testing | Super Admin, Tenant Admin, HR Admin, Employee access. |
| E2E testing | Tenant creation to employee master setup. |
| UAT testing | Client validates company structure and employee master. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Multi-tenant model not finalized | Data isolation risk | Confirm tenant architecture early. |
| Employee code format unclear | Migration and payroll issues | Confirm employee ID generation rule. |
| Hierarchy approval levels unclear | Workflow rework | Confirm manager and department approval rules. |

---

## Phase 2: Mobile Security, Device Binding, and Kiosk Foundation

### 1. Phase Objective

Build secure employee mobile access, session handling, OTP/biometric support, device registration, device binding, and kiosk setup foundation before attendance capture begins.

### 2. Why This Phase Comes Here

* Mobile login must exist before mobile attendance.
* Device binding must exist before secure attendance from mobile or sales devices.
* Kiosk device registration and binding must exist before kiosk attendance.
* Kiosk branch/location mapping is required before kiosk punches can apply correct attendance policies.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Mobile Login | Secure login, OTP, session, logout, biometric where supported. |
| Device Binding | Employee device registration, approval, replacement, multiple-device control. |
| Kiosk Device Registration | Register kiosk devices in HRMS. |
| Kiosk Device Binding | Bind kiosk device to tenant, branch, and location. |
| Kiosk Admin Control | Admin PIN, device activation/deactivation, exit kiosk mode. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-015 | Employee Mobile App Login and Session Process | Required before mobile app transactions. |
| BPMN-016 | Mobile Device Registration and Binding Process | Required before secure mobile attendance. |
| BPMN-058 | Kiosk Device Registration and Binding Process | Required because kiosk is confirmed in scope. |
| BPMN-067 | Email, SMS, OTP, and Push Notification Integration Process | OTP and mobile security may require messaging service. |
| NEW-BPMN-P2-001 | Kiosk Branch and Location Mapping Process | Should be added because kiosk must be mapped to branch/location before attendance. |
| NEW-BPMN-P2-002 | Kiosk Admin PIN and Device Control Process | Should be added for locked kiosk mode and admin exit control. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Employee | Logs in and registers mobile device. |
| Sales Employee | Registers approved sales attendance device. |
| HR Admin | Approves or manages device binding. |
| Tenant Admin | Configures mobile and kiosk policies. |
| Kiosk Admin / Device Admin | Registers kiosk and manages kiosk mode. |
| Super Admin | Supports tenant-level kiosk/device policy. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P2-BR-001 | Mobile attendance requires authenticated employee session. | Mobile App |
| P2-BR-002 | Device binding controls must be configurable by tenant. | Mobile App |
| P2-BR-003 | One employee device must not act as shared kiosk unless kiosk mode is configured. | Mobile/Kiosk |
| P2-BR-004 | Each kiosk device must be registered and bound to one tenant. | Kiosk |
| P2-BR-005 | Each kiosk device must be mapped to branch/location before attendance capture. | Kiosk |
| P2-BR-006 | Kiosk exit should require admin PIN or authorized admin action. | Kiosk |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Mobile Login | Employee, Sales Employee | Secure app login. |
| OTP Verification | Employee, Sales Employee | Verify login or device registration. |
| Device Registration | Employee | Register mobile device. |
| Device Approval | HR Admin | Approve, reject, or replace device. |
| Kiosk Device Master | HR Admin, Tenant Admin | Register kiosk devices. |
| Kiosk Binding Screen | HR Admin, Kiosk Admin | Bind device to branch/location. |
| Kiosk Admin PIN Setup | Tenant Admin | Configure kiosk exit/control PIN. |
| Device Policy Settings | Tenant Admin | Configure allowed devices and login rules. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| User Session | Track mobile login sessions. |
| OTP Log | Track OTP generation and verification. |
| Employee Device | Store registered employee devices. |
| Device Binding Policy | Configure device restrictions. |
| Kiosk Device | Register kiosk devices. |
| Kiosk Device Binding | Link kiosk to tenant, branch, and location. |
| Kiosk Policy | Kiosk mode, admin PIN, offline, duplicate punch rules. |
| Mobile App Settings | Tenant-level mobile security settings. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Mobile Login API | Authenticate mobile users. |
| OTP Verification API | Verify OTP-based login or device binding. |
| Device Registration API | Register employee mobile device. |
| Device Approval API | Approve or reject device binding. |
| Kiosk Registration API | Register kiosk devices. |
| Kiosk Binding API | Bind kiosk to branch/location. |
| Session Management Service | Manage login, logout, and token expiry. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| SMS/OTP Service | OTP login and device verification | Yes |
| Push Notification Service | Mobile alerts | Partial |
| Authentication Service | Secure login/session | Yes |
| Device Identifier Service | Device fingerprint/device ID | Yes |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Mobile Login Ready | Employee can securely log into app. |
| Device Binding Ready | Employee device can be registered and controlled. |
| Kiosk Device Master Ready | Kiosk devices can be registered. |
| Kiosk Branch Mapping Ready | Kiosk device can be mapped to branch/location. |
| Kiosk Admin Control Ready | Admin PIN/control settings available. |

### 12. Acceptance Criteria

* Employee can log in to mobile app securely.
* OTP/session rules work as configured.
* Employee device can be registered and bound.
* HR/Admin can approve or reject device binding.
* Kiosk device can be registered.
* Kiosk device can be bound to tenant, branch, and location.
* Kiosk admin PIN/control setting can be configured.
* Unauthorized devices are blocked based on policy.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Login validation, OTP validation, device binding rules. |
| API testing | Login, OTP, device registration, kiosk registration APIs. |
| Integration testing | OTP service, authentication, session expiry. |
| UI testing | Mobile login, device setup, kiosk setup screens. |
| Role permission testing | Employee, HR Admin, Tenant Admin, Kiosk Admin permissions. |
| E2E testing | Employee login to device binding; kiosk registration to branch mapping. |
| UAT testing | Client validates mobile security and kiosk setup policies. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Device replacement policy unclear | Support and attendance disputes | Confirm replacement workflow and approval levels. |
| Kiosk hardware specs unclear | App compatibility risk | Confirm Android version, camera quality, storage, and network requirements. |
| Kiosk admin control unclear | Security risk | Confirm admin PIN, remote lock/unlock, and exit control. |
| OTP vendor not selected | Login delay | Finalize SMS/OTP provider. |

---

## Phase 3: Attendance Core

### 1. Phase Objective

Build core attendance capture and processing for mobile, web, and kiosk channels, including GPS validation, face/selfie verification, kiosk multi-employee attendance, kiosk offline sync, duplicate punch prevention, attendance regularization, and audit logging.

### 2. Why This Phase Comes Here

* Attendance depends on employee master, mobile login, device binding, and kiosk foundation.
* Kiosk setup must exist before kiosk attendance.
* Attendance data is required before shift, overtime, leave, and payroll calculations.
* GPS, face/selfie, duplicate punch, and offline sync must be tested before payroll dependency.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Mobile Attendance | Individual punch in/out with GPS and verification. |
| Web Attendance | Browser-based attendance where enabled. |
| Kiosk Attendance | Shared kiosk multi-employee attendance capture. |
| Kiosk Verification | Face/selfie verification at kiosk. |
| Kiosk Offline Sync | Offline punch queue and sync. |
| Attendance Rules Base | Basic punch rules, duplicate prevention, missing punch. |
| Attendance Regularization | Employee correction request and approval. |
| Attendance Audit | Attendance source, device, location, and changes. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-017 | Individual Mobile Attendance Punch In/Punch Out Process | Core mobile attendance workflow. |
| BPMN-021 | Web Portal Attendance Punch Process | Web attendance channel. |
| BPMN-022 | Attendance Regularization Request and Approval Process | Correction workflow for missing/incorrect punches. |
| BPMN-023 | Attendance Rule Configuration Process | Base attendance rules needed for capture validation. |
| BPMN-057 | Offline Mobile Attendance Capture and Sync Process | Offline attendance handling. |
| BPMN-059 | Shared Kiosk Multi-Employee Attendance Capture Process | Confirmed kiosk attendance scope. |
| BPMN-060 | Kiosk Offline Attendance Sync Process | Confirmed kiosk offline sync requirement. |
| BPMN-061 | Face Verification Failure Handling Process | Required for mobile/kiosk verification failure. |
| BPMN-062 | GPS Mismatch and Geo-Fence Exception Process | Required for location validation failure. |
| BPMN-063 | Duplicate Punch Prevention and Correction Process | Required for duplicate punch prevention. |
| BPMN-068 | GPS and Location Service Validation Process | GPS validation integration. |
| BPMN-069 | Face Recognition or Selfie Verification Service Process | Face/selfie verification integration. |
| NEW-BPMN-P3-001 | Kiosk Attendance Exception Handling Process | Should be added for failed kiosk match, duplicate punch, offline conflict, and device mismatch. |

### 5. User Roles Involved

| Role              | Responsibility in This Phase                                         |
| -------------------| ----------------------------------------------------------------------|
| Employee          | Marks mobile/web/kiosk attendance.                                   |
| Sales Employee    | May use mobile attendance; detailed sales tracking comes next phase. |
| HR Admin          | Reviews attendance and exceptions.                                   |
| Reporting Manager | Approves attendance regularization.                                  |
| Kiosk Admin       | Manages kiosk attendance device.                                     |
| System            | Applies validation, sync, and audit rules.                           |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P3-BR-001 | Attendance punch must capture employee, timestamp, source, and status. | Attendance |
| P3-BR-002 | Mobile attendance must capture GPS where policy requires. | Mobile Attendance |
| P3-BR-003 | Face/selfie verification must follow tenant policy. | Mobile/Kiosk |
| P3-BR-004 | Kiosk supports multiple employees on one registered shared device. | Kiosk |
| P3-BR-005 | Kiosk attendance must use branch/location mapped to the kiosk device. | Kiosk |
| P3-BR-006 | Duplicate punches must be blocked or flagged by configured window. | Attendance |
| P3-BR-007 | Failed verification must not create approved attendance automatically. | Attendance |
| P3-BR-008 | Offline attendance must sync with audit status and conflict handling. | Mobile/Kiosk |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Mobile Punch Screen | Employee | Punch in/out with GPS and selfie/face. |
| Web Punch Screen | Employee | Punch through browser if enabled. |
| Kiosk Attendance Screen | Employee | Shared device punch by face/selfie identification. |
| Kiosk Sync Status | Kiosk Admin, HR Admin | View offline and sync status. |
| Attendance Calendar | Employee, HR Admin | View daily attendance. |
| Attendance Regularization | Employee | Raise correction request. |
| Attendance Approval Queue | Manager, HR Admin | Approve/reject corrections. |
| Attendance Exception Dashboard | HR Admin | Review GPS, face, duplicate, offline exceptions. |
| Attendance Rule Settings | HR Admin | Configure base attendance rules. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Attendance Log | Raw punch records. |
| Attendance | Final daily attendance. |
| Attendance Source | Mobile, web, kiosk source classification. |
| Attendance Rule | Basic punch, duplicate, GPS, verification rules. |
| Attendance Regularization | Correction request and approval. |
| Attendance Exception | GPS, face, duplicate, sync exceptions. |
| Kiosk Attendance Queue | Offline kiosk records before sync. |
| Mobile Attendance Queue | Offline mobile records before sync. |
| Face Verification Log | Verification result and score/status. |
| GPS Validation Log | Location, accuracy, and validation result. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Punch In API | Record punch in from mobile/web/kiosk. |
| Punch Out API | Record punch out from mobile/web/kiosk. |
| Kiosk Punch API | Capture shared kiosk attendance. |
| Offline Sync API | Sync queued attendance records. |
| GPS Validation API | Validate location and geo-fence. |
| Face/Selfie Verification API | Verify employee identity. |
| Attendance Regularization API | Submit and approve correction requests. |
| Duplicate Punch Service | Detect duplicate punches. |
| Attendance Audit Service | Track source and changes. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| GPS/Location Service | Mobile and sales location validation | Yes |
| Face/Selfie Verification Service | Mobile and kiosk verification | Yes |
| Camera Access | Selfie/face capture | Yes |
| Push Notification | Attendance approval alerts | Partial |
| Offline Storage | Mobile/kiosk offline queue | Yes |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Mobile Attendance | Employee can punch in/out from app. |
| Web Attendance | Employee can punch from web if enabled. |
| Kiosk Attendance | Multiple employees can mark attendance from shared kiosk. |
| Offline Sync | Mobile/kiosk offline records can sync. |
| Attendance Regularization | Missing/incorrect punch correction available. |
| Attendance Exceptions | GPS, face, duplicate, sync exceptions logged. |

### 12. Acceptance Criteria

* Employee can punch in/out from mobile.
* Kiosk can capture attendance for multiple employees.
* Kiosk device uses mapped branch/location.
* GPS validation works where enabled.
* Face/selfie verification works where enabled.
* Duplicate punches are blocked or flagged.
* Offline mobile/kiosk records sync correctly.
* Failed verification and GPS mismatch create exception flow.
* Employee can request regularization.
* Manager/HR can approve or reject regularization.
* Attendance audit log is available.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Punch validation, duplicate rules, offline sync status. |
| API testing | Punch, kiosk punch, sync, GPS, face verification, regularization APIs. |
| Integration testing | GPS, camera, face verification, offline queue. |
| UI testing | Mobile punch, kiosk screen, attendance calendar, approval queue. |
| Role permission testing | Employee, Manager, HR Admin, Kiosk Admin access. |
| E2E testing | Mobile punch to attendance record; kiosk punch to attendance record; offline sync to approved/exception status. |
| UAT testing | Client validates mobile, kiosk, GPS, face/selfie, and regularization workflows. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Kiosk face identification method unclear | Kiosk design risk | Confirm face recognition, selfie verification, employee code fallback, or combination. |
| Offline sync conflict rules unclear | Attendance dispute risk | Confirm priority when offline punch conflicts with existing attendance. |
| GPS accuracy threshold unclear | False rejection risk | Confirm allowed radius and accuracy tolerance. |
| Face match threshold unclear | False failure risk | Confirm threshold and fallback approval. |

---

## Phase 4: Sales Attendance and Field Tracking

### 1. Phase Objective

Build sales employee attendance with GPS tracking, face/selfie verification, device binding, client/territory tagging, field attendance exceptions, and sales attendance reports foundation.

### 2. Why This Phase Comes Here

* Sales attendance depends on mobile login, device binding, employee master, GPS, and verification foundation.
* Sales attendance should be delivered early because it is a clarified client requirement.
* Sales tracking must be stable before payroll and compliance calculations use sales attendance data.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Sales Attendance | Sales employee mobile punch in/out. |
| Sales GPS Tracking | Capture location at punch or configured events. |
| Sales Face Mapping | Enrollment and verification. |
| Client/Territory Tagging | Optional visit metadata for sales attendance. |
| Sales Exception Handling | GPS mismatch, failed verification, tracking gaps. |
| Sales Attendance Reports Base | Sales attendance and compliance output. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-018 | Sales Personnel Mobile Attendance with GPS Tracking Process | Core sales attendance requirement. |
| BPMN-019 | Sales Face Mapping Enrollment and Verification Process | Required for face-mapped sales attendance. |
| BPMN-020 | Sales Client/Territory Visit Attendance Tagging Process | Required for client/territory metadata. |
| BPMN-062 | GPS Mismatch and Geo-Fence Exception Process | Required for field tracking exceptions. |
| BPMN-068 | GPS and Location Service Validation Process | Required for location capture. |
| BPMN-069 | Face Recognition or Selfie Verification Service Process | Required for sales verification. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Sales Employee | Marks attendance and tags visits. |
| Reporting Manager | Reviews sales attendance exceptions. |
| HR Admin | Configures sales attendance policy. |
| Tenant Admin | Enables GPS/face policy for sales category. |
| System | Validates location and verification result. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P4-BR-001 | Sales attendance applies only to configured sales designations/categories. | Sales Attendance |
| P4-BR-002 | GPS capture is mandatory unless employee is exempted. | Sales Attendance |
| P4-BR-003 | Face/selfie verification must follow sales attendance policy. | Sales Attendance |
| P4-BR-004 | Client/territory tagging is metadata and should not directly change payroll unless configured. | Sales Reports |
| P4-BR-005 | Sales attendance must feed the common attendance rule engine. | Attendance/Payroll |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Sales Punch Screen | Sales Employee | Punch with GPS and verification. |
| Face Enrollment Screen | HR Admin, Sales Employee | Enroll sales employee face/selfie profile. |
| Visit Tagging Screen | Sales Employee | Select client/site/territory. |
| Sales Attendance Map/View | Manager, HR Admin | Review sales attendance location data. |
| Sales Exception Queue | Manager, HR Admin | Approve GPS/verification exceptions. |
| Sales Attendance Policy | HR Admin | Configure sales attendance rules. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Sales Attendance Policy | Configure sales attendance rules. |
| Sales Face Profile | Store face/selfie enrollment reference. |
| Sales Attendance Log | Store sales punch and tracking events. |
| Client/Territory | Store visit tagging master. |
| Sales Visit Tag | Link attendance to client or territory. |
| Sales Location Log | Store GPS tracking events. |
| Sales Attendance Exception | Track GPS/verification exceptions. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Sales Punch API | Capture sales attendance. |
| Face Enrollment API | Enroll sales face profile. |
| Sales GPS Tracking API | Capture tracking events. |
| Client/Territory Tag API | Attach visit metadata. |
| Sales Exception API | Submit and approve exceptions. |
| Sales Attendance Report API | Generate sales attendance output. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| GPS/Location Service | Field location validation | Yes |
| Face/Selfie Verification Service | Sales identity verification | Yes |
| Map Service | Location display, if required | Optional |
| Push Notification | Exception alerts | Partial |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Sales Attendance | Sales employee can mark attendance. |
| Sales GPS Tracking | GPS data captured per policy. |
| Sales Face Mapping | Face/selfie enrollment and verification ready. |
| Visit Tagging | Client/territory tagging available. |
| Sales Exceptions | GPS and verification exceptions handled. |

### 12. Acceptance Criteria

* Sales employee can mark attendance from registered device.
* GPS coordinates are captured and validated.
* Face/selfie verification works per policy.
* Client/territory can be tagged where configured.
* Sales attendance is visible to manager/HR.
* GPS mismatch and verification failures create exceptions.
* Sales attendance feeds attendance rule engine.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Sales policy, GPS required rules, designation validation. |
| API testing | Sales punch, tracking, tagging, face enrollment APIs. |
| Integration testing | GPS, face/selfie, optional map service. |
| UI testing | Sales mobile screens and manager review screens. |
| Role permission testing | Sales Employee, Manager, HR Admin access. |
| E2E testing | Sales punch to manager review and attendance record. |
| UAT testing | Client validates sales attendance and tracking behavior. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Tracking frequency unclear | Privacy, battery, data volume impact | Confirm punch-only, visit-based, route checkpoint, or continuous tracking. |
| Face vs selfie policy unclear | Verification implementation risk | Confirm accepted method. |
| Client/territory master unclear | Reporting gaps | Confirm whether client/site/territory master is required. |

---

## Phase 5: Shift, Roster, Overtime, and Weekly Off

### 1. Phase Objective

Build shift setup, roster planning, cross-day attendance processing, overtime calculation, weekly off work policy, and compensatory off logic.

### 2. Why This Phase Comes Here

* Attendance capture must exist before shift and OT can be calculated.
* Shift assignment is required for late/early, cross-day, and OT rules.
* Weekly off and comp-off affect leave and payroll.
* Payroll depends on shift, OT, weekly off, and attendance outputs.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Shift Master | Shift definitions and timings. |
| Roster | Weekly/monthly roster planning. |
| Cross-Day Shift | Overnight attendance mapping. |
| Overtime | OT calculation and approval. |
| Weekly Off | Weekly off work policy. |
| Compensatory Off | C/O credit, expiry, and usage. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-024 | Cross-Day Shift Attendance Processing Process | Mandatory cross-day logic. |
| BPMN-025 | Shift Master Setup and Assignment Process | Required for shift-based attendance. |
| BPMN-026 | Shift Change Request and Approval Process | Required for shift changes. |
| BPMN-027 | Roster Planning and Publication Process | Required for workforce scheduling. |
| BPMN-028 | Overtime Calculation and Approval Process | Required before payroll. |
| BPMN-029 | Weekly Off Work and Compensatory Off Process | Required before leave/payroll. |
| BPMN-030 | Late Mark and Early Exit Deduction Process | Shift timing drives late/early rules. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| HR Admin | Configures shifts and policies. |
| Department Manager | Plans roster and approves changes. |
| Employee | Views shift and requests change. |
| Payroll Admin | Reviews OT/payable impact. |
| System | Calculates cross-day, late, early, OT, weekly off impact. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P5-BR-001 | Punch out after midnight must remain linked to original shift. | Cross-Day Shift |
| P5-BR-002 | Extra hours beyond shift are evaluated for OT. | Overtime |
| P5-BR-003 | Weekly off work may create OT, comp-off, both, or no benefit by policy. | Weekly Off |
| P5-BR-004 | Late and early exit depend on shift start/end and grace rules. | Attendance |
| P5-BR-005 | Roster changes must update attendance policy context. | Shift/Roster |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Shift Master | HR Admin | Create shift timings. |
| Shift Assignment | HR Admin | Assign shift to employees. |
| Roster Planner | Manager, HR Admin | Plan weekly/monthly roster. |
| Shift Change Request | Employee | Request shift change. |
| OT Approval Queue | Manager, HR Admin | Approve OT. |
| Weekly Off Policy | HR Admin | Configure weekly off rules. |
| Comp-Off Balance | Employee, HR Admin | View C/O credit and expiry. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Shift Type | Shift definition. |
| Shift Assignment | Employee shift mapping. |
| Roster | Workforce schedule. |
| Roster Detail | Daily employee roster lines. |
| Shift Change Request | Shift change workflow. |
| Overtime Entry | OT calculation and approval. |
| Weekly Off Policy | Weekly off benefit rule. |
| Compensatory Off Ledger | C/O credit/debit tracking. |
| Late/Early Deduction Rule | Late/early rules by policy. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Shift API | Manage shifts. |
| Roster API | Create and publish roster. |
| Shift Assignment API | Assign shifts. |
| Cross-Day Attendance Service | Process overnight attendance. |
| OT Calculation Service | Calculate OT. |
| Weekly Off Service | Evaluate weekly off work. |
| Comp-Off Service | Credit and consume comp-off. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Attendance Engine | Uses attendance logs for shift/OT | Yes |
| Payroll Engine | Receives OT and payable inputs later | Partial |
| Notification Service | Shift and OT alerts | Partial |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Shift Setup | Shifts can be created and assigned. |
| Roster Planner | Rosters can be planned and published. |
| Cross-Day Logic | Overnight attendance is processed correctly. |
| OT Workflow | OT can be calculated and approved. |
| Weekly Off/Comp-Off | Weekly off work benefit is calculated. |

### 12. Acceptance Criteria

* HR can create shifts and assign employees.
* Roster can be created and published.
* Cross-day attendance remains linked to original shift.
* OT is calculated from shift and attendance.
* OT approval workflow works.
* Weekly off work creates correct OT/comp-off outcome.
* Late/early exit rules work with shift timing.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Shift timing, cross-day, OT, weekly off rules. |
| API testing | Shift, roster, OT, comp-off APIs. |
| Integration testing | Attendance to shift/OT/weekly off. |
| UI testing | Roster planner, shift screens, OT approval. |
| Role permission testing | HR, Manager, Employee, Payroll permissions. |
| E2E testing | Attendance punch to OT approval and comp-off. |
| UAT testing | Client validates shift, night shift, OT, and weekly off scenarios. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Cross-day edge cases unclear | Attendance/payroll errors | Confirm missed punch and double-shift handling. |
| OT multiplier policy unclear | Payroll errors | Confirm employee-category-wise OT rules. |
| Weekly off benefit unclear | Payroll/leave disputes | Confirm staff/worker policies. |

---

## Phase 6: Leave and Holiday Management

### 1. Phase Objective

Build leave application, leave approval, leave balance, holiday calendar, optional holidays, branch/location holidays, sandwich leave, and payroll integration points.

### 2. Why This Phase Comes Here

* Leave and holidays depend on employee master and workflow rules.
* Leave, holiday, weekly off, and attendance determine payable days.
* Payroll cannot be finalized until leave and holiday rules are available.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Leave Type | CL, SL, EL, unpaid, half-day, paid leave. |
| Leave Policy | Accrual, deduction, sandwich leave, approval. |
| Leave Application | Employee leave request and approval. |
| Leave Balance | Opening, accrual, adjustment, encashment. |
| Holiday Calendar | National, state, company, optional, branch/location holidays. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-031 | Leave Application and Approval Process | Core leave workflow. |
| BPMN-032 | Leave Balance Credit and Adjustment Process | Required for leave balances. |
| BPMN-033 | Holiday Calendar Setup and Publishing Process | Required for payroll and attendance. |
| BPMN-029 | Weekly Off Work and Compensatory Off Process | Comp-off affects leave balance. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Employee | Applies for leave and views balance. |
| Reporting Manager | Approves/rejects leave. |
| HR Admin | Configures leave and holiday policy. |
| Payroll Admin | Uses leave data for payroll. |
| System | Updates balance and payroll inputs. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P6-BR-001 | Leave approval must update attendance/payable status. | Leave/Payroll |
| P6-BR-002 | Leave balance must validate before application unless policy allows negative balance. | Leave |
| P6-BR-003 | Holiday calendar may vary by branch/location/state. | Holiday |
| P6-BR-004 | Sandwich leave must be configurable. | Leave |
| P6-BR-005 | Comp-off credit must be available for leave usage where enabled. | Leave/Comp-Off |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Leave Type Master | HR Admin | Configure leave types. |
| Leave Policy | HR Admin | Configure leave rules. |
| Leave Application | Employee | Apply for leave. |
| Leave Approval Queue | Manager, HR Admin | Approve/reject leave. |
| Leave Balance View | Employee, HR Admin | View balances. |
| Holiday Calendar | HR Admin, Employee | Publish and view holidays. |
| Leave Adjustment | HR Admin | Adjust balances. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Leave Type | Leave category master. |
| Leave Policy | Leave rules. |
| Leave Application | Leave workflow. |
| Leave Ledger Entry | Leave balance movement. |
| Holiday List | Holiday calendar. |
| Holiday | Holiday date entry. |
| Optional Holiday Request | Optional holiday usage. |
| Leave Encashment | Encashment for payroll/F&F. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Leave Application API | Submit and approve leave. |
| Leave Balance API | Fetch balance. |
| Leave Policy API | Configure policy. |
| Holiday API | Manage holiday calendars. |
| Leave Payroll Sync Service | Send leave impact to payroll. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Attendance Engine | Mark leave days | Yes |
| Payroll Engine | Payable-days impact | Partial |
| Notification Service | Leave alerts | Partial |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Leave Workflow | Employee can apply and manager can approve. |
| Leave Balance | Balances maintained. |
| Holiday Calendar | Holidays configured and published. |
| Leave Payroll Inputs | Leave impact available for payroll. |

### 12. Acceptance Criteria

* HR can configure leave types and policies.
* Employee can apply for leave.
* Manager/HR can approve or reject leave.
* Leave balance updates correctly.
* Holiday calendar can be published by branch/location.
* Approved leave affects attendance/payable-day input.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Leave balance, holiday, sandwich leave rules. |
| API testing | Leave, approval, balance, holiday APIs. |
| Integration testing | Leave to attendance and payroll input. |
| UI testing | Leave forms, approval queue, calendar. |
| Role permission testing | Employee, Manager, HR, Payroll access. |
| E2E testing | Leave application to approved leave and balance update. |
| UAT testing | Client validates leave and holiday policies. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Leave types unclear | Incorrect balance setup | Confirm leave types and accrual rules. |
| Sandwich policy unclear | Payroll disputes | Confirm applicability. |
| Holiday state/branch mapping unclear | Attendance/payroll errors | Confirm holiday calendars. |

---

## Phase 7: Payroll Core

### 1. Phase Objective

Build payroll cycle configuration, salary structure, salary components, payable-days calculation, payroll processing, payroll approval, and payslip generation.

### 2. Why This Phase Comes Here

* Payroll depends on employee master, attendance, shift, OT, weekly off, leave, and holiday.
* Salary components and payroll cycles must exist before salary calculation.
* Payable days calculation requires data from previous phases.
* Payslip depends on approved payroll.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Payroll Cycle | Calendar/custom/weekly/fortnight payroll cycles. |
| Salary Components | Earnings, deductions, employer contributions. |
| Salary Structure | Staff/worker salary configuration. |
| Payable Days | Attendance, leave, weekly off, holiday, OT-based calculation. |
| Payroll Processing | Salary calculation and approval. |
| Payslip | Payslip generation and employee access. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-034 | Payroll Cycle Configuration Process | Required before payroll run. |
| BPMN-035 | Salary Structure and Component Configuration Process | Required before salary calculation. |
| BPMN-036 | Monthly Payroll Processing and Approval Process | Core payroll workflow. |
| BPMN-037 | Salary Days and Payable Days Calculation Process | Core payroll dependency. |
| BPMN-039 | Employee Payslip Generation and Release Process | Required after payroll approval. |
| BPMN-065 | Payroll Error Correction and Reprocessing Process | Required for payroll exceptions. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Payroll Admin | Configures and processes payroll. |
| HR Admin | Validates attendance and employee data. |
| Finance | Reviews payroll output. |
| Management | Approves payroll where required. |
| Employee | Views payslip. |
| System | Calculates salary and payable days. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P7-BR-001 | Payroll cannot run without payroll cycle and salary structure. | Payroll |
| P7-BR-002 | Payable days must use attendance, leave, holiday, weekly off, and OT data. | Payroll |
| P7-BR-003 | Salary components define statutory and OT base applicability. | Payroll |
| P7-BR-004 | Payroll must be approved before payslip release. | Payroll |
| P7-BR-005 | Payroll errors must be corrected and reprocessed before final release. | Payroll |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Payroll Cycle Master | Payroll Admin | Configure payroll cycle. |
| Salary Component Master | Payroll Admin | Configure components. |
| Salary Structure | Payroll Admin | Assign employee salary. |
| Payroll Run | Payroll Admin | Process salary. |
| Payable Days Review | Payroll Admin, HR Admin | Verify attendance/payable days. |
| Payroll Approval | Finance, Management | Approve payroll. |
| Payslip View | Employee | View/download payslip. |
| Payroll Error Correction | Payroll Admin | Correct and reprocess payroll. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Payroll Cycle | Payroll period setup. |
| Salary Component | Earnings/deductions/contributions. |
| Salary Structure | Salary template. |
| Salary Structure Assignment | Employee salary assignment. |
| Payroll Entry | Payroll processing batch. |
| Salary Slip | Employee payslip. |
| Payable Days Calculation | Payroll day calculation details. |
| Payroll Approval | Approval workflow. |
| Payroll Error Log | Track payroll corrections. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Payroll Cycle API | Configure payroll cycles. |
| Salary Component API | Manage components. |
| Salary Structure API | Manage structures and assignments. |
| Payable Days Service | Calculate payable days. |
| Payroll Processing API | Run payroll. |
| Payroll Approval API | Approve/reject payroll. |
| Payslip API | Generate and view payslips. |
| Payroll Reprocess Service | Correct and re-run payroll. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Attendance Engine | Attendance/payable days | Yes |
| Leave Engine | Leave/payable days | Yes |
| Shift/OT Engine | OT and shift allowances | Yes |
| Notification Service | Payroll approval and payslip alerts | Partial |
| PDF Export | Payslip generation | Yes |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Payroll Configuration | Payroll cycles and salary components ready. |
| Payable Days Engine | Salary days calculated. |
| Payroll Run | Payroll can be processed. |
| Payroll Approval | Approval workflow available. |
| Payslip Release | Employee payslip generated and visible. |

### 12. Acceptance Criteria

* Payroll cycle can be configured.
* Salary components and structures can be created.
* Employee salary can be assigned.
* Payable days are calculated from attendance, leave, holiday, weekly off, and OT.
* Payroll can be processed and approved.
* Payslips are generated only after approval.
* Payroll errors can be corrected and reprocessed.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Salary component, payable days, payroll formula logic. |
| API testing | Payroll cycle, salary structure, payroll run, payslip APIs. |
| Integration testing | Attendance/leave/OT to payroll. |
| UI testing | Payroll run, review, approval, payslip screens. |
| Role permission testing | Payroll, HR, Finance, Employee access. |
| E2E testing | Attendance to payroll to payslip. |
| UAT testing | Client validates salary calculation scenarios. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Salary-day method not finalized | Incorrect payroll | Confirm staff/worker/sales methods. |
| Salary components unclear | Statutory/OT errors | Confirm components and applicability. |
| Payroll approval matrix unclear | Control risk | Confirm approvers. |

---

## Phase 8: Payroll Extensions

### 1. Phase Objective

Build statutory compliance, loans, salary advances, salary revision, bulk salary upload, arrears, and extended payroll reports.

### 2. Why This Phase Comes Here

* These modules depend on payroll core.
* Loans and advances require payroll deduction integration.
* Salary revision depends on salary structure and payroll history.
* Statutory reports depend on payroll calculation output.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Statutory Compliance | PF, ESIC, PT, TDS, LWF, bonus, gratuity. |
| Loans | Loan request, approval, EMI, outstanding balance. |
| Salary Advance | Advance approval and recovery. |
| Salary Revision | Increment, revision, history. |
| Bulk Upload | Excel/CSV revision upload and validation. |
| Arrear | Backdated increment arrear calculation. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-038 | Statutory Compliance Calculation and Report Process | Required after payroll core. |
| BPMN-040 | Loan Request and Approval Process | Payroll deduction extension. |
| BPMN-041 | Salary Advance Request and Recovery Process | Payroll deduction extension. |
| BPMN-042 | Salary Revision and Increment Approval Process | Salary update workflow. |
| BPMN-043 | Bulk Salary Revision Upload Process | Bulk salary update process. |
| BPMN-044 | Arrear Calculation for Backdated Increment Process | Backdated salary correction. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Payroll Admin | Configures statutory, deductions, revisions. |
| HR Admin | Initiates salary revision and validates employee data. |
| Finance | Approves loans, advances, statutory outputs. |
| Management | Approves salary revisions. |
| Employee | Requests loan/advance and views deductions. |
| System | Calculates deductions, arrears, and statutory amounts. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P8-BR-001 | Loan EMI must deduct automatically from payroll. | Loans |
| P8-BR-002 | Salary advance recovery must integrate with payroll. | Advance |
| P8-BR-003 | Salary revision history must not be deleted. | Salary Revision |
| P8-BR-004 | Backdated increment must calculate arrears. | Arrear |
| P8-BR-005 | Statutory applicability depends on salary component configuration. | Compliance |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Statutory Settings | Payroll Admin | Configure compliance rules. |
| Statutory Reports | Payroll Admin, Finance | Generate compliance outputs. |
| Loan Request | Employee | Request loan. |
| Loan Approval | Manager, HR, Finance | Approve loan. |
| Salary Advance Request | Employee | Request advance. |
| Salary Revision | HR Admin | Create revision/increment. |
| Bulk Salary Upload | HR/Payroll Admin | Upload revision file. |
| Arrear Review | Payroll Admin | Review arrear calculation. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Statutory Setting | Compliance configuration. |
| PF/ESIC/PT/TDS Rule | Statutory rule configuration. |
| Employee Loan | Loan workflow. |
| Loan Repayment Schedule | EMI schedule. |
| Salary Advance | Advance request and recovery. |
| Salary Revision | Revision record. |
| Salary Revision Upload | Bulk upload file and validation. |
| Arrear Entry | Backdated salary arrear. |
| Statutory Report | Generated compliance output. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Statutory Calculation Service | Calculate statutory deductions. |
| Loan API | Loan request and approval. |
| Advance API | Salary advance request/recovery. |
| Salary Revision API | Manage salary revisions. |
| Bulk Upload API | Validate and post salary upload. |
| Arrear Calculation Service | Calculate backdated arrears. |
| Compliance Report API | Generate statutory reports. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Payroll Engine | Deductions and arrears | Yes |
| Excel/CSV Parser | Bulk salary upload | Yes |
| PDF/Excel Export | Statutory reports | Yes |
| Statutory Portal | Direct upload if approved | Optional |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Statutory Calculation | Compliance deductions calculated. |
| Loan/Advance Workflows | Employee loan and advance integrated with payroll. |
| Salary Revision | Increment and revision process available. |
| Bulk Upload | Salary revision via file upload. |
| Arrear Calculation | Backdated salary changes calculated. |

### 12. Acceptance Criteria

* Statutory components calculate correctly.
* Loan request can be approved and deducted in payroll.
* Salary advance can be approved and recovered.
* Salary revision can be approved and posted.
* Old salary history remains available.
* Bulk upload validates records and shows errors.
* Backdated increment creates arrear entries.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Statutory, EMI, arrear, revision calculations. |
| API testing | Loan, advance, revision, bulk upload APIs. |
| Integration testing | Loan/advance/revision to payroll. |
| UI testing | Payroll extension screens. |
| Role permission testing | Employee, HR, Payroll, Finance, Management access. |
| E2E testing | Loan approval to EMI deduction; revision to arrear. |
| UAT testing | Client validates payroll extension scenarios. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| PT/LWF states unclear | Compliance gaps | Confirm states for launch. |
| Loan approval matrix unclear | Workflow rework | Confirm approval levels. |
| Bulk upload format unclear | Import errors | Finalize template. |

---

## Phase 9: Employee Lifecycle and Exit Management

### 1. Phase Objective

Build onboarding, offer acceptance, employee document verification, letters, probation confirmation, resignation, clearance, and full and final settlement.

### 2. Why This Phase Comes Here

* Employee master foundation already exists.
* Payroll core exists, so exit settlement can calculate final payroll impact.
* Asset, finance, leave, payroll, and document data are needed for full and final workflows.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Onboarding | Joining and document collection. |
| Offer Acceptance | Candidate-to-employee conversion. |
| Document Verification | Employee document validation. |
| Letter Generation | Offer, appointment, confirmation, promotion, revision, warning, relieving, experience. |
| Probation | Review and confirmation. |
| Exit | Resignation, clearance, F&F, final letters. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-008 | Digital Employee Onboarding Process | Employee joining workflow. |
| BPMN-009 | Offer Acceptance and Joining Workflow | Pre-joining workflow. |
| BPMN-010 | Probation Review and Confirmation Process | Confirmation workflow. |
| BPMN-011 | Employee Document Upload and Verification Process | Document validation. |
| BPMN-012 | Employee Letter Generation Process | HR letter automation. |
| BPMN-013 | Employee Resignation Submission Process | Exit initiation. |
| BPMN-014 | Exit Clearance and Full and Final Settlement Process | Complete exit workflow. |
| BPMN-064 | Invalid Document Upload Rejection Process | Document exception handling. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Candidate | Accepts offer and submits joining data. |
| Employee | Uploads documents and raises resignation. |
| HR Admin | Manages onboarding, documents, letters, exit. |
| Reporting Manager | Reviews probation and resignation. |
| Finance | Clears dues and recovery. |
| Payroll Admin | Processes final payroll. |
| Asset Admin | Confirms asset return. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P9-BR-001 | Employee onboarding must collect mandatory documents. | Onboarding |
| P9-BR-002 | Document rejection must include reason and allow re-upload. | Documents |
| P9-BR-003 | Probation confirmation requires configured approval. | Lifecycle |
| P9-BR-004 | Exit cannot complete until required clearances are done. | Exit |
| P9-BR-005 | F&F must include leave encashment, recovery, and final payroll. | Exit/Payroll |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Onboarding Dashboard | HR Admin | Track onboarding tasks. |
| Candidate Offer Acceptance | Candidate | Accept offer. |
| Document Upload | Candidate, Employee | Submit documents. |
| Document Verification | HR Admin | Approve/reject documents. |
| Letter Template | HR Admin | Configure letters. |
| Letter Generation | HR Admin | Generate employee letters. |
| Probation Review | Manager, HR | Confirm or extend probation. |
| Resignation Request | Employee | Submit resignation. |
| Exit Clearance | HR, Finance, Asset, Payroll | Complete clearance. |
| F&F Settlement | Payroll Admin | Process final settlement. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Employee Onboarding | Joining workflow. |
| Candidate | Pre-employee data. |
| Offer Acceptance | Offer response. |
| Employee Document | Uploaded documents. |
| Document Verification | Approval/rejection. |
| Letter Template | Letter format. |
| Employee Letter | Generated letter. |
| Probation Review | Confirmation workflow. |
| Resignation | Exit request. |
| Exit Clearance | Clearance checklist. |
| Full and Final Settlement | Final settlement. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Onboarding API | Manage onboarding. |
| Document Upload API | Upload employee documents. |
| Document Verification API | Approve/reject documents. |
| Letter Generation Service | Generate PDF letters. |
| Probation API | Manage confirmation. |
| Resignation API | Submit and approve resignation. |
| Exit Clearance API | Track clearances. |
| F&F Settlement Service | Calculate final settlement. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Document Storage | Employee documents and letters | Yes |
| Payroll Engine | F&F settlement | Yes |
| Leave Engine | Leave encashment | Yes |
| Asset Module | Asset clearance | Partial |
| Notification Service | Onboarding/exit alerts | Partial |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Onboarding Workflow | New employee onboarding complete. |
| Document Verification | Employee documents validated. |
| Letter Generation | HR letters generated. |
| Probation Workflow | Confirmation process available. |
| Exit Workflow | Resignation to F&F process available. |

### 12. Acceptance Criteria

* Candidate can accept offer if enabled.
* HR can onboard employee and collect documents.
* Documents can be approved or rejected.
* HR letters can be generated.
* Probation review can be processed.
* Employee can submit resignation.
* Exit clearance can be completed.
* F&F settlement can include payroll, leave, recovery, and asset clearance.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Document validation, F&F calculations, letter data mapping. |
| API testing | Onboarding, documents, letters, resignation APIs. |
| Integration testing | Payroll, leave, asset, document storage. |
| UI testing | Onboarding, document, exit screens. |
| Role permission testing | Candidate, Employee, HR, Manager, Payroll, Finance access. |
| E2E testing | Candidate onboarding to active employee; resignation to F&F. |
| UAT testing | Client validates employee lifecycle flows. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Letter templates not provided | Delay in document generation | Collect templates. |
| Clearance departments unclear | Exit workflow gaps | Confirm clearance owners. |
| F&F rules unclear | Settlement disputes | Confirm leave encashment, recovery, notice pay rules. |

---

## Phase 10: Helpdesk, Performance, and Assets

### 1. Phase Objective

Build HR helpdesk, SLA escalation, performance appraisal, asset allocation, asset return, and asset clearance workflows.

### 2. Why This Phase Comes Here

* These modules depend on employee master, roles, departments, and reporting hierarchy.
* Asset return integrates with exit.
* Performance depends on employee, manager, department, KPI/KRA structures.
* Helpdesk depends on employee login and notification workflows.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Helpdesk | Employee ticket creation, assignment, resolution. |
| SLA Escalation | Escalation on breach. |
| Performance | Goals, KPI, KRA, self and manager assessment. |
| Asset Management | Asset master, allocation, return, transfer, maintenance. |
| Exit Asset Clearance | Asset return integration with exit. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-045 | Performance Appraisal Cycle Process | PMS workflow. |
| BPMN-046 | Employee Asset Allocation Process | Asset issue workflow. |
| BPMN-047 | Employee Asset Return and Clearance Process | Asset return and exit integration. |
| BPMN-048 | HR Helpdesk Ticket Creation and Resolution Process | Helpdesk core workflow. |
| BPMN-049 | Helpdesk Escalation and SLA Breach Process | SLA escalation workflow. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Employee | Raises tickets, participates in appraisal, receives assets. |
| HR Admin | Manages helpdesk, PMS, and HR actions. |
| Reporting Manager | Reviews tickets, appraisals, and asset needs. |
| Asset Admin | Allocates and receives assets. |
| Management | Reviews performance outcomes. |
| System | Triggers SLA escalation. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P10-BR-001 | Ticket SLA depends on category and priority. | Helpdesk |
| P10-BR-002 | Ticket escalation must notify next owner. | Helpdesk |
| P10-BR-003 | Appraisal cycle requires employee and manager input where configured. | PMS |
| P10-BR-004 | Asset allocation must create employee asset history. | Asset |
| P10-BR-005 | Asset return is required for exit clearance where assigned assets exist. | Asset/Exit |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Ticket Creation | Employee | Raise HR ticket. |
| Ticket Queue | HR Admin | Manage tickets. |
| SLA Dashboard | HR Admin | Track breaches. |
| PMS Cycle Setup | HR Admin | Create appraisal cycle. |
| Self Assessment | Employee | Submit assessment. |
| Manager Assessment | Manager | Submit evaluation. |
| Asset Master | Asset Admin | Manage assets. |
| Asset Allocation | Asset Admin | Assign assets. |
| Asset Return | Employee, Asset Admin | Return and clear assets. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| HR Ticket | Ticket record. |
| Ticket Category | Category master. |
| SLA Policy | SLA and escalation rules. |
| Appraisal Cycle | PMS cycle. |
| Goal/KPI/KRA | Performance targets. |
| Self Assessment | Employee review. |
| Manager Assessment | Manager review. |
| Asset | Asset master. |
| Asset Assignment | Allocation record. |
| Asset Return | Return workflow. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Helpdesk API | Ticket create/update/resolve. |
| SLA Service | Track and escalate tickets. |
| PMS API | Manage appraisal workflows. |
| Asset API | Manage asset allocation/return. |
| Asset Clearance Service | Integrate asset return with exit. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Notification Service | Ticket/appraisal/asset alerts | Yes |
| Exit Module | Asset clearance | Yes |
| Employee Master | Employee/manager data | Yes |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| HR Helpdesk | Tickets and resolution workflow ready. |
| SLA Escalation | Escalations triggered. |
| PMS | Appraisal cycle ready. |
| Asset Management | Asset issue and return ready. |
| Exit Asset Clearance | Asset dependency linked to exit. |

### 12. Acceptance Criteria

* Employee can create ticket.
* HR can assign and resolve ticket.
* SLA breach escalates.
* HR can create appraisal cycle.
* Employee and manager can submit assessments.
* Asset can be assigned and returned.
* Asset return can support exit clearance.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | SLA, PMS status, asset assignment rules. |
| API testing | Ticket, PMS, asset APIs. |
| Integration testing | Notification, exit, employee master. |
| UI testing | Ticket, PMS, asset screens. |
| Role permission testing | Employee, HR, Manager, Asset Admin access. |
| E2E testing | Ticket to resolution; asset allocation to return. |
| UAT testing | Client validates HR support and asset workflows. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| SLA matrix unclear | Escalation errors | Confirm category, priority, SLA hours. |
| PMS criteria unclear | Appraisal rework | Confirm KPI/KRA model. |
| Asset categories unclear | Inventory gaps | Confirm asset masters. |

---

## Phase 11: Reports, Notifications, Audit, and Integrations

### 1. Phase Objective

Build cross-module reports, dashboards, MIS, notifications, audit logs, report exports, and external integrations.

### 2. Why This Phase Comes Here

* Reports depend on transaction data from employee, attendance, leave, payroll, kiosk, sales, and HR modules.
* Notifications depend on finalized workflows.
* Audit logs must cover all critical modules.
* Integrations must be stable before final UAT.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Reports | HR, attendance, leave, payroll, workforce, OT, sales, kiosk reports. |
| Dashboards | Executive and HR dashboards. |
| MIS Builder | Custom reports if approved. |
| Notifications | Email, SMS, OTP, push, reminders, alerts. |
| Audit Logs | Login, attendance, payroll, leave, workflow, admin action logs. |
| Integrations | GPS, face, OTP, email, payment gateway, exports. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-002 | SaaS Subscription Plan Setup and Renewal Process | SaaS billing and plan reports. |
| BPMN-051 | Automated Notification and Reminder Process | Cross-module notifications. |
| BPMN-052 | Audit Trail Capture and Export Process | Required for compliance and control. |
| BPMN-053 | Executive and HR Dashboard Generation Process | Management visibility. |
| BPMN-054 | Custom MIS Report Builder Process | Custom reporting. |
| BPMN-066 | Payment Gateway Billing Collection Process | SaaS subscription integration. |
| BPMN-067 | Email, SMS, OTP, and Push Notification Integration Process | Messaging integration. |
| BPMN-070 | Report Export to Excel/PDF Process | Export process. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Management | Reviews dashboards and reports. |
| HR Admin | Runs HR, attendance, leave, and employee reports. |
| Payroll Admin | Runs payroll and compliance reports. |
| Super Admin | Reviews SaaS and tenant reports. |
| Auditor | Reviews audit logs. |
| System | Sends notifications and captures logs. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P11-BR-001 | Reports must respect role permissions and tenant isolation. | Reports |
| P11-BR-002 | Critical actions must create audit logs. | Audit |
| P11-BR-003 | Notifications must be triggered by configured workflow events. | Notifications |
| P11-BR-004 | Exports must be logged. | Reports/Audit |
| P11-BR-005 | Failed integrations must create failure logs. | Integrations |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Executive Dashboard | Management | View HRMS KPIs. |
| HR Dashboard | HR Admin | View HR and workforce metrics. |
| Attendance Reports | HR Admin | Attendance, kiosk, sales reports. |
| Payroll Reports | Payroll Admin | Payroll and statutory reports. |
| Audit Log Viewer | Admin, Auditor | Review activity logs. |
| Notification Template | Admin | Configure messages. |
| Notification Log | Admin | Track delivery. |
| Report Export | Authorized Users | Export Excel/PDF. |
| Subscription Billing | Super Admin | Manage SaaS billing. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Report Definition | Report configuration. |
| Dashboard Widget | Dashboard components. |
| MIS Template | Custom report template. |
| Notification Template | Message templates. |
| Notification Log | Delivery tracking. |
| Audit Log | Activity tracking. |
| Export Log | Report export tracking. |
| Subscription Plan | SaaS plan. |
| Subscription Invoice | Billing record. |
| Payment Transaction | Gateway payment result. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Report API | Generate reports. |
| Dashboard API | Fetch dashboard metrics. |
| Export Service | Export Excel/PDF. |
| Notification Service | Send messages. |
| Audit Service | Capture audit logs. |
| Payment Gateway API | Subscription payment. |
| Integration Failure Log Service | Track third-party failures. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Email Service | Notifications | Yes |
| SMS/OTP Service | OTP and alerts | Yes |
| Push Notification | Mobile alerts | Yes |
| Payment Gateway | SaaS billing | Yes, if paid subscription launch is included |
| Face Verification Service | Verification audit/reporting | Yes |
| GPS Service | Location audit/reporting | Yes |
| PDF/Excel Export | Reports | Yes |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Dashboards | Executive and HR dashboards. |
| Reports | HR, attendance, leave, payroll, sales, kiosk, statutory reports. |
| Notifications | Configurable alerts and reminders. |
| Audit Logs | Cross-module audit trail. |
| Integrations | Messaging, payment, GPS, face, export integrations. |

### 12. Acceptance Criteria

* Reports show correct data based on role.
* Kiosk and sales attendance reports are available.
* Payroll and statutory reports are available.
* Audit logs capture critical actions.
* Notifications are sent for configured events.
* Report export works and is logged.
* Payment gateway integration works if included in launch.
* Integration failures are logged.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Report filters, audit log events, notification triggers. |
| API testing | Report, dashboard, notification, audit APIs. |
| Integration testing | Email, SMS, push, payment, export. |
| UI testing | Dashboards, report screens, audit viewer. |
| Role permission testing | Report access by role and tenant. |
| E2E testing | Workflow event to notification/audit/report. |
| UAT testing | Client validates dashboards, reports, exports, and audit logs. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Report priority unclear | Development overload | Confirm phase-1 report list. |
| Notification channels unclear | Integration rework | Confirm email/SMS/push/WhatsApp needs. |
| Payment gateway unclear | Billing delay | Confirm provider. |
| Audit retention unclear | Compliance risk | Confirm retention policy. |

---

## Phase 12: Data Migration, UAT, Deployment, and Go-Live

### 1. Phase Objective

Migrate approved data, execute module-wise and end-to-end UAT, deploy production environment, train users, complete handover, and go live.

### 2. Why This Phase Comes Here

* Data migration should happen after target masters and transactions are ready.
* UAT requires stable modules, reports, workflows, roles, and integrations.
* Deployment should happen after UAT readiness and production configuration.
* Go-live requires training, support, and acceptance.

### 3. Modules Covered

| Module | Description |
| ------ | ----------- |
| Data Migration | Employee, attendance, leave, payroll, documents, historical data. |
| UAT | Client validation of phase-wise scenarios. |
| Deployment | Production setup, SSL, backup, security. |
| Training | User and admin training. |
| Go-Live | Final release and support. |
| Handover | Documentation and acceptance. |

### 4. Related BPMN Processes

| BPMN ID | BPMN Process Name | Reason Included in This Phase |
| ------- | ----------------- | ----------------------------- |
| BPMN-055 | Data Migration Import and Verification Process | Required before production use. |
| BPMN-056 | Production Deployment and Go-Live Handover Process | Required for final release. |
| BPMN-052 | Audit Trail Capture and Export Process | Required for go-live controls. |
| BPMN-070 | Report Export to Excel/PDF Process | Required for UAT reporting validation. |
| NEW-BPMN-P12-001 | UAT Defect Logging and Retesting Process | Should be added to BPMN index for UAT control. |
| NEW-BPMN-P12-002 | Production Cutover and Rollback Process | Should be added to BPMN index for go-live safety. |

### 5. User Roles Involved

| Role | Responsibility in This Phase |
| ---- | ---------------------------- |
| Client SPOC | Coordinates UAT and sign-off. |
| HR Admin | Validates HR and attendance data. |
| Payroll Admin | Validates payroll and salary data. |
| Management | Approves go-live. |
| Implementation Partner | Migrates data and deploys system. |
| Support Team | Provides go-live support. |
| Employees | Participate in pilot/UAT if required. |

### 6. Key Business Rules

| Rule ID | Business Rule | Applies To |
| ------- | ------------- | ---------- |
| P12-BR-001 | Migrated data must be verified before go-live. | Migration |
| P12-BR-002 | UAT defects must be logged, fixed, and retested. | UAT |
| P12-BR-003 | Production deployment must include backup and rollback readiness. | Deployment |
| P12-BR-004 | Go-live requires written client acceptance. | Go-Live |
| P12-BR-005 | Training must be completed before production handover. | Handover |

### 7. Required Screens / UI Areas

| Screen / UI Area | User Role | Purpose |
| ---------------- | --------- | ------- |
| Data Import Wizard | Implementation Partner, Admin | Import data. |
| Migration Error Report | Admin, Implementation Partner | Review migration errors. |
| Migration Verification Dashboard | Client SPOC, Admin | Validate migrated data. |
| UAT Test Tracker | Client SPOC, BA, QA | Track UAT cases and defects. |
| Deployment Checklist | PM, Implementation Partner | Track production readiness. |
| Training Material Area | Client Users | Access user guides. |
| Go-Live Support Tracker | Support Team | Track post-go-live issues. |

### 8. Required Backend / Frappe DocTypes

| DocType / Backend Entity | Purpose |
| ------------------------ | ------- |
| Data Import Template | Migration format. |
| Data Import Job | Migration execution. |
| Migration Error Log | Import errors. |
| Migration Verification | Client verification status. |
| UAT Test Case | UAT case tracking. |
| UAT Defect | UAT issue log. |
| Deployment Checklist | Production readiness. |
| Go-Live Sign-off | Client acceptance. |
| Support Ticket | Post-go-live support. |

### 9. Required APIs / Services

| API / Service | Purpose |
| ------------- | ------- |
| Data Import API | Import legacy data. |
| Migration Validation Service | Validate data quality. |
| UAT Defect API | Log and track UAT defects. |
| Backup Service | Production backup. |
| Deployment Service | Release deployment support. |
| Monitoring Service | Monitor production health. |

### 10. Integration Points

| Integration | Used For | Required in This Phase? |
| ----------- | -------- | ----------------------- |
| Legacy Data Files | Migration | Yes |
| Document Storage | Employee document migration | Yes |
| Email/Notification | UAT and go-live alerts | Yes |
| Backup Storage | Production backup | Yes |
| Monitoring Tool | Production health | Recommended |

### 11. Outputs / Deliverables of This Phase

| Deliverable | Description |
| ----------- | ----------- |
| Migrated Data | Verified employee, attendance, leave, payroll, and document data. |
| UAT Completion | Client-tested workflows and defect closure. |
| Production Deployment | Live system deployed. |
| Training Completion | Admin and user training completed. |
| Go-Live Sign-off | Written client acceptance. |
| Support Handover | Post-go-live support process active. |

### 12. Acceptance Criteria

* Migration templates are finalized.
* Data import completes with validation reports.
* Client verifies migrated data.
* UAT test cases are executed.
* UAT defects are fixed and retested.
* Production environment is deployed with SSL and backup.
* User/admin training is completed.
* Go-live support process is active.
* Client provides written acceptance.

### 13. Testing Focus

| Testing Type | What to Test |
| ------------ | ------------ |
| Unit testing | Migration validation rules. |
| API testing | Data import, UAT defect, support APIs. |
| Integration testing | Document storage, backup, notification, monitoring. |
| UI testing | Import wizard, UAT tracker, deployment checklist. |
| Role permission testing | Admin, Client SPOC, Support Team access. |
| E2E testing | Migration to UAT to production go-live. |
| UAT testing | Full client validation and sign-off. |

### 14. Risks and Clarifications

| Risk / Clarification | Impact | Action Needed |
| -------------------- | ------ | ------------- |
| Poor legacy data quality | Migration delay | Perform sample migration early. |
| UAT scope too broad | Delayed sign-off | Freeze UAT cases phase-wise. |
| No rollback plan | Production risk | Prepare cutover and rollback plan. |
| Training not completed | Adoption issue | Schedule training before go-live. |

---

## 7. Phase Dependency Map

| Current Phase | Depends On | Required Before Next Phase |
| ------------- | ---------- | -------------------------- |
| Phase 0: Scope Freeze and Requirement Finalization | Source documents and client clarification | Approved scope, kiosk confirmation, phase plan, clarification log. |
| Phase 1: Platform Foundation and Master Setup | Phase 0 | Tenant, company, roles, employee master, hierarchy. |
| Phase 2: Mobile Security, Device Binding, and Kiosk Foundation | Phase 1 | Mobile login, device binding, kiosk registration, kiosk branch/location mapping. |
| Phase 3: Attendance Core | Phase 1, Phase 2 | Mobile/web/kiosk attendance, GPS/face validation, offline sync, regularization. |
| Phase 4: Sales Attendance and Field Tracking | Phase 1, Phase 2, Phase 3 | Sales attendance, GPS tracking, sales face mapping, visit tagging. |
| Phase 5: Shift, Roster, Overtime, and Weekly Off | Phase 3 | Shift, roster, cross-day logic, OT, weekly off, comp-off. |
| Phase 6: Leave and Holiday Management | Phase 1, Phase 5 | Leave, holiday, balance, comp-off usage, payroll inputs. |
| Phase 7: Payroll Core | Phase 1, Phase 3, Phase 5, Phase 6 | Payroll cycle, salary structure, payable days, payroll run, payslip. |
| Phase 8: Payroll Extensions | Phase 7 | Compliance, loans, advances, revision, arrears. |
| Phase 9: Employee Lifecycle and Exit Management | Phase 1, Phase 6, Phase 7, Phase 8 | Onboarding, documents, letters, probation, exit, F&F. |
| Phase 10: Helpdesk, Performance, and Assets | Phase 1, Phase 9 for exit asset linkage | Helpdesk, PMS, asset allocation/return. |
| Phase 11: Reports, Notifications, Audit, and Integrations | Phase 1 through Phase 10 | Dashboards, reports, notifications, audit, exports, integrations. |
| Phase 12: Data Migration, UAT, Deployment, and Go-Live | All prior phases | Production deployment, UAT sign-off, migrated data, go-live. |

## 8. MVP Recommendation

| MVP Version | Included Phases | Business Value |
| ----------- | --------------- | -------------- |
| MVP 1 | Phase 0, Phase 1, Phase 2, Phase 3 | First usable HRMS foundation with tenant setup, employee master, mobile security, device binding, kiosk setup, mobile attendance, kiosk attendance, GPS/face validation, offline sync, and attendance regularization. |
| MVP 2 | Phase 4, Phase 5, Phase 6, Phase 7 | Workforce and payroll-ready release with sales attendance, shift, roster, OT, weekly off, leave, holiday, payroll core, payable days, and payslips. |
| MVP 3 | Phase 8, Phase 9 | Extended HR/payroll release with statutory compliance, loans, advances, salary revision, arrears, onboarding, documents, letters, exit, and F&F. |
| MVP 4 | Phase 10, Phase 11, Phase 12 | Complete enterprise release with helpdesk, performance, assets, reports, notifications, audit, integrations, migration, UAT, deployment, and go-live. |

## 9. Phase-wise BPMN Document Creation Plan

| Phase | BPMN Detail Flow Document Needed? | Priority | Reason |
| ----- | --------------------------------- | -------- | ------ |
| Phase 0 | Yes | High | Scope freeze, change control, and UAT sign-off need governance flow. |
| Phase 1 | Yes | High | Foundation workflows affect all modules. |
| Phase 2 | Yes | High | Mobile and kiosk security must be precisely defined before attendance. |
| Phase 3 | Yes | High | Attendance, kiosk, offline sync, GPS, face verification, and exceptions are high-risk. |
| Phase 4 | Yes | High | Sales tracking needs client approval due to GPS/privacy implications. |
| Phase 5 | Yes | High | Shift, cross-day, OT, weekly off, and comp-off affect payroll. |
| Phase 6 | Yes | High | Leave and holiday directly affect payable days. |
| Phase 7 | Yes | High | Payroll requires exact process validation before development. |
| Phase 8 | Yes | Medium | Payroll extensions need approval flows and calculation clarity. |
| Phase 9 | Yes | Medium | Lifecycle and exit processes involve multiple departments. |
| Phase 10 | Yes | Medium | Helpdesk, PMS, and assets require workflow clarity. |
| Phase 11 | Yes | High | Reports, notifications, audit, and integrations affect UAT and compliance. |
| Phase 12 | Yes | High | Migration, UAT, deployment, and go-live require controlled process flows. |

After this phase document is approved, each phase should get its own detailed BPMN step flow document before SRS and development start for that phase.

## 10. Phase-wise Development Readiness Checklist

| Phase | BRD Ready | BPMN Index Ready | Detailed BPMN Needed | SRS Needed | API Contract Needed | Frontend Contract Needed | Test Cases Needed |
| ----- | --------- | ---------------- | -------------------- | ---------- | ------------------- | ------------------------ | ----------------- |
| Phase 0 | Partial | Partial | Required | Required | No | Partial | Required |
| Phase 1 | Yes | Yes | Required | Required | Required | Required | Required |
| Phase 2 | Partial | Partial | Required | Required | Required | Required | Required |
| Phase 3 | Partial | Partial | Required | Required | Required | Required | Required |
| Phase 4 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 5 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 6 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 7 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 8 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 9 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 10 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 11 | Partial | Yes | Required | Required | Required | Required | Required |
| Phase 12 | Partial | Partial | Required | Required | Required | Required | Required |

## 11. Recommended Development Order

Scope Freeze and Requirement Sign-off  
→ Tenant Setup  
→ Company Setup  
→ Role and Permission  
→ Branch and Location Master  
→ Department and Designation Master  
→ Employee Master  
→ Organization Hierarchy  
→ Mobile Login  
→ OTP and Session Management  
→ Employee Device Binding  
→ Kiosk Device Registration  
→ Kiosk Device Binding  
→ Kiosk Branch/Location Mapping  
→ Kiosk Admin Control  
→ Mobile Attendance  
→ Web Attendance  
→ Kiosk Multi-Employee Attendance  
→ GPS Validation  
→ Face/Selfie Verification  
→ Offline Mobile Sync  
→ Kiosk Offline Sync  
→ Attendance Exceptions  
→ Attendance Regularization  
→ Sales Attendance  
→ Sales GPS Tracking  
→ Sales Face Mapping  
→ Sales Visit/Client/Territory Tagging  
→ Shift Master  
→ Shift Assignment  
→ Roster Planning  
→ Cross-Day Attendance  
→ Overtime  
→ Weekly Off and Comp-Off  
→ Leave Management  
→ Holiday Management  
→ Payroll Cycle  
→ Salary Components  
→ Salary Structure  
→ Payable Days Calculation  
→ Payroll Processing  
→ Payroll Approval  
→ Payslip  
→ Statutory Compliance  
→ Loans and Advances  
→ Salary Revision  
→ Arrears  
→ Onboarding  
→ Documents and Letters  
→ Probation  
→ Exit and Full and Final  
→ Assets  
→ Helpdesk  
→ Performance  
→ Reports  
→ Notifications  
→ Audit Logs  
→ Integrations  
→ Data Migration  
→ UAT  
→ Deployment  
→ Go-Live

## 12. Final Recommendation

The project should start with Phase 0: Scope Freeze and Requirement Finalization. This phase is critical because kiosk attendance is now confirmed in scope and must be reflected in BPMN, SRS, mobile architecture, kiosk device setup, attendance rules, testing, and UAT planning.

The most critical phases are Phase 1, Phase 2, Phase 3, Phase 5, Phase 6, and Phase 7 because they create the operational foundation for HRMS, mobile/kiosk attendance, attendance rules, shift, leave, and payroll. These phases require detailed BPMN, SRS, API contracts, frontend contracts, and test cases before development.

Client sign-off is required before development for kiosk policy, device binding policy, sales tracking policy, face/selfie verification method, GPS validation rules, attendance approval levels, cross-day shift rules, OT rules, weekly off/comp-off policy, leave policy, salary-day methods, payroll cycles, statutory states, and UAT scenarios.

The highest-risk phases are Phase 3, Phase 5, Phase 7, Phase 8, and Phase 12 because they involve kiosk attendance, offline sync, GPS/face exceptions, cross-day attendance, payroll calculation, statutory compliance, data migration, and production go-live.

The first MVP should include Phase 0 through Phase 3. This gives the client a usable HRMS foundation with company setup, employee master, mobile login, device binding, kiosk setup, mobile attendance, kiosk attendance, GPS validation, face/selfie verification, offline sync, and attendance regularization.

Phases such as helpdesk, performance management, advanced MIS builder, extended reports, and some integrations can be developed later after attendance, kiosk, leave, shift, and payroll are stable.