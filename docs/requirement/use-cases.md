# AMX Use Cases

## 1. Use Case List

| ID    | Use Case                   | Actor   |
| ----- | -------------------------- | ------- |
| UC-01 | Submit Inquiry             | Visitor |
| UC-02 | Manage Inquiry             | Admin   |
| UC-03 | Manage Customer            | Admin   |
| UC-04 | Manage Provider            | Admin   |
| UC-05 | Manage Package             | Admin   |
| UC-06 | Check Provider Information | Admin   |
| UC-07 | Create Quotation           | Admin   |
| UC-08 | Send Quotation             | Admin   |
| UC-09 | Confirm Booking            | Admin   |
| UC-10 | Manage Booking             | Admin   |
| UC-11 | Record Payment             | Admin   |
| UC-12 | Complete Booking           | Admin   |
| UC-13 | Record Review              | Admin   |
| UC-14 | Manage Follow-Up           | Admin   |

## UC-01 — Submit Inquiry

**Actor:** Visitor

**Precondition:** Visitor can access the AMX website.

**Main Flow:**

1. Visitor opens the inquiry form.
2. Visitor enters travel information.
3. Visitor submits the form.
4. System validates the information.
5. System creates an inquiry.
6. System assigns an inquiry reference.
7. AMX receives the inquiry.

**Alternative Flow:**

* Invalid information → system requests correction.

**Result:** Inquiry is stored for AMX processing.

## UC-02 — Manage Inquiry

**Actor:** Admin

**Main Flow:**

1. Admin logs in.
2. Admin opens inquiries.
3. Admin selects an inquiry.
4. Admin reviews customer requirements.
5. Admin contacts customer if necessary.
6. Admin updates inquiry status.

**Result:** Inquiry is ready for provider coordination.

## UC-07 — Create Quotation

**Actor:** Admin

**Main Flow:**

1. Admin opens an inquiry.
2. Admin reviews customer requirements.
3. Admin checks required providers/services.
4. Admin records provider costs.
5. Admin adds AMX fees/margin where applicable.
6. System calculates the total.
7. Admin adds inclusions and exclusions.
8. Admin adds validity and cancellation conditions.
9. Admin saves the quotation.

**Result:** Quotation is ready to be sent.

## UC-09 — Confirm Booking

**Actor:** Admin

**Main Flow:**

1. Customer accepts quotation.
2. Admin verifies confirmation requirements.
3. Admin creates booking.
4. System generates booking reference.
5. Admin records required payment information.
6. Booking status becomes `Confirmed`.

**Result:** Confirmed booking exists.

## UC-10 — Manage Booking

**Actor:** Admin

Admin shall be able to update booking status:

`Confirmed → In Progress → Completed`

or:

`Confirmed → Cancelled`

## UC-11 — Record Payment

**Actor:** Admin

Admin records:

* Amount
* Date
* Payment method
* Payment status
* Reference/notes

## UC-12 — Complete Booking

**Actor:** Admin

1. Trip is delivered.
2. Admin confirms completion.
3. Booking status becomes `Completed`.
4. Final financial information is recorded.
5. Customer feedback can be requested.

## UC-13 — Record Review

**Actor:** Admin

Admin records customer feedback and associates it with the relevant booking.

## UC-14 — Manage Follow-Up

**Actor:** Admin

Admin creates and tracks follow-up actions related to customers, inquiries, quotations, or bookings.
