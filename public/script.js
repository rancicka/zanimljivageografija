const firebaseConfig = {
  apiKey: "AIzaSyCBZcKe2-EJCVSeQUxE9idHSKGFLKBIIiU",
  authDomain: "zgeografija-cefd4.firebaseapp.com",
  databaseURL: "https://zgeografija-cefd4.firebaseio.com",
  projectId: "zgeografija-cefd4",
  storageBucket: "zgeografija-cefd4.appspot.com",
  messagingSenderId: "3031698003",
  appId: "1:3031698003:web:32f8ebb0d7550bd6b094a6",
  measurementId: "G-B28RRW4H57"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let loggedInUser = localStorage.getItem("user") || "";
let interval = null;

const letters = [
  "A",
  "B",
  "C",
  "Č",
  "Ć",
  "D",
  "Dž",
  "Đ",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "Lj",
  "M",
  "N",
  "Nj",
  "O",
  "P",
  "R",
  "S",
  "Š",
  "T",
  "U",
  "V",
  "Z",
  "Ž"
];

const loginForm = document.querySelector(".login-form");
const loggedInMessage = document.querySelector(".logged-in-message");
const termsForm = document.querySelector(".terms-form");
const hallOfFame = document.querySelector(".hall-of-fame");
const hallOfFameList = document.querySelector(".hall-of-fame ul");
const vsPcForm = document.querySelector(".vs-pc-form");

const logout = document.querySelector(".logout");
const termSuggest = document.querySelector(".term-suggest");
const hallButton = document.querySelector(".hall-button");
const vsPc = document.querySelector(".vs-pc");

const username = document.querySelector(".username");
const category = document.querySelector(".category");
const term = document.querySelector(".term");
const vsPcStart = document.querySelector(".vs-pc-start");
const vsPcRepeat = document.querySelector(".vs-pc-repeat");
const vsPcGame = document.querySelector(".vs-pc-game");
const vsPcSubmit = document.querySelector(".vs-pc-submit");
const timerTime = document.querySelector(".timer-time");
const firstLetterText = document.querySelector(".first-letter");

const pcDrzava = document.querySelector(".pc-drzava");
const pcGrad = document.querySelector(".pc-grad");
const pcReka = document.querySelector(".pc-reka");
const pcPlanina = document.querySelector(".pc-planina");
const pcBiljka = document.querySelector(".pc-biljka");
const pcZivotinja = document.querySelector(".pc-zivotinja");
const pcPredmet = document.querySelector(".pc-predmet");
let userPoints = 0;
let pcPoints = 0;

if (loggedInUser) {
  loginForm.classList.add("hidden");
  termSuggest.classList.remove("disabled");
  hallButton.classList.remove("disabled");
  vsPc.classList.remove("disabled");
  logout.classList.remove("disabled");
  loggedInMessage.classList.remove("hidden");
  loggedInMessage.textContent = `Welcome ${loggedInUser}!`;
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loggedInUser = username.value;
  localStorage.setItem("user", loggedInUser);

  loginForm.classList.add("hidden");
  loggedInMessage.classList.remove("hidden");
  loggedInMessage.textContent = `Welcome ${loggedInUser}!`;
  termSuggest.classList.remove("disabled");
  hallButton.classList.remove("disabled");
  vsPc.classList.remove("disabled");
  logout.classList.remove("disabled");
});

logout.addEventListener("click", () => {
  if (loggedInUser) {
    localStorage.removeItem("user");
    loggedInUser = "";
    loginForm.classList.remove("hidden");
    loggedInMessage.classList.add("hidden");
    hallOfFame.classList.add("hidden");
    termsForm.classList.add("hidden");
    vsPcForm.classList.add("hidden");
    termSuggest.classList.add("disabled");
    hallButton.classList.add("disabled");
    vsPc.classList.add("disabled");
    logout.classList.add("disabled");
  }
});

termSuggest.addEventListener("click", () => {
  if (loggedInUser) {
    loggedInMessage.classList.add("hidden");
    hallOfFame.classList.add("hidden");
    termsForm.classList.remove("hidden");
    vsPcForm.classList.add("hidden");
  }
});

hallButton.addEventListener("click", () => {
  if (loggedInUser) {

    hallOfFameList.innerHTML = "";

    loggedInMessage.classList.add("hidden");
    hallOfFame.classList.remove("hidden");
    termsForm.classList.add("hidden");
    vsPcForm.classList.add("hidden");

    db.collection("pojmovi")
      .get()
      .then((querySnapshot) => {
        const hallOfFameUsers = {};

        querySnapshot.forEach((doc) => {
          const user = doc.data().korisnik;
          hallOfFameUsers[user] = hallOfFameUsers[user] ? ++hallOfFameUsers[user] : 1;
        });

        Object.keys(hallOfFameUsers)
          .sort((a, b) => hallOfFameUsers[b] - hallOfFameUsers[a])
          .forEach((user, i) => {
            if (i === 4) {
              return false;
            }

            const hallOfFameListItem = document.createElement("li");
            hallOfFameListItem.textContent = `${i + 1}. ${user}: ${hallOfFameUsers[user]}`;

            hallOfFameList.appendChild(hallOfFameListItem);
          });
      });
  }
});

