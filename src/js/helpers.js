export function resetResultElem(obj) {
  if (obj.resultElem !== null) {
    obj.resultElem.remove();
    obj.resultElem = null;
    obj.resultValue = null;
  }
}

export function resetColorAndBg(elem) {
  elem.style.backgroundColor = "";
  elem.style.color = "";
}

export function highlightColorAndBg(elem) {
  elem.style.backgroundColor = "rgb(21, 122, 56)";
  elem.style.color = "white";
}

export function createAndSetResultElem(obj, elemName) {
  if (obj.resultElem === null) {
    const resultElem = document.createElement("p");
    resultElem.setAttribute("id", elemName);
    obj.result.appendChild(resultElem);
    obj.resultElem = document.getElementById(elemName); // Store in object
  }
}

export function getSelectOption(selectElem, useValue = false) {
  const optionElem = selectElem.options[selectElem.selectedIndex];
  let optionElemVal;
  if (useValue) {
    optionElemVal = optionElem.value;
  } else {
    optionElemVal = optionElem.text;
  }
  return optionElemVal;
}