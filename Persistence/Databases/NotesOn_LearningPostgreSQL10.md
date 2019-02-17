# Notes on Learning PostgreSQL 10

By Andrey Volkov, Salahaldin Juba; Packt Publishing, Dec. 2017

ISBN 9781788392013

# Relational Databases

* CAP Theorem
    * Consistency
    * Availabilty
    * Partition tolerance
* ACID
    * Atomicity - transactions complete or roll back in their entirety
    * Consistency - db transitions from one valid state to another
    * Isolation - concurrent execution results in same state as serial
    * Durability - committed transactions can survive power loss or crashes
* BASE
    * Basically available
    * Soft state
    * Eventually consistent
* DB Types
    * KV store
    * Columnar store
    * Document
    * Graph
    * Relational
    * Object relational (user defined types and inheritance)
* SQL parts
    * DDL, data definition language, for structure
    * DML, data manipulation language, for retrieval
    * DCL, data control language, for access control
* Relational model parts
    * Relation
        * Tabular data form
        * Rows are 'tuples', have the same ordered attributes
        * Attributes have a domain, which is a type and name
    * Tuple - a finite set of ordered attributes
    * NULL - unknown and currently unknowable
    * Attribute - value with name and domain
        * Value should be atomic in formal relational model
    * Constraint - controls on data integrity, redundancy, validity
        * redundancy - no duplicate tuples in a relation
        * validity - domain constraints
        * integrity - relations in a database are linked
        * Constraint categories:
            * those inherited from relational model: domain integrity, entity integrity, referential integrity
            * semantic constraint, business rules, app specific constraints
    * Domain Integrity Constraint
        * ensures data validity
        * first determine the data type, then the check constraints
    * Entity integrity constraint
        * all tuples must be distinct within a relation

## Relational Algebra

* Formal language of the relational model
* Closed set of operations over relations (the result of each operation is a new relation)
* Operations in two groups:
    * Inherited from set theory: union, intersection, set difference, cartesian product / cross product
    * Specific to relational model: select, project, etc. Binary and unary ops.
* Primitive operators
    * SELECT - unary op with some logical predicate, produces relation consisting of tuples where the predicate holds true
    * PROJECT - unary op that slices the relation vertically, into attributes
    * CARTESIAN PRODUCT - join of all to all
    * UNION - combination of two compatible relations
    * DIFFERENCE - binary op on union compatible operands. Creates a new relation from the tuples which exist in one relation but not the other
    * RENAME - unary operation on attributes
* Also have aggregation functions like SUM, COUNT, MIN, MAX

## Select and Project operations
