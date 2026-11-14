# EduBridge Platform — User Accounts & Authentication Directory

**Document Version:** 2.1  
**Target Environment:** EduBridge Cloud Core & Prisma Postgres Database  
**Authoritative Source:** Prisma Postgres Cloud Database (via `DB_URL`, table: `users`) & `src/data/userManagementData.ts`

---

## 1. Authentication Overview

EduBridge supports centralized, cross-device database-driven authentication. Users can sign in from any machine, browser, or device using **either** their:
- **Username** (case-insensitive)
- **Registered Email Address** (case-insensitive)

All user accounts, credentials, learning progress, test attempts, sessions, configurations, and evaluation scores are centrally maintained directly in the cloud **Prisma Postgres** database (via `DB_URL`: `users`, `sessions`, `activities`, `question_attempts`, `written_responses`, `smtp_config`, `email_logs`, and `auth_otps` tables). The legacy/backup `DATABASE_URL` environment variable is retained for Neon Postgres. No user credentials or session data are stored in local JSON files.

---

## 2. Primary System Accounts by Role

### 2.1 System Administrator (Full Access)

The administrator account has unrestricted access to the **Admin Portal**, user management, feature flags, audit logs, background scheduler, Ollama model configuration, and SMTP integration.

| Full Name | Role | Username | Registered Email | Password | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **System Administrator (Root)** | `admin` | `admin` | `admin@edubridge.org` | `AdminPassword2026!` | Active |

---

### 2.2 Educators & Teachers

Teacher accounts have access to classroom assignment distribution, question bank authoring, student progress monitoring, and grading rubrics.

| Full Name | Role | Username | Registered Email | Password | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Prof. Marcus Vance** | `teacher` | `marcus.vance` | `marcus.vance@edubridge.org` | `Password123!` | Active |

---

### 2.3 Parents & Guardians

Parent accounts have access to family progress oversight, study time limits, screen time monitoring, and learning streak summaries.

| Full Name | Role | Username | Registered Email | Password | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Eleanor Rivera** | `parent` | `eleanor.rivera` | `eleanor.rivera@edubridge.org` | `Password123!` | Active |

---

### 2.4 Students (Curated by Age Cohort & Learning Track)

Student accounts provide access to the **Student Learning Arena**, IELTS/PTE/TOEFL/OET exam prep suites, interactive AI tutor, STEM solvers, daily streak tracking, and gamification points.

| Full Name | Cohort / Level | Username | Registered Email | Password | Target Focus |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Educator Rivera** | `academy` (Ages 15–24) | `educator.rivera` | `educator.rivera@edubridge.org` | `Password123!` | IELTS Academic (Band 8.0) & AI Engineering |
| **Leo Chen** | `early` (Ages 5–8) | `leo.chen` | `leo.chen@edubridge.org` | `Password123!` | Primary Phonics & Reading (Simplified UI) |
| **Maya Patel** | `junior` (Ages 9–14) | `maya.patel` | `maya.patel@edubridge.org` | `Password123!` | Middle School STEM Olympiad |
| **David Sterling** | `pro` (Ages 25–54) | `david.sterling` | `david.sterling@edubridge.org` | `Password123!` | Executive Business Fluency & CTO Leadership |
| **Evelyn Vance** | `senior` (Ages 55+) | `evelyn.vance` | `evelyn.vance@edubridge.org` | `Password123!` | Cognitive Vitality & Memoir Writing |

---

## 3. Multi-Device & Automated Verification Accounts

These accounts are provisioned in the central database for cross-device synchronization testing and email/OTP verification workflows.

| Full Name | Role | Username | Registered Email | Password | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sofia Martinez** | `student` | `sofia.martinez` | `sofia.martinez@edubridge.org` | `SecurePassword123!` | Cross-machine synchronization test account |
| **Elena Rostova** | `student` | `elena.rostova` | `elena.rostova@edubridge.org` | `NewStrongPassword789!` | OTP email verification & password recovery test account |

---

## 4. Quick Reference Login Table

```
========================================================================================
ROLE        USERNAME          EMAIL ADDRESS                    PASSWORD
========================================================================================
Admin       admin             admin@edubridge.org              AdminPassword2026!
Teacher     marcus.vance      marcus.vance@edubridge.org       Password123!
Parent      eleanor.rivera    eleanor.rivera@edubridge.org     Password123!
Student     educator.rivera   educator.rivera@edubridge.org    Password123!
Student     leo.chen          leo.chen@edubridge.org           Password123!
Student     maya.patel        maya.patel@edubridge.org         Password123!
Student     david.sterling    david.sterling@edubridge.org     Password123!
Student     evelyn.vance      evelyn.vance@edubridge.org       Password123!
Student     sofia.martinez    sofia.martinez@edubridge.org     SecurePassword123!
Student     elena.rostova     elena.rostova@edubridge.org      NewStrongPassword789!
========================================================================================
```

---

## 5. Security & Session Guidelines

1. **Role Switching**:
   - When signed in as `admin`, the top navigation bar displays a multi-role selector allowing direct inspection of Student, Teacher, and Parent portals.
2. **Password Recovery via 6-Digit OTP**:
   - If a password is forgotten, select **Reset Password (OTP)** in the authentication dialog. Enter the registered email address to receive a secure 6-digit one-time passcode validated directly against the `auth_otps` table in Prisma Postgres.
3. **Session Database Persistence**:
   - Active user sessions and authentication tokens are securely maintained in the `sessions` table of the Prisma Postgres database and persist across application and server restarts.
