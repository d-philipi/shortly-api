import { DB } from "../database/db.js";

export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {

    const session = await DB.query(
      "SELECT * FROM sessions WHERE sessions.token = $1",
      [ token ]
    );

    const userId = session?.userId;

    const user = await DB.query(
      'SELECT * FROM users WHERE users.id = $1',
      [ userId ]
    );

    req.user = user;

  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}