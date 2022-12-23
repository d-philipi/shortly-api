import { Router } from "express";
import { signIn, signUp, userMe } from "../controllers/userController.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";
import { signInValidation } from "../middlewares/signInValidationMiddleware.js";
import { signUpValidation } from "../middlewares/signUpValidationMiddleware.js";


const router = Router();


router.post("/sign-up", signUpValidation, signUp);
router.post("/sign-in", signInValidation, signIn);
router.get("/users/me", authValidation, userMe);

export default router;