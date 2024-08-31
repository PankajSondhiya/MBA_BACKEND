const User = require("./../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = require("../configs/auth.config");
const { USERTYPES, USER_STATUS } = require("./../constant");
const admin = require("../configs/firebase.config");

async function signup(req, res) {
  const { name, email, userId, password, userType } = req.body;
  try {
    const userRecord = await admin
      .auth()
      .createUser({ email: email, password: password });
    const userObj = {
      name,
      email,
      userId,
      password: bcrypt.hashSync(password, 10),
      userType,
      userStatus:
        userType === USERTYPES.CUSTOMER
          ? USER_STATUS.APPROVED
          : USER_STATUS.PENDING,
      firebaseUid: userRecord.uid,
    };
    if (userType === "ADMIN") {
      await admin.auth().setCustomUserClaims(userRecord.uid, { admin: true });
    }
    User.create(userObj).then((data) => {
      res.status(200).send({
        _id: data._id,
        name: data.name,
        email: data.email,
        userId: data.userId,
        userType: data.userType,
        userStatus: data.userStatus,
        firebaseUid: data.firebaseUid,
      });
    });
  } catch (error) {
    res.status(400).send(`Error creating user: ${error.message}`);
  }
}

async function signin(req, res) {
  console.log("user signing in is", req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (user === null) {
    res.status(401).send({
      message: "Failed! user does not exist",
    });
    return;
  }

  if (user.userStatus !== USER_STATUS.APPROVED) {
    res.status(401).send({
      message: "Cannot allow login as user is not approved yet",
    });
    return;
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send({
      message: "Password is invalid",
    });
  }

  // JWT token

  const accessToken = jwt.sign(
    {
      userId: user.userId,
      userType: user.userType,
      email: user.email,
    },
    SECRET_KEY,
    {
      expiresIn: "6h",
    }
  );

  res.status(200).send({
    name: user.name,
    userStatus: user.userStatus,
    email: user.email,
    userId: user.userId,
    userTypes: user.userType,
    _id: user._id,
    accessToken,
  });
}

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  console.log(email);
  console.log(newPassword);

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(201).send({ message: "user not found" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.status(200).send({ message: "password changed successfully" });
};

module.exports = {
  signup,
  signin,
  resetPassword,
};
