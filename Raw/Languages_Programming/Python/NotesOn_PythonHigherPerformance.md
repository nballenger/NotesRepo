# Notes on Python High Performance

by Gabriele Lanaro; Packt Publishing, May 2017

ISBN 9781787282896

#  Benchmarking and Profiling

* Profilers run an application and monitor function execution time
* Chapter focuses on standard `cProfile` module, and `line_profiler`
* Also looks at `memory_profiler` tool and KCacheGrind
* Benchmarks are scripts that assess total execution time

## Designing Your Application

* Don't prematurely optimize.
* Process:
    * Get it working
    * Refactor for correctness
    * Optimize for speed
* Section focuses on a particle simulator test app
* First example focuses on a system with particles rotating around a central point at various speed
* Necessary info:
    * Starting position of particles
    * Speed of particles
    * Rotation direction
* In circular motion the particles always move perpendicular to the direction connecting the particle to the center.
* Initial design is object oriented, with a Particle class
