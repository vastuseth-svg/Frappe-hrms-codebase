"""
VS-02-A: Tenant Creation API Integration Tests

Run with:
  docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests \
    --app hrms_saas --module hrms_saas.tests.test_tenant_api
"""

import frappe
from frappe.test_runner import make_test_records
import unittest


def _call(method, **kwargs):
	"""Helper: call a whitelisted API method as if it were an HTTP request."""
	from frappe.handler import execute_cmd
	frappe.form_dict.update(kwargs)
	result = frappe.call(method, **kwargs)
	return result


class TestTenantAPI(unittest.TestCase):

	def setUp(self):
		frappe.set_user("Administrator")
		# Clean up any leftover test tenants
		for code in ["test01", "test02", "duptest"]:
			if frappe.db.exists("Tenant", code):
				frappe.delete_doc("Tenant", code, force=True)
		frappe.db.commit()

	def tearDown(self):
		frappe.set_user("Administrator")
		for code in ["test01", "test02", "duptest"]:
			if frappe.db.exists("Tenant", code):
				frappe.delete_doc("Tenant", code, force=True)
		frappe.db.commit()

	# ------------------------------------------------------------------
	# Test 1: Super Admin (Administrator / System Manager) creates tenant
	# ------------------------------------------------------------------
	def test_create_tenant_success(self):
		"""Super Admin creates tenant → 200, status Pending Setup."""
		from hrms_saas.api.tenant import create_tenant
		result = create_tenant(
			tenant_code="test01",
			tenant_name="Test Tenant One",
			admin_email="admin@test01.com",
		)
		self.assertTrue(result.get("success"), f"Expected success, got: {result}")
		self.assertEqual(result["tenant_code"], "test01")
		self.assertEqual(result["status"], "Pending Setup")

		# Verify DB record exists
		self.assertTrue(frappe.db.exists("Tenant", "test01"))
		doc = frappe.get_doc("Tenant", "test01")
		self.assertEqual(doc.admin_email, "admin@test01.com")
		# created_by_user requires bench migrate to be present; check via db
		creator = frappe.db.get_value("Tenant", "test01", "created_by_user")
		if creator is not None:  # field exists in DB (post-migrate)
			self.assertEqual(creator, "Administrator")

	# ------------------------------------------------------------------
	# Test 2: Duplicate tenant_code → conflict error
	# ------------------------------------------------------------------
	def test_create_tenant_duplicate(self):
		"""Duplicate tenant_code returns TENANT_EXISTS error."""
		from hrms_saas.api.tenant import create_tenant
		# First create
		create_tenant(tenant_code="duptest", tenant_name="Dup One", admin_email="a@dup.com")

		# Second create with same code
		result = create_tenant(tenant_code="duptest", tenant_name="Dup Two", admin_email="b@dup.com")
		self.assertFalse(result.get("success"), f"Should have failed, got: {result}")
		self.assertEqual(result.get("error"), "TENANT_EXISTS")

	# ------------------------------------------------------------------
	# Test 3: Non-Super-Admin role is rejected
	# ------------------------------------------------------------------
	def test_create_tenant_permission_denied(self):
		"""Non-Super-Admin gets PermissionError."""
		from hrms_saas.api.tenant import create_tenant

		# Create a minimal user without System Manager / Super Admin
		if not frappe.db.exists("User", "limited@test.com"):
			u = frappe.get_doc({
				"doctype": "User",
				"email": "limited@test.com",
				"first_name": "Limited",
				"roles": [{"role": "Employee"}],
			})
			u.insert(ignore_permissions=True)
			frappe.db.commit()

		frappe.set_user("limited@test.com")
		with self.assertRaises(frappe.PermissionError):
			create_tenant(
				tenant_code="test02",
				tenant_name="Should Fail",
				admin_email="fail@test.com",
			)
		frappe.set_user("Administrator")

	# ------------------------------------------------------------------
	# Test 4: Missing required field (tenant_code) raises ValidationError
	# ------------------------------------------------------------------
	def test_create_tenant_missing_code(self):
		"""Missing tenant_code raises a Frappe validation error."""
		from hrms_saas.shreehrms.services.tenant_service import create_tenant as svc_create

		with self.assertRaises(Exception):
			svc_create(
				tenant_code="",          # empty — should fail DocType validate
				tenant_name="No Code",
				admin_email="nocode@test.com",
			)

	# ------------------------------------------------------------------
	# Test 5: list_tenants returns paginated results
	# ------------------------------------------------------------------
	def test_list_tenants(self):
		"""list_tenants returns records for Super Admin."""
		from hrms_saas.api.tenant import create_tenant, list_tenants

		create_tenant(tenant_code="test01", tenant_name="T1", admin_email="t1@t.com")
		result = list_tenants(page=1, page_length=50)

		self.assertIn("tenants", result)
		self.assertIsInstance(result["tenants"], list)
		codes = [t["tenant_code"] for t in result["tenants"]]
		self.assertIn("test01", codes)
