import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import now_datetime, add_to_date
from frappe.utils.password import update_password
from hrms_saas.api.auth import login, request_otp, verify_otp, logout, refresh_session, permission_bootstrap

class TestAuthAPI(FrappeTestCase):
	def setUp(self):
		# Clean up
		frappe.db.delete("User Session", {"user": "test_api_user@example.com"})
		frappe.db.delete("OTP Log", {"user_email": "test_api_user@example.com"})
		frappe.db.delete("Tenant", {"tenant_code": ["in", ["apitestt"]]})
		frappe.db.delete("Employee", {"user_id": "test_api_user@example.com"})
		
		if frappe.db.exists("User", "test_api_user@example.com"):
			frappe.delete_doc("User", "test_api_user@example.com", ignore_missing=True, force=True)
		frappe.db.delete("Has Role", {"parent": "test_api_user@example.com"})
		frappe.clear_cache(user="test_api_user@example.com")

		# Create Active Tenant
		frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "API Test Tenant",
			"tenant_code": "apitestt",
			"admin_email": "admin@apitestt.com",
			"status": "Active"
		}).insert(ignore_permissions=True)

		# Create Test User linked to Tenant
		user = frappe.get_doc({
			"doctype": "User",
			"email": "test_api_user@example.com",
			"first_name": "API",
			"last_name": "User",
			"tenant": "apitestt",
			"enabled": 1
		}).insert(ignore_permissions=True)
		
		# Create associated Employee manually to prevent Role stripping by ERPNext / HRMS validators
		# (Bypassing the heavy erpnext test bootstrap which causes Fiscal Year collisions)
		company = frappe.db.get_value("Company", {}) or "_Test Company"
		emp = frappe.get_doc({
			"doctype": "Employee",
			"first_name": "API",
			"last_name": "User",
			"user_id": "test_api_user@example.com",
			"gender": "Male",
			"status": "Active",
			"company": company,
			"date_of_joining": now_datetime().date(),
			"date_of_birth": "1990-01-01"
		})
		emp.insert(ignore_permissions=True)
		
		# Reload the user object to avoid TimestampMismatchError
		user.reload()
		
		# Add Employee role via the standard add_roles method
		user.add_roles("Employee")
		
		update_password("test_api_user@example.com", "password123")
		frappe.db.commit()

	def test_api_login_flow(self):
		# Call Login API
		res = login("test_api_user@example.com", "password123")
		self.assertEqual(res["status"], "success")

		# Retrieve the generated OTP from database
		otp_code = frappe.db.get_value("OTP Log", {"user_email": "test_api_user@example.com", "verified": 0}, "otp")
		self.assertIsNotNone(otp_code)

		# Verify OTP API
		verify_res = verify_otp("test_api_user@example.com", otp_code, "Web", "test-browser")
		self.assertEqual(verify_res["status"], "success")
		session_token = verify_res["session"]["session_token"]
		self.assertIsNotNone(session_token)

		# Verify Audit Log was created
		self.assertTrue(frappe.db.exists("Audit Log", {"user": "test_api_user@example.com", "action": "Login Success"}))

		# Bootstrap permissions API
		boot_res = permission_bootstrap(session_token)
		self.assertEqual(boot_res["status"], "success")
		self.assertEqual(boot_res["user"], "test_api_user@example.com")
		self.assertIn("Employee", boot_res["roles"])
		self.assertIn("Punch In-Out", boot_res["permitted_modules"])

		# Refresh session API
		ref_res = refresh_session(session_token)
		self.assertEqual(ref_res["status"], "success")
		self.assertEqual(ref_res["session"]["session_token"], session_token)

		# Logout API
		logout_res = logout(session_token)
		self.assertEqual(logout_res["status"], "success")

		# Try to use permissions API with logged out session token -> should raise error
		self.assertRaises(frappe.PermissionError, permission_bootstrap, session_token)
