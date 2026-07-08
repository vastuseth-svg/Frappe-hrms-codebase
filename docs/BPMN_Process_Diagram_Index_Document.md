# BPMN Process Diagram Index Document

## 1. Document Overview

This document identifies the BPMN process diagrams required for the Shree HRMS SaaS Platform before software development starts. It acts as an index for business analysts, project managers, developers, testers, and client stakeholders to understand which business workflows need formal process mapping, validation, and approval.

This document does not include actual BPMN diagrams or detailed process steps. It only lists the process diagrams that should be prepared.

## 2. Source Documents Analyzed

| Document Name | Purpose | Used For BPMN Identification |
| ------------- | ------- | ---------------------------- |
| `1.1ShreeHrms_RFP.md` | Defines the complete HRMS SaaS platform scope, modules, mobile app, kiosk mention, workflows, reports, SaaS management, data migration, and acceptance criteria. | Used to identify full module-level business processes, approval flows, SaaS admin processes, reporting flows, mobile workflows, kiosk-related candidate workflows, and implementation acceptance areas. |
| `1.2Shree_HRMS_Attendence_payrol.md` | Defines detailed attendance, payroll, salary days, salary cycles, overtime, weekly off, late mark, salary component, mobile attendance, kiosk, and sales face-mapping rules. | Used to identify payroll calculation processes, attendance rule processes, exception flows, salary revision flows, OT flows, weekly off flows, sales attendance flows, and offline/sync flows. |
| `Shree_HRMS_BRD.md` | Consolidates business requirements and clarifies approved baseline scope, especially individual mobile attendance and sales attendance tracking. | Used to identify final baseline BPMN scope, clarify mobile attendance versus kiosk attendance, define stakeholder roles, identify missing information, and prioritize diagrams. |
| Additional Client Requirement Note | Clarifies that client has not explicitly confirmed shared kiosk mobile attendance, but has mentioned one-device-one-person sales attendance with tracking. | Used to mark kiosk BPMN diagrams as conditional/client-approval items and prioritize individual mobile and sales attendance workflows. |

## 3. BPMN Diagram Grouping Strategy

The BPMN diagrams are grouped by business module and process type so that each stakeholder can review the workflows relevant to their area.

The grouping strategy includes:

* Core business processes for HRMS employee lifecycle, attendance, leave, payroll, and compliance.
* Admin processes for tenant setup, company configuration, master setup, policy setup, and SaaS control.
* User and employee processes for self-service, attendance, leave, payslip, profile, and helpdesk.
* Approval workflows for attendance correction, leave, overtime, payroll, loan, advance, exit, asset, and salary revision approvals.
* Mobile app workflows for employee login, device binding, attendance punch, GPS/selfie/face verification, offline attendance, and sales attendance.
* Kiosk workflows as conditional diagrams only if the client later approves shared-device kiosk attendance.
* Notification workflows for alerts, reminders, approvals, escalations, and payroll/HR communications.
* Reporting workflows for dashboards, MIS, audit reports, statutory reports, and export flows.
* Exception and error workflows for failed login, GPS mismatch, face verification failure, duplicate punch, rejected approvals, invalid uploads, and offline sync failure.
* Integration workflows for email, SMS/OTP, push notification, GPS/location, face verification, payment gateway, and statutory/payroll exports.

## 4. Complete BPMN Diagram Index

