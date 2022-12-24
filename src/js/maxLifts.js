export const maxLift = {
  form: document.getElementById("maxLiftForm"),
  formReset: document.getElementById("maxLiftFormReset"),
  result: document.getElementById("maxLiftResult"),
  resultElem: null,
  resultValue: null,
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

  maxLift.resultElem.textContent = `1RM: ${oneRepMax} ${unit}`;
  maxLift.resultValue = oneRepMax;
  
  showPercentages(oneRepMax, formula);
  event.preventDefault(); // No query parameters on submit
}

function iterateOverPercentages(max, formula) {
  const percentagesDiv = document.getElementById("percentagesDiv");
  const tbody = percentagesDiv.getElementsByTagName("tbody")[0];
  const percentages = [1.0, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5]
  let i = 0;
  for (const trow of tbody.children) {
    const repsData = trow.getElementsByTagName("td")[2];
    const weightData = trow.getElementsByTagName("td")[1];
    if (!max) {
      repsData.textContent = 0;
      weightData.textContent = 0;
    } else if (i === 0) {
      repsData.textContent = 1;
      weightData.textContent = max;
    } else {
      const weight = roundToFirstDecimalPlace(max * percentages[i]);
      weightData.textContent = weight;
      repsData.textContent = calculatePercentageReps(formula, weight, maxLift.resultValue)
    }
    i++;
  }
}

function calculatePercentageReps(formula, weight, max) {
  let calcResult = 0;
  if (formula === "average") {
    for (const f of Object.values(maxLift.formulas)) {
      const percentageReps = f(weight, null, max);
      calcResult += percentageReps;      
    }
    calcResult /= Object.keys(maxLift.formulas).length;
  } else {
    calcResult = maxLift.formulas[formula](weight, null, max);
  }
  return roundToFirstDecimalPlace(calcResult);
}

function maxLiftReset(event) {
  if (maxLift.resultElem !== null) {
    maxLift.resultElem.remove();
    maxLift.resultElem = null;
    maxLift.resultValue = null;
  }
  iterateOverPercentages();
}

function showPercentages(max, formula) {
  iterateOverPercentages(max, formula);
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

function epleyFormula(w, r, m) {
  if (!m) {
    // Standard Epley formula to solve for 1RM based on weight and reps
    return w * (1 + (0.0333*r));
  } else {
    // Rearranged Epley formula to solve for how many reps can be performed at % of 1RM
    return (30*m - 30*w) / w;
  }
}

function brzyckiFormula(w, r, m) {
  if (!m) {
    // Standard formula (solve for 1RM)
    return w / (1.0278 - (0.0278 * r));
  } else {
    // Rearranged formula (solve for reps at % of 1RM)
    return ((w / m) - 1.0278) / -0.0278;
  }
}

function landerFormula(w, r, m) {
  if (!m) {
    // Standard formula (solve for 1RM)
    return (100 * w) / (101.3 - (2.67123 * r));
  } else {
    // Rearranged formula (solve for reps at % of 1RM)
    return (((100 * w) / m) - 101.3) / -2.67123;
  }
}

function lombardiFormula(w, r, m) {
  if (!m) {
    // Standard formula (solve for 1RM)
    return w * Math.pow(r, 0.1);
  } else {
    // Rearranged formula (solve for reps at % of 1RM)
    return Math.pow((m/w), 10);
  }
}

function mayhewFormula(w, r, m) {
  if (!m) {
    // Standard formula (solve for 1RM)
    return (100 * w) / (52.2 + 41.9 * Math.pow(Math.E, -0.055*r));
  } else {
    // Rearranged formula (solve for reps at % of 1RM)
    return Math.log((((100*w)/m) - 52.2) / 41.9) / -0.055;
  }
}

function oconnerFormula(w, r, m) {  
  if (!m) {
    // Standard formula (solve for 1RM)
    return w * (1 + (r / 40));
  } else {
    // Rearranged formula (solve for reps at % of 1RM)
    return ((40*m)/w) - 40
  }
}

function walthenFormula(w, r, m) {
  if (!m) {
    // Standard formula (solve for 1RM)
    return (100 * w) / (48.8 + 53.8 * Math.pow(Math.E, -0.075*r));
  } else {
    // Rearranged formula (solve for reps at % of 1RM)
    return Math.log((((100*w)/m) - 48.8) / 53.8) / -0.075;
  }
}
