const firebaseConfig = {
  apiKey: "AIzaSyCiYRBfXZSEImfV9uqwhqK_8oDP18WTMts",
  authDomain: "zgeografija-6db02.firebaseapp.com",
  databaseURL: "https://zgeografija-6db02.firebaseio.com",
  projectId: "zgeografija-6db02",
  storageBucket: "zgeografija-6db02.appspot.com",
  messagingSenderId: "378635864704",
  appId: "1:378635864704:web:a5df44ec282359260e3465",
  measurementId: "G-SW0L7YNFXL",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let loggedInUser = localStorage.getItem("user") || "";

const loginForm = document.querySelector(".login-form");
const termsForm = document.querySelector(".terms-form");
const hallOfFame = document.querySelector(".hall-of-fame");
const hallOfFameList = document.querySelector(".hall-of-fame ul");
const loggedInMessage = document.querySelector(".logged-in-message");

const logout = document.querySelector("#logout");
const termSuggest = document.querySelector("#term-suggest");
const hallButton = document.querySelector("#hall-button");
const username = document.querySelector("#username");
const category = document.querySelector("#category");
const term = document.querySelector("#term");

if (loggedInUser) {
  loginForm.classList.add("hidden");
  termSuggest.classList.remove("disabled");
  hallButton.classList.remove("disabled");
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
    termSuggest.classList.add("disabled");
    hallButton.classList.add("disabled");
    logout.classList.add("disabled");
  }
});

termSuggest.addEventListener("click", () => {
  if (loggedInUser) {
    loggedInMessage.classList.add("hidden");
    hallOfFame.classList.add("hidden");
    termsForm.classList.remove("hidden");
  }
});

hallButton.addEventListener("click", () => {
  hallOfFameList.innerHTML = "";

  if (loggedInUser) {
    loggedInMessage.classList.add("hidden");
    hallOfFame.classList.remove("hidden");
    termsForm.classList.add("hidden");
  }

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
});

termsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const strippedTerm = term.value.replace(/[^A-Z0-9]+/gi, "").toLowerCase();
  const firstLetter = strippedTerm[0].toUpperCase();
  const formattedTerm = firstLetter + strippedTerm.slice(1);

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