| BPMN ID | Process Diagram Name | Module | Primary Actor | Supporting Actors | Process Type | Priority | Reason for Diagram |
| ------- | -------------------- | ------ | ------------- | ----------------- | ------------ | -------- | ------------------ |
| BPMN-001 | Tenant Onboarding and Company Activation Process | SaaS Platform Management | Super Admin | Tenant Admin, Billing Admin, System | Admin Process | High | Required to define how a new client company is created, configured, activated, and made ready for HRMS use. |
| BPMN-002 | SaaS Subscription Plan Setup and Renewal Process | SaaS Subscription Management | Super Admin | Billing Admin, Tenant Admin, Payment Gateway | Admin Process | High | Required to map plan creation, billing cycle, renewal, expiry, upgrade, downgrade, and feature limit control. |
| BPMN-003 | Tenant Suspension and Reactivation Process | SaaS Platform Management | Super Admin | Tenant Admin, Billing Admin, System | Admin Process | Medium | Required to define what happens when a tenant expires, defaults on payment, or is manually suspended. |
| BPMN-004 | Role and Permission Configuration Process | Security and Access Control | Tenant Admin | Super Admin, HR Admin, System | Admin Process | High | Required to define access control, role assignment, permission changes, and security governance. |
| BPMN-005 | Employee Master Creation and Approval Process | Employee Management | HR Admin | Reporting Manager, Employee, System | Core Process | High | Required to map employee creation, profile setup, department/designation assignment, and document linkage. |
| BPMN-006 | Employee Profile Update Process | Employee Management | Employee | HR Admin, Reporting Manager, System | Core Process | Medium | Required to define employee self-service profile changes and HR approval where needed. |
| BPMN-007 | Department, Designation, and Organization Hierarchy Setup Process | Employee Management | HR Admin | Tenant Admin, Department Head, System | Admin Process | High | Required before employee assignment, reporting structure, workflows, and approvals can work correctly. |
| BPMN-008 | Digital Employee Onboarding Process | Onboarding | HR Admin | Candidate, Reporting Manager, Department Head, System | Core Process | High | Required to map joining, document collection, verification, employee code generation, and onboarding completion. |
| BPMN-009 | Offer Acceptance and Joining Workflow | Onboarding | Candidate | HR Admin, Reporting Manager, System | Core Process | Medium | Required to define pre-joining acceptance and conversion into active employee record. |
| BPMN-010 | Probation Review and Confirmation Process | Employee Lifecycle | HR Admin | Reporting Manager, Employee, Management | Approval Process | Medium | Required to map probation tracking, review, confirmation, extension, or rejection. |
| BPMN-011 | Employee Document Upload and Verification Process | Document Management | Employee | HR Admin, System | Approval Process | High | Required to define document submission, validation, rejection, re-upload, and repository storage. |
| BPMN-012 | Employee Letter Generation Process | Document Generation | HR Admin | Employee, Reporting Manager, System | System Automation | Medium | Required to map offer, appointment, confirmation, promotion, salary revision, warning, relieving, and experience letter generation. |
| BPMN-013 | Employee Resignation Submission Process | Exit Management | Employee | Reporting Manager, HR Admin, System | Core Process | High | Required to map employee resignation, reason capture, notice period, and workflow initiation. |
| BPMN-014 | Exit Clearance and Full and Final Settlement Process | Exit Management | HR Admin | Reporting Manager, Finance, Asset Admin, Payroll Admin, Employee | Approval Process | High | Required to coordinate multi-department clearance, asset return, final payroll, leave encashment, recovery, and settlement. |
| BPMN-015 | Employee Mobile App Login and Session Process | Mobile App | Employee | System, OTP Service | Mobile Process | High | Required to define secure login, OTP, biometric login, session handling, and logout behavior. |
| BPMN-016 | Mobile Device Registration and Binding Process | Mobile App | Employee | HR Admin, System | Mobile Process | High | Required to define one-device-one-employee attendance control, device approval, and multiple-device restrictions. |
| BPMN-017 | Individual Mobile Attendance Punch In/Punch Out Process | Attendance Management | Employee | System, GPS Service, Camera, Attendance Rule Engine | Mobile Process | High | Critical process for individual login-based attendance with timestamp, GPS, selfie/face verification, and attendance status. |
| BPMN-018 | Sales Personnel Mobile Attendance with GPS Tracking Process | Sales Attendance | Sales Employee | Reporting Manager, HR Admin, GPS Service, Attendance Rule Engine | Mobile Process | High | Required because sales attendance with one device per person and tracking is a key clarified requirement. |
| BPMN-019 | Sales Face Mapping Enrollment and Verification Process | Sales Attendance | HR Admin | Sales Employee, Face Verification Service, System | Mobile Process | High | Required to define how sales employee face data is enrolled, verified, re-enrolled, and audited. |
| BPMN-020 | Sales Client/Territory Visit Attendance Tagging Process | Sales Attendance | Sales Employee | Reporting Manager, System, GPS Service | Mobile Process | Medium | Required to define optional client/site/territory tagging and reporting for field sales attendance. |
| BPMN-021 | Web Portal Attendance Punch Process | Attendance Management | Employee | System, Attendance Rule Engine | Core Process | Medium | Required to define browser-based attendance where enabled by company policy. |
| BPMN-022 | Attendance Regularization Request and Approval Process | Attendance Management | Employee | Reporting Manager, HR Admin, System | Approval Process | High | Required to handle missing punch, incorrect punch, GPS issue, late mark dispute, and correction approvals. |
| BPMN-023 | Attendance Rule Configuration Process | Attendance Rule Engine | HR Admin | Tenant Admin, Payroll Admin, System | Admin Process | High | Required to define grace, late, early exit, half-day, full-day, missing punch, exception, and penalty rules. |
| BPMN-024 | Cross-Day Shift Attendance Processing Process | Shift and Attendance | System | Employee, HR Admin, Payroll Admin | System Automation | High | Required because night/overnight shifts must not create duplicate attendance and must calculate OT correctly. |
| BPMN-025 | Shift Master Setup and Assignment Process | Shift Management | HR Admin | Department Manager, Employee, System | Admin Process | High | Required to define shift creation, assignment, rotation, day/night shifts, and workforce scheduling. |
| BPMN-026 | Shift Change Request and Approval Process | Shift Management | Employee | Reporting Manager, HR Admin, System | Approval Process | Medium | Required to define shift change request, approval, rejection, and updated roster impact. |
| BPMN-027 | Roster Planning and Publication Process | Workforce Scheduling | HR Admin | Department Manager, Employees, System | Core Process | Medium | Required to map weekly/monthly roster planning, publication, employee visibility, and changes. |
| BPMN-028 | Overtime Calculation and Approval Process | Overtime Management | System | Employee, Reporting Manager, HR Admin, Payroll Admin | Approval Process | High | Required to map automatic OT calculation, manager approval, HR validation, and payroll posting. |
| BPMN-029 | Weekly Off Work and Compensatory Off Process | Attendance and Leave | Employee | Reporting Manager, HR Admin, Payroll Admin, System | Approval Process | High | Required to map whether weekly off work creates OT, compensatory off, both, or no benefit. |
| BPMN-030 | Late Mark and Early Exit Deduction Process | Attendance Rule Engine | System | Employee, Reporting Manager, HR Admin, Payroll Admin | System Automation | High | Required to define grace rules, monthly counts, deduction conversion, and payroll impact. |
| BPMN-031 | Leave Application and Approval Process | Leave Management | Employee | Reporting Manager, HR Admin, System | Approval Process | High | Required to map leave request, balance validation, approval, rejection, cancellation, and attendance impact. |
| BPMN-032 | Leave Balance Credit and Adjustment Process | Leave Management | HR Admin | Employee, System | Admin Process | High | Required to define leave opening balance, accrual, manual adjustment, encashment, and audit trail. |
| BPMN-033 | Holiday Calendar Setup and Publishing Process | Holiday Management | HR Admin | Tenant Admin, Employees, System | Admin Process | Medium | Required to map national, state, company, optional, branch, and location holiday publishing. |
| BPMN-034 | Payroll Cycle Configuration Process | Payroll Management | Payroll Admin | HR Admin, Tenant Admin, System | Admin Process | High | Required to define calendar month, custom cycle, weekly, fortnight, daily, and project-based payroll cycles. |
| BPMN-035 | Salary Structure and Component Configuration Process | Payroll Management | Payroll Admin | HR Admin, Finance, System | Admin Process | High | Required to map earnings, deductions, employer contributions, statutory applicability, OT base, and formula setup. |
| BPMN-036 | Monthly Payroll Processing and Approval Process | Payroll Management | Payroll Admin | HR Admin, Finance, Management, System | Approval Process | High | Critical diagram for attendance import, payable days, deductions, statutory calculation, approval, and payslip release. |
| BPMN-037 | Salary Days and Payable Days Calculation Process | Payroll Management | System | Payroll Admin, HR Admin | System Automation | High | Required to define month days, fixed 26/30 days, weekly off, attendance-based, paid leave, half-day, and OT-based calculations. |
| BPMN-038 | Statutory Compliance Calculation and Report Process | Payroll Compliance | Payroll Admin | Finance, System | Reporting Process | High | Required for PF, ESIC, PT, TDS, LWF, bonus, gratuity, arrears, payroll registers, and statutory outputs. |
| BPMN-039 | Employee Payslip Generation and Release Process | Payroll Management | Payroll Admin | Employee, Finance, System | System Automation | High | Required to define payslip generation, approval dependency, employee access, and correction handling. |
| BPMN-040 | Loan Request and Approval Process | Loan and Advance | Employee | Reporting Manager, HR Admin, Finance, Payroll Admin | Approval Process | Medium | Required to map loan application, approval, EMI configuration, and payroll deduction. |
| BPMN-041 | Salary Advance Request and Recovery Process | Loan and Advance | Employee | Reporting Manager, HR Admin, Finance, Payroll Admin | Approval Process | Medium | Required to map advance request, approval, recovery, outstanding balance, and payroll integration. |
| BPMN-042 | Salary Revision and Increment Approval Process | Payroll Management | HR Admin | Reporting Manager, Management, Payroll Admin, System | Approval Process | Medium | Required to map fixed/percentage/component-wise revision, approval, posting, history, and letter generation. |
| BPMN-043 | Bulk Salary Revision Upload Process | Payroll Management | HR Admin | Payroll Admin, Management, System | Admin Process | Medium | Required to define Excel/CSV upload, validation, error report, preview, approval, and posting. |
| BPMN-044 | Arrear Calculation for Backdated Increment Process | Payroll Management | System | Payroll Admin, HR Admin | System Automation | Medium | Required to define automatic arrear calculation and payroll posting for backdated salary changes. |
| BPMN-045 | Performance Appraisal Cycle Process | Performance Management | HR Admin | Employee, Reporting Manager, Management, System | Core Process | Medium | Required to map goal/KPI/KRA setup, self-assessment, manager assessment, rating, and recommendation. |
| BPMN-046 | Employee Asset Allocation Process | Asset Management | Asset Admin | HR Admin, Employee, Reporting Manager, System | Core Process | Medium | Required to map asset assignment, acknowledgement, employee history, and inventory update. |
| BPMN-047 | Employee Asset Return and Clearance Process | Asset Management | Employee | Asset Admin, HR Admin, Exit Team, System | Approval Process | High | Required because asset return affects exit clearance and full and final settlement. |
| BPMN-048 | HR Helpdesk Ticket Creation and Resolution Process | Helpdesk | Employee | HR Admin, Assigned Agent, Reporting Manager, System | Core Process | Medium | Required to map employee ticket creation, categorization, priority, assignment, SLA, resolution, and feedback. |
| BPMN-049 | Helpdesk Escalation and SLA Breach Process | Helpdesk | System | HR Admin, Escalation Manager, Employee | Exception Process | Medium | Required to define escalation when tickets exceed SLA or remain unresolved. |
| BPMN-050 | Workflow Rule and Escalation Matrix Configuration Process | Workflow Engine | Tenant Admin | HR Admin, Department Head, System | Admin Process | High | Required to define approval routing, department-wise flows, designation-based flows, and escalation rules. |
| BPMN-051 | Automated Notification and Reminder Process | Notifications | System | Employee, Manager, HR Admin, Payroll Admin | Notification Process | High | Required to define reminders, approval alerts, attendance alerts, payroll alerts, onboarding alerts, and escalation notifications. |
| BPMN-052 | Audit Trail Capture and Export Process | Audit and Logs | System | HR Admin, Super Admin, Auditor | Reporting Process | High | Required to define logging and export of login, activity, approval, attendance, leave, payroll, and admin actions. |
| BPMN-053 | Executive and HR Dashboard Generation Process | Reports and Analytics | HR Admin | Management, System | Reporting Process | Medium | Required to map dashboard generation for headcount, attendance, leave, payroll, workforce, and HR KPIs. |
| BPMN-054 | Custom MIS Report Builder Process | Reports and Analytics | HR Admin | Management, System | Reporting Process | Low | Required if custom MIS builder is approved and needs report selection, filter, export, and save-template flow. |
| BPMN-055 | Data Migration Import and Verification Process | Data Migration | Implementation Partner | HR Admin, Payroll Admin, Client SPOC, System | Core Process | High | Required to map import, validation, cleansing, error correction, verification, and sign-off. |
| BPMN-056 | Production Deployment and Go-Live Handover Process | Deployment | Implementation Partner | Client Admin, Super Admin, Support Team | Core Process | Medium | Required to define deployment, configuration, training, handover, go-live support, and acceptance. |
| BPMN-057 | Offline Mobile Attendance Capture and Sync Process | Mobile Attendance | Employee | System, GPS Service, Attendance Rule Engine | Mobile Process | Medium | Required if offline attendance is enabled; maps local capture, sync, conflict handling, and audit status. |
| BPMN-058 | Kiosk Device Registration and Binding Process | Kiosk Attendance | HR Admin | Super Admin, Device Admin, System | Kiosk Process | Low | Conditional diagram required only if client approves shared Android kiosk attendance later. |
| BPMN-059 | Shared Kiosk Multi-Employee Attendance Capture Process | Kiosk Attendance | Employee | Kiosk Device, Face Verification Service, HR Admin, System | Kiosk Process | Low | Conditional diagram required only if shared one-device-many-employee attendance is approved. |
| BPMN-060 | Kiosk Offline Attendance Sync Process | Kiosk Attendance | Kiosk Device | System, HR Admin, Attendance Rule Engine | Kiosk Process | Low | Conditional diagram required only if kiosk scope and offline kiosk mode are approved. |
| BPMN-061 | Face Verification Failure Handling Process | Attendance Technology | Employee | HR Admin, Reporting Manager, Face Verification Service, System | Exception Process | High | Required because mobile/sales face or selfie verification failure needs business-approved recovery. |
| BPMN-062 | GPS Mismatch and Geo-Fence Exception Process | Attendance Technology | Employee | Reporting Manager, HR Admin, GPS Service, System | Exception Process | High | Required to handle attendance attempts outside allowed location or with inaccurate GPS. |
| BPMN-063 | Duplicate Punch Prevention and Correction Process | Attendance Management | System | Employee, HR Admin, Reporting Manager | Exception Process | High | Required to define duplicate punch blocking, exception logging, and regularization route. |
| BPMN-064 | Invalid Document Upload Rejection Process | Document Management | HR Admin | Employee, System | Exception Process | Medium | Required to define rejection reason, employee notification, re-upload, and audit trail. |
| BPMN-065 | Payroll Error Correction and Reprocessing Process | Payroll Management | Payroll Admin | HR Admin, Finance, Management, System | Exception Process | High | Required to define correction of attendance, salary, deduction, statutory, or payable-days errors before final payroll release. |
| BPMN-066 | Payment Gateway Billing Collection Process | SaaS Billing | Tenant Admin | Super Admin, Payment Gateway, Billing Admin, System | Integration Process | Medium | Required for SaaS subscription invoice payment, success, failure, renewal, and suspension impact. |
| BPMN-067 | Email, SMS, OTP, and Push Notification Integration Process | Notifications | System | Email Service, SMS/OTP Service, Push Notification Service, Users | Integration Process | High | Required because login, approvals, reminders, alerts, and payroll notifications depend on external messaging services. |
| BPMN-068 | GPS and Location Service Validation Process | Attendance Technology | Mobile App | GPS Service, Employee, System | Integration Process | High | Required to define how location is captured, validated, stored, and handled on failure. |
| BPMN-069 | Face Recognition or Selfie Verification Service Process | Attendance Technology | Mobile App | Face Verification Service, Employee, HR Admin, System | Integration Process | High | Required to define face/selfie enrollment, match request, match response, threshold, and failure handling. |
| BPMN-070 | Report Export to Excel/PDF Process | Reports and Analytics | HR Admin | Management, System | Reporting Process | Medium | Required to define report generation, filters, access control, export, and audit log. |

