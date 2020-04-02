# Notes on Database Design for Mere Mortals, Third Edition

By Michael J. Hernandez, Addison-Wesley Professional, 2013

ISBN 9780133122282

# 1. The Relational Databases

# 2. Design Objectives

* Reason to care: db design is crucial to consistency, integrity, accuracy
* relational db based on set theory and first-order predicate logic
* Objectives of good design
    * DB supports both required and ad-hoc information retrieval
    * Tables are constructed properly and efficiently
    * Data integrity is imposed at field, table, and rel'n levels
    * DB supports business rules relevant to the organization
    * DB lends itself to future growth
* Benefits of good design
    * DB structure is easy to modify and maintain
    * Data is easy to modify
    * Information is easy to retrieve
    * End-user applications are easy to develop and build

## Database design methods

* Traditional methods have three phases:
    * Requirements analysis
    * Data modeling - using entity-relationship, semantic-object, object-role, or UML modeling
    * Normalization - Decomposing large tables into smaller ones to
        * eliminate redundant and duplicate data, 
        * avoid problems with CRUD operations
* Design process in this book
    * Requirements analysis
    * Simple ER diagramming
    * Doesn't incorporate traditional normalization or use normal forms, because they can be confusing
* Normalization
    * Author thought it was a pain in the ass to iterate like that
    * Questions the author had
        1. If you assume a normalized table is well designed, could you identify the specific characteristics of such a table and state those as the attributes of an ideal table structure?
        1. Could you then use that ideal table as a model for all tables?
    * Came up with a design methodology based around that
    * Feels it yields a fully normalized database if you follow it faithfully

# 3. Terminology

## Value related terms

* Data - values you store
* Information - data processed to be meaningful and useful
* Null - missing or unknown and currently unknowable

## Structure related terms

* Table/relation, made of tuples/records and attributes/fields
* Field/attribute, smallest structure in the db, characteristic (column) of the subject of the table. Subtypes:
    * Multipart/composite field - two or more distinct items in a value
    * Multivalued field - two or more instances of the same type of value
    * Calculated field - contains the result of an operation
* Record/Tuple - an instance of a relation/table--a row, basically
* View - virtual table made of fields from a query against 'base tables'. Important because:
    1. Let you work with data across multiple tables simultaneously
    1. Let you control data access
    1. Can be used to implement data integrity via validation views
* Key - special field that plays one of a couple of roles
    * Primary key - uniquely identifies each record in a table, can be composite
    * Foreign key - reference to a related primary key in another table
* Index - structure to improve data processing, unrelated to DB structure

## Relationship related terms

* Relationship - exists when you can associate records in table A with records in table B using some conditional expression
* Types of relationship
    * One to one - single record in the first table relates to zero or one records in the second table
    * One to many - one record in the first table may relate to multiple records in the second table
    * Many to many - established with a linking table
* Types of relationship participation
    * Mandatory - at least one record in table A must exist before entering records into table B (B supports A, as in A=people, B=addresses)
    * Optional - you don't need anything in A to enter into B

## Integrity related terms

* Field specification / domain - represents all elements of a field. Incorporates three types of elements:
    * General - most fundamental info about the field, like Field Name, description, parent table
    * Physical - how a field is built and represented to the user, like Data Type, Length, Display Format
    * Logical - describes values stored in the field, like Required Value, Range of Values, and Default Value
* Data Integrity - refers to validity, consistency, and accuracy of stored data
* Types of data integrity:
    * Table / entity level - Ensures there are no duplicate records in the table, and that the primary key is unique and never null
    * Field / domain level - Structure of every field is sound, that the values in each field are valid, consistent, and accurate, and that fields of the same type are consistently defined throughout the database
    * Relationship / referential integrity - ensures that the relationships between tables are sound, and that the records are synchronized whenever data is entered into, updated in, or deleted from either table.
    * Business Rules - impose restrictions or limitations on the db based on how the organization perceives and uses its data

# Part 2: Design Process

# 4. Conceptual Overview

* Create a mission statement and mission objectives fo the database
    * Statement establishes the purpose
    * Objectives represent the general tasks your users can perform
* Analyze the current database
* Create the data structures
    * Define tables and fields, establish keys, define field specs
    * Tables
        * Determine subjects tables will represent based on mission objectives
        * Establish subjects as tables, associate them with fields
        * Review each table to ensure it represents a single subject, has no duplicate fields
    * Fields
        * Refine all multipart or multivalued fields in the table so they store only a single value
        * Move or delete fields that do not represent distinct characteristics of the subject the table represents
        * Review and refined table structures by checking the field work, and ensuring each table structure is properly defined
        * Establish appropriate keys for each table, so each table as a properly defined primary key
        * Establish field specifications for each field in the database
* Determine and establish table relationships
