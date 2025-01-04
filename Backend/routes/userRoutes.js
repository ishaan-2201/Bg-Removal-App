import express from "express";
import {
  clerkWebHooks,
  paymentRazorPay,
  userCredits,
  verifyRazorpay,
} from "../controllers/userController.js";
import authUser from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/webhooks", clerkWebHooks);

userRouter.get("/credits", authUser, userCredits);

userRouter.post("/pay-razor", authUser, paymentRazorPay);

userRouter.post("/verify-razor", authUser, verifyRazorpay);

export default userRouter;
