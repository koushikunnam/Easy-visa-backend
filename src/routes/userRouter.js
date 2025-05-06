const express=require("express");
const Router=express.Router();
const {signupAdmin,signupMerchant,getalldata,signupUser,loginuser,getprofile,Subscription}=require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");

Router.get("/alluserdata",getalldata)
Router.post("/signupuser",signupUser)
Router.post("/signup/merchant",signupMerchant)
Router.post("/signup/add/admin",signupAdmin)
Router.post("/loginuser",loginuser)
Router.get("/profile",getprofile)
Router.get("/subscription/:userId",Subscription)




module.exports = Router;