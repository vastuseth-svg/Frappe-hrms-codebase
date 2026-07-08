# Phase 1 Detailed BPMN Flow Document

## Document Context

This document defines detailed BPMN-style process flows for Phase 1 of the Modern SaaS HRMS project using a Vue + Tailwind frontend and Frappe/ERPNext HRMS backend.

Phase 1 focuses on the foundation workflows required before advanced shift, leave, payroll, reporting, and lifecycle modules can be developed. The flows below are written as detailed process descriptions only. No BPMN diagrams, BPMN XML, or visual drawings are included.

## Phase 1 Scope

| Area | Included in Phase 1 |
| --- | --- |
| Authentication/Login | Yes |
| Role-based access | Yes |
| Company/Tenant setup | Yes |
| Employee setup | Yes |
| Basic attendance setup | Yes |
| Employee punch in/out | Yes |
| Kiosk attendance flow | Yes |
| GPS/selfie attendance basics | Yes |
| Admin/HR dashboard basics | Yes |

## Process 1: User Authentication and Login Flow

### 1. Process Name

User Authentication and Login Flow

### 2. Goal

Allow authorized users to securely access the HRMS web portal or mobile app based on their role, tenant, company, and account status.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Super Admin | Logs into platform admin portal. |
| Tenant Admin | Logs into tenant/company admin portal. |
| HR Admin | Logs into HRMS portal. |
| Payroll Admin | Logs into restricted payroll area if enabled in Phase 1 foundation. |
| Reporting Manager | Logs into web/mobile access. |
| Employee | Logs into employee self-service web/mobile. |
| Sales Employee | Logs into mobile app for attendance and later sales tracking. |
| System | Validates credentials, role, tenant, session, and access status. |

### 4. Trigger

User opens the HRMS login page or mobile app login screen and submits login credentials.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| User account exists | User must exist in Frappe `User`. |
| User is active | Disabled or suspended users cannot login. |
| Tenant is active | Tenant/company must not be suspended. |
| Role is assigned | User must have at least one valid role. |
| Login method configured | Username/password, mobile/email OTP, or configured method must be enabled. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | User | User opens login screen. |
| 2 | User Task | User | User enters username/email/mobile and password or requests OTP. |
| 3 | Service Task | System | System validates user identifier. |
| 4 | Gateway | System | Check whether user account exists. |
| 5 | Service Task | System | Validate password or OTP. |
| 6 | Gateway | System | Check whether credentials are valid. |
| 7 | Service Task | System | Check account status, tenant status, and role assignment. |
| 8 | Gateway | System | Check whether user is allowed to login. |
| 9 | Service Task | System | Create session token and record login audit. |
| 10 | Service Task | System | Fetch user roles and permissions. |
| 11 | User Task | User | User lands on role-based dashboard. |
| 12 | End Event | System | Login process completed. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Does user account exist? | Continue credential validation. | Show invalid login message. |
| G2 | Are credentials valid? | Continue account checks. | Log failed attempt and reject login. |
| G3 | Is account active? | Continue. | Block login. |
| G4 | Is tenant/company active? | Continue. | Block login with tenant suspended message. |
| G5 | Does user have valid role? | Create session. | Block login and notify admin. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| OTP login | User requests OTP, enters OTP, and logs in after OTP verification. |
| Password reset | User selects forgot password and completes reset flow. |
| Mobile biometric unlock | After first successful login, mobile user may unlock app using device biometric if enabled. |
| First login password change | System may force password change on first login if policy requires. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Invalid username/password | Reject login and log failed attempt. |
| Expired OTP | Reject OTP and allow resend within limit. |
| Account locked | Block login and show support/admin message. |
| Tenant suspended | Block login for tenant users. |
| Missing role | Block access and notify Tenant Admin/Super Admin. |
| Session creation failure | Show technical error and log exception. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| AUTH-BR-001 | Only active users can login. |
| AUTH-BR-002 | Tenant users can login only if tenant/company is active. |
| AUTH-BR-003 | User dashboard must be based on assigned role. |
| AUTH-BR-004 | Failed login attempts must be logged. |
| AUTH-BR-005 | Sensitive admin roles should use OTP/MFA if enabled. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| User ID | Identify login user. |
| Tenant/Company | Enforce tenant context. |
| Login timestamp | Audit trail. |
| IP address/device info | Security audit. |
| Login status | Success/failure tracking. |
| Failure reason | Security investigation. |

### 12. Output/Result

User is authenticated and redirected to an authorized dashboard, or login is rejected with an appropriate error and audit log.

### 13. Related Screens

| Screen | Frontend |
| --- | --- |
| Login Screen | Vue + Tailwind web/mobile login UI |
| OTP Verification Screen | Vue + Tailwind OTP input |
| Forgot Password Screen | Vue + Tailwind password recovery |
| Role-based Dashboard | Vue + Tailwind dashboard shell |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `User` | Frappe user account. |
| `Role` | Assigned role list. |
| `User Permission` | Company/branch restrictions. |
| `Login Attempt Log` | Login success/failure audit. |
| `User Session` | Session/token tracking. |
| `POST /api/method/login` | Login endpoint. |
| `POST /api/method/logout` | Logout endpoint. |
| `POST /api/method/hrms_auth.request_otp` | OTP request. |
| `POST /api/method/hrms_auth.verify_otp` | OTP verification. |

### 15. Acceptance Criteria

* Valid users can login successfully.
* Invalid login attempts are rejected and logged.
* Suspended tenant users cannot login.
* Disabled users cannot login.
* User lands on role-based dashboard after login.
* Session token is generated securely.
* Login audit record is created for success and failure.

## Process 2: Role-Based Access and Permission Resolution Flow

### 1. Process Name

Role-Based Access and Permission Resolution Flow

### 2. Goal