## 5. Module-wise BPMN Diagram List

### SaaS Platform Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-001 | Tenant Onboarding and Company Activation Process | Create and activate new tenant companies. |
| BPMN-002 | SaaS Subscription Plan Setup and Renewal Process | Manage plans, billing, renewals, limits, and expiry. |
| BPMN-003 | Tenant Suspension and Reactivation Process | Control inactive, expired, or suspended tenants. |
| BPMN-004 | Role and Permission Configuration Process | Configure secure user roles and permissions. |
| BPMN-066 | Payment Gateway Billing Collection Process | Manage subscription payment integration. |

### Employee Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-005 | Employee Master Creation and Approval Process | Create employee records and assign organization details. |
| BPMN-006 | Employee Profile Update Process | Handle employee profile changes. |
| BPMN-007 | Department, Designation, and Organization Hierarchy Setup Process | Configure organization structure and reporting hierarchy. |

### Onboarding and Employee Lifecycle

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-008 | Digital Employee Onboarding Process | Complete joining, document collection, and onboarding. |
| BPMN-009 | Offer Acceptance and Joining Workflow | Convert accepted offers into employee records. |
| BPMN-010 | Probation Review and Confirmation Process | Manage probation review and confirmation decision. |

### Document Management and Letter Generation

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-011 | Employee Document Upload and Verification Process | Verify and store employee documents. |
| BPMN-012 | Employee Letter Generation Process | Generate HR letters and store them. |
| BPMN-064 | Invalid Document Upload Rejection Process | Handle rejected or invalid employee document uploads. |

