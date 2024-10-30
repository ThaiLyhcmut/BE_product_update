const RoomChat = require("../../models/rooms-chat_modle");

module.exports.isAccept = async (req, res, next) => {
  try{
    const userId = res.locals.user.id
    const roomChatId = req.params.id
    const roomChat = await RoomChat.findOne({
      _id: roomChatId
    })
    if(!roomChat){
      res.redirect("/")
      return
    }
    const exitUserInRomChat = roomChat.users.find(item => item.userId == userId)
    if(!exitUserInRomChat){
      res.redirect("/")
      return
    }

    next();
  }catch (error){
    res.redirect("/")
  }
}