Ensure every user sees only the screens, data, actions, and reports allowed by their role, tenant, company, branch, location, and employee ownership.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Tenant Admin | Assigns roles and permissions. |
| Super Admin | Manages platform-level roles. |
| HR Admin | Uses HR module permissions. |
| Manager | Accesses team data. |
| Employee | Accesses own data. |
| System | Resolves role, permission, and data scope. |

### 4. Trigger

User logs in or opens a protected screen/API.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| User is authenticated | Valid active session exists. |
| Role exists | User has one or more assigned roles. |
| Permission rules exist | Frappe DocType permissions and custom permission rules are configured. |
| Tenant/company context exists | User is linked to allowed tenant/company. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | User | User requests screen, report, action, or API. |
| 2 | Service Task | System | Validate active session token. |
| 3 | Service Task | System | Load user roles. |
| 4 | Service Task | System | Load user permissions and data scope. |
| 5 | Gateway | System | Check module access permission. |
| 6 | Gateway | System | Check action permission: view/create/edit/delete/approve/export/configure. |
| 7 | Gateway | System | Check record-level access: own/team/branch/company/tenant. |
| 8 | Service Task | System | Apply permission filters to data query. |
| 9 | User Task | User | User views allowed screen/action. |
| 10 | Service Task | System | Log denied sensitive access if blocked. |
| 11 | End Event | System | Permission check completed. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is session valid? | Continue. | Redirect to login. |
| G2 | Is module allowed? | Continue action check. | Show access denied. |
| G3 | Is action allowed? | Continue record scope check. | Show action not permitted. |
| G4 | Is record within scope? | Return data/action. | Block and audit if sensitive. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Multiple roles | System applies highest allowed permission within tenant/company scope. |
| Temporary support access | Support user receives time-bound access and all actions are audited. |
| Manager delegated access | Manager may access delegated team if workflow allows. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| No role assigned | Block access and show configuration error. |
| Role removed during session | Force session refresh or logout. |
| User tries direct API access | Server-side permission rejects request. |
| Cross-tenant record request | Block and log security event. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| RBAC-BR-001 | Frontend route guards must not replace backend permission checks. |
| RBAC-BR-002 | Every API must enforce tenant/company filtering. |
| RBAC-BR-003 | Employee can view only own self-service data. |
| RBAC-BR-004 | Manager can view only reporting team data. |
| RBAC-BR-005 | Sensitive denied access attempts must be audited. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| User role | Permission resolution. |
| Requested module/action | Access decision. |
| Tenant/company/branch | Scope filtering. |
| Access result | Audit and troubleshooting. |
| Denial reason | Security review. |

### 12. Output/Result

User receives only allowed screen/data/action. Unauthorized access is blocked and logged where required.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Role Management | Assign roles. |
| Permission Management | Configure action-level access. |
| User Management | Assign user roles and scope. |
| Access Denied Page | Inform unauthorized user. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `User` | User identity. |
| `Role` | Role assignment. |
| `DocPerm` | Frappe DocType permissions. |
| `User Permission` | Record-level scope. |
| `Role Permission Manager` | Frappe permission configuration. |
| `GET /api/method/hrms_auth.get_permissions` | Return user permissions to frontend. |

### 15. Acceptance Criteria

* User sees only allowed navigation items.
* Unauthorized routes are blocked.
* Direct API calls are permission checked.
* Employee cannot access another employee profile.
* Manager can access team data only.
* Tenant data isolation is enforced.

## Process 3: Tenant and Company Setup Flow

### 1. Process Name

Tenant and Company Setup Flow

### 2. Goal

Create a new tenant/company environment with isolated data, core company information, default roles, branch/location structure, and initial admin user.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Super Admin | Creates tenant and activates account. |
| Tenant Admin | Completes company setup. |
| HR Admin | Adds branch/location and HR masters if assigned. |
| System | Creates tenant context and default setup. |

### 4. Trigger

Super Admin receives onboarding request for a new client company.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| SaaS subscription/order exists | Tenant creation is authorized. |
| Company details available | Legal/company name and contact details are provided. |
| Tenant admin details available | First admin user details are available. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | Super Admin | Initiates new tenant setup. |
| 2 | User Task | Super Admin | Enters tenant name, company name, subscription plan, and admin details. |
| 3 | Service Task | System | Validate tenant uniqueness. |
| 4 | Gateway | System | Check if tenant/company already exists. |
| 5 | Service Task | System | Create tenant record. |
| 6 | Service Task | System | Create company record. |
| 7 | Service Task | System | Create default roles, permissions, and tenant admin user. |
| 8 | User Task | Tenant Admin | Completes company profile, branch, and location setup. |
| 9 | Service Task | System | Apply tenant/company defaults. |
| 10 | Gateway | Tenant Admin/System | Check whether required company setup is complete. |
| 11 | Service Task | System | Activate tenant/company. |
| 12 | End Event | System | Tenant/company ready for HR setup. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is tenant unique? | Create tenant. | Show duplicate tenant error. |
| G2 | Is subscription/plan valid? | Continue setup. | Keep tenant in draft/pending state. |
| G3 | Is mandatory company setup complete? | Activate tenant. | Show pending setup checklist. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Tenant created in draft | Tenant remains inactive until missing data is completed. |
| Multiple companies under tenant | Tenant Admin adds more companies if plan allows. |
| Branch setup skipped | System allows draft setup but blocks attendance/kiosk until branch/location exists. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Duplicate tenant name | Reject and request unique tenant identifier. |
| Invalid admin email/mobile | Block user creation. |
| Plan limit missing | Keep subscription in pending setup. |
| Company setup incomplete | Prevent activation or show warning based on policy. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| TEN-BR-001 | Each tenant must have isolated data. |
| TEN-BR-002 | Tenant must have at least one Tenant Admin. |
| TEN-BR-003 | Company must exist before employee creation. |
| TEN-BR-004 | Branch/location must exist before kiosk binding. |
| TEN-BR-005 | Tenant status controls user login access. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Tenant ID/name | Tenant isolation. |
| Company details | HRMS setup. |
| Subscription plan | Feature and limit control. |
| Tenant admin user | First admin login. |
| Branch/location data | Attendance and kiosk mapping. |

