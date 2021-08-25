"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it =
    (typeof Symbol !== "undefined" && o[Symbol.iterator]) || o["@@iterator"];
  if (!it) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        },
        e: function e(_e) {
          throw _e;
        },
        f: F,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e2) {
      didErr = true;
      err = _e2;
    },
    f: function f() {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    },
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var modTable = document.querySelector("#mod_table tbody");

var Person = /*#__PURE__*/ (function () {
  function Person(age) {
    var _this = this;

    _classCallCheck(this, Person);

    this.age = age; //bias controls randomiser function, testing use only

    this.bias = 4;
    this.riskValues = tables[age].modifiers;
    this.sex = {
      modifier: 0,
      value: "male",
    };
    this.ethnicity = {
      modifier: 0,
      value: "none",
    };
    this.asthma = {
      modifier: 0,
      value: "none",
    };
    this.diabetes = {
      modifier: 0,
      value: "none",
    };
    this.kidney = {
      modifier: 0,
      value: "none",
    };
    this.nbc = {
      modifier: 0,
      value: "none",
    };
    this.blood = {
      modifier: 0,
      value: "none",
    };
    this.heart = {
      modifier: 0,
      value: "none",
    };
    this.bmi = {
      modifier: 0,
      value: "none",
    };
    this.covidAge = age;
    this.otherModifiers = [
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
      {
        modifier: 0,
        value: "none",
      },
    ]; //standard event handler function for most form inputs

    this.handlerObj = {
      handleEvent: function handleEvent(event) {
        var modString = "".concat(event.target.id);
        var modCategory = event.path[1].id.split("_")[0];

        _this.toggleRow(event.target.value, modCategory);

        _this[modString].value = event.target.value;

        _this.refreshCovidAge();
      },
    };
  } // EXPERIMENTAL ENCODING RELATED BLOCK START

  _createClass(Person, [
    {
      key: "decToBin",
      value: function decToBin(dec, length) {
        return (dec >>> 0).toString(2).padStart(length, "0");
      },
    },
    {
      key: "getModText",
      value: function getModText(num, key) {
        if (num == 0) {
          return "none";
        } else {
          return "".concat(key).concat(num - 1);
        }
      },
    },
    {
      key: "decodeData",
      value: function decodeData(code) {
        if (code.length != 48) {
          console.error("Invalid code");
          return -1;
        }

        var uU = code.slice(0, 1);

        if (uU != "1") {
          console.error("Invalid code");
          return -1;
        }

        var uAge = parseInt(code.slice(1, 7), 2) + 20;
        var uS = parseInt(code.slice(7, 8), 2) == "0" ? "male" : "female";
        var uEth = this.getModText(parseInt(code.slice(8, 12), 2), "eth");
        var uBmi = this.getModText(parseInt(code.slice(12, 15), 2), "bmi");
        var uAst = this.getModText(parseInt(code.slice(15, 18), 2), "ast");
        var uDia = this.getModText(parseInt(code.slice(18, 22), 2), "db");
        var uKid = this.getModText(parseInt(code.slice(22, 25), 2), "kd");
        var uCan = this.getModText(parseInt(code.slice(25, 28), 2), "nbc");
        var uBcn = this.getModText(parseInt(code.slice(28, 31), 2), "bc");
        var uHrt = this.getModText(parseInt(code.slice(31, 34), 2), "h");
        var uOth = code.slice(34, 43);
        var othArr = [
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
        ];
        uOth.split("").forEach(function (e, i) {
          if (e == 0) {
            othArr[i].value = "none";
          } else {
            othArr[i].value = "oth".concat(i);
          }
        });
        var uPad = code.slice(43);

        if (uPad != "00000") {
          console.error("Invalid code");
          return -1;
        }

        return {
          uAge: uAge,
          uS: uS,
          uEth: uEth,
          uBmi: uBmi,
          uAst: uAst,
          uDia: uDia,
          uKid: uKid,
          uCan: uCan,
          uBcn: uBcn,
          uHrt: uHrt,
          othArr: othArr,
        };
      },
    },
    {
      key: "setCovidParameters",
      value: function setCovidParameters(str) {
        this.importValues(
          this.decodeData(this.chunkDecode(this.hexToChunks(str)))
        );
      },
    },
    {
      key: "importValues",
      value: function importValues(obj) {
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
        obj.othArr.forEach(function (e, i) {
          if (e.value == "none") {
            document.querySelector("#oth".concat(i)).checked = false;
          } else {
            document.querySelector("#oth".concat(i)).checked = true;
          }
        });
        this.refreshCovidAge();
      },
    },
    {
      key: "setModValue",
      value: function setModValue(mod, value) {
        this[mod].value = value;
      },
    },
    {
      key: "encodeData",
      value: function encodeData() {
        var uU = "1";
        var uAge = this.decToBin(this.age - 20, 6);
        var uS = this.sex.value == "male" ? "0" : "1";
        var uEth =
          this.ethnicity.value == "none"
            ? "0000"
            : this.decToBin(Number(this.ethnicity.value.slice(-1)) + 1, 4);
        var uBmi =
          this.bmi.value == "none"
            ? "000"
            : this.decToBin(Number(this.bmi.value.slice(-1)) + 1, 3);
        var uAst =
          this.asthma.value == "none"
            ? "000"
            : this.decToBin(Number(this.asthma.value.slice(-1)) + 1, 3);
        var uDia =
          this.diabetes.value == "none"
            ? "0000"
            : this.decToBin(Number(this.diabetes.value.slice(-1)) + 1, 4);
        var uKid =
          this.kidney.value == "none"
            ? "000"
            : this.decToBin(Number(this.kidney.value.slice(-1)) + 1, 3);
        var uCan =
          this.nbc.value == "none"
            ? "000"
            : this.decToBin(Number(this.nbc.value.slice(-1)) + 1, 3);
        var uBcn =
          this.blood.value == "none"
            ? "000"
            : this.decToBin(Number(this.blood.value.slice(-1)) + 1, 3);
        var uHrt =
          this.heart.value == "none"
            ? "000"
            : this.decToBin(Number(this.heart.value.slice(-1)) + 1, 3);
        var uOth = "";
        this.otherModifiers.forEach(function (e) {
          if (e.value != "none") {
            uOth += "1";
          } else {
            uOth += "0";
          }
        });
        var uPad = "00000";
        return (
          uU +
          uAge +
          uS +
          uEth +
          uBmi +
          uAst +
          uDia +
          uKid +
          uCan +
          uBcn +
          uHrt +
          uOth +
          uPad
        );
      },
    },
    {
      key: "splitEncodeChunks",
      value: function splitEncodeChunks(inString) {
        var chunks = [];
        chunks.push(inString.slice(0, 8));
        chunks.push(inString.slice(8, 16));
        chunks.push(inString.slice(16, 24));
        chunks.push(inString.slice(24, 32));
        chunks.push(inString.slice(32, 40));
        chunks.push(inString.slice(40, 48));
        return chunks;
      },
    },
    {
      key: "chunksToHex",
      value: function chunksToHex(arr) {
        var str = "/";
        arr.forEach(function (e, i) {
          var xorVal = i * 3;
          str += (parseInt(e, 2) ^ xorVal)
            .toString(16)
            .padStart(2, "0")
            .toUpperCase();
          str += ":";
        });
        return str.substring(0, str.length - 1) + "/";
      },
    },
    {
      key: "hexToChunks",
      value: function hexToChunks(str) {
        return str.substring(1, str.length - 1).split(":");
      },
    },
    {
      key: "chunkDecode",
      value: function chunkDecode(arr) {
        var _this2 = this;

        var str = "";
        arr.forEach(function (e, i) {
          str += _this2.decToBin(parseInt(e, 16) ^ (i * 3), 8);
        });
        return str;
      },
    },
    {
      key: "getCovidCode",
      value: function getCovidCode() {
        return this.chunksToHex(this.splitEncodeChunks(this.encodeData()));
      }, //END ENCODING RELATED BLOCK
    },
    {
      key: "generateRandValue",
      value: function generateRandValue(key, count) {
        //generates a random ALAMA value code given a string and the total number of options including "none"
        if (!this.getRandInt(this.bias)) {
          var valNum = this.getRandInt(count - 1) - 1;

          if (valNum == -1) {
            return "none";
          } else {
            return "".concat(key).concat(valNum);
          }
        } else {
          return "none";
        }
      },
    },
    {
      key: "assignRand",
      value: function assignRand(short, long, count) {
        //assigns a random value to a modifier given its short key, long name and number of options including "none"
        this[long].value = this.generateRandValue(short, count);
        document.querySelector("#".concat(long)).value = this[long].value;
      },
    },
    {
      key: "randomise",
      value: function randomise() {
        var _this3 = this;

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
        this.otherModifiers.forEach(function (element, index) {
          var bias = 9;

          if (!_this3.getRandInt(bias)) {
            element.value = "oth".concat(index);
            document.querySelector("#oth".concat(index)).checked = true;
          } else {
            element.value = "none";
            document.querySelector("#oth".concat(index)).checked = false;
          }
        });
        this.refreshCovidAge();
      },
    },
    {
      key: "getModValue",
      value: function getModValue(prop) {
        //lookup risk value from table based on modifier value and set modifier accordingly
        if (this[prop].value != "none") {
          this[prop].modifier = this.riskValues[this[prop].value];

          if (prop != "ethnicity") {
            modTable.querySelector("#tv_".concat(this[prop].value)).innerText =
              this.riskValues[this[prop].value];
          }
        } else {
          this[prop].modifier = 0;
        }
      },
    },
    {
      key: "calcModValues",
      value: function calcModValues() {
        var _this4 = this;

        //hard code sex because it doesn't vary with age
        if (this.sex.value == "female") {
          this.sex.modifier = -5;
        } else {
          this.sex.modifier = 0;
        } //set all modifiers according to values

        this.getModValue("ethnicity");
        this.getModValue("asthma");
        this.getModValue("diabetes");
        this.getModValue("kidney");
        this.getModValue("nbc");
        this.getModValue("blood");
        this.getModValue("heart");
        this.getModValue("bmi");
        this.otherModifiers.forEach(function (e) {
          if (e.value != "none") {
            e.modifier = _this4.riskValues[e.value];
            modTable.querySelector("#tv_".concat(e.value)).innerText =
              _this4.riskValues[e.value];
          } else {
            e.modifier = 0;
          }
        });
      },
    },
    {
      key: "changeAge",
      value: function changeAge(age) {
        //update age property and refresh risk values based on age
        this.age = age;
        this.riskValues = tables[age].modifiers;
      },
    },
    {
      key: "sumOthers",
      value: function sumOthers() {
        //ugly sum all 9 checkbox modifiers because im too dumb for map/reduce when it has layers
        var count = 0;
        this.otherModifiers.forEach(function (e) {
          count += e.modifier;
        });
        return count;
      },
    },
    {
      key: "sumModifiers",
      value: function sumModifiers() {
        //refresh all modifiers then ugly sum them all together
        this.calcModValues();
        return (
          this.sex.modifier +
          this.ethnicity.modifier +
          this.asthma.modifier +
          this.diabetes.modifier +
          this.kidney.modifier +
          this.nbc.modifier +
          this.blood.modifier +
          this.heart.modifier +
          this.bmi.modifier +
          this.sumOthers()
        );
      },
    },
    {
      key: "calculateCovidAge",
      value: function calculateCovidAge() {
        //set covid age property based on actual age + modifiers, set it to "85+" as per ALAMA methodology if too high
        this.covidAge = this.age + this.sumModifiers();
        return this.covidAge;
      },
    },
    {
      key: "addListener",
      value: function addListener(target) {
        //generic input listener using logic from object
        target.addEventListener("change", this.handlerObj);
      },
    },
    {
      key: "ageListener",
      value: function ageListener() {
        var _this5 = this;

        //specialised listener for age changes (this isn't elegant but it sure is easier)
        document.querySelector("#age").addEventListener("change", function (e) {
          if (e.target.value < 20) {
            e.target.value = 20;
          }

          if (e.target.value > 75) {
            e.target.value = 75;
          }

          e.target.value = Math.floor(e.target.value);

          _this5.changeAge(Number(e.target.value));

          _this5.refreshCovidAge();
        });
      },
    },
    {
      key: "otherListener",
      value: function otherListener(target) {
        var _this6 = this;

        //another specialised listener for the 9 checkboxes
        target.addEventListener("change", function (e) {
          var index = Number(e.target.value.slice(-1, 4));

          if (e.target.checked) {
            _this6.otherModifiers[index].value = e.target.value;
            modTable
              .querySelector("#tr_".concat(e.target.value))
              .classList.remove("d-none");
          } else {
            _this6.otherModifiers[index].value = "none";
            modTable
              .querySelector("#tr_".concat(e.target.value))
              .classList.add("d-none");
          }

          _this6.refreshCovidAge();
        });
      },
    },
    {
      key: "sexListener",
      value: function sexListener(target, sex) {
        var _this7 = this;

        if (sex == "female") {
          target.addEventListener("change", function (e) {
            if (e.target.checked) {
              modTable.querySelector("#tr_female").classList.remove("d-none");
              _this7.sex.value = sex;
            } else {
              modTable.querySelector("#tr_female").classList.add("d-none");
              _this7.sex.value = "male";
            }

            _this7.refreshCovidAge();
          });
        } else {
          target.addEventListener("change", function (e) {
            if (e.target.checked) {
              modTable.querySelector("#tr_female").classList.add("d-none");
              _this7.sex.value = sex;
            } else {
              modTable.querySelector("#tr_female").classList.add("d-none");
              _this7.sex.value = "male";
            }

            _this7.refreshCovidAge();
          });
        }
      },
    },
    {
      key: "toggleRow",
      value: function toggleRow(id, category) {
        var rowID = "#tr_".concat(id);

        for (var i = 0; i < 8; i++) {
          var rowChange = modTable.querySelector(
            "#tr_".concat(category).concat(i)
          );

          if (rowChange) {
            rowChange.classList.add("d-none");
          }
        }

        if (id != "none") {
          modTable.querySelector(rowID).classList.remove("d-none");
        }
      },
    },
    {
      key: "updateIFR",
      value: function updateIFR() {
        this.calculateCovidAge();
        document.querySelector("#below_20").classList.add("d-none");

        if (this.covidAge < 20) {
          document.querySelector("#below_20").classList.remove("d-none");
        }

        if (this.covidAge >= 85) {
          document.querySelector("#lifr").innerText = ifrValues["85+"].ifr.lifr;
          document.querySelector("#uifr").innerText = ifrValues["85+"].ifr.uifr;
        } else {
          document.querySelector("#lifr").innerText =
            ifrValues[this.covidAge].ifr.lifr;
          document.querySelector("#uifr").innerText =
            ifrValues[this.covidAge].ifr.uifr;
        }
      },
    },
    {
      key: "refreshCovidAge",
      value: function refreshCovidAge() {
        //refresh page display of covid age
        this.calculateCovidAge();

        if (this.covidAge >= 85) {
          document.querySelector("#display").innerText = ""
            .concat(this.age, " + ")
            .concat(this.sumModifiers(), " = 85+");
        } else if (this.covidAge < 20) {
          document.querySelector("#display").innerText = ""
            .concat(this.age, " - ")
            .concat(Math.abs(this.sumModifiers()), " = <20");
        } else {
          document.querySelector("#display").innerText = ""
            .concat(this.age, " + ")
            .concat(this.sumModifiers(), " = ")
            .concat(this.covidAge);
        }

        document.querySelector("#tbl_total").innerText = "".concat(
          this.sumModifiers()
        );
        this.updateIFR();
      },
    },
    {
      key: "initialiseValues",
      value: function initialiseValues() {
        //resets all the basic properties to default, unused
        this.age = Number(document.querySelector("#age").value);
        this.riskValues = tables[age].modifiers;
        this.sex = {
          modifier: 0,
          value: "male",
        };
        this.ethnicity = {
          modifier: 0,
          value: "none",
        };
        this.asthma = {
          modifier: 0,
          value: "none",
        };
        this.diabetes = {
          modifier: 0,
          value: "none",
        };
        this.kidney = {
          modifier: 0,
          value: "none",
        };
        this.nbc = {
          modifier: 0,
          value: "none",
        };
        this.blood = {
          modifier: 0,
          value: "none",
        };
        this.heart = {
          modifier: 0,
          value: "none",
        };
        this.bmi = {
          modifier: 0,
          value: "none",
        };
        this.covidAge = age;
        this.otherModifiers = [
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
          {
            modifier: 0,
            value: "none",
          },
        ];
      },
    },
    {
      key: "calcImpBMI",
      value: function calcImpBMI() {
        //calculates BMI based on imperial inputs
        var totalIn =
          Number(document.querySelector("#imp_inch").value) +
          Number(document.querySelector("#imp_feet").value * 12);
        var totalLb =
          Number(document.querySelector("#imp_stn").value * 14) +
          Number(document.querySelector("#imp_lbs").value);
        var rtnBMI = (totalLb * 703) / Math.pow(totalIn, 2);
        return Math.round(rtnBMI * 10) / 10;
      },
    },
    {
      key: "calcMetBMI",
      value: function calcMetBMI() {
        //calculates BMI based on metric inputs
        var rtnBMI =
          Number(document.querySelector("#met_kg").value) /
          Math.pow(Number(document.querySelector("#met_m").value), 2);
        return Math.round(rtnBMI * 10) / 10;
      },
    },
    {
      key: "calcBMIcat",
      value: function calcBMIcat(bmi) {
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
      },
    },
    {
      key: "getRandInt",
      value: function getRandInt(max) {
        return Math.floor(Math.random() * (max + 1));
      },
    },
    {
      key: "calcListener",
      value: function calcListener(target) {
        var _this8 = this;

        //special case listener for BMI modal, ugly
        target.addEventListener("click", function () {
          var isImperial = document
            .querySelector("#metric")
            .classList.contains("d-none");
          var bmiDisplay = document.querySelector("#bmi_cat_disp");

          if (isImperial) {
            _this8.bmi.value = _this8.calcBMIcat(_this8.calcImpBMI());
          } else {
            _this8.bmi.value = _this8.calcBMIcat(_this8.calcMetBMI());
          }

          switch (_this8.bmi.value) {
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

          _this8.refreshCovidAge();

          _this8.toggleRow(_this8.bmi.value, "bmi");
        });
      },
    },
  ]);

  return Person;
})(); //BMI Modal unit toggle listeners

document.querySelector("#imp_toggle").addEventListener("click", function () {
  document.querySelector("#imperial").classList.remove("d-none");
  document.querySelector("#metric").classList.add("d-none");
});
document.querySelector("#met_toggle").addEventListener("click", function () {
  document.querySelector("#imperial").classList.add("d-none");
  document.querySelector("#metric").classList.remove("d-none");
}); //instantiate new person

var user = new Person(20); //add listener events to form inputs

user.ageListener();
user.sexListener(document.querySelector("#female"), "female");
user.sexListener(document.querySelector("#male"), "male");
user.calcListener(document.querySelector("#bmi_calc"));
user.addListener(document.querySelector("#ethnicity"));
user.addListener(document.querySelector("#bmi"));
user.addListener(document.querySelector("#asthma"));
user.addListener(document.querySelector("#diabetes"));
user.addListener(document.querySelector("#kidney"));
user.addListener(document.querySelector("#nbc"));
user.addListener(document.querySelector("#blood"));
user.addListener(document.querySelector("#heart"));

var _iterator = _createForOfIteratorHelper(
    document.querySelectorAll("#oth_grp input")
  ),
  _step;

try {
  for (_iterator.s(); !(_step = _iterator.n()).done; ) {
    var check = _step.value;
    user.otherListener(check);
  }
} catch (err) {
  _iterator.e(err);
} finally {
  _iterator.f();
}

var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});
var popoverTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="popover"]')
);
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl);
}); //testing functions
// document.addEventListener("keydown", function (e) {
//   if (e.altKey && e.key === "r") {
//     user.randomise();
//   }
// });
// document.addEventListener("keydown", function (e) {
//   if (e.altKey && e.key === "g") {
//     document.querySelector("#covid_code").classList.toggle("d-none");
//     document.querySelector("#age_display_block").classList.toggle("bg-primary");
//     document.querySelector("#age_display_block").classList.toggle("bg-success");
//     document.querySelector("#dev_mode").classList.toggle("d-none");
//   }
// });
//end testing functions
//initial age display refresh

user.refreshCovidAge();
