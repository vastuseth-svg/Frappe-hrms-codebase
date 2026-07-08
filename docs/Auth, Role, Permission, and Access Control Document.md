# Auth, Role, Permission, and Access Control Document

## 1. Document Overview

This document defines authentication, authorization, roles, permissions, access control, device binding, kiosk access, tenant isolation, session rules, and audit/security requirements for the Shree HRMS SaaS platform.

Auth and permissions must be finalized before development because HRMS contains highly sensitive employee, payroll, attendance, location, face/selfie, statutory, and audit data. Incorrect access control can cause data leakage, payroll errors, compliance issues, and client trust failure.

This document will be used by:

* Business Analyst to validate access rules with the client.
* Developers to design Frappe roles, DocType permissions, APIs, workflows, and frontend guards.
* Testers to create role-based, tenant-isolation, mobile, kiosk, and security test cases.
* Client stakeholders to approve who can access, approve, configure, export, and audit each module.

## 2. Source Documents Analyzed

| Document Name | Purpose | Used For Auth Planning |
| ------------- | ------- | ---------------------- |
| RFP / Client Requirement Document | Defines full HRMS SaaS scope including tenant setup, employee lifecycle, attendance, kiosk, sales attendance, payroll, reports, workflows, audit, and mobile app. | Used to identify login areas, modules, actors, admin controls, reports, workflows, and audit needs. |
| BRD / Business Requirement Document | Defines business scope, stakeholders, modules, assumptions, mobile attendance, sales tracking, and access-sensitive areas. | Used to define role responsibilities, scope boundaries, and approval/security rules. |
| BPMN Process Diagram Index Document | Lists business processes required for BPMN preparation. | Used to identify workflow approval roles, exception processes, integrations, and audit events. |
| Phase-wise Development Planning Document | Defines development phases and dependencies. | Used to sequence auth controls for Phase 1 foundation, Phase 2 mobile/kiosk security, and later modules. |
| Client Meeting Notes / Clarifications | Confirms kiosk attendance is in scope. | Used to include kiosk registration, kiosk binding, kiosk attendance, kiosk offline sync, and kiosk exception handling as mandatory access-controlled areas. |

## 3. Authentication Scope

| Login Area | User Type | Authentication Method | Notes |
| ---------- | --------- | --------------------- | ----- |
| Super Admin web login | Platform administrator | Username/password, OTP recommended, session token | Platform-level SaaS admin. |
| Tenant Admin web login | Tenant/company administrator | Username/password, OTP recommended, session token | Tenant-level configuration access. |
| HR Admin web login | HR user | Username/password, OTP optional, session token | Manages HR, employee, attendance, leave, onboarding, exit. |
| Payroll Admin web login | Payroll user | Username/password, OTP recommended, session token | Handles sensitive payroll data. |
| Finance Admin web login | Finance user | Username/password, OTP recommended, session token | Payroll approvals, loans, advances, statutory summaries. |
| Manager web/mobile login | Reporting manager | Username/password or email/mobile OTP, session token | Team approvals and team visibility. |
| Employee web/mobile login | Employee | Email/mobile login, password or OTP, mobile session token | Self-service access only. |
| Sales employee mobile login | Sales/field employee | Mobile login, OTP, device binding, optional biometric | GPS/face/selfie attendance. |
| Kiosk admin login | Kiosk/device administrator | Web login plus kiosk admin PIN | Registers, binds, activates, deactivates kiosk. |
| Kiosk device session | Registered kiosk device | Device token, kiosk binding, kiosk activation status | Shared attendance device, not employee login. |
| Candidate/pre-onboarding access | Candidate | Secure invite link, OTP, limited session | Used only for offer acceptance/document upload if enabled. |
| Auditor web login | Auditor/compliance user | Username/password, OTP recommended | Read-only reports and audit logs. |
| Implementation Partner / Support login | Support user | Username/password, OTP required, time-bound access | Support access should be temporary and audited. |

## 4. User Role List

| Role ID | Role Name | Role Type | Description |
| ------- | --------- | --------- | ----------- |
| ROLE-001 | Super Admin | Platform Role | Manages SaaS tenants, plans, platform settings, and global controls. |
| ROLE-002 | Tenant Admin | Tenant Role | Manages tenant/company configuration, users, roles, workflows, and policies. |
| ROLE-003 | HR Admin | Company/HR Role | Manages employee master, attendance, leave, onboarding, exit, documents, and HR workflows. |
| ROLE-004 | Payroll Admin | Company/Payroll Role | Manages salary structure, payroll processing, payslips, statutory calculations, loans, advances, and revisions. |
| ROLE-005 | Finance Admin | Company/Finance Role | Reviews payroll, loans, advances, statutory liability, recoveries, and finance clearance. |
| ROLE-006 | Reporting Manager | Manager Role | Views and approves team-related attendance, leave, overtime, shift, performance, and regularization. |
| ROLE-007 | Employee | Self-Service Role | Accesses own profile, attendance, leave, payslip, documents, tickets, and requests. |
| ROLE-008 | Sales Employee | Self-Service / Field Role | Employee role with sales attendance, GPS tracking, face/selfie verification, and visit tagging. |
| ROLE-009 | Kiosk Admin / Device Admin | Device Admin Role | Registers, maps, activates, monitors, resets, and deactivates kiosk devices. |
| ROLE-010 | Asset Admin | Company/Asset Role | Manages asset master, allocation, return, transfer, and exit clearance. |
| ROLE-011 | Helpdesk Agent | Company/Support Role | Manages HR tickets, ticket categories, assignment, resolution, and SLA handling. |
| ROLE-012 | Management / Executive | Executive Role | Views dashboards, summaries, reports, and approval items as configured. |
| ROLE-013 | Candidate | Limited External Role | Accesses pre-onboarding offer/document submission only. |
| ROLE-014 | Auditor | Read-Only Audit Role | Views audit logs, selected reports, and compliance evidence. |
| ROLE-015 | Implementation Partner / Support User | Temporary Support Role | Provides implementation/support with controlled, time-bound, audited access. |

