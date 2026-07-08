import frappe
from frappe.tests.utils import FrappeTestCase
from frappe.utils import now_datetime, add_to_date

class TestOTPLog(FrappeTestCase):
	def setUp(self):
		frappe.db.delete("OTP Log", {"user_email": "test_otp@example.com"})

	def test_otp_log_creation(self):
		expiry = add_to_date(now_datetime(), minutes=5)
		otp_log = frappe.get_doc({
			"doctype": "OTP Log",
			"user_email": "test_otp@example.com",
			"otp": "123456",
			"purpose": "Login",
			"expiry_time": expiry,
			"verified": 0,
			"retry_count": 0
		})
		otp_log.insert()
		self.assertEqual(otp_log.user_email, "test_otp@example.com")
		self.assertEqual(otp_log.otp, "123456")
		self.assertEqual(otp_log.verified, 0)
