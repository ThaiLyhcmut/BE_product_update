const Chat = require("../../models/chat_model")
const User = require("../../models/user_model")

module.exports.index = async (req, res) => {
  _io.once("connection", (socket) => {
    console.log('a user connected', socket.id);
    // nguoi dung gui tin nhan len sever
    socket.on("CLIEND_SEND_MASSAGE", async (data) => {
      const dataChat = {
        userId: res.locals.user.id,
        content: data.content
      }
      const record = new Chat(dataChat)
      await record.save()


      _io.emit("SERVER_RETURN_MASSAGE", {
        userId: res.locals.user.id,
        fullName: res.locals.user.fullName,
        content: data.content
      })
    })
  })

  // lay tin nhan mac dinh
  const chats = await Chat.find({
    deleted: false
  })
  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.userId
    })

    chat.fullName = infoUser.fullName
  }
  res.render("client/pages/chat/index", {
    Pagetitle: "Chat",
    chats: chats
  })
}