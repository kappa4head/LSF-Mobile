var searchButton, dropdownButton;
var nameInput, moduleInput, startTimeInput, endTimeInput;
var courseName, moduleString, startTime, endTime;
var foundLectures = [];
var overlay;
var overlayContainer;
var foundLectureIDs = [];
var searchSpans = [];

initDropdownButton();
initSearchButton();
initInputs();

// TODO make time input only accept inputs of the current format ("HH:MM") or convert mistyped inputs to proper format
// TODO make other types of search available (eg. COUNT instead of AND)
// TODO make list scrollable


function initDropdownButton() {
    dropdownButton = document.getElementById('searchCoursesButton');
    dropdownButton.onclick = function () {
        toggleSearchBar();
    }
}

function initInputs() {
    nameInput = document.getElementById("nameInput");
    moduleInput = document.getElementById("moduleInput");
    startTimeInput = document.getElementById("startTimeInput");
    endTimeInput = document.getElementById("endTimeInput");
}

function initSearchButton() {
    searchButton = document.getElementById('searchButton');
    searchButton.onclick = function () {
        readInputValues()
    };
}

function toggleSearchBar() {
    document.getElementById("search-dropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.addEventListener('click', function () {
    if (!document.getElementsByClassName('dropbtn')[0].contains(event.target) && !document.getElementById('search-dropdown').contains(event.target)) {
        var dropdowns = document.getElementsByClassName("search-dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});


function readInputValues() {
    courseName = nameInput.value.toLowerCase().trim();
    moduleString = moduleInput.value.toLowerCase().trim();
    startTime = startTimeInput.value;
    endTime = endTimeInput.value;

    searchForResults();
}


function searchForResults() {
    foundLectures = [];
    searchByName();
    searchByStartTime();
    searchByEndTime();
    searchByModules();
    mergeSearches();
    showResults();
}

function showResults() {
    createOverlay();
    createBackButton();
    for (var i in foundLectures) {
        createEntries(foundLectures[i]);
    }
    showSearchResults();
}

function createBackButton() {
    var backButton = document.createElement('button');
    backButton.innerHTML = "Hide Search Results";
    backButton.onclick = function () {
        hideSearchResultsButton()
    };
    backButton.classList.add('timetable-button');
    overlayContainer.appendChild(backButton);
}


function createEntries(currentLecture) {
    var lecUl = document.createElement('ul');
    addStylesToElement(lecUl, SEARCH_RESULT_UL);

    var lecLi = document.createElement('li');
    addStylesToElement(lecLi, LECTURE_LAYER_LI_CLASS_LIST);

    var lecA = document.createElement('a');
    addStylesToElement(lecA, LECTURE_LAYER_A_CLASS_LIST);
    lecA.setAttribute("href", "#0");

    var lecSpan = document.createElement('span');
    lecSpan.innerHTML = currentLecture.LECTURE_NAME_KEY;
    lecSpan.onclick = function() {
        showLectureDetails(currentLecture.LECTURE_ID_KEY);
    };

    lecUl.appendChild(lecLi);
    lecLi.appendChild(lecA);
    lecA.appendChild(lecSpan);

    overlayContainer.appendChild(lecUl);


}

function showSearchDetails(index) {
    searchDetailOverlay = document.createElement('div');
    searchDetailOverlay.classList.add('lecture-overlay');
    var currentLectureDetails = foundLectures[index];

    createLectureDetailElements(currentLectureDetails);
    fillLectureDetailElements(currentLectureDetails);
    appendChildrenToOverlay(searchDetailOverlay);

    searchDetailOverlay.onclick = function () {
        hideOverlay(searchDetailOverlay)
    };
    domParent.appendChild(searchDetailOverlay);
    resetPArrays();
}

function createOverlay() {
    overlay = document.createElement('div');
    overlay.setAttribute('id', 'searchResultOverlay');
    overlay.classList.add('overlay');
    overlay.onclick = function () {
        hideSearchResults()
    };
    document.getElementById("body").appendChild(overlay);

    overlayContainer = document.createElement('div');
    overlayContainer.setAttribute('id', 'searchResultOverlayContainer');
    overlay.appendChild(overlayContainer);
}

function mergeSearches() {
    var searchParams = getSearchParams();
    for (var i in searchParams) {
        deleteNonMatchingLectures(i, searchParams);
    }
}

function deleteNonMatchingLectures(index, params) {
    if (params[0] === true) {
        if (params[index]) {
            for (var i in foundLectures) {
                if (foundLectures[i].LECTURE_NAME_KEY !== undefined) {
                    if (!foundLectures[i].LECTURE_NAME_KEY.toLowerCase().trim().includes(courseName)) {
                        foundLectures.splice(i, 1);
                    }
                }
            }
        }
    }


    if (params[1] === true) {
        var contained = false;
        if (params[index]) {
            for (var t in foundLectures) {
                for (var d in foundLectures[t].LECTURE_MODULE_SEARCH_STRING) {
                    if (foundLectures[t].LECTURE_MODULE_SEARCH_STRING[d] !== undefined) {
                        if (foundLectures[t].LECTURE_MODULE_SEARCH_STRING[d].toLowerCase().trim().includes(moduleString)) {
                            contained = true;
                        }
                    }
                }
                if(!contained) {
                    foundLectures.splice(t, 1);
                }
            }
        }
    }


    if (params[2] === true) {
        contained = false;
        if (params[index]) {
            for (var j in foundLectures) {
                if (foundLectures[j].LECTURE_START_TIME_KEY !== undefined) {
                    for (var start in foundLectures[j].LECTURE_START_TIME_KEY) {
                        if (foundLectures[j].LECTURE_START_TIME_KEY[start] === startTime) {
                            contained = true;
                        }
                    }
                }
                if (!contained) {
                    foundLectures.splice(j, 1);
                }
            }
        }
    }

    if (params[3] === true) {
        contained = false;
        if (params[index]) {
            for (var k in foundLectures) {
                if (foundLectures[k].LECTURE_END_TIME_KEY !== undefined) {
                    for(var end in foundLectures[k].LECTURE_END_TIME_KEY) {
                        console.log(foundLectures[k]);
                        console.log(foundLectures[k].LECTURE_END_TIME_KEY[end]);
                        if (foundLectures[k].LECTURE_END_TIME_KEY[end] === endTime) {
                            console.log("it contains");
                            contained = true;
                        }
                    }

                }
                if(contained === false) {
                    console.log("split because end time");
                    foundLectures.splice(k, 1);
                }
            }
        }

    }
}

function getSearchParams() {
    var params = [];
    if (courseName != null && courseName !== "") {
        params.push(true);
    } else {
        params.push(false);
    }

    if (moduleString != null && moduleString !== "") {
        params.push(true);
    } else {
        params.push(false);
    }

    if (startTime != null && startTime !== "") {
        params.push(true);
    } else {
        params.push(false);
    }

    if (endTime != null && endTime !== "") {
        params.push(true);
    } else {
        params.push(false);
    }

    return params;
}

function searchByEndTime() {
    for (var i in courses) {
        var currentLecture = courses[i];
        if (endTime != null && endTime !== "") {
            for(var bb in currentLecture.LECTURE_END_TIME_KEY) {
                if (currentLecture.LECTURE_END_TIME_KEY[bb] === endTime) {
                    foundLectures.push(currentLecture);
                }
            }
        }
    }
}

function searchByStartTime() {
    for (var i in courses) {
        var currentLecture = courses[i];
        if (startTime != null && startTime !== "") {
            for (var p in currentLecture.LECTURE_START_TIME_KEY){
                if (currentLecture.LECTURE_START_TIME_KEY[p] === startTime) {
                    foundLectures.push(currentLecture);
                }
            }

        }
    }
    console.log(foundLectures);
}

function searchByModules() {
    for (var i in courses) {
        var currentLecture = courses[i];
        if (moduleString != null && moduleString !== "") {
            for (var k in currentLecture.LECTURE_MODULE_SEARCH_STRING) {
                if (currentLecture.LECTURE_MODULE_SEARCH_STRING[k] !== undefined) {
                    if (currentLecture.LECTURE_MODULE_SEARCH_STRING[k].toLowerCase().trim().includes(moduleString)) {
                        foundLectures.push(currentLecture);
                    }
                }
            }

        }
    }
}

function searchByName() {
    for (var i in courses) {
        var currentLecture = courses[i];
        if (courseName != null && courseName !== "") {
            if (currentLecture.LECTURE_NAME_KEY !== undefined) {
                if (currentLecture.LECTURE_NAME_KEY.toLowerCase().trim().includes(courseName)) {
                    foundLectures.push(currentLecture);
                }
            }
        }
    }
}