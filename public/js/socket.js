var socket = io()


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
  body.appendChild(div)
  body.scrollTop = body.scrollHeight
})


const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
  bodyChat.scrollTop = bodyChat.scrollHeight
}