# Notes on Simplified Engineering for Architects and Builders, 7th ed.

By Harry Parker and James Ambrose, John Wiley &amp; Sons, 1989

ISBN 0-471-61806

## Introduction

### Structural Mechanics

* **mechanics** - branch of physics dealing with actions of forces on material bodies
* **statics** - branch of mechanics dealing with bodies held motionless by static equilibrium of the forces acting on them
* **dynamics** branch concerning bodies in motion or forces involved with time-dependent relationships
* When external forces act on a body, two things happen:
    1. Internal forces resist the external forces, producing **stresses** in the material of the body.
    2. The external forces produce **deformations** in the shape of the body
* **strength/mechanics of materials** - study of the properties of material bodies enabling them to resist external forces, their stresses, and their deformations
* In aggregate, these are **structural mechanics** or **structural analysis**

### Units of Measurement

* Building industry in the US still uses some imperial measures, though also some SI units
* Book attempts to use both units as much as possible.

### Computations

* Work in the book can be done with a pocket calculator
* Most engineering calculations are done with computers, so learn to program.
* Accuracy beyond three digits of precision is mostly not necessary

### Symbols

* Book uses standard less-than/greater-than symbols
* Also uses ' for feet, " for inchies
* Sigma used for summation, Delta for change

### Notation

* There is some lack of consistency in notation for structural design
* Notation for the book is as follows:
    * **_a_** - (1) Moment arm; (2) acceleration; (3) increment of an area
    * **_A_** - Gross area of a surface or cross section
    * **_b_** - with of a beam cross section
    * **_B_** - Bending coefficient
    * **_c_** - Distance from neutral axis to edge of a beam cross section
    * **_d_** - Depth of a beam cross section or overall depth (height) of a truss
    * **_D_** - (1) Diameter; (2) deflection
    * **_e_** - (1) Eccentricity (dimension of the mislocation of a load resultant from the neutral axis, centroid, or simple center of the loaded object); (2) elongation
    * **_E_** - Modulus of elasticity (ratio of unit stress to the accompanying unit strain)
    * **_f_** - Computied unit stress
    * **_F_** - (1) Force; (2) allowable unit stress
    * **_g_** - Acceleration due to gravity
    * **_G_** - Shear modulus of elasticity
    * **_h_** - Height
    * **_H_** - Horizontal component of a force
    * **_I_** - Moment of inertia (second moment of an area about an axis in the plane of the area)
    * **_J_** - Torsional (polar) moment of inertia
    * **_K_** - Effective length factor for slenderness (of a column: _KL_ / _r_)
    * **_M_** - Moment
    * **_n_** - Modular ratio (of the moduli of elasticity of two different materials)
    * **_N_** - Number of
    * **_p_** - (1) Percent; (2) unit pressure
    * **_P_** - Concentrated load (force at a point)
    * **_r_** - radius of gyration of a cross section
    * **_R_** - Radius (of a circle, etc.)
    * **_s_** - (1) Center-to-center spacing of a set of objects; (2) distance of travel (displacement) of a moving object; (3) strain or unit deformation
    * **_t_** - (1) Thickness; (2) time
    * **_T_** - (1) Temperature; (2) torsional moment
    * **_V_** - (1) Gross shear force; (2) vertical component of a force
    * **_w_** - (1) Width; (2) unit of a uniformly distributed load on a beam
    * **_W_** - (1) Gross value of a uniformly distributed load on a beam; (2) gross weight of an object
    * **Delta** - Change of
    * **Sigma** - Sum of
    * **Theta** - angle
    * **mu** - coefficient of friction
    * **phi** - angle

## Chapter 1: Force Actions

### 1.1 Forces and Stresses

* **force** - that which produces, or tends to produce, motion or a change in the motion of bodies
* **weight** - the magnitude of the force of gravity on a body
* **mass** - the amount of material in a body
* **newton** - the SI unit for measuring force
* **pound** - the US system's unit for measuring force
* **kip** - kilo-pound, 1,000 pounds
* Figure 1.1a,b: a 6400 lb. block of metal is placed on top of an 8"x8" post, which rests on masonry
    * There is no motion in the system, meaning equilibrium is achieved
    * For equilibrium, equal forces must be in opposition
    * The metal exerts 6400 lb. of downward pressure, so the resisting force offered by the wood and masonry must also be 6400 lbs.
    * That resisting force is termed "stress" on the wood
    * Stress is measured as internal force per unit area of a cross section
    * In an 8x8 cross section, each square inch has a stress equal to 6400/64 = 100 pounds per square inch (psi)
* External forces may be static or dynamic
* Internal forces are one of three types:
    * **tension** - when a force acts to length or pull apart the body on which it rests, creating tensile stresses 
    * **compression** - when a force acts on a body in a manner that tends to shorten the body or to push the parts of the body together; the stresses inside the body are compressive stresses
    * **shear** - when two parallel forces having opposite senses of direction act on a body, tending to cause one part of the body to slide past an adjacent part
* Figure 1.1c: a 1500 lb. block is suspended from a 1/2" diameter metal rod
    * The tensile force is equal to 1500 / (pi * 0.25^2), which equals 7653 psi
    *
