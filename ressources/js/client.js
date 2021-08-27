const socket = io();

const userInput = document.getElementById("nickname");
const msgInput = document.getElementById("message");
const messagesContainer = document.getElementById("messages");
const error = document.getElementById("error");

socket.on("update online", (count) => {
  document.getElementById("user-count").textContent = count + " online";
});

socket.on("get messages", () => {
  userInput.value = getCookie("username");
  messagesContainer.textContent = "";
  getMessages();
});

socket.on("update messages", (username, message) => {
  updateMessages(username, message);
});

/**
 * Send message when ENTER Key is pressed
 */
$("input[type=text]").on("keydown", function (e) {
  if (e.which == 13) {
    e.preventDefault();
    sendMessage(userInput.value, msgInput.value);
  }
});

/**
 * Send a message to the server
 * @param {String} username - The username
 * @param {String} message - The message
 */
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
      createMessage(username, message, "Veuillez saisir un message valide.");
    }
  } else {
    createMessage(username, message, "Veuillez saisir un pseudo valide.");
  }
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Update a message for the user
 * @param {String} username - The username
 * @param {String} message - The message
 */
function updateMessages(username, message) {
  messagesContainer.firstElementChild.remove;
  createMessage(username, message, false);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * Get all the first 25 messages from the server
 */
async function getMessages() {
  const response = await fetch("/api");
  const data = await response.json();
  for (entry of data) {
    createMessage(`${entry.username}`, `${entry.message}`, false);
  }
  var chatHistory = messagesContainer;
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

/**
 * Send a message to the server
 * @param {String} username - The username
 * @param {String} message - The message
 * @param {String/Boolean} error - If it's an error message, the text error, else, false.
 */
function createMessage(username, message, error) {
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
  if (error != false) {
    msgBoxDiv.classList.add("error");
    msgBoxDiv.onclick = msgBoxDiv.remove;
    nameSpan.textContent = "Erreur";
    msgSpan.textContent = error;
  }
}

/**
 * Set cookie into the user's navigator
 * @param {String} nom - Name of the cookie
 * @param {String} valeur - Value of the cookie
 * @param {Int} expire - Time of expiration
 * @param {String} chemin - Cookie's location
 * @param {String} domaine - Cookie's domain
 * @param {String} securite - Cookie's security
 */
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

/**
 * Get all informations about a cookie
 * @param {String} name - Name of the cookie
 * @returns
 */
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