## 5. Role Hierarchy

```text
Super Admin
→ Tenant Admin
→ HR Admin / Payroll Admin / Finance Admin / Kiosk Admin / Asset Admin / Helpdesk Agent
→ Reporting Manager / Management
→ Employee / Sales Employee
→ Candidate
```

Tenant-level roles:

* Super Admin can manage tenants from the platform level.
* Tenant Admin can manage only their own tenant.
* Implementation Partner / Support User may access assigned tenant(s) only when explicitly authorized.

Company-level roles:

* HR Admin, Payroll Admin, Finance Admin, Asset Admin, Helpdesk Agent, Management, and Auditor may be assigned at company level.
* Their access must be restricted by tenant and company.

Branch/location-level roles:

* HR Admin, Payroll Admin, Manager, Kiosk Admin, Asset Admin, and Helpdesk Agent may be restricted to assigned branches or locations.
* Kiosk devices must always be bound to a tenant, company, branch, and location.

Employee-self-service roles:

* Employee can access only own records.
* Sales Employee can access own records plus sales attendance/tracking functions.
* Candidate can access only pre-onboarding records linked to their invite.

## 6. Authentication Methods

| Auth Method | Applies To | Purpose | Required? |
| ----------- | ---------- | ------- | --------- |
| Username/password | Web users | Standard secure login | Yes |
| Email/mobile login | Employees, managers, sales employees | Easier employee self-service login | Yes |
| OTP login | Mobile users, sensitive admin users | Login verification and device registration | Yes for mobile; recommended for admins |
| Biometric login on mobile | Employees, sales employees | Convenience after successful login | Optional, client approval required |
| Session token | Web/mobile/kiosk APIs | Authenticate active session | Yes |
| Refresh token | Mobile app | Maintain mobile session securely | Yes |
| Admin PIN for kiosk | Kiosk Admin / Device Admin | Exit kiosk mode or perform local admin actions | Yes |
| Device fingerprint | Mobile and kiosk devices | Device binding and device trust | Yes |
| Password reset | Web/mobile users | Recover account access | Yes |
| Account lock after failed attempts | All users | Prevent brute force attack | Yes |

## 7. Multi-Tenant Access Control Rules

| Rule ID | Rule | Impact |
| ------- | ---- | ------ |
| MT-001 | One tenant must not access another tenant’s data. | Prevents cross-company data leakage. |
| MT-002 | Every business record must carry tenant/company context. | Enables tenant filtering and audit. |
| MT-003 | Super Admin can manage tenants but should not edit employee payroll data unless explicitly granted break-glass/support access. | Protects tenant payroll confidentiality. |
| MT-004 | Tenant Admin can access only own tenant data. | Enforces SaaS isolation. |
| MT-005 | Company-level users can access only assigned company data. | Supports multi-company tenants. |
| MT-006 | Branch/location users can access only assigned branch/location data. | Restricts local HR/admin visibility. |
| MT-007 | Reports must respect tenant, company, branch, location, role, and employee ownership permissions. | Prevents unauthorized report visibility. |
| MT-008 | APIs must enforce tenant filtering on server side. | Frontend filtering alone is not acceptable. |
| MT-009 | Background jobs must process records within tenant context. | Prevents batch processing across tenants incorrectly. |
| MT-010 | Export files must include only permitted data scope. | Prevents accidental data leakage. |
| MT-011 | Audit logs must record tenant, company, actor, role, action, timestamp, and source. | Enables traceability. |

## 8. Module-wise Permission Matrix

