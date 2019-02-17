# Notes on DAMA-DMBOK: Data Management Body of Knowledge, 2nd Ed

By DAMA International; Technics Publishers, July 17

# Chapter 1: Data Management (DM hereafter)

## Introduction

* DM goals within an organization:
    * Understanding / supporting enterprise and stakeholder information needs
    * Capturing, storing, protecting, ensuring integrity of data assets
    * Ensuring data / info quality
    * Ensuring privacy / confidentiality of stakeholder data
    * Preventing access / manipulation / use of data by bad actors
    * Ensuring data can be used to add value to the enterprise

## Essential Concepts

* DM principles for balancing stategic and operational needs:
    * Data is an asset with unique properties
    * The value of data can and should be expressed in economic terms, to allow comparisons with other asset classes
    * Managing data means managing data quality
    * Metadata is required for managing data
    * DM requires planning
    * DM requires a range of skills and expertise
    * DM requires an enterprise-wide perspective
    * DM must account for a range of perspectives
    * DM is data lifecycle management
    * Different data types have different lifecycle characteristics
    * Managing data requires risk mitigation
    * DM requirements should drive IT decisions
    * Effective DM requires commitment from leadership
* Key points about the lifecycle of data:
    * Creation and usage are the most critical points in the cycle
        * You must understand how and why it was collected to use it
        * Collecting it costs money
        * It only recoups value when consumed or used
    * Multiple aspects must be managed through various lifecycle events:
        * Data quality
        * Metadata quality
        * Data security
* You need an overall data management strategy, which should include:
    * A compelling vision for data management
    * A summary business case for data management, with examples
    * Guiding principles, values, and management perspectives
    * The mission and long-term goals for DM
    * Proposed measures of DM success
    * Short term (12-24 months) DM program objectives that are SMART (specific, measurable, actionable, realistic, time-bounded)
    * Descriptions of DM roles and organizations, with summaries of their responsibilities and decision rights
    * Prioritized program of work with scope boundaries
    * Draft implementation roadmap with projects and action items
* Deliverables from strategic planning for DM include:
    * A DM Charter, including:
        * overall vision
        * business case
        * goals
        * guiding principles
        * measures of success
        * critical success factors
        * recognized risks
        * operating model
    * A DM Scope Statment:
        * goals and objectives for some planning horizon
        * roles, orgs, leaders accountable for specific objectives
    * DM Implementation Roadmap:
        * Specific programs, projects, task assignments, delivery milestones
* DM Strategy should address all DAMA Data Management Framework Knowledge Areas relevant to the organization

## DM Frameworks

* It is helpful to have a DM Framework to keep track of all the various moving parts
* Factors influencing an organization's DM framework include:
    * industry
    * range of data it uses
    * org culture
    * org maturity level
    * strategy and vision
    * specific challenges at the present time
* Multiple frameworks:
    * Strategic Alignment Model and Amsterdam Information Model show high level relationships influencing how the org manages data
    * DAMA DMBOK framework describes DM Knowledge Areas, explains their visual representation within the DMBOK
    * Some refinements of the DAMA Wheel

### Strategic Alignment Model

* Sourced to Henderson and Venkatraman, 1999
* Abstracts the fundamental drivers for any approach to DM, centered on relation between data and information
* Information is business focused and operationalized
* Data is associated with processes that support systems that make data available for use
* Around this are the four domains of strategic choice:
    * business strategy
    * IT strategy
    * organization infrastructure and processes
    * IT infrastructure and processes

```
    ^            <--- Business ----------------------- IT --->
    |
 Strategy    +------------+                              +------------+
    |        |Biz Strategy|                              |IT Strategy |
    |        +------------+                              +------------+
    |                       +--------------------------+
    |                       |                          |
    |                       | Information        Data  |
    |                       |                          |
    |                       +--------------------------+
Operations  +-------------+                              +------------+
    |       | Organization|                              |Info Systems|
    v       | and Process |                              +------------+
            +-------------+
```

### The Amsterdam Information Model

* Sources to Abcouwer, Maes, Truijens, 1997
* Known as '9-cell'
* Focuses on strategic perspective on business and IT alignment
* Both AIM an SAM focus on relation between components as a two axis system, with the vertical being strategy to operations and the horizontal being business to IT 

