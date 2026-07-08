import frappe
from frappe import _
from frappe.utils import now_datetime, add_to_date, get_datetime
from frappe.utils.password import check_password
import uuid

def validate_credentials(user_email, password):
	# Allow global Administrator without tenant validation
	if user_email == "Administrator":
		try:
			check_password(user_email, password)
			return True
		except frappe.AuthenticationError:
			frappe.throw(_("Invalid credentials"))

	# Validate standard user exists and is active
	if not frappe.db.exists("User", user_email):
		frappe.throw(_("Invalid credentials"))

	enabled = frappe.db.get_value("User", user_email, "enabled")
	if not enabled:
		frappe.throw(_("User account is disabled"))

	# Validate password
	try:
		check_password(user_email, password)
	except frappe.AuthenticationError:
		frappe.throw(_("Invalid credentials"))

	# Validate Tenant association and status
	validate_tenant_status(user_email)
	return True

def validate_tenant_status(user_email):
	tenant_code = frappe.db.get_value("User", user_email, "tenant")
	if not tenant_code:
		frappe.throw(_("User is not associated with any Tenant"))

	tenant_status = frappe.db.get_value("Tenant", tenant_code, "status")
	if not tenant_status:
		frappe.throw(_("Associated Tenant not found"))

	if tenant_status != "Active":
		frappe.throw(_("Tenant account is {0}").format(tenant_status))

def create_user_session(user_email, device_type="Web", device_id=None):
	# Deactivate previous active sessions for this user on the same device type
	frappe.db.set_value("User Session",
		{"user": user_email, "device_type": device_type, "is_active": 1},
		"is_active", 0
	)

	# Generate new session token
	session_token = str(uuid.uuid4())
	# 24 hours expiry
	expiry = add_to_date(now_datetime(), hours=24)

	# Get tenant from user
	tenant = frappe.db.get_value("User", user_email, "tenant")

	user_session = frappe.get_doc({
		"doctype": "User Session",
		"user": user_email,
		"tenant": tenant,
		"session_token": session_token,
		"device_id": device_id,
		"device_type": device_type,
		"expiry_time": expiry,
		"is_active": 1
	})
	user_session.insert(ignore_permissions=True)
	frappe.db.commit()

	return {
		"session_token": session_token,
		"expiry_time": expiry
	}

def revoke_user_session(session_token):
	if not session_token:
		return False

	frappe.db.set_value("User Session",
		{"session_token": session_token, "is_active": 1},
		"is_active", 0
	)
	frappe.db.commit()
	return True
