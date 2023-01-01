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
  tdee.resultElem.textContent = `Consume ${result} kcal per day to achieve your weight goal`;
  tdee.resultElem.style.color = "rgb(21, 122, 56)";
  tdee.resultValue = result;

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

    const maintenance = calculateMaintenance(bmr, Object.keys(tdee.activityMultipliers)[i]);

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
        const calorieTarget = maintenance + tdee.calorieModifiers[key];
        value.textContent = calorieTarget;
        if (tdee.resultValue && calorieTarget === tdee.resultValue) {          
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

function tdeeReset(event) {
  if (tdee.resultElem !== null) {
    tdee.resultElem.remove();
    tdee.resultElem = null;
    tdee.resultValue = null;
  }
  iterateOverMultipliers();
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