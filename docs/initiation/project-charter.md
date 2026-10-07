PHASE 1 — PROJECT INITIATION
Project Charter — AMX: Arba Minch Experiences
1. Project Identification

Defines the basic identity of the project.

Project: AMX — Arba Minch Experiences
Type: Tourism experience coordination service + web system
Location: Arba Minch, Ethiopia
Version: MVP v1.0
2. Background

Explains the context that led to the project.

Arba Minch has tourism attractions and local tourism providers, but visitors may need to coordinate transportation, guides, activities, accommodation, and availability separately. AMX is designed to simplify this coordination.

3. Problem Statement

Defines the specific problem AMX will solve.

Visitors often need to coordinate multiple tourism services independently, creating uncertainty around availability, pricing, communication, and trip organization.

4. Proposed Solution

Defines how AMX addresses the problem.

AMX will coordinate verified local tourism providers and organize complete Arba Minch experiences through one inquiry, quotation, and booking workflow.

5. Vision

Defines the desired long-term future.

To become a trusted digital platform for discovering, coordinating, and experiencing Arba Minch.

6. Project Purpose

Explains why this project is being created now.

Build and validate a small, practical tourism-coordination service that can connect visitors with verified local providers and generate sustainable business revenue.

7. Business Case

Explains why the project makes business sense.

AMX can potentially create value by:

Simplifying trip coordination for visitors
Generating customers for local providers
Charging coordination fees
Earning package margins
Earning provider commissions
Coordinating group experiences

Core question:

Will customers pay for AMX's coordination service?

8. Target Users / Customer Segments

Initial customers:

Domestic visitors
Foreign visitors already in Arba Minch
Families
School/university groups
NGOs and companies
Hotels needing activities for guests

Start narrow rather than serving everyone.

9. Value Proposition

The specific value AMX provides:

One request → verified providers → one clear quotation → coordinated experience → local support.

For providers:

AMX can help generate organized customer opportunities without requiring every provider to manage the entire customer journey.

10. Business Objectives

AMX should:

Validate customer demand
Build a reliable provider network
Sell the first packages
Complete real customer trips
Generate revenue
Learn the real tourism coordination workflow
Establish a foundation for future growth
11. System Objectives

The software should allow AMX to:

Receive inquiries
Manage customers
Manage providers
Manage packages
Create quotations
Track bookings
Record payments
Manage follow-ups
Record reviews and complaints
Monitor basic business performance
12. Scope
In scope
Public AMX website
Three initial packages
Custom-trip inquiry
Provider management
Customer management
Inquiry management
Quotation management
Booking management
Payment records
Follow-ups
Reviews
Admin dashboard
Geographic scope

Arba Minch and selected surrounding destinations.

13. MVP Definition

The MVP is the smallest complete system + service capable of proving the business model.

A visitor must be able to:

View experience
      ↓
Submit inquiry
      ↓
Receive quotation
      ↓
Confirm
      ↓
Book
      ↓
Experience trip
      ↓
Give review

14. Out of Scope / Future Scope

Not included initially:

Mobile application
Automatic online payments
Provider self-service portal
AI chatbot
Live vehicle tracking
Multi-city marketplace
Automatic commission splitting
Large tourism directory

These become future backlog items, not MVP requirements.

Stakeholders
| Stakeholder          | Role                         |
| -------------------- | ---------------------------- |
| Visitors             | Customers                    |
| AMX team             | Coordination and management  |
| Guides               | Experience providers         |
| Drivers              | Transport providers          |
| Hotels               | Accommodation partners       |
| Boat providers       | Activity providers           |
| Tour operators       | Potential partners           |
| Schools/universities | Group customers              |
| Companies/NGOs       | Group customers              |
| Regulators           | Legal/regulatory environment |

Key Business Processes

The core AMX process is:
Inquiry
 ↓
Customer contact
 ↓
Provider checking
 ↓
Price calculation
 ↓
Quotation
 ↓
Customer confirmation
 ↓
Booking
 ↓
Trip delivery
 ↓
Completion
 ↓
Review
 ↓
Income calculation

This is the heart of the system.

Business Model / Revenue Model

Potential AMX revenue:
Coordination fee
+
Package margin
+
Provider commission
+
Group-trip coordination fee
+
Referral income

Example planning model:

Customer pays 20,000 ETB → service/provider costs 16,500 ETB → AMX gross margin = 3,500 ETB.

Actual prices must be determined from real provider/customer validation.

18. Major Deliverables

The project should produce:

Project documentation
Validated provider network
Three initial packages
Public website
Inquiry system
Admin dashboard
PostgreSQL database
Quotation system
Booking workflow
Testing documentation
Production deployment
Pilot operation
First customer feedback
19. Constraints

Known constraints include:

Limited initial capital
Small development team
Limited provider network initially
Need for real-world validation
Internet/connectivity limitations may affect operations
Legal/regulatory requirements
Limited initial customer data
Four-week MVP target
20. Assumptions

We initially assume:

