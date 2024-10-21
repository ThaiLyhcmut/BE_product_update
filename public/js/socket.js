var socket = io()
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const elementListTyping = document.querySelector(".chat .inner-list-typing")


// CLIENT_SEND_MESSAGE
const formChat = document.querySelector(".chat .inner-form");
if(formChat){
  console.log(formChat)
  formChat.addEventListener("submit", (event) => {
    event.preventDefault()
    const content = formChat.content.value;
    console.log(content)
    if(content){
      const data = {
        content: content,
      }
      socket.emit("CLIEND_SEND_MASSAGE", data)
      formChat.content.value = ""
    }
  })
  const button = formChat.querySelector('[button-tolltop]')
  const tooltip = formChat.querySelector('.tooltipA')
  Popper.createPopper(button, tooltip)

  button.onclick = () => {
  tooltip.classList.toggle('shown')
}
}



socket.on("SERVER_RETURN_MASSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div")
  const id = document.querySelector(".chat").getAttribute("user-id")
  if(id != data.userId){
    div.classList.add("inner-incoming")
    div.innerHTML = `
      <div class="inner-name">${data.fullName}</div>
      <div class="inner-content">${data.content}</div>
    `
  } 
  else{
    div.classList.add("inner-outgoing")
    div.innerHTML = `
      <div class="inner-content">${data.content}</div>
    `
  }
  socket.emit("CLIENT_SEND_TYPING", false);
  body.insertBefore(div, elementListTyping)
  body.scrollTop = body.scrollHeight
})


const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
  bodyChat.scrollTop = bodyChat.scrollHeight
}




const emoji = document.querySelector('emoji-picker')
if (emoji){
  const inputChat = document.querySelector(".chat .inner-form input[name='content']")
  emoji.addEventListener('emoji-click', event => {
    inputChat.value += event.detail.unicode
  });
  var timeOutTyping
  inputChat.addEventListener("keyup", () => {
    socket.emit("CLIENT_SEND_TYPING", true);
    clearTimeout(timeOutTyping);
    timeOutTyping = setTimeout(() => {
      socket.emit("CLIENT_SEND_TYPING", false);
    }, 3000)
  })
}

if(elementListTyping){
  socket.on("SERVER_RETURN_TYPING", data => {
    if(data.type){
      if(!elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`)){
        const boxTyping = document.createElement("div")
        boxTyping.classList.add("box-typing")
        boxTyping.setAttribute("user-id", data.userId)
        boxTyping.innerHTML = `
          <div class="inner-name">${data.fullName}</div>
          <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `
        elementListTyping.appendChild(boxTyping)
      }
    }else{
      if (elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`)){
        elementListTyping.removeChild(elementListTyping.querySelector(`.box-typing[user-id="${data.userId}"]`))
      }
    }
    bodyChat.scrollTop = bodyChat.scrollHeight
  })
}
