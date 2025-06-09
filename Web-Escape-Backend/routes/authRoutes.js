import express from "express";

import {register,login,logout} from "../controllers/authController.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
// router.post("/register",register);
// router.post("/login",login);
// router.get("/logout",logout);


export default router;