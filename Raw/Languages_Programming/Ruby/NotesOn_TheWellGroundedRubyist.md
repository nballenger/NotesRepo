# Notes on The Well Grounded Rubyist, 2nd Ed

By David A. Black, Manning Publications 2014

# Part 1: Ruby Foundations

## Chapter 1: Bootstrapping Your Ruby Literacy

### 1.1.1 A Ruby syntax survival kit

* Arithmetic
    * <code>+ - * / ** %</code>
    * numbers are ints or floats
    * mixing ints and floats produces floats
* Assignment
    * <code>= += -= *= **= %= &amp;= ^= ||=</code>
* Comparison
    * <code>== != > < >= <=> .eql?</code>
* Conversion
    * <code>"100".to_i</code>
* Printing
    * <code>puts</code> or <code>print</code>
* Input gathering
    * <code>gets</code>
* Conditionals
    * if/elsif/else: <code>if x == 1 print "1" elsif x == 2 print "2" else print "no"</code>
    * ternary: <code>1 ? 'a' : 'b'</code>
    * case: <code>case x when 1: print "1" when 2..3: print "2-3" else print "no" end</code> 
* Special value objects
    * <code>true false nil</code>
* Default object
    * <code>self</code>

### 1.1.2 The Variety of Ruby Identifiers

* Identifier family tree:
    * Variables
        * Local - initial lc letter or underscore, consist of letters, digits, underscores; convention is snake_case, not camelCase
        * Instance - initial @, same charset as locals
        * Class - initial @@, same charset as locals
        * Global - initial $, most chars valid, convention is allcaps
    * Constants - initial uc letter, convention is camelcase or allcaps
    * Keywords - reserved words, about 40 of them
    * Method names - same naming conventions as locals, can end with ? ! =

### 1.1.3 Method calls, messages, and Ruby objects

* All data structures and values are objects
* All objects can understand a certain set of messages
* Messages correspond directly to methods
* Objects are represented by literals or variables to which they are bound
* Message sending occurs via the dot operator: <code>obj.method_name</code>
* Most of the time there is a 1:1 correspondence between "sending a message" and "calling a method," but you can send any arbitrary message to an object whether or not the method exists. Objects can intercept unknown messages and attempt to use them.
* Methods can take arguments, which are also objects
* Parentheses around args are optional
* "The whole universe of a Ruby program consists of objects and the messages that are sent to them."
* There is always a <code>self</code> defined when a program is running, though which object it refers to may vary. A bareword call like <code>puts</code> is interpreted as <code>self.puts</code>
* Classes are clusters of behavior and functionality; **all objects are instances of exactly one class.**

### 1.1.4 Writing and saving a simple program

### 1.1.5 Feeding the program to Ruby

### 1.1.6 Keyboard and file IO

<pre>
# From command line
print "Hello, please enter a Celsius value: "
print "The Fahrenheit equivalent is ", gets.to_i * 9 / 5 + 32, ".\n"

# From file input
num = File.read("temp.dat")
celsius = num.to_i

# To file output
fh = File.new("temp.out", "w")
fh.puts celsius
fh.close
</pre>

## 1.2 Anatomy of the Ruby Installation

* To see the location of Ruby's install files: <code>irb --simple-prompt -rrbconfig</code> and then <code>>> RbConfig::CONFIG("bindir")</code>
* Key directories:
    * <code>rubylibdir</code> - standard library
    * <code>bindir</code> - command line tools
    * <code>archdir</code> - architecture specific extensions / libs (binary)
    * <code>sitedir</code> - personal or third party extensions / libs
    * <code>vendordir</code> - third party extensions / libs
    * <code>sitelibdir</code> - personal extensions in Ruby
    * <code>sitearchdir</code> - personal extensions in C

### 1.2.1  Ruby standard library subdirectory (RbConfig::CONFIG['rubylibdir'])

### 1.2.2 The C extensions directory (archdir)

### 1.2.3 The site_ruby and vendor_ruby directories

### 1.2.4 The gems directory

* RubyGems util is a standard packaging and distribution setup
* When gems are installed, the unbundled library files end up in the gems directory
* It's not in the config data structure, but usually at the same level as site_ruby

## 1.3 Ruby Extensions and Programming Libraries

### 1.3.1 Loading external files and extensions

