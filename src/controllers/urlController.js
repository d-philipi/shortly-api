import { DB } from "../database/db.js";
import { nanoid } from 'nanoid'

export async function shorten(req, res) {
    const { url } = req.body;
    const shortUrl = nanoid();

    try{
        await DB.query(
            "INSERT INTO urls ( url, shortUrl ) VALUES ( $1, $2 )",
            [ url, shortUrl ]
        );

        res.send({ shortUrl }).Status(201);
    }catch{
        return res.sendStatus(500);
    }
}

export async function findUrl(req, res) {
    const { id } = req.params;
    const url = await DB.query(
        "SELECT * FROM urls WHERE urls.id = $1",
        [ id ]
    );

    if(!url){
        return res.sendStatus(500);
    }

    res.send(url).Status(200);
}

export async function findShortUrl(req, res) {
    
}

export async function deleteUrl(req, res) {
    
}