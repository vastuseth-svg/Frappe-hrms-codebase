# Phase 1 Execution Ticket Index

## 1. Purpose

This document converts the Phase 1 vertical slice plan into small execution tickets that can be assigned, implemented, tested, reviewed, and merged one at a time.

The larger vertical slices remain as epics. Do not execute an entire VS document in one attempt.

## 2. Source Documents

Use this index with:

- `docs/Phase_1_Vertical_Slice_Specification_Document.md`
- `docs/Phase_1_API_Contracts_Document.md`
- `docs/Phase_1_ERD_Frappe_DocType_Design.md`
- `docs/Phase_1_Frontend_Mobile_Screen_Contracts_Document.md`
- `docs/Auth, Role, Permission, and Access Control Document.md`
- `docs/Phase_1_Software_Requirement_Specification.md`
- `docs/Phase_1_Detailed_BPMN_Flow_Document.md`
- `.agents/AGENTS.md`

## 3. Execution Rules

Each ticket must be small enough to finish without starting the next ticket.

Rules:

- One ticket should deliver one visible or testable behavior.
- One ticket should usually touch 1 to 4 files.
- One ticket must include its own smallest useful test.
- Stop after each ticket and provide the exact test command.
- Do not mark a ticket done until the user confirms the test passed.
- Do not mark a whole slice completed until slice-level E2E tests pass.
- Backend permissions and tenant/company scope checks are mandatory where data access exists.
- Use Frappe DocTypes and standard Frappe/ERPNext models where possible.
- Avoid speculative framework, provider, dashboard, reporting, payroll, shift, or leave work in Phase 1 tickets.

## 4. Ticket Status Values

Use only these status values:

| Status | Meaning |
| --- | --- |
| `TODO` | Not started. |
| `IN PROGRESS` | Current ticket being implemented. |
| `BLOCKED` | Cannot continue without user decision, missing dependency, or failing environment. |
| `WAITING FOR USER TEST` | Implementation and tests were provided; user must run command. |
| `PASSED` | User confirmed the ticket test passed. |
| `DONE` | Ticket is merged or accepted after passing tests. |

## 5. Ticket Template

Copy this template into the active slice doc when starting a ticket.

````md
### Ticket VS-XX.YY: Short behavior name

Status: TODO

Goal:
- One sentence describing the behavior this ticket delivers.

Scope:
- Include only the smallest backend/frontend/mobile/kiosk work needed for this behavior.

Out of scope:
- List anything tempting but not required for this ticket.

Files expected:
- Exact paths if known, otherwise the smallest likely file set.

Acceptance criteria:
- Concrete behavior that must work.
- Required permission or tenant checks.
- Required error behavior.

Tests:
- Smallest useful unit, integration, API, UI, or smoke test.

Verification command:
```bash
<one command>
```

Stop point:
- Stop after sharing files changed and verification command.
````

## 6. Phase 1 Ticket Map

### VS-01 Authentication/Login + Role Permission

Goal: Users can securely authenticate and receive backend-driven permissions.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-01.01 | Minimal auth DocTypes and fixtures | None | Tenant/auth-support DocTypes install cleanly. |
| VS-01.02 | Backend password login API | VS-01.01 | Active user can log in; disabled/suspended users fail. |
| VS-01.03 | Permission bootstrap API | VS-01.02 | Authenticated user receives roles, tenant/company scope, and allowed navigation keys. |
| VS-01.04 | Web login screen | VS-01.02 | Web user can submit login and store session. |
| VS-01.05 | Web route guard and dashboard shell | VS-01.03, VS-01.04 | Unauthorized routes redirect; allowed shell renders from permissions. |
| VS-01.06 | Logout and expired-session handling | VS-01.05 | Session clears locally and backend rejects expired/revoked session. |
| VS-01.07 | OTP request and verify baseline | VS-01.02 | OTP request/verify works with expiry and retry checks. |
| VS-01.08 | Mobile login baseline | VS-01.02, VS-01.03 | Mobile login stores token and fetches permission bootstrap. |
| VS-01.09 | Login audit events | VS-01.02, VS-01.07 | Success, failure, OTP, and logout events create audit/log records. |
| VS-01.10 | VS-01 E2E smoke | VS-01.01 to VS-01.09 | Login to dashboard happy path and one failure path pass. |

