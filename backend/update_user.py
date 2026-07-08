import frappe
frappe.init(site="frontend")
frappe.connect()
frappe.db.set_value("User", "limited@test.com", "tenant", "testtenant")
frappe.db.commit()
print("Updated")
