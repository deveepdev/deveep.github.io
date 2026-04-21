// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword,
signInWithEmailAndPassword,
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged,
signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCOsks_UAF-LYoLBD40vKnFvqa0mMoCQOI",
  authDomain: "doproof-6bb1d.firebaseapp.com",
  projectId: "doproof-6bb1d",
  storageBucket: "doproof-6bb1d.firebasestorage.app",
  messagingSenderId: "456620551339",
  appId: "1:456620551339:web:e513a9e55e6e8e7c491bee"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

document.getElementById("signup").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    document.getElementById("status").innerText = "Account created!";
    console.log(userCredential.user);
  } catch (error) {
    document.getElementById("status").innerText = error.message;
  }
});

document.getElementById("login").addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("status").innerText = "Logged in!";
    console.log(userCredential.user);
  } catch (error) {
    document.getElementById("status").innerText = error.message;
  }
});

document.getElementById("logout").addEventListener("click", async () => {
  await signOut(auth);
});

onAuthStateChanged(auth, (user) => {
  const status = document.getElementById("status");

  if (user) {
    status.innerText = "Logged in as: " + user.email;
  } else {
    status.innerText = "Not logged in";
  }
});