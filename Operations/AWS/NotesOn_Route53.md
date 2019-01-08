# Notes on Route53

From [https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html)

## What is R53?

* Three main functions:
    * domain registration
    * DNS routing
    * health checking
* Order of operations:
    1. Register domains
    1. Route traffic to the resources for the domain
    1. Check resource health

### How domain registration works

* Steps:
    1. Choose an available domain
    1. Register it with R53, which will make itself the DNS service for that domain by:
        * Creating a hosted zone for the domain
        * Assigning 4 name servers to the hosted zone
        * Getting the name servers and adding them to the domain
    1. AWS sends info for the domain to the registrar
    1. Registrar sends info the registry for the domain
    1. Registry stores the info about the domain and publishes WHOIS

### How traffic is routed to a website or application

* How to configure R53 for routing
    1. Registry the domain
    1. R53 creates the public hosted zone
    1. Create resource record sets in the hosted zone, which contain:
        * Name
        * Type
        * Value
    1. You can also create alias records that route traffic within AWS
* How R53 routes traffic for the domain
    1. End user initiates request
    1. Domain name request goes to DNS resolver
    1. Request goes from resolver to DNS root name server
    1. Request goes from resolver to TLD name server
    1. Request goes from resolver to R53 name server for hosted zone
    1. IP address returned to initating requestor
    1. Subsequent requests generated directly to domain target
* How R53 checks resource health
    1. You create a health check in R53, based on:
        * IP or domain name of the endpoint
        * Protocol to use for the check
        * Interval of the check
        * Failure threshold (number of times to fail before status change)
        * Optionally, a notification method for unhealthy endpoints
    1. R53 starts sending the requests
    1. If the endpoint doesn't respond to a check, R53 starts counting
        * If it reaches the failure threshold, the endpoint is unhealthy
        * If it starts responding, the count is set to 0
    1. If the endpoint is unhealthy and notification is configured, CloudWatch gets notified
    1. If notification is configured, CW triggers an alarm and uses SNS to send an alert to recipients
* Health checks can check other health checks, so you can do, for instance, a check on when 2 out of 5 servers in a group are unhealthy

### Amazon R53 Concepts

* Domain registration concepts
    * domain name 
    * domain registrar - group accredited by ICANN to process domain registrations
    * domain registry - company owning the rights to sell domains with specific TLD values
    * domain reseller - company that sells domains on behalf of a registrar; Route53 is a domain reseller for Amazon Registrar and the associate registrar, Gandi
    * TLD - can be generic TLDs or geographic TLDs
* DNS Concepts
    * alias record - internal routing record within AWS 
    * authoritative name server - name server with definitive info about one part of the DNS system; R53 name servers are the authoritative name servers for every domain that uses R53 as the DNS service
    * DNS query - request for IP matched to domain
    * DNS resolver - server, typically managed by an ISP, acting as an intermediary between user requests and DNS name servers
    * Domain Name System (DNS)
    * hosted zone - container for records, including info about routing for a domain and all its subdomains. The hosted zone has the same name as the corresponding domain
    * IP address
    * name servers - servers in the DNS system that do address translation
    * private DNS - local version of DNS that allows you to route traffic for a domain and its subdomains to EC2 instances within one or more AWS VPCs
    * DNS record - object in a hosted zone that defines routing
    * recursive name server - same as dns resolver
    * reusable delegation set - set of four authoritative name servers you can use with more than one hosted zone; by default R53 assigns a random selection of name servers to each new hosted zone--if you are doing a large number of domains, you can create a reusable delegation set and associate that with the new hosted zones. This is a programmatic operation only.
    * routing policy - setting for records determining how R53 responds to DNS queries. The following are supported:
        * simple - route traffic to a single resource performing a given function, like a web server
        * failover - used for active-passive failover
        * geolocation - used for routing based on requestor locale
        * geoproximity - used for routing based on location of resources, and optionally shifting traffic from resources in one location to another
        * latency - routing for best latency
        * multivalue answer - allows R53 to respond to queries with up to 8 healthy records selected at random
        * weighted - routes to multiple resources in proportions you specify
    * subdomain - prepended labels within a hosted zone that create subsidiary hosted zones
    * TTL - time in seconds for resolvers to cache the values for a record
