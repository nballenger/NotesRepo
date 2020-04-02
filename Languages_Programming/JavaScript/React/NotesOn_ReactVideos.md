# Notes on React Videos

From https://www.youtube.com/watch?v=GW0rj4sNH2w

* All the frameworks use models of one sort or another.
* Models tend to encourage mutation.
* Better to blow away entire structure on change, to avoid mutated state
* Wants the simplicity of rerendering every change, without the overhead
* Want to minimize number of dev facing mutations
* React is highly declarative, non-mutative description of how UI should be
* No observable data binding in React, does it by declaration
* Has embeddable XML syntax, JSX
* Divs in react code are NOT dom nodes
* JSX is a very lightweight transform--the tags are transformed into React function invocations
* JSX is also optional, so you can use the invocation syntax if you want
* React about abstracting reusable code, hide implementation details
* You should be able to build custom components
* You use them like a div or span
* Attributes of the element become attributes of the js object
* React is NOT an OO framework
* There's a little bit of inheritance, but the core paradigm isn't OO
* Every component is supplied a `render` function, whose purpose is to describe the state of your component at any point in time
* YOu can refer to XML properties via `this.props.foo`
* View a react component as a transform from JSX to react code
* YOu can do any JS expression inside hte interpolation braces of a component
* As properties change, the render() output changes, and react satisfies the render function.
* React finds minimal DOM mutations to bring your state into being
* Eventually you want to build something with its own state, like a counter
* Introduces a state machine for your component
* That requires initial state, which means using `getInitialState` to set the initial state of the component
* You can refer to state inside the render function via `this.state.foo`
* To make the state changes happen, state changes are made to happen from components updating state vars, and react updating the DOM accordingly
* For flexibility, react computes a huge markup string and injects it
* Also instantiates all backing objects, and handlers
* There's a reconciliation step, which makes sure the UI is updated any time data source change
* It watches subsequent render() calls, computes the smallest DOM change necessary to fulfill
* Escape Hatches
    * integrate with existing frameworks and code
    * way to guide the diff discovery process--allow you to prune the search space.


From https://youtu.be/nYkdrAPrdcw?t=421


