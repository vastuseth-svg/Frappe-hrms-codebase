#!/bin/bash
# Shortcut to run frappe bench tests inside the backend-frappe-1 container
# Usage: ./bin/bench-test.sh --app hrms_saas --module hrms_saas.tests.test_tenant_api

if [ $# -eq 0 ]; then
    echo "Usage: ./bin/bench-test.sh [bench test arguments]"
    echo "Example: ./bin/bench-test.sh --app hrms_saas"
    exit 1
fi

docker exec -it backend-frappe-1 bash -c "cd /workspace/frappe-bench && bench --site frontend run-tests $@"