### Exit Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-013 | Employee Resignation Submission Process | Start employee separation workflow. |
| BPMN-014 | Exit Clearance and Full and Final Settlement Process | Complete clearance, recovery, final payroll, and settlement. |

### Attendance Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-017 | Individual Mobile Attendance Punch In/Punch Out Process | Capture employee mobile attendance. |
| BPMN-021 | Web Portal Attendance Punch Process | Capture browser-based attendance. |
| BPMN-022 | Attendance Regularization Request and Approval Process | Correct missing or incorrect attendance. |
| BPMN-023 | Attendance Rule Configuration Process | Configure attendance policies. |
| BPMN-030 | Late Mark and Early Exit Deduction Process | Apply late and early exit rules. |
| BPMN-057 | Offline Mobile Attendance Capture and Sync Process | Handle offline mobile attendance sync. |
| BPMN-063 | Duplicate Punch Prevention and Correction Process | Block or correct duplicate punches. |

### Sales Attendance

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-018 | Sales Personnel Mobile Attendance with GPS Tracking Process | Capture and track sales attendance. |
| BPMN-019 | Sales Face Mapping Enrollment and Verification Process | Enroll and verify sales employee face data. |
| BPMN-020 | Sales Client/Territory Visit Attendance Tagging Process | Tag sales attendance with client or territory metadata. |

### Attendance Technology

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-061 | Face Verification Failure Handling Process | Handle failed face/selfie verification. |
| BPMN-062 | GPS Mismatch and Geo-Fence Exception Process | Handle GPS mismatch or geo-fence failure. |
| BPMN-068 | GPS and Location Service Validation Process | Validate GPS/location service responses. |
| BPMN-069 | Face Recognition or Selfie Verification Service Process | Integrate with face or selfie verification service. |

### Shift and Workforce Scheduling

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-024 | Cross-Day Shift Attendance Processing Process | Process night and overnight shift attendance. |
| BPMN-025 | Shift Master Setup and Assignment Process | Configure and assign employee shifts. |
| BPMN-026 | Shift Change Request and Approval Process | Manage shift change requests. |
| BPMN-027 | Roster Planning and Publication Process | Plan and publish weekly/monthly rosters. |

### Overtime and Weekly Off

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-028 | Overtime Calculation and Approval Process | Calculate and approve overtime. |
| BPMN-029 | Weekly Off Work and Compensatory Off Process | Manage weekly off work, OT, and compensatory off. |

### Leave and Holiday Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-031 | Leave Application and Approval Process | Manage leave request and approval. |
| BPMN-032 | Leave Balance Credit and Adjustment Process | Maintain leave balances and adjustments. |
| BPMN-033 | Holiday Calendar Setup and Publishing Process | Configure and publish holidays. |

### Payroll and Finance

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-034 | Payroll Cycle Configuration Process | Configure payroll cycle rules. |
| BPMN-035 | Salary Structure and Component Configuration Process | Configure salary components and formulas. |
| BPMN-036 | Monthly Payroll Processing and Approval Process | Process and approve monthly payroll. |
| BPMN-037 | Salary Days and Payable Days Calculation Process | Calculate payable days. |
| BPMN-038 | Statutory Compliance Calculation and Report Process | Calculate and report statutory compliance. |
| BPMN-039 | Employee Payslip Generation and Release Process | Generate and release payslips. |
| BPMN-042 | Salary Revision and Increment Approval Process | Manage salary revisions and approvals. |
| BPMN-043 | Bulk Salary Revision Upload Process | Upload and validate bulk salary revisions. |
| BPMN-044 | Arrear Calculation for Backdated Increment Process | Calculate arrears for backdated increments. |
| BPMN-065 | Payroll Error Correction and Reprocessing Process | Correct and reprocess payroll errors. |

### Loan and Advance Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-040 | Loan Request and Approval Process | Manage employee loan request and EMI setup. |
| BPMN-041 | Salary Advance Request and Recovery Process | Manage salary advance approval and recovery. |

### Performance Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-045 | Performance Appraisal Cycle Process | Manage goals, assessments, ratings, and recommendations. |

### Asset Management

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-046 | Employee Asset Allocation Process | Assign assets to employees. |
| BPMN-047 | Employee Asset Return and Clearance Process | Return assets and support exit clearance. |

### Helpdesk

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-048 | HR Helpdesk Ticket Creation and Resolution Process | Manage HR support tickets. |
| BPMN-049 | Helpdesk Escalation and SLA Breach Process | Escalate unresolved or delayed tickets. |

### Workflow, Notification, and Audit

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-050 | Workflow Rule and Escalation Matrix Configuration Process | Configure approval routing and escalations. |
| BPMN-051 | Automated Notification and Reminder Process | Send alerts, reminders, and workflow notifications. |
| BPMN-052 | Audit Trail Capture and Export Process | Capture and export audit logs. |
| BPMN-067 | Email, SMS, OTP, and Push Notification Integration Process | Integrate messaging services. |

### Reports and Analytics

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-053 | Executive and HR Dashboard Generation Process | Generate HR, attendance, payroll, and workforce dashboards. |
| BPMN-054 | Custom MIS Report Builder Process | Build configurable MIS reports. |
| BPMN-070 | Report Export to Excel/PDF Process | Export reports securely. |

### Data Migration and Deployment

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-055 | Data Migration Import and Verification Process | Import, validate, correct, and verify legacy data. |
| BPMN-056 | Production Deployment and Go-Live Handover Process | Deploy, train, hand over, and support go-live. |

### Kiosk Attendance: Conditional Scope

| BPMN ID | Process Diagram Name | Short Purpose |
| ------- | -------------------- | ------------- |
| BPMN-058 | Kiosk Device Registration and Binding Process | Conditional process if shared kiosk attendance is approved. |
| BPMN-059 | Shared Kiosk Multi-Employee Attendance Capture Process | Conditional process for one device capturing multiple employees. |
| BPMN-060 | Kiosk Offline Attendance Sync Process | Conditional process for offline kiosk sync. |

## 6. Role-wise BPMN Diagram List

### Super Admin

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-001 | Tenant Onboarding and Company Activation Process | Creates and activates tenant company. |
| BPMN-002 | SaaS Subscription Plan Setup and Renewal Process | Configures plans, limits, billing, and renewal rules. |
| BPMN-003 | Tenant Suspension and Reactivation Process | Suspends or reactivates tenant access. |
| BPMN-004 | Role and Permission Configuration Process | Controls high-level access rules. |
| BPMN-066 | Payment Gateway Billing Collection Process | Monitors subscription payment flow. |

