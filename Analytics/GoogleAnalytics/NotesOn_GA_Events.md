# Notes on Google Analytics Events

From [https://support.google.com/analytics/answer/1033068](https://support.google.com/analytics/answer/1033068)

# About Events

* Events - user interactions with content that can be measured independently from a web-page or screen load
* Examples:
    * downloads
    * link clicks
    * form submits
    * video plays

## See Event data in reports

* In GA, go to your view, then Reports &rarr; Behavior &rarr; Events

## Anatomy of Events

* Components of an Event, which are included in an Event hit:
    * Category
    * Action
    * Label (optional but recommended)
    * Value (optional)
* Example:
    * Category: "Videos"
    * Action: "Play"
    * Label: "Baby's First Birthday"

### Category

* Name that groups objects to analyze together
* Typically used multiple times over related UI elements
* How you intend to analyze the data sets up how you record the hit
* The Event object model is flexible, but you should plan your desired reporting structure before deciding on category names
* Be very careful not to accidentally create duplicate categories via typo: "Video" and "Videos" are treated as separate

### Action

* Typically used to name the type of event or interaction you want to measure for a particular web object
* For a single "Videos" category, you could look at:
    * time the video completes load
    * Play button clicks
    * Stop button clicks
    * Pause button clicks
* The name for an action is up to you, but important to keep in mind the features of how an event action is used in reports:
    * All actions are listed independently from their parent categories (so you can segment them without having to subsegment their category)
    * A unique event is determined by a unique action name. If you use duplicate action names across categories, that can affect how unique events are calculated

### Label

* Lables give additional info for events you want to analyze, like movie titles, names of downloaded videos, etc.
* Example:
    * Category: "Downloads"
    * Action: "PDF"
    * Label: "/salesForms/orderForm1.pdf"
* There is a report for all labels you create.
* Use it as an additional reporting dimension for user interaction with page objects
* Important features of how labels are used in reports:
    * All labels are listed independently of their parent categories and actions
    * A unique event is determined in part by a unique label name

### Action and Label best practices

* Action names should be relevant to your report data
    * Using "Click" as the action name in "Downloads" and "Videos" categories lets you subsegment those categories by that action. However, if you use "Click" everywhere as the action, the usefulness of that segmentation is diminished. 
    * If you're going to use Event measurement extensively, choose action names that relate to the data categories, like "Play/Pause/Stop" for videos
* Use action names globally to either aggregate or distinguish user interaction
    * If you use "Play" and "Stop" across all videos, that's all you can aggregate/disaggregate on
    * If you use "Play - Mac" and "Play - Windows", you can further disaggregate
* Action does not always mean "action"
    * Any string can be the action
    * The actual event or action the user takes may not be what you're interested in, so you can use the Action parameter to analyse other events
    * If you wanted to analyze downloads, you could provide the doc type as the action parameter
* Unique events are incremented by unique actions
    * When a user interacts with an object tagged with a particular action name, the initial interaction is logged as a unique event for the action name. Additional interactions with the same trigger won't contribute to the unique event calculation for that action, even if the user leaves that object and starts interacting with another tagged with the same action name.
    * Example: A user interacts with the Play action from two unique video players tagged with separate categories. Top Actions report for "Play" lists that as one unique event. Each category's Action report lists one unique action (since there's one unique action/category pair).

### Value

* It's an integer, can mean whatever you want it to mean.
* Value interpreted as a number, report adds up total values baed on each event count
* Also gives you the average per category
* No negative values

### Non-Interaction Events

* Optional boolean you can send to the method that sends the Event hit
* Determines how you want bounce rate defined for pages on your site that also include event measurement
* Example: A hoem page with a video embed
    * You would want to know the bounce rate for the home page, but how to define that?
    * Is interaction with the home page video an important engagement signal?
    * If yes, you would want video interaction to be included in the bounce rate calculation, so sessions including only the home page with clicks are not calculated as bounces
    * If no, you might want a stricter calculation, in which case you want to know the percentage of sessions including only the homepage regardless of if they watch the video
* A bounce is a session containing only one interaction hit
* Setting the non-interaction param to true means a session containing a single page tagged with non-interaction events is counted as a bounce, even if the visitor also triggers the event during the session.
* Omitting the option means a single page session where the event measurement happens will NOT be counted as a bounce if the visitor triggers the event.

### Implicit Count

* Each interaction with a targeted page object is counted and associated with a given user session.
* In reports, Total Events are calculated as the total number of interactions with a targetd object.
* If one user clicks the same button on a video 5 times, the total number of events associated with the video is 5, and the number of unique events is 1.
* An event gets credit for "session with event" only if that event was the first event of a session. Unique event count may not be equal to session with event.

### Implementation Considerations

* Bounce Rate Impact
    * Bounce - a single-page session on the site
    * For GA, a bounce is a session that triggers only a single request, such as when a user comes to a single page on the site and exits without causing any other request to send to the Analytics server for that session
    * If you use Event measurement, you may notice a change in bounce rate metrics for those pages with Events, because Event measurement like page measurement is classified as an interaction request
    * Bounces mean something slightly different for event enabled pages: a single-page session that includes no user interaction on targeted events
* Events Per Session Limit
    * for `ga.js`, first 10 event hits are processed immediately, after that rate limited at 1/s, and absolute limit of 500 events per session
    * For `analytics.js` and `gtag.js`, first 20 are processed immediately, then 2/s, max 500 total
    * To stay below session limits:
        * avoid sending extremely repetitive events
        * avoid measuring mouse movement
        * avoid time-lapse mechanisms that generate high event counts

### Event-implementation best practices

* Design model for events is very flexible, can be extended behond user-triggered events
* Useful event measurement reports require careful planning:
    * Determine in advance all elements you want data for; having a sense of the overall number of events / objects to monitor will help establish your report structure that scales with an increase in the number and variety of events
    * Work with report users to plan the reports.
    * Adpot a consistent and clear naming convention. Every name you supply for categories, actions, and labels appears in the reporting interface.

### Events vs. event goals

* An event is a user interaction
* An event goal is a goal you define in GA that identifies a specific event as a conversion
