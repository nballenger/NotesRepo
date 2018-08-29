# Notes on Ruby Pocket Reference, 2nd Ed.

## Useful flags to CLI interpreter

* `-c` - check syntax only
* `-d` - set $DEBUG to true
* `e 'command'` - run a one-liner
* `-rlibrary` - require lib before executing
* `-w` - turn warnings on

## Useful options to irb

* `-d` - $DEBUG true
* `-rload-module` - load module before execution
* `--tracer` - display trace for each execution of command
* `--verbose`

## Operators

* Boolean
    * `!` - NOT
    * `&&` - AND
    * `||` - OR
* Bitwise
    * `~` - complement
    * `<<` - shift-left
    * `>>` - shift-right
    * `&` - and
    * `|` - or
    * `^` - xor
* Unary
    * `+` - plus
    * `-` - minus
* Arithmetic
    * `**` - exponentiation
    * `*` - multiplication
    * `/` - division
    * `%` - modulo
    * `+` - addition
    * `-` - subtraction
* String
    * `+` - concatenation
* Equality
    * `>` - gt
    * `>=` - gte
    * `<` - lt
    * `<=` - lte
    * `<=>`, `==`, `===`  - equal
    * `!=` - not equal
* Pattern
    * `=~` - match
    * `!~` - not match
* Range
    * `..` - inclusive
    * `...` - exclusive
* Logical
    * `? :` - ternary
    * `not`, `and`, `or`
* Assignment
    * `=`, `+=`, `-=`, `*=`, `/=`, `%=`, `**=`, `<<=`, `>>=`, `&=`, `|=`, `^=`, `&&=`
* Variable def
    * `defined?` - definition and type

## Comments

* Single line starts with #
* Multiline between `=begin` and `=end`
    