### 12. Output/Result

Tenant and company are created, initial admin user is active, and company setup is ready for employee and attendance configuration.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Tenant Setup | Super Admin creates tenant. |
| Company Profile | Tenant Admin configures company. |
| Branch/Location Master | Configure work locations. |
| Setup Checklist | Track pending foundation setup. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `Tenant` | SaaS tenant record. |
| `Company` | ERPNext company. |
| `Branch` | Branch master. |
| `Location` | Location/site master. |
| `User` | Tenant Admin user. |
| `Subscription Plan` | Plan and limits. |
| `POST /api/method/hrms_saas.create_tenant` | Create tenant. |
| `POST /api/resource/Company` | Create company. |

### 15. Acceptance Criteria

* Super Admin can create tenant.
* Tenant Admin user is created.
* Company can be configured.
* Branch/location can be added.
* Tenant data is isolated.
* Inactive tenant users cannot login.
* Company setup status is visible.

## Process 4: Employee Setup Flow

### 1. Process Name

Employee Setup Flow

### 2. Goal

Create employee master records with employment details, department, designation, branch/location, reporting manager, user account, and role mapping.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| HR Admin | Creates and manages employee record. |
| Tenant Admin | May approve or configure employee setup. |
| Reporting Manager | Assigned as manager. |
| Employee | Receives account/self-service access. |
| System | Validates employee data and creates linked user if required. |

### 4. Trigger

HR Admin starts employee creation from Employee Master screen.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| Tenant/company exists | Employee must belong to company. |
| Branch/location exists | Required for attendance and reports. |
| Department/designation exists | Required for organization structure. |
| Role setup exists | Employee role can be assigned. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | HR Admin | Opens Employee Master screen. |
| 2 | User Task | HR Admin | Enters personal, contact, employment, branch, department, designation details. |
| 3 | User Task | HR Admin | Assigns reporting manager and attendance policy group if available. |
| 4 | Service Task | System | Validate mandatory fields and unique employee code. |
| 5 | Gateway | System | Check if employee data is valid. |
| 6 | Service Task | System | Create employee record. |
| 7 | Gateway | HR Admin/System | Check whether login/user account is required. |
| 8 | Service Task | System | Create linked user and assign Employee/Sales Employee role. |
| 9 | Service Task | System | Link employee to tenant/company/branch/location. |
| 10 | Service Task | System | Create audit log. |
| 11 | User Task | HR Admin | Reviews created employee profile. |
| 12 | End Event | System | Employee setup completed. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is employee data valid? | Create employee. | Return validation errors. |
| G2 | Is employee code unique? | Continue. | Ask HR to change code. |
| G3 | Should user login be created? | Create linked user. | Save employee without login. |
| G4 | Is employee sales category? | Assign Sales Employee role. | Assign Employee role. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Bulk employee upload | HR imports employee list using template. |
| Employee without login | Employee record exists but no ESS access until activated. |
| Sales employee setup | Employee is tagged as Sales and receives sales attendance eligibility. |
| Manager setup | Employee may also receive Reporting Manager role if assigned team. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Duplicate employee code | Reject save. |
| Missing branch/location | Show required field error. |
| Invalid reporting manager | Block or warn based on policy. |
| User email already exists | Link existing user or require correction. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| EMP-BR-001 | Employee must belong to one tenant/company. |
| EMP-BR-002 | Employee code must be unique within tenant/company. |
| EMP-BR-003 | Active employees may receive self-service login. |
| EMP-BR-004 | Sales Employee role requires sales designation/category. |
| EMP-BR-005 | Reporting manager drives approval routing. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Employee code/name | Employee identity. |
| Company/branch/location | Data scope and attendance mapping. |
| Department/designation | Organization hierarchy. |
| Reporting manager | Workflow routing. |
| Mobile/email | Login and notifications. |
| Employee status | Active/inactive control. |

### 12. Output/Result

Employee master is created with proper organization mapping and optional user login.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Employee List | View/search employees. |
| Employee Form | Create/edit employee. |
| Employee Profile | Review details. |
| User Account Mapping | Link employee to login user. |
| Bulk Import | Import employees. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `Employee` | Employee master. |
| `User` | Login user. |
| `Department` | Department master. |
| `Designation` | Designation master. |
| `Branch` | Branch master. |
| `Employee Group` | Employee category/policy grouping. |
| `POST /api/resource/Employee` | Create employee. |
| `PUT /api/resource/Employee/{name}` | Update employee. |

### 15. Acceptance Criteria

* HR Admin can create employee.
* Duplicate employee code is blocked.
* Employee is linked to company/branch/location.
* Employee can be assigned reporting manager.
* Employee user account can be created if required.
* Sales employee can be identified by role/category.
* Employee appears in employee list and dashboard count.

## Process 5: Basic Attendance Setup Flow

### 1. Process Name

Basic Attendance Setup Flow

### 2. Goal

Configure foundational attendance rules required for employee punch, mobile attendance, kiosk attendance, GPS/selfie validation, duplicate prevention, and regularization.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| HR Admin | Configures attendance policies. |
| Tenant Admin | Approves tenant-level attendance settings. |
| Kiosk Admin | Configures kiosk device-specific settings where allowed. |
| System | Applies rules during attendance capture. |

### 4. Trigger

