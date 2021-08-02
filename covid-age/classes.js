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
    //standard event handler function for most form imputs
    this.handlerObj = {
      handleEvent: (event) => {
        let modString = `${event.target.id}`;
        this[modString].value = event.target.value;
        this.refreshCovidAge();
      },
    };
  }

  // EXPERIMENTAL ENCODING RELATED BLOCK START

  decToBin(dec, length) {
    return (dec >>> 0).toString(2).padStart(length, "0");
  }

  getModText(num, key) {
    if (num == 0) {
      return "none";
    } else {
      return `${key}${num - 1}`;
    }
  }

  decodeData(code) {
    if (code.length != 48) {
      console.error("Invalid code");
      return -1;
    }
    let uU = code.slice(0, 1);
    if (uU != "1") {
      console.error("Invalid code");
      return -1;
    }
    let uAge = parseInt(code.slice(1, 7), 2) + 20;
    let uS = parseInt(code.slice(7, 8), 2) == "0" ? "male" : "female";
    let uEth = this.getModText(parseInt(code.slice(8, 12), 2), "eth");
    let uBmi = this.getModText(parseInt(code.slice(12, 15), 2), "bmi");
    let uAst = this.getModText(parseInt(code.slice(15, 18), 2), "ast");
    let uDia = this.getModText(parseInt(code.slice(18, 22), 2), "db");
    let uKid = this.getModText(parseInt(code.slice(22, 25), 2), "kd");
    let uCan = this.getModText(parseInt(code.slice(25, 28), 2), "nbc");
    let uBcn = this.getModText(parseInt(code.slice(28, 31), 2), "bc");
    let uHrt = this.getModText(parseInt(code.slice(31, 34), 2), "h");
    let uOth = code.slice(34, 43);
    let othArr = [
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
    uOth.split("").forEach((e, i) => {
      if (e == 0) {
        othArr[i].value = "none";
      } else {
        othArr[i].value = `oth${i}`;
      }
    });
    let uPad = code.slice(43);
    if (uPad != "00000") {
      console.error("Invalid code");
      return -1;
    }
    return { uAge, uS, uEth, uBmi, uAst, uDia, uKid, uCan, uBcn, uHrt, othArr };
  }

  setCovidParameters(str) {
    this.importValues(this.decodeData(this.chunkDecode(this.hexToChunks(str))));
  }

  importValues(obj) {
    this.age = obj.uAge;
    this.setModValue("sex", obj.uS);
    this.setModValue("ethnicity", obj.uEth);
    this.setModValue("bmi", obj.uBmi);
    this.setModValue("asthma", obj.uAst);
    this.setModValue("diabetes", obj.uDia);
    this.setModValue("kidney", obj.uKid);
    this.setModValue("nbc", obj.uCan);
    this.setModValue("blood", obj.uBcn);
    this.setModValue("heart", obj.uHrt);
    this.otherModifiers = obj.othArr;

    if (obj.uS == "male") {
      document.querySelector("#female").checked = false;
      document.querySelector("#male").checked = true;
    } else {
      document.querySelector("#female").checked = true;
      document.querySelector("#male").checked = false;
    }

    document.querySelector("#age").value = obj.uAge;
    document.querySelector("#ethnicity").value = obj.uEth;
    document.querySelector("#bmi").value = obj.uBmi;
    document.querySelector("#asthma").value = obj.uAst;
    document.querySelector("#diabetes").value = obj.uDia;
    document.querySelector("#kidney").value = obj.uKid;
    document.querySelector("#nbc").value = obj.uCan;
    document.querySelector("#blood").value = obj.uBcn;
    document.querySelector("#heart").value = obj.uHrt;
    obj.othArr.forEach((e, i) => {
      if (e.value == "none") {
        document.querySelector(`#oth${i}`).checked = false;
      } else {
        document.querySelector(`#oth${i}`).checked = true;
      }
    });

    this.refreshCovidAge();
  }

  setModValue(mod, value) {
    this[mod].value = value;
  }

  encodeData() {
    let uU = "1";
    let uAge = this.decToBin(this.age - 20, 6);
    let uS = this.sex.value == "male" ? "0" : "1";
    let uEth = this.ethnicity.value == "none" ? "0000" : this.decToBin(Number(this.ethnicity.value.slice(-1)) + 1, 4);
    let uBmi = this.bmi.value == "none" ? "000" : this.decToBin(Number(this.bmi.value.slice(-1)) + 1, 3);
    let uAst = this.asthma.value == "none" ? "000" : this.decToBin(Number(this.asthma.value.slice(-1)) + 1, 3);
    let uDia = this.diabetes.value == "none" ? "0000" : this.decToBin(Number(this.diabetes.value.slice(-1)) + 1, 4);
    let uKid = this.kidney.value == "none" ? "000" : this.decToBin(Number(this.kidney.value.slice(-1)) + 1, 3);
    let uCan = this.nbc.value == "none" ? "000" : this.decToBin(Number(this.nbc.value.slice(-1)) + 1, 3);
    let uBcn = this.blood.value == "none" ? "000" : this.decToBin(Number(this.blood.value.slice(-1)) + 1, 3);
    let uHrt = this.heart.value == "none" ? "000" : this.decToBin(Number(this.heart.value.slice(-1)) + 1, 3);
    let uOth = "";
    this.otherModifiers.forEach((e) => {
      if (e.value != "none") {
        uOth += "1";
      } else {
        uOth += "0";
      }
    });
    let uPad = "00000";
    return uU + uAge + uS + uEth + uBmi + uAst + uDia + uKid + uCan + uBcn + uHrt + uOth + uPad;
  }

  splitEncodeChunks(inString) {
    let chunks = [];
    chunks.push(inString.slice(0, 8));
    chunks.push(inString.slice(8, 16));
    chunks.push(inString.slice(16, 24));
    chunks.push(inString.slice(24, 32));
    chunks.push(inString.slice(32, 40));
    chunks.push(inString.slice(40, 48));
    return chunks;
  }

  chunksToHex(arr) {
    let str = "/";
    arr.forEach((e, i) => {
      let xorVal = i * 3;
      str += (parseInt(e, 2) ^ xorVal).toString(16).padStart(2, "0").toUpperCase();
      str += ":";
    });
    return str.substring(0, str.length - 1) + "/";
  }

  hexToChunks(str) {
    return str.substring(1, str.length - 1).split(":");
  }

  chunkDecode(arr) {
    let str = "";
    arr.forEach((e, i) => {
      str += this.decToBin(parseInt(e, 16) ^ (i * 3), 8);
    });
    return str;
  }

  getCovidCode() {
    return this.chunksToHex(this.splitEncodeChunks(this.encodeData()));
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
    this.assignRand("db", "diabetes", 7);
    this.assignRand("kd", "kidney", 3);
    this.assignRand("bmi", "bmi", 4);
    this.assignRand("h", "heart", 3);
    this.assignRand("nbc", "nbc", 4);
    this.assignRand("bc", "blood", 4);
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
    return this.covidAge;
  }

  addListener(target) {
    //generic input listener using logic from object
    target.addEventListener("change", this.handlerObj);
  }

  ageListener() {
    //specialised listener for age changes (this isnt elegant but it sure is easier)
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
    this.calculateCovidAge();
    if (this.covidAge >= 85) {
      document.querySelector("#display").innerText = "85+";
    } else {
      document.querySelector("#display").innerText = `${this.covidAge}`;
    }
    //update covid code
    document.querySelector("#covid_code").innerText = this.getCovidCode();
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
    });
  }
}
