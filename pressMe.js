function pressMe(el) {

    /***********************************/
    /***********************************/
    /* Get values from data attributes */
    /***********************************/
    /***********************************/

    /** pressme_class_prefix **/
    let pressMeClassPrefix = el.dataset.pressme_class_prefix;

    /** pressme_do_child_pos_fx **/
    let doChildPositionFX = el.dataset.pressme_do_child_pos_fx;
    if (doChildPositionFX === "true") {
        doChildPositionFX = true;
    } else {
        doChildPositionFX = false;
    }

    /** pressme_waiting_text **/
    let waitText = el.dataset.pressme_waiting_text;

    /** pressme_repeat_clicks **/
    let repeatClicks = el.dataset.pressme_repeat_clicks || true;
    if (repeatClicks === "true") {
        repeatClicks = true;
    } else if (repeatClicks === "false") {
        repeatClicks = false;
    }

    /** pressme_class_target **/
    let classTarget = el;
    if (el.dataset.pressme_class_target === "parent") {
        classTarget = el.parentNode;
    }

    /** pressme_timeline **/
    let clickTimeline = el.dataset.pressme_timeline;
    let waitIndex;
    if (clickTimeline) {

        // remove notes (values in parentheses)
        clickTimeline = clickTimeline.replace(/ *\([^)]*\) */g, "");

        // convert clickTimeline string value to array
        clickTimeline = clickTimeline.split(",");

        for (let i = 0; i < clickTimeline.length; i++) {
            if (clickTimeline[i] !== "wait") {
                clickTimeline[i] = clickTimeline[i].split("-");

                for (let j = 0; j < clickTimeline[i].length; j++) {
                    if (clickTimeline[i][j] !== "doneWaiting" && clickTimeline[i][j] !== "end") {
                        clickTimeline[i][j] = parseInt(clickTimeline[i][j], 10);
                    }
                }
            }
        }

        // calculate wait position
        for (let i = 0; i < clickTimeline.length; i++) {
            if (clickTimeline[i] === 'wait') {
                waitIndex = i;
                break;
            }
        }
    }

    /** pressme_add_child_divs **/
    let addChildDivsQty = parseInt(el.dataset.pressme_add_child_divs, 10);
    let childDivs;
    if (addChildDivsQty > 0) {
        for (let i = 0; i < addChildDivsQty; i++) {
            addChildDiv(el, pressMeClassPrefix);
        }
        childDivs = document.querySelectorAll("." + pressMeClassPrefix + "-child");
    }

    /** pressme_add_sibling_divs **/
    let addSiblingDivsQty = parseInt(el.dataset.pressme_add_sibling_divs, 10);
    let siblingDivs;
    if (addSiblingDivsQty > 0) {
        for (let i = 0; i < addSiblingDivsQty; i++) {
            addSiblingDiv(el, pressMeClassPrefix);
        }
        siblingDivs = document.querySelectorAll("." + pressMeClassPrefix + "-sibling");
    }

    /** pressme_minimum_animation_time **/
    let minAnimLength = parseInt(el.dataset.pressme_minimum_animation_length, 10);

    /****************************/
    /****************************/
    /***** More Things **********/
    /****************************/
    /****************************/

    let that = this;
    let defaultText = el.innerText;
    let buttonWasClicked = false;
    let minAnimLengthPassed = false;
    let minAnimLengthTimer;
    let checkMinAnimLengthPassedTimer;
    let startAfterWaitClasses = [];
    let stopAtEndClasses = [];
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

            // flag used for callbacks
            if (that.buttonIsRunning === false) {
                that.buttonStoppedWaiting = false;
            }

            if (doChildPositionFX === true) {
                setChildLeftPositionToCursor(e);
            }

            // if there is a timeline
            if (clickTimeline) {
                doClickTimeline();

                // Give a short pause before setting in order for other click handlers to detect the false state
                setTimeout(function () {
                    that.buttonIsRunning = true;
                }, 1)

            } else {
                // no timeline: just add and remove and add
                classTarget.classList.remove(pressMeClassPrefix + "-click-response");
                setTimeout(function () {
                    classTarget.classList.add(pressMeClassPrefix + "-click-response");
                }, 20);
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
        let childDiv = document.createElement("div");
        childDiv.classList.add(pressMeClassPrefix + "-child");
        let fragment = document.createDocumentFragment();
        fragment.appendChild(childDiv);
        el.appendChild(fragment);
    }

    function addSiblingDiv(el, pressMeClassPrefix) {
        let siblingDiv = document.createElement("div");
        siblingDiv.classList.add(pressMeClassPrefix + "-sibling");
        let fragment = document.createDocumentFragment();
        fragment.appendChild(siblingDiv);
        el.parentNode.appendChild(fragment);
    }

    function getTargetInfo(e) {
        let rect = e.target.getBoundingClientRect();
        let x = e.pageX - rect.left;
        let y = e.pageY - rect.top;
        return {
            targetCursorX: x,
            targetCursorY: y,
            targetWidth: rect.width,
            targetHeight: rect.height
        };
    }

    function setChildLeftPositionToCursor(e) {
        let targetCursorX;
        let targetWidth;
        let translateXPercent;
        let targetInfo = getTargetInfo(e);
        targetCursorX = targetInfo.targetCursorX;
        targetWidth = targetInfo.targetWidth;
        translateXPercent = targetCursorX / targetWidth * 100;
        for (let i = 0; i < childDivs.length; i++) {
            childDivs[i].style.left = translateXPercent + "%";
        }
    }

    function doClickTimeline(startAfterWait) {

        // The clickTimeline starts either from the beginning, or after the wait index

        // Works by setting a separate timer for each time a class needs to be added and removed according to the timeline

        let tlSectionStart = 0;
        let tlSectionEnd = 0;
        let jStart;
        let waitingEl;
        let waitingClass;
        let endingEl;
        let endingClass;

        if (startAfterWait === true) {

            // Remove the waiting class from all children and siblings that have it
            for (let k = 0; k < startAfterWaitClasses.length; k++) {
                waitingClass = startAfterWaitClasses[k];
                waitingEl = document.getElementsByClassName(waitingClass);
                waitingEl = waitingEl[0];
                if (waitingEl) {
                    waitingEl.classList.remove(waitingClass);
                }
            }
            startAfterWaitClasses = [];

            jStart = waitIndex + 1;

            // remove the waiting class from the button
            classTarget.classList.remove(pressMeClassPrefix + "-tl-" + waitIndex);

            // If there's wait text, then add the normal text back
            el.firstChild.nodeValue = defaultText;

        } else {
            jStart = 0;
        }

        for (let j = jStart; j < clickTimeline.length; j++) {

            // add class
            (function (j) {

                if (j === waitIndex) {
                    tlSectionStart = clickTimeline[j - 1][1];
                } else {
                    tlSectionStart = clickTimeline[j][0];
                }

                if (clickTimeline[j].length === 1) {
                    tlSectionEnd = clickTimeline[j][0];
                } else {
                    tlSectionEnd = clickTimeline[j][1];
                }

                setTimeout(function () {
                    if (clickTimeline[j] === "wait") {
                        // add wait text
                        el.firstChild.nodeValue = waitText;
                    } else {
                        classTarget.classList.add(pressMeClassPrefix + "-tl-" + j);
                    }

                }, tlSectionStart);

                // remove class
                if (clickTimeline[j] !== "wait" && tlSectionEnd !== "doneWaiting" && tlSectionEnd !== "end") {

                    setTimeout(function () {

                        classTarget.classList.remove(pressMeClassPrefix + "-tl-" + j);

                        if (j === clickTimeline.length - 1) {
                            that.buttonIsRunning = false;
                            for (let k = 0; k < stopAtEndClasses.length; k++) {
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

    // Used by external script to continue timeline after wait index
    //// For example, used by external script after ajax request is complete
    
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