* Health checking concepts
    * DNS failover - routing traffic from unhealthy resources to health ones
    * endpoint - resource that a health check is monitoring
    * health check - component that does the following:
        * Monitors whether an endpoint is healthy
        * Optionally initiates a notification process on change to unhealthy
        * Optionally configures failover to a health resource

## Integration with other services

* Logging, monitoring, tagging
    * CloudTrail - captures info about all requests sent to R53 API by your AWS account
    * CloudWatch - monitor status of health checks
    * Tag Editor - perform tag operations on R53 resources
* Routing traffic to other AWS resources
    * API gateway - route to an API Gateway
    * CloudFront - speed delivery using the CDN
    * EC2 - route to instances
    * Elastic Beanstalk 
    * Elastic Load Balancing - distribute traffic using load balancers
    * RDS
    * S3
    * VPC - route to interface endpoints
    * WorkMail

## Configuring R53 as your DNS service

### Routing traffic to your resources

1. Create a hosted zone:
    * public hosted zone - routes internet traffic to resources
    * private hosted zone - routes traffic within a VPC
1. Create records in the hosted zone

#### Routing Traffic for Subdomains

* Two big options: creating records in the hosted zone for the domain, or creating a hosted zone for the subdomain, and creating records in the new hosted zone.
* If you use a separate hosted zone to route traffic, you can use IAM permissions to restrict access to the hosted zone for the subdomain.
* Using a separate hosted zone also lets you use different DNS servies for the domain and subdomain
* If you do it that way there's a small permformance impact for the first DNS query from each DNS resolver

Creating another hosted zone to route traffic for a subdomain

* The process:
    1. Createa hosted zone for the subdomain
    1. Add records to the hosted zone for the subdomain
    1. Create an NS record for the subdomain in the hosted zone for the domain, which will delegate responsibility for the subdomain to the name servers in the new hosted zone.
* Notes about creating records in the hosted zone for the subdomain:
    * Don't create additional nameserver (NS) or start of authority (SOA) records in the subdomain's hosted zone, and don't delete existing NS/SOA records.
    * Create all records for the subdomain in the hosted zone for the subdomain
    * If the hosted zone for the domain already has records that belong in the hosted zone for the subdomain, duplicate those records in the hosted zone for the subdomain, then delete the duplicates during the last stage of setup.
* Updating the hosted zone for the domain
    * On creation of a hosted zone, R53 assigns four name servers to it
    * The NS record for a zone identifies the name servers that respond to DNS queries for the domain or subdomain
    * To start using the records in the hosted zone for the subdomain to route traffic, you create a new NS record in the hosted zone for the domain, and give it the name of the subdomain
    * For the value of the NS record, you give the names of the name servers from the hosted zone for the subdomain
    * Process for when R53 gets a DNS query from a resolver for a subdomain:
        1. Looks in the hosted zone for the domain, finds the NS record for the subdomain
        1. Gets the name servers from the NS record in the domain, returns those to the resolver
        1. Resolver resubmits the query for the subdomain to the name servers for the subdomain's hosted zone
        1. R53 responds to the query using a record from the subdomain's hosted zone
* Routing traffic for additional levels of subdomains
    * Process is essentially the same, one level down
    * "If you choose to create a separate hosted zone for the lower-level subdomain, create the NS record for the lower-level subdomain in the hosted zone for the subdomain that is one level closer to the domain name."

# Working with Hosted Zones

## Working with Public Hosted Zones

* A public hosted zone is a container that holds info about how you want to route traffic on the internet for a specific domain and its subdomains.
* You get a public hosted zone in one of two ways:
    * When you register a domain with R53, one is auto created
    * When you transfer DNS service for an existing domain to R53, you start by creating a hosted zone for it
* In both cases, you then create records in the hosted zone to specify how you want to route traffic for the domain and subdomains.

### Considerations when working with public hosted zones
