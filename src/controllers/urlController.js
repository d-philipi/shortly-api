import { DB } from "../database/db.js";
import { nanoid } from 'nanoid'

export async function shorten(req, res) {
    const { url }  = req.body;
    const user = req.user; 
    const shortUrl = nanoid();

    try{
        await DB.query(
            'INSERT INTO urls ( url, short_url, user_id ) VALUES ( $1, $2, $3 )',
            [ url, shortUrl, user.id ]
        );

        await DB.query(
            'INSERT INTO links ( user_id, qtd_link ) VALUES ( $1, $2 )',
            [ user.id, 1 ]
        );

    }catch{
        return res.sendStatus(500);
    }

    res.send({ shortUrl }).status(201);
}

export async function findUrl(req, res) {
    const { id } = req.params;
    const url = await DB.query(
        'SELECT * FROM urls WHERE id = $1',
        [ id ]
    );

    if(!url.rows[0]){
        return res.sendStatus(500);
    }

    res.send(url.rows[0]).status(200);
}

export async function findShortUrl(req, res) {
    const { shortUrl } = req.params;
    const urlExist = await DB.query(
        'SELECT * FROM urls WHERE short_url = $1',
        [ shortUrl ]
    );

    if(!urlExist.rows[0]){
        return res.sendStatus(404);
    }

    try{
        await DB.query(
            'INSERT INTO visits ( short_url, user_id, visit ) VALUES ( $1, $2, $3 )',
            [ shortUrl, urlExist.rows[0].user_id, 1 ]
        );

    }catch{
        return res.sendStatus(500);
    }

    res.redirect( urlExist.rows[0].url );
}

export async function deleteUrl(req, res) {
    const { id } = req.params;

    try{
        await DB.query(
          'DELETE FROM urls WHERE id = $1',
          [ id ]
        );

    }catch{
         return res.send({ message: "Deu erro aqui"}).status(500);
    }

    res.sendStatus(200);
}