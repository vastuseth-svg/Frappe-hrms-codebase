import frappe
from frappe.tests.utils import FrappeTestCase

class TestTenant(FrappeTestCase):
	def setUp(self):
		# Clean up any existing test tenants to avoid unique conflicts
		frappe.db.delete("Tenant", {"tenant_code": ["in", ["validcode", "invalid code", "suspendedcode"]]})

	def test_valid_tenant_creation(self):
		tenant = frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "Valid Tenant",
			"tenant_code": "validcode",
			"admin_email": "admin@validcode.com",
			"status": "Active"
		})
		tenant.insert()
		self.assertEqual(tenant.tenant_code, "validcode")
		self.assertEqual(tenant.status, "Active")

	def test_invalid_tenant_code(self):
		tenant = frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "Invalid Tenant",
			"tenant_code": "invalid code", # contains space
			"admin_email": "admin@invalidcode.com",
			"status": "Active"
		})
		self.assertRaises(frappe.ValidationError, tenant.insert)

		tenant_special = frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "Invalid Tenant Special",
			"tenant_code": "invalid-code!", # contains special char
			"admin_email": "admin@invalidcode.com",
			"status": "Active"
		})
		self.assertRaises(frappe.ValidationError, tenant_special.insert)

	def test_suspension_validation(self):
		tenant = frappe.get_doc({
			"doctype": "Tenant",
			"tenant_name": "Suspended Tenant Test",
			"tenant_code": "suspendedcode",
			"admin_email": "admin@suspendedcode.com",
			"status": "Suspended"
		})
		# Should throw error because suspension_reason is missing
		self.assertRaises(frappe.ValidationError, tenant.insert)

		# Add suspension reason
		tenant.suspension_reason = "Payment overdue"
		tenant.insert()
		self.assertEqual(tenant.status, "Suspended")
		self.assertEqual(tenant.suspension_reason, "Payment overdue")
