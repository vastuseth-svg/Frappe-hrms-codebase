import frappe
from frappe import _
from frappe.utils import now_datetime


def create_tenant(tenant_code, tenant_name, admin_email, admin_mobile=None, plan=None, notes=None):
	"""Create a new Tenant. Only Super Admin / System Manager may call this."""
	if frappe.db.exists("Tenant", tenant_code):
		frappe.throw(_("Tenant code '{0}' already exists.").format(tenant_code), frappe.DuplicateEntryError)

	doc = frappe.get_doc({
		"doctype": "Tenant",
		"tenant_code": tenant_code,
		"tenant_name": tenant_name,
		"admin_email": admin_email,
		"admin_mobile": admin_mobile or "",
		"plan": plan or "",
		"notes": notes or "",
		"status": "Pending Setup",
		"created_by_user": frappe.session.user,
	})
	doc.insert(ignore_permissions=False)  # permissions enforced by DocType perms
	frappe.db.commit()

	_audit(tenant_code, "Tenant Created", f"Tenant '{tenant_name}' created by {frappe.session.user}")
	return doc


def list_tenants(page=1, page_length=20, search=None):
	"""Return a paginated list of tenants. Super Admin only."""
	filters = {}
	if search:
		filters["tenant_name"] = ["like", f"%{search}%"]

	tenants = frappe.get_all(
		"Tenant",
		filters=filters,
		fields=["tenant_code", "tenant_name", "status", "admin_email", "creation"],
		order_by="creation desc",
		limit=page_length,
		start=(page - 1) * page_length,
	)
	total = frappe.db.count("Tenant", filters=filters)
	return {"tenants": tenants, "total": total, "page": page, "page_length": page_length}


def _audit(tenant_code, action, details):
	"""Internal helper — write an Audit Log entry."""
	try:
		frappe.get_doc({
			"doctype": "Audit Log",
			"user": frappe.session.user,
			"tenant": tenant_code,
			"action": action,
			"details": details,
			"ip_address": getattr(frappe.local, "ip", None) or "127.0.0.1",
			"timestamp": now_datetime(),
		}).insert(ignore_permissions=True)
		frappe.db.commit()
	except Exception:
		frappe.log_error(frappe.get_traceback(), "Audit Log write failed")
