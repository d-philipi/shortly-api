import { Router } from "express";
import { deleteUrl, findShortUrl, findUrl, shorten } from "../controllers/urlController.js";
import { authValidation } from "../middlewares/authValidationMiddleware.js";
import { urlValidation } from "../middlewares/urlValidationMiddleware.js";

const router = Router();

router.post("/urls/shorten", authValidation, urlValidation, shorten);
router.get("/urls/:id", findUrl);
router.get("/urls/open/:shortUrl", findShortUrl);
router.delete("/urls/:id", authValidation, deleteUrl);

export default router;