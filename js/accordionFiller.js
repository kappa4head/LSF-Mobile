
var currentFaculty, currentModule, currentLesserModule;
var accordionSection = document.getElementById('accordion-section');
var accordionList = document.getElementById('accordion-list');

function createAccordionEntry(name, layer) {
    switch(layer) {
        case FACULTY_LAYER:
            var facLi = document.createElement('li');
            addStylesToElement(facLi, FACULTY_LAYER_LI_CLASS_LIST);

            var facInput = document.createElement('input');
            addStylesToElement(facInput, FACULTY_LAYER_INPUT_CLASS_LIST);
            setInputAttributes(facInput, name);

            var facLabel = document.createElement('label');
            addStylesToElement(facLabel, FACULTY_LAYER_LABEL_CLASS_LIST);
            setLabelAttributes(facLabel, name);

            var facSpan = document.createElement('span');
            facSpan.innerHTML = name;

            facLi.appendChild(facInput);
            facLi.appendChild(facLabel);
            facLabel.appendChild(facSpan);

            currentFaculty = facLi;
            accordionList.appendChild(currentFaculty);
            break;

        case MODULE_LAYER:
            var modUl = document.createElement('ul');
            addStylesToElement(modUl, MODULE_LAYER_UL_CLASS_LIST);

            var modLi = document.createElement('li');
            addStylesToElement(modLi, MODULE_LAYER_LI_CLASS_LIST);

            var modInput = document.createElement('input');
            addStylesToElement(modInput, MODULE_LAYER_INPUT_CLASS_LIST);
            setInputAttributes(modInput, name);

            var modLabel = document.createElement('label');
            addStylesToElement(modLabel, MODULE_LAYER_LABEL_CLASS_LIST);
            setLabelAttributes(modLabel, name);

            var modSpan = document.createElement('span');
            modSpan.innerHTML = name;

            modUl.appendChild(modLi);
            modLi.appendChild(modInput);
            modLi.appendChild(modLabel);
            modLabel.appendChild(modSpan);

            currentModule = modLi;
            currentFaculty.appendChild(modUl);
            break;

        case LESSER_MODULE_LAYER:
            var lesUl = document.createElement('ul');
            addStylesToElement(lesUl, LESSER_LAYER_UL_CLASS_LIST);

            var lesLi = document.createElement('li');
            addStylesToElement(lesLi, LESSER_LAYER_LI_CLASS_LIST);

            var lesInput = document.createElement('input');
            addStylesToElement(lesInput, LESSER_LAYER_INPUT_CLASS_LIST);
            setInputAttributes(lesInput, name);

            var lesLabel = document.createElement('label')
            addStylesToElement(lesLabel, LESSER_LAYER_LABEL_CLASS_LIST);
            setLabelAttributes(lesLabel, name);

            var lesSpan = document.createElement('span');
            lesSpan.innerHTML = name;

            lesUl.appendChild(lesLi);
            lesLi.appendChild(lesInput);
            lesLi.appendChild(lesLabel);
            lesLabel.appendChild(lesSpan);

            currentLesserModule = lesLi;
            currentModule.appendChild(lesUl);
            break;

        case LECTURE_LAYER:
            var lecUl = document.createElement('ul');
            addStylesToElement(lecUl, LECTURE_LAYER_UL_CLASS_LIST);

            var lecLi = document.createElement('li');
            addStylesToElement(lecLi, LECTURE_LAYER_LI_CLASS_LIST);

            var lecA = document.createElement('a');
            addStylesToElement(lecA, LECTURE_LAYER_A_CLASS_LIST);
            lecA.setAttribute("href", "#0");

            var lecSpan = document.createElement('span');
            lecSpan.innerHTML = name;

            lecUl.appendChild(lecLi);
            lecLi.appendChild(lecA);
            lecA.appendChild(lecSpan);

            currentLesserModule.appendChild(lecUl);
            break;
    }
}



function addStylesToElement(element, styles){
    for(var i in styles){
        element.classList.add(styles[i]);
    }
}

function setInputAttributes(input, name) {
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", name);
}

function setLabelAttributes(label, name) {
    label.setAttribute("for", name);
}

