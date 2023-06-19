import {
	ValidationError,
	UniqueConstraintError,
	ForeignKeyConstraintError,
	AccessDeniedError,
} from "sequelize";
import nodemailer from "nodemailer";
import { Tokens } from "./models";

export function parseFormidable(req, res, next) {
	req.body = req.fields;
	next();
}

export function handleError(res, error) {
	let code;

	if (
		error instanceof ValidationError ||
		error instanceof UniqueConstraintError ||
		error instanceof ForeignKeyConstraintError
	)
		code = 400;
	else if (error instanceof AccessDeniedError) code = 403;
	else code = 500;

	const message =
		error.parent && error.parent.sqlMessage
			? error.parent.sqlMessage
			: error.errors && error.errors[0].message
			? error.errors[0].message
			: error.message;

	return res.status(code).json({ message: message });
}

export function isVehiclePlate(plate) {
	const regexes = [
		/^[a-zA-Z]{3}[0-9]{4}$/, // Normal
		/^[a-zA-Z]{3}[0-9]{1}[a-zA-Z]{1}[0-9]{2}$/, // Mercosul cars
		/^[a-zA-Z]{3}[0-9]{2}[a-zA-Z]{1}[0-9]{1}$/, // Mercosul motorcycles
	];

	let result = false;
	regexes.forEach((regex) => {
		if (regex.test(plate)) {
			result = true;
		}
	});

	return result;
}

export function generateToken() {
	const length = 10;
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	let result = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}

	return result;
}

export async function generateAndCreateToken(userId, type) {
	try {
		await Tokens.destroy({
			where: {
				userId: userId,
				type: type,
			},
		});

		let token = generateToken();
		while (token == "" && (await Tokens.findByPk(token))) {
			token = generateToken();
		}
		await Tokens.create({ token: token, userId: userId, type: type });

		return token;
	} catch (error) {
		return error;
	}
}

export async function mail(to, subject, body) {
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 587,
		secure: false,
		service: "gmail",
		auth: {
			user: "ubaicomp@gmail.com",
			pass: "tpxafymdgjfzbkrh",
		},
		tls: {
			rejectUnauthorized: false,
		},
	});

	const info = await transporter.sendMail(
		{
			from: '"Ubá" <ubaicomp@gmail.com>',
			to: to,
			subject: subject,
			text: "Teste",
			html: body,
		},
		(error, info) => {
			if (error) {
				return error;
			}
			return info;
		}
	);

	return info;
}

function groupBy(xs, key) {
	return xs.reduce(function (rv, x) {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
}

export function isLatitude(num) {
	return isFinite(num) && Math.abs(num) <= 90;
}

export function isLongitude(num) {
	return isFinite(num) && Math.abs(num) <= 180;
}
