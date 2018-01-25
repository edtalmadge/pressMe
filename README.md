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
data-pressme_timeline_click="0-400,200-800,700-1000">Press Me</button>
```
```javascript
var button1 = document.getElementById("button1");
var button1PressMe = pressMe(button1);
```

## Example Usage (with timeline and waits for callback)

```html
<button id="button1" data-pressme_class_prefix="foo" 
data-pressme_timeline_click="0-400,200-800,wait,0-300,300-700" data-pressme_waiting_text="Loading">Press Me</button>
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
When your button is clicked, a class of [data-pressme_class_prefix value]-click-response. Each time your button is clicked, that class is removed, then added allowing for repeat animations. 

 In order to create the animations, please write your own CSS based off of the class prefix value you specified.

There are additional attributes you can add, such as timeline, which give you more animation possibilities. See the Attributes section below.

## Data Attributes

data-pressme_class_prefix

data-pressme_add_child_divs

data-pressme_do_child_pos_fx

 data-pressme_waiting_text

 data-pressme_timeline_click