| Module | Super Admin | Tenant Admin | HR Admin | Payroll Admin | Finance | Manager | Employee | Sales Employee | Kiosk Admin | Auditor |
| ------ | ----------- | ------------ | -------- | ------------- | ------- | ------- | -------- | -------------- | ----------- | ------- |
| Tenant Management | Full Access | No Access | No Access | No Access | No Access | No Access | No Access | No Access | No Access | View All |
| Company Setup | View All | Configure | View All | View All | View All | No Access | No Access | No Access | No Access | View All |
| Branch/Location Setup | View All | Configure | Create, Edit | View All | View All | View Branch | No Access | No Access | View Branch | View All |
| Department/Designation | View All | Configure | Create, Edit | View All | View All | View Branch | No Access | No Access | No Access | View All |
| Role and Permission | Configure | Configure | No Access | No Access | No Access | No Access | No Access | No Access | No Access | View All |
| Employee Master | No Access | View All | Full Access | View All | View All | View Team | View Own | View Own | No Access | View All |
| Employee Profile | No Access | View All | Full Access | View All | View All | View Team | View Own, Edit Own | View Own, Edit Own | No Access | View All |
| Mobile Login | Configure | Configure | View All | No Access | No Access | View Own | View Own | View Own | No Access | View All |
| Device Binding | View All | Configure | Approve, View All | No Access | No Access | View Team | View Own | View Own | No Access | View All |
| Kiosk Device Setup | View All | Configure | View All | No Access | No Access | No Access | No Access | No Access | Full Access | View All |
| Mobile Attendance | No Access | View All | View All, Edit, Approve | View All | View All | View Team | Create, View Own | Create, View Own | No Access | View All |
| Kiosk Attendance | No Access | View All | View All, Approve | View All | View All | View Team | Create | Create | Configure, View Branch | View All |
| Sales Attendance | No Access | View All | View All, Approve | View All | View All | View Team | No Access | Create, View Own | No Access | View All |
| Attendance Regularization | No Access | View All | Approve, Edit | View All | No Access | Approve Team | Create, View Own | Create, View Own | No Access | View All |
| Shift/Roster | No Access | Configure | Create, Edit | View All | View All | View Team, Approve | View Own | View Own | No Access | View All |
| Overtime | No Access | View All | Approve, Edit | View All | View All | Approve Team | View Own | View Own | No Access | View All |
| Leave | No Access | View All | Configure, Approve | View All | No Access | Approve Team | Create, View Own | Create, View Own | No Access | View All |
| Holiday | No Access | Configure | Create, Edit | View All | View All | View All | View Own | View Own | No Access | View All |
| Payroll | No Access | View All | View All | Full Access | Approve, View All | No Access | No Access | No Access | No Access | View All |
| Payslip | No Access | View All | View All | Create, Release | View All | No Access | View Own | View Own | No Access | View All |
| Loans/Advances | No Access | View All | Approve, View All | Edit, View All | Approve, View All | Approve Team | Create, View Own | Create, View Own | No Access | View All |
| Salary Revision | No Access | View All | Create, Edit | Edit, View All | View All | Recommend Team | No Access | No Access | No Access | View All |
| Statutory Compliance | No Access | View All | View All | Full Access | View All | No Access | No Access | No Access | No Access | View All |
| Documents | No Access | View All | Full Access | View All | View Related | View Team | Create, View Own | Create, View Own | No Access | View All |
| Onboarding | No Access | View All | Full Access | No Access | No Access | View Team | No Access | No Access | No Access | View All |
| Exit/F&F | No Access | View All | Full Access | Edit Payroll Part | Approve Finance Part | Approve Team | Create, View Own | Create, View Own | No Access | View All |
| Asset Management | No Access | View All | View All | No Access | View All | View Team | View Own | View Own | No Access | View All |
| Helpdesk | No Access | View All | View All | No Access | No Access | View Team | Create, View Own | Create, View Own | No Access | View All |
| Performance | No Access | View All | Configure | No Access | No Access | Approve Team | Create, View Own | Create, View Own | No Access | View All |
| Reports | View All | Export, View All | Export, View All | Export, View All | Export, View All | View Team | View Own | View Own | View Branch | View All, Export |
| Audit Logs | View All | View All | View Related | View Payroll Related | View Finance Related | View Team Related | No Access | No Access | View Kiosk Related | View All |
| Notifications | Configure | Configure | Configure HR | Configure Payroll Related | View Finance Related | View Team | View Own | View Own | View Kiosk Related | View All |
| Data Migration | Configure | Approve, View All | Import HR Data | Import Payroll Data | View Finance Data | No Access | No Access | No Access | No Access | View All |
| Deployment Settings | Full Access | View Own Tenant | No Access | No Access | No Access | No Access | No Access | No Access | No Access | View All |

## 9. Action-level Permission Matrix

| Action | Allowed Roles | Restrictions |
| ------ | ------------- | ------------ |
| Create employee | HR Admin, Tenant Admin | Tenant/company/branch scope enforced. |
| Edit employee | HR Admin | Sensitive payroll fields restricted to Payroll Admin. |
| Deactivate employee | HR Admin, Tenant Admin | Must create audit log; payroll/exit dependency check required. |
| Approve employee profile update | HR Admin, Reporting Manager if configured | Only assigned employee/team scope. |
| Configure attendance rule | HR Admin, Tenant Admin | Tenant/company/branch policy scope. |
| Mark own attendance | Employee, Sales Employee | Only authenticated approved device or allowed web channel. |
| Mark kiosk attendance | Employee, Sales Employee | Only from registered active kiosk device. |
| Approve attendance regularization | Reporting Manager, HR Admin | Manager team scope; HR tenant/company/branch scope. |
| Configure kiosk device | Kiosk Admin, Tenant Admin, HR Admin | Device must be bound to tenant/company/branch/location. |
| Reset employee device | HR Admin, Tenant Admin | Requires request and audit log. |
| Approve device change | HR Admin, Tenant Admin | Approval required unless policy allows self-reset. |
| Configure shift | HR Admin, Tenant Admin | Branch/company scope enforced. |
| Approve overtime | Reporting Manager, HR Admin, Payroll Admin | Payroll Admin confirms payroll posting only. |
| Approve leave | Reporting Manager, HR Admin | Based on workflow matrix. |
| Run payroll | Payroll Admin | Only assigned company/payroll cycle. |
| Approve payroll | Finance Admin, Management | Must be separate from preparer if maker-checker enabled. |
| Release payslip | Payroll Admin | Only after payroll approval. |
| Export payroll report | Payroll Admin, Finance Admin, Management, Auditor | Export logged; sensitive data masked if configured. |
| View audit logs | Auditor, Tenant Admin, Super Admin, authorized admins | Read-only; scope restrictions apply. |
| Configure workflow | Tenant Admin, HR Admin for HR workflows | Changes must be audited. |
| Perform data migration | Implementation Partner, HR Admin, Payroll Admin, Tenant Admin | Requires approval and validation report. |
| Change tenant settings | Tenant Admin, Super Admin | Tenant Admin own tenant only; Super Admin platform level. |

## 10. Mobile App Access Rules

