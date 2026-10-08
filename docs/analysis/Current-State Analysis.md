# AMX — Current-State Analysis (AS-IS)

**Project:** AMX — Arba Minch Experiences
**Phase:** Phase 3 — System Analysis & Modeling
**Artifact:** 3.2 Current-State Analysis (AS-IS)
**Version:** 1.0
**Status:** Draft

---

## 1. Purpose

This document analyzes how visitors currently discover, plan, coordinate, and experience tourism activities in Arba Minch and surrounding destinations before using AMX.

The purpose is to understand:

* Current actors.
* Current processes.
* Communication methods.
* Information flows.
* Existing problems.
* Operational risks.
* Opportunities for improvement.

---

## 2. Current-State Overview

The current tourism coordination process is generally fragmented.

A visitor may need to communicate separately with different service providers such as:

* Tour guides
* Drivers
* Hotels/lodges
* Boat-service providers
* Tour operators
* Activity providers

There may be no single party responsible for coordinating the complete experience.

A typical process is:

```text
Visitor
   ↓
Search / Recommendation
   ↓
Contact Provider
   ↓
Ask for Price
   ↓
Check Availability
   ↓
Contact Another Provider
   ↓
Compare Options
   ↓
Arrange Transport / Guide / Activity / Hotel
   ↓
Confirm Individually
   ↓
Travel
   ↓
Handle Problems Manually
```

The exact process varies depending on the visitor and service provider.

---

## 3. Current Actors

### 3.1 Visitor

The visitor:

* Searches for destinations and activities.
* Contacts providers.
* Requests prices.
* Checks availability.
* Coordinates different services.
* Makes payments.
* Travels to the destination.
* Handles changes or problems.

### 3.2 Tour Guide

The guide:

* Receives customer requests.
* Provides information about destinations.
* Gives prices.
* Confirms availability.
* Provides guiding services.

### 3.3 Driver

The driver:

* Receives transportation requests.
* Provides transportation prices.
* Confirms availability.
* Coordinates pickup and destination.

### 3.4 Hotel/Lodge

The hotel or lodge:

* Handles accommodation.
* May recommend tourism services.
* May refer visitors to guides, drivers, or tour operators.

### 3.5 Boat-Service Provider

The boat provider:

* Provides boat services.
* Confirms availability.
* Provides pricing.
* Coordinates directly or through another tourism provider.

### 3.6 Tour Operator

A tour operator may coordinate multiple tourism services, depending on the service arrangement.

---

## 4. Current Customer Journey

A typical visitor journey may be:

### Step 1 — Discover

The visitor learns about Arba Minch through:

* Search engines
* Social media
* Friends/family
* Hotels
* Travel contacts
* Tourism websites
* Previous experience

### Step 2 — Plan

The visitor decides:

* Travel date
* Number of people
* Destinations
* Budget
* Activities
* Accommodation
* Transportation

### Step 3 — Contact Providers

The visitor contacts one or more providers.

Communication may happen through:

* Phone
* WhatsApp
* Email
* Social media
* In-person communication

### Step 4 — Compare

The visitor may compare:

* Prices
* Availability
* Services
* Provider reputation
* Duration
* Transportation options

### Step 5 — Confirm

The visitor separately confirms required services.

### Step 6 — Travel

The visitor receives services from the selected providers.

### Step 7 — Handle Changes

If there is a cancellation, delay, price change, or provider problem, the visitor usually communicates directly with the affected provider.

---

## 5. Current Business Process

The current process can be represented as:

```text
Visitor
   ↓
Find Tourism Information
   ↓
Identify Provider
   ↓
Contact Provider
   ↓
Request Price
   ↓
Check Availability
   ↓
Decision
 ┌───────────────┐
 │ Suitable?     │
 └───────┬───────┘
     No  │  Yes
         │
         ↓
 Contact Another Provider
         │
         ↓
   Confirm Service
         ↓
 Arrange Other Services
         ↓
      Travel
         ↓
 Receive Service
```

There may be repeated cycles when different services need to be coordinated.

---

## 6. Current Information Flow

Information is often distributed across different communication channels.

```text
Visitor
 ├──→ Guide
 ├──→ Driver
 ├──→ Hotel
 ├──→ Boat Provider
 └──→ Tour Operator
```

Each provider may independently hold information about:

* Customer
* Date
* Group size
* Price
* Availability
* Service requirements

There may not be a centralized record of the complete trip.

---

## 7. Current Communication

Common communication methods include:

| Method       | Typical Use                    |
| ------------ | ------------------------------ |
| Phone        | Immediate communication        |
| WhatsApp     | Requests, prices, coordination |
| Email        | Formal communication           |
| Social Media | Discovery and initial contact  |
| In-person    | Local coordination             |

Communication quality depends heavily on individual providers and customers.

---

## 8. Current Pricing Process

Pricing may be determined separately by each provider.

For example:

```text
Guide Price
     +
Transport Price
     +
Boat Price
     +
Hotel Price
     +
Other Services
     =
Visitor's Total Trip Cost
```

The visitor may need to calculate or compare these costs independently.

Prices may also change depending on:

* Group size
* Travel date
* Service duration
* Transport type
* Provider
* Season
* Additional requirements

---

## 9. Current Booking Process

There may not be a single standardized booking process.

A visitor may:

