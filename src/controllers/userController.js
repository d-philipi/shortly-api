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

        await DB.query(
            "INSERT INTO links ( user_id ) VALUES ( $1 )",
            [ user.id ]
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
    const user = req.user;

    const resultUser = await DB.query(
        `SELECT users.id, users.name, COUNT( visit ) AS "visitCount" 
            FROM users
            JOIN visits
            ON visits.user_id = users.id
            WHERE users.id = $1
        `,
        [ user.id ]
    );

    const resultShort = await DB.query(
        `SELECT urls.id, urls.short_url, url.url, COUNT( visit ) AS "visitCount" 
            FROM urls 
            JOIN visits 
            ON urls.short_url = visits.short_url
            WHERE urls.user_id = $1
            GROUP BY urls.short_url
        `,
        [ user.id ]
    );

    const objectUser = {
        ...resultUser,
        shortenedUrls: resultShort.rows
    }

    res.send( objectUser ).Status(200);
}

/*
Result do user (resultUser) vai fazer um select buscando id do usuário, nome  e fazer um join com
a contagem total de visitas a partir dos links vinculados ao user_id.

Result das shorts (resultShort) vai fazer um select buscando id da url, short_url, url e fazer um join
com a contagem total de visitas em cada link.
*/