Assists with button animations. Add data attributes to your button and pressMe.js will add/remove classes on a configurable timeline when your button is clicked.

## Example Usage (without timeline)

```html
<button id="button1" data-pressme_class_prefix="foo">Press Me</button>
```
```javascript
var button1 = document.getElementById("button1");
var button1PressMe = pressMe(button1);
```
## Example Usage (with timeline)

```html
<button id="button1" data-pressme_class_prefix="foo" 
data-pressme_timeline="0-400,200-800,700-1000">Press Me</button>
```
```javascript
var button1 = document.getElementById("button1");
var button1PressMe = pressMe(button1);
```

## Example Usage (with timeline and waits for callback)

```html
<button id="button1" data-pressme_class_prefix="foo" 
data-pressme_timeline="0-400,200-800,wait,0-300,300-700" data-pressme_waiting_text="Loading">Press Me</button>
```
```javascript
var button1 = document.getElementById("button1");
var button1PressMe = pressMe(button1);

// simulating something you need to wait for
button1.addEventListener("click", button3ClickHandler);
function button3ClickHandler() {
    setTimeout(function () {
        button1PressMe.stopWaiting(); // continue the timeline
    }, 8000);
}
```

## Example Usage (adding child divs)

```html
<button id="button1" data-pressme_class_prefix="foo" data-pressme_add_child_divs="3" data-pressme_do_child_pos_fx="true">Press Me</button>
```

## Setup
Add attribute(s) to your button. At a minimum, add the attribute "data-pressme_class_prefix".
```html
<button id="button1" data-pressme_class_prefix="foo">Press Me</button>
```

Add the pressMe.js script to your webpage.
```javascript
    <script src="path/to/pressMe.js"></script>
```
For each button, invoke the pressMe function. The only parameter passed to the pressMe function should be the DOM element corresponding to the button.
```javascript
var button1 = document.getElementById("button1");
var button1PressMe = pressMe(button1);
```

## How it Works

Add data-pressme attributes to your button.

When your button is clicked, a class of [data-pressme_class_prefix value]-click-response. Each time your button is clicked, that class is removed, then added allowing for repeat animations. 

 In order to create the animations, please write your own CSS based off of the class prefix value you specified.

There are additional attributes you can add, such as timeline, which give you more animation possibilities. See the Data Attributes section below.

## Data Attributes

* **data-pressme_class_prefix** (required):  
    * A string that will be used as the prefix for CSS classes added by pressMe.js. 
    * Allows you to create CSS that works for a specific button only. 
    * When a button is clicked, this class is added: [pressMeClassPrefix]-click-response"
    * Example: `data-pressme_class_prefix="button1"`

* **data-pressme_add_child_divs**: 
  * Enter the number of child divs that you would like pressMe.js to add to your button. 
  * Gives you divs to style and animate. 
  * Each child div is given a class of [pressMeClassPrefix]-child.
  * Example: `data-pressme_add_child_divs="7"`

* **data-pressme_do_child_pos_fx**: 
  * Enter &ldquo;true&rdquo; to enable.
  * When your button is pressed, the x position of child divs changes to be the same as the cursor position.
  * Example: `data-pressme_do_child_pos_fx="true"`

 * **data-pressme_timeline**: 
   * Enter a comma seperated list of time ranges in milliseconds. Time ranges can overlap.
   * During each time range pressMe.js will add, then remove the class name of [pressMeClassPrefix]-tl-[time range index] to your button.
   * Cause the timeline to pause until a callback is recieved by adding &ldquo;wait&rdquo; to the timeline. The wait section of the timeline begins after the previous section of the timeline finishes (no overlap). Invoke the stopWaiting method to resume the timeline after the wait section.
   * Example data attribute: `data-pressme_timeline="0-200,100-700,wait,0-400,400-600"`
   * Example JavaScirpt:
   ```javascript
    var button1 = document.getElementById("button1");
    var button1PressMe = new pressMe(button1);
    button3.addEventListener("click", button1ClickHandler);
    
    function button1ClickHandler() {
        setTimeout(function () {
            button1PressMe.stopWaiting();
        }, 5000);
    }
   ```
* **data-pressme_waiting_text**: 
  * Enter the button text that should appear durring the waiting section of the timeline.
  * Example: `data-pressme_waiting_text="Loading"`