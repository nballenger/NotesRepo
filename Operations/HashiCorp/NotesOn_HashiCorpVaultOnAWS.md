# Notes on HashiCorp Vault on the AWS Cloud, Quick Start Reference Deployment

From [https://aws-quickstart.s3.amazonaws.com/quickstart-hashicorp-vault/doc/hashicorp-vault-on-the-aws-cloud.pdf](https://aws-quickstart.s3.amazonaws.com/quickstart-hashicorp-vault/doc/hashicorp-vault-on-the-aws-cloud.pdf)

# Overview

* Vault secures, stores, tightly controls access to secrets across distributed infrastructure and applications from a central location.
* Handles:
    * leasing
    * key revocation
    * key rolling
    * auditing
* Through a unified API, users can:
    * use an encrypted KV store
    * use network encryption-as-a-service
    * generate IAM and STS creds
    * generate SQL and NoSQL dataabases
    * generate X.509 certs, SSH creds, etc.
* Quick start is for users "looking for a service discovery solution, monitoring solution, or a KV store."

# Architecture

Using the default parameters this will build a single VPC, within an AWS region, which has:

* Three availability zones
* One internet gateway
* Per AZ:
    * One public subnet, containing
        * One NAT gateway with elastic IP
        * One Bastion host (AZ1 and 2) with elastic IP
    * One private subnet, containing
        * One Vault server (AZ1 and 3)
        * One Consul client
        * One Consul server
* Two autoscaling groups:
    * Consul Client (consul clients in all AZs)
    * Consul Server (consul servers in all AZs)

Quickstart has two deployment options, one for a new VPC, one for an existing VPC.

# Prerequisites

VPC and EC2.

# Deployment Steps

## 1. Prep an AWS account

1. Get an account, choose the region you want to work in
1. Create a key pair in the preferred region
1. If you have to get a service limit increase for EC2 t2.medium and m4.large instance types, if you might exceed your defaults.

## 2. Launch the quick start
