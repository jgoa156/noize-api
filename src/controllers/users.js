import { handleError, generateAndCreateToken, mail } from "../utils";
import { Users, Rides } from "../models";
import { Op } from "sequelize/dist";
import path from "path";
import fs from "fs";
import sharp from "sharp";

async function updateName(req, res) {
	try {
		let options = {
			attributes: {
				exclude: ["password"],
				include: [
					[
						`concat('${process.env.NODE_HOST}${process.env.PORT ? `:${process.env.PORT}` : ""
						}/images/', profileImage)`,
						"profileImageUrl",
					],
				],
			},
		};

		const { id } = req.params;
		if (req.decodedToken.user != id) {
			return res.status(403).json({ message: "Acesso negado." });
		}

		const user = await Users.findByPk(id, options);

		if (user) {
			let { name } = req.body;

			return await user.update({ name }).then(() => {
				const response = {
					message: "Nome atualizado com sucesso.",
					user: user,
				};

				return res.status(200).json(response);
			});
		}

		return res.status(404).json({ message: "Usuário não encontrado." });
	} catch (error) {
		handleError(res, error);
	}
}

async function updateProfilePicture(req, res) {
	try {
		let options = {
			attributes: {
				exclude: ["password"],
				include: [
					[
						`concat('${process.env.NODE_HOST}${process.env.PORT ? `:${process.env.PORT}` : ""
						}/images/', profileImage)`,
						"profileImageUrl",
					],
				],
			},
		};

		const { id } = req.params;
		if (req.decodedToken.user != id) {
			return res.status(403).json({ message: "Acesso negado." });
		}

		const user = await Users.findByPk(id, options);

		if (user) {
			if (req.files.file.path) {
				const temp = req.files.file.path;
				const newPath = path.join(__dirname, "../../public/images/");
				const time = new Date().getTime();
				const currentProfileImagePath = `${path}${user.profileImage}`;
				const newProfileImage = `${user.id}_${time}.jpg`;
				const newProfileImageUrl = `${process.env.NODE_HOST}${process.env.PORT
						? `:${process.env.PORT}/images/${newProfileImage}`
						: ""
					}`;

				// Convert, crop and compress new file
				const tempProcessed = `${temp}_${time}.jpeg`;
				await sharp(temp)
					.resize({
						fit: "cover",
						width: 250,
						height: 250,
					})
					.toFormat("jpeg", { mozjpeg: true })
					.toFile(tempProcessed);

				//--- 1. Image processed, proceeding to moving the image
				// Move the uploaded file
				return fs.rename(
					tempProcessed,
					`${newPath}${newProfileImage}`,
					async (err) => {
						if (err) {
							//--- 2.2 Rename error
							handleError(res, err);
						} else {
							//--- 2.1 Image moved, proceeding to unlinking and saving
							// If there is an image already, delete it
							if (
								user.profileImage &&
								fs.existsSync(currentProfileImagePath)
							) {
								return fs.unlink(
									currentProfileImagePath,
									async (err) => {
										if (err) {
											//--- 3.2 Unlink error
											handleError(res, err);
										} else {
											// Set the name in the database AFTER old image was deleted
											return await user
												.update({
													profileImage:
														newProfileImage,
												})
												.then(() => {
													const response = {
														message:
															"Imagem atualizado com sucesso.",
														user: {
															...user.dataValues,
															profileImageUrl:
																newProfileImageUrl,
														},
													};

													//--- 3.1 New image set
													return res
														.status(200)
														.json(response);
												});
										}
									}
								);
							} else {
								// Set the name in the database
								return await user
									.update({ profileImage: newProfileImage })
									.then(() => {
										const response = {
											message:
												"Imagem atualizado com sucesso.",
											user: {
												...user.dataValues,
												profileImageUrl:
													newProfileImageUrl,
											},
										};

										//--- 3.1 New image set;
										return res.status(200).json(response);
									});
							}
						}
					}
				);
			}
		}

		return res.status(404).json({ message: "Usuário não encontrado." });
	} catch (error) {
		handleError(res, error);
	}
}

async function sendEmailLink(req, res) {
	try {
		const { id } = req.params;
		const { email } = req.body;

		if (req.decodedToken.user != id) {
			return res.status(403).json({ message: "Acesso negado." });
		}

		const user = await Users.findByPk(id);

		if (user) {
			if (
				email != user.email &&
				(await Users.findOne({ where: { email: email } }))
			) {
				return res
					.status(400)
					.json({ message: "Email já cadastrado." });
			}

			const token = await generateAndCreateToken(id, "E");
			const info = await mail(
				email,
				"Confirmação de email",
				`${process.env.CLIENT_HOST}/conta/email?token=${token}&email=${email}`
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

export default {
	updateName,
	updateProfilePicture,
	sendEmailLink,
};