### VS-02 Tenant/Company Setup

Goal: Tenant and company foundation exists for all scoped data.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-02.01 | Tenant DocType baseline | VS-01.03 | Tenant installs with required status and identity fields. |
| VS-02.02 | Tenant create API | VS-02.01 | Super Admin can create tenant; duplicate tenant is rejected. |
| VS-02.03 | Company tenant link | VS-02.02 | Company is linked to tenant and cannot cross tenant scope. |
| VS-02.04 | Tenant setup status API | VS-02.03 | Setup checklist reports missing and completed setup items. |
| VS-02.05 | Tenant/company setup web screen | VS-02.02, VS-02.03 | Super Admin/Tenant Admin can complete setup from UI. |
| VS-02.06 | Suspend tenant blocks login | VS-02.02, VS-01.02 | Suspended tenant users cannot log in; active sessions are handled. |
| VS-02.07 | Tenant audit events | VS-02.02, VS-02.06 | Create, suspend, reactivate, and company-sensitive changes are logged. |
| VS-02.08 | VS-02 E2E smoke | VS-02.01 to VS-02.07 | Create tenant/company and verify suspended tenant login failure. |

### VS-03 Branch/Location Setup

Goal: Branch and work location setup is available for employee, GPS, kiosk, and reporting flows.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-03.01 | Branch tenant/company fields | VS-02.03 | Branch records are tenant/company scoped. |
| VS-03.02 | Branch create/list API | VS-03.01 | HR/Tenant Admin can create and list scoped branches. |
| VS-03.03 | Work location DocType or customization | VS-03.01 | Location records support coordinates and radius. |
| VS-03.04 | Location create/list API | VS-03.03 | Scoped locations can be created and listed. |
| VS-03.05 | Branch/location web screen | VS-03.02, VS-03.04 | Admin can manage branches and locations from UI. |
| VS-03.06 | Branch/location lookup API | VS-03.02, VS-03.04 | Later slices can fetch active branch/location options. |
| VS-03.07 | VS-03 E2E smoke | VS-03.01 to VS-03.06 | Create branch/location and verify lookup availability. |

### VS-04 Employee Setup

Goal: HR can create and find employee records with organization mapping and user linkage.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-04.01 | Employee tenant and org fields | VS-03.06 | Employee supports tenant/company/branch/location mapping. |
| VS-04.02 | Employee create API | VS-04.01 | HR can create active employee with required scope checks. |
| VS-04.03 | Employee list/search API | VS-04.02 | HR, manager, and employee scopes return only allowed records. |
| VS-04.04 | Employee user-link API | VS-04.02, VS-01.03 | Employee can be linked to User with role and User Permission setup. |
| VS-04.05 | Employee list web screen | VS-04.03 | HR can search and filter employee records. |
| VS-04.06 | Employee form web screen | VS-04.02, VS-04.04 | HR can create/update employee and optionally link user. |
| VS-04.07 | Employee audit events | VS-04.02, VS-04.04 | Create, status, org, manager, and user-link changes are logged. |
| VS-04.08 | VS-04 E2E smoke | VS-04.01 to VS-04.07 | HR creates employee with user and scoped list remains isolated. |

### VS-05 Attendance Policy Setup

Goal: Attendance channels and validation rules can be configured before accepting punches.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-05.01 | Attendance Policy DocType | VS-04.01 | Policy supports scope, channels, duplicate window, GPS/selfie flags, offline flags. |
| VS-05.02 | Policy validation rules | VS-05.01 | Invalid channel, duplicate, offline, and scope combinations are rejected. |
| VS-05.03 | Policy upsert API | VS-05.02 | HR/Tenant Admin can create and update scoped policies. |
| VS-05.04 | Active policy resolver API | VS-05.03 | Employee/source receives most-specific active policy. |
| VS-05.05 | Attendance policy web screen | VS-05.03 | Admin can configure and activate/deactivate policies. |
| VS-05.06 | Policy audit events | VS-05.03 | Create, activate, deactivate, and validation-rule changes are logged. |
| VS-05.07 | VS-05 E2E smoke | VS-05.01 to VS-05.06 | Create active policy and resolve it for an employee/source. |