### Tenant Admin

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-004 | Role and Permission Configuration Process | Assigns tenant-level roles and permissions. |
| BPMN-007 | Department, Designation, and Organization Hierarchy Setup Process | Sets organization structure. |
| BPMN-023 | Attendance Rule Configuration Process | Approves or configures attendance policies. |
| BPMN-050 | Workflow Rule and Escalation Matrix Configuration Process | Configures approval routing and escalation. |
| BPMN-033 | Holiday Calendar Setup and Publishing Process | Approves holiday setup. |

### HR Admin

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-005 | Employee Master Creation and Approval Process | Creates employee records. |
| BPMN-008 | Digital Employee Onboarding Process | Initiates and completes onboarding. |
| BPMN-010 | Probation Review and Confirmation Process | Manages confirmation workflow. |
| BPMN-011 | Employee Document Upload and Verification Process | Verifies employee documents. |
| BPMN-012 | Employee Letter Generation Process | Generates HR letters. |
| BPMN-013 | Employee Resignation Submission Process | Receives and tracks resignation. |
| BPMN-014 | Exit Clearance and Full and Final Settlement Process | Coordinates exit clearance. |
| BPMN-022 | Attendance Regularization Request and Approval Process | Reviews attendance corrections. |
| BPMN-023 | Attendance Rule Configuration Process | Configures attendance rules. |
| BPMN-025 | Shift Master Setup and Assignment Process | Creates and assigns shifts. |
| BPMN-027 | Roster Planning and Publication Process | Publishes rosters. |
| BPMN-031 | Leave Application and Approval Process | Reviews leave records where HR is part of approval. |
| BPMN-032 | Leave Balance Credit and Adjustment Process | Adjusts leave balances. |
| BPMN-033 | Holiday Calendar Setup and Publishing Process | Configures holidays. |
| BPMN-042 | Salary Revision and Increment Approval Process | Initiates salary revision. |
| BPMN-045 | Performance Appraisal Cycle Process | Runs appraisal cycle. |
| BPMN-048 | HR Helpdesk Ticket Creation and Resolution Process | Resolves HR tickets. |

### Payroll Admin

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-034 | Payroll Cycle Configuration Process | Configures payroll cycles. |
| BPMN-035 | Salary Structure and Component Configuration Process | Configures salary structures and components. |
| BPMN-036 | Monthly Payroll Processing and Approval Process | Runs payroll. |
| BPMN-037 | Salary Days and Payable Days Calculation Process | Reviews payable-day calculation. |
| BPMN-038 | Statutory Compliance Calculation and Report Process | Generates statutory calculations and reports. |
| BPMN-039 | Employee Payslip Generation and Release Process | Releases payslips. |
| BPMN-040 | Loan Request and Approval Process | Posts loan EMI deductions. |
| BPMN-041 | Salary Advance Request and Recovery Process | Posts advance recovery. |
| BPMN-043 | Bulk Salary Revision Upload Process | Supports salary upload validation. |
| BPMN-044 | Arrear Calculation for Backdated Increment Process | Reviews arrear calculation. |
| BPMN-065 | Payroll Error Correction and Reprocessing Process | Corrects payroll errors. |

### Reporting Manager

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-006 | Employee Profile Update Process | Reviews employee profile changes where required. |
| BPMN-010 | Probation Review and Confirmation Process | Reviews probation performance. |
| BPMN-022 | Attendance Regularization Request and Approval Process | Approves or rejects attendance correction. |
| BPMN-026 | Shift Change Request and Approval Process | Approves or rejects shift change. |
| BPMN-028 | Overtime Calculation and Approval Process | Approves or rejects overtime. |
| BPMN-031 | Leave Application and Approval Process | Approves or rejects leave. |
| BPMN-040 | Loan Request and Approval Process | Reviews loan request if workflow requires. |
| BPMN-041 | Salary Advance Request and Recovery Process | Reviews salary advance request if workflow requires. |
| BPMN-045 | Performance Appraisal Cycle Process | Completes manager assessment. |
| BPMN-062 | GPS Mismatch and Geo-Fence Exception Process | Reviews location exception. |

### Employee

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-006 | Employee Profile Update Process | Updates personal profile details. |
| BPMN-011 | Employee Document Upload and Verification Process | Uploads required documents. |
| BPMN-013 | Employee Resignation Submission Process | Submits resignation. |
| BPMN-015 | Employee Mobile App Login and Session Process | Logs into mobile app. |
| BPMN-016 | Mobile Device Registration and Binding Process | Registers attendance device. |
| BPMN-017 | Individual Mobile Attendance Punch In/Punch Out Process | Marks punch in and punch out. |
| BPMN-021 | Web Portal Attendance Punch Process | Marks attendance from web if allowed. |
| BPMN-022 | Attendance Regularization Request and Approval Process | Raises correction request. |
| BPMN-026 | Shift Change Request and Approval Process | Requests shift change. |
| BPMN-031 | Leave Application and Approval Process | Applies for leave. |
| BPMN-039 | Employee Payslip Generation and Release Process | Views or downloads payslip. |
| BPMN-040 | Loan Request and Approval Process | Requests loan. |
| BPMN-041 | Salary Advance Request and Recovery Process | Requests salary advance. |
| BPMN-048 | HR Helpdesk Ticket Creation and Resolution Process | Raises HR ticket. |
| BPMN-057 | Offline Mobile Attendance Capture and Sync Process | Marks attendance offline if enabled. |

### Sales Employee

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-015 | Employee Mobile App Login and Session Process | Logs into mobile app. |
| BPMN-016 | Mobile Device Registration and Binding Process | Registers sales attendance device. |
| BPMN-018 | Sales Personnel Mobile Attendance with GPS Tracking Process | Marks sales attendance with GPS. |
| BPMN-019 | Sales Face Mapping Enrollment and Verification Process | Completes face enrollment or verification. |
| BPMN-020 | Sales Client/Territory Visit Attendance Tagging Process | Tags client, site, or territory during attendance. |
| BPMN-062 | GPS Mismatch and Geo-Fence Exception Process | Raises exception when GPS validation fails. |

### Finance

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-014 | Exit Clearance and Full and Final Settlement Process | Confirms finance clearance and recovery. |
| BPMN-036 | Monthly Payroll Processing and Approval Process | Reviews payroll amount and approvals. |
| BPMN-038 | Statutory Compliance Calculation and Report Process | Reviews statutory liability. |
| BPMN-040 | Loan Request and Approval Process | Approves loan finance decision. |
| BPMN-041 | Salary Advance Request and Recovery Process | Approves salary advance finance decision. |

### Asset Admin

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-046 | Employee Asset Allocation Process | Allocates assets to employee. |
| BPMN-047 | Employee Asset Return and Clearance Process | Confirms asset return and clearance. |
| BPMN-014 | Exit Clearance and Full and Final Settlement Process | Provides asset clearance input. |

### System

