const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const conToMongo = require('./db');
const cors = require("cors");

   // Connect to MongoDB
   conToMongo();
   const app = express();

   app.use(cors());
   // Define user schema
   const userSchema = new mongoose.Schema({
       username: String,
       email: String,
       password: String
   });

   const User = mongoose.model("User", userSchema);

   app.use(bodyParser.json());

   // Signup route
   app.post("/signup", async (req, res) => {
       const { username, email, password } = req.body; 
       try {
           // Check if username or email already exists
           const existingUser = await User.findOne({ $or: [{ username }, { email }] });
           if (existingUser) {
               return res.json({ success: false, message: "Username or email already exists" });
           }

           // Hash password
           const hashedPassword = await bcrypt.hash(password, 10);

           // Create new user
           await User.create({ username, email, password: hashedPassword });
           res.json({ success: true });
       } catch (error) {
           console.error(error);
           res.json({ success: false, message: "Signup failed" });
       }
   });

   // Login route
   app.post("/login", async (req, res) => {
       const { username, password } = req.body;
       try {
           // Find user by username
           const user = await User.findOne({ username });
           if (!user) {
               return res.json({ success: false, message: "Invalid username or password" });
           }

           // Compare passwords
           const passwordMatch = await bcrypt.compare(password, user.password);
           if (!passwordMatch) {
               return res.json({ success: false, message: "Invalid username or password" });
           }

           res.json({ success: true });
       } catch (error) {
           console.error(error);
           res.json({ success: false, message: "Login failed" });
       }
   });


   /*const PORT = process.env.PORT || 3030;
   app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
   });*/


const path = require("path");
const PORT = process.env.PORT || 3030;
var server = app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
});
const fs = require("fs");
const fileUpload = require("express-fileupload");
const io = require("socket.io")(server, {
  allowEIO3: true, // false by default
});
app.use(express.static(path.join(__dirname, "")));
var userConnections = [];
io.on("connection", (socket) => {
  console.log("socket id is ", socket.id);
  socket.on("userconnect", (data) => {
    console.log("userconnent", data.displayName, data.meetingid);
    var other_users = userConnections.filter(
      (p) => p.meeting_id == data.meetingid
    );
    userConnections.push({
      connectionId: socket.id,
      user_id: data.displayName,
      meeting_id: data.meetingid,
    });
    var userCount = userConnections.length;
    console.log(userCount);
    other_users.forEach((v) => {
      socket.to(v.connectionId).emit("inform_others_about_me", {
        other_user_id: data.displayName,
        connId: socket.id,
        userNumber: userCount,
      });
    });
    socket.emit("inform_me_about_other_user", other_users);
  });
  socket.on("SDPProcess", (data) => {
    socket.to(data.to_connid).emit("SDPProcess", {
      message: data.message,
      from_connid: socket.id,
    });
  });
  socket.on("sendMessage", (msg) => {
    console.log(msg);
    var mUser = userConnections.find((p) => p.connectionId == socket.id);
    if (mUser) {
      var meetingid = mUser.meeting_id;
      var from = mUser.user_id;
      var list = userConnections.filter((p) => p.meeting_id == meetingid);
      list.forEach((v) => {
        socket.to(v.connectionId).emit("showChatMessage", {
          from: from,
          message: msg,
        });
      });
    }
  });
  socket.on("fileTransferToOther", (msg) => {
    console.log(msg);
    var mUser = userConnections.find((p) => p.connectionId == socket.id);
    if (mUser) {
      var meetingid = mUser.meeting_id;
      var from = mUser.user_id;
      var list = userConnections.filter((p) => p.meeting_id == meetingid);
      list.forEach((v) => {
        socket.to(v.connectionId).emit("showFileMessage", {
          username: msg.username,
          meetingid: msg.meetingid,
          filePath: msg.filePath,
          fileName: msg.fileName,
        });
      });
    }
  });

  socket.on("disconnect", function () {
    console.log("Disconnected");
    var disUser = userConnections.find((p) => p.connectionId == socket.id);
    if (disUser) {
      var meetingid = disUser.meeting_id;
      userConnections = userConnections.filter(
        (p) => p.connectionId != socket.id
      );
      var list = userConnections.filter((p) => p.meeting_id == meetingid);
      list.forEach((v) => {
        var userNumberAfUserLeave = userConnections.length;
        socket.to(v.connectionId).emit("inform_other_about_disconnected_user", {
          connId: socket.id,
          uNumber: userNumberAfUserLeave,
        });
      });
    }
  });

  // <!-- .....................HandRaise .................-->
  socket.on("sendHandRaise", function (data) {
    var senderID = userConnections.find((p) => p.connectionId == socket.id);
    console.log("senderID :", senderID.meeting_id);
    if (senderID.meeting_id) {
      var meetingid = senderID.meeting_id;
      // userConnections = userConnections.filter(
      //   (p) => p.connectionId != socket.id
      // );
      var list = userConnections.filter((p) => p.meeting_id == meetingid);
      list.forEach((v) => {
        var userNumberAfUserLeave = userConnections.length;
        socket.to(v.connectionId).emit("HandRaise_info_for_others", {
          connId: socket.id,
          handRaise: data,
        });
      });
    }
  });
  // <!-- .....................HandRaise .................-->
});

app.use(fileUpload());
app.post("/attachimg", function (req, res) {
  var data = req.body;
  var imageFile = req.files.zipfile;
  console.log(imageFile);
  var dir = "public/attachment/" + data.meeting_id + "/";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  imageFile.mv(
    "public/attachment/" + data.meeting_id + "/" + imageFile.name,
    function (error) {
      if (error) {
        console.log("couldn't upload the image file , error: ", error);
      } else {
        console.log("Image file successfully uploaded");
      }
    }
  );
});


