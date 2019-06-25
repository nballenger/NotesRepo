# Ruby Cheatsheet

## The Ruby Installation

* Viewing the location of Ruby install files:
    1. `irb --simple-prompt -rrbconfig`
    1. `>> RbConfig::CONFIG("bindir")`
* Key directories of the install:
    * `rubylibdir` - standard library
    * `bindir` - command line tools
    * `archdir` - architecture specific extensions and libs (binary)
    * `sitedir` - personal or third party extensions and libs
    * `vendordir` - third party extensions and libs
    * `sitelibdir` - personal extensions written in Ruby
    * `sitearchdir` - personal extensions in C

## Operators

<table>
    <tbody>
        <tr>
            <th>Mathematical</th>
            <td><code>+ - * / ** %</code></td>
        </tr>
        <tr>
            <th>Logical</th>
            <td><code>&amp;&amp; || ! and or not</code></td>
        </tr>
        <tr>
            <th>Comparison</th>
            <td><code>== != &gt; &lt; &gt;= &lt;=&gt; .eql?</code></td>
        </tr>
        <tr>
            <th>Assignment</th>
            <td><code>= += -= *= **= %= &amp;= ^= ||=</code></td>
        </tr>
        <tr>
            <th>Bitwise</th>
            <td><code>~ | &amp; ^ &lt;&lt; &gt;&gt;</code></td>
        </tr>
        <tr>
            <th>Ranges</th>
            <td><code>.. (open range) ... (closed range) === (in range test) (1..9).to_a (to array)</code></td>
        </tr>
    </tbody>
    <tfoot></tfoot>
</table>

## Data Types

### Strings

#### Instantiation

```Ruby
x = String.new
x = String.new("This is a string.")
x = "This is a string."
```

#### Quote Styles and Heredocs

```Ruby
'abc'           # Preserves escaped characters
"abc"           # Interprets escaped characters
%!abc!          # General delimited strings
%[abc]
%(abc)

x = <<end       # heredoc like double quotes
end     
x = <<"end"     # heredoc like double quotes
end        
x = <<'end'     # heredoc like single quotes
end
x = <<`end`     # heredoc like backticks
end
x = <<-end      # allows indentation
end
```

#### Concatenation

```Ruby
"a" "b" "c"
"a" + "b" + "c"
"a" << "b" << "c"
"a".concat "b"
```

#### String Access

```Ruby
x = 'abcdef'
x['cde']        # returns string if found
x[1]            # returns charcode of pos 1
x[1].chr        # returns character at pos 1
x[0..4]         # inclusive range selection
x[0...4]        # exclusive range selection
x[/cde/]        # via regex
```

#### Comparisons

```Ruby
a == b          # full equality test
a.eql? b        # full equality test
a <=> b         # compares character codes
a casecmp b     # case insensitive character comparison
```

#### String Methods

```Ruby
x.size
x.length
x.freeze        # make immutable
x.frozen?
x.index('a')
x.insert(2,'b')
x * 4           # repeats 4 times
x['abc']= 'xyz' # substitutes in place
x.chop
x.chop!
x.chomp
x.chomp!
x.delete "b"
x.gsub "abc","xyz" # substring replacement
x.replace "xyz" # replaces entire string
x.reverse
x.reverse!
x.split         # returns ['abcdef']
x.split(//)     # returns array of letters
x.capitalize
x.capitalize!
x.downcase
x.upcase
x.swapcase
x.ljust 10      # adds right padding
x.rjust 10      # adds left padding
x.ljust(20,'-') # pads with string
x.center 30     # centers
x.center 30,'-' # centers with string
x.lstrip
x.rstrip
x.strip
x.class
x.to_f          # to float
x.to_i          # to integer
x.intern        # :abcdef
x.to_sym        # :abcdef
x.grep(/abc/)   # search with Enumerable.grep

# next/succ methods increments the rightmost character
"a".next    # => "b"
"aa".succ   # => "ab"        


# splitting by lines
"A\nB\nC\nD".each { |item| puts item.capitalize }

# splitting by bytes
"ABCD".each_byte { |b| print b, "/" }
```

### Numbers

#### Operators

```Ruby
# Operators: + - * / ** %
# Unary: + -
# Named: .div .modulo .divmod .quo .remainder
#
# Integer division results in truncated Int result
# .div returns only integral part, truncates decimal part
```

#### Introspection

```Ruby
x.zero?
x.nonzero?
x.finite?
x.infinite?
x.nan?
x.inspect
```

#### Iteration

```Ruby
10.times { |i| print i, " " }
```

#### Methods

```Ruby
x.abs
x.ceil
x.floor
x.round
x.next
x.chr
```

#### Math Functions

```Ruby
Math.constants # => ["E", "PI"]
Math.exp(1) # Euler to the power of x
Math.sqrt
Math.log(Math::E) # => 1.0
Math.log(1)
```

