
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyARZcpdvjFzTlGzsooq3ntAhj-ETNDAHGo",
    authDomain: "moviereviewapp-5e255.firebaseapp.com",
    projectId: "moviereviewapp-5e255",
    storageBucket: "moviereviewapp-5e255.firebasestorage.app",
    messagingSenderId: "673200253791",
    appId: "1:673200253791:web:72a552db719067d15864ea",
    measurementId: "G-MEFD4Z8YHQ"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 DOM Elements
const senderInput = document.getElementById("senderName");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

// 🔹 Send Message
sendBtn.addEventListener("click", async () => {
  const sender = senderInput.value.trim();
  const message = messageInput.value.trim();

  if (!sender) return alert("Enter your name first!");
  if (!message) return alert("Type a message!");

  await addDoc(collection(db, "messages"), {
    sender,
    message,
    timestamp: new Date().toLocaleString()
  });

  messageInput.value = "";
});

// 🔹 Real-Time Listener
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.innerHTML = `
      <strong>${data.sender}</strong>: ${data.message}
      <small>${data.timestamp}</small>
      <button class="delBtn" onclick="deleteMessage('${docSnap.id}')">🗑️</button>
    `;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // auto scroll to bottom
  });
});

// 🔹 Delete Message
window.deleteMessage = async (id) => {
  await deleteDoc(doc(db, "messages", id));
};













