# Notes on Rails Crash Course

By Anthony Lewis; No Starch Press, Oct. 2014; ISBN 9781593275723

# 1: Ruby Fundamentals

* Dynamically typed, OO, supports imperative and functional programming
* IRB sessions are helpful, give you a REPL
* Data Types
    * 6 main types: number, string, symbol, array, hash, Boolean
* Numbers
    * Supports normal math ops
    * Single slash is integer division if you feed it ints, float if you pass it at least one float arg
    * Numeric primitives can have methods called on them, like `1.odd?`
* Strings
    * Anything in quotes is a string
    * Supports single and double quotes
    * Plus is concat, asterisk is repeat
    * string interpolation is `"something #{myvar} something"`
    * interpolation only happens inside double quotes
    * double quoted strings have escape sequences like `\n`, etc.
    * Strings have methods like `"hello".length`
* method names ending in question marks return a boolean
* method names ending in exclamation marks alter in place typically
* Symbols
    * Not a common datatype
    * Strings prefaced by a colon, no quotes
    * treated as identifiers
    * Created once, are unique
    * more memory efficient than raw strings
    * every symbol usage of the same name refers to the same memory object
* Arrays
    * primitives are brackted, items are comma separated: `[1,2,3]`
    * arrays can contain any other object type
    * zero indexed
    * access via `arrayname[idx]`
    * accessing an element outside the max returns `nil`
    * slicing is comma separated: `arrayname[1,2]`
    * arrays can be combined into new arrays with plus
    * `<<` is the push op, `arrayname << 'new last item'`
    * plus op on arrays doesn't alter existing array, just returns new
    * push op modifies array in place
* Hashes
    * kv pairs, primitives in curly braces
    * syntax: `my_hash = { :key1 => "val1", "key2" => 2 }`
    * common to use symbols as hash keys
    * element access by brackets, `my_hash[:key1]`
    * If you use barewords as keys they autoconvert to symbols
    * `keys` method gives array of keys
    * `values` method gives array of values
* Booleans
    * operators: `< > == != && ||`
    * conditional assignment operator: `x = nil; x ||= 1`
    * any expression can be evaluated as a Boolean
    * Only `nil` and `false` are false, everything else is true
* Constants
    * Variables beginning with capital letters are constants
    * all uppercase by convention
* Variables
    * assigning to a non-reserved bareword creates a variable
    * typically snake case
    * must start with letter or underscore
* Control flow
    * Conditionals

        ```Ruby
        x = 1

        if x < 10
            puts "small"
        elsif x < 20
            puts "medium"
        else
            puts "large"
        end

        unless x == 10
            puts "no"
        end

        puts "foo" unless bar.empty?
        ```

    * Iteration

        ```Ruby
        list.each do |number|
            puts number
        end

        list.each { |n| puts n }

        myhash.each do |k,v|
            puts "k: #{k}, v: #{v}"
        end
        ```

* Methods
    * Named block of reusable code
    * starts with `def`, then method name, continues till `end`
* Classes
    * BORED NOW

# Chapter 2: Rails Fundamentals

## Your First Rails Application


