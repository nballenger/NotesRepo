# Notes on AWS Well-Architected

# Module 1: Well-Architected Framework

* Objectives: features, design principles, pillars, common uses of the framework
* Pillars:
    * Operational excellence
    * Security
    * Reliability
    * Performance Efficiency
    * Cost optimization
* Operational excellence:
    * ability to run / monitor systems to deliver biz value, and to continually improve supporting processes/procedures
    * Focus areas:
        * prepare
        * operate - use metrics to respond to events
        * Evolve - share learnings, incorporate them
* Security:
    * Ability to protect info and systems
    * Focus areas:
        * Who can do what via IAM
        * Detective controls for knowing what has been done
        * Infrastructure protection
        * Data protection
        * Incident response
* Reliability:
    * Ability to recover from failures, scale to meet demand, mitigate disruptions
    * Focus areas:
        * Foundations
        * Change management
        * Failure management
* Performance Efficiency
    * Ability to use computing resources efficienctly
    * Focus areas:
        * Selecting correct resources
        * Review resources over time
        * Monitoring usage
        * Determining trade offs to maximize usage
* Cost optimization
    * Ability to avoid unneeded costs
    * Focus areas:
        * Picking cost-effective resources
        * Matching supply and demand
        * Knowing where money is being spent
        * Optimizing usage over time
* Design principles exist at a pillar specific level
* Each pillar has questions to evaluate architecture
* Common uses of well-architected:
    * Learn to build cloud-native
    * Building a backlog
    * Use as a gating mechanism before launch
    * Comparing the maturity of different teams
    * Due diligence for acquisitions
* Key points
    * Lets the customer think cloud-natively
    * Lets them make informed decisions about cloud arch
    * The questions are a starting point, actively think through what-if scenarios

# Module 2: Operational Excellence Pillar

* Objectives: describe features, design principles, key services, best practices of the operational excellence pillar
* Ability to run/monitor systems to deliver business value, and continually improve supporting processes and procedures
* Focus areas:
    * setting up for success
    * operational processes for managing small changes
    * ability to respond to events over time
* Operational excellence in a traditional environment
    * manual changes from runbooks
    * metrics based on technology
    * batched releases due to cost of release
    * no game days because of expense
    * no time to learn, reactive responses
    * stale documentation
* In the cloud:
    * operations are via code, with business metrics built in
    * documentation can be annotated from code
    * you can make frequent, small, reversible changes
    * You can frequently refine your procedures
    * You can anticipate failure points and test for them
    * You can learn from all operational failures
* Key services:
    * CloudFormation
        * Gives you infrastructure as code, self-documentation
    * AWS Config and Config Rules
    * Areas:
        * Prepare:
            * AWS Config and Config Rules let you evaluate whether your planned infrastructure meets requirements
        * Operate:
            * CloudWatch lets you monitor the health of a workload
        * Evolve:
            * Elasticsearch lets you analyze log data and get actionable insights
* Prepare
    * Operational priorities should be clear across business units and teams
    * Design for operations is focused on architecting for runtime, mitigating risks and defects, instrumenting your workloads to understand health metrics
    * Operational readiness; evaluates the code as to whether it can support the workload, and the team for same; capture procedures in scripts and runbooks
* Prepare: Business Needs
    * Business needs to serve the customer
    * Operations serve the business needs
    * Internal and external compliance requirements inform operational priorities
    * Think about tradeoffs between operational priorities
* Operate
    * Understanding the operational health of your workload
        * define metrics for 
            * behavior of workload against expected outcomes
            * performance of components
            * executation of operations activities
        * define baselines, use metrics
    * Your metrics help you derive business insight
    * You respond to events by developing playbooks and scripted practices
* Operate: Ecent, Incident, and Problem Management
    * Define proxesses for:
        * observed events
        * events requiring intervention
        * intervention reqs that recur
    * any event where you raise an alert should have a runbook or playbook
    * runbooks should define:
        * escalation triggers
        * process for escalation
        * who owns each action
    * Users should be notified when:
        * servicxes they use are impacted
        * services return to normal
* Evolve
    * Focused on dedicated workcycles to learn from experience
    * share learning across teams
    * share created artifacts
    * feedback loops, lessons learned, cross-team reviews
    * if desired results aren't met, consider other approaches
* Evolve: Feedback loops
    * identify areas for improvement
    * feedback used to prioritize, drive improvements
    * should come from:
        * operations activities
        * customer experience
        * business and dev teams
    * evaluating feedback over time can be used to recognize improvement
* Key Points
    * Cloud operations should define runbooks and playbooks
    * Document your environments
    * Make small changes through automation
    * Monitor your workload, including business metrics
    * Exercise your responses to failures
    * Have well-defined escalation management

# Module 3: Security Pillar

* Objectives: describe features, design principles, key services, and best practices for security
* Ability to protect: info, systems, assets
* Focus areas:
    * Who can do what via access management
    * Who did what via detective controls
    * Protecting systems
    * Confidentiality and integrity of data
    * Responding to security events
