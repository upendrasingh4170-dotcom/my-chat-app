
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
  getFirestore, collection, addDoc, deleteDoc, doc, 
  query, orderBy, onSnapshot 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// 🔹 Replace this config with your Firebase project details
const firebaseConfig = {
  apiKey: "AIzaSyDFGu1_CTmyZ58XtWYRHOdspTuLY7h9jK8",
  authDomain: "us-chat-app-85203.firebaseapp.com",
  projectId: "us-chat-app-85203",
  storageBucket: "us-chat-app-85203.firebasestorage.app",
  messagingSenderId: "1079163127963",
  appId: "1:1079163127963:web:b288b1d2abfac66e18de3e",
  measurementId: "G-SYG964DF8S"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const startBtn = document.getElementById("start-btn");
const usernameInput = document.getElementById("username");
const loginScreen = document.getElementById("login-screen");
const chatScreen = document.getElementById("chat-screen");
const userDisplay = document.getElementById("user-display");
const chatBox = document.getElementById("chat-box");
const msgInput = document.getElementById("msg-input");
const sendBtn = document.getElementById("send-btn");

let username = "";

// Start chat
startBtn.onclick = () => {
  username = usernameInput.value.trim();
  if (username === "") {
    alert("Please enter your name!");
    return;
  }
  loginScreen.classList.add("hidden");
  chatScreen.classList.remove("hidden");
  userDisplay.textContent = `👤 ${username}`;
  loadMessages();
};

// Send message
sendBtn.onclick = async () => {
  const text = msgInput.value.trim();
  if (text === "") return;

  await addDoc(collection(db, "messages"), {
    name: username,
    text: text,
    time: new Date()
  });

  msgInput.value = "";
};

// Load real-time messages
function loadMessages() {
  const q = query(collection(db, "messages"), orderBy("time"));
  onSnapshot(q, (snapshot) => {
    chatBox.innerHTML = "";
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const msgDiv = document.createElement("div");
      msgDiv.className = "message";
      msgDiv.innerHTML = `<b>${data.name}</b>: ${data.text}`;

      // Show delete button only for own messages
      if (data.name === username) {
        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.className = "delete-btn";
        delBtn.onclick = async () => {
          if (confirm("Delete this message?")) {
            await deleteDoc(doc(db, "messages", docSnap.id));
          }
        };
        msgDiv.appendChild(delBtn);
      }

      chatBox.appendChild(msgDiv);
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  });
}