| Rule ID | Rule | Applies To | Notes |
| ------- | ---- | ---------- | ----- |
| MOB-001 | Employee must be authenticated before app access. | Employee, Sales Employee, Manager | No anonymous mobile access except candidate invite flow. |
| MOB-002 | Mobile attendance allowed only from approved device if device binding is enabled. | Employee, Sales Employee | Recommended as mandatory for attendance. |
| MOB-003 | One employee one primary device rule applies by default. | Employee, Sales Employee | Client approval required for additional devices. |
| MOB-004 | Device change requires approval. | Employee, Sales Employee | HR Admin/Tenant Admin approval recommended. |
| MOB-005 | Sales employee must use assigned/approved device. | Sales Employee | Required for GPS/face attendance integrity. |
| MOB-006 | Biometric login allowed only after first successful login. | Mobile users | Biometric unlock must not replace backend token validation. |
| MOB-007 | Mobile session must expire after configured inactivity or token expiry. | Mobile users | Default values require client approval. |
| MOB-008 | Offline access is limited to allowed offline attendance functions. | Employee, Sales Employee | Offline records must sync and be audited. |
| MOB-009 | Unauthorized device must be blocked from attendance. | Employee, Sales Employee | User may request device approval/reset. |
| MOB-010 | Mobile app must not expose another employee’s data. | Employee, Sales Employee | Server-side ownership check required. |

## 11. Device Binding Rules

| Rule ID | Device Binding Rule | Approval Required? | Applies To |
| ------- | ------------------- | ------------------ | ---------- |
| DB-001 | First device registration captures device fingerprint/device ID. | Optional by policy; recommended Yes | Employee, Sales Employee |
| DB-002 | Device fingerprint must be stored with employee, tenant, timestamp, and status. | No | Employee Device |
| DB-003 | Device replacement request must be raised before new device can mark attendance. | Yes | Employee, Sales Employee |
| DB-004 | Lost/stolen device must be blocked immediately after report. | Yes | Employee, Sales Employee |
| DB-005 | Multiple active devices are blocked by default. | Yes for exception | Employee, Sales Employee |
| DB-006 | Device reset requires HR Admin or Tenant Admin approval. | Yes | Employee Device |
| DB-007 | Device unbinding must invalidate mobile attendance access from old device. | Yes | Employee Device |
| DB-008 | Blocked device cannot login or mark attendance depending on policy. | No | Employee Device |
| DB-009 | All device changes must create audit logs. | No approval, audit mandatory | Employee Device |
| DB-010 | Sales employee device changes should require stricter approval. | Yes | Sales Employee |

## 12. Kiosk Access Control Rules

| Rule ID | Kiosk Rule | Applies To | Notes |
| ------- | ---------- | ---------- | ----- |
| KSK-001 | Kiosk device must be registered before use. | Kiosk Device | Mandatory. |
| KSK-002 | Kiosk must be bound to tenant/company/branch/location. | Kiosk Device Binding | Mandatory for attendance policy and reporting. |
| KSK-003 | Kiosk cannot be used outside assigned branch/location unless approved. | Kiosk Device | Location/device mismatch should create exception. |
| KSK-004 | Kiosk device requires admin activation before attendance capture. | Kiosk Admin | Activation must be audited. |
| KSK-005 | Kiosk exit requires admin PIN or authorized admin login. | Kiosk App | Prevents misuse of shared attendance device. |
| KSK-006 | Multiple employees can mark attendance from one kiosk. | Kiosk Attendance | Confirmed in scope. |
| KSK-007 | Kiosk attendance must verify employee identity. | Employee, Sales Employee | Face/selfie/employee code fallback to be finalized. |
| KSK-008 | Kiosk offline attendance must be synced and audited. | Kiosk Offline Sync | Offline queue must preserve sequence. |
| KSK-009 | Kiosk deactivation blocks new attendance capture. | Kiosk Device | Existing offline records require admin review. |
| KSK-010 | Kiosk replacement requires new registration/binding and old device deactivation. | Kiosk Device | Audit required. |
| KSK-011 | Kiosk attendance must log kiosk device ID, branch, location, employee, timestamp, and verification status. | Kiosk Attendance | Required for audit. |
| KSK-012 | Kiosk failed verification must not create approved attendance automatically. | Kiosk Attendance | Must create exception or retry. |

## 13. Approval Permission Rules

| Workflow | Request Raised By | Approver Role | Escalation Role | Notes |
| -------- | ----------------- | ------------- | --------------- | ----- |
| Attendance regularization | Employee, Sales Employee | Reporting Manager, HR Admin | HR Admin, Tenant Admin | For missing/incorrect punch. |
| GPS exception | Employee, Sales Employee | Reporting Manager, HR Admin | HR Admin | Required for mobile/sales location mismatch. |
| Face verification exception | Employee, Sales Employee, Kiosk User | HR Admin, Reporting Manager | Tenant Admin | Includes mobile, sales, kiosk failures. |
| Device reset | Employee, Sales Employee | HR Admin, Tenant Admin | Tenant Admin | Required before new device activation. |
| Shift change | Employee, HR Admin | Reporting Manager, HR Admin | HR Admin | Based on workflow matrix. |
| Overtime | System, Employee, Manager | Reporting Manager, HR Admin, Payroll Admin | HR Admin, Management | Payroll posting after approval. |
| Weekly off / comp-off | Employee, System | Reporting Manager, HR Admin | HR Admin | Policy-based. |
| Leave | Employee | Reporting Manager, HR Admin | HR Admin | Balance validation required. |
| Loan | Employee | Reporting Manager, HR Admin, Finance Admin | Management | Approval chain client-defined. |
| Salary advance | Employee | Reporting Manager, HR Admin, Finance Admin | Management | Payroll recovery required. |
| Salary revision | HR Admin | Management, Payroll Admin | Tenant Admin | Maker-checker recommended. |
| Payroll approval | Payroll Admin | Finance Admin, Management | Tenant Admin / Management | Payslip release only after approval. |
| Employee document verification | Employee/Candidate | HR Admin | HR Manager/Tenant Admin | Rejection reason required. |
| Probation confirmation | HR Admin | Reporting Manager, HR Admin, Management | HR Admin | Confirmation/extension/rejection. |
| Exit clearance | Employee, HR Admin | Reporting Manager, HR, Finance, Asset Admin, Payroll Admin | HR Admin, Management | F&F depends on clearances. |
| Asset return | Employee, HR Admin | Asset Admin, HR Admin | HR Admin | Required for exit if asset assigned. |
| Helpdesk escalation | System | Helpdesk Agent, HR Admin | Escalation Manager | SLA-based. |

