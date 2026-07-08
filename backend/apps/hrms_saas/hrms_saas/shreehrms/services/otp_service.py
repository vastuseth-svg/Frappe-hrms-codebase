import frappe
from frappe import _
from frappe.utils import now_datetime, add_to_date, get_datetime
import random

def generate_otp(user_email, purpose="Login"):
	# Verify user exists
	if not frappe.db.exists("User", user_email):
		frappe.throw(_("User {0} does not exist").format(user_email))

	# Invalidate old unverified OTPs for this user & purpose by marking them verified/expired
	frappe.db.set_value("OTP Log", 
		{"user_email": user_email, "purpose": purpose, "verified": 0}, 
		"verified", 1
	)

	# Generate 6-digit OTP
	otp_code = str(random.randint(100000, 999999))
	expiry = add_to_date(now_datetime(), minutes=5)

	otp_log = frappe.get_doc({
		"doctype": "OTP Log",
		"user_email": user_email,
		"otp": otp_code,
		"purpose": purpose,
		"expiry_time": expiry,
		"verified": 0,
		"retry_count": 0
	})
	otp_log.insert(ignore_permissions=True)
	frappe.db.commit()

	return otp_code

def verify_otp(user_email, otp_code, purpose="Login"):
	# Fetch latest unverified OTP log
	otp_logs = frappe.get_all(
		"OTP Log",
		filters={
			"user_email": user_email,
			"purpose": purpose,
			"verified": 0
		},
		fields=["name", "otp", "expiry_time", "retry_count"],
		order_by="creation desc",
		limit=1
	)

	if not otp_logs:
		frappe.throw(_("No active OTP request found for this user"))

	otp_log_data = otp_logs[0]
	otp_log = frappe.get_doc("OTP Log", otp_log_data["name"])

	# Check expiry
	if get_datetime(otp_log.expiry_time) < now_datetime():
		frappe.throw(_("OTP has expired"))

	# Check retry count
	if otp_log.retry_count >= 3:
		frappe.throw(_("Maximum OTP verification retries exceeded. Please request a new OTP."))

	# Check match
	if otp_log.otp == otp_code:
		otp_log.verified = 1
		otp_log.save(ignore_permissions=True)
		frappe.db.commit()
		return True
	else:
		otp_log.retry_count += 1
		otp_log.save(ignore_permissions=True)
		frappe.db.commit()
		
		remaining = 3 - otp_log.retry_count
		if remaining <= 0:
			frappe.throw(_("Maximum OTP verification retries exceeded. Please request a new OTP."))
		else:
			frappe.throw(_("Invalid OTP. Remaining attempts: {0}").format(remaining))