| BPMN ID | Process Diagram Name | User Action |
| ------- | -------------------- | ----------- |
| BPMN-024 | Cross-Day Shift Attendance Processing Process | Automatically processes overnight attendance. |
| BPMN-030 | Late Mark and Early Exit Deduction Process | Automatically calculates late and early exit impact. |
| BPMN-037 | Salary Days and Payable Days Calculation Process | Automatically calculates payable days. |
| BPMN-039 | Employee Payslip Generation and Release Process | Generates payslips after payroll approval. |
| BPMN-044 | Arrear Calculation for Backdated Increment Process | Automatically calculates arrears. |
| BPMN-049 | Helpdesk Escalation and SLA Breach Process | Triggers SLA escalation. |
| BPMN-051 | Automated Notification and Reminder Process | Sends notifications and reminders. |
| BPMN-052 | Audit Trail Capture and Export Process | Captures system audit logs. |
| BPMN-053 | Executive and HR Dashboard Generation Process | Generates dashboard metrics. |

## 7. Approval Workflow BPMN Diagrams

| BPMN ID  | Approval Process                                       | Request Raised By    | Approved By                                                      | Rejected By                                    | Escalation Needed |
| ----------| --------------------------------------------------------| ----------------------| ------------------------------------------------------------------| ------------------------------------------------| -------------------|
| BPMN-010 | Probation Review and Confirmation Process              | HR Admin             | Reporting Manager, HR Admin, Management                          | Reporting Manager, HR Admin, Management        | Yes               |
| BPMN-011 | Employee Document Upload and Verification Process      | Employee             | HR Admin                                                         | HR Admin                                       | No                |
| BPMN-014 | Exit Clearance and Full and Final Settlement Process   | Employee or HR Admin | Reporting Manager, HR Admin, Finance, Asset Admin, Payroll Admin | Any clearance owner based on pending clearance | Yes               |
| BPMN-022 | Attendance Regularization Request and Approval Process | Employee             | Reporting Manager, HR Admin                                      | Reporting Manager, HR Admin                    | Yes               |
| BPMN-026 | Shift Change Request and Approval Process              | Employee or HR Admin | Reporting Manager, HR Admin                                      | Reporting Manager, HR Admin                    | Yes               |
| BPMN-028 | Overtime Calculation and Approval Process              | System or Employee   | Reporting Manager, HR Admin, Payroll Admin                       | Reporting Manager, HR Admin, Payroll Admin     | Yes               |
| BPMN-029 | Weekly Off Work and Compensatory Off Process           | Employee or System   | Reporting Manager, HR Admin                                      | Reporting Manager, HR Admin                    | Yes               |
| BPMN-031 | Leave Application and Approval Process                 | Employee             | Reporting Manager, HR Admin                                      | Reporting Manager, HR Admin                    | Yes               |
| BPMN-036 | Monthly Payroll Processing and Approval Process        | Payroll Admin        | HR Admin, Finance, Management                                    | HR Admin, Finance, Management                  | Yes               |
| BPMN-040 | Loan Request and Approval Process                      | Employee             | Reporting Manager, HR Admin, Finance                             | Reporting Manager, HR Admin, Finance           | Yes               |
| BPMN-041 | Salary Advance Request and Recovery Process            | Employee             | Reporting Manager, HR Admin, Finance                             | Reporting Manager, HR Admin, Finance           | Yes               |
| BPMN-042 | Salary Revision and Increment Approval Process         | HR Admin             | Reporting Manager, Management, Payroll Admin                     | Reporting Manager, Management, Payroll Admin   | Yes               |
| BPMN-047 | Employee Asset Return and Clearance Process            | Employee or HR Admin | Asset Admin, HR Admin                                            | Asset Admin, HR Admin                          | Yes               |
| BPMN-065 | Payroll Error Correction and Reprocessing Process      | Payroll Admin        | HR Admin, Finance, Management                                    | HR Admin, Finance, Management                  | Yes               |

## 8. Exception and Alternate Flow BPMN Diagrams

| BPMN ID | Exception Process | Trigger Condition | Impacted Module | Recovery Flow Needed |
| ------- | ----------------- | ----------------- | --------------- | -------------------- |
| BPMN-003 | Tenant Suspension and Reactivation Process | Subscription expiry, payment failure, admin suspension | SaaS Platform Management | Payment, renewal, manual reactivation, or support approval. |
| BPMN-015 | Employee Mobile App Login and Session Process | Invalid login, expired OTP, session timeout, locked account | Mobile App | Retry, OTP resend, password reset, account unlock, session renewal. |
| BPMN-016 | Mobile Device Registration and Binding Process | Unapproved device, duplicate device, device limit exceeded | Mobile App | HR approval, device replacement, previous device removal. |
| BPMN-022 | Attendance Regularization Request and Approval Process | Missing punch, incorrect punch, attendance dispute | Attendance Management | Employee request, manager/HR approval, audit update. |
| BPMN-057 | Offline Mobile Attendance Capture and Sync Process | Device offline, delayed sync, conflict with server attendance | Mobile Attendance | Queue sync, conflict validation, HR review, audit flag. |
| BPMN-061 | Face Verification Failure Handling Process | Face/selfie match below threshold or camera verification failure | Attendance Technology | Retry, fallback proof, regularization request, HR approval. |
| BPMN-062 | GPS Mismatch and Geo-Fence Exception Process | Punch outside allowed radius or location unavailable | Attendance Technology | Retry GPS, submit exception, manager/HR approval. |
| BPMN-063 | Duplicate Punch Prevention and Correction Process | Repeated punch within duplicate punch window | Attendance Management | Block punch, display message, allow correction request if needed. |
| BPMN-064 | Invalid Document Upload Rejection Process | Wrong document, unreadable file, invalid format, expired proof | Document Management | Reject with reason, notify employee, allow re-upload. |
| BPMN-065 | Payroll Error Correction and Reprocessing Process | Incorrect attendance, salary component, deduction, arrear, or payable days | Payroll Management | Correct source data, reprocess payroll, re-approve payroll. |
| BPMN-049 | Helpdesk Escalation and SLA Breach Process | Ticket unresolved beyond SLA | Helpdesk | Auto-escalate to next owner and notify stakeholders. |
| BPMN-060 | Kiosk Offline Attendance Sync Process | Kiosk offline sync failure if kiosk is approved | Kiosk Attendance | Retry sync, flag failed records, admin review. |

## 9. System Automation BPMN Diagrams