## 14. Report Access Rules

| Report | Allowed Roles | Data Scope | Export Allowed? |
| ------ | ------------- | ---------- | --------------- |
| Employee report | HR Admin, Tenant Admin, Management, Auditor | Tenant/company/branch assigned | Yes for authorized roles |
| Attendance report | HR Admin, Payroll Admin, Manager, Management, Auditor | HR all assigned, Manager team, Payroll all assigned | Yes for HR/Payroll/Management/Auditor |
| Sales attendance report | HR Admin, Manager, Management, Auditor | Sales employees within scope | Yes for authorized roles |
| Leave report | HR Admin, Manager, Payroll Admin, Management, Auditor | Assigned scope/team | Yes |
| Shift/roster report | HR Admin, Manager, Payroll Admin, Auditor | Assigned scope/team | Yes |
| Payroll report | Payroll Admin, Finance Admin, Management, Auditor | Company/payroll scope | Yes, sensitive export logged |
| Payslip report | Payroll Admin, Employee, Auditor | Payroll admin all assigned, Employee own | Payroll/Admin yes; Employee own only |
| Loan/advance report | Payroll Admin, Finance Admin, HR Admin, Auditor | Assigned company scope | Yes |
| Statutory report | Payroll Admin, Finance Admin, Management, Auditor | Company/payroll scope | Yes |
| Asset report | Asset Admin, HR Admin, Management, Auditor | Assigned company/branch scope | Yes |
| Helpdesk report | Helpdesk Agent, HR Admin, Management, Auditor | Assigned scope | Yes |
| Performance report | HR Admin, Manager, Management, Auditor | Team/company scope | Yes for HR/Management/Auditor |
| Audit report | Auditor, Tenant Admin, Super Admin | Tenant/platform scope | Yes, export audited |
| Data migration report | Tenant Admin, HR Admin, Payroll Admin, Implementation Partner, Auditor | Migration batch scope | Yes |

## 15. Data Visibility Rules

| Role | Data Visibility |
| ---- | --------------- |
| Super Admin | Tenant metadata, platform settings, subscription data; employee/payroll data only with explicit support permission. |
| Tenant Admin | All data within own tenant, subject to configured restrictions. |
| HR Admin | HR, attendance, leave, employee, onboarding, exit, documents, assets within assigned tenant/company/branch. |
| Payroll Admin | Payroll-related employee data, attendance inputs, leave inputs, salary, statutory, loans, advances, payslips within assigned company/payroll scope. |
| Finance Admin | Payroll summaries, statutory summaries, loans, advances, recoveries, F&F finance clearance. |
| Reporting Manager | Own data plus direct/indirect reporting team data based on hierarchy. |
| Employee | Own profile, attendance, leave, payslip, documents, tickets, requests, notifications. |
| Sales Employee | Own employee data plus own sales attendance, GPS records, visit tags, and exceptions. |
| Kiosk Admin | Kiosk device data, kiosk attendance status, kiosk sync status for assigned branch/location. |
| Asset Admin | Asset inventory and employee asset records within assigned scope. |
| Helpdesk Agent | Assigned tickets and employee context required for ticket resolution. |
| Management / Executive | Dashboards and reports within assigned tenant/company/branch; usually no edit access. |
| Candidate | Own offer/pre-onboarding/document submission only. |
| Auditor | Read-only audit logs, reports, and compliance evidence within assigned scope. |
| Implementation Partner / Support User | Time-bound assigned tenant/module data only; all actions audited. |

## 16. API Authorization Rules

| API Area | Required Auth | Allowed Roles | Permission Check |
| -------- | ------------- | ------------- | ---------------- |
| Login API | Public credentials/OTP | All active users | Account status, tenant status, login policy. |
| Employee API | Session token | HR Admin, Tenant Admin, Manager, Employee, Auditor | Tenant, company, branch, role, record ownership/team scope. |
| Attendance API | Session/device token | Employee, Sales Employee, HR Admin, Manager, Payroll Admin | Tenant, device binding, ownership/team, approval rights. |
| Kiosk API | Kiosk device token/admin token | Kiosk Device, Kiosk Admin, HR Admin | Kiosk active status, tenant, branch/location binding. |
| Device Binding API | Session token | Employee, Sales Employee, HR Admin, Tenant Admin | Employee ownership, approval permission, device status. |
| Leave API | Session token | Employee, Manager, HR Admin, Payroll Admin | Ownership/team, leave policy, approver role. |
| Payroll API | Session token | Payroll Admin, Finance Admin, Management, Auditor | Company/payroll scope, sensitive permission, maker-checker. |
| Report API | Session token | Authorized report roles | Tenant, role, report permission, export permission. |
| Audit API | Session token | Auditor, Tenant Admin, Super Admin, authorized admins | Read-only scope and tenant filtering. |
| Admin Settings API | Session token | Super Admin, Tenant Admin, authorized admins | Tenant/company permission and configuration rights. |