```
                      +--------------------------------------------+
                      |                                            |
                      |                                            |
            Business  |          Information Governance            |   IT
                      |                                            |
            +---------+--------------------------------------------+--------+
            |                                                               |
            |        Biz Strat. & |  Info. Strat. &   | IT Strat. &         |  A
 Strategy   |        Governance   |  Governance       | Governance          |  R
            |                     |                   |                     |  C
            |        -------------+-------------------+----------------     |  H
            |                     |                   |                     |  I
            |        Organization |  InfoArchitecture | IT Architecture     |  T
  Tactics   |        & Processes  |  & Planning       | & Planning          |  E
            |                     |                   |                     |  C
            |        -------------+-------------------+----------------     |  T
            |                     |                   |                     |  U
            |        Business     |  Info Management  | IT Services &       |  R
Operations  |        Execution    |  & Use            | Exploitation        |  E
            |                                                               |
            +---------+---------------------------------------------+-------+
                      |                                             |
                      |                                             |
                      |            Data Quality                     |
                      |                                             |
                      +---------------------------------------------+

```

### Th DAMA-DMBOK Framework

* Focuses more on Knowledge Areas that make up the overall scope of DM
* Three major visuals:
	* DAMA Wheel
    * Environmental Factors Hexagon
    * Knowledge Area Context Diagram
* The Wheel defines the DM Knowledge areas, with Data Governance in the center, since it is required for consistency and balance between other functions
* The environmental factors hexagon has Goals and Principles at the center, surrounded by wedges for
    * Deliverables and Tools (on the Technology axis)
    * Roles/Responsibilities and Organization/Culture (on the People axis)
    * Techniques and Activities (on the Process axis)
* Knowledge Areas (more on them in later chapters):
    * Data Modeling and Design
    * Data Storage and Operations
    * Data Security
    * Data Integration and Interoperability
    * Document and Content Management
    * Reference and Master Data
    * Data Warehousing and BI
    * Metadata
    * Data Quality
    * Data Architecture
* For each knowledge area there is a context diagram, based on a SIPOC product management diagram that would cover Suppliers, Inputs, Processes, Outputs, and Consumers, with activities at the center
* A context diagram has the following parts:
    * knowledge area definition and goals
    * activities driving the goals, classified into four phases:
        * Plan (P) activities that set the strategic and tactical course for meeting data management goals; occur on a recurring basis
        * Develop (D) activities organized around the system development lifecycle (SDLC), including analysis, design, build, test, preparation, deployment
        * Control (C) activities that ensure the ongoing quality of data, and integrity, reliability, and security of systems through which the data is accessed and used
        * Operate (O) activities that support the use, maintenance, and enhancement of systems and processes through which data is accessed and used
    * Flowing into these activities are:
        * Inputs - tangible things the KA requires for its activities
        * Suppliers - people responsible for providing / enabling access to inputs
    * Flowing out of the activities are:
        * Deliverables - tangible outputs each function is responsible for producing
        * Consumers - those that benefit directly from the primary deliverables
    * Participants are listed below the activities
    * At the bottom are:
        * Tools - applications and technologies enabling the KA's goals
        * Techniques - methods and procedures to perform the activities
        * Metrics - standards for evaluating performance, progress, quality, efficiency, etc.

### DMBOK Pyramid (Aiken)

* Most organizations must manage data before having a complete data management strategy, building toward a good solution concurrently, possibly under sub-optimal conditions
* Peter Aiken came up with a framework that uses DMBOK functional areas to describe this situation
* In trying to reach a state where the org has reliable data and processes that support strategic goals, many orgs go through steps like this:
    1. purchase an application for data management (often a database); do some work on integration
    1. Challenges with data quality appear, indicating the need for metadata and data architecture
    1. Creating data quality and good metadata requires some form of data governance, which also enables:
        * execution of strategic initiatives
        * master data management
        * data warehousing
        * business intelligence
    1. The organization leverages the well managed data to advance analytic capabilities
* This framework focuses more on the interdependencies between the knowledge areas

### DAMA Data Management Framework Evolved