| BPMN ID | Automation Process | Trigger | System Action | Output |
| ------- | ------------------ | ------- | ------------- | ------ |
| BPMN-012 | Employee Letter Generation Process | HR selects letter template or workflow reaches letter stage | Generate PDF using template and employee data | Letter saved in employee repository. |
| BPMN-024 | Cross-Day Shift Attendance Processing Process | Punch out occurs after midnight for assigned shift | Link punch to original shift and calculate extra hours | Correct attendance day and OT basis. |
| BPMN-030 | Late Mark and Early Exit Deduction Process | Attendance processed after punch in/out | Apply grace, late count, early exit, deduction rules | Attendance status and payroll deduction input. |
| BPMN-037 | Salary Days and Payable Days Calculation Process | Payroll processing starts | Calculate payable days using attendance, leave, weekly off, holiday, and policies | Payable days for payroll. |
| BPMN-039 | Employee Payslip Generation and Release Process | Payroll approved | Generate payslip and publish to employee portal/mobile | Employee payslip access. |
| BPMN-044 | Arrear Calculation for Backdated Increment Process | Backdated salary revision posted | Calculate arrear amount for affected months | Arrear earning in payroll. |
| BPMN-049 | Helpdesk Escalation and SLA Breach Process | Ticket SLA threshold reached | Escalate ticket and send alerts | Escalated ticket and notification. |
| BPMN-051 | Automated Notification and Reminder Process | Workflow event, pending approval, attendance event, payroll release, onboarding task | Send email/SMS/push/in-app notification | Notification delivered or failure logged. |
| BPMN-052 | Audit Trail Capture and Export Process | User or system performs auditable action | Capture actor, timestamp, action, module, old/new data where applicable | Audit log record and exportable report. |
| BPMN-053 | Executive and HR Dashboard Generation Process | Dashboard opened or scheduled refresh | Aggregate HR, attendance, leave, payroll, and workforce metrics | Dashboard output. |
| BPMN-057 | Offline Mobile Attendance Capture and Sync Process | Device reconnects after offline punch | Sync attendance queue to server | Synced attendance or exception record. |
| BPMN-060 | Kiosk Offline Attendance Sync Process | Kiosk reconnects after offline capture | Sync queued kiosk punches if kiosk is approved | Synced kiosk attendance or failed sync report. |

## 10. Integration BPMN Diagrams

| BPMN ID | Integration Process | External System | Data Sent | Data Received | Failure Handling Needed |
| ------- | ------------------- | --------------- | --------- | ------------- | ----------------------- |
| BPMN-015 | Employee Mobile App Login and Session Process | OTP/SMS Service | Mobile number, OTP request, user identifier | OTP delivery status, verification status | OTP resend, login retry, account lock handling. |
| BPMN-066 | Payment Gateway Billing Collection Process | Payment Gateway | Invoice amount, tenant ID, billing reference, payment request | Payment success, failure, transaction ID, settlement status | Retry payment, mark failed, notify tenant, prevent incorrect suspension. |
| BPMN-067 | Email, SMS, OTP, and Push Notification Integration Process | Email, SMS, OTP, Push Notification Services | Recipient, template, message, event reference | Delivery status, failure reason | Retry, alternate channel, failure log, admin alert. |
| BPMN-068 | GPS and Location Service Validation Process | Mobile GPS/Location Service | Location request, permission request, app/device metadata | Latitude, longitude, accuracy, permission status | Retry, exception request, regularization workflow. |
| BPMN-069 | Face Recognition or Selfie Verification Service Process | Face Verification Service or On-device Face Engine | Face image/face map, employee ID, verification request | Match score, verification result, failure reason | Retry, fallback proof, HR approval, audit flag. |
| BPMN-018 | Sales Personnel Mobile Attendance with GPS Tracking Process | GPS/Location Service | Sales punch event and location request | GPS coordinates, accuracy, timestamp | Location exception and manager/HR review. |
| BPMN-019 | Sales Face Mapping Enrollment and Verification Process | Face Verification Service | Enrollment image/face map and verification request | Enrollment status, match score, verification status | Re-enrollment, fallback approval, failed verification audit. |
| BPMN-038 | Statutory Compliance Calculation and Report Process | Statutory Portal or Export Utility, if approved | Payroll/statutory report data | Upload result or acknowledgement, if integrated | Manual export fallback and correction process. |
| BPMN-055 | Data Migration Import and Verification Process | Legacy HR/payroll files or external HR system | Import templates, mapped source data | Validation result, import status, error report | Error correction, re-upload, reconciliation sign-off. |

## 11. BPMN Diagram Priority Roadmap

### Phase 1: Must-Have BPMN Diagrams Before Development

The following diagrams should be prepared first because they define core system behavior and directly affect architecture, database design, role permissions, and development estimates:

* BPMN-001: Tenant Onboarding and Company Activation Process
* BPMN-004: Role and Permission Configuration Process
* BPMN-005: Employee Master Creation and Approval Process
* BPMN-007: Department, Designation, and Organization Hierarchy Setup Process
* BPMN-008: Digital Employee Onboarding Process
* BPMN-014: Exit Clearance and Full and Final Settlement Process
* BPMN-015: Employee Mobile App Login and Session Process
* BPMN-016: Mobile Device Registration and Binding Process
* BPMN-017: Individual Mobile Attendance Punch In/Punch Out Process
* BPMN-018: Sales Personnel Mobile Attendance with GPS Tracking Process
* BPMN-019: Sales Face Mapping Enrollment and Verification Process
* BPMN-022: Attendance Regularization Request and Approval Process
* BPMN-023: Attendance Rule Configuration Process
* BPMN-024: Cross-Day Shift Attendance Processing Process
* BPMN-025: Shift Master Setup and Assignment Process
* BPMN-028: Overtime Calculation and Approval Process
* BPMN-030: Late Mark and Early Exit Deduction Process
* BPMN-031: Leave Application and Approval Process
* BPMN-034: Payroll Cycle Configuration Process
* BPMN-035: Salary Structure and Component Configuration Process
* BPMN-036: Monthly Payroll Processing and Approval Process
* BPMN-037: Salary Days and Payable Days Calculation Process
* BPMN-038: Statutory Compliance Calculation and Report Process
* BPMN-039: Employee Payslip Generation and Release Process
* BPMN-050: Workflow Rule and Escalation Matrix Configuration Process
* BPMN-052: Audit Trail Capture and Export Process
* BPMN-055: Data Migration Import and Verification Process
* BPMN-061: Face Verification Failure Handling Process
* BPMN-062: GPS Mismatch and Geo-Fence Exception Process
* BPMN-063: Duplicate Punch Prevention and Correction Process
* BPMN-065: Payroll Error Correction and Reprocessing Process

### Phase 2: BPMN Diagrams Required Before Integration

The following diagrams should be prepared before connecting modules, mobile services, notifications, third-party services, payment systems, or external data sources:

* BPMN-002: SaaS Subscription Plan Setup and Renewal Process
* BPMN-020: Sales Client/Territory Visit Attendance Tagging Process
* BPMN-029: Weekly Off Work and Compensatory Off Process
* BPMN-032: Leave Balance Credit and Adjustment Process
* BPMN-033: Holiday Calendar Setup and Publishing Process
* BPMN-040: Loan Request and Approval Process
* BPMN-041: Salary Advance Request and Recovery Process
* BPMN-042: Salary Revision and Increment Approval Process
* BPMN-043: Bulk Salary Revision Upload Process
* BPMN-044: Arrear Calculation for Backdated Increment Process
* BPMN-051: Automated Notification and Reminder Process
* BPMN-057: Offline Mobile Attendance Capture and Sync Process
* BPMN-066: Payment Gateway Billing Collection Process
* BPMN-067: Email, SMS, OTP, and Push Notification Integration Process
* BPMN-068: GPS and Location Service Validation Process
* BPMN-069: Face Recognition or Selfie Verification Service Process
* BPMN-070: Report Export to Excel/PDF Process

### Phase 3: BPMN Diagrams Required Before UAT

The following diagrams should be prepared before client UAT, final workflow validation, training, and go-live acceptance:

* BPMN-003: Tenant Suspension and Reactivation Process
* BPMN-006: Employee Profile Update Process
* BPMN-009: Offer Acceptance and Joining Workflow
* BPMN-010: Probation Review and Confirmation Process
* BPMN-011: Employee Document Upload and Verification Process
* BPMN-012: Employee Letter Generation Process
* BPMN-013: Employee Resignation Submission Process
* BPMN-021: Web Portal Attendance Punch Process
* BPMN-026: Shift Change Request and Approval Process
* BPMN-027: Roster Planning and Publication Process
* BPMN-045: Performance Appraisal Cycle Process
* BPMN-046: Employee Asset Allocation Process
* BPMN-047: Employee Asset Return and Clearance Process
* BPMN-048: HR Helpdesk Ticket Creation and Resolution Process
* BPMN-049: Helpdesk Escalation and SLA Breach Process
* BPMN-053: Executive and HR Dashboard Generation Process
* BPMN-054: Custom MIS Report Builder Process
* BPMN-056: Production Deployment and Go-Live Handover Process
* BPMN-064: Invalid Document Upload Rejection Process
* BPMN-058: Kiosk Device Registration and Binding Process, only if approved
* BPMN-059: Shared Kiosk Multi-Employee Attendance Capture Process, only if approved
* BPMN-060: Kiosk Offline Attendance Sync Process, only if approved

## 12. Missing Information / Clarification Required

| Area | Missing Information | Question for Client | Impact if Not Clarified |
| ---- | ------------------- | ------------------- | ----------------------- |
| Kiosk Attendance | RFP mentions shared Android kiosk attendance, but BRD/client note says shared one-device-many-employee attendance is not confirmed. | Should shared kiosk attendance be included in phase 1, future phase, or fully excluded? | Wrong scope, incorrect estimate, extra mobile/kiosk architecture, and UAT conflict. |
| Sales Attendance Tracking | Tracking frequency is unclear. | Should sales tracking happen only at punch in/out, during client visits, at route checkpoints, or continuously during duty hours? | Privacy, battery usage, mobile architecture, reports, and consent requirements may change. |
| Sales Face Verification | Face mapping is mentioned, but selfie plus GPS may also be acceptable. | Is face verification mandatory for sales attendance, or is selfie with GPS acceptable? | Affects third-party service selection, cost, privacy, and failure handling. |
| Device Binding | Device control rules are not finalized. | Should one employee be allowed only one registered device, multiple approved devices, or temporary device change? | Affects login, attendance security, support process, and device replacement workflow. |
| Offline Attendance | Offline attendance is mentioned, but policy is not finalized. | Which employee categories can use offline attendance, and for how long can offline records remain unsynced? | Affects fraud prevention, sync logic, conflict handling, and audit design. |
| Face Data Storage | Face map/image retention rules are not defined. | Should the system store face images, face templates only, or verification result only? | Affects legal compliance, storage, security, consent, and integration design. |
| GPS Exception Handling | Recovery process for GPS mismatch is not finalized. | Who approves GPS exceptions: manager, HR, or both? | Affects attendance regularization workflow and sales attendance disputes. |
| Attendance Approval Levels | Approval matrix varies by department/designation but exact rules are not provided. | What are approval levels for attendance correction, OT, shift change, and leave? | Workflow engine cannot be configured accurately. |
| Cross-Day Shift Rules | Mandatory cross-day behavior is defined, but edge cases are not fully listed. | How should missed punch, double shift, early punch, and next-day roster conflict be handled? | Incorrect attendance and OT calculation in night shift scenarios. |
| Overtime Policy | OT multipliers and calculation bases are configurable, but final client policy is not confirmed. | Which employee categories use which OT multiplier and wage base? | Payroll may calculate incorrect OT. |
| Weekly Off Work | Multiple options exist: OT, compensatory off, both, or nothing. | What policy applies to staff, workers, contract employees, and sales employees? | Leave and payroll outputs may be incorrect. |
| Late Mark and Early Exit | Multiple deduction options exist. | Which late/early exit policy applies by employee type, department, branch, or designation? | Attendance deduction and payroll calculation may be disputed. |
| Payroll Cycle | Many payroll cycles are listed. | Which payroll cycles must be supported at launch for actual tenants? | Payroll engine and UAT cases may become too broad or incomplete. |
| Salary Day Calculation | Many salary-day methods are listed. | Which salary-day calculation methods are required for staff, workers, and sales employees? | Payable-days calculation may be incorrect. |
| Statutory Compliance States | PT and LWF are state-specific. | Which Indian states must be supported in phase 1? | Statutory setup and reports may be incomplete. |
| Salary Revision Approval | Salary revision workflow mentions HR and management approval. | What are exact approval levels for salary revision and bulk increment? | Salary changes may be posted without correct authorization. |
| Loan and Advance Approval | Approval owners are not finalized. | Who approves loans and salary advances, and are finance approvals mandatory? | Payroll deduction workflows may be incorrectly designed. |
| Helpdesk SLA | SLA levels and escalation owners are not defined. | What are ticket categories, SLA hours, and escalation hierarchy? | Helpdesk automation and escalation process cannot be finalized. |
| Reports | Report list is broad but phase-wise report priority is unclear. | Which reports and dashboards are required in phase 1, UAT, and post-go-live? | Report development may be overbuilt or miss critical outputs. |
| Data Migration | Source formats and data quality are unknown. | What data sources, formats, fields, and historical periods must be migrated? | Migration estimate, validation rules, and sign-off process may be inaccurate. |
| Payment Gateway | SaaS billing is required, but payment provider is not specified. | Which payment gateway should be used for subscription billing? | Integration design and billing failure process cannot be finalized. |
| Notification Channels | Email, SMS, OTP, push, WhatsApp/RCS are possible, but not finalized. | Which notification channels are required at launch? | Communication flows and vendor integrations may change. |
| Mobile OS Support | Android and iOS apps are required, but version support is unclear. | Which Android and iOS versions must be supported? | Testing scope and technical design may be incomplete. |
| UAT Acceptance | Acceptance criteria are broad. | What exact UAT scenarios and sign-off owners are required module-wise? | Client acceptance may be delayed due to unclear completion criteria. |

## 13. Final Recommendation

The BPMN preparation should start with the most business-critical and development-blocking workflows: tenant onboarding, role and permission setup, employee master, mobile attendance, sales attendance with GPS tracking, attendance rule configuration, cross-day shift processing, overtime approval, leave approval, payroll configuration, payroll processing, payable-days calculation, statutory compliance, audit trail, and data migration.

The most critical diagrams for development are the attendance, mobile attendance, sales tracking, shift, payroll, workflow engine, and security diagrams because these directly affect database design, rule engine design, API design, mobile behavior, and UAT test cases.

The most important diagrams for client approval are attendance regularization, sales attendance tracking, GPS mismatch handling, face verification failure handling, leave approval, overtime approval, monthly payroll processing, salary-day calculation, exit/full and final settlement, and statutory reporting.

Kiosk attendance diagrams should not be prepared as detailed BPMN diagrams until the client confirms whether shared one-device-many-employee attendance is part of the approved project scope. Until then, kiosk processes should remain conditional and should be handled as a future phase or change request.
