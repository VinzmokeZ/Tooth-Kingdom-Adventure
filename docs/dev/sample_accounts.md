# Tooth Kingdom — Sample Accounts

Use these to test linking Students/Children from the Teacher or Parent dashboards.

---

## 🏫 Teacher Account
| Field | Value |
|-------|-------|
| Email | `teacher@toothkingdom.com` |
| Role | `teacher` |
| DB UID | `teacher_seed_1` |

## 👪 Parent Account
| Field | Value |
|-------|-------|
| Email | `parent@toothkingdom.com` |
| Role | `parent` |
| DB UID | `parent_seed_1` |

---

## 🧒 Student / Child Accounts (pre-seeded)
Use these emails or phone numbers in the **"Add Student"** or **"Link Your Hero"** modals.

| Name | Email | Phone |
|------|-------|-------|
| Hero Student 6 | `student6@kingdom.com` | `900000006` |
| Hero Student 7 | `student7@kingdom.com` | `900000007` |
| Hero Student 8 | `student8@kingdom.com` | `900000008` |
| Hero Student 9 | `student9@kingdom.com` | `900000009` |
| Hero Student 10 | `student10@kingdom.com` | `900000010` |
| Hero Student 11 | `student11@kingdom.com` | `900000011` |
| Hero Student 12 | `student12@kingdom.com` | `900000012` |
| Hero Student 13 | `student13@kingdom.com` | `900000013` |
| Hero Student 14 | `student14@kingdom.com` | `900000014` |
| Hero Student 15 | `student15@kingdom.com` | `900000015` |
| Hero Student 16 | `student16@kingdom.com` | `900000016` |
| Hero Student 17 | `student17@kingdom.com` | `900000017` |
| Hero Student 18 | `student18@kingdom.com` | `900000018` |
| Hero Student 19 | `student19@kingdom.com` | `900000019` |
| Hero Student 20 | `student20@kingdom.com` | `900000020` |
| Hero Student 21 | `student21@kingdom.com` | `900000021` |
| Hero Student 22 | `student22@kingdom.com` | `900000022` |
| Hero Student 23 | `student23@kingdom.com` | `900000023` |
| Hero Student 24 | `student24@kingdom.com` | `900000024` |

> Students 1–5 already exist as `hero_1` to `hero_5` (no email/phone, use DB UID directly)

---

## 📌 Notes
- All students are pre-linked to `teacher_seed_1` via seed_db.py
- `hero_2` is pre-linked to `parent_seed_1` as a parent-child relation
- To re-seed: run `python seed_db.py` from the project root
