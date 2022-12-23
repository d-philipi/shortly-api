import { signUpSchema } from "../models/usersModel.js";
import { DB } from "../database/db.js";

export async function signUpValidation(req, res, next) {
    const user = req.body;
    const validation = signUpSchema.validate(user, { abortEarly: false });

    if (user.password !== user.confirmPassword) {
        res.status(422).send({ message: "Senhas não correspondentes" });
    }

    if (validation.error) {
        const errors = validation.error.details.map((d) => d.message);
        res.status(422).send(errors);
        return;
    }

    const userExiste = await DB.query(
        "SELECT * FROM users WHERE users.email = $1",
        [user.email]
    );

    if(userExiste){
        return res.status(409).send({ message: "Usuário já existente" });
    }

    next();
}