### VS-06 Web/Mobile Punch In-Out

Goal: Employee can punch in/out from enabled web or mobile source and create auditable Employee Checkin records.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-06.01 | Employee Checkin custom fields | VS-05.04 | Checkin supports source, idempotency, device, policy, and exception references. |
| VS-06.02 | Attendance status API | VS-06.01 | Employee receives current in/out status. |
| VS-06.03 | Web/mobile punch API | VS-06.02 | Employee can create valid WEB/MOBILE checkin. |
| VS-06.04 | Duplicate and idempotency handling | VS-06.03 | Replays are safe and duplicate punches are rejected or flagged. |
| VS-06.05 | Mobile device baseline validation | VS-06.03 | Mobile punch can include device metadata and approval baseline. |
| VS-06.06 | Web punch screen | VS-06.02, VS-06.03 | Employee can punch from web and see status. |
| VS-06.07 | Mobile punch screen baseline | VS-06.02, VS-06.03 | Employee can punch from mobile and see status/history. |
| VS-06.08 | Punch audit events | VS-06.03, VS-06.04 | Accepted and blocked punch attempts are logged. |
| VS-06.09 | VS-06 E2E smoke | VS-06.01 to VS-06.08 | Employee web punch creates Employee Checkin and updates status. |

### VS-07 GPS/Selfie Validation

Goal: Policy-required GPS and selfie validation is enforced before or during punch.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-07.01 | GPS Validation Log DocType | VS-06.03 | GPS validations can be stored and linked to punches. |
| VS-07.02 | GPS validation API | VS-07.01, VS-03.04 | Coordinates and accuracy are validated against work location radius. |
| VS-07.03 | Selfie upload baseline | VS-06.03 | Private selfie file upload works with type/size checks. |
| VS-07.04 | Face/selfie verification log | VS-07.03 | Verification status is stored behind an adapter boundary. |
| VS-07.05 | Punch API requires validation references | VS-07.02, VS-07.04 | Required GPS/selfie cannot be bypassed. |
| VS-07.06 | Mobile GPS/selfie capture | VS-07.02, VS-07.03 | Mobile captures validation data before punch. |
| VS-07.07 | Web GPS/selfie capture if enabled | VS-07.02, VS-07.03 | Web punch handles browser GPS/selfie requirements. |
| VS-07.08 | Validation failure exception creation | VS-07.05 | Failed validation blocks or creates exception according to policy. |
| VS-07.09 | VS-07 E2E smoke | VS-07.01 to VS-07.08 | Mobile punch with validation creates logs; failed GPS creates exception or block. |

### VS-08 Kiosk Device Setup + Binding

Goal: Shared kiosk devices can be registered, bound, activated, and authenticated.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-08.01 | Kiosk Device DocType | VS-03.06, VS-05.04 | Kiosk device supports tenant/company/branch/location and status fields. |
| VS-08.02 | Kiosk register API | VS-08.01 | Kiosk Admin can register unique device. |
| VS-08.03 | Kiosk binding API | VS-08.02 | Device can be bound to active branch/location. |
| VS-08.04 | Kiosk activate/deactivate API | VS-08.03 | Only properly bound kiosk can become active. |
| VS-08.05 | Kiosk token generation and hash storage | VS-08.04 | Token is shown once and only hash is stored. |
| VS-08.06 | Kiosk status API | VS-08.05 | Kiosk token can fetch only its own status. |
| VS-08.07 | Kiosk setup web screen | VS-08.02 to VS-08.05 | Admin can register, bind, activate, and view status. |
| VS-08.08 | Kiosk activation screen | VS-08.05, VS-08.06 | Kiosk app can save token and enter ready state. |
| VS-08.09 | VS-08 E2E smoke | VS-08.01 to VS-08.08 | Web activates kiosk and kiosk app/status confirms ready. |

### VS-09 Shared Kiosk Attendance

