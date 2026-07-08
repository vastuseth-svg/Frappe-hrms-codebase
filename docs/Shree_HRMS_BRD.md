# Business Requirements Document: Shree HRMS SaaS Platform

## 1. Document Control

| Item | Details |
| --- | --- |
| Document Name | Shree HRMS SaaS Platform BRD |
| Version | 1.0 |
| Date | 2026-07-08 |
| Prepared For | Shree HR Service |
| Prepared By | Arraylogic Software Pvt. Ltd. |
| Source Documents | `1.1ShreeHrms_RFP.md`, `1.2Shree_HRMS_Attendence_payrol.md` |
| Document Purpose | Convert client requirements into a clear business requirements baseline for HRMS implementation planning, estimation, design, and UAT. |

## 2. Executive Summary

Shree HR Service requires a cloud-based, multi-tenant HRMS SaaS platform to serve multiple client organizations from a centralized system while maintaining tenant-level data isolation. The platform must support the full employee lifecycle, including employee records, onboarding, attendance, shift and roster management, leave, payroll, statutory compliance, workflows, reporting, mobile self-service, and SaaS subscription administration.

Attendance and payroll are key business-critical areas. The system must support configurable attendance rules, shift-based attendance, cross-day attendance, overtime, late mark policies, salary cycles, salary components, statutory deductions, and payroll processing for staff, workers, and field employees.

The client requirement includes individual employee mobile attendance, GPS attendance, selfie or face verification, and sales personnel attendance with location tracking. Based on the client's clarification, this BRD treats shared kiosk attendance where one device captures attendance for multiple employees as not confirmed and not part of the approved baseline scope unless separately approved through a change request.

## 3. Business Objectives

1. Provide a scalable SaaS HRMS platform for multiple organizations.
2. Maintain complete tenant-level data isolation and secure access control.
3. Digitize core HR operations from joining to exit.
4. Standardize attendance, shift, leave, overtime, and payroll processing.
5. Support Indian statutory payroll and compliance requirements.
6. Enable mobile attendance for individual employees with GPS and verification controls.
7. Enable sales personnel attendance and location tracking from assigned personal or approved devices.
8. Provide dashboards, reports, audit trails, and exportable MIS outputs for HR, payroll, and management.
9. Provide subscription, billing, plan, and tenant administration for SaaS operations.

## 4. Scope Summary

### 4.1 In Scope

| Area | Scope |
| --- | --- |
| SaaS Platform | Multi-tenant architecture, tenant onboarding, tenant controls, subscription and billing management. |
| Core HR | Employee master, profile, department, designation, hierarchy, documents, employee lifecycle, onboarding, confirmation, exit, and full and final settlement. |
| Attendance | Punch in/out, attendance history, regularization, approval, rules engine, GPS, selfie, face verification, shift integration, and reports. |
| Sales Attendance | One employee using one registered or approved device, face mapping or selfie verification, GPS location capture, route or location tracking, and sales attendance reports. |
| Shift and Workforce | Shift master, roster planning, rotational shifts, cross-day shifts, night shifts, automatic shift assignment, and dashboards. |
| Overtime | Shift-based OT, cross-day OT, holiday OT, weekly off OT, configurable multipliers, approvals, and payroll integration. |
| Leave and Holidays | Leave types, balances, approvals, holiday calendars, optional holidays, branch/location holiday mapping, and reports. |
| Payroll | Salary structures, salary cycles, payable days, salary components, deductions, payroll approvals, payslips, and payroll history. |
| Compliance | PF, ESIC, PT, TDS, LWF, bonus, gratuity, arrears, statutory reports, declarations, and audit support. |
| Loans and Advances | Employee loans, advances, EMI setup, salary deduction, repayment history, and reports. |
| Performance | Goals, KPIs, KRAs, self-assessment, manager assessment, ratings, appraisal cycles, and reports. |
| Asset Management | Asset master, allocation, transfer, return, maintenance, asset history, and exit clearance verification. |
| Helpdesk | Employee tickets, HR queries, categorization, priority, assignment, escalation, SLA, status, feedback, and reports. |
| Reports and Analytics | HR, attendance, leave, payroll, workforce, headcount, attrition, OT, payroll cost, and custom MIS reports. |
| Workflow | Multi-level approvals, routing, escalation, status tracking, email approvals, notifications, and audit trails. |
| Mobile App | Android and iOS employee self-service application for individual login-based access. |
| Data Migration | Employee master, attendance, leave balance, payroll, historical payroll, documents, validation, cleansing support, and migration verification. |

