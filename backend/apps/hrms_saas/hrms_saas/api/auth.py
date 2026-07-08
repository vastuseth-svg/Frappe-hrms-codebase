import frappe
from frappe import _
from frappe.utils import now_datetime, get_datetime, add_to_date
from hrms_saas.shreehrms.services import auth_service, otp_service

@frappe.whitelist(allow_guest=True)
def login(usr, pwd):
	auth_service.validate_credentials(usr, pwd)
	otp_code = otp_service.generate_otp(usr)
	
	# In a real environment, we'd trigger an SMS/Email. 
	# For development/tests, we return the status. We can also print/log it.
	res = {
		"status": "success",
		"message": _("OTP has been sent to your registered email/mobile.")
	}
	if getattr(frappe.local.conf, "allow_tests", getattr(frappe.local.conf, "developer_mode", 0)):
		res["dev_otp"] = otp_code
	return res

@frappe.whitelist(allow_guest=True)
def request_otp(usr):
	# User must exist and tenant must be active
	if not frappe.db.exists("User", usr):
		frappe.throw(_("User does not exist"))
		
	# Verify tenant is active before sending OTP
	auth_service.validate_tenant_status(usr)
	
	otp_service.generate_otp(usr)
	return {
		"status": "success",
		"message": _("A new OTP has been sent.")
	}

@frappe.whitelist(allow_guest=True)
def verify_otp(usr, otp, device_type="Web", device_id=None):
	otp_service.verify_otp(usr, otp)
	session_data = auth_service.create_user_session(usr, device_type, device_id)
	
	# Create login audit log
	create_audit_log(usr, "Login Success", f"Logged in from device: {device_type} ({device_id or 'unknown'})")
	
	return {
		"status": "success",
		"session": session_data
	}

@frappe.whitelist(allow_guest=True)
def logout(session_token):
	# Revoke token
	if auth_service.revoke_user_session(session_token):
		# Create audit log if we can find the user from session token
		user = frappe.db.get_value("User Session", {"session_token": session_token}, "user")
		if user:
			create_audit_log(user, "Logout", "Session logged out manually")
			
		return {
			"status": "success",
			"message": _("Logged out successfully.")
		}
	else:
		frappe.throw(_("Invalid or inactive session token"))

@frappe.whitelist(allow_guest=True)
def refresh_session(session_token):
	session = frappe.get_all("User Session", 
		filters={"session_token": session_token, "is_active": 1}, 
		fields=["name", "user", "expiry_time"], 
		limit=1
	)
	if not session:
		frappe.throw(_("Invalid or inactive session"))
		
	# Check if expired
	if get_datetime(session[0]["expiry_time"]) < now_datetime():
		frappe.db.set_value("User Session", session[0]["name"], "is_active", 0)
		frappe.db.commit()
		frappe.throw(_("Session has expired"))
		
	# Extend session expiry by 24 hours
	new_expiry = add_to_date(now_datetime(), hours=24)
	frappe.db.set_value("User Session", session[0]["name"], "expiry_time", new_expiry)
	frappe.db.commit()
	
	return {
		"status": "success",
		"session": {
			"session_token": session_token,
			"expiry_time": new_expiry
		}
	}

@frappe.whitelist(allow_guest=True)
def permission_bootstrap(session_token=None):
	# Get session token from header or arguments
	if not session_token:
		auth_header = frappe.request.headers.get("Authorization")
		if auth_header and auth_header.startswith("Bearer "):
			session_token = auth_header.split(" ")[1]
		else:
			session_token = frappe.form_dict.get("session_token")
			
	if not session_token:
		frappe.throw(_("Authorization token required"), frappe.PermissionError)
		
	session = frappe.get_all("User Session", 
		filters={"session_token": session_token, "is_active": 1}, 
		fields=["name", "user", "tenant", "expiry_time"], 
		limit=1
	)
	
	if not session or get_datetime(session[0]["expiry_time"]) < now_datetime():
		if session:
			frappe.db.set_value("User Session", session[0]["name"], "is_active", 0)
			frappe.db.commit()
		frappe.throw(_("Session expired or invalid"), frappe.PermissionError)
		
	user = session[0]["user"]
	tenant = session[0]["tenant"]
	
	# Fetch roles for user
	roles = frappe.get_roles(user)
	
	# Determine permitted routes based on roles
	permitted_modules = []
	if "System Manager" in roles or "Super Admin" in roles:
		permitted_modules.append("Super Admin Panel")
	if "HR Manager" in roles or "HR User" in roles or "Tenant Admin" in roles:
		permitted_modules.extend(["Tenant Setup", "Branch Setup", "Employee Setup", "Attendance Policy"])
	if "Employee" in roles:
		permitted_modules.extend(["Employee Home", "Punch In-Out", "Attendance History"])
		
	return {
		"status": "success",
		"user": user,
		"tenant": tenant,
		"roles": roles,
		"permitted_modules": list(set(permitted_modules))
	}

def create_audit_log(user, action, details):
	tenant = frappe.db.get_value("User", user, "tenant")
	audit = frappe.get_doc({
		"doctype": "Audit Log",
		"user": user,
		"tenant": tenant,
		"action": action,
		"details": details,
		"ip_address": getattr(frappe.local, "ip", None) or "127.0.0.1",
		"timestamp": now_datetime()
	})
	audit.insert(ignore_permissions=True)
	frappe.db.commit()
