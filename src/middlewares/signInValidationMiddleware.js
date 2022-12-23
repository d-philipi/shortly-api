import bcrypt from "bcrypt";
import { DB } from "../database/db.js";
import { signInSchema } from "../models/userModel.js";

export async function signInValidation(req, res, next) {
    const user = req.body;
    const validation = signInSchema.validate(user, { abortEarly: false });
    const userExiste = await DB.query(
        "SELECT * FROM users WHERE users.email = $1",
        [user.email]
    );

    if (validation.error) {
        const errors = validation.error.details.map((d) => d.message);
        res.status(422).send(errors);
        return;
    }

    if(!userExiste){
        return res.status(401).send({ message: "Email ou senha incorretos!" });
    }

    const passwordOk = bcrypt.compareSync(user.password, userExiste.password);

    if(!passwordOk){
        return res.status(401).send({ message: "Email ou senha incorretos!" });
    }

    req.userLogado = userExiste;

    next();
}