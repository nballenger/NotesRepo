# Notes on Introducing InnoDB Cluster: Learning the MySQL High Availability Stack

By Charles Bell; Apress, Sept. 2018; ISBN 9781484238851

# 1. Introduction to High Availability

* Principles for achieving HA:
    * Eliminate single points of failure
    * Add recovery through redundancy
    * Implement fault tolerance
* Overview of major MySQL HA features:
    * MySQL replication - redundancy, hot standby, backup, read scaling
    * MySQL group replication - gives advanced server interactions better permitting redundancy with greater synchronization, auto failover, write scaling
    * MySQL InnoDB Cluster - built on group replication, adds additional management for ease of use in leveraging a new client for administration through an API, app failover and routing, and simplified config
    * MySQL NDB cluster, separate Oracle product that provides a HA, high-redundancy version of MySQL adapted for distributed computing using in-memory NDB storage engine (NDBCLUSTER)
