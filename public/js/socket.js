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

const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]")
if(listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-add-friend");
      button.closest(".box-user").classList.add("add")
      socket.emit("CLIEND_ADD_FRIEND", userIdB)
    })
  });
}

const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]")
if(listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-cancel-friend");
      button.closest(".box-user").classList.remove("add")
      socket.emit("CLIEND_CANCEL_FRIEND", userIdB)
    })
  });
}

const refuse = (listuser) => {
  listuser.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-refuse-friend");
      button.closest(".box-user").classList.add("refuse")
      socket.emit("CLIEND_REFUSE_FRIEND", userIdB)
    })
  });
}

const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]")
if(listBtnRefuseFriend.length > 0) {
  refuse(listBtnRefuseFriend)
}

const accept = (listuser) => {
  listuser.forEach(button => {
    button.addEventListener("click", () => {
      const userIdB = button.getAttribute("btn-accept-friend");
      button.closest(".box-user").classList.add("accepted")
      socket.emit("CLIEND_ACCEPT_FRIEND", userIdB)
    })
  });
} 

const listBtnAcceptedFriend = document.querySelectorAll("[btn-accept-friend]")
if(listBtnAcceptedFriend.length > 0) {
  accept(listBtnAcceptedFriend)
}

socket.on("SERVER_RETURN_LENGTH_ACCEPT_PRIEND", data => {
  const bagdeUserAccept = document.querySelector(`[badge-user-accept="${data.userIdB}"]`)
  if(bagdeUserAccept){
    bagdeUserAccept.innerHTML=data.length;
  }
})

socket.on("SERVER_RETURN_INFO_ACCEPT_PRIEND", data => {
  const listUserAccept = document.querySelector(`[list-accept-friends="${data.userIdB}"]`)
  // them A vao danh sach loi moi da nhan cua B
  if(listUserAccept){
    const div = document.createElement("div")
    div.classList.add("col-4")
    div.setAttribute("user-id", data.userIdA)
    div.innerHTML = `
      <div class="box-user add">
        <div class="inner-avatar">
          <img 
            src="https://robohash.org/hicveldicta.png" 
            alt="${data.fullNameA}" 
          />
        </div>
        <div class="inner-info">
          <div class="inner-name">${data.fullNameA}</div>
          <div class="inner-buttons">
            <button 
              class="btn btn-sm btn-primary mr-1" 
              btn-accept-friend="${data.userIdA}">
              Chấp nhận
            </button>
            <button 
              class="btn btn-sm btn-secondary mr-1" 
              btn-refuse-friend="${data.userIdA}">
              Xóa
            </button>
            <button 
              class="btn btn-sm btn-secondary mr-1" 
              btn-deleted-friend 
              disabled>
              Đã xóa
            </button>
            <button 
              class="btn btn-sm btn-secondary mr-1" 
              btn-accepted-friend 
              disabled>
              Đã chấp nhận
            </button>
          </div>
        </div>
      </div>
    `
    listUserAccept.appendChild(div)
    accept(div.querySelectorAll("[btn-accept-friend]"))
    refuse(div.querySelectorAll("[btn-refuse-friend]"))
    // chap nhan ket ban
  }
  // xoa A khoi danh sach nguoi dung cua B
  const listNotFriends = document.querySelector(`[list-not-friends="${data.userIdB}"]`)
  if(listNotFriends){
    const user = listNotFriends.querySelector(`[user-id="${data.userIdA}"]`)
    if(user){
      listNotFriends.removeChild(user)
    }
  }
})

socket.on("SERVER_RETURN_USERID_CANCEL_PRIEND", data => {
  // userIdB -> danh sach B
  // userIdA -> xoa khoi giao dien A
  const listAcceptFriends = document.querySelector(`[list-accept-friends="${data.userIdB}"]`)
  if(listAcceptFriends) {
    const userA = listAcceptFriends.querySelector(`[user-id="${data.userIdA}"]`)
    if(userA) {
      listAcceptFriends.removeChild(userA)
    }
  }
})

socket.on("SERVER_RETURN_STATUS_ONLINE_USER", data => {
  const listFriends = document.querySelector("[list-friends]")
  if(listFriends){
    const user = listFriends.querySelector(`[user-id="${data.userId}"]`)
    if(user){
      user.querySelector("[status]").setAttribute("status", data.statusOnline)
    }
  }
})