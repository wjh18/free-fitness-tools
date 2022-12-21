import "../scss/main.scss";

function maxLiftSubmit(event) {  
  const formulaSelect = document.getElementById("maxLiftFormula");
  const formula = formulaSelect.options[formulaSelect.selectedIndex].value;

  const weightInput = document.getElementById("maxLiftWeight");
  const repsInput = document.getElementById("maxLiftReps");
  const oneRepMax = calculateMaxLift(formula, weightInput.value, repsInput.value);

  const unitSelect = document.getElementById("maxLiftUnit");
  const unit = unitSelect.options[unitSelect.selectedIndex].text;

  maxLiftResult.textContent = oneRepMax + ` ${unit}`;
  event.preventDefault(); // No query parameters on submit
}

function calculateMaxLift(formula, weight, reps) {
  let calcResult = 0;
  if (formula == "average") {
    let i = 0;
    for (const property in formulas) {
      const formulaResult = formulas[property](weight, reps);
      calcResult += formulaResult;
      i++;
    }
    calcResult /= i;
  } else {
    calcResult = formulas[formula](weight, reps);
  }
  return Math.round(calcResult);
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

const formulas = {
  epley: epleyFormula,
  brzycki: brzyckiFormula,
  lander: landerFormula,
  lombardi: lombardiFormula,
  mayhew: mayhewFormula,
  oconner: oconnerFormula,
  walthen: walthenFormula,
};

const maxLiftForm = document.getElementById("maxLiftForm");
const maxLiftResult = document.getElementById("maxLiftResult");
maxLiftForm.addEventListener('submit', maxLiftSubmit);