* Traditional architecture:
    * surface level security at the edge
    * no consolidated logging
    * security events depend on a human starting a process or recognizing an event
    * physical data center security
    * lots of manual processes
* In the cloud:
    * strong identity foundation
    * traceable actions
    * security at all layers
    * automation of security best practices
    * protect data in transit and at rest
    * prepare for security events
* Key services: IAM
    * Lets you control access to services and resources
* Security focus areas with services:
    * Identity and Access Management
        * IAM
        * Organizations
        * MFA Token usage
        * Temporary security credentials
    * Detective Controls
        * CloudTrail
        * AWS Config
        * CloudWatch
    * Infrastructure Protection
        * VPC
        * Amazon Inspector
        * AWS Shield
        * AWS WAF
    * Data Protection
        * Macie
        * KMS
        * S3
        * EBS
        * ELB
        * RDS
    * Incident Response
        * IAM
        * CloudFormation
* Security: Identity and Access Management
    * Best practices include using IAM and role based
* Managing keys and credentials
    * Secure accounts from create time
    * Enable MFA
    * Use IAM to create users, don't use the root account
    * Protect all credentials and keys
    * Never put your access keys in code or store them insecurely
* Cognito
    * Supports multiple loging providers
    * Focus is on users and not providers
    * Helps you implement best security practices
    * Each app has temp credentials for accessing services
* Detective Controls
    * Detect / identify security events
    * support quality process, legal compliance, threat detectiion
    * Controls include:
        * Lifecycle controls to establish operational baselines
        * Internal auditing to examine existing controls
        * Automated alerting
* Automating security responses
    * Playbooks require somebody recognizing the event and starting the book
    * CloudTrail and CloudWatch events allow you to automate code execution when users perform a control plane action
* Infrastructure protection
    * enforce boundary protection
    * monitor ingress/egress
    * logging
    * monitoring and alerting
* Network and boundary protection
    * Security group is a stateful firewall, only allows network traffic you approve
    * Divide layers of the stack into subnets to control isolation
    * Use a bastion host for access
    * Implement host-based controls
* Service-specific access controls
    * Every service has access control
    * S3 for instance has
        * Access Control Lists
        * IAM policies
        * S3 access policies
            * principal element
            * NotPrincipal element for granular whitelisting
* Data protection
    * confidentiality
    * data integrity
    * Best practices:
        * encrypt data and manage keys
        * detailed logging
        * versioning 
        * storage resiliency
* Encrypting data in transit and at rest
    * use SSL/TLS connections between all services
    * KMS for S3 lets you encrypt data in buckets
    * use certificate manager and cloudfront to to SSL termination
    * All SDK calls feature encryption
* Encrypting data at rest
    * Components:
        * data to encrypt
        * method to encrypt data
        * keys
    * Protecting keys from access is critical
    * KMS gives you a managed service for key management
    * Audit and restrict key access
* Incident response
    * how processes need to be in place to respond to and mitigate security response
    * Make sure your team has an easy way to gain access
    * Give responders the right tools by bringing up cleanroom environments in cloudformation
    * do regular game days
* Templated clean rooms
    * Create a new trusted environment via cloudformation
    * Use a template to build an environment
* Key points of the security pillar:
    * protect info, systems, assets
    * keep root account creds protected
    * encrypt data at rest and in transit
    * make sure only authenticated and authorized users access resources
    * use detective controls to detect or identify a breach

# Module 4: Reliability Pillar

* Objectives: describe features, design principles, key services, and best practices for reliability
* Ability of a system to recover from failure, dynamically acquire computing resources to meet demand, and mitigate disruptions from misconfigurations or transient network issues
* Focus areas:
    * Foundations
    * Change Management
    * Failure Management
* Traditional environment for reliability
    * Rarely test actual recovery procedures
    * Manually recover from failures
    * Many single points of failure
    * Needed to guess at capacity
* In the cloud:
    * test recovery procedures
    * automatically recover from failure
    * scale horizontally to increase system capacity
    * stop guessing at capacity
    * manage change via automation
* Key service: CloudWatch
    * Monitors runtime metrics
* Foundations:
    * IAM lets you control access
    * VPC lets you protect resources
    * Trusted Advisor
    * Shield is a DDOS protection service
* Change Management:
    * CloudTrail givces audit trails
    * Config tracks configuration changes
    * CloudWatch and Auto Scaling
* Failure Management
    * CloudFormation lets you provision resources the same way
    * S3 gives you durable backups
    * Glacier gives you durable archives
    * KMS lets you integrate key management
* Reliability; Foundations
    * Foundational requirements must be met before you can have reliability
    * Things like throughput to the data center
    * You should understand physical systems and resource constraints
    * That includes the SLAs you might run into
    * You need metrics and alerting to know when you'll hit a limit
* Reliability Foundations: High Availability
    * No single point of failure
    * Use multiple AZs
    * use load balancing
    * make your software resilient
    * use redundant connectivity
* Change Management
    * Be aware of how changes affect a system
    * Monitor to quickly identify trends