HR Admin opens Attendance Settings before enabling attendance capture.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| Company exists | Attendance policy must belong to company. |
| Branch/location exists | Required for kiosk/GPS rules. |
| Employees exist | Policy can be assigned to employees/groups. |
| Roles exist | Only authorized users can configure rules. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | HR Admin | Opens Attendance Settings. |
| 2 | User Task | HR Admin | Configures allowed punch channels: web/mobile/kiosk. |
| 3 | User Task | HR Admin | Configures GPS, selfie/face, duplicate punch, and regularization rules. |
| 4 | User Task | HR Admin | Maps policy to company/branch/location/employee group. |
| 5 | Service Task | System | Validate rule completeness and conflicts. |
| 6 | Gateway | System | Check if required settings are complete. |
| 7 | Service Task | System | Save attendance policy. |
| 8 | Service Task | System | Activate policy for selected scope. |
| 9 | Service Task | System | Create audit log. |
| 10 | End Event | System | Attendance setup ready. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is at least one punch channel enabled? | Continue. | Block save. |
| G2 | If GPS enabled, is location/radius configured? | Continue. | Show GPS setup error. |
| G3 | If kiosk enabled, is kiosk policy configured? | Continue. | Show kiosk setup pending. |
| G4 | Are duplicate punch rules configured? | Activate policy. | Warn and apply default if approved. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Branch-specific policy | HR configures policy for specific branch/location. |
| Mobile-only policy | Only mobile attendance is enabled. |
| Kiosk-only policy | Kiosk attendance is enabled for branch gate/site. |
| GPS optional | Attendance can be captured without GPS if policy disables it. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Policy conflict | Prevent activation and show conflicting rule. |
| Missing location radius | Block GPS-based policy. |
| Kiosk not mapped | Block kiosk attendance activation. |
| Unauthorized configuration | Reject and log permission denial. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| ATTSET-BR-001 | Attendance channel must be enabled before punch is accepted. |
| ATTSET-BR-002 | GPS attendance requires location/radius or branch mapping. |
| ATTSET-BR-003 | Kiosk attendance requires registered active kiosk device. |
| ATTSET-BR-004 | Duplicate punch window must be configured or defaulted. |
| ATTSET-BR-005 | Attendance setup changes must be audited. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Allowed punch channels | Control mobile/web/kiosk availability. |
| GPS rule/radius | Location validation. |
| Selfie/face rule | Identity validation. |
| Duplicate punch window | Prevent repeated punches. |
| Policy scope | Company/branch/employee applicability. |

### 12. Output/Result

Attendance policy is active and ready for punch capture.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Attendance Settings | Configure rules. |
| Attendance Policy List | View policies. |
| Branch Location Mapping | Configure GPS/kiosk locations. |
| Kiosk Policy Settings | Configure kiosk-specific settings. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `Attendance Policy` | Custom policy master. |
| `Attendance Settings` | Global/company attendance settings. |
| `Location` | GPS/location master. |
| `Kiosk Policy` | Kiosk attendance policy. |
| `POST /api/method/hrms_attendance.save_policy` | Save policy. |
| `GET /api/method/hrms_attendance.get_active_policy` | Fetch policy for employee/device. |

### 15. Acceptance Criteria

* HR can configure attendance channels.
* GPS rule can be enabled/disabled.
* Selfie/face rule can be enabled/disabled.
* Duplicate punch rules can be configured.
* Policy can be scoped to company/branch/location.
* Attendance setup changes are audited.

## Process 6: Employee Mobile/Web Punch In and Punch Out Flow

### 1. Process Name

Employee Mobile/Web Punch In and Punch Out Flow

### 2. Goal

Allow employees to mark punch in/out from authorized web or mobile channels with basic validation, GPS/selfie capture where required, and attendance log creation.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Employee | Marks punch in/out. |
| Sales Employee | May use same base flow before sales-specific tracking. |
| System | Validates session, policy, duplicate rules, GPS/selfie, and creates log. |
| HR Admin | Reviews attendance exceptions. |

### 4. Trigger

Employee clicks Punch In or Punch Out from web/mobile.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| Employee is active | Attendance allowed only for active employees. |
| User is authenticated | Mobile/web session exists. |
| Attendance policy exists | Employee has active attendance policy. |
| Device binding valid | Required for mobile attendance if enabled. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | Employee | Opens attendance punch screen. |
| 2 | Service Task | System | Fetch employee active attendance policy. |
| 3 | Gateway | System | Check whether punch channel is allowed. |
| 4 | Service Task | System | Validate employee status and session. |
| 5 | Gateway | System | Check mobile device binding if mobile channel. |
| 6 | User Task | Employee | Clicks Punch In or Punch Out. |
| 7 | Service Task | System | Capture timestamp and device/source. |
| 8 | Gateway | System | Check if GPS is required. |
| 9 | Service Task | System | Capture and validate GPS if required. |
| 10 | Gateway | System | Check if selfie/face is required. |
| 11 | User Task | Employee | Captures selfie/face if required. |
| 12 | Service Task | System | Validate selfie/face status. |
| 13 | Gateway | System | Check duplicate punch window. |
| 14 | Service Task | System | Create attendance log. |
| 15 | Service Task | System | Update current attendance status. |
| 16 | User Task | Employee | Receives success confirmation. |
| 17 | End Event | System | Punch completed. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is channel allowed? | Continue. | Block punch. |
| G2 | Is device approved? | Continue. | Block mobile punch. |
| G3 | Is GPS required? | Capture GPS. | Skip GPS. |
| G4 | Is GPS valid? | Continue. | Create GPS exception or block. |
| G5 | Is selfie/face required? | Capture verification. | Skip verification. |
| G6 | Is verification successful? | Continue. | Create exception or retry. |
| G7 | Is duplicate punch detected? | Block/flag. | Save punch. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Web punch | Device binding is skipped unless policy requires browser device control. |
| Offline mobile punch | Record is queued locally and synced later if offline mode is enabled. |
| Manual regularization | Employee raises regularization if punch is blocked or missed. |
| GPS exception | Employee submits exception if location validation fails. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Unauthenticated user | Redirect to login. |
| Unauthorized device | Block punch and show device approval message. |
| GPS permission denied | Block or create exception based on policy. |
| Selfie capture failed | Allow retry or create exception. |
| Duplicate punch | Block or flag based on policy. |
| Server unavailable | Use offline queue if enabled; otherwise show failure. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| PUNCH-BR-001 | Punch must be linked to employee, tenant, company, and source. |
| PUNCH-BR-002 | Mobile punch requires approved device when binding is enabled. |
| PUNCH-BR-003 | GPS/selfie must be captured if policy requires. |
| PUNCH-BR-004 | Duplicate punch must be blocked or flagged. |
| PUNCH-BR-005 | Failed validation must not silently create approved attendance. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Employee ID | Link punch to employee. |
| Punch type | In/out action. |
| Timestamp | Attendance calculation. |
| Device/source | Audit and channel tracking. |
| GPS coordinates/accuracy | Location validation. |
| Selfie/face status | Identity verification. |
| Validation result | Approved/exception status. |

