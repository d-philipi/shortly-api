import { urlSchema } from "../models/urlModel.js";

export async function urlValidation(req, res, next) {
  const url = req.body;
  const validation = urlSchema.validate(url, { abortEarly: false });

  if (validation.error) {
      const errors = validation.error.details.map((d) => d.message);
      res.status(422).send(errors);
      return;
  }

  next();
}