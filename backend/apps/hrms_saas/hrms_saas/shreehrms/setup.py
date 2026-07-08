import frappe
from frappe.utils.password import update_password

def seed_test_users():
    if not getattr(frappe.local.conf, "allow_tests", False) and not getattr(frappe.local.conf, "developer_mode", 0):
        return

    # Seed Active Tenant
    if not frappe.db.exists('Tenant', 'testtenant'):
        tenant = frappe.get_doc({
            'doctype': 'Tenant',
            'tenant_name': 'Test Tenant',
            'tenant_code': 'testtenant',
            'admin_email': 'admin@testtenant.com',
            'status': 'Active'
        })
        tenant.insert(ignore_permissions=True)
        frappe.db.commit()
        print("Seeded test tenant: testtenant")

    # Seed Employee User
    if not frappe.db.exists('User', 'limited@test.com'):
        user = frappe.get_doc({
            'doctype': 'User',
            'email': 'limited@test.com',
            'first_name': 'Limited',
            'send_welcome_email': 0,
            'tenant': 'testtenant',
            'roles': [{'role': 'Employee'}]
        })
        user.flags.no_welcome_mail = True
        user.insert(ignore_permissions=True)
        update_password('limited@test.com', 'testpass123')
        frappe.db.commit()
        print("Seeded test user: limited@test.com")
    else:
        frappe.db.set_value('User', 'limited@test.com', 'tenant', 'testtenant')
        frappe.db.commit()