* Extensions and libs are brought in with <code>require</code> and <code>load</code>
* A 'library' is the actual code of a lib as well as the programming facilities that exist and can be loaded
* 'Extension' refers to any loadable add-on library, but usually means a library for Ruby written in C.
* Things called with <code>load</code> have to be in the ruby load path
* Example:
    * File <code>/tmp/master.rb</code>: <code>puts "master";load "/tmp/child.rb";puts "/master"</code>
    * File <code>/tmp/child.rb</code>: <code>puts "child"</code>

### 1.3.2 "Load"-ing a file in the default load path

* Path is a set of directories in <code>$:</code>
* You can always load a path directly via absolute path

### 1.3.3 "Require"-ing a feature

* <code>require</code> will only load one time, even with multiple calls
* "Strictly speaking you don't require a file; you require a feature."
* Require allows you to treat extensions written in ruby the same way as extensions written in C--you can call <code>.rb</code> files the same way you'd call a <code>.so</code> file.
* Require doesn't know about the current working directory, so you have to provide a dot path, or append it to <code>$:</code> via <code>$: << "."</code>
* Require is the most used means of loading external extensions and libs

### 1.3.4 require_relative

* Loads features by searching relative to teh directory **in which the file from which it is called resides**

## 1.4 Ouyt of the box ruby tools and applications

* This is the stuff in bindir
* <code>ruby</code> - the interpreter
* <code>irb</code> - interactive interpreter
* <code>rdoc</code> and <code>ri</code> - documentation tools
* <code>rake</code> - ruby make, task management util
* <code>gem</code> - ruby lib and package management util
* <code>erb</code> - templating system
* <code>testrb</code> - high level testing tool

### 1.4.1 Interpreter command-line switches

* Commonly used switches
    * <code>-c</code> - check syntax without executing
    * <code>-w</code> - give warnings during execution
    * <code>-e</code> - execute one liner in quotes
    * <code>-l</code> - print newline after every line of output
    * <code>-rfeaturename</code> - require named feature
    * <code>-v</code> - show version and execute in verbose mode
    * <code>--version</code> - show version
    * <code>-h</code> - show info about all command line switches
    
### 1.4.2 closer look at interactive interpretation with irb

### 1.4.3 ri and RDoc

* <code>ri</code> is Ruby Index
* RDoc is Ruby Documentation
* <code>ri</code> is a command line tool, the RDoc system includes the command line tool <code>rdoc</code>
* RDoc creates documentation from program comments
* Has its own markup syntax
* You can request information from <code>ri</code> via <code>ri String#upcase</code>

### 1.4.4 The rake task-management utility

* It's a make inspired task manager
* Reads and executes tasks defined in a Rakefile
* Uses ruby syntax for task definitions
* Example file, task callable with <code>rake admin:clean_tmp</code>

<pre>
namespace :admin do
    desc "Interactively delete all files in /tmp"
    task :clean_tmp do
        Dir["/tmp/*"].each do |f|
            next unless File.file?(f)
            print "Delete #{f}? "
            answer = $stdin.gets
            case answer
                when /^y/
                    File.unlink(f)
                when /^q/
                    break
            end
        end
    end
end
</pre>

### 1.4.5 Installing packages with the gem command

* Gem install can be done with <code>gem install somegemname</code>
* Files are gotten from rubygems.org, in <code>.gem</code> format
* Gem files are stored in the cache subdirectory of the gems directory
* You can install local gemfiles with <code>gem install /path/to/somegem.gem</code>
* You can remove gems with <code>uninstall</code>
* Once a gem is installed you can use it via <code>require</code>
* If you have more than one gem installed for a particular library you can force using a specific gem using the <code>gem</code> method: <code>gem "hoe", "3.8.0"</code>. No need to require if using <code>gem</code>

# Chapter 2: Objects, methods, and local variables

## 2.1 Talking to objects

### 2.1.1 Ruby and object orientation

### 2.1.2 Creating a generic object

* You can create a new generic object with <code>obj = Object.new</code>
* You can assign behavior to that object via the <code>def</code> keyword
* You can send behavior to it via the dot operator
* Example:

<pre>
obj = Object.new
def obj.talk
    puts "Hi."
end

obj.talk
</pre>

### 2.1.3 Methods that take arguments

* During method definition you can specify the parameters to the method: <code>def obj.alpha(param_a, param_b)</code>
* You can call the method with arguments in parens or not

### 2.1.4 The return value of a method

* Return value of the method is the same as the last expression evaluated during its execution
* You can also use the <code>return</code> keyword to explicitly return a value

## 2.2 Crafting an object: the behavior of a ticket

