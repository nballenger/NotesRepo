# Notes on Programming TypeScript

By Boris Cherny; O'Reilly Media, May 2019; ISBN 9781492037651

# Chapter 1: Introduction

* TypeScript introduces type safety
* Invalid ops under TypeScript:
    * Multiplying a number and a list
    * Calling a function with a list of strings when it actually needs a list of objects
    * Calling a method on an object when that method doesn't actually exist on that object
    * Importing a module that was recently moved
* JavaScript tries to make judgments about what to do instead of erroring
* That can introduce stealth bugs at runtime
* TypeScript gives you errors either during composition or at compile time

# Chapter 2: TypeScript: A 10_000 foot view

## The Compiler

* TypeScript compiles to JavaScript instead of bytecode
* Type checking occurs after AST creation, but before code emission
* Compilation:
    1. TypeScript
        1. TS source &rarr; TS AST
        1. AST checked by typechecker
        1. TS AST &rarr; JS source
    1. JavaScript
        1. JS source &rarr; JS AST
        1. AST &rarr; bytecode
        1. Bytecode eval by runtime
* JS compilers and runtimes tend to be combined into an 'engine', like V8, spidermonkey, Chakra, which makes JS appear to be an interpreted language
* When TSC compiles code from TS to JS, it doesn't look at types, so types never affect your generated output and are ONLY used for typechecking

## The Type System

* Two typical type systems:
    * Ones where you have to explicitly tell the compiler what type everything is with explicit syntax
    * Those that infer types automatically
* You can explicitly annotate types in TS, or let TS infer most of them
* Use annotations to signal your types to TS
* Example:

    ```TypeScript
    // explicit
    let a: number = 1
    let b: string = 'hello'
    let c: boolean[] = [true,false]

    // implicit
    let a = 1
    let b = 'hello'
    let c = [true,false]
    ```

* General best practice is to let TS infer types whenever possible
* TypeScript vs. JavaScript type systems
    * JS binds types dynamically, TS statically
    * JS autoconverts types, TS mostly doesn't
    * JS checks types at runtime, TS at compile time
    * JS surfaces most errors at runtime, TS surfaces most at compile time

## Code Editor Setup

* TSC is a command line program written in TypeScript, so you need node to run it
* You have to use npm to install TSC and TSLint
* `npm install --save-dev typescript tslint @types/node`
* Every TS project needs a `tsconfig.json` in the root
* Sample:

    ```JSON
    {
      "compilerOptions": {
        "lib": ["es2015"],
        "module": "commonjs",
        "outDir": "dist",
        "sourceMap": true,
        "strict": true,
        "target": "es2015"
      },
      "include": [
        "src"
      ]
    }
    ```

* Options in that file:
    * `include` - what folders to look for TS in
    * `lib` - what APIs should TSC assume exists in the runtime env?
    * `module` - what module system should TSC compile to? CommonJS, SystemJS, ES2015, etc.
    * `outDir` - what folder to put generated JS into
    * `strict` - use strict mode
    * `target` - what JS version should TSC compile to? ES3, ES5, ES2015, ES2016, etc.
* Those are only some options, the file supports a bunch.
* You can also set options from the command line args to `tsc`
* Project should also have a `tslint.json` file for TSLint config
* Generate defaults: `./node_modules/.bin/tslint --init`

## index.js

* Create `src/index.ts` with `console.log('hello')`
* Run `./node_modules/.bin/tsc`
* Run `node ./dist/index.js`

# Chapter 3: All About Types

* Type - a set of values and the things you can do with them
* TS type hierarchy

    ```
    unknown
      any -> void -> undefined, --> null
        number
            Number enums
        bigint
        boolean
        string
            String enums
        symbol
            unique symbol
        Object types
            Array types
                Tuple types
            Function types
            Constructor types
    ```

* All of those eventually lead to a `never` type

## Talking about Types

* Example of a function, `squareOf(n)` that returns `n*n`
* Clearly only meaningful for numbers
* Annotating makes the param type clear: `squareOf(n: number)`
* Without the annotation the function param isn't type constrained

## The ABCs of Types

### any

* Default type when there is no annotation and the typechecker can't figure out what the implicit type is. Avoid it if possible.
* Allows all values and all operations.
* Value behaves like it would in regular JS
* If you have to use it, use it explicitly, `let a: any = 1`
* TS is permissive by default, won't complain about infering to `any`
* To turn on complaints about `any`, enable `noImplicitAny` in `tsconfig.json`