* Framework developed by Sue Geuens explores interdependencies between KAs
* Shows flow of outputs and dependencies through different KAs

```
   ^   +------------------------------------------------------------------+   ^
   |   |                         BI / Analytics                           |   |
   |   +------------------------------------------------------------------+   |
   |                                                                          |
   |   +-------------------------------+ +--------------------------------+   |
   ^   |            Master Data        | |       Data Warehouse           |   ^
D  |   +-------------------------------+ +--------------------------------+   |  O
E  |                                                                          |  U
P  |   +------------------------------------------------------------------+   |  T
E  |   |                       Systems/Application                        |   |  P
N  ^   +------------------------------------------------------------------+   ^  U
D  |                                                                          |  T
E  |   +--------------+          +-------------+     +--------------------+   |
N  |   | Data Quality |          | Data Design |     | Data Integration   |   |  F
C  |   +--------------+          +-------------+     | & Interoperability |   |  L
Y  ^                                                 +--------------------+   ^  O
   |                                                                          |  W
F  |   +------------------------------------------------------------------+   |
L  |   |                        Data Governance                           |   |
O  |   |                                                                  |   |
W  ^   | +----------+ +---------------+ +------------+ +----------------+ |   ^
   |   | | Metadata | | Data Security | | Data Arch. | | Reference Data | |   |
   |   | +----------+ +---------------+ +------------+ +----------------+ |   |
   |   |                                                                  |   |
   +   +------------------------------------------------------------------+   +
```

* There is also an alternative to the DAMA Wheel, which focuses on enabling organizations to get value from their data assets
* Deriving value requires lifecycle management, so that's at the diagram center
* Idea is that if data is truly managed as an asset, organizations may be able to sell it more easily, where orgs that focus only on direct lifecycle functions won't get as much value

```
+-----------------------------------------------------------------------------------------------+
|                                 Data Management Functions                                     |
+-----------------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------------+
|                                 Oversight: Data Governance                                    |
|                                                                                               |
| +----------+   +----------------+    +-------------------+    +--------+      +-------------+ |
| | Strategy |   | Data Valuation |    | Principles/Ethics |    | Policy |      | Stewardship | |
| +----------+   +----------------+    +-------------------+    +--------+      +-------------+ |
|                                                                                               |
| +-------------------------------------------------------------------------------------------+ |
| |                                     Culture Change                                        | |
| +-------------------------------------------------------------------------------------------+ |
|                                                                                               |
+-----------------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------------+
|                                     Lifecycle Management                                      |
|                                 +------------------------->                                   |
|                                                                                               |
| +---------------+ +--------------------------------------+ +--------------------------------+ |
| | Plan/Design   | |             Use/Enhance              | |        Enable/Maintain         | |
| +---------------+ +--------------------------------------+ +--------------------------------+ |
| |               | |                                      | |                                | |
| | Architecture  | | Data Storage        Data Warehousing | | Biz. Intel.       Data Science | |
| |               | | and Operations                       | |                                | |
| | Data Modeling | |                                      | | Master Data       Data         | |
| | and Design    | | Data Integration    Big Data Storage | | Usage             Monetization | |
| |               | | & Interoperability                   | |                                | |
| |               | |                                      | | Document/Content  Predictive   | |
| |               | | Master Data         Reference Data   | | Management        Analytics    | |
| |               | | Management          Management       | |                                | |
| |               | |                                      | |                                | |
| +---------------+ +--------------------------------------+ +--------------------------------+ |
|                                                                                               |
+-----------------------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------------------+
|                                   Foundational Activities                                     |
|                                                                                               |
|                                                                                               |
|                     Data Risk Management: Security, Privacy, Compliance                       |
|                                                                                               |
|                                     Metadata Management                                       |
|                                                                                               |
|                                    Data Quality Management                                    |
|                                                                                               |
+-----------------------------------------------------------------------------------------------+
```

## DAMA and the DMBOK

* DAMA was created to make it easier to manage data well
* The DMBOK is an accessible, authoritative reference book for data management professionals
* The DMBOK supports the DAMA mission by:
	* Providing a functional framework for the implementation of enterprise data management practices
    * Establishing a common vocabulary for DM concepts, providing best practices
    * Serving as the fundamental reference guide for hte Certified Data Management Professional and other certification exams (CDMP)
