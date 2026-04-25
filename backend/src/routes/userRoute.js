import express from "express";
import authControllers from "../controllers/authController.js"
const { createNewUser, loginUser ,logout,forgetPassword}=authControllers;

const authroute = express.Router();

authroute.post("/registeruser", createNewUser);
authroute.post("/login", loginUser);
authroute.post("/logout/:id", logout);
authroute.post("/forgetpassword", forgetPassword);

export default authroute;