Goal: Multiple employees can mark attendance sequentially from one active kiosk.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-09.01 | Kiosk Attendance Log DocType | VS-08.06 | Kiosk attendance attempts are recorded. |
| VS-09.02 | Kiosk punch API | VS-09.01, VS-06.04 | Active kiosk can create Employee Checkin for eligible employee. |
| VS-09.03 | Employee eligibility check | VS-09.02 | Inactive or wrong-branch employee is blocked. |
| VS-09.04 | Kiosk selfie/verification baseline | VS-09.02, VS-07.04 | Kiosk punch can attach verification status. |
| VS-09.05 | Kiosk offline queue contract | VS-09.02 | Offline payload format and limits are defined in code/API. |
| VS-09.06 | Kiosk offline sync API | VS-09.05 | Queued punches sync idempotently. |
| VS-09.07 | Shared kiosk attendance screen | VS-09.02 | Kiosk ready screen can identify employee, submit punch, and reset. |
| VS-09.08 | Kiosk result and failure screen | VS-09.07 | Success/failure is clear and returns to ready state. |
| VS-09.09 | VS-09 E2E smoke | VS-09.01 to VS-09.08 | Active kiosk records two employees sequentially without duplicate records. |

### VS-10 Attendance Exception Review

Goal: Authorized reviewers can process attendance exceptions safely.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-10.01 | Attendance Exception DocType baseline | VS-07.08, VS-09.06 | Exceptions can link source records and status. |
| VS-10.02 | Exception list API | VS-10.01 | Reviewers can list only scoped exceptions. |
| VS-10.03 | Exception review API | VS-10.02 | Approve/reject/resolve updates status with remarks and scope checks. |
| VS-10.04 | Attendance/checkin update on approval | VS-10.03 | Approved exception can create or update attendance/checkin as allowed. |
| VS-10.05 | Concurrency protection | VS-10.03 | Two reviewers cannot silently overwrite each other. |
| VS-10.06 | Exception review web screen | VS-10.02, VS-10.03 | HR can filter, inspect, and act on exceptions. |
| VS-10.07 | Sensitive detail access audit | VS-10.06 | GPS/selfie detail access is restricted and logged. |
| VS-10.08 | VS-10 E2E smoke | VS-10.01 to VS-10.07 | Failed validation creates exception; HR approves it; unauthorized reviewer is denied. |

### VS-11 Admin/HR Dashboard Basics

Goal: Admin and HR users get scoped Phase 1 operational visibility.

| Ticket | Name | Depends On | Output |
| --- | --- | --- | --- |
| VS-11.01 | Dashboard card contract freeze | VS-02.04 | Phase 1 dashboard card list is fixed. |
| VS-11.02 | Setup status dashboard API | VS-02.04 | Tenant setup card returns scoped setup status. |
| VS-11.03 | Employee count card API | VS-04.03 | Employee counts respect tenant/company/branch/team scope. |
| VS-11.04 | Attendance count card API | VS-06.03 | Attendance/checkin counts respect date and scope. |
| VS-11.05 | Kiosk status card API | VS-08.06 | Kiosk counts and status respect scope. |
| VS-11.06 | Exception count card API | VS-10.02 | Exception counts respect status, date, and scope. |
| VS-11.07 | Dashboard summary API composition | VS-11.02 to VS-11.06 | One dashboard endpoint returns allowed cards by role. |
| VS-11.08 | Admin/HR dashboard web screen | VS-11.07 | Role-specific cards and quick actions render. |
| VS-11.09 | Dashboard performance smoke | VS-11.07 | Queries are bounded and indexed enough for Phase 1 staging data. |
| VS-11.10 | VS-11 E2E smoke | VS-11.01 to VS-11.09 | Dashboard counts match scoped records and employee is denied. |

## 7. Recommended Execution Order

Build in this order unless a ticket is blocked:

```text
VS-01.01 -> VS-01.10
VS-02.01 -> VS-02.08
VS-03.01 -> VS-03.07
VS-04.01 -> VS-04.08
VS-05.01 -> VS-05.07
VS-06.01 -> VS-06.09
VS-07.01 -> VS-07.09
VS-08.01 -> VS-08.09
VS-09.01 -> VS-09.09
VS-10.01 -> VS-10.08
VS-11.01 -> VS-11.10
```

Parallel work is allowed only when the dependency column is satisfied and response contracts are frozen.

## 8. Current Recommended Next Ticket

Start with:

```text
VS-01.01 Minimal auth DocTypes and fixtures
```

Do not start the full VS-01 at once. Do not start web, mobile, OTP, audit, or E2E until their earlier tickets pass.