#### Rational Numbers

```Ruby
require 'rational'
require 'mathn'

rat = Rational(25/100)

rat + Rational(1/4)
rat + 1/4

rat - Rational(1/8)
rat - 1/8

rat * 3
rat / 2

rat % Rational(1/2)

rat**2
```

#### Primes

```Ruby
require 'mathn'

prime_number = Prime.new
prime_number.next
prime_number.succ

puts "The next prime is " + prime_number.next.to_s + "."
```

### Arrays

#### Instantiation

```Ruby
x = Array.new
x = Array.new(12)
x = Array.new(12, "defaultstring")

x = Array.new(10) { |e| e = e * 2 }

x = Array.[]("a","b","c")
x = Array["a","b","c"]
x = ["a","b","c"]
x = %w[a b c]
```

#### Accessing Elements

```Ruby
x[0]
x[-1]
x[0,3]
```

#### Adding and Removing Elements

```Ruby
x.pop
x.push('a')
x.shift
x.unshift('a')

x.insert(0,'a')
x[2..4] = "a","b","c"   # range replace
x[2,2]  = "a","b","c"   # start and length replace

x.delete "a"
x.delete_at(1)
```

#### Iteration

```Ruby
x.each { |e| print e.capitalize + " " }  # performs iteration
x.map  { |e| print e.capitalize + " " }  # performs iteration, returns array
```

#### Concatenation

```Ruby
x + y
x << y
x.concat(y)
```

#### Set Operations

```Ruby
&       # intersection
-       # difference
|       # union
```

#### Array Methods

```Ruby
x.empty?
x.size
x.clear
x.slice(0,3)
x.first
x.last
x.at(0)
x.first
x.include? 'a'
x.uniq
x.uniq!
x.sort
x.sort!
x.reverse
x.flatten
x.transpose     # converts [["a", 1], ["b", 2], ["c", 3]]
                # to       [["a","b","c"], [1,2,3]]
```

### Hashes

#### Instantiation

```Ruby
x = Hash.new
x = Hash.new('defaultstring')
x = Hash.new 'defaultstring'
x = Hash[:key1, "val1", :key2, "val2"]
x = Hash[:key1 => "val1", :key2 => "val2"]
x = {"key1" => "val1", "key2" => "val2"}
```

#### Accessing Elements

```Ruby
x["key1"]

x.select { |key,val| key > 1000 } # returns elements matching block
```

#### Iteration

```Ruby
x.each { |k,v| puts "#{k}/#{v}" }
```

#### Class Conversions

```Ruby
x.to_s
x.to_a
x.to_hash
```

#### Hash Methods

```Ruby
x.empty?
x.length
x.size
x.has_key? 'a'
x.has_value? 'b'
x.keys
x.values
x.values_at 'a'
x.values_at 'a','b'
x.index 'val2'
x.sort # sorts by key
```

## Variables and Identifiers

### Identifier Family Tree

* Variables
    * Local
        * Naming: `^[_a-z]{1}[a-zA-Z0-9_]*$`
        * Convention is snake case, not camel case
    * Instance
        * Naming: initial `@`
    * Class
        * Naming: initial `@@`
    * Global
        * Naming: initial `$`, convention is all caps
* Constants - initial uppercase letter, convention camel case or all caps
* Keywords - about 40 reserved words
* Method names - named like locals, can end with `?`, `!`, `=`

## Flow Control

### Conditionals

#### if/elsif/else

```Ruby
if 1 == 1
    print "true"
end

if 1 == 1: print "true" end

print "true" if 1 == 1

if x
    y = true
else
    y = false
end

if x == 1
    y = 'a'
elsif x == 2
    y = 'b'
else
    y = 'c'
end

if    x == 1: y = 'a'
elsif x == 2: y = 'b'
else          y = 'c'
end
```

#### Ternary

```Ruby
x = x == 1 ? 'a' : 'b'
```

#### Case

```Ruby
y = case x
    when 1: 'a'
    when 2: 'b'
    else    'c'
end

z = 5
case z
    when    0: puts "lowest"
    when 1..3: puts "medium-low"
    when 4..5: puts "medium"
    when 6..7: puts "medium-high"
    when 8..9: puts "high"
    when   10: puts "highest"
    else       puts "off scale"
end
```

### Loops

#### While

```Ruby
while i < breeds.size do
    temp << breeds[i].capitalize
    i += 1
end

while i < breeds.size
    temp << breeds[i].capitalize
    i += 1
end

temp = 98.3
begin
    print "Your temp is " + temp.to_s + " Fahrenheit. "
    puts "I think you're okay."
    temp += 0.1
end while temp < 98.6

cash += 1.00, sum while cash < 1_000_000.00
```

#### Break

