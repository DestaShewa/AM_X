# AMX — Localization Requirements

## 1. Purpose

Define language, regional formatting, and localization requirements for the AMX system.

---

## 2. Language

| ID     | Requirement                                                       |
| ------ | ----------------------------------------------------------------- |
| LOC-01 | English shall be the primary MVP language.                        |
| LOC-02 | The system architecture shall allow future Amharic support.       |
| LOC-03 | User-facing text should be centralized to support translation.    |
| LOC-04 | Translations should maintain the same meaning and business rules. |

---

## 3. Currency

**LOC-05** The primary business currency shall be **Ethiopian Birr (ETB)**.

**LOC-06** Prices shall be displayed consistently using the approved currency format.

**LOC-07** Financial calculations shall use sufficient decimal precision internally and display appropriate rounding.

---

## 4. Date & Time

**LOC-08** The system shall store timestamps consistently.

**LOC-09** User-facing dates shall use a clear and consistent format.

**LOC-10** The system shall operate using the appropriate Ethiopian business timezone.

**LOC-11** Date and time handling shall avoid ambiguity in bookings and payments.

---

## 5. Contact Information

The system shall support common Ethiopian contact formats, including:

* Ethiopian phone numbers
* WhatsApp contacts
* Email addresses

Contact information shall be validated where practical.

---

## 6. Address & Location

The system should support:

* City
* Region
* Country
* Specific location/meeting point
* Hotel/accommodation location

Locations should be stored consistently to support trip coordination.

---

## 7. Amharic Support

Future Amharic localization should support:

* Navigation
* Forms
* Package information
* Customer messages
* Quotations
* Booking information
* Terms and privacy content

The interface should support appropriate **Unicode text rendering**.

---

## 8. Localization Design Principle

The system should avoid hard-coding language, currency, date, and regional formats into business logic.

```text id="zhw4gu"
Application
    ↓
Localization Layer
    ├── English
    └── Amharic (Future)
```

---

## 9. MVP Priority

### Required

* English
* ETB
* Ethiopian timezone
* Ethiopian contact formats
* Mobile-friendly text display

### Future

* Full Amharic interface
* Additional languages
* Advanced regional formatting

> **Principle:** Build the MVP in English, but design it so adding Amharic later does not require major architectural changes.

**Next:** `requirements-baseline.md`