### 12. Output/Result

Attendance punch is recorded successfully, or an exception/blocked event is created.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Mobile Attendance Punch | Employee punch action. |
| Web Attendance Punch | Web punch action. |
| Attendance Status Card | Show current in/out status. |
| Attendance History | Employee view. |
| Attendance Exception List | HR review. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `Employee Checkin` | Frappe/ERPNext raw check-in log. |
| `Attendance` | Final attendance record. |
| `Attendance Log` | Custom detailed punch log if needed. |
| `Employee Device` | Device validation. |
| `GPS Validation Log` | GPS audit. |
| `Face Verification Log` | Selfie/face audit. |
| `POST /api/method/hrms_attendance.punch` | Punch API. |
| `GET /api/method/hrms_attendance.status` | Current punch status. |

### 15. Acceptance Criteria

* Employee can punch in/out from allowed channel.
* Unauthorized device punch is blocked.
* GPS is captured when required.
* Selfie/face is captured when required.
* Duplicate punch is blocked or flagged.
* Attendance log is created with source details.
* Employee sees current attendance status after punch.

## Process 7: Kiosk Device Setup and Binding Flow

### 1. Process Name

Kiosk Device Setup and Binding Flow

### 2. Goal

Register a kiosk device, bind it to tenant/company/branch/location, activate kiosk mode, and prepare it for shared multi-employee attendance.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Kiosk Admin | Registers and manages kiosk device. |
| Tenant Admin | Approves or configures kiosk settings. |
| HR Admin | Views or supports kiosk setup. |
| System | Validates device and binding. |

### 4. Trigger

Kiosk Admin opens Kiosk Device Master and starts device registration.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| Tenant/company exists | Kiosk must belong to tenant/company. |
| Branch/location exists | Kiosk must be mapped to physical location. |
| Kiosk policy exists | Verification/offline/duplicate rules configured. |
| Kiosk app installed | Device is ready for registration. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | Kiosk Admin | Opens Kiosk Device Master. |
| 2 | User Task | Kiosk Admin | Enters device name, device ID/fingerprint, branch, location, and policy. |
| 3 | Service Task | System | Validate device uniqueness. |
| 4 | Gateway | System | Check whether device already exists. |
| 5 | Service Task | System | Create kiosk device record. |
| 6 | User Task | Kiosk Admin | Binds kiosk to tenant/company/branch/location. |
| 7 | Service Task | System | Validate branch/location belongs to tenant/company. |
| 8 | Gateway | System | Check whether binding is valid. |
| 9 | User Task | Kiosk Admin | Sets admin PIN and offline policy. |
| 10 | Service Task | System | Activate kiosk device. |
| 11 | Service Task | System | Generate kiosk device token/session. |
| 12 | Service Task | System | Create audit log. |
| 13 | End Event | System | Kiosk ready for attendance. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is device unique? | Create device. | Show duplicate device error. |
| G2 | Is branch/location valid? | Bind device. | Reject binding. |
| G3 | Is kiosk policy complete? | Activate kiosk. | Keep kiosk inactive. |
| G4 | Is admin PIN set? | Enable kiosk mode. | Block activation. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Device registered inactive | Kiosk is saved but cannot capture attendance until activated. |
| Device replacement | Old device is deactivated and new device is registered. |
| Branch remapping | Requires admin approval and audit log. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Duplicate kiosk device | Block registration. |
| Invalid branch/location | Block binding. |
| Missing admin PIN | Block activation. |
| Unauthorized admin | Reject setup and log denial. |
| Device token generation failure | Keep inactive and log technical error. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| KIOSKSET-BR-001 | Kiosk device must be registered before attendance. |
| KIOSKSET-BR-002 | Kiosk must be bound to tenant/company/branch/location. |
| KIOSKSET-BR-003 | Kiosk cannot capture attendance if inactive. |
| KIOSKSET-BR-004 | Admin PIN is required to exit kiosk mode. |
| KIOSKSET-BR-005 | Kiosk binding changes must be audited. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Kiosk device ID/fingerprint | Device identity. |
| Tenant/company | Data isolation. |
| Branch/location | Attendance policy and reporting. |
| Kiosk status | Active/inactive. |
| Admin PIN status | Kiosk control. |
| Offline policy | Offline sync behavior. |

### 12. Output/Result

Kiosk device is registered, bound, activated, and ready for shared attendance.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Kiosk Device Master | Register kiosk. |
| Kiosk Binding Screen | Map branch/location. |
| Kiosk Policy Settings | Configure kiosk behavior. |
| Kiosk Activation Screen | Activate/deactivate device. |
| Kiosk Device Status | Monitor device health/sync. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `Kiosk Device` | Device master. |
| `Kiosk Device Binding` | Branch/location mapping. |
| `Kiosk Policy` | Kiosk attendance rules. |
| `Kiosk Device Session` | Device token/session. |
| `POST /api/method/hrms_kiosk.register_device` | Register kiosk. |
| `POST /api/method/hrms_kiosk.bind_location` | Bind kiosk. |
| `POST /api/method/hrms_kiosk.activate` | Activate/deactivate kiosk. |

### 15. Acceptance Criteria

* Kiosk Admin can register kiosk device.
* Kiosk device can be bound to branch/location.
* Invalid branch/location binding is blocked.
* Kiosk cannot capture attendance until active.
* Admin PIN is required for kiosk control.
* Device setup and changes are audited.