* Overview of the 11 knowledge areas:
    * **Data governance** - gives direction and oversight for DM by establishing a system of decision rights over data that accounts for the needs of the enterprise
    * **Data architecture** - defines the blueprint for managing data assets by aligning with organizational strategy to establish strategic data requirements and designs for those requirements
    * **Data modeling and design** - process of discovering, analyzing, representing, and communicating data requirements in the form of a 'data model'
    * **Data storage and operations** - design, implementation, and support of stored data to maximize its value; covers entire data lifecycle
    * **Data security** - ensures that data privacy and confidentiality is maintained, that data is not breached, and that access is appropriate
    * **Data integration and interoperability** - includes process related to the movement and consolidation of data within and between data stores, applications, and organizations
    * **Document and content management** - planning, implementation, and control activities for managing the data lifecycle, and info found in a range of unstructured media, particularly documents needed to support legal and regulatory compliance requirements
    * **Reference and master data** - ongoing reconciliation and maintenance of core, critical, shared data to enable consistent use across systems, for the most accurate, timely, and relevant version of trust about essential business entities
    * **Data warehousing and business intelligence** - includes planning, implementation, and control processes to manage decision support data and to enable knowledge workers to get value from data via analysis and reporting
    * **Metadata** - planning, implementation and control activities to provide access to high quality, integrated metadata, including definitions, models, data flows, and other info critical to understanding data and the systems through which it is created, maintained, and accessed
    * **Data Quality** - planning and implementation of quality management techniques to measure, assess, and improve the fitness of data for use
* DMBOK additonally covers:
    * Data handling ethics
    * Big data and data science
    * Data management maturity assessment
    * Data management organization and role expectations
    * Data management and organizational change managemnet

# Chapter 2: Data Handling Ethics

## Introduction

* "Data handling ethics are concerned with how to procure, store, manage, use, and dispose of data in ways that are aligned with ethical principles."
* Core concepts:
    * **Impact on people** - data represents real people, and is used to make decisions that impact their lives. There is an imperative to manage its quality and reliability.
    * **Potential for misuse** - misusing data con have a negative impact on people and organizations
    * **Economic value of data** - data is valuable, and "the ethics of ownership should determine how that value can be accessed and by whom"
* Much of data protection is shaped by laws and regulatory requirements; data professionals should additionally hold themselves to ethical standards.

### Context Diagram for Data Handling Ethics

* **Business Drivers:**
    * **Definition:** Data handling ethics are concerned with how to procure, store, manage, interpret, analyze / apply, and dispose of data in ways that are aligned with ethical principles, including community responsibility.
    * **Goals:**
        1. To define ethical handling of data in the organization.
        1. To educate staff on the organization risks of improper data handling.
        1. To change/instill preferre culture and behaviors on handling data
        1. To monitor regulatory environment, measure, monitor, and adjust organization approaches for ethics in data.
* **Inputs to Activities**
    * Existing and preferred organization ethics
    * Business strategy and goals
    * Organizational structure
    * Business culture
    * Regulations
    * Existing corporate policies
* **Suppliers to Activities**
    * Executives
    * Data stewards
    * Executive data stewards
    * IT Executives
    * Data providers
    * Regulators
* **Participants in Activities**
    * Data governance bodies
    * CDO / CIO
    * Executives
    * Coordinating Data Stewards
    * Subject matter experts
    * Change managers
    * DM Services
* **Activities** (P) Planning, (C) Control, (D) Development, (O) Operations
    1. Review data handling practices (P)
    1. Identify principles, practices, and risk factors (P)
    1. Create an ethical data handling strategy
    1. Address practice gaps (D)
    1. Communicate and educate staff (D)
    1. Monitor and maintain alignment (C)
* **Deliverables from Activities**
    * Current practices and gaps
    * Ethical data handling strategy
    * Communication plan
    * Ethics training program
    * Ethical corporate statements on data
    * Awareness of ethical data issues
    * Aligned incentives, KPIs, targets
    * Updated policies
    * Ethical data handling reporting