### 4.2 Out of Scope or Requires Client Approval

| Item | BRD Position |
| --- | --- |
| Shared kiosk attendance on one Android device for multiple employees | Not included in the approved baseline scope because the client has not explicitly confirmed this requirement. |
| Punch without individual user login on a shared device | Not included unless kiosk scope is approved separately. |
| Multi-employee face identification from a common device | Not included unless kiosk scope is approved separately. |
| Liveness or anti-spoofing beyond basic face/selfie verification | Optional enhancement, subject to final technology selection and commercial approval. |
| Territory optimization or sales route planning | Not included. Only attendance location tracking and reporting are included. |
| Biometric hardware integration | Not included unless a specific device/vendor integration is approved. |

## 5. Key Business Clarification: Mobile Attendance vs Kiosk Attendance

The requirements mention mobile attendance, GPS attendance, selfie attendance, face recognition, and sales personnel face mapping. The business expectation confirmed for this BRD is:

1. One mobile device is associated with one employee or one logged-in employee session.
2. Sales personnel use their own registered or approved device for attendance.
3. The system captures GPS location, timestamp, verification proof, and attendance status.
4. The same mobile device is not expected to sequentially capture attendance for multiple employees as a kiosk.
5. Multi-employee kiosk attendance is not assumed in estimation, design, or delivery unless the client separately confirms it.

## 6. Stakeholders

| Stakeholder | Responsibility |
| --- | --- |
| Shree HR Service Management | Business approval, scope confirmation, UAT acceptance. |
| HR Administrators | Employee lifecycle, attendance approvals, leave, documents, workflows, and reports. |
| Payroll Team | Salary setup, payroll processing, compliance, deductions, and payslip release. |
| Department Managers | Attendance approvals, leave approvals, performance reviews, and team reports. |
| Employees | Self-service mobile/web access, attendance, leave, payslip, tickets, and profile updates. |
| Sales Personnel | Mobile attendance with GPS tracking and field attendance compliance. |
| Super Admin | Tenant onboarding, subscription control, billing, platform monitoring, and global configuration. |
| Implementation Partner | Development, configuration, migration, deployment, training, and support. |

## 7. Business Requirements

### 7.1 Multi-Tenant SaaS Platform

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-SAA-001 | The system shall support multiple tenant organizations on a centralized SaaS platform. | Must |
| BR-SAA-002 | Each tenant's employee, attendance, payroll, document, and configuration data shall remain isolated. | Must |
| BR-SAA-003 | The system shall support tenant provisioning, activation, suspension, and configuration. | Must |
| BR-SAA-004 | The system shall support subscription plans, billing cycles, invoices, renewals, expiry controls, and upgrade/downgrade controls. | Must |
| BR-SAA-005 | The system shall support plan-based limits for users, employees, storage, and enabled features. | Should |
| BR-SAA-006 | The system shall provide a super admin panel for global tenant and platform administration. | Must |

### 7.2 Employee Management

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-EMP-001 | The system shall maintain employee master records with profile, contact, employment, department, designation, hierarchy, and status details. | Must |
| BR-EMP-002 | The system shall maintain employee document repositories with upload, download, and access controls. | Must |
| BR-EMP-003 | The system shall support employee search, filtering, history tracking, and analytics. | Should |
| BR-EMP-004 | The system shall support employee ID generation and reporting manager assignment. | Must |

