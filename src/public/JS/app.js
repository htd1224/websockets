const socket = io(); // socket.io 실행하고 서버를 찾음 스스로

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName;

function addMessage(message){
    const ul = room.querySelector("ul");
    const li = document.createElement("li");
    li.innerText = message;
    ul.appendChild(li);
}

function handleMessageSubmit(event) {
    event.preventDefault();
    const input = room.querySelector("#msg input");
    const value = input.value;
    socket.emit("new_message", input.value, roomName, () => {
      addMessage(`You: ${value}`);
    });
    input.value = "";
  }

  function handleNicknameSubmit(event){
      event.preventDefault();
      const input = room.querySelector("#name input");
      socket.emit("nickname", input.value, () => {
      });
      input.value = "";
  }

function showRoom() { //backend에 의해서 실행됨
    welcome.hidden = true;
    room.hidden = false;
    const h2 = room.querySelector("h2");
    h2.innerText = `Room Name : ${roomName}`;
    const msgForm = room.querySelector("#msg");
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit",handleMessageSubmit);
    nameForm.addEventListener("submit",handleNicknameSubmit);
  }

function handleRoomSubmit(event){
    event.preventDefault();
    const input = form.querySelector("input");
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value="";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on ("welcome", (user, newCount)=>{
    const h2 = room.querySelector("h2");
    h2.innerText = `Room Name : ${roomName} , Person : ${newCount}`;
    addMessage(`${user} joined 👋`);
}
)

socket.on ("bye", (left, newCount)=>{
    const h2 = room.querySelector("h2");
    h2.innerText = `Room Name : ${roomName} , Person : ${newCount}`;
    addMessage(`${left} left 👋`);
}
)

socket.on("new_message", addMessage);

socket.on("room_change", (rooms)=>{
    console.log(rooms);
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
   /* if(rooms.length === 0){ //rooms 가 Null 일때
        return;
    }*/
    rooms.forEach(room => {
        const li = document.createElement("li");
        li.innerText = room;
        roomList.append(li);
    })
});