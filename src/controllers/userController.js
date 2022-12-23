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
        res.send({ message: "Deu erro aqui!" }).Status(500);
      }
}

export async function signIn(req, res){

    const userExist = req.userLogado;
    const token = uuid();

    try {

        await DB.query(
            "INSERT INTO sessions (token, user_id) VALUES ( $1, $2 )",
            [ token, userExist.id ]
        );

        await DB.query(
            "INSERT INTO links ( user_id ) VALUES ( $1 )",
            [ userExist.id ]
        );
    } catch (err) {
        res.sendStatus(500);
    }

    res.send({ token }).status(200);
}

export async function userMe(req, res) {
    const user = req.user;

    const resultUser = await DB.query(
        `SELECT users.id, users.name, COUNT( visit ) AS "visitCount" 
            FROM users
            JOIN visits
            ON visits.user_id = users.id
            WHERE users.id = $1
            GROUP BY users.id
        `,
        [ user.id ]
    );

    const resultShort = await DB.query(
        `SELECT urls.id, urls.short_url, urls.url, COUNT( visit ) AS "visitCount" 
            FROM urls 
            JOIN visits 
            ON visits.user_id = urls.user_id
            WHERE urls.user_id = $1
            GROUP BY urls.id
        `,
        [ user.id ]
    );
    
    const objectUser = {
        ...resultUser.rows[0],
        shortenedUrls: resultShort.rows
    }
    

    res.send( objectUser ).status(200);
}