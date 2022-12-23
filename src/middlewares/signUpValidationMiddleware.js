import { signUpSchema } from "../models/userModel.js";
import { DB } from "../database/db.js";

export async function signUpValidation(req, res, next) {
    const user = req.body;
    const validation = signUpSchema.validate(user, { abortEarly: false });

    if (user.password !== user.confirmPassword) {
        res.status(422).send({ message: "Senhas não correspondentes" });
        return;
    }

    if (validation.error) {
        const errors = validation.error.details.map((d) => d.message);
        res.status(422).send(errors);
        return;
    }

    const userExist = await DB.query(
        "SELECT * FROM users WHERE users.email = $1",
        [user.email]
    );

    if(userExist.rows.length > 0){
        return res.status(409).send({ message: "Usuário existente!" });
    }

    next();
}