## Process 8: Shared Kiosk Multi-Employee Attendance Flow

### 1. Process Name

Shared Kiosk Multi-Employee Attendance Flow

### 2. Goal

Allow multiple employees to mark attendance sequentially from a registered shared kiosk device using identity verification and kiosk attendance rules.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Employee | Marks attendance at kiosk. |
| Sales Employee | May mark attendance at kiosk if policy allows. |
| Kiosk Device | Captures identity and punch event. |
| Kiosk Admin | Maintains device and handles issues. |
| HR Admin | Reviews kiosk exceptions. |
| System | Validates device, employee, identity, duplicate rule, and sync. |

### 4. Trigger

Employee approaches active kiosk device and starts attendance capture.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| Kiosk is registered | Device exists in backend. |
| Kiosk is active | Device status is active. |
| Kiosk is bound | Tenant/company/branch/location mapping exists. |
| Employee is active | Employee is eligible for attendance. |
| Verification policy exists | Face/selfie/code fallback configured. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | Employee | Employee stands before kiosk. |
| 2 | Service Task | Kiosk Device | Kiosk validates active device session. |
| 3 | Gateway | System | Check whether kiosk is active and bound. |
| 4 | User Task | Employee | Employee initiates face/selfie scan or enters employee code if fallback enabled. |
| 5 | Service Task | System | Identify employee or validate entered employee code. |
| 6 | Gateway | System | Check whether employee is recognized and active. |
| 7 | Service Task | System | Validate employee belongs to allowed tenant/company/branch policy. |
| 8 | Service Task | System | Determine punch type: punch in or punch out. |
| 9 | Gateway | System | Check duplicate punch window. |
| 10 | Service Task | System | Create kiosk attendance log with kiosk device and location. |
| 11 | Service Task | System | Update attendance status. |
| 12 | User Task | Kiosk Device | Show success/failure confirmation. |
| 13 | Service Task | Kiosk Device | Reset screen for next employee. |
| 14 | End Event | System | Kiosk attendance completed. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is kiosk active and bound? | Continue scan. | Block attendance. |
| G2 | Is employee recognized? | Continue validation. | Show retry/fallback. |
| G3 | Is employee active and eligible? | Continue. | Block attendance. |
| G4 | Is duplicate punch detected? | Block/flag. | Save attendance. |
| G5 | Is kiosk online? | Save to server. | Save offline queue if enabled. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Employee code fallback | Employee enters code and captures selfie if face match fails. |
| Offline kiosk | Kiosk stores attendance in local queue and syncs later. |
| Manual exception | HR reviews failed or conflicting kiosk attendance. |
| Sales employee kiosk punch | Sales employee can punch at office kiosk if policy allows. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Inactive kiosk | Block attendance. |
| Kiosk branch mismatch | Block or create exception. |
| Employee not recognized | Allow retry or fallback. |
| Face/selfie verification failed | Do not create approved attendance; create exception if configured. |
| Duplicate punch | Block or flag. |
| Offline queue full | Block new punches and show admin alert. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| KIOSKATT-BR-001 | One kiosk can capture attendance for multiple employees. |
| KIOSKATT-BR-002 | Kiosk punch must include kiosk device ID and branch/location. |
| KIOSKATT-BR-003 | Identity verification is mandatory based on kiosk policy. |
| KIOSKATT-BR-004 | Failed verification must not create approved attendance automatically. |
| KIOSKATT-BR-005 | Kiosk screen must reset after each attendance attempt. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Employee ID | Attendance ownership. |
| Kiosk device ID | Source tracking. |
| Branch/location | Attendance policy/reporting. |
| Punch type/timestamp | Attendance calculation. |
| Verification method/status | Identity audit. |
| Offline/online status | Sync audit. |

### 12. Output/Result

Employee attendance is recorded from kiosk, or an exception is created for failed/blocked attempts.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Kiosk Attendance Screen | Shared attendance capture. |
| Kiosk Success/Failure Screen | Employee feedback. |
| Kiosk Exception Queue | HR/Admin review. |
| Kiosk Attendance Report | Device/location attendance output. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `Kiosk Attendance Log` | Kiosk punch event. |
| `Employee Checkin` | ERPNext check-in record. |
| `Attendance` | Daily attendance record. |
| `Kiosk Attendance Exception` | Failed/blocked kiosk attempt. |
| `POST /api/method/hrms_kiosk.punch` | Kiosk punch endpoint. |
| `POST /api/method/hrms_kiosk.sync_offline` | Offline sync endpoint. |

### 15. Acceptance Criteria

* Active kiosk can capture attendance for multiple employees.
* Inactive kiosk is blocked.
* Kiosk attendance stores kiosk device and location.
* Employee identity is verified or exception is created.
* Duplicate kiosk punch is blocked or flagged.
* Kiosk resets for next employee after each attempt.

## Process 9: GPS and Selfie Attendance Validation Flow

### 1. Process Name

GPS and Selfie Attendance Validation Flow

### 2. Goal

Validate employee identity and location during attendance punch based on attendance policy.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Employee | Provides GPS permission and selfie/face capture. |
| Sales Employee | Provides GPS/selfie for field attendance. |
| Kiosk Device | Captures selfie/face for kiosk attendance if enabled. |
| System | Validates GPS and verification status. |
| HR Admin | Reviews exceptions. |

### 4. Trigger

