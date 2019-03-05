# Notes on Network Security Assessment, 3rd Ed.

By Chris McNab; O'Reilly Media, Dec. 2016; ISBN 9781491910955

# Chapter 1: Introduction to Network Security Assessment

* "Defendable networks exist, but are often small, high-assurance enclaves built by organizations within the defense industrial base."
* "The networks most at risk are those with a large number of elements."
* Defender's Dilemma - a defender must ensure the integrity of an entire system, but an attacker only needs to exploit a single flaw

## Threats and Attack Surface

* "Upon understanding attack surface, you can begin to quantify risk."
* Areas of attack:
    * Client software and desktop applications
        * Susceptible to man in the middle attacks via network insecurity
    * Server software
        * Due to increasing layers of abstraction and adoption of emerging technologies
    * Web applications
        * Due to additional feature support and increasing exposure of APIs between components
        * Particularly severe class of problems via XML external entity (XXE) parsing
* Exposed Logic
    * "One way to understand attack surface within a computer system is to consider the exposed logic that exists."
    * "Attack surface is logic (usually privileged) that can be manipulated by an adversary for gain--whether revealing secrets, facilitating code execution, or inducing denial of service."
    * Targeted by network-based attackers two ways:
        * Directly via a vulnerable function within an exposed network service
        * Indirectly, such as a parser running within a client system that is provided with malicious material through MITM attack, email, messaging, or other means.

## Assessment Flavors

### Static Analysis

* Auditing application source code, server config, infra config, and architecture
* Drawback is cost as environment size grows
* Scope testing narrowly and prioritize efforts correctly
* Technical audit and review approaches include:
    * Design review
    * Configuration review
    * Static code analysis
* Other, less technical considerations:
    * Data classification and labeling
    * Review of physical environment
    * Personnel security
    * Education, training, awareness

#### Design Review

* Architecture review first involves:
    * understanding placement and config of security controls within the environment
    * evaluating the efficacy of those controls
    * where applicable, proposing changes to the architecture
* 'Common Criteria' is an international standard for computer security certification
* Seven levels of assurance, including
    * EAL1 - functionally tested
    * EAL4 - methodically designed, tested, reviewed
    * EAL7 - formally verified design and tested
* Many commerical operating systems are evaluated at EAL4

#### Configuration Review

* Lowe level audit of system components can include review of
    * infrastructure
    * server and appliance operating system configuration
    * application configuration
* NIST, NSA, DISA et al provide checklists and config guidelines for operating systems
    * NIST [National Checklist Program Repository](https://nvd.nist.gov/ncp/repository)
    * NSA [IA Guidance](https://apps.nsa.gov/iaarchive/library/ia-guidance/index.cfm)
    * IASE [Security Technical Implementation Guides](https://iase.disa.mil/stigs/Pages/index.aspx)
* Gap analysis against those standards lets you identify shortcomings in OS config

#### Static Code Analysis

* NIST and Wikipedia have lists of code analyzer tools:
    * NIST [Source Code Security Analyzers](https://samate.nist.gov/index.php/Source_Code_Security_Analyzers.html)
    * Wikipedia [List of tools for static code analysis](https://en.wikipedia.org/wiki/List_of_tools_for_static_code_analysis)
* Static code analyzers identify common flaws in software
* These tools require tuning to reduce the noise in results

### Dynamic Testing

* Exposed logic is assessed through dynamic testing of running systems, including:
    * Network infrastructure testing
    * Web application testing
    * Web service testing
    * Internet-based social engineering

#### Network Infrastructure Testing

* Scanning tools map and assess network attack surface of an environment
* Manual cycles are applied to investigate the attack surface further
* Internal testing can be done to identify vulnerabilities in OSI Layers 2 and 3

#### Web Application Testing

* Can be done in unauthenticated or authenticated ways
* Common to do authenticated testing, emulating assailants with real credentials or sessions
* Open Web Application Security Project (OWASP) Top 10 is a list of common web app flaws
* There are tools to test exposed web app logic for XSS, cross site request forgery (CSRF), command injection session management flaws, and information leak bugs.

#### Web Service Testing

* APIs are often exposed to end users, third parties, and internal application components
* REST APIs are used in many apps that take advantage of mature HTTP functionality like caching and keep alive features.
* Web service testing involves using an attack proxy to analyze and manipulate messages and content flowing between teh client and server endpoint

#### Internet-based Social Engineering

* Two effective attack scenarios:
    * Configuring an internet-based web server masquerading as a legit resource, then emailing users with material including a link to the malicious page
    * Sending malicious material that exploits things like Acrobat Reader or Excel directly to the user by email or other means, from a seemingly trusted source

## What This Book Covers

* Dynamic testing of network devices, operating systems, and exposed services in detail
* Avoids static analysis and auditing topics
* Web app testing is out of scope, as is VoIP and 802.11

# Chapter 2: Assessment Workflow and Tools