vsPc.addEventListener("click", () => {
  if (loggedInUser) {
    loggedInMessage.classList.add("hidden");
    hallOfFame.classList.add("hidden");
    termsForm.classList.add("hidden");
    vsPcForm.classList.remove("hidden");
  }
});

function startTheGame (event) {
  event.preventDefault();
  vsPcGame.classList.remove("hidden");
  vsPcStart.classList.add("hidden");
  pcDrzava.classList.add("hidden");
  pcGrad.classList.add("hidden");
  pcReka.classList.add("hidden");
  pcPlanina.classList.add("hidden");
  pcBiljka.classList.add("hidden");
  pcZivotinja.classList.add("hidden");
  pcPredmet.classList.add("hidden");
  userPoints = 0;
  pcPoints = 0;
  firstLetterText.textContent = letters[Math.floor(Math.random() * 5)];

  interval = setInterval(() => {
    if (timerTime.textContent === "0") {
      clearInterval(interval);
      vsPcForm.submit();
    }
    timerTime.textContent = String(+timerTime.textContent - 1);
  }, 1000);

  vsPcSubmit.classList.remove("hidden");
  vsPcRepeat.classList.add("hidden");
}

vsPcStart.addEventListener("click", startTheGame);
vsPcRepeat.addEventListener("click", startTheGame);