### 7.3 Onboarding and Lifecycle

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-LIF-001 | The system shall support digital onboarding with document collection and verification. | Must |
| BR-LIF-002 | The system shall support offer acceptance, joining workflow, induction checklist, probation tracking, and confirmation workflow. | Should |
| BR-LIF-003 | The system shall send automated notifications for onboarding and lifecycle actions. | Should |
| BR-LIF-004 | The system shall provide onboarding dashboards and reports. | Should |

### 7.4 Exit and Full and Final Settlement

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-EXT-001 | The system shall support resignation, notice period tracking, exit workflow, and exit interview. | Must |
| BR-EXT-002 | The system shall support department, HR, finance, and asset clearance processes. | Must |
| BR-EXT-003 | The system shall support full and final settlement including leave encashment, loan or advance recovery, and final payroll. | Must |
| BR-EXT-004 | The system shall generate relieving and experience letters. | Should |

### 7.5 Letter and Document Generation

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-DOC-001 | The system shall generate standard employee letters including offer, appointment, confirmation, promotion, salary revision, warning, relieving, and experience letters. | Should |
| BR-DOC-002 | The system shall support configurable letter templates and PDF generation. | Should |
| BR-DOC-003 | Generated documents shall be stored in the employee document repository. | Should |

### 7.6 Attendance Management

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-ATT-001 | The system shall support punch in and punch out through approved attendance channels. | Must |
| BR-ATT-002 | The system shall maintain attendance records, history, regularization requests, approval workflows, dashboards, and reports. | Must |
| BR-ATT-003 | The system shall support GPS attendance, selfie attendance, and face verification where configured. | Must |
| BR-ATT-004 | The system shall support attendance policies by department, branch, designation, location, and employee category. | Must |
| BR-ATT-005 | The system shall support geo-fencing and radius-based validation for configured locations. | Should |
| BR-ATT-006 | The system shall prevent or flag duplicate punches based on configurable rules. | Must |
| BR-ATT-007 | The system shall maintain audit logs for attendance creation, modification, approval, and regularization. | Must |

### 7.7 Individual Mobile Attendance

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-MOBATT-001 | The mobile app shall require secure employee login before attendance actions. | Must |
| BR-MOBATT-002 | The system shall allow attendance only from registered or approved devices where device binding is enabled. | Should |
| BR-MOBATT-003 | A mobile device shall be treated as an individual attendance channel, not a shared kiosk channel. | Must |
| BR-MOBATT-004 | The system shall capture timestamp, GPS coordinates, device identifier, attendance action, and verification status for each mobile punch. | Must |
| BR-MOBATT-005 | The system shall support offline attendance capture only if enabled by tenant policy, with controlled synchronization and audit trail. | Could |
| BR-MOBATT-006 | The system shall validate GPS and camera permissions before attendance where those controls are required. | Must |

### 7.8 Sales Personnel Attendance and Tracking

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-SALES-001 | The system shall support sales personnel attendance through a mobile app using one employee login per device/session. | Must |
| BR-SALES-002 | The system shall support sales employee face enrollment or selfie verification based on configured policy. | Must |
| BR-SALES-003 | The system shall capture GPS location at punch in, punch out, and configured tracking events. | Must |
| BR-SALES-004 | The system shall support optional client, site, or territory tagging for sales attendance records. | Should |
| BR-SALES-005 | The system shall support configurable geo-fence validation for sales territories or client locations. | Should |
| BR-SALES-006 | Sales attendance shall feed the same shift, grace, late mark, half-day, payable-days, OT, and payroll rule engine as other attendance records. | Must |
| BR-SALES-007 | The system shall provide sales attendance compliance reports with employee, date, location, route or visit metadata, verification status, and exceptions. | Must |
| BR-SALES-008 | The system shall maintain verification history and audit records for sales attendance, including face/selfie result and GPS data where applicable. | Must |

