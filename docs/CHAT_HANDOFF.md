# Chat Handoff: Modern SaaS HRMS Planning Context

## Workspace

Project folder:

```text
F:\New folder\frappehrms
```

Main documentation folder:

```text
F:\New folder\frappehrms\docs
```

## Project Context

The project is a Modern SaaS HRMS platform using:

| Layer | Technology |
| --- | --- |
| Frontend | Vue.js + Tailwind CSS |
| Backend | Frappe Framework / ERPNext HRMS customization |
| Database | MariaDB through Frappe DocTypes |
| Mobile App | React Native |
| Architecture | Multi-tenant SaaS |
| Deployment | VPS/Cloud with SSL, backup, monitoring, and CI/CD |

Client requirement includes:

* Multi-tenant HRMS SaaS.
* Employee master and organization hierarchy.
* Authentication and role-based access.
* Attendance through web/mobile.
* GPS/selfie/face attendance basics.
* Kiosk attendance is confirmed in scope.
* Shared kiosk device must support multiple employees marking attendance.
* Kiosk registration, device binding, branch/location mapping, offline sync, and exception handling are required.
* Sales attendance with GPS/face verification is required, but detailed sales field tracking is planned after the foundation.
* Payroll, leave, shift, overtime, compliance, lifecycle, helpdesk, performance, assets, reports, migration, UAT, and deployment are later phases.

## Important Client Clarification

Originally kiosk scope was ambiguous, but later the client confirmed:

```text
Kiosk attendance is in scope.
```

Do not treat kiosk as optional or future scope in new documents. Include:

* Kiosk device registration.
* Kiosk device binding.
* Kiosk branch/location mapping.
* Shared kiosk multi-employee attendance.
* Kiosk face/selfie verification.
* Kiosk offline sync.
* Kiosk attendance exception handling.

## Existing Source Documents

| File | Purpose |
| --- | --- |
| `docs/1.1ShreeHrms_RFP.md` | Original RFP/client requirement document. |
| `docs/1.2Shree_HRMS_Attendence_payrol.md` | Attendance/payroll rules converted from Excel. |
| `docs/Shree_HRMS_BRD.md` | BRD created from source requirements. Earlier BRD treated kiosk as clarification/out-of-scope, but later client confirmed kiosk is in scope, so newer documents supersede that kiosk assumption. |
| `docs/BPMN_Process_Diagram_Index_Document.md` | BPMN diagram index. Earlier kiosk entries were conditional, but later phase/TRD work treats kiosk as confirmed. |
| `docs/Phase-wise Development Planning Document.md` | Phase-wise development plan with kiosk included in early phases. |
| `docs/Auth, Role, Permission, and Access Control Document.md` | Auth, roles, permissions, access control, device binding, kiosk access, tenant isolation, audit/security rules. |
| `docs/Phase_1_Detailed_BPMN_Flow_Document.md` | Detailed Phase 1 BPMN-style flows. |
| `docs/Phase_1_Software_Requirement_Specification.md` | Phase 1 SRS. |
| `docs/Technical_Requirement_Document.md` | TRD for the platform and Phase 1 technical build. |

## Document Creation Sequence Completed

1. BRD created from RFP and attendance/payroll notes.
2. BPMN Process Diagram Index created.
3. BPMN index saved to docs.
4. Phase-wise Development Planning Document created.
5. Auth, Role, Permission, and Access Control Document created.
6. Phase 1 Detailed BPMN Flow Document created.
7. Phase 1 SRS created.
8. Technical Requirement Document created.

## Phase 1 Scope

Phase 1 focuses on:

* Authentication/Login.
* Role-based access.
* Tenant/Company setup.
* Employee setup.
* Basic attendance setup.
* Web/mobile punch in-out.
* GPS/selfie validation.
* Kiosk device setup.
* Shared kiosk attendance.
* Admin/HR dashboard basics.
* Attendance exception review.

## Recommended Development Order

```text
Scope Freeze
-> Tenant Setup
-> Company Setup
-> Role and Permission
-> Branch and Location Master
-> Department and Designation Master
-> Employee Master
-> Mobile Login
-> Device Binding
-> Kiosk Device Registration
-> Kiosk Device Binding
-> Kiosk Branch/Location Mapping
-> Kiosk Admin Control
-> Mobile Attendance
-> Web Attendance
-> Kiosk Multi-Employee Attendance
-> GPS Validation
-> Face/Selfie Verification
-> Offline Mobile Sync
-> Kiosk Offline Sync
-> Attendance Exceptions
-> Attendance Regularization
-> Sales Attendance
-> Shift
-> Leave
-> Payroll
-> Reports
-> UAT
-> Deployment
```

## TRD Recommendation Summary

Build a custom Frappe app, recommended name:

```text
hrms_saas
```

Reuse ERPNext/Frappe HRMS standard DocTypes where suitable:

* `User`
* `Role`
* `User Permission`
* `Company`
* `Department`
* `Designation`
* `Employee`
* `Employee Checkin`
* `Attendance`
* `File`
* `Version`
* `Activity Log`

Create custom DocTypes for gaps:

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
* `Export Log`

## Recommended Phase 1 Vertical Slices

| Slice | Scope |
| --- | --- |
| VS-01 | Auth and Permission Bootstrap |
| VS-02 | Tenant and Company Setup |
| VS-03 | Employee Setup |
| VS-04 | Attendance Policy Setup |
| VS-05 | Mobile/Web Punch |
| VS-06 | Kiosk Device Setup |
| VS-07 | Shared Kiosk Attendance |
| VS-08 | Dashboard and Exceptions |

Important rule:

```text
Web, mobile, kiosk, backend, permissions, and tests should be built together only when they belong to the same vertical slice.
```

## Open Clarifications Still Important

| Area | Question |
| --- | --- |
| Tenant model | Single Frappe site with logical tenant isolation or separate site per tenant? Default recommendation: single site for MVP. |
| OTP provider | Which SMS/OTP provider should be used? |
| Mobile auth | Exact token/session strategy for React Native. |
| Device binding | One active device or multiple approved devices? Default: one primary active device. |
| Kiosk hardware | Android tablet/device specs, OS version, camera quality, storage. |
| Kiosk verification | Face recognition, selfie, employee code fallback, or combination? Default: selfie/face with employee code fallback. |
| Kiosk offline | Max offline storage period and conflict handling. Default: 24 hours with admin review for conflicts. |
| Face/selfie storage | Store image, face template, verification result only, or temporary image? |
| GPS radius | Default branch/location radius. |
| Production load | Number of tenants, employees, daily punches, kiosk devices. |
| Frontend hosting | Vue app inside Frappe or separate static frontend. Default: separate Vue build served via Nginx. |
| Kiosk app form | React Native Android kiosk app or browser kiosk mode. Default: React Native Android kiosk app. |

## Suggested Next Chat Prompt

Use this in the next chat:

```text
Read docs/CHAT_HANDOFF.md first, then review docs/Technical_Requirement_Document.md, docs/Phase_1_Software_Requirement_Specification.md, and docs/Phase_1_Detailed_BPMN_Flow_Document.md. Continue from the Modern SaaS HRMS planning work. Kiosk attendance is confirmed in scope. Help me create the next required document/artifact based on the Phase 1 vertical slice plan.
```

## Best Next Artifacts

Recommended next documents, in order:

1. Phase 1 ERD / Frappe DocType Design.
2. Phase 1 API Contract Document.
3. Phase 1 Frontend Contract Document.
4. Phase 1 Mobile + Kiosk App Contract Document.
5. Phase 1 Vertical Slice Specification.
6. Phase 1 Test Case and UAT Document.

