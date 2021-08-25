const sendMessageButton = document.getElementById('sendMessage');
const user = document.getElementById('nickname').value;
const msg = document.getElementById('message').value;

async function sendMessage(username, message){
    const data = { username, message };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    console.log(data);
    const response = await fetch('/api', options);
    const jsonData = await response.json();
    console.log(jsonData);
}

getMessages();

async function getMessages(){
    const response = await fetch('/api');
    const data = await response.json();
    for(entry of data){
        const msgBoxDiv = document.createElement('div');
        const nameDiv = document.createElement('div');
        const messageDiv = document.createElement('div');
        const nameSpan = document.createElement('span');
        const msgSpan = document.createElement('span');
        document.getElementById('messages').appendChild(msgBoxDiv);
        msgBoxDiv.appendChild(nameDiv);
        msgBoxDiv.appendChild(messageDiv);
        nameDiv.appendChild(nameSpan);
        messageDiv.appendChild(msgSpan);
        msgBoxDiv.classList.add('message-box');
        nameDiv.classList.add('name');
        messageDiv.classList.add('message');
        nameSpan.textContent = `${entry.username}`;
        msgSpan.textContent = `${entry.message}`;
    }
    var chatHistory = document.getElementById("messages");
chatHistory.scrollTop = chatHistory.scrollHeight;
}