vsPcForm.addEventListener("submit", (event) => {
  event.preventDefault();
  clearInterval(interval);

  const userDrzava = document.querySelector(".user-drzava");
  const userGrad = document.querySelector(".user-grad");
  const userReka = document.querySelector(".user-reka");
  const userPlanina = document.querySelector(".user-planina");
  const userBiljka = document.querySelector(".user-biljka");
  const userZivotinja = document.querySelector(".user-zivotinja");
  const userPredmet = document.querySelector(".user-predmet");

  pcDrzava.classList.remove("hidden");
  pcGrad.classList.remove("hidden");
  pcReka.classList.remove("hidden");
  pcPlanina.classList.remove("hidden");
  pcBiljka.classList.remove("hidden");
  pcZivotinja.classList.remove("hidden");
  pcPredmet.classList.remove("hidden");

  ["država", "grad", "reka", "planina", "biljka", "životinja", "predmet"].forEach((kategorija) => {
    const randomNumber = Math.random();
    if (randomNumber <= 0.8) {
      db.collection("pojmovi")
        .where("pocetnoSlovo", "==", firstLetterText.textContent)
        .where("kategorija", "==", kategorija)
        .get()
        .then((querySnapshot) => {
          const foundTerms = [];
          querySnapshot.forEach((doc) => foundTerms.push(doc.data().pojam));
          const foundTerm = foundTerms[Math.floor(Math.random() * foundTerms.length)];

          switch (kategorija) {
            case "država":
              pcDrzava.querySelector("#pc-drzava-input").textContent = foundTerm;
              if (userDrzava.querySelector("#user-drzava-input").value === foundTerm) {
                userDrzava.querySelector(".points").textContent = "+5";
                pcDrzava.querySelector(".points").textContent = "+5";
                userPoints += 5;
                pcPoints += 5;
              } else if (userDrzava.querySelector("#user-drzava-input").value === "") {
                userDrzava.querySelector(".points").textContent = "+0";
                pcDrzava.querySelector(".points").textContent = "+15";
                pcPoints += 15;
              } else if (userDrzava.querySelector("#user-drzava-input").value !== foundTerm) {
                userDrzava.querySelector(".points").textContent = "+10";
                pcDrzava.querySelector(".points").textContent = "+10";
                userPoints += 10;
                pcPoints += 10;
              }
              break;
            case "grad":
              pcGrad.querySelector("#pc-grad-input").textContent = foundTerm;
              if (userGrad.querySelector("#user-grad-input").value === foundTerm) {
                userGrad.querySelector(".points").textContent = "+5";
                pcGrad.querySelector(".points").textContent = "+5";
                userPoints += 5;
                pcPoints += 5;
              } else if (userGrad.querySelector("#user-grad-input").value === "") {
                userGrad.querySelector(".points").textContent = "+0";
                pcGrad.querySelector(".points").textContent = "+15";
                pcPoints += 15;
              } else if (userGrad.querySelector("#user-grad-input").value !== foundTerm) {
                userGrad.querySelector(".points").textContent = "+10";
                pcGrad.querySelector(".points").textContent = "+10";
                userPoints += 10;
                pcPoints += 10;
              }
              break;
            case "reka":
              pcReka.querySelector("#pc-reka-input").textContent = foundTerm;
              if (userReka.querySelector("#user-reka-input").value === foundTerm) {
                userReka.querySelector(".points").textContent = "+5";
                pcReka.querySelector(".points").textContent = "+5";
                userPoints += 5;
                pcPoints += 5;
              } else if (userReka.querySelector("#user-reka-input").value === "") {
                userReka.querySelector(".points").textContent = "+0";
                pcReka.querySelector(".points").textContent = "+15";
                pcPoints += 15;
              } else if (userReka.querySelector("#user-reka-input").value !== foundTerm) {
                userReka.querySelector(".points").textContent = "+10";
                pcReka.querySelector(".points").textContent = "+10";
                userPoints += 10;
                pcPoints += 10;
              }
              break;
            case "planina":
              pcPlanina.querySelector("#pc-planina-input").textContent = foundTerm;
              if (userPlanina.querySelector("#user-planina-input").value === foundTerm) {
                userPlanina.querySelector(".points").textContent = "+5";
                pcPlanina.querySelector(".points").textContent = "+5";
                userPoints += 5;
                pcPoints += 5;
              } else if (userPlanina.querySelector("#user-planina-input").value === "") {
                userPlanina.querySelector(".points").textContent = "+0";
                pcPlanina.querySelector(".points").textContent = "+15";
                pcPoints += 15;
              } else if (userPlanina.querySelector("#user-planina-input").value !== foundTerm) {
                userPlanina.querySelector(".points").textContent = "+10";
                pcPlanina.querySelector(".points").textContent = "+10";
                userPoints += 10;
                pcPoints += 10;
              }
              break;
            case "biljka":
              pcBiljka.querySelector("#pc-biljka-input").textContent = foundTerm;
              if (userBiljka.querySelector("#user-biljka-input").value === foundTerm) {
                userBiljka.querySelector(".points").textContent = "+5";
                pcBiljka.querySelector(".points").textContent = "+5";
                userPoints += 5;
                pcPoints += 5;
              } else if (userBiljka.querySelector("#user-biljka-input").value === "") {
                userBiljka.querySelector(".points").textContent = "+0";
                pcBiljka.querySelector(".points").textContent = "+15";
                pcPoints += 15;
              } else if (userBiljka.querySelector("#user-biljka-input").value !== foundTerm) {
                userBiljka.querySelector(".points").textContent = "+10";
                pcBiljka.querySelector(".points").textContent = "+10";
                userPoints += 10;
                pcPoints += 10;
              }
              break;
            case "životinja":
              pcZivotinja.querySelector("#pc-zivotinja-input").textContent = foundTerm;
              if (userZivotinja.querySelector("#user-zivotinja-input").value === foundTerm) {
                userZivotinja.querySelector(".points").textContent = "+5";
                pcZivotinja.querySelector(".points").textContent = "+5";
                userPoints += 5;
                pcPoints += 5;
              } else if (userZivotinja.querySelector("#user-zivotinja-input").value === "") {
                userZivotinja.querySelector(".points").textContent = "+0";
                pcZivotinja.querySelector(".points").textContent = "+15";
                pcPoints += 15;
              } else if (userZivotinja.querySelector("#user-zivotinja-input").value !== foundTerm) {
                userZivotinja.querySelector(".points").textContent = "+10";
                pcZivotinja.querySelector(".points").textContent = "+10";
                userPoints += 10;
                pcPoints += 10;
              }
              break;
            case "predmet":
              pcPredmet.querySelector("#pc-predmet-input").textContent = foundTerm;
              if (userPredmet.querySelector("#user-predmet-input").value === foundTerm) {
                userPredmet.querySelector(".points").textContent = "+5";
                pcPredmet.querySelector(".points").textContent = "+5";
                userPoints += 5;
                pcPoints += 5;
              } else if (userPredmet.querySelector("#user-predmet-input").value === "") {
                userPredmet.querySelector(".points").textContent = "+0";
                pcPredmet.querySelector(".points").textContent = "+15";
                pcPoints += 15;
              } else if (userPredmet.querySelector("#user-predmet-input").value !== foundTerm) {
                userPredmet.querySelector(".points").textContent = "+10";
                pcPredmet.querySelector(".points").textContent = "+10";
                userPoints += 10;
                pcPoints += 10;
              }
              break;
          }
        });
    } else {
      switch (kategorija) {
        case "država":
          pcDrzava.querySelector("#pc-drzava-input").textContent = "Ne zna odgovor";
          if (userDrzava.querySelector("#user-drzava-input").value) {
            userDrzava.querySelector(".points").textContent = "+15";
            pcDrzava.querySelector(".points").textContent = "+0";
            userPoints += 15;
          } else {
            userDrzava.querySelector(".points").textContent = "+0";
            pcDrzava.querySelector(".points").textContent = "+0";
          }
          break;
        case "grad":
          pcGrad.querySelector("#pc-grad-input").textContent = "Ne zna odgovor";
          if (userGrad.querySelector("#user-grad-input").value) {
            userGrad.querySelector(".points").textContent = "+15";
            pcGrad.querySelector(".points").textContent = "+0";
            userPoints += 15;
          } else {
            userGrad.querySelector(".points").textContent = "+0";
            pcGrad.querySelector(".points").textContent = "+0";
          }
          break;
        case "reka":
          pcReka.querySelector("#pc-reka-input").textContent = "Ne zna odgovor";
          if (userReka.querySelector("#user-reka-input").value) {
            userReka.querySelector(".points").textContent = "+15";
            pcReka.querySelector(".points").textContent = "+0";
            userPoints += 15;
          } else {
            userReka.querySelector(".points").textContent = "+0";
            pcReka.querySelector(".points").textContent = "+0";
          }
          break;
        case "planina":
          pcPlanina.querySelector("#pc-planina-input").textContent = "Ne zna odgovor";
          if (userPlanina.querySelector("#user-planina-input").value) {
            userPlanina.querySelector(".points").textContent = "+15";
            pcPlanina.querySelector(".points").textContent = "+0";
            userPoints += 15;
          } else {
            userPlanina.querySelector(".points").textContent = "+0";
            pcPlanina.querySelector(".points").textContent = "+0";
          }
          break;
        case "biljka":
          pcBiljka.querySelector("#pc-biljka-input").textContent = "Ne zna odgovor";
          if (userBiljka.querySelector("#user-biljka-input").value) {
            userBiljka.querySelector(".points").textContent = "+15";
            pcBiljka.querySelector(".points").textContent = "+0";
            userPoints += 15;
          } else {
            userBiljka.querySelector(".points").textContent = "+0";
            pcBiljka.querySelector(".points").textContent = "+0";
          }
          break;
        case "životinja":
          pcZivotinja.querySelector("#pc-zivotinja-input").textContent = "Ne zna odgovor";
          if (userZivotinja.querySelector("#user-zivotinja-input").value) {
            userZivotinja.querySelector(".points").textContent = "+15";
            pcZivotinja.querySelector(".points").textContent = "+0";
            userPoints += 15;
          } else {
            userZivotinja.querySelector(".points").textContent = "+0";
            pcZivotinja.querySelector(".points").textContent = "+0";
          }
          break;
        case "predmet":
          pcPredmet.querySelector("#pc-predmet-input").textContent = "Ne zna odgovor";
          if (userPredmet.querySelector("#user-predmet-input").value) {
            userPredmet.querySelector(".points").textContent = "+15";
            pcPredmet.querySelector(".points").textContent = "+0";
            userPoints += 15;
          } else {
            userPredmet.querySelector(".points").textContent = "+0";
            pcPredmet.querySelector(".points").textContent = "+0";
          }
          break;
      }
    }
  });

  vsPcSubmit.classList.add("hidden");

  setTimeout(() => {
    if (userPoints > pcPoints) {
      alert('Pobedio je korisnik');
    } else if (userPoints < pcPoints) {
      alert('Pobedio je kompjuter');
    } else {
      alert('Nereseno je');
    }

    vsPcRepeat.classList.remove("hidden");
  }, 2000);
});

termsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const strippedTerm = term.value.replace(/[^A-ZđžščćĐŽŠČĆ]+/gi, "").toLowerCase();
  let firstLetter = strippedTerm[0].toUpperCase();
  const formattedTerm = firstLetter + strippedTerm.slice(1);

    if ((firstLetter === "N" || firstLetter === "L") && (strippedTerm[1] === "j")) {
      firstLetter += "j"
    } else if ((firstLetter === "D") && (strippedTerm[1] === "ž")) {
      firstLetter += "ž"
    }

  console.log(strippedTerm, firstLetter);

  db.collection("pojmovi")
    .get()
    .then((querySnapshot) => {
      let isTermFree = true;

      querySnapshot.forEach((doc) => {
        if (doc.data().kategorija === category.value && doc.data().pojam === formattedTerm) {
          isTermFree = false;
        }
      });

      if (isTermFree) {
        db.collection("pojmovi").add({
          kategorija: category.value,
          korisnik: loggedInUser,
          pocetnoSlovo: firstLetter,
          pojam: formattedTerm,
          vreme: new Date(),
        });
      } else {
        alert("Pojam već postoji!");
      }
    });
});