```Ruby
while i < breeds.size
    temp << breeds[i].capitalize
    break if temp[i] == "Arabian"
    i += 1
end
p => temp
```

#### Unless/Until

```Ruby
# Simple unless
unless lang == "de"
    dog = "dog"
else
    dog = "Hund"
end


# Inline form
puts age += 1 unless age > 29


# Like do/while
weight = 150
begin
    puts "Weight: " + weight.to_s
    weight += 5
end until weight == 200


# As statement modifier:
puts age += 1 until age > 28
```

#### Loop

```Ruby
# runs continuously until break, comes from Kernel
loop do
    print "Type something: "
    line = gets
    break if line =~ /q|Q/
    puts line
end
```

#### For

```Ruby
# simple example
for i in 1..5 do
    print i, " "
end

# alternately
for i in 1..5
    print i, " "
end

# one liner
for i in 1..5 do print i, " " end

# using 'times'
10.times { |i| print i, " " }

# using 'upto'
1.upto(10) { |i| print i, " " }

# using 'downto'
5.downto(1) { |i| print i, " " }
```

#### BEGIN and END

```Ruby
BEGIN { puts "Date and time: " + CLASSTime.now.to_s }
def bmi(w, h)
    703.00*(w.to_f/(h.to_f**2))
end

my_bmi = bmi(196,73)

puts "Your BMI is: " + x = sprintf("%0.2f", my_bmi)

END { puts "Blah blah blah." }
```

## Objects

* All data structures and values are objects.
* All objects can understand a certain set of messages.
* Messages correspond directly to methods of the object class.
* Objects are represented by either literals, or variables they are bound to.
* Typically there is 1:1 correspondence between "sending a message" and "calling a method." However, you can send any arbitrary message to an object, regardless of whether a corresponding method exists. Objects may intercept unknown messages and attempt to use them.
* Methods may take arguments, which themselves are objects.
* Parentheses are optional around arguments to a method call.
* "The whole universe of a Ruby program consists of objects and the messages that are sent to them."
* There is always a `self` defined when a program is running. The object it refers to may vary. A bareword call like `puts` is interpreted as `self.puts`.
* All objects are instances of exactly one class.

## Classes

### General Class Info

* Supports only single inheritance
* `initialize` is init method by convention
* `initialize` method is always private, executed first
* All classes can be extended by defining additional methods
* Instance variables prefixed with `@`
* Class variables prefixed with `@@`
* Modules are like classes, but cannot be instantiated
* If a class includes a module, the module methods become class methods
* If you prefix a method def in a module with the module name, it will become globally callable.
* public class members are available anywhere the class is available
* private members use the current object as their scope
* protected members can be used only by instances of the class where it was defined, or derived classes

### Class Definition

```Ruby
class Hello
    def initialize(name)
        @name = name
    end
    
    def hello
        puts "Hello, "+@name+"!"
    end
end

hi = Hello.new("Jack")
hi.hello
```

### Accessors

```Ruby
class Dog
    attr :bark, true # creates getter/setter
end

class Dog
    attr_reader :bark # creates getter
    attr_writer :bark # creates setter
end

class Gaits
    attr_accessor :walk, :trot, :canter # creates multiple getters/setters
end
```

### Definining Class Methods

```Ruby
class Area
    def Area.rect(length, width, units="inches")
        area = length*width
        printf("The area is %.2f %s.", area, units)
        sprintf("%.2f", area)
    end
end
```

### Defining a Singleton

```Ruby
# Simple example:
class Singleton
end

s = Singleton.new
def s.handle
    puts "I'm a singleton method!"
end

s.handle # "I'm a singleton method!"

# Additional definition
class Area
    class << self
        def rect(length, width, units="inches")
            area = length*width
            printf("The area is %.2f %s.", area, units)
            sprintf("%.2f", area)
        end
    end
end
```

### Inheritance

```Ruby
#!/usr/bin/env ruby

class Name
    attr_accessor :given_name, :family_name
end

class Address < Name
    attr_accessor :street, :city, :state, :country
end

a = Address.new
puts a.respond_to?(:given_name)  # true
```

### Modules

```Ruby
module Dice
    # virtual dice roll
    def roll
        r_1 = rand(6); r_2 = rand(6)
        r1 = r_1>0?r_1:1; r2 = r_2>0?r_2:6
        total = r1+r2
        printf("You rolled %d and %d (%d).\n", r1, r2, total)
        total
    end
end

class Game
    include Dice
end

g = Game.new
g.roll
```

### Protection

```Ruby
class Names
    def initialize(given, family, nick, pet)
        @given = given
        @family = family
        @nick = nick
        @pet = pet
    end
    
    # public by default
    def given
        @given
    end
    
    def family
        @family
    end
    
    # all following are private until changed
    private
    
    def nick
        @nick
    end
    
    # protected until changed
    protected
    
    def pet
        @pet
    end
end
```
