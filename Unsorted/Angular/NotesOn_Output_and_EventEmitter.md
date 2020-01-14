# Notes on @Output and EventEmitter in Angular

From https://dzone.com/articles/understanding-output-and-eventemitter-in-angular

* A component can emit an event using `@Output` and `EventEmitter`
* Example, file `appchild.component.ts`:

    ```
    import { Component, Input, EventEmitter, Output } from '@angular/core';

    @Component({
        selector: 'app-child',
        template: `<button class="btn btn-primary" (click)="handleclick()">Click Me</button>
    })
    export class AppChildComponent {
        handleclick() {
            console.log('clicked in child');
        }
    }
    ```

* Example, file `appcomponent.ts`:

    ```
    import { Component, OnInit } from '@angular/core';
    @Component({
        selector: 'app-root',
        template: `<app-child></app-child>`
    })
    export class AppComponent implements OnInit {
        ngOnInit() { }
    }
    ```

* `AppChildComponent` is used inside `AppComponent`
* In the above, very simple to use event binding to get the button to call the function in the component.
* However, consider executing a function of `AppComponent` on the click event of a button inside `AppChildComponent`
* You have to emit the button click event from `AppChildComponent`
* Example of emitting an event and passing a parameter to the event:

    ```
    import { Component, EventEmitter, Output } from '@angular/core';

    @Component({
        selector: 'app-child',
        template: `<button class="btn btn-primary" (click)="valueChanged()">Click me</button>`
    })
    export class AppChildComponent {
        @Output() valueChange = new EventEmitter();
        Counter = 0;

        valueChanged() {
            this.counter = this.counter += 1;
            this.valueChange.emit(this.counter);
        }
    }
    ```

* The above does the following:
    1. Creates a variable, `counter`, to pass as the param of the emitted event
    1. Creates an `EventEmitter`, `valueChange`, which will be emitted to the parent component on the click event of the button
    1. Creates a function, `valueChanged()`, which is called on the click event (and which is responsible for emitting `valueChange`)
    1. While emitting `valueChange`, the value of the counter is passed as a param
* Usage of the emitted event from the parent:

    ```
    import { Component, OnInit } from '@angular/core';
    @Component({
        selector: 'app-root',
        template: `<app-child (valueChange)='displayCounter($event)'></app-child>
    })
    export class AppComponent implements OnInit {
        ngOnInit() { }
        displayCounter(count) {
            console.log(count);
        }
    }
    ```

* Which is doing the following:
    1. Using `<app-child>` in the template
    1. In that element, using event binding to use the `valueChange` event
    1. Calling `displayCounter()` on that event occurring
    1. In `displayCounter`, printing the value of the counter passed from the child component

