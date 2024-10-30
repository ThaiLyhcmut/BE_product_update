const RoomChat = require("../../models/rooms-chat_modle");
const User = require("../../models/user_model");

module.exports = (req, res) => {
  const userIdA = res.locals.user.id
  _io.once("connection", (socket) => {
    socket.on("CLIEND_ADD_FRIEND",async (userIdB) => {
      // them idA -> userB
      const exitsAinB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      });
      if(!exitsAinB){
        await User.updateOne({
          _id: userIdB
        },{
          $push: {
            acceptFriends: userIdA
          }
        })
      }
      // them idB -> userA
      const exitsBinA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      })
      if(!exitsBinA){
        await User.updateOne({
          _id: userIdA
        },{
          $push: {
            requestFriends: userIdB
          }
        })
      }
      // tra ve cho B so luong user can chap nhan
      const userB = await User.findOne({
        _id: userIdB,
        deleted: false,
        status: "active"
      })
      _io.emit("SERVER_RETURN_LENGTH_ACCEPT_PRIEND", {
        userIdB: userIdB,
        length: userB.acceptFriends.length
      })
      _io.emit("SERVER_RETURN_INFO_ACCEPT_PRIEND", {
        userIdA: userIdA,
        fullNameA: res.locals.user.fullName,
        avatarA: "",
        userIdB: userIdB,
      })
    })
    socket.on("CLIEND_CANCEL_FRIEND",async (userIdB) => {
      // xoa idA -> userB accept
      const exitsAinB = await User.findOne({
        _id: userIdB,
        acceptFriends: userIdA
      });
      if(exitsAinB){
        await User.updateOne({
          _id: userIdB
        },{
          $pull: {
            acceptFriends: userIdA
          }
        })
      }
      // xoa idB -> userA request
      const exitsBinA = await User.findOne({
        _id: userIdA,
        requestFriends: userIdB
      })
      if(exitsBinA){
        await User.updateOne({
          _id: userIdA
        },{
          $pull: {
            requestFriends: userIdB
          }
        })
      }
      // tra ve cho B so luong user can chap nhan
      const userB = await User.findOne({
        _id: userIdB,
        deleted: false,
        status: "active"
      })
      _io.emit("SERVER_RETURN_LENGTH_ACCEPT_PRIEND", {
        userIdB: userIdB,
        length: userB.acceptFriends.length
      })
      // tra ve cho B thong tin cua A de xoa A khoi giao dien
      _io.emit("SERVER_RETURN_USERID_CANCEL_PRIEND", {
        userIdB: userIdB,
        userIdA: userIdA,
      })
    })
    socket.on("CLIEND_REFUSE_FRIEND",async (userIdB) => {
      // xoa idB -> userA accept
      const exitsBinA = await User.findOne({
        _id: userIdA,
        acceptFriends: userIdB
      });
      if(exitsBinA){
        await User.updateOne({
          _id: userIdA
        },{
          $pull: {
            acceptFriends: userIdB
          }
        })
      }
      // xoa idA -> userB request
      const exitsAinB = await User.findOne({
        _id: userIdB,
        requestFriends: userIdA
      })
      if(exitsAinB){
        await User.updateOne({
          _id: userIdB
        },{
          $pull: {
            requestFriends: userIdA
          }
        })
      }
    })
    socket.on("CLIEND_ACCEPT_FRIEND",async (userIdB) => {
      // them { userIdB, roomchatID } -> friendsListA
      // xoa idB -> acceptFriendsA
      // them { userIdB, roomchatID } -> friendsListA
      // xoa idB -> acceptFriendsA
      const exitsBinA = await User.findOne({
        _id: userIdA,
        acceptFriends: userIdB
      });

      const exitsAinB = await User.findOne({
        _id: userIdB,
        requestFriends: userIdA
      })

      if(exitsBinA && exitsAinB){
        // tao phong chat chung cho A va B
        const roomChat = new RoomChat({
          typeRoom: "friend",
          users: [
            {
              userId: userIdA,
              role: "superAdmin",
            },{
              userId: userIdB,
              role: "superAdmin"
            }
          ]
        })
        await roomChat.save()
        await User.updateOne({
          _id: userIdA
        },{
          $pull: {
            acceptFriends: userIdB
          },
          $push: {
            FriendList: {
              userId: userIdB,
              roomChatId: roomChat.id
            }
          }
        })
        await User.updateOne({
          _id: userIdB
        },{
          $pull: {
            requestFriends: userIdA
          },
          $push: {
            FriendList: {
              userId: userIdA,
              roomChatId: roomChat.id
            }
          }
        })
      }
    })
  })
  
}