* **Consumers of Deliverables**
    * Employees
    * Executives
    * Regulators
* **Technical Drivers**
    * **Techniques**
        * Communication plan checklists
        * Annual ethics statement affirmations
    * **Tools**
        * Wikis, knowledge bases, intranet sites
        * Microblogs, other internal comms tools
    * **Metrics**
        * Employees trained
        * Compliance / non-compliance incidents
        * Corporate executive involvement

## Business Drivers

* "An ethical approach is increasingly being recognized as a competitive business advantage (Hasselbalch and Tranberg, 2016)"
* Different models of data ownership influence the ethics of data handling
* You need organization wide recognition of the risks associated with data misuse

## Essential Concepts

* Bioethics gives a good starting point--focuses on preserving human dignity
* Belmont principles for medical research (US-HSS, 1979) may be adapted for information management:
    * **Respect for persons** - Preserve and respect the dignity and autonomy of individuals. In cases of diminished autonomy, take extra care with dignity and rights.
    * **Beneficence** - Do not harm; maximize possible benefits and minimize possible harms.
    * **Justice** - Treat people fairly and equitably.
* The European Data Protection supervisor published an opinion on digital ethics in 2015, focused on human dignity, set out four pillars required for an info ecosystem that ensures ethical treatment of data:
    * Future oriented regulation of data processing and respect for the rights to privacy and to data protection
    * Accountable controllers who determine personal information processing
    * Privacy conscious engineering and design of data processing products and services
    * Empowered individuals
* After WW2, the European Convention of Human Rights established a general right to privacy, and the specific right to information privacy, as human rights fundamental to upholding the right to Human Dignity.
* In 1980, the Organization for Economic Cooperation and Development (OECD) established Guidelines and Principles for Fair Information Processing.
* OECD provided eight core principles included:
    * limitations on data collection
    * an expectation that data is of high quality
    * limitations on data usage and access
    * an expectation of openness and transparency
    * accountability for organizations
* The OECD principles were superseded by the principles of the General Data Protection Regulation (GDPR, 2016):
    * **Fairness, lawfulness, transparency** - Personal data shall be processed lawfully, fairly, and in a transparent manner in relation to the data subject.
    * **Purpose limitation** - Personal data must be collected for specified, explicit, and legitimate purposes, and not processed in a manner that is incompatible with those purposes
    * **Data minimization** - Personal data must be adequate, relevant, and limited to what is necessary in relation to the purposes for which they are processed.
    * **Accuracy** - Personal data must be accurate, and where necessary, kept up to date. Every reasonable step must be taken to ensure that personal data that are inaccurate, having regard to the purpose for which they are processed, are erased or rectified without delay.
    * **Storage limitation** - Data must be kept in a form that permits identification of data subjects [individuals] for no longer than is necessary for the purposes for which the personal data are processed.
    * **Integrity and confidentiality** - Data must be processed in a manner that ensures appropriate security of the personal data, including protection against unauthorized or unlawful processing an dagainst accidental loss, destruction or damage, using appropriate technical or organizational measures.
    * **Accountability** - Data Controllers shall be responsible for, and be able to demonstrate compliance with [these principles]
* Canada has privacy law most recently encapsulated in Personal Information Protection and Electronic Documents Act (PIPEDA). Statutory obligations include (descriptions elided here):
    * Accountability
    * Identifying purposes
    * Consent
    * Limiting collection, use, disclosure, retention
    * Accuracy
    * Safeguards
    * Openness
    * Individual access
    * Compliance challenges
* In 2012, the US FTC issued a report recommending orgs design and implement their own privacy programs, using best practices described in the report. Focus was on Fair Information Processing Principles.
* US Privacy Program Criteria:
    * **Notice/Awareness** - Data collectors must disclose their information practices before collecting personal information from consumers.
    * **Choice/Consent** - Consumers must be given options with respect to whether and how personal information collected from them may be used for purposes beyond those for which the information was provided.
    * **Access/Participation** - Consumers should be able to view and contest the accuracy and completeness of data collected about them.
    * **Integrity/Security** - Data collectors must take reasonable steps to assure that information collected from consumers is accurate and secure from unauthorized use.
    * **Enforcement/Redress** - The use of a reliable mechanism to impose sanctions for noncompliance with these fair information practices.

