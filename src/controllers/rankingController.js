import { DB } from "../database/db.js";

export async function ranking(req, res) {
    
    const resultUser = await DB.query(
        `SELECT users.id, users.name,COUNT ( links ) AS "linksCount" COUNT( visit ) AS "visitCount" 
            FROM users
            JOIN links
            ON links.user_id = users.id
            JOIN visits
            ON visits.user_id = users.id
            GROUP BY users.id
            ORDER BY "visitCount"
            LIMIT 10
        `,
        []
    );

    res.send( resultUser.rows ).Status(200);
}