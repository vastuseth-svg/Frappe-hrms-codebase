import frappe
from frappe import _
from hrms_saas.shreehrms.services import tenant_service


def _require_super_admin():
	roles = frappe.get_roles(frappe.session.user)
	if not ({"System Manager", "Super Admin"} & set(roles)):
		frappe.throw(_("Only Super Admin can perform this action."), frappe.PermissionError)


@frappe.whitelist(allow_guest=False)
def create_tenant(tenant_code, tenant_name, admin_email, admin_mobile=None, plan=None, notes=None):
	"""POST /api/method/hrms_saas.api.tenant.create_tenant"""
	_require_super_admin()

	try:
		doc = tenant_service.create_tenant(
			tenant_code=tenant_code,
			tenant_name=tenant_name,
			admin_email=admin_email,
			admin_mobile=admin_mobile,
			plan=plan,
			notes=notes,
		)
		return {"success": True, "tenant_code": doc.tenant_code, "status": doc.status}
	except frappe.DuplicateEntryError:
		frappe.local.response["http_status_code"] = 409
		return {"success": False, "error": "TENANT_EXISTS", "message": f"Tenant code '{tenant_code}' already exists."}
	except frappe.ValidationError as e:
		frappe.local.response["http_status_code"] = 400
		return {"success": False, "error": "VALIDATION_ERROR", "message": str(e)}


@frappe.whitelist(allow_guest=False)
def list_tenants(page=1, page_length=20, search=None):
	"""GET /api/method/hrms_saas.api.tenant.list_tenants"""
	_require_super_admin()
	return tenant_service.list_tenants(
		page=int(page),
		page_length=int(page_length),
		search=search,
	)