1. Contact provider.
2. Receive price.
3. Confirm verbally or through messaging.
4. Make a payment/deposit if required.
5. Receive informal confirmation.
6. Contact another provider separately.

Booking information may therefore exist in:

* WhatsApp conversations
* Phone calls
* Emails
* Paper notes
* Personal spreadsheets
* Memory

---

## 10. Current Payment Process

Payment arrangements depend on the individual provider.

Possible methods include:

* Cash
* Bank transfer
* Mobile payment
* Other agreed methods

There may be no centralized record of:

* Total customer payment
* Provider cost
* AMX/service fee
* Outstanding balance
* Refund
* Commission

This creates potential financial tracking problems.

---

## 11. Current Cancellation Process

Cancellation rules may vary by provider.

A cancellation may require communication between:

```text
Visitor ↔ Provider
```

If multiple services are involved:

```text
Visitor
  ↕
Guide
  ↕
Driver
  ↕
Hotel
  ↕
Boat Provider
```

The visitor may have to coordinate several cancellations independently.

---

## 12. Current Problem Areas

### 12.1 Fragmented Coordination

Visitors may need to contact several providers independently.

### 12.2 Price Uncertainty

Prices may not always be available in one clear quotation.

### 12.3 Availability Uncertainty

A provider may appear available until direct confirmation is obtained.

### 12.4 Communication Complexity

Important information may be distributed across calls and messaging conversations.

### 12.5 Lack of Central Record

There may be no single record containing the complete customer journey.

### 12.6 Service Responsibility

When multiple providers are involved, it may be unclear who coordinates the overall experience.

### 12.7 Cancellation Complexity

Different providers may have different cancellation policies.

### 12.8 Manual Financial Tracking

Revenue, provider costs, commissions, and customer payments may be tracked separately.

### 12.9 Limited Operational Visibility

Without a centralized system, it is difficult to quickly answer:

* How many inquiries exist?
* Which bookings are confirmed?
* Which customers need follow-up?
* How much revenue was generated?
* Which providers are being used?
* Which trips are upcoming?

---

## 13. Current-State Risks

| Risk                          | Impact                   |
| ----------------------------- | ------------------------ |
| Provider unavailable          | Trip disruption          |
| Price changes                 | Customer dissatisfaction |
| Communication failure         | Coordination problems    |
| Poor provider quality         | Reputation damage        |
| Lost information              | Operational errors       |
| Unclear cancellation rules    | Financial disputes       |
| Manual records                | Data errors              |
| Multiple payment arrangements | Financial confusion      |
| No centralized tracking       | Missed follow-ups        |

---

## 14. Current-State Strengths

The current environment also has useful strengths:

* Existing local tourism providers.
* Existing communication channels.
* Local knowledge among guides and operators.
* Existing customer-provider relationships.
* Phone and WhatsApp are widely usable.
* Human coordination is already possible.
* AMX can begin with manual operations before extensive automation.

AMX should **improve the existing process rather than unnecessarily replace useful human coordination**.

---

## 15. Current-State Technology

The current process may use a combination of:

```text
Phone
WhatsApp
Email
Social Media
Paper Notes
Spreadsheets
Personal Contacts
```

There is not necessarily one integrated system connecting the complete customer journey.

---

## 16. AS-IS Process Summary

```text
                CURRENT STATE

                 VISITOR
                    │
                    ↓
            Find Information
                    │
                    ↓
            Contact Providers
             /      |       \
            ↓       ↓        ↓
         Guide   Driver    Hotel
            \       |       /
             \      |      /
              ↓     ↓     ↓
             Compare / Coordinate
                    │
                    ↓
              Confirm Services
                    │
                    ↓
                  Travel
                    │
                    ↓
              Receive Services
                    │
                    ↓
            Handle Issues Directly
```

The process is primarily **provider-by-provider and communication-driven**.

---

## 17. Key AS-IS Findings

The current-state analysis identifies five major themes:

### Finding 1 — Fragmentation

Multiple tourism services may be coordinated independently.

### Finding 2 — Information Distribution

Important customer and booking information can be distributed across different communication channels.

### Finding 3 — Manual Coordination

Human communication is central to the current process.

### Finding 4 — Lack of Unified Quotation

Customers may not have one clear quotation covering all required services.

### Finding 5 — Opportunity for Coordination

A service that combines local provider relationships with centralized coordination could reduce customer effort while preserving human involvement.

---

## 18. Important Validation Note

The AS-IS model is an initial analytical model based on project knowledge and assumptions.

It must be validated through real interviews and observation with:

* Visitors
* Guides
* Drivers
* Hotels
* Boat providers
* Tour operators

Any assumption that is disproved during real-world research shall be updated.

---

## 19. AS-IS Conclusion

The current tourism coordination environment can be characterized as:

> **Fragmented, communication-driven, provider-dependent, and largely manual.**

The main opportunity for AMX is not simply to provide tourism information, but to **coordinate multiple local services into one clearer customer journey**.

This AS-IS model provides the baseline for designing the **TO-BE process in Artifact 3.3**.

---

## 20. Next Artifact

**3.3 — Future-State Analysis (TO-BE)**

The TO-BE analysis will define the improved AMX process:

**Visitor Inquiry → AMX Coordination → Provider Confirmation → One Quotation → Booking → Trip Delivery → Completion → Review**
