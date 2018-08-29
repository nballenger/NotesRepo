# Notes on Practical Docker with Python: Build, Release and Distribute your Python App with Docker

By Sathyajith Bhat; Apress, July 2018; ISBN 9781484237847

# 1. Introduction to Containerization

## Understanding Problems that Docker Solves

* Docker abstracts the underlying OS
* You build a container with application code and dependencies and ship it to run
* Versions app dependencies and shit.

## Knowing the difference between containers and virtual machines

* Docker only isolates a process or group of processes
* All containers run on the same host system
* The isolation is applied at the kernel level, so you pay less in overhead than virtual machines
* When you spin up a container, the process(es) run on the same host, without virtualizing or emulating anything

# 2. Docker 101


