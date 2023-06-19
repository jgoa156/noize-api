import bcrypt from "bcryptjs";
import { handleError, generateAndCreateToken, mail } from "../utils";
import { Users, Tokens } from "../models";
import jwt from "jsonwebtoken";
require("dotenv").config();

async function login(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).send({ message: "Email ou senha faltando" });
		}

		// Procurando
		let user = await Users.findOne({ where: { email: email } });

		if (!user) {
			return res.status(404).send({ message: "Usuário não encontrado" });
		}

		if (await bcrypt.compare(password, user.password)) {
			// Autenticando
			const token = jwt.sign({ user: user.id }, process.env.SECRET, {
				expiresIn: "1h",
			});
			const refreshToken = jwt.sign(
				{ user: user.id },
				process.env.SECRET,
				{
					expiresIn: "24h",
				}
			);

			res.header(
				"Access-Control-Expose-Headers",
				"authorization, refresh_token"
			);
			res.header("authorization", token).header(
				"refresh_token",
				refreshToken
			);

			// Enviando
			user.password = undefined;
			const response = {
				message:
					"Usuário autenticado com sucesso; credenciais válidas por 1 hora",
				user: user,
			};

			return res.send(response);
		}
		return res.status(401).send({ message: "Senha inválida" });
	} catch (error) {
		handleError(res, error);
	}
}

async function signUp(req, res) {
	try {
		// Validando
		if (!req.body.password) {
			return res.status(400).json({ message: "Senha não pode ser nula" });
		}

		// Criptografando password
		const passwordHashed = await bcrypt.hash(
			req.body.password,
			await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS))
		);

		// Criando
		let user = await Users.create({
			...req.body,
			password: passwordHashed,
		}).then((user) => {
			return user.get({ plain: true });
		});

		user = await Users.findByPk(user.id);
		user.setDataValue("firstLogin", true);

		// Email de confirmação
		const tokenEmail = await generateAndCreateToken(user.id, "E");
		const info = await mail(
			user.email,
			"Confirmação de email - Nova conta",
			`${process.env.CLIENT_HOST}/conta/email?token=${tokenEmail}`
		);

		// Autenticando
		const token = jwt.sign({ user: user.id }, process.env.SECRET, {
			expiresIn: "1h",
		});
		const refreshToken = jwt.sign({ user: user.id }, process.env.SECRET, {
			expiresIn: "24h",
		});

		res.header(
			"Access-Control-Expose-Headers",
			"authorization, refresh_token"
		);
		res.header("authorization", token).header(
			"refresh_token",
			refreshToken
		);

		// Enviando
		user.password = undefined;
		const response = {
			message: "Usuário criado com sucesso",
			user: user,
		};

		return res.status(201).json(response);
	} catch (error) {
		handleError(res, error);
	}
}

async function refreshToken(req, res) {
	try {
		const { refreshToken } = req.body;
		if (!refreshToken) {
			return res.status(400).send({ message: "Token inválido" });
		}

		const decodedToken = jwt.verify(refreshToken, process.env.SECRET);

		// Autenticando
		const newToken = jwt.sign(
			{ user: decodedToken.user },
			process.env.SECRET,
			{ expiresIn: "1h" }
		);
		const newRefreshToken = jwt.sign(
			{ user: decodedToken.user },
			process.env.SECRET,
			{ expiresIn: "24h" }
		);

		res.header(
			"Access-Control-Expose-Headers",
			"authorization, refresh_token"
		);
		res.header("authorization", newToken).header(
			"refresh_token",
			newRefreshToken
		);

		// Enviando
		const response = {
			message: "Usuário autenticado com sucesso",
		};

		return res.status(200).json(response);
	} catch (error) {
		if (
			error.name == "TokenExpiredError" ||
			error.name == "JsonWebTokenError"
		) {
			return res.status(401).json({
				error: error,
			});
		}

		handleError(res, error);
	}
}

async function sendPasswordLink(req, res) {
	try {
		const { email } = req.body;
		const user = await Users.findOne({ where: { email: email } });

		if (user) {
			const token = await generateAndCreateToken(user.id, "P");
			const info = await mail(
				user.email,
				"Redefinição de senha",
				`${process.env.CLIENT_HOST}/conta/senha?token=${token}`
			);

			const response = {
				message: "Email enviado com sucesso",
			};

			return res.status(200).json(response);
		}

		return res.status(404).json({ message: "Usuário não encontrado." });
	} catch (error) {
		handleError(res, error);
	}
}

async function confirmEmail(req, res) {
	try {
		const { token } = req.params;
		const tokenObj = await Tokens.findOne({
			where: {
				token: token,
				type: "E",
			},
		});

		if (tokenObj) {
			const user = await Users.findOne({
				where: { email: tokenObj.userEmail },
			});
			const { email } = req.body;

			return await tokenObj.destroy().then(async () => {
				return await user
					.update({ confirmedEmail: true, email: email })
					.then(() => {
						const response = {
							message: "Email confirmado com sucesso.",
							user: user,
						};

						return res.status(200).json(response);
					});
			});
		}

		return res.status(404).json({ message: "Token não encontrado." });
	} catch (error) {
		handleError(res, error);
	}
}

async function updatePassword(req, res) {
	try {
		const { token } = req.params;
		const tokenObj = await Tokens.findOne({
			where: {
				token: token,
				type: "P",
			},
		});

		if (token) {
			let user = await Users.findByPk(tokenObj.userEmail);
			const password = await bcrypt.hash(
				req.body.password,
				await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS))
			);

			return await tokenObj.destroy().then(async () => {
				return await user.update({ password: password }).then(() => {
					delete user.password;
					const response = {
						message: "Senha atualizada com sucesso.",
						user: user,
					};

					return res.status(200).json(response);
				});
			});
		}

		return res.status(404).json({ message: "Token não encontrado." });
	} catch (error) {
		handleError(res, error);
	}
}

export default {
	login,
	signUp,
	refreshToken,
	sendPasswordLink,
	confirmEmail,
	updatePassword,
};
