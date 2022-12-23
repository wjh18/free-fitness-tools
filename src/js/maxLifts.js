export const maxLift = {
  form: document.getElementById("maxLiftForm"),
  formReset: document.getElementById("maxLiftFormReset"),
  result: document.getElementById("maxLiftResult"),
  resultElem: null,
  formulas: {
    epley: epleyFormula,
    brzycki: brzyckiFormula,
    lander: landerFormula,
    lombardi: lombardiFormula,
    mayhew: mayhewFormula,
    oconner: oconnerFormula,
    walthen: walthenFormula,
  },
  run: function() {
    this.form.addEventListener('submit', maxLiftSubmit);
    this.formReset.addEventListener('click', maxLiftReset);
  }
};

function maxLiftSubmit(event) {  
  const formulaSelect = document.getElementById("maxLiftFormula");
  const formula = formulaSelect.options[formulaSelect.selectedIndex].value;

  const weightInput = document.getElementById("maxLiftWeight");
  const repsInput = document.getElementById("maxLiftReps");
  const oneRepMax = calculateMaxLift(formula, weightInput.value, repsInput.value);

  const unitSelect = document.getElementById("maxLiftUnit");
  const unit = unitSelect.options[unitSelect.selectedIndex].text;

  if (maxLift.resultElem === null) {
    const resultElem = document.createElement("p");
    resultElem.setAttribute("id", "maxLiftResultElem");
    maxLift.result.appendChild(resultElem);
    maxLift.resultElem = document.getElementById("maxLiftResultElem"); // Store in object
  }

  maxLift.resultElem.textContent = oneRepMax + ` ${unit}`;
  
  showPercentages(oneRepMax);
  event.preventDefault(); // No query parameters on submit
}

function iterateOverPercentages(max) {
  const percentagesDiv = document.getElementById("percentagesDiv");
  const tbody = percentagesDiv.getElementsByTagName("tbody")[0];
  const percentages = [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5]
  let i = 0;
  for (const trow of tbody.children) {
    const repsData = trow.getElementsByTagName("td")[2];
    if (!max) {
      repsData.textContent = 0;
    } else {
      repsData.textContent = roundToFirstDecimalPlace(max * percentages[i]);
    }
    i++;
  }
}

function maxLiftReset(event) {
  if (maxLift.resultElem !== null) {
    maxLift.resultElem.remove();
    maxLift.resultElem = null;
  }
  iterateOverPercentages();
}

function showPercentages(max) {
  iterateOverPercentages(max);
}

function calculateMaxLift(formula, weight, reps) {
  let calcResult = 0;
  if (formula === "average") {
    for (const f of Object.values(maxLift.formulas)) {
      const formulaResult = f(weight, reps);
      calcResult += formulaResult;      
    }
    calcResult /= Object.keys(maxLift.formulas).length;
  } else {
    calcResult = maxLift.formulas[formula](weight, reps);
  }
  return roundToFirstDecimalPlace(calcResult);
}

function roundToFirstDecimalPlace(num) {
  return Math.round(num * 10) / 10;
}

function epleyFormula(w, r) {
  return w * (1 + (0.0333 * r));
}

function brzyckiFormula(w, r) {
  return w / (1.0278 - (0.0278 * r));
}

function landerFormula(w, r) {
  return (100 * w) / (101.3 - (2.67123 * r));
}

function lombardiFormula(w, r) {
  return w * Math.pow(r, 0.1);
}

function mayhewFormula(w, r) {
  return (100 * w) / (52.2 + 41.9 * Math.pow(Math.E, -0.055*r));
}

function oconnerFormula(w, r) {
  return w * (1 + (r / 40));
}

function walthenFormula(w, r) {
  return (100 * w) / (48.8 + 53.8 * Math.pow(Math.E, -0.075*r));
}
