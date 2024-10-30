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
          },
          $push: {
            FriendList: {
              userId: userIdB,
              roomChatId: ""
            }
          }
        })
      }
      // them { userIdB, roomchatID } -> friendsListA

      // xoa idB -> acceptFriendsA
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
          },
          $push: {
            FriendList: {
              userId: userIdA,
              roomChatId: ""
            }
          }
        })
      }
    })
  })
  
}