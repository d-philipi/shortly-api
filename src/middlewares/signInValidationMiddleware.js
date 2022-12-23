import bcrypt from "bcrypt";
import { DB } from "../database/db.js";
import { signInSchema } from "../models/userModel.js";

export async function signInValidation(req, res, next) {
    const user = req.body;
    const validation = signInSchema.validate(user, { abortEarly: false });
    const userExist = await DB.query(
        'SELECT * FROM users WHERE email = $1',
        [user.email]
    );

    if (validation.error) {
        const errors = validation.error.details.map((d) => d.message);
        res.status(422).send(errors);
        return;
    }

    if(!userExist.rows[0]){
        return res.status(401).send({ message: "Email ou senha incorretos!" });
    }

    const passwordOk = bcrypt.compareSync(user.password, userExist.rows[0].password);

    if(!passwordOk){
        return res.status(401).send({ message: "Email ou senha incorretos!" });
    }

    req.userLogado = userExist.rows[0];

    next();
}