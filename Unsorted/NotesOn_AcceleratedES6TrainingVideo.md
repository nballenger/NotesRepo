# Notes on video: Accelerated ES6 Training

## Syntax changes and additions

### Let and block scope

* `let` and `const` are new keywords
* `let` replaces `var`, but enforces block scope

    ```JavaScript
    if (true) {
        let age = 10;
    }
    console.log(age);   // errors, as age is scoped to if block
    ```

### Constants with const

* `const` makes a scalar variable immutable, errors on reassignment
* Arrays and objects are reference types, so a const array or object makes the point immutable, but the array/object itself is mutable

### Hoisting in ES6

* Old style allows `var` statements after assignments
* With `let` or `const`, you MUST declare variables before initialization

### Fat Arrow Functions

```JavaScript
function fn_one() {
    console.log('one');
}

let fn_two = () => {
    console.log('two');
};

let fn_three = () => console.log('three');

let fn_four = () => 'four'

console.log(fn_four());
```

* You have to use the empty parens if you don't pass args
* Kind of like a lambda, but you can do multilines
* If you have one argument, you can omit the parens. God that's dumb.

### Fat Arrow Functions and 'this'

* The fat arrow function keeps its context, so it will always refer to the objects it had at the time it was defined

    ```JavaScript
    var button1 = document.querySelector('#button1');
    function normal_fn() { console.log(this); }
    button1.addEventListener('click', normal_fn); // logs caller (button) obj

    var button2 = document.querySelector('#button2');
    var fat_fn = () => console.log(this);
    button1.addEventListener('click', fat_fn);  // logs window obj
    ```

### Functions and default parameters

```JavaScript
function isEqualTo(number, compare = 10) {
    return number == compare;
}

console.log(isEqualTo(10)); // prints true
```

* Params with defaults should come last.
* YOur default can be an expression, and those expressions may involve the other parameters, or variables outside the function
* You can only reference params from earlier in the parameter list.

### Object Literal Extensions

```
let obj = { 
    name: 'Abe',
    age: 20
};

let alpha = 'apple';
let bravo = 'banana';

let obj2 = { alpha, bravo }; // evaluates to { alpha: "apple", bravo: "banana"}
```


