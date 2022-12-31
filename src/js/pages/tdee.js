export const tdee = {
  form: document.getElementById("tdeeForm"),
  formReset: document.getElementById("tdeeFormReset"),
  result: document.getElementById("tdeeResult"),
  resultElem: null,
  resultValue: null,
  activityMultipliers: {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extra: 1.9,
  },
  calorieModifiers: {
    loseQuickly: -500,
    loseSlowly: -250,
    maintain: 0,
    gainSlowly: 250,
    gainQuickly: 500,
  },
  run: function() {
    if (this.form) {
      this.form.addEventListener('submit', tdeeSubmit);
      this.formReset.addEventListener('click', tdeeReset);
    }
  }
};

function tdeeSubmit(event) {

  const weightInput = document.getElementById("tdeeWeight");
  const weightUnitSelect = document.getElementById("tdeeWeightUnit");
  const heightInput = document.getElementById("tdeeHeight");
  const heightUnitSelect = document.getElementById("tdeeHeightUnit");
  const ageInput = document.getElementById("tdeeAge");
  const activityLevelSelect = document.getElementById("tdeeActivityLevel");
  const genderSelect = document.getElementById("tdeeGender");
  const weightGoalSelect = document.getElementById("tdeeWeightGoal");

  const weight = weightInput.value;
  const weightUnit = weightUnitSelect.options[weightUnitSelect.selectedIndex].text;
  const height = heightInput.value;
  const heightUnit = heightUnitSelect.options[heightUnitSelect.selectedIndex].text;
  const age = ageInput.value;
  const activityLevel = activityLevelSelect.options[activityLevelSelect.selectedIndex].value;
  const gender = genderSelect.options[genderSelect.selectedIndex].value;
  const weightGoal = weightGoalSelect.options[weightGoalSelect.selectedIndex].value;

  if (tdee.resultElem === null) {
    const resultElem = document.createElement("p");
    resultElem.setAttribute("id", "tdeeResultElem");
    tdee.result.appendChild(resultElem);
    tdee.resultElem = document.getElementById("tdeeResultElem"); // Store in object
  }

  const bmr = calculateBmr(weight, weightUnit, height, heightUnit, age, gender);
  const maintenance = calculateMaintenance(bmr, activityLevel);
  const result = calculateCalories(bmr, maintenance, weightGoal);
  tdee.resultElem.textContent = `${result} kcal; BMR: ${bmr}; Maintenance: ${maintenance}`;
  tdee.resultElem.style.color = "rgb(21, 122, 56)";
  tdee.resultValue = result;

  event.preventDefault(); // No query parameters on submit
}

function tdeeReset(event) {
  if (tdee.resultElem !== null) {
    tdee.resultElem.remove();
    tdee.resultElem = null;
    tdee.resultValue = null;
  }
}

function calculateCalories(bmr, maintenance, weightGoal) {
  const calorieMod = tdee.calorieModifiers[weightGoal];
  const calories = maintenance + calorieMod;
  return Math.round(calories);
}

function calculateMaintenance(bmr, activityLevel) {
  const multiplier = tdee.activityMultipliers[activityLevel];
  return Math.round(bmr * multiplier);
}

function calculateBmr(weight, weightUnit, height, heightUnit, age, gender) {
  if (weightUnit === "lbs") {
    weight = convertPoundsToKilograms(weight);
  }
  if (heightUnit === "in") {
    height = convertInchesToCentimeters(height);
  }
  let genderModifier;
  if (gender === "male") {
    genderModifier = 5;
  } else if (gender === "female") {
    genderModifier = -161;
  } else {
    genderModifier = -78;
  }
  const bmr = (10 * weight) + (6.25 * height) - (5 * age) + genderModifier;
  return Math.round(bmr);
}

function convertPoundsToKilograms(lbs) {
  return lbs / 2.2046;
}

function convertInchesToCentimeters(inches) {
  return inches / 0.39370;
}