### 7.9 Attendance Rule Engine

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-RULE-001 | The system shall support configurable grace period, late coming, early leaving, half-day, full-day, overtime, holiday, weekly off, missing punch, penalty, exception, and regularization rules. | Must |
| BR-RULE-002 | Attendance rules shall be configurable by tenant and optionally by branch, department, designation, employee category, or employee. | Must |
| BR-RULE-003 | Late mark policies shall support configurable frequency-based deduction, salary deduction, per-minute deduction, warning-only, and leave deduction options. | Must |
| BR-RULE-004 | Early exit policies shall be configurable similarly to late mark policies. | Must |
| BR-RULE-005 | Monthly late and early exit counters shall be reset or carried forward based on policy configuration. | Should |

### 7.10 Shift and Roster Management

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-SHF-001 | The system shall support shift definitions, shift assignment, rotational shifts, weekly rosters, monthly rosters, day shifts, and night shifts. | Must |
| BR-SHF-002 | The system shall support shift change workflows and automatic shift assignment where configured. | Should |
| BR-SHF-003 | The system shall correctly process attendance spanning multiple calendar days. | Must |
| BR-SHF-004 | For cross-day shifts, punch out after midnight shall continue against the original shift and shall not create a new automatic punch in. | Must |
| BR-SHF-005 | Additional hours beyond the shift shall be evaluated for overtime based on policy. | Must |
| BR-SHF-006 | A fresh attendance cycle shall start only when the employee reports for the next scheduled shift. | Must |

### 7.11 Overtime and Weekly Off Work

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-OT-001 | The system shall calculate overtime based on hours, minutes, or shift policy. | Must |
| BR-OT-002 | The system shall support weekday, weekly off, holiday, and night OT multipliers. | Must |
| BR-OT-003 | OT rate shall be configurable as fixed amount, multiplier, or formula based on selected salary components. | Must |
| BR-OT-004 | The system shall support OT approval workflows before payroll posting where configured. | Must |
| BR-OT-005 | Weekly off work shall support OT, compensatory off, OT plus compensatory off, or no benefit based on policy. | Must |
| BR-OT-006 | Compensatory off policies shall support full day, half day, hours basis, minimum hours, and expiry. | Should |

### 7.12 Leave and Holiday Management

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-LVE-001 | The system shall support leave application, approval, balance tracking, leave types, leave policies, and notifications. | Must |
| BR-LVE-002 | The system shall support paid leave, unpaid leave, half-day leave, sandwich leave, and leave deduction policies. | Must |
| BR-LVE-003 | The system shall support national, state, company, optional, branch-wise, location-wise, and shift-wise holiday calendars. | Should |
| BR-LVE-004 | Holiday and leave records shall integrate with attendance and payroll payable-days calculation. | Must |

### 7.13 Payroll and Salary Days

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-PAY-001 | The system shall support configurable payroll cycles including calendar month, custom date ranges, weekly, fortnightly, bi-weekly, daily, and project-based cycles. | Must |
| BR-PAY-002 | The system shall support salary days calculation by month days, fixed 26 days, fixed 30 days, month days minus weekly off, attendance based, hour based, paid weekly off, unpaid weekly off, paid leave, half day, sandwich leave, CTC based, OT based, shift based, and minimum guarantee methods. | Must |
| BR-PAY-003 | The system shall automatically calculate weekly off count within the payroll cycle based on configured weekly off day or rotational weekly off. | Must |
| BR-PAY-004 | The system shall calculate payable days using attendance, leave, weekly off, holiday, half-day, OT, and deduction policies. | Must |
| BR-PAY-005 | The system shall support payroll approval workflow, payroll history, payslip generation, and payroll audit support. | Must |