Visitors are willing to request coordinated experiences.
Local providers are willing to cooperate.
Providers can provide availability information.
Three packages are sufficient for initial validation.
WhatsApp/phone can support early communication.
Manual coordination is acceptable during MVP.
The proposed technology stack is sufficient.

These assumptions must be validated, not treated as facts.

21. Dependencies

AMX depends on:

Local providers
Provider availability
Accurate pricing
Transportation
Boat services
Hotels
Guides
Internet/communication
Hosting infrastructure
Applicable licenses/permissions
Customer communication

If a critical dependency fails, the AMX booking process may fail.

22. Resources Required
People
AMX founder/operator
Software developer
Guides
Drivers
Hotel partners
Boat providers
Tourism partners
Technology
Computer
Internet
Domain
Hosting
Database
Cloud storage
WhatsApp
Git/GitHub
Business resources
Provider agreements
Package information
Pricing
Photos/content
Marketing materials
23. Technology Direction

Initial direction:

Frontend
Next.js / React

Backend
Node.js + Express

Database
PostgreSQL

Authentication
Admin authentication

Storage
Cloud storage

Communication
WhatsApp + Email

Deployment
Cloud hosting

Development
Git + GitHub + Docker

Architecture will be finalized in the System Design phase.

24. Legal & Regulatory Considerations

Before public operation, verify applicable requirements related to:

Tourism business operation
Tour operators
Tour guides
Transportation
Accommodation
Customer payments
Tax obligations
Consumer protection
Cancellation/refund policies
Liability
Provider agreements

AMX must not claim a provider is "verified" until the relevant verification has actually been performed.

25. Data & Privacy Considerations

AMX may collect:

Customer name
Phone number
Email
Travel dates
Group size
Budget
Interests
Special requirements
Booking information
Payment records

Therefore AMX needs:

Appropriate access control
Secure authentication
Secure storage
Limited data collection
Backups
Privacy policy
Controlled administrative access

Risks
| Risk                     | Impact      |
| ------------------------ | ----------- |
| Low customer demand      | High        |
| Provider unavailable     | High        |
| Provider quality problem | High        |
| Price changes            | Medium/High |
| Customer cancellation    | Medium/High |
| Legal/regulatory issue   | High        |
| Payment dispute          | High        |
| Data/security problem    | High        |
| Overbuilding software    | High        |
| Poor communication       | Medium      |

27. Quality Objectives

AMX should be:

Reliable — inquiries and bookings should not be lost.
Secure — customer and business data must be protected.
Usable — visitors should easily request an experience.
Accurate — quotations and booking information should be correct.
Maintainable — developers can modify the system safely.
Responsive — works well on mobile devices.
Operationally clear — every booking has a known status and responsible action.
28. KPIs / Success Criteria
Initial business target

Within the first 60 days:

10 qualified inquiries
        ↓
5 quotations
        ↓
3 completed paid trips

Also track:

Inquiry response time
Quotation conversion rate
Cancellation rate
Revenue
AMX gross income
Customer complaints
Reviews
Repeat/referral customers

The ultimate MVP validation is:

Can AMX repeatedly turn qualified inquiries into successfully delivered, profitable experiences?

29. Communication Strategy
Customer

Website
WhatsApp
Phone
Email

Providers

Phone
WhatsApp
Email

Internal

Admin dashboard
Operational records
Provider records
Booking records

30. Governance & Roles

Initially, AMX can operate with a small team.

AMX Owner/Administrator

Responsible for:

Business decisions
Provider relationships
Pricing
Customer coordination
Booking confirmation
Quality control
Developer

Responsible for:

Software
Database
Deployment
Security
Maintenance

Initially, these roles may be performed by the same person.

31. Change Control

During MVP development:

No new feature enters development simply because someone requests it.

Every change should be evaluated:
Request
 ↓
Business value?
 ↓
MVP critical?
 ↓
Cost/time?
 ↓
Risk?
 ↓
Decision

Critical features → MVP.

Useful but non-critical → backlog.

Unnecessary → reject/postpone.

High-Level Timeline

| Period    | Main Work                    |
| --------- | ---------------------------- |
| Week 1    | Validation + requirements    |
| Week 2    | Design + public website      |
| Week 3    | Backend + admin system       |
| Week 4    | Testing + deployment + pilot |
| Weeks 5–8 | Improve using real feedback  |

Project Milestones / Phase Gates
Gate 1
Project Charter Approved
        ↓
Gate 2
Requirements Validated
        ↓
Gate 3
System Design Approved
        ↓
Gate 4
MVP Implementation Complete
        ↓
Gate 5
Testing Passed
        ↓
Gate 6
Production Deployment
        ↓
Gate 7
Pilot Completed
        ↓
Gate 8
MVP Evaluation

34. Approval / Project Authorization

This formally establishes:

AMX MVP development is authorized to proceed from project initiation into requirements engineering once the Project Charter and initial feasibility conditions have been reviewed.

For a solo project, this can simply be your internal approval record.

Project Owner: AMX Founder
Project: AMX — Arba Minch Experiences
Version: MVP v1.0
Status: Initiation
Next Phase: Requirements Engineering
