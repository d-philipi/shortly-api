import { DB } from "../database/db.js";

export async function authValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {

    const session = await DB.query(
      'SELECT * FROM sessions WHERE token = $1',
      [ token ]
    );

    const userId = session.rows[0]?.user_id;

    const user = await DB.query(
      'SELECT * FROM users WHERE id = $1',
      [ userId ]
    );

    req.user = user.rows[0];
  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}