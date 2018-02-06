function pressMe(el) {
    var el = el;
    /* get values from data attributes */
    var pressMeClassPrefix = el.dataset.pressme_class_prefix;
    var doChildPositionFX = el.dataset.pressme_do_child_pos_fx; // means "Position Effects";
    var clickTimeline = el.dataset.pressme_timeline;
    var waitText = el.dataset.pressme_waiting_text;
    var defaultText = el.innerText;
    var waitIndex;

    if (clickTimeline) {
        clickTimeline = clickTimeline.split(",");

        for (var i = 0; i < clickTimeline.length; i++) {
            if (clickTimeline[i] !== "wait") {
                clickTimeline[i] = clickTimeline[i].split("-");

                for (var j = 0; j < clickTimeline[i].length; j++) {
                    clickTimeline[i][j] = parseInt(clickTimeline[i][j], 10);
                }
            }
        }

        // calculate wait position
        for (var i = 0; i < clickTimeline.length; i++) {
            if (clickTimeline[i] === 'wait') {
                waitIndex = i;
                break;
            }
        }
    }

    function clickHandler(e) {
        if (doChildPositionFX === true) {
            setChildLeftPositionToCursor(e);
        }

        // if there is a timeline
        if (clickTimeline) {
            doClickTimeline();

        } else {
            // no timeline
            el.classList.remove(pressMeClassPrefix + "-click-response");
            setTimeout(function () {
                el.classList.add(pressMeClassPrefix + "-click-response");
            }, 20);
        }
    }

    if (doChildPositionFX === "true") {
        doChildPositionFX = true; // convert from string to boolean
    } else {
        doChildPositionFX = false;
    }

    var addChildDivsQty = parseInt(el.dataset.pressme_add_child_divs, 10);

    var childDivs;
    el.addEventListener("click", clickHandler);

    if (addChildDivsQty > 0) {
        for (var i = 0; i < addChildDivsQty; i++) {
            addChildDiv(el, pressMeClassPrefix);
        }
        childDivs = document.querySelectorAll("." + pressMeClassPrefix + "-child");
    }

    function addChildDiv(el, pressMeClassPrefix) {
        var childDiv = document.createElement("div");
        childDiv.classList.add(pressMeClassPrefix + "-child");
        var fragment = document.createDocumentFragment();
        fragment.appendChild(childDiv);
        el.appendChild(fragment);
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
        
        if (startAfterWait === true) {
            jStart = waitIndex + 1;
            el.classList.remove(pressMeClassPrefix + "-tl-" + waitIndex);
            // If there's wait text, then add the normal text back
            el.innerText = defaultText;
        } else {
            jStart = 0;
        }

        for (var j = jStart; j < clickTimeline.length; j++) {

            if(j === waitIndex){
                tlSectionStart = clickTimeline[j - 1][1];
            } else {
                tlSectionStart = clickTimeline[j][0];
            }

            tlSectionEnd = clickTimeline[j][1];

            // add class
            (function (j) {
                setTimeout(function () {
                    el.classList.add(pressMeClassPrefix + "-tl-" + j);
                    if(clickTimeline[j] === "wait"){
                        // add wait text
                        el.innerText = waitText;
                    }
                }, tlSectionStart);

                if (clickTimeline[j] !== "wait") {
                    // remove class
                    setTimeout(function () {
                        el.classList.remove(pressMeClassPrefix + "-tl-" + j);
                    }, tlSectionEnd);
                }
            })(j);

            if (clickTimeline[j] === "wait") {
                break;
            }
        }
    }

    this.stopWaiting = function () {
        console.log("Stop Waiting!");
        if (waitIndex) {
            doClickTimeline(true);
        }
    };
}