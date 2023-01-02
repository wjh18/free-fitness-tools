export const calorieTarget = {
  form: document.getElementById("calorieTargetForm"),
  formReset: document.getElementById("calorieTargetFormReset"),
  result: document.getElementById("calorieTargetResult"),
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
      this.form.addEventListener('submit', calorieTargetSubmit);
      this.formReset.addEventListener('click', calorieTargetReset);
    }
  }
};

function calorieTargetSubmit(event) {

  const weightInput = document.getElementById("calorieTargetWeight");
  const weightUnitSelect = document.getElementById("calorieTargetWeightUnit");
  const heightInput = document.getElementById("calorieTargetHeight");
  const heightUnitSelect = document.getElementById("calorieTargetHeightUnit");
  const ageInput = document.getElementById("calorieTargetAge");
  const activityLevelSelect = document.getElementById("calorieTargetActivityLevel");
  const genderSelect = document.getElementById("calorieTargetGender");
  const weightGoalSelect = document.getElementById("calorieTargetWeightGoal");

  const weight = weightInput.value;
  const weightUnit = weightUnitSelect.options[weightUnitSelect.selectedIndex].text;
  const height = heightInput.value;
  const heightUnit = heightUnitSelect.options[heightUnitSelect.selectedIndex].text;
  const age = ageInput.value;
  const activityLevel = activityLevelSelect.options[activityLevelSelect.selectedIndex].value;
  const gender = genderSelect.options[genderSelect.selectedIndex].value;
  const weightGoal = weightGoalSelect.options[weightGoalSelect.selectedIndex].value;

  if (calorieTarget.resultElem === null) {
    const resultElem = document.createElement("p");
    resultElem.setAttribute("id", "calorieTargetResultElem");
    calorieTarget.result.appendChild(resultElem);
    calorieTarget.resultElem = document.getElementById("calorieTargetResultElem"); // Store in object
  }

  const bmr = calculateBmr(weight, weightUnit, height, heightUnit, age, gender);
  const maintenance = calculateMaintenance(bmr, activityLevel);
  const result = calculateCalories(bmr, maintenance, weightGoal);
  calorieTarget.resultElem.textContent = `Consume ${result} kcal per day to achieve your weight goal`;
  calorieTarget.resultElem.style.color = "rgb(21, 122, 56)";
  calorieTarget.resultValue = result;

  iterateOverMultipliers(bmr);
  event.preventDefault(); // No query parameters on submit
}

function iterateOverMultipliers(bmr) {
  const multipliersDiv = document.getElementById("multipliersDiv");
  const tbody = multipliersDiv.getElementsByTagName("tbody")[0];

  let i = 0;
  for (const trow of tbody.children) {
    const bmrData = trow.getElementsByTagName("td")[0];
    const maintenanceData = trow.getElementsByTagName("td")[2];

    const calorieModifiersData = {
      loseQuickly: trow.getElementsByTagName("td")[3],
      loseSlowly: trow.getElementsByTagName("td")[4],
      gainSlowly: trow.getElementsByTagName("td")[5],
      gainQuickly: trow.getElementsByTagName("td")[6],
    };

    const maintenance = calculateMaintenance(bmr, Object.keys(calorieTarget.activityMultipliers)[i]);

    if (!bmr) {
      bmrData.textContent = null;
      maintenanceData.textContent = null;
    } else {
      bmrData.textContent = bmr;      
      maintenanceData.textContent = maintenance;
    }

    for (const [key, value] of Object.entries(calorieModifiersData)) {
      if (!bmr) {
        value.textContent = null;
        value.style.backgroundColor = "";
        value.style.color = "";
      } else {
        const calTarget = maintenance + calorieTarget.calorieModifiers[key];
        value.textContent = calTarget;
        if (calorieTarget.resultValue && calTarget === calorieTarget.resultValue) {          
          value.style.backgroundColor = "rgb(21, 122, 56)";
          value.style.color = "white";
        } else {
          value.style.backgroundColor = "";
          value.style.color = "";
        }
      }
    }

    i++;
  }
}

function calorieTargetReset(event) {
  if (calorieTarget.resultElem !== null) {
    calorieTarget.resultElem.remove();
    calorieTarget.resultElem = null;
    calorieTarget.resultValue = null;
  }
  iterateOverMultipliers();
}

function calculateCalories(bmr, maintenance, weightGoal) {
  const calorieMod = calorieTarget.calorieModifiers[weightGoal];
  const calories = maintenance + calorieMod;
  return Math.round(calories);
}

function calculateMaintenance(bmr, activityLevel) {
  const multiplier = calorieTarget.activityMultipliers[activityLevel];
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