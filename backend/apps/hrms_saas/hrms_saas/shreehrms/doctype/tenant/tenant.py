import frappe
from frappe.model.document import Document
from frappe import _
import re

class Tenant(Document):
	def validate(self):
		self.validate_tenant_code()
		self.validate_suspension()

	def validate_tenant_code(self):
		if not self.tenant_code:
			frappe.throw(_("Tenant Code is required"))
		
		# lowercase alphanumeric check
		if not re.match(r"^[a-z0-9]+$", self.tenant_code):
			frappe.throw(_("Tenant Code must be lowercase and alphanumeric (no special characters or spaces)"))

	def validate_suspension(self):
		if self.status == "Suspended" and not self.suspension_reason:
			frappe.throw(_("Suspension Reason is required when Tenant is Suspended"))
