// app.js

import { auth, db } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Sign Up Logic
document.getElementById('signUpForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Add user to Firestore database
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      uid: user.uid,
      createdAt: new Date()
    });

    document.getElementById('userStatus').innerText = `Welcome, ${user.email}! Your data has been saved to Firestore.`;
  } catch (error) {
    document.getElementById('userStatus').innerText = error.message;
  }
});

// Sign In Logic
document.getElementById('signInForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve user data from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      document.getElementById('userStatus').innerText = `Logged in as: ${userData.email}`;
    } else {
      document.getElementById('userStatus').innerText = "No user data found!";
    }
  } catch (error) {
    document.getElementById('userStatus').innerText = error.message;
  }
});

// Check Signed-In Email Logic
document.getElementById('checkEmailBtn').addEventListener('click', () => {
  const user = auth.currentUser;

  if (user) {
    document.getElementById('userStatus').innerText = `Signed in as: ${user.email}`;
  } else {
    document.getElementById('userStatus').innerText = "No user is signed in.";
  }
});

// Logout Logic
document.getElementById('logoutBtn').addEventListener('click', async () => {
  try {
    await signOut(auth);
    document.getElementById('userStatus').innerText = "You have logged out.";
  } catch (error) {
    document.getElementById('userStatus').innerText = error.message;
  }
});

// Listen to Auth State Changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    document.getElementById('userStatus').innerText = `Signed in as: ${user.email}`;
  } else {
    // No user is signed in
    document.getElementById('userStatus').innerText = "No user is signed in.";
  }
});
