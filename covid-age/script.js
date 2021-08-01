//BMI Modal unit toggle listeners
document.querySelector("#imp_toggle").addEventListener("click", () => {
  document.querySelector("#imperial").classList.remove("d-none");
  document.querySelector("#metric").classList.add("d-none");
});

document.querySelector("#met_toggle").addEventListener("click", () => {
  document.querySelector("#imperial").classList.add("d-none");
  document.querySelector("#metric").classList.remove("d-none");
});

//instantiate new person
const user = new Person(20);

//add listener events to form inputs
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
for (let check of document.querySelectorAll(".oth_grp input")) {
  user.otherListener(check);
}

//testing functions

document.addEventListener("keydown", function (e) {
  if (e.altKey && e.key === "r") {
    user.randomise();
  }
});

document.addEventListener("keydown", function (e) {
  if (e.altKey && e.key === "g") {
    document.querySelector("#covid_code").classList.toggle("d-none");
    document.querySelector("#age_display_block").classList.toggle("bg-primary");
    document.querySelector("#age_display_block").classList.toggle("bg-info");
  }
});

//end testing functions

//initial age display refresh
user.refreshCovidAge();