## 2.3 The innate behaviors of an object

* List innate methods with <code>puts Object.new.methods.sort</code>
* There are generic objects and basic objects
    * A generic object is created via <code>Object.new</code>
    * A basic object is created via <code>BasicObject.new</code>
    * Basic objects have only seven methods, unlike generic ones.

### 2.3.1 Identifying objects uniquely with the object_id method

* Returns a unique id for the object

### 2.3.2 Querying an object's abilities with the respond_to? method

* Returns boolean for whether object will respond to a given message name

### 2.3.3 Sending messages to objects with the send method

* Lets you do dynamic method calling.
* Example:

<pre>
ticket = Object.new

def ticket.venue
    "A Place"
end

def ticket.price
    5.50
end

print "Info desired: "
request = gets.chomp

if ticket.respond_to?(request)
    puts ticket.send(request)
else
    puts "No such info"
end
</pre>

* <code>__send__</code> is an alternative to <code>send</code> in case the <code>send</code> method gets overwritten.
* You can also use <code>public_send</code>, which can only call public methods--<code>send</code> is capable of calling private methods.

## 2.4 A Close Look at Method Arguments

### 2.4.1 Required and optional arguments

<pre>
obj = Object.new

def obj.one_arg(x)
    puts "I require one arg."
end

def obj.multi_args(*x)
    puts "Can take zero or more args into array x"
end

def two_or_more(a,b,*c)
    puts "Requires two, can take more into c array"
end
</pre>

### 2.4.2 Default values for arguments

<pre>
def default_args(a,b,c=1)
    puts "c defaults to 1"
end
</pre>

### 2.4.3 Order of parameters and arguments

* Starred parameters get values assigned to them with lowest priority
* If you put a starred param in the middle of the param list it can have unintended consequences
* Example:

<pre>
def mixed_args(a,b,*c,d)
    p a,b,c,d
end

mixed_args(1,2,3,4,5)   # a = 1, b = 2, c = [3,4], d = 5

mixed_args(1,2,3)       # a = 1, b = 2, c = [], d = 3

# Example of a method with a required arg, a default, two more required 
# from the right, and a catchall in the middle. This is stupid.

def lots_of_args(a, b=1, *c, d, e)
    p a, b, c, d, e
end
</pre>

### 2.4.4 What you can't do in argument lists

* Required arguments have the highest priority, and must occur on the left or right bounds of the parameter list
* The argument sponge (starred param) cannot be to the left of any parameters with defaults

## 2.5 Local Variables and Variable Assignment

* Variables inside method defs are scoped to that method only

### 2.5.1 Variables, objects, and references

* Variables, excepting some bound to integers, don't hold object values
* They hold a reference to a string object
* Assigning one variable to another causes a copy by reference
* Some objects are stored in variables as "immediate values"
* Immediate values include integers, symbols, and true/false/nil
* When you assign an immediate value to a variable, it holds the value, not a reference to it
* Any object that's an immediate value is always exactly the same object, no matter how many variables it gets assigned to
* Given this, ruby has no pre and post increment/decrement operators

### 2.5.2 References in variable assignment and reassignment

* Each use of an assignment operator wipes the variable

### 2.5.3 References and method arguments

<pre>
# A method that will change the object whose reference is passed in:
def change_string(str)
    str.replace("New content")
end

s = "original content"
change_string(s)        # changes s by following its reference
</pre>

* You can pass a duplicate of an object with <code>obj.dup</code>
* You can freeze an object, which locks it against changes: <code>obj.freeze</code>
* Freezing cannot be undone.
* If you duplicate a frozen object, the dupe is unfrozen
* If you do <code>frozen_obj.clone</code> you get a frozen copy
* If you freeze an array, you can still change the objects that are members of the array

### 2.5.4 Local variables and the things that look like them

* Barewords are interpreted as one of three things: a local var, a keyword, or a method call
* Here's how it resolves:
    1. Check against keywords list
    1. If there's an assignment operator to the right, it's a local variable
    1. Otherwise it's a method call

# Chapter 3: Organizing objects with classes

## 3.1 Classes and Instances

* Classes typically exist for the purpose of being instantiated
* Classes can respond to messages, since they're also objects
* <code>new</code> is a constructor
* You define a class with the <code>class</code> keyword
* Classes are named with constants, beginning with a UC letter

### 3.1.1 Instance methods

* Methods defined inside a class are instance methods available to all instances of that class
* A method on a single object is a 'singleton method'

