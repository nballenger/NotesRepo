# Notes on AWS Well-Architected Framework

From [https://d1.awsstatic.com/whitepapers/architecture/AWS_Well-Architected_Framework.pdf](https://d1.awsstatic.com/whitepapers/architecture/AWS_Well-Architected_Framework.pdf)

## Introduction

### Definitions

Pillars of the framework:

* Operational Excellence
* Security
* Reliability
* Performance Efficiency
* Cost Optimization

Terminology:

* `component` - code, configuration, and AWS resources that deliver against a requirement. Often the unit of technical ownership; decoupled from other components.
* `workload` - a set of components that together deliver business value
* `milestones` - key changes in an architecture as it evolves
* `architecture` - how components work together in a workload
* `technology portfolio` - collection of workloads required for business operations

### On Architecture

* On-premises environments typically have a central architecture team that overlays other teams to define best practices
* At AWS, prefer to distribute capabilities into teams instead of centralizing
* That incurs risk, which is mitigated in two ways:
    * Practices - focus on enabling each team to have decision making ability
    * Mechanisms - automated checks to ensure standards are being met
* Expectation is that every team can create architectures, follow best practices
* Principal engineering responsible for defining and publicizing best practices

### General Design Principles

* **Stop guessing capacity needs** - use what you need at the time you need it, because cloud resources are scalable
* **Test systems at production scale** - since environments are available on demand, you can test at production scale without committing to long term resources
* **Automate to make architectural experimentation easier**
* **Allow for evolutionary architectures** - automation and scaled testing on demand lowers the risk of impact for architectural changes
* **Drive architectures using data** - metrics + analytics == good design choices
* **Improve through game days** - regularly schedule game days to simulate production events

## The Five Pillars of the Framework

### Operational Excellence

This includes the ability to run and monitor systems to deliver business value, and to continually improve supporting processes and procedures.

#### Design Principles

* **Perform operations as code** - define your entire workload (app+infra) as code
* **Annotate documentation** - automate the creation of annotated documentation that builds with the code; use annotations as input to your operations code
* **Make frequent, small, reversible changes** - Design workloads to allow components to be updated regularly
* **Refine operations procedures frequently**
* **Anticipate failure** - do pre-mortem exercises to identify potential failure sources, and mitigate or remove them
* **Learn from all operational failures**

#### Definition

Three best practice areas for Operational Excellence:

1. Prepare
1. Operate
1. Evolve

Ops teams need to:

* Understand business and customer needs
* Create and use procedures to respond to operational events
* Validate the effectiveness of operational events to support biz needs
* Collect metrics to measure achievement of outcomes

#### Best Practices

**Prepare**

* Share goals and understanding across business, development, and operations
* Create common standards
* Design with mechanisms for monitoring and insight
* Create mechanisms to validate that workloads / changesets are ready to move to prod
* Validate that there are trained people to support the workload
* Practice responses in supported environments via failure injections
* Using CloudFormation lets you work in consistent, templated, sandbox dev
* Metrics data can be collected through CloudWatch, CloudTrail, and VPC Flow Logs
* Use `collectd` or CloudWatch Logs to aggregate info

Questions focusing on considerations for operational excellence:

1. How do you determine what your priorities are? _Have shared goals in order to set priorities._
1. How do you design your workload so you can understand its state? _Design to get the internal state via metrics, logs, and traces across all components._
1. How do you reduce defects, ease remediation, and improve flow into production? _Use approaches that enable refactoring, fast feedback on quality, and bug fixing._
1. How do you mitigate deployment risks? _Get fast feedback on quality, have systems for rapid recovery from bad changesets._
1. How do you know that you are ready to support a workload? _Evaluate operational readiness of your workload, processes and procedures, and personnel._

**Operate**