Attendance punch process reaches GPS/selfie validation step.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| Attendance policy exists | Policy defines GPS/selfie requirements. |
| Device has camera/GPS | Required capability available. |
| User/device session valid | Authenticated user or active kiosk session. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | System | Attendance punch requests validation. |
| 2 | Gateway | System | Check if GPS validation is required. |
| 3 | User Task | Employee/Device | Capture GPS coordinates and accuracy. |
| 4 | Service Task | System | Validate GPS against allowed location/radius. |
| 5 | Gateway | System | Check if GPS is valid. |
| 6 | Gateway | System | Check if selfie/face validation is required. |
| 7 | User Task | Employee/Device | Capture selfie/face image. |
| 8 | Service Task | System | Validate selfie/face or store verification status. |
| 9 | Gateway | System | Check if selfie/face is valid. |
| 10 | Service Task | System | Return validation success to punch process. |
| 11 | End Event | System | Validation completed. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is GPS required? | Capture GPS. | Skip GPS validation. |
| G2 | Is GPS within allowed area? | Continue. | Create GPS exception/block. |
| G3 | Is selfie/face required? | Capture selfie/face. | Skip identity verification. |
| G4 | Is selfie/face valid? | Continue punch. | Retry or exception. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| GPS unavailable | Create exception if policy permits. |
| Selfie upload delayed | Store pending verification if offline mode allows. |
| Kiosk face fallback | Use employee code plus selfie if face recognition fails. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| GPS permission denied | Block or exception based on policy. |
| GPS accuracy poor | Block or flag for review. |
| Camera permission denied | Block or exception based on policy. |
| Face/selfie mismatch | Retry or create exception. |
| Verification service unavailable | Queue pending verification or create exception. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| VAL-BR-001 | GPS and selfie requirements are policy-driven. |
| VAL-BR-002 | GPS log must store coordinates and accuracy. |
| VAL-BR-003 | Failed validation must not be silently approved. |
| VAL-BR-004 | Selfie/face data must be handled securely. |
| VAL-BR-005 | Exceptions must be reviewable by HR/manager. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Latitude/longitude | GPS validation. |
| GPS accuracy | Location reliability. |
| Selfie/face reference | Identity verification. |
| Verification result | Approval/exception decision. |
| Device/source | Audit. |

### 12. Output/Result

Validation passes and attendance continues, or an exception/blocked result is returned.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| GPS Permission Prompt | Request location. |
| Selfie Capture Screen | Capture image. |
| Validation Failure Screen | Show reason/retry. |
| Exception Review | HR review. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `GPS Validation Log` | Store location validation. |
| `Face Verification Log` | Store verification status. |
| `Attendance Exception` | Store failed validation. |
| `POST /api/method/hrms_attendance.validate_gps` | Validate GPS. |
| `POST /api/method/hrms_attendance.verify_selfie` | Verify selfie/face. |

### 15. Acceptance Criteria

* GPS is captured when required.
* Selfie/face is captured when required.
* Failed GPS/selfie creates clear error or exception.
* Validation records are auditable.
* Attendance cannot bypass required validation.

## Process 10: Admin and HR Dashboard Basics Flow

### 1. Process Name

Admin and HR Dashboard Basics Flow

### 2. Goal

Provide Super Admin, Tenant Admin, and HR Admin with basic operational visibility for tenant/company setup, employees, attendance, kiosk status, exceptions, and quick actions.

### 3. Actors/Roles

| Actor/Role | Responsibility |
| --- | --- |
| Super Admin | Views tenant/platform basics. |
| Tenant Admin | Views company setup and configuration status. |
| HR Admin | Views employees, attendance, kiosk, and exceptions. |
| System | Aggregates dashboard data based on role. |

### 4. Trigger

Admin/HR user logs in and opens dashboard.

### 5. Preconditions

| Precondition | Description |
| --- | --- |
| User is authenticated | Valid session. |
| Role is assigned | Dashboard type depends on role. |
| Tenant/company context exists | Dashboard must filter data. |
| Basic module data exists | Employee, attendance, kiosk data may be available. |

### 6. Main BPMN-style Step Flow

| Step | BPMN Element | Actor | Activity |
| --- | --- | --- | --- |
| 1 | Start Event | Admin/HR | User opens dashboard. |
| 2 | Service Task | System | Validate session and role. |
| 3 | Service Task | System | Resolve tenant/company/branch scope. |
| 4 | Gateway | System | Determine dashboard type by role. |
| 5 | Service Task | System | Fetch employee counts, attendance summary, kiosk status, exceptions, setup progress. |
| 6 | Service Task | System | Apply permission and data filters. |
| 7 | User Task | Admin/HR | User views dashboard cards and quick actions. |
| 8 | Gateway | User | User selects quick action. |
| 9 | User Task | User | User navigates to allowed module screen. |
| 10 | End Event | System | Dashboard interaction completed. |

### 7. Decision Points/Gateways

| Gateway | Decision | Yes Path | No Path |
| --- | --- | --- | --- |
| G1 | Is user Super Admin? | Show tenant/platform dashboard. | Check tenant/HR role. |
| G2 | Is user Tenant Admin? | Show company setup dashboard. | Check HR role. |
| G3 | Is user HR Admin? | Show HR operations dashboard. | Show allowed dashboard or access denied. |
| G4 | Is quick action allowed? | Navigate. | Show access denied. |

### 8. Alternate Flows

| Alternate Flow | Description |
| --- | --- |
| Empty tenant dashboard | Show setup checklist instead of metrics. |
| Branch-scoped HR Admin | Show only assigned branch/location data. |
| Kiosk not configured | Show kiosk setup pending card. |

### 9. Exceptions/Errors

| Error | System Response |
| --- | --- |
| Unauthorized dashboard access | Show access denied. |
| Data aggregation failure | Show partial dashboard and log error. |
| Cross-tenant data request | Block and log security event. |
| Slow dashboard query | Show loading state and optimize query/report later. |

### 10. Business Rules

| Rule ID | Business Rule |
| --- | --- |
| DASH-BR-001 | Dashboard must respect role and tenant scope. |
| DASH-BR-002 | HR Admin dashboard must show employee and attendance basics. |
| DASH-BR-003 | Kiosk status must be visible when kiosk is in scope. |
| DASH-BR-004 | Exception counts must link to authorized review screens. |
| DASH-BR-005 | Dashboard quick actions must obey permissions. |

