import { handleError } from "../utils";
import { Reviews, Places, Users } from "../models";
import { Op, fn, col } from "sequelize/dist";

async function list(req, res) {
	try {
		let options = {
			include: [
				{
					model: Users,
					as: "user",
					attributes: {
						exclude: ["password"],
						include: [
							[fn("concat", `${process.env.NODE_HOST}${process.env.PORT ? `:${process.env.PORT}` : ""}/images/`, col("passengers.user.profileImage")), "profileImageUrl"]
						]
					},
				},
				{
					model: Places,
					as: "place",
				},
				{
					model: Tags,
					as: "tags",
					include: [
						{
							model: Categories,
							as: "categories"
						}
					]
				}
			],
			order: [["updatedAt", "DESC"]]
		};

		const { id } = req.params;
		if (id) {
			const review = await Reviews.findByPk(id, options);

			if (review) {
				return res.send(review);
			}

			return res.status(404).json({ message: "Avaliação não encontrada" });
		} else {
			const { limit, offset } = req.query;

			if (limit && parseInt(limit) !== NaN) {
				if (offset && parseInt(offset) !== NaN) {
					options = {
						...options,
						limit: [parseInt(offset), parseInt(limit)],
					};
				}
				options = { ...options, limit: parseInt(limit) };
			}
			if (offset && parseInt(offset) !== NaN) {
				options = { ...options, offset: parseInt(offset) };
			}

			// Fetching and grouping categories
			let reviews = Reviews.findAll(options);


			return res.send(reviews);
		}
	} catch (error) {
		handleError(res, error);
	}
}

async function listByUser(req, res) {
	try {
		const { userId } = req.params;

		if (!(await Users.findByPk(userId))) {
			return res.status(404).json({ message: "Usuário não existe." });
		}

		let options = {
			include: [
				{
					model: Places,
					as: "place"
				},
				{
					model: Tags,
					as: "tags",
					include: [
						{
							model: Categories,
							as: "categories"
						}
					]
				}
			],
			order: [["updatedAt", "DESC"]],
			where: {
				userId: userId
			}
		};

		return res.send(await Reviews.findAll(options));
	} catch (error) {
		handleError(res, error);
	}
}

async function listByPlace(req, res) {
	try {
		const { placeId } = req.params;

		if (!(await Places.findByPk(placeId))) {
			return res.status(404).json({ message: "Lugar não existe." });
		}

		let options = {
			include: [
				{
					model: Users,
					as: "user",
					attributes: {
						exclude: ["password"],
						include: [
							[fn("concat", `${process.env.NODE_HOST}${process.env.PORT ? `:${process.env.PORT}` : ""}/images/`, col("passengers.user.profileImage")), "profileImageUrl"]
						]
					},
				},
				{
					model: Tags,
					as: "tags",
					include: [
						{
							model: Categories,
							as: "categories"
						}
					]
				}
			],
			order: [["updatedAt", "DESC"]],
			where: {
				placeId: placeId
			}
		};

		return res.send(await Reviews.findAll(options));
	} catch (error) {
		handleError(res, error);
	}
}

async function add(req, res) {
	try {
		const { userId, categories } = req.body;

		if (req.decodedToken.user != userId) {
			return res.status(403).json({ message: "Acesso negado." });
		}
		if (!(await Users.findByPk(userId))) {
			return res.status(404).json({ message: "Usuário não existe." });
		}

		const reviews = await Reviews.create({ ...req.body, userId: userId });
		const response = {
			message: "Avaliação registrada com sucesso.",
			ride: ride,
		};

		for (category in categories) {
			console.log(category);
		}

		return res.status(201).json(response);
	} catch (error) {
		handleError(res, error);
	}
}

async function remove(req, res) {
	try {
		const { id } = req.params;
		const review = await Reviews.findByPk(id);

		if (review) {
			if (req.decodedToken.user != review.userId) {
				return res.status(403).json({ message: "Acesso negado." });
			}

			const response = {
				message: "Avaliação excluída com sucesso."
			};

			return await review.destroy().then(() => {
				res.status(200).json(response);
			});
		}

		return res.status(404).json({ message: "Avaliação não encontrada." });
	} catch (error) {
		handleError(res, error);
	}
}

export default {
	list,
	listByUser,
	listByPlace,
	add,
	remove
};