class Person {
  constructor(age) {
    this.age = age;
    this.riskValues = tables[age].modifiers;
    this.sex = { modifier: 0, value: "male" };
    this.ethnicity = { modifier: 0, value: "none" };
    this.asthma = { modifier: 0, value: "none" };
    this.diabetes = { modifier: 0, value: "none" };
    this.kidney = { modifier: 0, value: "none" };
    this.nbc = { modifier: 0, value: "none" };
    this.blood = { modifier: 0, value: "none" };
    this.heart = { modifier: 0, value: "none" };
    this.bmi = { modifier: 0, value: "none" };
    this.covidAge = age;
    this.otherModifiers = [
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
    ];
    //standard event handler function for most form imputs
    this.handlerObj = {
      handleEvent: (event) => {
        let modString = `${event.target.id}`;
        this[modString].value = event.target.value;
        this.refreshCovidAge();
      },
    };
  }

  getModValue(prop) {
    //lookup risk value from table based on modifier value and set modifier accordingly
    if (this[prop].value != "none") {
      this[prop].modifier = this.riskValues[this[prop].value];
    } else {
      this[prop].modifier = 0;
    }
  }

  calcModValues() {
    //hardcode sex because it doesnt vary with age
    if (this.sex.value == "female") {
      this.sex.modifier = -5;
    } else {
      this.sex.modifier = 0;
    }
    //set all modifiers according to values
    this.getModValue("ethnicity");
    this.getModValue("asthma");
    this.getModValue("diabetes");
    this.getModValue("kidney");
    this.getModValue("nbc");
    this.getModValue("blood");
    this.getModValue("heart");
    this.getModValue("bmi");
    this.otherModifiers.forEach((e) => {
      if (e.value != "none") {
        e.modifier = this.riskValues[e.value];
      } else {
        e.modifier = 0;
      }
    });
  }

  changeAge(age) {
    //update age property and refresh risk values based on age
    this.age = age;
    this.riskValues = tables[age].modifiers;
  }

  sumOthers() {
    //ugly sum all 9 checkbox modifiers because im too dumb for map/reduce when it has layers
    let count = 0;
    this.otherModifiers.forEach((e) => {
      count += e.modifier;
    });
    return count;
  }

  sumModifiers() {
    //refresh all modifiers then ugly sum them all together
    this.calcModValues();
    return this.sex.modifier + this.ethnicity.modifier + this.asthma.modifier + this.diabetes.modifier + this.kidney.modifier + this.nbc.modifier + this.blood.modifier + this.heart.modifier + this.bmi.modifier + this.sumOthers();
  }

  calculateCovidAge() {
    //set covid age property based on actual age + modifiers, set it to "85+" as per ALAMA methodology if too high
    this.covidAge = this.age + this.sumModifiers();
    if (this.covidAge >= 85) {
      this.covidAge = "85+";
    }
    return this.covidAge;
  }
  
  addListener(target) {
    //generic input listener using logic from object
    target.addEventListener("change", this.handlerObj);
  }

  ageListener() {
    //specialised listener for age changes (this isnt elegant but it sure is easier)
    document.querySelector("#age").addEventListener("change", (e) => {
      this.changeAge(Number(e.target.value));
      this.refreshCovidAge();
    });
  }

  otherListener(target) {
    //another specialised listener for the 9 checkboxes
    target.addEventListener("change", (e) => {
      let index = Number(e.target.value.slice(-1, 4));
      if (e.target.checked) {
        this.otherModifiers[index].value = e.target.value;
      } else {
        this.otherModifiers[index].value = "none";
      }
      this.refreshCovidAge();
    });
  }

  sexListener(target, sex) {
    //yet another specialised listener for sex
    target.addEventListener("change", (e) => {
      if (e.target.checked) {
        this.sex.value = sex;
      } else {
        this.sex.value = "male";
      }
      this.refreshCovidAge();
    });
  }

  refreshCovidAge() {
    //refresh page display of covid age
    document.querySelector("#display").innerText = `${this.calculateCovidAge()}`;
  }

  initialiseValues() {
    //resets all the basic properties to default, unused
    this.age = Number(document.querySelector("#age").value);
    this.riskValues = tables[age].modifiers;
    this.sex = { modifier: 0, value: "male" };
    this.ethnicity = { modifier: 0, value: "none" };
    this.asthma = { modifier: 0, value: "none" };
    this.diabetes = { modifier: 0, value: "none" };
    this.kidney = { modifier: 0, value: "none" };
    this.nbc = { modifier: 0, value: "none" };
    this.blood = { modifier: 0, value: "none" };
    this.heart = { modifier: 0, value: "none" };
    this.bmi = { modifier: 0, value: "none" };
    this.covidAge = age;
    this.otherModifiers = [
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
      { modifier: 0, value: "none" },
    ];
  }

  calcImpBMI() {
    //calculates BMI based on imperial inputs
    let ftVal = document.querySelector("#imp_feet").value * 12;
    let inVal = document.querySelector("#imp_inch").value;
    let stVal = document.querySelector("#imp_stn").value * 14;
    let lbVal = document.querySelector("#imp_lbs").value;
    let totalIn = Number(inVal) + Number(ftVal);
    let totalLb = Number(stVal) + Number(lbVal);
    let rtnBMI = (totalLb * 703) / totalIn ** 2;
    return Math.round(rtnBMI * 10) / 10;
  }

  calcMetBMI() {
    //calculates BMI based on metric inputs
    let kgVal = document.querySelector("#met_kg").value;
    let mVal = document.querySelector("#met_m").value;
    let rtnBMI = Number(kgVal) / Number(mVal) ** 2;
    return Math.round(rtnBMI * 10) / 10;
  }

  calcBMIcat(bmi) {
    //categories BMI and returns ALAMA type value
    if (bmi < 30) {
      return "none";
    } else if (bmi < 35) {
      return "bmi0";
    } else if (bmi < 40) {
      return "bmi1";
    } else if (bmi >= 40) {
      return "bmi2";
    } else {
      return "none";
    }
  }

  calcListener(target) {
    //special case listener for BMI modal, ugly
    target.addEventListener("click", () => {
      let isImperial = document.querySelector("#metric").classList.contains("d-none");
      let bmiDisplay = document.querySelector("#bmi_cat_disp")
      if (isImperial) {
        this.bmi.value = this.calcBMIcat(this.calcImpBMI());
      } else {
        this.bmi.value = this.calcBMIcat(this.calcMetBMI());
      }
      switch (this.bmi.value) {
        case "none":
          bmiDisplay.innerText = "Less than 30";
          bmi.value = "none";
          break;
        case "bmi0":
          bmiDisplay.innerText = "30 to 34.9";
          bmi.value = "bmi0";
          break;
        case "bmi1":
          bmiDisplay.innerText = "35 to 39.9";
          bmi.value = "bmi1";
          break;
        case "bmi2":
          bmiDisplay.innerText = "Greater than or equal to 40";
          bmi.value = "bmi2";
          break;
        default:
          bmiDisplay.innerText = "";
          bmi.value = "none";
      }
      this.refreshCovidAge();
    });
  }
}