### unknown

* If you really don't know the type ahead of time, use it instead of any
* Represents any value, but TS won't let you use it until you refine it by checking what it is
* Operations allowed are equality checks, bitwise ops, and `typeof`/`instanceof`
* Example usage:

    ```TypeScript
    let a: unknown = 30
    let b = a === 123
    let c = a + 10      // Error: Object is of type 'unknown'
    if (typeof a === 'number')
        let d = a + 10  // number
    }
    ```

* Rules
    1. TS never infers something as unknown
    1. You can compare values to values of type unknown
    1. You can't do things that assume an unknown value is of a specific type, you have to prove to TS that it really is of that type

### boolean

* Allows `true` and `false`
* Ops are equality, bitwise, and negation
* You can annotate to a specific boolean, `let e: true = true`
* Mostly you allow TS to infer boolean types

### number

* Allows integers, floats, positives, negatives, `Infinity`, `NaN`, etc.
* Operations are arithmetic and comparison

### bigint

* Allows values up to 2^53
* Ops are arithmetic and comparison

### string

* Allows all string values
* Ops are concatenate and other string ops

### symbol

* Introduced in ES2015
* Don't often come up in practice
* Alternative to string keys in objects and maps
* Can be a unique symbol, which forces use of `const`
* Examples:

    ```TypeScript
    let a = Symbol('a')
    let b: symbol = Symbol('b')
    var c = a === b
    let d = a + 'x'         /// error

    const e = Symbol('e')
    const f: unique symbol = Symbol('f')
    let g: unique symbol = Symbol('f')  // error, no use of const
    ```

### Objects

* TS can't tell the difference between simple objects and those created via `new`
* You can declare a value as an object: `let a: object = { b: 'x' }`
* Doing so raises an error if you try to access `a.b`
* TS understands only that it's an object and not null
* You can use object literal syntax: `let a = { b: 'x' }`
* You can also describe the object type inside braces:

    ```TypeScript
    let a: {b: number} = { b: 12 }
    ```

* If you used `const` in that assignment, the type would still infer `b` as a `number`, not as the literal `12`, because object literals don't lock things down that tightly, they describe shape of the thing
* If you say that an object has a property of a specific type, TS will expect that property to have that type, and expect the object to have no extraneous members.
* You can tell TS that something is optional, or that there may be additional properties:

    ```TypeScript
    let a: {
        b: number       // will have this
        c?: string      // may have this
        [key: number]: boolean  // may have any number of numeric properties
                                // that are boolean
    }
    ```

* The syntax `[key: T]: U` is an 'index signature', and is how you tell TS that the given object may contain more keys
* Read as "for this object, all keys of type T must have values of type U"
* The index signature key's type (T) must be assignable to number or string
* You can use any word for the index signature key's name:

    ```TypeScript
    let airplaneSeatingAssignments: {
        [ seatNumber: string ]: string
    } = {
        '34D': 'Bob',
        '34E': 'Alice'
    }
    ```

* There are other modifiers than `?` (optional) to use when declaring object types
* Declaring a readonly field: `let user: { readonly fname: string }`
* The empty object `{}` is a special case
* Every type except `null` and `undefined` is assignable to an empty object
* Avoid empty object types if possible

### Intermission: Type Aliases, Unions, and Intersections

* If you have a value, you can perform whatever operations its type allows
* If you have a type you can perform some operations on _that_ as well
* There are a number of type level operations, but here are some common ones
* Type Aliases
    * You can use variable declarations that declare a variable that aliases a value, and similarly you can declare a type alias that points to a type:

        ```TypeScript
        type Age = number

        type Person = {
            name: string
            age: Age
        }
        ```

    * You can only declare a type once, similar to `const` usage
    * Type aliases are block scoped
* Union and Intersection Types
    * There are special type operators to describe type unions/intersections:

        ```TypeScript
        type Cat = { name: string, purrs: boolean }
        type Dog = { name: string, barks: boolean, wags: boolean }
        type CatOrDogOrBoth = Cat | Dog
        type CatAndDog = Cat & Dog
        ```

### Arrays

* Special object type that supports things like concatenation, pushing, searching, slicing, etc.
* Generally you want to keep arrays homogeneous
* TS will implicitly type arrays initialized with hetergeneous values as a type union
* If you initialize an empty array it ends up as `any` type
* As you use that array, TS infers a type
* Once the array leaves the scope it was defined in, TS assigns it a final type that can't be further expanded

