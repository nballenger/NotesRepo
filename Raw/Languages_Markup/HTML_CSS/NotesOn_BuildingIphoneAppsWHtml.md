# Notes on Building iPhone Apps with HTML, CSS, and JavaScript

By: Jonathan Stark; Publisher: O'Reilly Media, Inc.; Pub. Date: January 19, 2010

Print ISBN-13: 978-0-596-80578-4

## Chapter 1: Getting Started

* Web Apps Versus Native Apps
    * What Is a Web App? - Website optimized for iphone.
    * What is a Native App? - Installed, with access to the hardware, written in Obj-C.
    * Pros and Cons: Fast dev cycle / no hardware access.
    * Which Approach is Right for You? - Blah blah blah, use PhoneGap, offline access.

## Chapter 2: Basic iPhone Styling

* First Steps
    * Preparing a Separate iPhone Stylesheet - Use media queries.
    * Controlling the Page Scaling - Use the meta viewport tag.
* Adding the iPhone CSS - Styling stuff is all based on old versions of iOS.
* Adding the iPhone Look and Feel - Use of some specific -webkit* stuff.
* Adding Basic Behavior with jQuery

## Chapter 3: Advanced iPhone Styling

* Adding a Touch of Ajax
    * Traffic Cop - Use some JS wrapper stuff to enable ajax requests.
* Simple Bells and Whistles - Use a progress indicator.
* Roll Your Own Back Button - JS and css to make an iphone style back button in the app itself.
* Adding an Icon to the Home Screen
    * Provide an apple-touch-icon.png in the web root.
    * Refer to it with <link rel="apple-touch-icon" />
* Full Screen Mode
    * Use <meta name="apple-mobile-web-app-capable" content="yes" />
    * When launched from the web clip icon, page will load full screen,
      provided you've set up ajax links. Hitting a real link loads the
      browser chrome.
* Changing the Status Bar
    * `<meta name="apple-mobile-web-app-status-bar-style" content="black" />` to set the background color of the status bar at the top of the screen. It can also be set to black-translucent, which removes it from the document flow.
    * Changes to the status bar will only work in full screen mode.
* Providing a Custom Startup Graphic
    * Create a 320x460 png file and reference it with `<link rel="apple-touch-startup-image" href="path.png" />`

## Chapter 4: Animation
    
* With a Little Help from Our Friend
* Sliding Home
    * Will be building a five panel app.
    * Uses jQTouch, a jQuery plugin
* Adding the Dates Panel
* Adding the Date Panel
* Adding the New Entry Panel
* Adding the Settings Panel
* Putting It All Together
* Customizing jQTouch
* What You've Learned

## Chapter 5: Client-Side Data Storage

* localStorage and sessionStorage
    * localStorage data is saved after a window is closed, is available to all windows or tabs loaded from the same source.
    * sessionStorage data is stored with the window object, and is discarded when the window is closed.
    * Setting a value:
        ```
        localStorage.setItem('age',40);
        var age = localStorage.getItem('age');
        localStorage.removeItem('age');
        localStorage.clear();
        ```

    * Saving User Settings to localStorage
    * Saving the Selected Date to sessionStorage
* Client-Side Database
    * You can use relational data storage via the javascript database api.
    * Creating a Database

        var db;
        $(document).ready(function() {
            var shortName = 'Kilo';
            var version = '1.0';
            var displayName = 'Kilo';
            var maxSize = 65536;
            db = openDatabase(shortName, version, displayName, maxSize);
            db.transaction(
                function(transaction) {
                    transaction.executeSql(
                        'CREATE TABLE IF NOT EXISTS entries '+
                        '  (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ' +
                        '   date DATE NOT NULL, ' +
                        '   food TEXT NOT NULL, ' +
                        '   calories INTEGER NOT NULL );'
                    );
                }
            );
        });
           
    * Inserting Rows
        
        function createEntry() {
            var date = sessionStorage.currentDate;
            var calories = $('#calories').val();
            var food = $('#food').val();
            db.transaction(
                function(transaction) {
                    transaction.executeSql(
                        'INSERT INTO entries (date, calories, food) ' +
                        'VALUES (?, ?, ?);',
                        [date, calories, food],
                        function() {
                            refreshEntries();
                            jQT.goBack();
                        },
                        errorHandler
                    );
                }
            );
            return false;
        }

    * Error Handling

        function errorHandler(transaction, error) {
            alert("Whoops!: " + error.code);
            return true;
        }

## Chapter 6: Going Offline
    
* HTML5 has an offline application cache.
* The Basics of the Offline Application Cache
    * You create a cache manifest file, which is a text document that's sent to the client with a content type of 'cache-manifest'.
    * The manifest contains a list of files that a user's device must download and save in order to function offline.
    * Example manifest:

        CACHE MANIFEST
        index.html
        logo.jpg
        scripts/demo.js
        styles/screen.css

    * Declaration: `<html manifest="demo.manifest">`
    * .htaccess or other apache declaration: `AddType text/cache-manifest .manifest`

* Online Whitelist and Fallback Options
