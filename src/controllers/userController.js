import bcrypt from "bcrypt";
import { DB } from "../database/db.js";
import { v4 as uuid } from "uuid";

export async function signUp(req, res){
    const user = req.body;

    try {
        const hashPassword = bcrypt.hashSync(user.password, 10);

        await DB.query(
            "INSERT INTO users (name, email, password) VALUES ( $1, $2, $3 )",
            [user.name, user.email, hashPassword]
        );

        res.sendStatus(201);
      } catch (err) {
        res.sendStatus(500);
      }
}

export async function signIn(req, res){

    const userExiste = req.userLogado;
    const token = uuid();

    try {

        await DB.query(
            "INSERT INTO sessions (token, userId) VALUE ( $1, $2 )",
            [ token, userExiste._id ]
        );

        res.send({ token }).Status(200);
    } catch (err) {
        res.sendStatus(500);
    }
}

export async function userMe(req, res) {
    
}