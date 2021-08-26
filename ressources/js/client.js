const socket = io();

const userInput = document.getElementById("nickname");
const msgInput = document.getElementById("message");
const messagesContainer = document.getElementById("messages");
const error = document.getElementById("error");

socket.on("get messages", () => {
  userInput.value = getCookie("username");
  messagesContainer.textContent = "";
  getMessages();
});

socket.on("update messages", (username, message) => {
  updateMessages(username, message);
});

async function sendMessage(username, message) {
  console.log(username, message);

  if (username.length > 0) {
    if (message.length > 0) {
      if (getCookie("username") != username) {
        var dtExpire = new Date();
        dtExpire.setTime(dtExpire.getTime() + 3600 * 24000);

        setCookie("username", username, dtExpire, "/");
      }
      const data = { username, message };
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      const response = await fetch("/api", options);
      const jsonData = await response.json();
      socket.emit("send message", jsonData);
      $("#error").hide().fadeOut();
      msgInput.value = "";
    } else {
      $("#error").hide().fadeIn();
      error.textContent = "Veuillez saisir un message valide.";
    }
  } else {
    $("#error").hide().fadeIn();
    error.textContent = "Veuillez saisir un pseudo valide.";
  }
}

function updateMessages(username, message) {
  messagesContainer.firstElementChild.remove;
  const msgBoxDiv = document.createElement("div");
  const nameDiv = document.createElement("div");
  const messageDiv = document.createElement("div");
  const nameSpan = document.createElement("span");
  const msgSpan = document.createElement("span");
  messagesContainer.appendChild(msgBoxDiv);
  msgBoxDiv.appendChild(nameDiv);
  msgBoxDiv.appendChild(messageDiv);
  nameDiv.appendChild(nameSpan);
  messageDiv.appendChild(msgSpan);
  msgBoxDiv.classList.add("message-box");
  nameDiv.classList.add("name");
  messageDiv.classList.add("message");
  nameSpan.textContent = username;
  msgSpan.textContent = message;
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function getMessages() {
  const response = await fetch("/api");
  const data = await response.json();
  for (entry of data) {
    const msgBoxDiv = document.createElement("div");
    const nameDiv = document.createElement("div");
    const messageDiv = document.createElement("div");
    const nameSpan = document.createElement("span");
    const msgSpan = document.createElement("span");
    messagesContainer.appendChild(msgBoxDiv);
    msgBoxDiv.appendChild(nameDiv);
    msgBoxDiv.appendChild(messageDiv);
    nameDiv.appendChild(nameSpan);
    messageDiv.appendChild(msgSpan);
    msgBoxDiv.classList.add("message-box");
    nameDiv.classList.add("name");
    messageDiv.classList.add("message");
    nameSpan.textContent = `${entry.username}`;
    msgSpan.textContent = `${entry.message}`;
  }
  var chatHistory = messagesContainer;
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function setCookie(nom, valeur, expire, chemin, domaine, securite) {
  document.cookie =
    nom +
    " = " +
    escape(valeur) +
    "  " +
    (expire == undefined ? "" : "; expires = " + expire.toGMTString()) +
    (chemin == undefined ? "" : "; path = " + chemin) +
    (domaine == undefined ? "" : "; domain = " + domaine) +
    (securite == true ? "; secure" : "");
}

function getCookie(name) {
  if (document.cookie.length == 0) return null;

  var regSepCookie = new RegExp("(; )", "g");
  var cookies = document.cookie.split(regSepCookie);

  for (var i = 0; i < cookies.length; i++) {
    var regInfo = new RegExp("=", "g");
    var infos = cookies[i].split(regInfo);
    if (infos[0] == name) {
      return unescape(infos[1]);
    }
  }
  return null;
}
