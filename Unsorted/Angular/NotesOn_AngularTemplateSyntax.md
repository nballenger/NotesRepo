# Notes on Angular Template Syntax

From [https://angular.io/guide/template-syntax](https://angular.io/guide/template-syntax)

* "In Angular, the component plays the part of the controller/viewmodel, and the template represents the view."

## HTML in templates
* Almost all HTML syntax is valid template syntax
* The `<script>` element is forbidden to avoid script injection attacks
* Typically `<html>`, `<body>`, and `<base>` aren't useful
* You can extend the HTML vocabulary of templates with components and directives, which will show up as new elements/attributes

## Interpolation and Template Expressions

* By default, interpolation is inside double braces, `{{ ... }}`
* Internals of braces are
    * component property name - replaced with string value of corresponding component property
        * Example: `<img src="{{itemImageUrl}}">`
    * template expression - evaluated, then converted to a string
        * Example: `<p>sum of 1 + 1 is {{1 + 1}}</p>`
        * Expressions may invoke methods of the host component
        * All expressions are evaluated, converted to strings, linked to neighboring literals. Then the composite interpolated result is assigned to an element or directive property.
* Template Expressions
    * In double braces, produces a value which is assigned to a property of a binding target
    * The binding target can ban an HTML element, a component, or a directive
    * In a property binding, appears as `[property]="expression"`
    * Template expressions are similar to JS, but you can't use JS expressions that have or promote side effects:
        * Assignment operators
        * `new`, `typeof`, `instanceof`, or similar
        * Chained expressions with `;` or `,`
        * Increment and decrement
        * Some ES2015+ operators
    * Also no support for bitwise operators
    * Has 'template expression operators,' `|`, `?`, and `!`
* Expression context
    * Typically the component instance
    * A bareword inside double braces is assumed to be a component property
    * Expressions may also refer to properties of the template's context like a template input variable
        * Example: `<li *ngFor="let customer of customers">{{customer.name}}</li>`
        * Example: `<input #customerInput>{{customerInput.value}}`
    * Context for terms in an expression is a mix of (in precedence order)
        * template variables
        * the directive's context object (if one exists)
        * the component's members
* Expression Guidelines
    * Simplicity - Best practice is to avoid complex template expressions. Mostly do property names and method calls, keep app/business logic in the component
    * Quick execution - Template expressions get executed after every change detection cycle. Detection cycles are triggered by a number of async operations. Slow expression eval can slow everything down.
    * No visible side effects - template expressions should not change any application state other than the value of the target property. You should never be concerned that reading a component value might change some other displayed value--view should be stable throughout a rendering pass.

## Template Statements

* A statement responds to an event raised by a binding target (element, component, directive)
* Appearance is `(event)="statement"`
* Example: `<button (click)="deleteHero()">Delete Hero</button>`
* A template statement has a side effect--it's how you update app state from user actions.
* Responding to events is when Angular allows changes
* The statements use a language that looks like JS
* It's different from the expression parser
* Supports basic assignment via `=` and chained expressions via `;` and `,`
* Disallowed JS syntax:
    * `new`
    * increment and decrement
    * operator assignment like `+=`
    * bitwise operators
    * template expression operators
* Statement Context
    * Can only refer to what's in context, like an event handling method of the component instance
    * Statement context is typically the component instance
    * Can also refer to properties of the template's own context
    * Example, where `$event`, `hero`, and `#heroForm` are from the template context:

        ```
        <button (click)="onSave($event)">Save</button>
        <button *ngFor="let hero of heroes" (click)="deleteHero(hero)">{{hero.name}}</button>
        <form #heroForm (ngSubmit)="onSubmit(heroForm)">
        ...
        </form>
        ```

    * Template context names take precedence over component context names
* Statement Guidelines
    * Template statements can't refer to anything in the global namespace.
    * No `window`, `document`, `console`, `Math`, etc.
    * Avoid complex template statements. Method calls and property names.

## Binding Syntax: an overview

* Mechanism for coordinating what users see with app data values