Every API must validate tenant ID.  
Every API must validate user role.  
Every API must validate record ownership or assigned scope.  
Every sensitive API must create audit log.  
Frontend access checks are required but must not replace server-side authorization.

## 17. Session and Token Rules

| Rule ID | Session Rule | Applies To |
| ------- | ------------ | ---------- |
| SES-001 | Web session expires after configured inactivity. | Web users |
| SES-002 | Mobile session expires based on token expiry and refresh policy. | Mobile users |
| SES-003 | Refresh token must be revocable. | Mobile users |
| SES-004 | Logout invalidates active session token. | All users |
| SES-005 | Password change forces logout from all active sessions. | All users |
| SES-006 | Role change forces session refresh or logout. | All users |
| SES-007 | Device reset forces logout from old mobile device. | Mobile users |
| SES-008 | Kiosk session persists only while kiosk is active and bound. | Kiosk device |
| SES-009 | Kiosk admin PIN session times out after short inactivity. | Kiosk Admin |
| SES-010 | Tenant suspension invalidates tenant user sessions. | Tenant users |

## 18. Password and OTP Policy

| Policy Area | Rule |
| ----------- | ---- |
| Password minimum length | Recommended 8-12 characters minimum. Client Approval Required. |
| Password complexity | Recommended uppercase, lowercase, number, and special character. Client Approval Required. |
| Password reset process | User requests reset, receives OTP/link, sets new password, all sessions invalidated. |
| OTP expiry | Recommended 5 minutes. Client Approval Required. |
| OTP retry limit | Recommended 3 failed attempts per OTP. Client Approval Required. |
| OTP resend limit | Recommended 3 resend attempts within 15 minutes. Client Approval Required. |
| Account lock after failed attempts | Recommended lock after 5 failed login attempts. Client Approval Required. |
| Admin unlock process | Tenant Admin/authorized HR Admin unlocks tenant users; Super Admin unlocks tenant admins. |
| Password history | Recommended prevent reuse of last 3 passwords. Client Approval Required. |
| MFA for admins | Recommended OTP/MFA for Super Admin, Tenant Admin, Payroll Admin, Finance Admin. Client Approval Required. |

## 19. Audit Log Requirements

| Audit Event | Data Captured | Trigger |
| ----------- | ------------- | ------- |
| Login success/failure | User, tenant, IP/device, timestamp, status, reason | Login attempt |
| Password reset | User, requested time, reset status, IP/device | Password reset request/completion |
| OTP request | User/mobile/email, purpose, timestamp, status | OTP generated |
| Device registration | Employee, device fingerprint, tenant, timestamp, status | Device registration |
| Device reset | Employee, old/new device, approver, reason, timestamp | Device reset approval |
| Kiosk activation/deactivation | Kiosk ID, branch/location, admin, timestamp, status | Kiosk status change |
| Attendance punch | Employee, source, device/kiosk, GPS, verification status, timestamp | Mobile/web/kiosk punch |
| Attendance correction | Employee, old/new values, requester, approver, reason | Regularization approval/edit |
| Leave approval | Employee, leave type, dates, approver, status | Leave approval/rejection |
| Payroll processing | Payroll period, payroll admin, employee count, totals, timestamp | Payroll run |
| Payslip release | Payroll period, releaser, release timestamp | Payslip publication |
| Role/permission changes | User/role, old/new permissions, actor, timestamp | Role update |
| Report export | Report name, filters, actor, timestamp, export format | Report download/export |
| Data migration import | Batch ID, file, importer, counts, errors, timestamp | Data import |
| Tenant setting change | Tenant, setting changed, old/new values, actor | Admin setting update |

## 20. Exception and Security Handling

| Exception | Trigger | System Action | Recovery |
| --------- | ------- | ------------- | -------- |
| Invalid login | Wrong credentials | Reject login and log attempt | Retry or reset password |
| Account locked | Failed login threshold exceeded | Block login and notify/admin log | Admin unlock or timed unlock |
| Invalid OTP | OTP mismatch | Reject verification and increment retry count | Retry until limit |
| Expired OTP | OTP used after expiry | Reject OTP | Request new OTP |
| Unauthorized device | Device not approved/bound | Block mobile attendance/login per policy | Request device approval |
| Device already bound | New device tries to register when active device exists | Block or create reset request | HR/Tenant Admin approval |
| Kiosk inactive | Kiosk device inactive/deactivated | Block kiosk attendance | Admin activation |
| Kiosk branch mismatch | Kiosk used outside assigned branch/location | Block or create exception | Admin review/rebinding |
| User role removed | User session has stale permission | Force logout/session refresh | Login again with updated role |
| Session expired | Token/session timeout | Block request | Re-authenticate |
| Tenant suspended | Tenant status inactive/suspended | Block tenant user access | Renew/reactivate tenant |
| Permission denied | User lacks role/action permission | Reject action and log denial | Request role/access change |
| Suspicious repeated login attempt | Multiple failed attempts/IP/device pattern | Lock or throttle account/IP | Admin review |

## 21. Frappe / ERPNext Implementation Notes

Frappe implementation should use standard Role-Based Access Control with additional tenant/company filtering.

Recommended approach:

* Use Frappe `User` for login identities.
* Use `Role` for Super Admin, Tenant Admin, HR Admin, Payroll Admin, Finance Admin, Manager, Employee, Sales Employee, Kiosk Admin, Auditor, and support roles.
* Use DocType permissions for create/read/write/delete/submit/cancel/export access.
* Use `User Permission` records to restrict company, branch, location, department, and employee scope.
* Use permission query conditions for tenant/company/branch filtering on list views, reports, and APIs.
* Use server-side permission validation in all whitelisted methods and custom APIs.
* Use Workflow states and Workflow actions for leave, regularization, overtime, payroll approval, device reset, salary revision, exit clearance, and document verification.
* Create custom DocTypes for `Employee Device`, `Device Reset Request`, `Kiosk Device`, `Kiosk Device Binding`, `Kiosk Policy`, `OTP Log`, and enhanced `Audit Log`.
* Use Frappe `Version`, `Activity Log`, and custom audit DocTypes for sensitive actions.
* Use mobile API token/session handling with refresh token support where required.
* Ensure every business DocType includes tenant/company context.
* For reports, implement server-side filters by tenant, company, branch, user role, and employee ownership.
* For kiosk APIs, validate kiosk device token, activation status, branch/location binding, and tenant before accepting punches.
* Do not rely only on frontend hiding of menus/buttons.

## 22. Auth-related Screens Required

| Screen | User Role | Purpose |
| ------ | --------- | ------- |
| Login screen | All users | Standard login. |
| OTP screen | Mobile/admin users | OTP verification. |
| Forgot password | All users | Password reset. |
| Change password | All users | Password update. |
| Role management | Super Admin, Tenant Admin | Create/assign roles. |
| Permission management | Super Admin, Tenant Admin | Configure permissions. |
| User management | Super Admin, Tenant Admin, HR Admin | Create and manage users. |
| Device registration | Employee, Sales Employee | Register mobile device. |
| Device approval | HR Admin, Tenant Admin | Approve/reject device. |
| Device reset request | Employee, Sales Employee | Request device change. |
| Kiosk device master | Kiosk Admin, Tenant Admin, HR Admin | Register kiosk devices. |
| Kiosk binding screen | Kiosk Admin, Tenant Admin, HR Admin | Bind kiosk to branch/location. |
| Kiosk admin PIN setup | Tenant Admin, Kiosk Admin | Configure kiosk control PIN. |
| Session/device activity | User, HR Admin, Tenant Admin | View active sessions/devices. |
| Audit log viewer | Auditor, Tenant Admin, Super Admin | View security and business audit logs. |

## 23. Auth-related Backend Entities / DocTypes

| DocType / Entity | Purpose |
| ---------------- | ------- |
| User | Login identity. |
| Role | Role definition. |
| Permission Rule | DocType/action permission control. |
| User Permission | Restrict user to company, branch, location, employee, or department. |
| Employee Device | Registered employee/sales mobile device. |
| Device Reset Request | Workflow for device replacement/reset. |
| Kiosk Device | Registered kiosk hardware/device record. |
| Kiosk Device Binding | Tenant/company/branch/location mapping. |
| Kiosk Policy | Kiosk mode, admin PIN, offline, verification, duplicate rules. |
| OTP Log | OTP generation and verification audit. |
| User Session | Web/mobile/kiosk session tracking. |
| Login Attempt Log | Success/failure login tracking. |
| Audit Log | Sensitive action audit. |
| Role Change Log | Role/permission assignment history. |
| API Access Log | Sensitive API request logging. |
| Export Log | Report/data export audit. |

## 24. Auth-related APIs Required

| API | Method | Purpose | Allowed Roles |
| --- | ------ | ------- | ------------- |
| Login | POST | Authenticate user | All active users |
| Logout | POST | End active session | All logged-in users |
| Refresh session | POST | Refresh mobile/web token | Logged-in users |
| Request OTP | POST | Generate OTP | All eligible users |
| Verify OTP | POST | Verify OTP | All eligible users |
| Register device | POST | Register employee device | Employee, Sales Employee |
| Approve device | POST | Approve registered device | HR Admin, Tenant Admin |
| Reject device | POST | Reject registered device | HR Admin, Tenant Admin |
| Request device reset | POST | Request device change | Employee, Sales Employee |
| Approve device reset | POST | Approve device reset | HR Admin, Tenant Admin |
| Register kiosk | POST | Create kiosk device | Kiosk Admin, Tenant Admin, HR Admin |
| Bind kiosk location | POST/PUT | Bind kiosk to branch/location | Kiosk Admin, Tenant Admin, HR Admin |
| Activate/deactivate kiosk | POST | Change kiosk active status | Kiosk Admin, Tenant Admin |
| Update role | POST/PUT | Assign/update user role | Super Admin, Tenant Admin |
| Get permissions | GET | Fetch current user permissions | Logged-in users |
| View audit logs | GET | View audit logs | Auditor, Tenant Admin, Super Admin, authorized admins |

## 25. Test Case Suggestions