### 3.1.2 Overriding methods

* Subsequent def statements on the same method name will override

### 3.1.3 Reopening classes

* Most classes are created in a single block
* It's possible to reopen and change a class with a subsequent <code>class</code> block using the same identifier
* It's better practice not to do that unless you really need to.

## 3.2 Instance variables and object state

* Instance variables always start with a single @
* They are only visible to the object to which they belong
* An instance var initialized in one method can be used in any other method in that class

### 3.2.1 Initializing an object with state

* If you add a method named <code>initialize</code> to a class, that method will execute every time you create a new instance of that class

## 3.3 Setter Methods

* There are specialized setter method naming conventions in ruby

### 3.3.1 The equal sign in method names

<pre>
# Appending an equal sign to a method name makes it a setter:

class Ticket
    def initialize(venue, date)
        @venue = venue
        @date = date
    end

    def price
        @price
    end

    def price=(amount)
        @price = amount
    end
end
</pre>

### 3.3.2 Syntactic sugar for assignment like methods

<pre>
# Calls can be in two formats:
ticket = Ticket.new("v","d")

ticket.price=(10.0)
ticket.price = 10.0
</pre>

### 3.3.3 Setter methods unleashed

* The behavior of setter methods isn't policed internally--they don't have to set anything at all.
* The return value of a setter is the assigned value--it behaves like an assignment expression

## 3.4 Attributes and the attr_* method family

* An attribute is a property of an object whose value can be read/set
* Attributes of ruby objects are implemented as reader/writer methods wrapped around instance variables

### 3.4.1 Automating the creation of attributes

* Rather than repetitively define getters, you can define attributes via symbols, like <code>class Ticket; attr_reader :venue, :date; end</code>
* That's actually a call to <code>self.attr_reader</code>, and the class object is the value of <code>self</code>
* There's also a <code>attr_writer</code> method
* And <code>attr_accessor</code> will do both at the same time
* <code>attr</code> is a synonym for <code>attr_accessor</code>, though you have to append <code>true</code> as the second arg to get it to create the attribute, and it can only do one at a time.

## 3.5 Inheritance and the ruby class hierarchy

* The <code><</code> symbol sets inheritance, via <code>class Child < Parent</code>

### 3.5.1 Single inheritance: one to a customer

* You only get single inheritance, which ruby gets around via modules

### 3.5.2 Object ancestry and the not-so-missing link: the Object class

* The root of the inheritance tree is <code>Object</code>

### 3.5.3 El Viejo's older brother: BasicObject

* <code>BasicObject</code> is a kind of blank slate object that <code>Object</code> inherits from
* It only has 8 methods. Don't instantiate it.

## 3.6 Classes as objects and message receivers

### 3.6.1 Creating class objects

* Every class is an instance of <code>Class</code>
* You can use the <code>class</code> keyword to create a class, or you can do <code>my_class = Class.new</code>
* That would allow <code>my_instance = my_class.new</code>
* You can create an anonymous class with instance methods like this:

<pre>
c = Class.new do
    def say_hello
        puts "Hello."
    end
end
</pre>

### 3.6.2 How class objects call methods

* objects get their methods from:
    * their class definition
    * their superclass and ancestors
    * their own store of singleton methods
* The superclass of <code>Class</code> is <code>Module</code>

### 3.6.3 A singleton method by any other name...

* If you define a class, then add a singleton method to the class object via its name, you've created a class method--one that is called directly on the class object.

### 3.6.4 When, and why, to write a class method

### 3.6.5 Class methods vs. instance methods

* It's customary when referring to ruby methods outside of code to refer to instance methods by <code>Classname#method_name</code>

## 3.7 Constants up close

### 3.7.1 Basic use of constants

* All constants start with a capital letter
* You assign to them just like variables
* Put your constant defs at the top of your class def
* You can access a constant via <code>Classname::CONSTANTNAME</code>

### 3.7.2 Reassigning vs modifying constants

* You can reassign to a constant, though it triggers a warning
* You can also make changes to the object to which a constant refers

## 3.8 Nature vs Nurture in Ruby Objects

* You can use the <code>.is_a?</code> method to determine whether something is in an object's inheritance chain

# Chapter 4: Modules and Program Organization

* Modules are bundles of methods and constants
* Modules do not have instances
* You specify that you want to add the functionality of a module to a class or object

## 4.1 Basics of Module Creation and Use

