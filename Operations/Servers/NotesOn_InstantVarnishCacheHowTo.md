# Notes on Instant Varnish Cache How-To

By Roberto Moutinho, Packt Publishing, January 2013, ISBN 9781782160403

# Chapter 1: Instant Varnish Cache How-To

* Varnish Cache is a caching reverse proxy / HTTP accelerator
* Main goal is to avoid duplicated work on repeated requests
* Example code uses Varnish Cache 3.0.3 on CentOS 6

## Varnish Cache server daemon options

* Default post-install storage method is file, declared in the startup script
* Will change that to memory based for performance reasons

