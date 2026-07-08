import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import now_datetime, add_to_date
from frappe.utils.password import update_password
from hrms_saas.shreehrms.services.auth_service import (
	validate_credentials,
	create_user_session,
	revoke_user_session
)
from hrms_saas.shreehrms.services.otp_service import generate_otp, verify_otp

class TestAuthService(FrappeTestCase):
	def setUp(self):
		# Clean up
		frappe.db.delete("User Session", {"user": "test_auth_user@example.com"})
		frappe.db.delete("OTP Log", {"user_email": "test_auth_user@example.com"})
		frappe.db.delete("Tenant", {"tenant_code": ["in", ["testt1", "testt2"]]})
		
		if frappe.db.exists("User", "test_auth_user@example.com"):
			frappe.db.delete("User", "test_auth_user@example.com")

		# Create Active Tenant
		self.tenant_active = frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "Active Tenant",
			"tenant_code": "testt1",
			"admin_email": "admin@testt1.com",
			"status": "Active"
		}).insert(ignore_permissions=True)

		# Create Suspended Tenant
		self.tenant_suspended = frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "Suspended Tenant",
			"tenant_code": "testt2",
			"admin_email": "admin@testt2.com",
			"status": "Suspended",
			"suspension_reason": "Payment Failed"
		}).insert(ignore_permissions=True)

		# Create Test User linked to Active Tenant
		self.user = frappe.get_doc({
			"doctype": "User",
			"email": "test_auth_user@example.com",
			"first_name": "Auth",
			"last_name": "User",
			"tenant": "testt1",
			"enabled": 1
		}).insert(ignore_permissions=True)
		
		update_password("test_auth_user@example.com", "password123")
		frappe.db.commit()

	def test_credentials_validation_success(self):
		self.assertTrue(validate_credentials("test_auth_user@example.com", "password123"))

	def test_credentials_validation_invalid_password(self):
		self.assertRaises(frappe.ValidationError, validate_credentials, "test_auth_user@example.com", "wrongpassword")

	def test_credentials_validation_disabled_user(self):
		frappe.db.set_value("User", "test_auth_user@example.com", "enabled", 0)
		self.assertRaises(frappe.ValidationError, validate_credentials, "test_auth_user@example.com", "password123")

	def test_credentials_validation_suspended_tenant(self):
		# Relink user to suspended tenant
		frappe.db.set_value("User", "test_auth_user@example.com", "tenant", "testt2")
		self.assertRaises(frappe.ValidationError, validate_credentials, "test_auth_user@example.com", "password123")

	def test_session_lifecycle(self):
		# Create first session
		session1 = create_user_session("test_auth_user@example.com", "Web", "browser-xyz")
		self.assertIsNotNone(session1["session_token"])
		self.assertTrue(frappe.db.get_value("User Session", {"session_token": session1["session_token"]}, "is_active"))

		# Create second session on same device type (should deactivate first session)
		session2 = create_user_session("test_auth_user@example.com", "Web", "browser-abc")
		
		# Session 1 should now be inactive
		self.assertFalse(frappe.db.get_value("User Session", {"session_token": session1["session_token"]}, "is_active"))
		# Session 2 should be active
		self.assertTrue(frappe.db.get_value("User Session", {"session_token": session2["session_token"]}, "is_active"))

		# Revoke Session 2
		revoke_user_session(session2["session_token"])
		self.assertFalse(frappe.db.get_value("User Session", {"session_token": session2["session_token"]}, "is_active"))

	def test_otp_generation_and_verification_success(self):
		otp = generate_otp("test_auth_user@example.com")
		self.assertEqual(len(otp), 6)
		self.assertTrue(verify_otp("test_auth_user@example.com", otp))

	def test_otp_verification_invalid(self):
		otp = generate_otp("test_auth_user@example.com")
		# Verify invalid code throws error
		self.assertRaises(frappe.ValidationError, verify_otp, "test_auth_user@example.com", "000000")

	def test_otp_max_retries(self):
		otp = generate_otp("test_auth_user@example.com")
		
		# Fail 3 times
		for _ in range(3):
			try:
				verify_otp("test_auth_user@example.com", "000000")
			except frappe.ValidationError:
				pass

		# 4th time should throw maximum retries error
		with self.assertRaisesRegex(frappe.ValidationError, "Maximum OTP verification retries exceeded"):
			verify_otp("test_auth_user@example.com", "000000")
