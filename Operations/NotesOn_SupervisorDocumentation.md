# Notes on Supervisor Documentation

From http://supervisord.org

* It's a "client/server system that allows its users to monitor and control a number of processes on UNIX-like operating systems."
* Not meant to be run as a substitute for `init` as pid 1, instead meant to be used to control processes related to a project or a customer, and is meant to start like any other program at boot.

## Introduction

* Inspired by:
    * Convenience - starts processes as its own subprocesses and can configured to auto-restart them on a crash.
    * Accuracy - since it starts things as subprocesses it always is able to interrogate them for status
    * Delegation - if you start it as root, it can allow non privileged users to control low-port processes without giving them shell access, and gives them limited access to the machine scoped around service access
    * Process Groups - processes often need to be started/stopped in groups and in priority order. Has built in stuff for assigning priorities to processes, and grouping processes into logical groups that can start/stop as a unit
* Features:
    * Simple - INI config, lots of per-process options
    * Centralized - one place to start, stop, monitor processes, individually or in groups. Can be configured to provide local or remote CLI and web access
    * Efficient - Starts processes as subprocesses via fork/exec, subprocess don't daemonize. 
    * Extensible - has an event notification protocol that any language can use to monitor it, and an XML-RPC interface for control, and with extension points for Python devs
    * Compatible - works on most OS's except Windows
    * Proven - been around a long time
* Supervisor Components
    * `supervisord` - responsible for
        * starting child programs