### 7.14 Salary Components and Revisions

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-SAL-001 | The system shall support earnings, variable earnings, deductions, and employer contribution components. | Must |
| BR-SAL-002 | Each salary component shall support configuration for taxable status, PF, ESIC, PT, LWF, TDS, OT base, bonus base, gratuity base, leave encashment, CTC inclusion, LOP proration, round off, and effective date. | Must |
| BR-SAL-003 | The system shall support formula-based salary components. | Must |
| BR-SAL-004 | The system shall support salary revision and increment by fixed amount, percentage, component-wise revision, new salary structure, grade, designation, department, branch, employee, and company-wide rules. | Should |
| BR-SAL-005 | The system shall support bulk upload for salary revision through Excel or CSV with validation, preview, approval, and posting. | Should |
| BR-SAL-006 | Historical salary structures shall not be deleted; salary revision history shall be maintained. | Must |
| BR-SAL-007 | Backdated increments shall support automatic arrear calculation. | Should |

### 7.15 Statutory Compliance

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-COM-001 | The system shall support PF, ESIC, PT, TDS, LWF, bonus, gratuity, salary arrears, and statutory reporting. | Must |
| BR-COM-002 | The system shall support employee tax and investment declarations. | Should |
| BR-COM-003 | The system shall generate payroll registers, compliance audit reports, and Form 16 data support. | Should |

### 7.16 Loans and Advances

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-LOAN-001 | The system shall support employee loan and salary advance requests, approvals, EMI configuration, and repayment tracking. | Should |
| BR-LOAN-002 | Approved loan and advance deductions shall integrate with payroll. | Must |
| BR-LOAN-003 | Outstanding balances and repayment history shall be reportable. | Should |

### 7.17 Performance Management

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-PMS-001 | The system shall support goal, KPI, KRA, self-assessment, manager assessment, ratings, appraisal cycles, feedback, increment recommendations, and promotion recommendations. | Should |
| BR-PMS-002 | PMS dashboards and reports shall be available to authorized users. | Should |

### 7.18 Asset Management

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-AST-001 | The system shall support asset master management for laptops, mobiles, SIM cards, and other assets. | Should |
| BR-AST-002 | The system shall support asset allocation, return, transfer, maintenance, history, and inventory reports. | Should |
| BR-AST-003 | Asset return verification shall integrate with exit clearance. | Must |

### 7.19 Helpdesk and HR Ticketing

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-HLP-001 | Employees shall be able to create HR tickets and track status. | Should |
| BR-HLP-002 | HR users shall manage ticket category, priority, assignment, escalation, SLA, internal notes, resolution, and feedback. | Should |
| BR-HLP-003 | Ticket reports and analytics shall be available. | Should |

### 7.20 Reporting, Analytics, and MIS

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-REP-001 | The system shall provide executive, HR, attendance, leave, payroll, and workforce dashboards. | Must |
| BR-REP-002 | The system shall provide headcount, attrition, joining vs exit, attendance trends, leave utilization, payroll cost, OT, workforce productivity, and HR KPI reports. | Should |
| BR-REP-003 | Authorized users shall be able to export reports to Excel and PDF. | Must |
| BR-REP-004 | The system shall support custom MIS report building. | Could |

### 7.21 Workflow, Notifications, and Audit

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-WFL-001 | The system shall support multi-level approval workflows with dynamic routing. | Must |
| BR-WFL-002 | Workflows shall support department-wise, designation-based, and escalation rules. | Should |
| BR-WFL-003 | The system shall support email approvals, automated notifications, and workflow status tracking. | Should |
| BR-AUD-001 | The system shall maintain login, logout, user activity, attendance modification, leave modification, payroll modification, approval, workflow, admin action, and data change logs. | Must |
| BR-AUD-002 | Audit reports shall be exportable by authorized users. | Must |