* Auto scaling to match demand
* Failure Management
    * know how to become aware of failures, respond to them, and prevent them in the future
* Failure management backup and disaster recover (DR) strategy
    * Define objectives
    * Have a backup strategy
    * Test your recovery from backups
    * Periodic recovery testing
    * Automated recovery
    * Use metrics and KPIs to test system fitness
    * Do periodic reviews
* Key points
    * Ability of a system to recover from failure, acquire resources, and mitigate disruptions
    * Plan your network topology
    * Know how to manage your service limits
    * Monitor the system's behavior
    * Automate responses to demand
    * Regularly back up data

# Module 5: Performance Efficiency

* Ability to use resources efficiently to meet system requirements, maintain efficiency over changes
* Focus areas
    * Selecting resources
    * Reviewing selections over time
    * Monitoring usage
    * Considering trade offs
* Traditional environment
    * use same technology for everything
    * only local work, global resource work was too complex
    * Had to manage lots of hardware
    * Hard and expensive to experiment
* In the cloud
    * Try out new tech
    * Global work is much easier
    * You can use serverless architecture for only working on the code that adds value
    * You can experiment more
    * Tech approach can align more to your goals
* Key service: CloudWatch
    * Gives you visibility into operational health
* Selection (Compute, Storage, Database, Network)
    * Auto Scaling
    * EBS
    * S3
    * RDS
    * DynamoDB
    * VPC
    * Route53
    * DirectConnect
* Review
    * Read AWS blogs and What's New
* Monitoring
    * CloudWatch
    * Lambda
* Tradeoffs
    * CloudFront
    * Elasticache
    * Snowball
    * Read replicas in RDS
* Selection
    * Optimal server config for an architecture varies
* Appropriate resources
    * Select appropriate compute resource
    * Use a reference architecture or quick start
    * Do benchmarking and load testing
    * Check your cost/budget
    * Review monitoring and notifications for different options
* Review
    * Your architecture can change over time
* Load Testing
    * use CloudFormation to define architecture
    * Lets you bring up production scale test environments
* Monitoring
    * Use CloudWatch to monitor and send alarms
    * Use automation to work around performance issues by trigger actions via Kinesis, SQS, and Lambda
* Performance Alarms
* trade-offs
    * trade off between space (memory / storage) to reduce processing times
    * use data locality to reduce latency to customers
    * Direct Connect, Elasticache, and CloudFront can be used
    * Use test data to baseline and test new approaches
* Tradeoff: proximity and caching
    * Reduce latency between data and users
    * CDN via CloudFront
    * Database caching via Redis/memcached or RO replicas
* Key points
    * Ability to use computing resources efficiently over time
    * Selecting the appropriate resource types
    * Testing to match your workload needs
    * Monitor performance
    * Optimize the location of your resources

# Module 6: Cost Optimization

* Ability to avoid or eliminate unneeded cost or suboptimal resources
* Traditional environment
    * costs were centralized, nobody incentivized to reduce
    * Empoloy people to maintain servers
    * Pay upfront in a CAPEX intensive way
    * Cannot benefit from economy of scale
    * Spend money on data center operations
* In teh cloud
    * Adopt a consumption based model
    * Benefit from AWS's economies of scales
    * Stop spending money on physical data centers
    * Analyze and attribute expenditures
    * Use managed services instead of servers
* Key service: Cost Allocation Tags
* Cost-effective resources:
    * EC2 reserved instances, prepaid capacity
    * Spot instances
    * Amazon Cost Explorer
* Matching supply and demand
    * Auto Scaling
* Expenditure Awareness
    * Cloudwatch alarms and SNS notifications for cost overruns
* Optimizing over time
    * AWS Blog
    * Trusted Advisor
* Cost-effecgive Resources
    * Use the appropriate instances and resources for your system--use the more expensive server for 1 hour instead of the cheaper one for five
* Pricing model
    * On-demand instances pay by the hour
    * reserved instances save over on-demand
    * spot instances let you bid on unused capacity
* Managed Services
    * RDS
    * EMR
    * DynamoDB
    * Elasticache
    * CloudFront
    * CloudFormation
    * Elastic Beanstalk
    * Elasticsearch
* Match supply to demand
    * gives you lowest cost, but you need enough capacity to scale correctly
* Capacity matching demand
    * Demand based services
    * Use queues for appropriate workloads
    * Schedule stopping resources when not in use
* Expenditure Awareness
    * tag your resources
    * track project lifecycle and profile applications
    * monitor usage and spend
    * use Cost Explorer
    * there are partner tools out there
* Cost Allocation Tags
    * categorize and track costs
* Optimizing over time
    * Review your decisions against new tech offerings
* AWS Trusted Advisor
* Key points
    * Avoid or eliminate unneeded cost or suboptimal resources
    * Tag resources
    * Add or remove resources to match demand
    * Use reserved instances and prepaid capacity
    * Use Trusted Advisor
    * Use monitors and alarms
    * Be aare of new features and services
