# Notes on Relational Database Normalization

## Terminology:

* **Candidate Key** 
    * For a given relation, a minimal superkey for that relation, which is a set of attributes such that:
        1. The relation does not have two distinct tuples with the same values for those attributes (meaning the set of attributes is a superkey)
        1. There is no proper subset of those attribute for which the previous condition holds, so the set is minimal
    * May also be called 'primary key', 'secondary key', or 'alternate key'
* **Prime Attributes** - consituent attributes of a candidate key
* **Non-prime Attribute** - an attribute that does not occur in any candidate key
* **Superkey**
    * Set of attributes of a relation for which it holds that in all relations assigned to that variable, there are no two distinct tuples that have the same values for the attributes in the set.
    * Since duplicate rows aren't permitted, all attributes of a relation form a trivial superkey

From https://en.wikipedia.org/wiki/Database_normalization

* Normalization reduces redundancy, improves integrity
* Entails organizing columns/attributes and tables/relations such that their dependencies are enforced by database integrity constraints.

## Objectives

* Objectives of normalization beyond 1NF as stated by Codd:
    1. Free the collection of relations from undesirable insertion, update, and deletion dependencies
    1. Reduce the need for restructuring the collection of relations as new types of data are introduced, and thus increase the life span of application programs.
    1. Make hte relational model more informative to users.
    1. Make the collection of relations neutral to the query statistics, where these statistics are liable to change as time goes by.
* When an attempt is made to modify a relation by update/insert/delete, these side effects may arise in relations not sufficiently normalized:
    * Update anomaly - same info expressed on multiple rows, so updates may result in logical inconsistencies
    * Insert anomaly - some facts cannot be recorded at all, as with a "Faculty and their courses" relation, which cannot record a new faculty member with no courses
    * Delete anomaly - under some circumstances deletion of data representing one set of facts requires deleting data representing completely different facts, as when you delete a faculty member and thereby also delete their courses.

## Normal Forms

* From least to most normalized
    * UNF - unnormalized form
    * 1NF, 2NF, 3NF
    * EKNF - elementary key normal form
    * BCNF - Boyce-Codd normal form
    * 4NF
    * ETNF - essential tuple normal form
    * 5NF
    * DKNF - domain-key normal form
    * 6NF
* Attributes of normalization at various stages
    * **1NF+:**
        * Primary key / no duplicate tuples
        * No repeating groups
        * Atomic columns / cells have single value
    * **2NF+**: No partial dependencies (values depend on the whole of every candidate key)
    * **3NF+**: No transitive dependencies (values depend only on candidate keys)
    * **EKNF+**: Every non-trivial functional dependency involves either a superkey or an elementary key's subkey
    * **BCNF+**: No redundancy from any functional dependency
    * **4NF+**: Every non-trivial, multi-value dependency has a superkey
    * **ETNF+**: A component of every explicit join dependency is a superkey
    * **5NF+**: Every non-trivial join dependency is implied by a candidate key
    * **DKNF+**: Every constraint is a consequence of domain constraints and key constraints
    * **6NF+**: Every join dependency is trival
* Simpler explanations
    * **1NF**: Values in every column must be atomic.
    * **2NF**: Every attribute not part of a key has to depend on the whole key of the table, not just part of it. Key in this instance means "that set of attributes which guarantees uniqueness." You get this for free with a unique primary key in a single column.
    * **3NF**: It's a 2NF table with no transitive dependencies. So for instance, if you had a books table with columns "genre id" and "genre name", "genre name" would be transitively dependent on "genre id", so to move to 3NF you'd need to create a separate "genre" table, and only use "genre id" as a foreign key in the books table, to remove the potentially redundant "genre name" column to a separate, non-redundant table.
    * **EKNF**: Not particularly widely used.
    * **BCNF**: A schema is in BCNF if for every dependency X &rarr; Y, one of the following is true:
        * X &rarr; Y is a trivial functional dependency (Y is a subset of X)
        * X is a superkey for the schema