## 8. Mobile Application Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-MOB-001 | The platform shall provide Android and iOS employee self-service mobile applications. | Must |
| BR-MOB-002 | The mobile app shall support secure login, session management, OTP verification where configured, and biometric login where supported. | Must |
| BR-MOB-003 | Employees shall view profile, attendance history, shift schedule, leave, holiday calendar, payslip, tickets, and notifications. | Must |
| BR-MOB-004 | Employees shall apply for leave and create or track HR tickets from the mobile app. | Should |
| BR-MOB-005 | The mobile app shall support push notifications and real-time alerts. | Should |
| BR-MOB-006 | Device registration, device binding, and multiple-device login controls shall be configurable by tenant policy. | Should |

## 9. Data Migration Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| BR-MIG-001 | The implementation shall support import of employee master, attendance data, leave balances, payroll data, historical payroll, and employee documents. | Must |
| BR-MIG-002 | Imported data shall be validated, cleansed where agreed, and reconciled through migration verification reports. | Must |
| BR-MIG-003 | Data migration templates shall be provided to the client before migration execution. | Should |

## 10. Non-Functional Requirements

| Area | Requirement |
| --- | --- |
| Security | Role-based access control, secure authentication, SSL, tenant isolation, audit logs, and secure storage of sensitive employee data. |
| Performance | Attendance punch, approval, and payroll screens should respond within acceptable business operating limits under agreed tenant load. |
| Scalability | Architecture must support organizations of varying sizes and allow future tenant, employee, and module growth. |
| Availability | Production deployment should include backup configuration and disaster recovery readiness. |
| Data Privacy | Face, selfie, GPS, payroll, and statutory data must be protected with proper access control and retention policies. |
| Configurability | Attendance, leave, payroll, salary, statutory, workflow, and subscription rules must be configurable by authorized administrators. |
| Auditability | Critical actions must be traceable by user, timestamp, tenant, module, old value, new value where applicable, and source channel. |
| Compatibility | Mobile apps should support currently agreed Android and iOS versions. Browser support should be finalized before development. |
| Offline Handling | Offline attendance, if enabled, must maintain sequence, prevent tampering as far as technically feasible, and sync with audit status. |

## 11. Business Rules Summary

| Rule ID | Rule |
| --- | --- |
| BUS-001 | Attendance, leave, weekly off, holiday, shift, and salary policies must combine to calculate payable days. |
| BUS-002 | Cross-day shift attendance must remain linked to the original scheduled shift. |
| BUS-003 | Punch out after midnight must not automatically become a new punch in. |
| BUS-004 | OT must be calculated based on tenant policy and may require approval before payroll. |
| BUS-005 | Weekly off work may produce OT, compensatory off, both, or no benefit based on policy. |
| BUS-006 | Late mark and early exit policies must support configurable grace, frequency, deduction, and reset rules. |
| BUS-007 | Salary component configuration determines statutory inclusion, OT base, bonus base, gratuity base, CTC inclusion, and proration. |
| BUS-008 | Historical salary structure and revision data must be retained. |
| BUS-009 | Sales attendance must include GPS tracking when configured as mandatory. |
| BUS-010 | Mobile attendance is individual-login based. Shared multi-employee kiosk attendance is not part of this BRD baseline. |

## 12. Assumptions

1. The platform will be implemented as a SaaS solution with tenant isolation.
2. The client will approve final attendance, leave, payroll, salary, statutory, and workflow configurations before implementation.
3. Indian payroll and compliance rules are required as the primary statutory baseline.
4. Sales attendance tracking requires employee consent and client-approved data retention policies.
5. Face verification and selfie verification depend on final technology selection, device capability, and legal/privacy approval.
6. Device binding and multiple-device login policies will be finalized tenant-wise.
7. Existing data will be provided by the client in agreed templates.
8. Kiosk attendance for multiple employees from one shared device is not approved in the current baseline scope.

## 13. Dependencies