| Test Case ID | Scenario | Expected Result |
| ------------ | -------- | --------------- |
| AUTH-TC-001 | Valid web login | User logs in and lands on allowed dashboard. |
| AUTH-TC-002 | Invalid password | Login rejected and attempt logged. |
| AUTH-TC-003 | OTP valid within expiry | OTP verified successfully. |
| AUTH-TC-004 | Expired OTP | OTP rejected. |
| AUTH-TC-005 | Password reset | Password reset succeeds and old sessions are invalidated. |
| AUTH-TC-006 | Employee opens another employee profile | Access denied. |
| AUTH-TC-007 | Manager views reporting team | Team data visible. |
| AUTH-TC-008 | Manager views non-team employee | Access denied. |
| AUTH-TC-009 | HR Admin views assigned company employees | Access allowed. |
| AUTH-TC-010 | Payroll Admin edits HR-only fields | Access denied. |
| AUTH-TC-011 | Tenant user accesses another tenant record by URL/API | Access denied. |
| AUTH-TC-012 | Employee registers first device | Device registration created. |
| AUTH-TC-013 | Employee marks attendance from unapproved device | Attendance blocked. |
| AUTH-TC-014 | Device reset approved | Old device blocked and new device allowed. |
| AUTH-TC-015 | Kiosk device registered | Kiosk record created and pending/active per workflow. |
| AUTH-TC-016 | Kiosk mapped to branch/location | Binding saved and used for attendance. |
| AUTH-TC-017 | Inactive kiosk attempts attendance | Attendance blocked. |
| AUTH-TC-018 | Kiosk branch mismatch | Attendance blocked or exception logged. |
| AUTH-TC-019 | Session expired | API request rejected and user asked to login. |
| AUTH-TC-020 | Role changed during active session | User forced to refresh session or logout. |
| AUTH-TC-021 | Payroll report export | Export allowed only for permitted role and audit log created. |
| AUTH-TC-022 | Audit log generated for role change | Role change log visible to authorized auditor/admin. |
| AUTH-TC-023 | Tenant suspended | Tenant users cannot login. |
| AUTH-TC-024 | Kiosk offline sync with valid device | Records sync and audit log created. |
| AUTH-TC-025 | Permission denied action | System blocks action and logs denial. |

## 26. UAT Acceptance Criteria

* Roles are correctly defined and assigned.
* Permissions match business expectations.
* Employee cannot access another employee’s data.
* Manager can access only assigned reporting team data.
* HR can access approved HR data within assigned scope.
* Payroll access is restricted to payroll-related records and reports.
* Finance access is restricted to approval, summary, statutory, loan, advance, and finance-related areas.
* Mobile device binding works for employees and sales employees.
* Device reset request and approval works.
* Kiosk device registration works.
* Kiosk branch/location binding works.
* Kiosk attendance works only from active registered kiosk.
* Unauthorized mobile device access is blocked.
* Unauthorized kiosk access is blocked.
* Reports show only permitted data.
* Payroll exports are restricted and audited.
* Audit logs are generated for sensitive actions.
* Tenant isolation is validated from UI and API.
* Session expiry and force logout rules work as expected.
* Security exceptions show proper user-facing messages and admin/audit records.

## 27. Open Clarifications Required

| Area | Clarification Needed | Suggested Default | Impact |
| ---- | -------------------- | ----------------- | ------ |
| OTP expiry duration | Exact expiry time | 5 minutes, Client Approval Required | Affects login/device security. |
| Password policy | Length and complexity | 8-12 chars, uppercase/lowercase/number/special, Client Approval Required | Affects account security. |
| Failed login lock count | Number of failed attempts | 5 attempts, Client Approval Required | Affects brute-force prevention and support load. |
| Device replacement approval | Who approves replacement | HR Admin approval, Tenant Admin escalation | Affects attendance security. |
| Number of allowed devices | One or multiple active devices | One primary active device, Client Approval Required | Affects mobile attendance control. |
| Kiosk admin PIN policy | PIN length, expiry, reset owner | 6-digit PIN, reset by Kiosk Admin/Tenant Admin, Client Approval Required | Affects kiosk security. |
| Kiosk hardware ownership | Client-owned or company-owned devices | Client/company-owned registered devices only | Affects device management. |
| Kiosk offline limit | How long kiosk can store offline punches | 24 hours recommended, Client Approval Required | Affects sync risk and attendance disputes. |
| Face/selfie fallback | What happens when verification fails | Retry, then regularization/HR approval | Affects attendance exceptions. |
| Sales tracking access | Who can view location history | Sales employee own, manager team, HR assigned, Client Approval Required | Affects privacy and compliance. |
| Payroll report export access | Which roles can export payroll reports | Payroll Admin, Finance, Management, Auditor | Affects payroll confidentiality. |
| Auditor access level | Full audit or selected audit only | Read-only tenant/company audit scope | Affects compliance and privacy. |
| Super Admin payroll access | Whether platform admin can view payroll | No by default; break-glass only | Affects tenant data trust. |

## 28. Final Recommendation

The following auth rules must be finalized before development starts:

* Tenant isolation rules.
* Role hierarchy and module access matrix.
* Employee, manager, HR, payroll, finance, and auditor data visibility.
* Mobile device binding and reset approval rules.
* Kiosk registration, kiosk binding, kiosk admin PIN, kiosk offline, and kiosk deactivation rules.
* Payroll, report export, and audit log access rules.

Critical permissions for Phase 1:

* Super Admin tenant controls.
* Tenant Admin company, role, and permission setup.
* HR Admin employee master access.
* Employee self-profile visibility.
* Manager team visibility.
* Tenant/company/branch/location filtering.

Critical auth flows for Phase 2:

* Mobile login and OTP.
* Device registration and approval.
* Device reset and unbinding.
* Kiosk registration.
* Kiosk branch/location binding.
* Kiosk activation/deactivation.
* Kiosk admin PIN.

Client sign-off is required for password policy, OTP expiry, allowed devices, device replacement approval, kiosk PIN policy, kiosk offline duration, face/selfie fallback, sales tracking visibility, payroll export access, and auditor access level.

Mandatory UAT auth test cases should include tenant isolation, role access, permission denied, employee self-access, manager team access, HR full assigned access, payroll restricted access, mobile device binding, device reset approval, kiosk registration, kiosk branch/location binding, unauthorized kiosk/device blocking, session expiry, report export audit, and audit log generation for sensitive actions.