### Tuples

* Subtype of array
* Specifically for arrays of fixed length, where the values at each index have specific, known types.
* They must be explicitly typed when declared

    ```TypeScript
    let a: [number] = [1]
    let b: [string, string, number] = ['bob','bobson',1980]

    let trainFares: [number, number?][] = [
        [3.75], [8.25, 7.70], [10.50]
    ]

    // equivalent syntax:
    let moreTrainFares: ([number] | [number,number])[] = [ ... ]
    ```

* They also support rest elements, which you can use to type tuples with minimum lengths:

    ```TypeScript
    // list of strings with at least 1 element
    let friends: [string, ...string[]] = ['Sara', 'Tali', 'Chloe', 'Claire']

    // heterogeneous list
    let list: [number, boolean, ...string[]] = [1, false, 'a', 'b', 'c']
    ```

### Read-only Arrays and Tuples

* Regular arrays are mutable, but sometimes you want an immutable one that you can update to produce a new array, not changing the original
* TS has a `readonly` array type, which are just like regular arrays but can't be updated in place.
* To create one, use an explicit type annotation
* To update one, use nonmutating methods like `.concat` and `.slice`

    ```TypeScript
    let as: readonly number[] = [1, 2, 3]   // readonly number[]
    let bs: readonly number[] = as.concat(4)
    let three = bs[2]
    as[4] = 5           // ERROR
    as.push(6)          // ERROR
    ```

* TS also has longer form ways to declare readonly arrays and tuples:

    ```TypeScript
    type A = readonly string[]
    type B = ReadonlyArray<string>
    type C = Readonly<string[]>

    type D = readonly [number, string]
    type E = Readonly<[number, string]>
    ```

* Note that they're backed by regular JS arrays, which means even small updates to an array result in having to copy the original array first, which can have a performance impact at runtime. Not really a problem for small arrays, but noticeable for large ones.
* Consider another implementation, like Lee Byron's `immutable`

### null, undefined, void, and never

* JS has two values for absence: `null` and `undefined`
* TS supports those types
* The only thing of type `undefined` is the value `undefined`
* The only thing of type `null` is the value `null`
* Subtle difference between them: `undefined` is something that hasn't been defined yet, and `null` is the absence of a value.
* TS also has `void` and `never`
* They are specific, special purpose types
    * `void` is the return type of a function with no explicit return
    * `never` is the type of a function that never returns at all, like one that throws an exception or runs forever
* Examples:

    ```TypeScript
    // function that returns a number or null
    function a(x: number) {
        if (x < 10) { return x }
        return null
    }

    // function that returns undefined
    function b() {
        return undefined
    }

    // function that returns void
    function c() {
        let a = 2 + 2
        let b = a * a
    }

    // function that returns never
    function d() {
        throw TypeError('I always error')
    }

    // another non-returning function
    function e() {
        while (true) { doSomething() }
    }
    ```

* Absence types:
    * `null` - the absence of a value
    * `undefined` - variable not yet assigned a value
    * `void` - function with no return statement
    * `never` - function that never returns
* String Null Checking
    * If you set `strictNullChecks` to `false` for TSC, null is a subtype of all types execept `never`
    * That makes every type nullable, and you have to check all types to see if they're null.
    * Don't do that.

### Enums

* Way to enumerate the possible values for a type
* Unordered data structures that map keys to values
* Like objects where keys are fixed at compile time
* Two kinds: map of strings to strings, or map of strings to numbers
* Convention for enum names is UC first and singular, with UC-first key names
* TS automatically infers a numeric value, or you can set them explicitly:

    ```TypeScript
    enum Language {
        English,
        Spanish,
        Russian
    }

    enum Language {
        English = 0,
        Spanish = 1,
        Russian = 2
    }

    // value retrieval
    let myFirstLanguage = Language.Russian
    let mySecondLanguage = Language['English']

    // Splitting enum across declarations:
    enum Language {
        English = 0,
        Spanish = 1
    }

    enum Language {
        Russian = 2
    }

    // homogeneous string to string map
    enum Color { 
        Red = '#c10000',
        Blue = '#007ac1',
        Pink = 0xc10050,    // hex literal
        White = 255         // decimal literal    
    }
    ```

* You can access by value or by key, but it's not a good idea.
* Easiest way to stop that is via `const enum Language {...}` which enforces access by string literal
* Author recommends not using them though, because of bad collision behavior with other people's code.
