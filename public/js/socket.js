var socket = io()
import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'
const elementListTyping = document.querySelector(".chat .inner-list-typing")
const formChat = document.querySelector(".chat .inner-form");
// upload images


// CLIENT_SEND_MESSAGE
if(formChat){
  const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-images', {
    multiple: true,
    maxFileCount: 6
  })
  formChat.addEventListener("submit", (event) => {
    event.preventDefault()
    const images = upload.cachedFileArray || []
    const content = formChat.content.value;
    if(content || images.length > 0){
      const data = {
        content: content,
        images: images
      }
      socket.emit("CLIEND_SEND_MASSAGE", data)
      formChat.content.value = ""
      upload.resetPreviewPanel()
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
  let htmlFullName = ""
  if(id != data.userId){
    div.classList.add("inner-incoming")
    htmlFullName = `
      <div class="inner-name">${data.fullName}</div>
    `
  } 
  else{
    div.classList.add("inner-outgoing")
  }

  let htmlContent = ""
  if (data.content) {
    htmlContent = `
      <div class="inner-content">${data.content}</div>
    `
  }

  let htmlImages = ""
  if (data.images.length > 0) {
    htmlImages +=`<div class="inner-images ">`
    for (const src of data.images) {
      htmlImages += `
        <img src="${src}"/>
      `
    }
    htmlImages += `</div>`
  }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
    ${htmlImages}
  `
  socket.emit("CLIENT_SEND_TYPING", false);
  body.insertBefore(div, elementListTyping)
  body.scrollTop = body.scrollHeight
  new Viewer(div)
})


const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
  bodyChat.scrollTop = bodyChat.scrollHeight
  // ViewerJS
  new Viewer(bodyChat)
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


