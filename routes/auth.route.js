const {
  signin,
  signup,
  resetPassword,
} = require("../controllers/auth.controller");

module.exports = function (app) {
  app.post("/mba/api/v1/auth/signin", signin);

  app.post("/mba/api/v1/auth/signup", signup);
  app.put("/mba/api/v1/auth/resetpassword", resetPassword);
};