## Online Data in an Ethical Context

* Topics regarding attempts to design a codified set of principles for online ethical behaviors in the US:
    * **Ownership of data** - the right to control your personal data
    * **Right to be forgotten** - Have information about an individual removed from the web
    * **Identity** - having the right to expect one identity and a correct identity, and to opt for a private identity
    * **Freedom of speech online** - expressing opinions versus bullying, terror inciting, trolling, insulting

## Risks of Unethical Data Handling Procedures

* It is always possible to use data to misrepresent facts.
* One way to understand the implications of data handling ethics is to examine practices that are agreed to be unethical.
* Unethical practices worth considering:
    * Timing - Lying through ommission or commission about data points based on timing. Equity markets can be manipulated through 'end of day' stock trades that artificially raise a stock price at closing.
    * Misleading visualizations
    * Unclear definitions or invalid comparisons
    * Bias, including:
        * data collection to support a predefined result
        * biased use of data collected
        * hunch and search - analyst has a hunch and wants to satisfy it, but does not consider the null case
        * biased sampling methodology
        * context and culture biases
    * Transforming and integrating data - data integration has real ethical and legal risks, which intersect with fundamental data management problems, including:
        * Limited knowledge of data's origin and lineage
        * data of poor quality
        * unreliable metadata
        * no documentation of data remediation history
    * Obfuscation or redaction of data, which presents itself during:
        * Data aggregation
        * Data marking (classification for data sensitivity and release control)
        * Data masking (when only appropriate submitted data will unlock a process)
* Big data and data science techniques raise the risk of datasets being reintegrated to establish previously unavailable PII.

## Establishing an Ethical Data Culture

* "Improving an organization's ethical behavior regarding data requires a formal Organizational Change Management (OCM) process."
* Steps in that process might be:
    1. Review current state of data handling practices
    1. Identify principles, practices, and risk factors
        * Align with regulatory requirements
        * Align principles to risks
        * Support practices with controls
    1. Create an ethical data handling strategy and roadmap, with pieces including:
        * Values statements
        * Ethical data handling principles
        * Compliance framework
        * Risk assessments
        * Training and communications
        * Roadmap
        * Approach to auditing and monitoring
    1. Adopt a socially responsible ethical risk model
        * Projects using personal data must have a disciplined approach to that data usage, accounting for:
            * How they select populations for study
            * How the data will be captured
            * What activities the analytics will focus on
            * How the results will be made accessible
        * Risk models should be developed, and data professionals should be willing to take stands based on them

## Data Ethics and Governance

* Shared responsibility of data governers and legal counsel
* Should stay up to date on regulatory environment, and best practices for compliance and risk mitigation

# Chapter 3: Data Governance

## Introduction

* DG is 'the exercise of authority and control (planning, monitoring, and enforcement) over the management of data assets.'
* DG decisions should guide policies and best practices
* Scope and focus of a DG program often includes:
    * Strategy - both data strategy and DG strategy
    * Policy
    * Standards and quality
    * Oversight
    * Compliance
    * Issue Management
    * Data management projects
    * Data asset valuation
* For most orgs adopting a formal DG program requires organizational change management and executive support
* Organizational culture must learn to value data and data management

### Context Diagram for Data Governance and Stewardship

* **Business Drivers**
    * **Definition** - The exercise of authority, control, and shared decision-making (planning, monitoring, and enforcement) over the management of data assets.
    * **Goals**
        1. Enable an organization to manage its data as an asset.
        1. Define, approve, communicate, and implement principles, policies, procedures, metrics, tools, and responsibilities for data management.
        1. Monitor and guide policy compliance, data usage, and management activities.
* **Inputs to Activities**
    * Business strategies and goals
    * IT strategies and goals
    * Data management and data strategies
    * Organization policies and standards
    * Business culture assessment
    * Data maturity assessment
    * IT practices
    * Regulatory requirements
* **Suppliers to Activities**
    * Business execs
    * Data stewards
    * Data owners
    * Subject matter experts
    * Maturity assessors
    * Regulators
    * Enterprise architects
* **Participants in Activities**
    * 