### 11. Data Captured

| Data | Purpose |
| --- | --- |
| Dashboard view event | Usage audit if required. |
| Role and scope | Permission filtering. |
| Quick action click | Navigation analytics/audit if needed. |

### 12. Output/Result

Authorized dashboard is displayed with role-appropriate metrics and quick actions.

### 13. Related Screens

| Screen | Purpose |
| --- | --- |
| Super Admin Dashboard | Tenant/platform overview. |
| Tenant Admin Dashboard | Setup and configuration overview. |
| HR Admin Dashboard | Employee, attendance, kiosk, exception overview. |
| Dashboard Cards | Metrics and alerts. |
| Quick Action Panel | Navigate to setup/actions. |

### 14. Related Backend DocTypes/APIs

| DocType/API | Purpose |
| --- | --- |
| `Employee` | Employee metrics. |
| `Attendance` | Attendance summary. |
| `Employee Checkin` | Punch data. |
| `Kiosk Device` | Kiosk status. |
| `Attendance Exception` | Exception counts. |
| `GET /api/method/hrms_dashboard.get_summary` | Dashboard summary API. |
| `GET /api/method/hrms_dashboard.get_setup_status` | Setup checklist API. |

### 15. Acceptance Criteria

* Super Admin sees tenant/platform dashboard.
* Tenant Admin sees company setup dashboard.
* HR Admin sees employee/attendance/kiosk dashboard.
* Dashboard data is tenant/company filtered.
* Branch-scoped users see only assigned data.
* Quick actions respect permissions.
* Kiosk status and attendance exceptions are visible to authorized roles.

## Phase 1 Cross-Process Business Rules

| Rule ID | Business Rule |
| --- | --- |
| P1-CROSS-001 | Every transaction must include tenant/company context. |
| P1-CROSS-002 | Backend APIs must enforce role and data-scope permissions. |
| P1-CROSS-003 | Kiosk attendance is confirmed in scope and must not be treated as optional. |
| P1-CROSS-004 | Mobile attendance must validate device binding if enabled. |
| P1-CROSS-005 | GPS/selfie validation is policy-based but must be auditable. |
| P1-CROSS-006 | Attendance exceptions must be visible to HR Admin. |
| P1-CROSS-007 | Sensitive admin changes must create audit logs. |

## Phase 1 Common Backend DocTypes

| DocType / Entity | Purpose |
| --- | --- |
| `User` | Login identity. |
| `Role` | Role definition. |
| `User Permission` | Tenant/company/branch/employee restrictions. |
| `Company` | Company setup. |
| `Branch` | Branch master. |
| `Location` | Work/kiosk/GPS location. |
| `Department` | Department master. |
| `Designation` | Designation master. |
| `Employee` | Employee master. |
| `Employee Device` | Mobile device binding. |
| `Attendance Policy` | Basic attendance rule configuration. |
| `Employee Checkin` | Raw punch log. |
| `Attendance` | Attendance result. |
| `Kiosk Device` | Kiosk device master. |
| `Kiosk Device Binding` | Kiosk branch/location mapping. |
| `Kiosk Attendance Log` | Kiosk punch details. |
| `GPS Validation Log` | GPS validation audit. |
| `Face Verification Log` | Selfie/face validation audit. |
| `Attendance Exception` | GPS, selfie, duplicate, kiosk exception records. |
| `Audit Log` | Sensitive action audit. |

## Phase 1 Common Frontend Screens

| Screen / UI Area | Technology Notes |
| --- | --- |
| Login / OTP / Forgot Password | Vue routes with Tailwind forms and validation states. |
| Role-based App Shell | Sidebar/topbar rendered by permissions API. |
| Tenant Setup | Admin form with setup checklist. |
| Company / Branch / Location Masters | Vue CRUD screens with Tailwind tables/forms. |
| Employee Master | Employee list, form, filters, profile. |
| Attendance Settings | Policy configuration UI. |
| Mobile Punch Screen | Mobile-first Vue screen or app webview/native equivalent. |
| Web Punch Screen | Employee web attendance action. |
| Kiosk Device Setup | Admin device registration and binding screens. |
| Kiosk Attendance Screen | Locked/shared device attendance UI. |
| HR Dashboard | Cards for employees, attendance, kiosk, exceptions. |
| Exception Review | HR queue for GPS/selfie/kiosk/duplicate issues. |

## Phase 1 Acceptance Summary

| Area | Acceptance Requirement |
| --- | --- |
| Authentication | Users can login/logout securely and sessions are created. |
| RBAC | Screens, APIs, and records respect role and data scope. |
| Tenant/company | Tenant and company setup can be completed. |
| Employee | Employee master can be created and linked to user/role. |
| Attendance setup | HR can configure basic attendance policies. |
| Employee punch | Employee can punch in/out from allowed channels. |
| GPS/selfie | Required validation is captured and audited. |
| Kiosk setup | Kiosk can be registered, bound, and activated. |
| Kiosk attendance | Multiple employees can mark attendance from one kiosk. |
| Dashboard | Admin/HR dashboard shows authorized foundation metrics. |
| Audit | Login, setup, permission, attendance, and kiosk actions are logged where sensitive. |

## Phase 1 Open Clarifications

| Area | Clarification Needed | Suggested Default |
| --- | --- | --- |
| OTP policy | Expiry, retry, resend limits | 5-minute expiry, 3 retries; client approval required. |
| Device binding | One or multiple employee devices | One primary active device; client approval required. |
| Kiosk verification | Face recognition, selfie, employee code fallback | Face/selfie with employee code fallback; client approval required. |
| Kiosk offline duration | Max offline storage window | 24 hours; client approval required. |
| GPS radius | Allowed location radius | Branch/location-level radius; client approval required. |
| Duplicate punch window | Time window to block repeat punch | 5 minutes; client approval required. |
| Dashboard metrics | Exact cards for Phase 1 | Employee count, present count, absent count, kiosk status, exception count. |
