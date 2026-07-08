# Frappe HRMS Docker Development Guide

This repository contains a containerized development environment for running the Frappe, ERPNext, and HRMS application stack.

---

## Prerequisites

- **Docker** and **Docker Compose** installed and running on your machine.
- WSL2 (if on Windows).

---

## 1. Start the Containers

Navigate to the `backend` directory (where the `docker-compose.dev.yml` file is located) and start the services:

```bash
cd backend
docker compose -f docker-compose.dev.yml up -d
```

This starts four services in the background:
1. `mariadb` (database mapped to port `3306`)
2. `redis-cache` (Redis cache)
3. `redis-queue` (Redis queue & socketio)
4. `frappe` (the main Frappe bench development container running on port `8000` and `9000`)

---

## 2. Enter the Frappe Bench Container

Once the containers are running, access the interactive bash shell inside the `frappe` container:

```bash
docker compose -f docker-compose.dev.yml exec frappe bash
```

Inside the container:
- The default working directory is `/workspace` (which mounts the local `backend` directory on your host).
- The user is `frappe`.

---

## 3. Run the Development Server (Bench)

Navigate to the bench directory and start the processes defined in the `Procfile`:

```bash
cd frappe-bench
bench start
```

This command will run:
- The web server (`bench serve --port 8000`)
- Socket.IO server (`bench socketio`)
- Asset watch/build process (`bench watch`)
- Background scheduler (`bench schedule`)
- Workers (`bench worker`)

Once started, the application will be accessible at:
👉 **[http://localhost:8000](http://localhost:8000)**

---

## 4. Useful Administration Commands

All of the following commands must be run **inside the Frappe container** (`docker compose exec frappe bash`) under the `/workspace/frappe-bench` directory:

### Run Database Migrations
If there are schema updates or code changes:
```bash
bench --site frontend migrate
```

### Access MariaDB Shell
To log directly into the site's database console:
```bash
bench --site frontend mariadb
```

### Clear Site Cache
```bash
bench --site frontend clear-cache
```

### Reinstall the Site (Fresh Start)
> [!WARNING]
> This will wipe the database and install a fresh instance.
```bash
bench --site frontend reinstall
```

### Check Installed Apps
```bash
bench version
```
