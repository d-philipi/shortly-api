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

export async function deleteUrlValidation(req, res, next) {
  const user = req.user;
  const { id } = req.params;
  const urlExist = await DB.query(
    "SELECT * FROM urls WHERE urls.id = $1",
    [ id ] 
  );

  if(!urlExist){
    return res.sendStatus(404);
  };

  if(urlExist.user_id !== user.id){
    return res.sendStatus(204);
  }
  
  next();
}