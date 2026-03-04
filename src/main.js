import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "./firebaseConfig.js";

// --------------------
// Quote of the day
// --------------------
const quotes = [
  "The journey of a thousand miles begins with a single step",
  "Adventure is worthwhile in itself",
  "Keep going. Everything you need will come to you at the perfect time.",
];

function setRandomQuote() {
  const el = document.getElementById("quote-goes-here");
  if (!el) return;
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  el.textContent = q;
}

// --------------------
// Seed data
// --------------------
async function addHikeData() {
  const hikesRef = collection(db, "hikes");
  console.log("Adding sample hike data...");

  await Promise.all([
    addDoc(hikesRef, {
      code: "BBY01",
      name: "Burnaby Lake Park Trail",
      city: "Burnaby",
      level: "easy",
      details: "A lovely place for a lunch walk.",
      length: 10,
      hike_time: 60,
      lat: 49.2467097082573,
      lng: -122.9187029619698,
      last_updated: serverTimestamp(),
    }),
    addDoc(hikesRef, {
      code: "AM01",
      name: "Buntzen Lake Trail",
      city: "Anmore",
      level: "moderate",
      details: "Close to town, and relaxing.",
      length: 10.5,
      hike_time: 80,
      lat: 49.3399431028579,
      lng: -122.85908496766939,
      last_updated: serverTimestamp(),
    }),
    addDoc(hikesRef, {
      code: "NV01",
      name: "Mount Seymour Trail",
      city: "North Vancouver",
      level: "hard",
      details: "Amazing ski slope views.",
      length: 8.2,
      hike_time: 120,
      lat: 49.38847101455571,
      lng: -122.94092543551031,
      last_updated: serverTimestamp(),
    }),
  ]);
}

async function seedHikes() {
  const hikesRef = collection(db, "hikes");
  const querySnapshot = await getDocs(hikesRef);

  if (querySnapshot.empty) {
    console.log("Hikes collection is empty. Seeding data...");
    await addHikeData();
  } else {
    console.log("Hikes collection already contains data. Skipping seed.");
  }
}

// --------------------
// Display cards
// --------------------
async function displayCardsDynamically() {
  const cardTemplate = document.getElementById("hikeCardTemplate");
  const container = document.getElementById("hikes-go-here");

  if (!cardTemplate || !container) {
    console.error("Missing #hikeCardTemplate or #hikes-go-here in main.html");
    return;
  }

  // clear old cards (prevents duplicates on refresh/hot reload)
  container.innerHTML = "";

  const hikesCollectionRef = collection(db, "hikes");
  const querySnapshot = await getDocs(hikesCollectionRef);

  querySnapshot.forEach((doc) => {
    const hike = doc.data();
    const newcard = cardTemplate.content.cloneNode(true);

    newcard.querySelector(".card-title").textContent = hike.name;
    newcard.querySelector(".card-text").textContent =
      hike.details || `Located in ${hike.city}.`;
    newcard.querySelector(".card-length").textContent = hike.length;

    // ✅ Vite public folder rule: public/images/BBY01.jpg -> /images/BBY01.jpg
    const img = newcard.querySelector(".card-image");
    if (img) img.src = `/images/${hike.code}.png`;

    container.appendChild(newcard);
  });
}

// --------------------
// Main page boot
// --------------------
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

onAuthStateChanged(auth, async (user) => {
  // If not logged in, send them back
  if (!user) {
    window.location.href = "/index.html";
    return;
  }

  // Greeting text: use email prefix as a safe default
  const name = user.email ? user.email.split("@")[0] : "friend";
  const greetingEl = document.getElementById("greetingText");
  if (greetingEl) greetingEl.textContent = `${getGreeting()}, ${name}`;

  setRandomQuote();

  // ✅ Ensure data exists, then display cards
  await seedHikes();
  await displayCardsDynamically();
});