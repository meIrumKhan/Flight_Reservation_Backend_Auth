const express = require("express");
const server = express();
const mongoose = require("mongoose");
const { userModel } = require("./models/store");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");




const PORT = process.env.PORT || 5000;

server.use(express.static("public"));


server.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// server.options('*', cors());

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));

// middleware

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ token: false });
    }
    jwt.verify(token, "STORESOLUTION", (err, decoded) => {
      if (err) {
        return res.json({ token: false });
      }
      req.user = decoded;
      next();
    });
  } catch (e) {
    console.log(e.message);
  }
};

server.get("/testauth", (req, res) => {
  try {
    res.json({ message: "Test route working!" });
  } catch (e) {
    console.log(e.message);
  }
});


// Signup

server.post("/signup", async (req, res) => {
  const { name, password, email, phno, isAdmin } = req.body;
  try {
    const exsistingEmail = await userModel.findOne({
      email,
    });

    if (exsistingEmail) {
      return res.json({
        message: "This email is already registerd",
      });
    }

    const existingPhno = await userModel.findOne({ phno });
    if (existingPhno) {
      return res.json({
        message: "This phone number is already in use",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      password: hashedPassword,
      email,
      phno,
      isAdmin: isAdmin ? isAdmin : false,
    });

    await newUser.save();

    return res.json({
      message: "sign in successfuly",
      success: true,
      user: newUser,
    });
  } catch (error) {
    res.json({ message: error.message });
  }
});

server.get("/check-auth", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await userModel.findById(userId);

    return res.json({
      login: true,
      user,
      success: true,
    });
  } catch (e) {
    console.log(e.message);
  }
});

server.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.json({ message: "User not found.", login: false });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
      const token = jwt.sign(
        {
          userId: user._id,
          isAdmin: user.isAdmin,
        },
        "STORESOLUTION"
        // { expiresIn: "1h" }
      );

      res.cookie("token", token);

      //  const cookiesCredentials = {
      //    httpOnly: true,
      //    // secure: process.env.NODE_ENV === 'production',
      //    secure: true,
      //    sameSite: "None",
      //    path: "/",
      //    maxAge: 3600000,
      //  };

      //  res.cookie("token", token, cookiesCredentials);

      return res.json({
        user,
        login: true,
        success: true,
      });
    } else {
      return res.json({ message: "Invalid password.", login: false });
    }
  } catch (error) {
    console.error(error);
  }
});

server.get("/logout", authMiddleware, (req, resp) => {
  try {
    //  resp.clearCookie("token", {
    //    httpOnly: true,
    //    secure: true,
    //    sameSite: "None",
    //    path: "/",
    //    maxAge: 0,
    //  });

    resp.cookie("token", "");
    resp.json({ logout: true });
  } catch (e) {
    console.log(e.message);
  }
});

server.listen(PORT, () => {
  try {
    console.log(`Auth server running on port ${PORT}`);
  } catch (e) {
    console.log(e.message);
  }
});
