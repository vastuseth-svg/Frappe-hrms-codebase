import frappe
from frappe.utils.password import update_password

def run():
	# Create Tenant
	if not frappe.db.exists("Tenant", "shreetest"):
		frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "Shree Test Tenant",
			"tenant_code": "shreetest",
			"admin_email": "admin@shreetest.com",
			"status": "Active"
		}).insert(ignore_permissions=True)
		print("Tenant shreetest created.")

	# Create User
	if not frappe.db.exists("User", "shree_user@example.com"):
		user = frappe.get_doc({
			"doctype": "User",
			"email": "shree_user@example.com",
			"first_name": "Shree",
			"last_name": "Test User",
			"tenant": "shreetest",
			"enabled": 1
		}).insert(ignore_permissions=True)
		
		# Create associated Employee
		company = frappe.db.get_value("Company", {}) or "AGROZONE (Demo)"
		if not frappe.db.exists("Employee", {"user_id": "shree_user@example.com"}):
			frappe.get_doc({
				"doctype": "Employee",
				"first_name": "Shree",
				"last_name": "Test User",
				"user_id": "shree_user@example.com",
				"gender": "Male",
				"status": "Active",
				"company": company,
				"date_of_birth": "1990-01-01",
				"date_of_joining": "2026-01-01"
			}).insert(ignore_permissions=True)
			
		user.reload()
		user.add_roles("Employee")
		update_password("shree_user@example.com", "password123")
		frappe.db.commit()
		print("User shree_user@example.com created with roles successfully.")
	else:
		# Update password in case it was changed
		update_password("shree_user@example.com", "password123")
		frappe.db.commit()
		print("User shree_user@example.com already exists. Password updated.")