| Dependency | Description |
| --- | --- |
| Client Policy Inputs | Attendance, shift, weekly off, leave, OT, salary, statutory, workflow, and approval policy decisions. |
| Data Availability | Accurate employee, salary, leave, attendance, payroll, document, and historical records. |
| Mobile Permissions | Employee devices must allow required GPS, camera, notification, and storage permissions. |
| Location Accuracy | GPS accuracy depends on device hardware, operating system settings, network, and physical location. |
| Compliance Review | Payroll, statutory, face data, and GPS tracking policies require business/legal validation. |
| Hosting Infrastructure | Cloud environment, SSL, backup, monitoring, and disaster recovery setup must be available before production. |

## 14. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Ambiguity between kiosk and mobile attendance | Scope, cost, and timeline confusion | Keep kiosk attendance out of baseline and require change approval if needed. |
| Payroll rule complexity | Incorrect salary calculation | Conduct payroll rule workshops and UAT with sample scenarios. |
| Cross-day attendance errors | Attendance duplication or OT errors | Implement and test cross-day shift scenarios before go-live. |
| GPS inaccuracies | Sales attendance disputes | Store GPS accuracy metadata and allow approval/exception workflows. |
| Face/selfie verification failures | Punch failure and employee complaints | Provide fallback policy such as regularization approval. |
| Poor data quality during migration | Incorrect employee or payroll records | Use validation templates, error reports, and reconciliation sign-off. |
| Statutory rule changes | Compliance gaps | Keep compliance rules configurable and review periodically. |

## 15. Acceptance Criteria

The implementation shall be accepted when:

1. All agreed in-scope modules are deployed and accessible to authorized users.
2. Tenant isolation, roles, permissions, and authentication are verified.
3. Employee master, onboarding, lifecycle, exit, and document flows pass UAT.
4. Attendance punch, approval, regularization, GPS, mobile, sales tracking, and audit flows pass UAT.
5. Cross-day shift and overtime scenarios pass agreed test cases.
6. Leave, holiday, weekly off, late mark, early exit, and payable-days rules pass agreed test cases.
7. Payroll cycles, salary days, salary components, statutory deductions, loans, advances, arrears, and payslips pass UAT.
8. Reports, dashboards, Excel exports, PDF exports, and audit reports are verified.
9. Data migration is completed and signed off through verification reports.
10. Mobile applications are tested for agreed Android and iOS versions.
11. Training, handover, administrator documentation, and user documentation are completed.
12. Shree HR Service provides written acceptance.

## 16. Open Clarifications

| ID | Clarification Needed | Owner |
| --- | --- | --- |
| CL-001 | Confirm final decision that shared multi-employee Android kiosk attendance is excluded from phase 1. | Client |
| CL-002 | Confirm whether sales attendance requires continuous location tracking, punch-time-only tracking, route checkpoint tracking, or visit-based tracking. | Client |
| CL-003 | Confirm whether sales face verification is mandatory or whether selfie plus GPS is acceptable. | Client |
| CL-004 | Confirm approved mobile device binding rules and multiple-device login policy. | Client |
| CL-005 | Confirm final payroll cycles and salary-day calculation methods per employee category. | Client |
| CL-006 | Confirm statutory compliance states and PT/LWF rules required at launch. | Client |
| CL-007 | Confirm report list required for phase 1 versus later phases. | Client |

## 17. Recommended Phase 1 Baseline

To reduce delivery risk, the recommended first release should prioritize:

1. SaaS tenant setup and security.
2. Employee master and organization setup.
3. Attendance, shift, leave, holiday, and rule engine.
4. Individual mobile attendance with GPS/selfie or face verification.
5. Sales personnel attendance with GPS tracking.
6. Payroll setup, salary components, payable-days calculation, and payslips.
7. Core statutory compliance.
8. Reports, dashboards, audit logs, and exports.
9. Data migration, UAT, training, and go-live support.

Kiosk attendance for multiple employees on a shared device should be handled as a separately approved phase or change request if the client later confirms that business need.
