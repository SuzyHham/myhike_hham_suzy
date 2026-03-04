// src/authentication.js

import { auth } from "./firebaseConfig.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged   
} from "firebase/auth";


// SIGN UP
export async function signupUser(name, email, password) {

  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(result.user, {
    displayName: name
  });

  return result.user;
}


// LOGIN
export async function loginUser(email, password) {

  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
}


// LOGOUT
export async function logoutUser() {

  await signOut(auth);

}


export function watchAuth(callback) {

  return onAuthStateChanged(auth, callback);

}
