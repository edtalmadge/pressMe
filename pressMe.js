function pressMe(el) {

    /***********************************/
    /***********************************/
    /* Get values from data attributes */
    /***********************************/
    /***********************************/

    /** pressme_class_prefix **/
    var pressMeClassPrefix = el.dataset.pressme_class_prefix;

    /** pressme_do_child_pos_fx **/
    var doChildPositionFX = el.dataset.pressme_do_child_pos_fx;
    if (doChildPositionFX === "true") {
        doChildPositionFX = true;
    } else {
        doChildPositionFX = false;
    }

    /** pressme_waiting_text **/
    var waitText = el.dataset.pressme_waiting_text;

    /** pressme_repeat_clicks **/
    var repeatClicks = el.dataset.pressme_repeat_clicks || true;
    if (repeatClicks === "true") {
        repeatClicks = true;
    } else if (repeatClicks === "false") {
        repeatClicks = false;
    }

    /** pressme_class_target **/
    var classTarget = el;
    if (el.dataset.pressme_class_target === "parent") {
        classTarget = el.parentNode;
    }

    /** pressme_timeline **/
    var clickTimeline = el.dataset.pressme_timeline;

    if (clickTimeline) {

        // remove notes (values in parentheses)
        clickTimeline = clickTimeline.replace(/ *\([^)]*\) */g, "");

        // convert clickTimeline string value to array
        clickTimeline = clickTimeline.split(",");

        for (var i = 0; i < clickTimeline.length; i++) {
            if (clickTimeline[i] !== "wait") {
                clickTimeline[i] = clickTimeline[i].split("-");

                for (var j = 0; j < clickTimeline[i].length; j++) {
                    if (clickTimeline[i][j] !== "doneWaiting" && clickTimeline[i][j] !== "end") {
                        clickTimeline[i][j] = parseInt(clickTimeline[i][j], 10);
                    }
                }
            }
        }

        // calculate wait position

        var waitIndex;
        for (var i = 0; i < clickTimeline.length; i++) {
            if (clickTimeline[i] === 'wait') {
                waitIndex = i;
                break;
            }
        }
    }

    /** pressme_add_child_divs **/
    var addChildDivsQty = parseInt(el.dataset.pressme_add_child_divs, 10);
    var childDivs;
    if (addChildDivsQty > 0) {
        for (var i = 0; i < addChildDivsQty; i++) {
            addChildDiv(el, pressMeClassPrefix);
        }
        childDivs = document.querySelectorAll("." + pressMeClassPrefix + "-child");
    }

    /** pressme_add_sibling_divs **/
    var addSiblingDivsQty = parseInt(el.dataset.pressme_add_sibling_divs, 10);
    var siblingDivs;
    if (addSiblingDivsQty > 0) {
        for (var i = 0; i < addSiblingDivsQty; i++) {
            addSiblingDiv(el, pressMeClassPrefix);
        }
        siblingDivs = document.querySelectorAll("." + pressMeClassPrefix + "-sibling");
    }

    /** pressme_minimum_animation_time **/
    var minAnimLength = parseInt(el.dataset.pressme_minimum_animation_length, 10);

    /****************************/
    /****************************/
    /***** More Things **********/
    /****************************/
    /****************************/

    var that = this;
    var defaultText = el.innerText;
    var buttonWasClicked = false;
    var minAnimLengthPassed = false;
    var minAnimLengthTimer;
    var checkMinAnimLengthPassedTimer;
    var startAfterWaitClasses = [];
    var stopAtEndClasses = [];
    that.buttonStoppedWaiting = false;
    that.buttonIsRunning = false;


    /****************************/
    /****************************/
    /***** Click Handler ********/
    /****************************/
    /****************************/

    function clickHandler(e) {
        if (repeatClicks === true
            || (repeatClicks === false && buttonWasClicked === false)
            || (that.buttonIsRunning === false)
        ) {

            if(that.buttonIsRunning === false){
                that.buttonStoppedWaiting = false;
            }


            // that.buttonStoppedWaiting = false;

            if (doChildPositionFX === true) {
                setChildLeftPositionToCursor(e);
            }

            // if there is a timeline
            if (clickTimeline) {
                doClickTimeline();

            } else {
                // no timeline: just add and remove and add
                classTarget.classList.remove(pressMeClassPrefix + "-click-response");
                setTimeout(function () {
                    classTarget.classList.add(pressMeClassPrefix + "-click-response");
                }, 20);
            }

            if (clickTimeline) {
                setTimeout(function(){
                    that.buttonIsRunning = true;
                },1)
                
                // that.buttonStoppedWaiting = false;
            }
            buttonWasClicked = true;

            if (minAnimLength) {
                minAnimLengthPassed = false;
                clearTimeout(minAnimLengthTimer);
                minAnimLengthTimer = setTimeout(function () {
                    minAnimLengthPassed = true;
                }, minAnimLength);
            }
        }
    }

    function addChildDiv(el, pressMeClassPrefix) {
        var childDiv = document.createElement("div");
        childDiv.classList.add(pressMeClassPrefix + "-child");
        var fragment = document.createDocumentFragment();
        fragment.appendChild(childDiv);
        el.appendChild(fragment);
    }

    function addSiblingDiv(el, pressMeClassPrefix) {
        var siblingDiv = document.createElement("div");
        siblingDiv.classList.add(pressMeClassPrefix + "-sibling");
        var fragment = document.createDocumentFragment();
        fragment.appendChild(siblingDiv);
        el.parentNode.appendChild(fragment);
    }

    function getTargetInfo(e) {
        var rect = e.target.getBoundingClientRect();
        var x = e.pageX - rect.left;
        var y = e.pageY - rect.top;
        return {
            targetCursorX: x,
            targetCursorY: y,
            targetWidth: rect.width,
            targetHeight: rect.height
        };
    }

    function setChildLeftPositionToCursor(e) {
        var targetCursorX;
        var targetWidth;
        var translateXPercent;
        var targetInfo = getTargetInfo(e);
        targetCursorX = targetInfo.targetCursorX;
        targetWidth = targetInfo.targetWidth;
        translateXPercent = targetCursorX / targetWidth * 100;
        for (var i = 0; i < childDivs.length; i++) {
            childDivs[i].style.left = translateXPercent + "%";
        }
    }

    function doClickTimeline(startAfterWait) {

        var tlSectionStart = 0;
        var tlSectionEnd = 0;
        var jStart;
        var waitingEl;
        var waitingClass;
        var endingEl;
        var endingClass;

        if (startAfterWait === true) {

            for (var k = 0; k < startAfterWaitClasses.length; k++) {
                waitingClass = startAfterWaitClasses[k];
                waitingEl = document.getElementsByClassName(waitingClass);
                waitingEl = waitingEl[0];
                if (waitingEl) {
                    waitingEl.classList.remove(waitingClass);
                }
            }
            startAfterWaitClasses = [];

            jStart = waitIndex + 1;
            classTarget.classList.remove(pressMeClassPrefix + "-tl-" + waitIndex);
            // If there's wait text, then add the normal text back
            el.firstChild.nodeValue = defaultText;
        } else {
            jStart = 0;
        }

        for (var j = jStart; j < clickTimeline.length; j++) {


            // add class
            (function (j) {
                setTimeout(function () {
                    if (clickTimeline[j] === "wait") {
                        // add wait text
                        el.firstChild.nodeValue = waitText;
                    } else {
                        classTarget.classList.add(pressMeClassPrefix + "-tl-" + j);
                    }

                }, tlSectionStart);

                if (j === waitIndex) {
                    tlSectionStart = clickTimeline[j - 1][1];
                } else {
                    tlSectionStart = clickTimeline[j][0];
                }
        
                if(clickTimeline[j].length === 1){
                    tlSectionEnd = clickTimeline[j][0];
                } else {
                    tlSectionEnd = clickTimeline[j][1];
                }

                if (clickTimeline[j] !== "wait" && tlSectionEnd !== "doneWaiting" && tlSectionEnd !== "end") {
                    // remove class
                    setTimeout(function () {
                        // TODO: This logic is duplicated. Centralize it.
                        if (j === waitIndex) {
                            tlSectionStart = clickTimeline[j - 1][1];
                        } else {
                            tlSectionStart = clickTimeline[j][0];
                        }
                
                        if(clickTimeline[j].length === 1){
                            tlSectionEnd = clickTimeline[j][0];
                        } else {
                            tlSectionEnd = clickTimeline[j][1];
                        }

                        classTarget.classList.remove(pressMeClassPrefix + "-tl-" + j);

                        if (j === clickTimeline.length - 1) {
                            that.buttonIsRunning = false;
                            for (var k = 0; k < stopAtEndClasses.length; k++) {
                                endingClass = stopAtEndClasses[k];
                                endingEl = document.getElementsByClassName(endingClass);
                                endingEl = endingEl[0];
                                if (endingEl) {
                                    endingEl.classList.remove(endingClass);
                                }
                            }
                            stopAtEndClasses = [];

                        }

                    }, tlSectionEnd);
                }

            })(j);

            if (tlSectionEnd === "doneWaiting") {
                startAfterWaitClasses.push(pressMeClassPrefix + "-tl-" + j);
            } else if (tlSectionEnd === "end") {
                stopAtEndClasses.push(pressMeClassPrefix + "-tl-" + j);
            }

            if (clickTimeline[j] === "wait") {
                break;
            }
        }
    }

    this.stopWaiting = function () {
        
        if (waitIndex) {

            if (!minAnimLength) {
                doClickTimeline(true);
                that.buttonStoppedWaiting = true;

            } else if (minAnimLengthPassed === true) {
                doClickTimeline(true);
                that.buttonStoppedWaiting = true;

            } else if (minAnimLengthPassed === false) {
                checkMinAnimLengthPassedTimer = setInterval(function () {
                    if (minAnimLengthPassed === true) {
                        clearInterval(checkMinAnimLengthPassedTimer);
                        minAnimLengthPassed = true;
                        doClickTimeline(true);
                        that.buttonStoppedWaiting = true;
                    }
                }, 500);
            }
        }
    };

    el.addEventListener("click", clickHandler);
}