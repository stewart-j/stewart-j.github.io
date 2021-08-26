class Person {
  constructor(age) {
    this.age = age;
    //bias controls randomiser function, testing use only
    this.bias = 4;
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
    //standard event handler function for most form inputs
    this.handlerObj = {
      handleEvent: (event) => {
        console.log(event.target.id);
        let modString = `${event.target.id}`;
        let modCategory = modString.substring(0, 3);
        this.toggleRow(event.target.value, modCategory);
        this[modString].value = event.target.value;
        this.refreshCovidAge();
      },
    };
  }

  //END ENCODING RELATED BLOCK

  generateRandValue(key, count) {
    //generates a random ALAMA value code given a string and the total number of options including "none"
    if (!this.getRandInt(this.bias)) {
      let valNum = this.getRandInt(count - 1) - 1;
      if (valNum == -1) {
        return "none";
      } else {
        return `${key}${valNum}`;
      }
    } else {
      return "none";
    }
  }

  assignRand(short, long, count) {
    //assigns a random value to a modifier given its short key, long name and number of options including "none"
    this[long].value = this.generateRandValue(short, count);
    document.querySelector(`#${long}`).value = this[long].value;
  }

  randomise() {
    //randomises all options
    this.changeAge(this.getRandInt(55) + 20);
    document.querySelector("#age").value = this.age;
    if (this.getRandInt(1)) {
      document.querySelector("#male").checked = true;
      document.querySelector("#female").checked = false;
      this.sex.value = "male";
    } else {
      document.querySelector("#female").checked = true;
      document.querySelector("#male").checked = false;
      this.sex.value = "female";
    }
    this.assignRand("eth", "ethnicity", 5);
    this.assignRand("ast", "asthma", 3);
    this.assignRand("dia", "diabetes", 7);
    this.assignRand("kid", "kidney", 3);
    this.assignRand("bmi", "bmi", 4);
    this.assignRand("hea", "heart", 3);
    this.assignRand("nbc", "nbc", 4);
    this.assignRand("blo", "blood", 4);
    this.otherModifiers.forEach((element, index) => {
      let bias = 9;
      if (!this.getRandInt(bias)) {
        element.value = `oth${index}`;
        document.querySelector(`#oth${index}`).checked = true;
      } else {
        element.value = "none";
        document.querySelector(`#oth${index}`).checked = false;
      }
    });
    this.refreshCovidAge();
  }

  getModValue(prop) {
    //lookup risk value from table based on modifier value and set modifier accordingly
    if (this[prop].value != "none") {
      this[prop].modifier = this.riskValues[this[prop].value];
      if (prop != "ethnicity") {
        modTable.querySelector(`#tv_${this[prop].value}`).innerText = this.riskValues[this[prop].value];
      }
    } else {
      this[prop].modifier = 0;
    }
  }

  calcModValues() {
    //hard code sex because it doesn't vary with age
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
        modTable.querySelector(`#tv_${e.value}`).innerText = this.riskValues[e.value];
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
    return this.covidAge;
  }

  addListener(target) {
    //generic input listener using logic from object
    target.addEventListener("change", this.handlerObj);
  }

  ageListener() {
    //specialised listener for age changes (this isn't elegant but it sure is easier)
    document.querySelector("#age").addEventListener("change", (e) => {
      if (e.target.value < 20) {
        e.target.value = 20;
      }
      if (e.target.value > 75) {
        e.target.value = 75;
      }
      e.target.value = Math.floor(e.target.value);

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
        modTable.querySelector(`#tr_${e.target.value}`).classList.remove("d-none");
      } else {
        this.otherModifiers[index].value = "none";
        modTable.querySelector(`#tr_${e.target.value}`).classList.add("d-none");
      }
      this.refreshCovidAge();
    });
  }

  sexListener(target, sex) {
    if (sex == "female") {
      target.addEventListener("change", (e) => {
        if (e.target.checked) {
          modTable.querySelector("#tr_female").classList.remove("d-none");
          this.sex.value = sex;
        } else {
          modTable.querySelector("#tr_female").classList.add("d-none");
          this.sex.value = "male";
        }
        this.refreshCovidAge();
      });
    } else {
      target.addEventListener("change", (e) => {
        if (e.target.checked) {
          modTable.querySelector("#tr_female").classList.add("d-none");
          this.sex.value = sex;
        } else {
          modTable.querySelector("#tr_female").classList.add("d-none");
          this.sex.value = "male";
        }
        this.refreshCovidAge();
      });
    }
  }

  toggleRow(id, category) {
    let rowID = `#tr_${id}`;
    for (let i = 0; i < 8; i++) {
      let rowChange = modTable.querySelector(`#tr_${category}${i}`);
      if (rowChange) {
        rowChange.classList.add("d-none");
      }
    }
    if (id != "none") {
      modTable.querySelector(rowID).classList.remove("d-none");
    }
  }

  updateIFR() {
    this.calculateCovidAge();
    document.querySelector("#below_20").classList.add("d-none");
    if (this.covidAge < 20) {
      document.querySelector("#below_20").classList.remove("d-none");
    }
    if (this.covidAge >= 85) {
      document.querySelector("#lifr").innerText = ifrValues["85+"].ifr.lifr;
      document.querySelector("#uifr").innerText = ifrValues["85+"].ifr.uifr;
    } else {
      document.querySelector("#lifr").innerText = ifrValues[this.covidAge].ifr.lifr;
      document.querySelector("#uifr").innerText = ifrValues[this.covidAge].ifr.uifr;
    }
  }

  refreshCovidAge() {
    //refresh page display of covid age
    this.calculateCovidAge();
    if (this.covidAge >= 85) {
      document.querySelector("#display").innerText = `${this.age} + ${this.sumModifiers()} = 85+`;
    } else if (this.covidAge < 20) {
      document.querySelector("#display").innerText = `${this.age} - ${Math.abs(this.sumModifiers())} = <20`;
    } else {
      document.querySelector("#display").innerText = `${this.age} + ${this.sumModifiers()} = ${this.covidAge}`;
    }
    document.querySelector("#tbl_total").innerText = `${this.sumModifiers()}`;
    this.updateIFR();
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
    let totalIn = Number(document.querySelector("#imp_inch").value) + Number(document.querySelector("#imp_feet").value * 12);
    let totalLb = Number(document.querySelector("#imp_stn").value * 14) + Number(document.querySelector("#imp_lbs").value);
    let rtnBMI = (totalLb * 703) / totalIn ** 2;
    return Math.round(rtnBMI * 10) / 10;
  }

  calcMetBMI() {
    //calculates BMI based on metric inputs
    let rtnBMI = Number(document.querySelector("#met_kg").value) / Number(document.querySelector("#met_m").value) ** 2;
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

  getRandInt(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  calcListener(target) {
    //special case listener for BMI modal, ugly
    target.addEventListener("click", () => {
      let isImperial = document.querySelector("#metric").classList.contains("d-none");
      let bmiDisplay = document.querySelector("#bmi_cat_disp");
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
      this.toggleRow(this.bmi.value, "bmi");
    });
  }
}
