import { DB } from "../database/db.js";

export async function urlValidation(req, res, next) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const session = await sessionsCollection.findOne({ token });
    const user = await usersCollection.findOne({ _id: session?.userId });

    if (!user) {
      return res.sendStatus(404);
    }

    req.user = user;

  } catch (err) {
    return res.sendStatus(500);
  }

  next();
}