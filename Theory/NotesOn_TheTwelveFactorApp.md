# Notes on The Twelve-Factor App

From [https://12factor.net/](https://12factor.net/)

## Introduction 

* Methodology for building SaaS apps that:
    * Use declarative formats for setup automation
    * Have a clean contract with the underlying OS, and are portable
    * Are suitable for deployment to cloud platforms
    * Minimize divergence between dev and prod, allowing continuous deployment
    * Can scale up without significant changes to tooling, architecture, or development practices.

## Background

* Document synthesizes a lot of experience by its contributors.
* "It is a triangulation on ideal practices for app development, paying particular attention to the dynamics of the organic growth of an app over time, the dynamics of collaboration between developers working on the app's codebase, and avoiding the cost of software erosion."

## Who should read this document?

* Developers, ops people, devops people.

# The Twelve Factors

## 1. Codebase

* One codebase tracked in version control, many deploys.
* "repo" - copy of the revision tracking database
* "codebase" - any single repo or any set of repos who share a root commit
* Always a 1:1 correlation between codebase and app
    * If there are multiple codebases, it's not an app, it's a distributed system. Each component in a distributed system is an app, and each can individually comply with twelve factor.
    * Multiple apps sharing the same code is a violation of 12F. Solution is to factor shared code into libraries which can be included by a dependency manager.
* One codebase per app, but many deploys of the app.
* "deploy" - a running instance of the app
* Codebase is the same across all deploys, though different versions may be active in each deploy.

## 2. Dependencies

* A 12F app never relies on the implicit existence of system wide packages.
* All dependencies are explicitly declared via a manifest.
* It uses a dependency isolation tool during execution, to prevent any leaking in of system level dependencies.
* The full and explicit dependency spec is applied uniformly to dev and prod.
* No matter the toolchain, you must **always** use BOTH dependency declaration AND dependency isolation, one or the other is not enough.
* 12F apps do not rely on the implicit existence of system tools. If the app needs to shell out to a system tool, that tool should be vendored into the app.

## 3. Config

* "config" - everything likely to vary between deploys, including:
    * Resource handles to backing services (db, cache, etc)
    * Credentials for external services
    * Per-deploy values like canonical hostname
* Applications should NOT store config as constants in code.
* 12F requires strict separation of config from code.
* This does NOT include internal application config, which does not vary between deploys (things like `config/routes.rb` in Rails)
* Another approach is the use of config files which are exempted from version control. Better than hard coded constants, but still easy to screw up.
* 12F apps stores config in environment variables, which are easy to change between deploys without changing code, and are language and OS agnostic.
* Another aspect of config management is grouping:
    * Some apps batch config into named groups ("environments")
    * That does not scale cleanly. As more deploys are created, new environment names are required, making the app brittle.
    * In a 12F app, env vars are granular controls, each fully orthogonal to other env vars. They are never grouped as "environments," but are managed independently for each deploy. This scales smoothly to multiple deploys.

## 4. Backing services

* Treat backing services as attached resources.
* "backing service" - Any service the app consumes over the network as part of its normal operation:
    * Datastores
    * Message queue systems
    * SMTP services
    * Caching mechanisms
* Backing services are traditionally managed by the same sysadmins who deploy the app's runtime; there may also be third party services.
* The code for a 12F app makes no distinction between local and third party services. To the app, both are attached resources, accessed via a URL or other connection string or locator, based on credentials in the config.
* Switching the location or provider of any individual backing service should be possible with zero changes to the app's codebase.
* Each distinct backing service is a "resource."
* These resources are loosely coupled to the deploy they are attached to.
* Resources can be attached and detached from deploys at will, with zero code changes.

## 5. Build, release, run

* A codebase is transformed into a non-dev deploy through three stages:
    1. Build stage - converts a code repo into an executable bundle (a "build"). Using a version of the code at a specific commit, the build stage fetches vendors dependencies and compiles binaries and assets.
    1. Release stage - takes teh build produced and combines it with the deploy's current config. The resulting release contains both the build and the config, and is ready for immediate execution in the execution environment.
    1. Run stage - runs the app in the execution environment, by launching the app's processes against a selected release.
* There is strict separation between the stages. For instance, you cannot change the code at runtime, since there is no way to propagate those changes back to the build stage.
* Deployment tools typically offer release management, including roll backs.
* Every release should have a unique release id, like a timestamp or autoincremented number
* Builds are initiated whenever new code is deployed.
* Runtime execution can happen automatically in some cases, like on server reboot, or when a process crashe. Therefore, the run stage should be kept to as few moving parts as possible, since problems that prevent an app from running can cause it to break in the middle of the night.
* The build stage can be complex, since errors are always foregrounded to the dev running the deploy.

## 6. Processes

* Execute the app as one or more stateless processes
* The app executes in the execution environment as one or more processes.
* 12F processes are stateless and share-nothing. Any data that needs to persist must be stored in a stateful backing service.
* The memory space or filesystem can be used as a brief, single-transaction cache. A 12F app never assumes that anything cached in memory or on disk will be available on a future request or job.
* Asset packagers like django-assetpackager use the filesystem as a cache for compiled assets. A 12F app prefers to do this compilation during the build stage.
* Some web systems rely on "sticky sessions," which cache user session data in memory of the app's process, in the expectation that future requests from the same visitor will be routed to the same process. Sticky sessions violate 12F, and should never be used or relied upon.
* Session store data is a good candidate for a datastore with time expiration, such as memcached or redis.

## 7. Port binditn