* You use the <code>module</code> keyword to start a module definition
* Modules are essentially mixins
* You use either <code>include</code> or <code>prepend</code> to pull in module functionality

<pre>
module MyMod
    def alpha
        puts "alpha"
    end
end

class MyCls
    include MyMod
end

mc = MyCls.new
mc.alpha
</pre>

## 4.2 Modules, classes, and method lookup

### 4.2.1 Illustrating the basics of method lookup

* The search path goes:
    * Does this instance have a method by this name?
    * Are there any mixins to this instance? Read from most recently mixed in.
    * Do those mixins define it?
    * Does the superclass define it?
    * Does the superclass have any mixins?
    * Do those mixins define it?

### 4.2.2 Defining the same method more than once

* There can only be one method of a given name per class or module at any time
* Method resolution via modules happens by most recently mixed in first.
* Including a module more than once has no effect.

### 4.2.3 How prepend works

* If you <code>prepend</code> a module to a class, the method resolution will look in that module BEFORE looking in the class itself.

### 4.2.4 The rules of method lookup summarized

* Resolution happens as follows:
    1. Modules prepended to its class, in reverse order of prepending
    1. Its class
    1. Modules included in its class, in reverse order of inclusion
    1. Modules prepended to its superclass
    1. Its class's superclass
    1. Modules included in its superclass
    1. Repeat, up to <code>Object</code>, its mixin <code>Kernel</code>, and <code>BasicObject</code>

### 4.2.5 Going up the method search path with super

* Within a method def, you can use <code>super</code> to jump up to the next-highest definition of the method
* The super keyword handles arguments as follows:
    * Called with no args, it automatically forwards the args passed in to the method it's been called from
    * Called with an empty arg list (<code>super()</code>), it sends no arguments
    * Called with specific args, it sends exactly those

## 4.3 The method_missing method

* <code>Kernel</code> provides <code>method_missing</code>, which executes when an object receives a message it doesn't have a response for
* To intercept calls to missing methods, you override <code>method_missing</code>, either as a singleton or in the class or its ancestors
* You need to match the method signature of the original with <code>*args</code>

### 4.3.1 Combining method_missing and super

<pre>
# Typical pattern for either making a call or passing upward to the original

class Student
    def method_missing(m, *args)
        if m.to_s.start_with?("grade_for_")
            # return appropriate grade based on parsing method name
        else
            super
        end
    end
end
</pre>

## 4.4 Class/module design and naming

### 4.4.1 Mix ins and/or inheritance

* Considerations to keep in mind for class vs module decisions:
    * Modules don't have instances. Class names are usually nouns, modules are often adjectives--<code>Stack</code> vs. <code>Stacklike</code>
    * A class can have only one superclass, but mix in as many modules as you want

### 4.4.2 Nesting modules and classes

* You can nest a class definition inside a module definition
* You instantiate with <code>Modulename::Classname.new</code>

# Chapter 5: The default object, scope, and visibility

* If you know what scope you're in and what <code>self</code> resolves to, you'll be able to tell what's going on

## 5.1 Understanding self, the current/default object

### 5.1.1 Who gets to be self, and where

* There is always one and only one current object
* The resolution rules for self are:
    * In the top level of the program, <code>main</code> is <code>self</code>
    * Within a class definition, the class object is <code>self</code>
    * Within a module definition, the module object is <code>self</code>
    * Within a method definition:
        * that is in the top level, <code>self</code> is whatever object is <code>self</code> when the method is called
        * that is an instance method def in a class, <code>self</code> is an instance of that class
        * that is an instance-method def in a module, <code>self</code> is eitehr an individual object extended by that module, or an instance of a class that mixes in that module
        * that is a singleton method on an object, <code>self</code> refers to that object
* Code that provides examples:

<pre>
puts "Top level"
puts "self is #{self}"          # self is main

class C
    puts "Class def block"
    puts "self is #{self}"      # self is the class object

    def self.x
        puts "Class method"
        puts "self is #{self}"  # self is the class object in a class method
    end

    def m
        puts "Instance method"
        puts "self is #{self}"  # self is the instance
    end
end
</pre>

## 5.2 Determining scope

### 5.2.1 Global scope and global variables

* Don't use 'em.

### 5.2.2 Local scope

* Rules of where local scopes begin and end:
    * The top level has its own local scope
    * Every class or module def block has its own local scope
    * Every def block has its own local scope--every call to a method generates a new local scope, with all local vars reset to an undefined state

### 5.2.3 The interaction between local scope and selfff
