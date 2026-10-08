# AMX — Deployment Architecture

**File:** `docs/architecture/deployment-architecture.md`
**Phase:** 5 — System Architecture & Design
**Status:** Draft for Validation

## 1. Purpose

Define how AMX will be packaged, hosted, deployed, secured, backed up, monitored, and recovered in production.

The deployment architecture must be practical for an MVP and affordable to operate.

---

## 2. Deployment Architecture

```text
                         INTERNET
                            │
                         HTTPS/TLS
                            │
                     Reverse Proxy
                            │
             ┌──────────────┴──────────────┐
             │                             │
        Public Web                     Admin Web
         Next.js                        Next.js
             │                             │
             └──────────────┬──────────────┘
                            │
                         REST API
                            │
                    Node.js / Express
                            │
                       PostgreSQL
                            │
                 ┌──────────┴──────────┐
                 │                     │
              Backups              File Storage
```

---

## 3. Deployment Model

AMX shall initially use a **cloud/VPS deployment model**.

### Main components

* Frontend application
* Backend API
* PostgreSQL database
* Reverse proxy
* HTTPS/TLS
* Backup storage
* Optional object/file storage
* Monitoring/logging

Docker shall be used to provide consistent application environments.

---

## 4. Production Environment

The initial production environment should contain:

```text
AMX Production Server
├── Reverse Proxy
├── Frontend
├── Backend API
├── PostgreSQL
├── Application Logs
└── Monitoring
```

The database should not be publicly accessible.

---

## 5. Docker Architecture

Docker shall package application services consistently.

Example:

```text
Docker Host
│
├── Reverse Proxy
├── AMX Frontend Container
├── AMX API Container
└── PostgreSQL Container
```

The exact production container structure may change according to the selected hosting provider.

---

## 6. Network Architecture

External traffic:

```text
Internet
   ↓
HTTPS : 443
   ↓
Reverse Proxy
   ↓
Frontend / API
   ↓
Internal Network
   ↓
PostgreSQL
```

PostgreSQL should only be accessible through the internal application network.

---

## 7. Domain & HTTPS

Production shall use an AMX domain with HTTPS.

Requirements:

* Valid TLS certificate
* HTTP → HTTPS redirection
* Secure cookies where applicable
* No sensitive communication over plain HTTP

The final domain and certificate provider will be selected during deployment implementation.

---

## 8. Environment Separation

At minimum, separate:

```text
Development
     ↓
Testing / Staging
     ↓
Production
```

Production credentials and data must never be casually reused in development.

---

## 9. Environment Configuration

Environment-specific configuration shall be externalized.

Examples:

```text
DATABASE_URL
API_URL
AUTH_SECRET
STORAGE_CONFIG
EMAIL_CONFIG
```

Secrets must not be committed to GitHub.

---

## 10. Database Deployment

PostgreSQL is the authoritative production database.

Requirements:

* Persistent storage
* Restricted network access
* Strong credentials
* Regular backups
* Database health monitoring
* Migration management
* Recovery procedure

Database persistence must survive normal container restarts.

---

## 11. Backup Architecture

```text
PostgreSQL
    │
    ▼
Scheduled Backup
    │
    ▼
Protected Backup Storage
    │
    ├── Retention Policy
    └── Recovery Testing
```

Backups should not depend solely on the same server hosting the production database.

---

## 12. Deployment Process

The preferred deployment flow is:

```text
Developer
   ↓
Git/GitHub
   ↓
Code Review / Tests
   ↓
Build
   ↓
Docker Image
   ↓
Staging
   ↓
Validation
   ↓
Production Deployment
   ↓
Health Check
   ↓
Monitoring
```

Production deployment should not occur directly from untested local code.

---

## 13. Database Migration

Database schema changes must be managed through versioned migrations.

```text
Migration
   ↓
Test
   ↓
Backup
   ↓
Apply to Production
   ↓
Verify
```

Manual uncontrolled production database changes should be avoided.

---

## 14. Monitoring

Monitor:

### Application

* API availability
* Error rate
* Response time
* Failed requests

### Infrastructure

* CPU
* Memory
* Disk usage
* Network
* Container health

### Database

* Availability
* Connection health
* Storage
* Backup status

---

## 15. Logging

Production logging should provide:

* Application errors
* API errors
* Authentication/security events
* Important business events
* Deployment information

Logs must avoid unnecessary sensitive customer or payment information.

---

## 16. Deployment Security

Production infrastructure shall use:

* HTTPS
* Firewall
* Restricted SSH/admin access
* Strong credentials
* Environment-based secrets
* Restricted database access
* Regular security updates
* Secure Docker configuration
* Dependency updates

---

## 17. Recovery Strategy

If the production system fails:

```text
Failure
  ↓
Detect
  ↓
Assess
  ↓
Restore Application
  ↓
Restore Database if Required
  ↓
Verify Integrity
  ↓
Resume Service
  ↓
Document Incident
```

Recovery procedures must be tested before relying on them.

---

## 18. Scaling Strategy

Initial scaling should be simple:

```text
MVP
 ↓
Optimize Application/Database
 ↓
Increase Server Resources
 ↓
Add Caching Where Needed
 ↓
Separate Infrastructure Components
 ↓
Extract Services Only If Justified
```

Microservices are not required for initial deployment.

---

## 19. Deployment Cost Principle

The deployment should minimize recurring infrastructure costs while maintaining:

* Security
* Availability
* Backup
* Recovery
* Performance

Do not purchase infrastructure for expected scale that AMX does not yet have.

---

## 20. Production Readiness Checklist

Before production:

* [ ] Domain configured
* [ ] HTTPS enabled
* [ ] Production environment configured
* [ ] Secrets secured
* [ ] Database secured
* [ ] Database migrations tested
* [ ] Backups automated
* [ ] Recovery tested
* [ ] Monitoring enabled
* [ ] Logging configured
* [ ] Firewall configured
* [ ] Application health check working
* [ ] Production deployment tested

---

## 21. Status

**Deployment Model:** Cloud/VPS
**Containerization:** Docker
**Database:** PostgreSQL
**Network:** Private application/database network
**Transport:** HTTPS/TLS
**Backup:** Automated external/protected backup
**Environments:** Development → Staging → Production

**Status:** Draft for Validation

**Next Artifact:**
`docs/architecture/integration-architecture.md`
