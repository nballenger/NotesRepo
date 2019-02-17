# AWS Well-Architected Cheatsheet

## Terminology

* **component** - code, config, resources that deliver against a requirement
* **workload** - set of components that together deliver biz value
* **milestones** - key changes in architecture as it evolves
* **architecture** - how components work together in a workload
* **technology portfolio** - collection of workloads in an organization

## General Design Principles

* Don't guess at capacity needs.
* Test at production scale.
* Automate to make experimentation easier.
* Allow for evolution in your architecture.
* Drive evolution with data.
* Use game days to improve.

## 'Pillars' of the framework

* **Operational Excellence**
    * Design Principles
        * Perform operations as code.
        * Annotate your documentation, build it from code.
        * Make frequent, small, reversible changes.
        * Refine your ops procedures frequently.
        * Anticipate failures with pre-mortem exercises.
        * Learn from every operational failure.
    * Best Practice Areas
        1. Prepare
            * Share goals and understanding across all teams.
            * Use that to create common standards.
            * Design workloads with insight in mind.
            * Validate that your workloads and teams are ready for prod.
            * Implement the minimum number of arch. standards for your workload.
        1. Operate
            * Define your expected outcomes, determine success metrics.
            * Identify workload metrics that inform success metrics.
            * Use your metrics to determine whether you're meeting customer needs.
            * Identify areas of improvement via metrics.
            * Communicate status of workloads through dashboards and alerts.
            * Do root cause analyses for unplanned events, unexpected impacts.
            * Communicate root causes to affected communities.
        1. Evolve
            * Dedicate work cycles to continuous improvement
            * Include feedback loops in procedures
            * Share lessons learned across teams
            * Implement CI/CD
    * Questions for evaluating practices
        * Operational Excellence
            1. Prepare
                1. How to determine priorities?
                1. How to design workload so that you can understand its state?
                1. How to reduce defects, ease remediation, improve flow to prod?
                1. How to mitigate deployment risks?
                1. How do you know you are ready to support a workload?
            1. Operate
                1. How do you understand the health of your workload?
                1. How do you understand the health of your operations?
                1. How do you manage workload and operations events?* 
            1. Evolve
                1. How do you evolve operations?
    * Key Service: CloudFormation
    * Key services by focus area:
        * Prepare: Config, Config Rules, CloudFormation
        * Operate: CloudWatch
        * Evolve: Elasticsearch
* **Security**
    * Design Principles
        * Implement a strong identity foundation
        * Enable traceability
        * Apply security at all layers
        * Automate security best practices
        * Protect data in transit and at rest
        * Keep people away from data
        * Prepare for security events
    * Best Practice Areas
        1. Identity and Access Management
        1. Detective Controls
        1. Infrastructure Protection
        1. Data Protection
        1. Incident Response
    * Questions for evaluating practices
    * Key Service
    * Key services by focus area
