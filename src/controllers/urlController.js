import { DB } from "../database/db.js";
import { nanoid } from 'nanoid'

export async function shorten(req, res) {
    const { url } = req.body;
    const shortUrl = nanoid();

    try{
        await DB.query(
            "INSERT INTO urls ( url, short_url ) VALUES ( $1, $2 )",
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
    const { shorten } = req.params;
    const urlExist = await DB.query(
        "SELECT * FROM urls WHERE urls.short_url = $1",
        [ shorten ]
    );

    if(!urlExist){
        return res.sendStatus(404);
    }

    try{
        await DB.query(
            "INSERT INTO visits ( short_url, visit ) VALUES ( $1, $2 )",
            [ shortUrl, 1 ]
        );

        res.redirect( urlExist.url );
    }catch{
        return res.sendStatus(500);
    }
}

export async function deleteUrl(req, res) {
    
}