import { handleError } from "../utils";
import { Reviews, Places, Users, Tags, Categories, ReviewTags } from "../models";
import { Op, fn, col, literal } from "sequelize/dist";

async function list(req, res) {
	try {
		let options = {
			include: [
				{
					model: Users,
					as: "user",
					attributes: ["id", "name", "email", [fn("concat", `${process.env.NODE_HOST}${process.env.PORT ? `:${process.env.PORT}` : ""}/images/`, col("user.profileImage")), "profileImageUrl"]]
				},
				{
					model: Places,
					as: "place",
					attributes: ["id", "name", "address", "lat", "lng"]
				},
				{
					model: Categories,
					as: "categories",
					attributes: ["id", "name"],
					through: {
						attributes: []
					},
					include: [
						{
							model: Tags,
							as: "tags",
							attributes: ["id", "name"],
							through: {
								attributes: []
							},
						},
					],
				},
			],
			where: {
				"$categories.tags.ReviewTags.reviewId$": { [Op.col]: "Reviews.id" }
			},
			order: [["updatedAt", "DESC"]]
		};

		const { id } = req.params;
		if (id) {
			const review = await Reviews.findByPk(id, options);

			if (review) {
				return res.send(review);
			}

			return res
				.status(404)
				.json({ message: "Avaliação não encontrada" });
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
			return res.send(await Reviews.findAll(options));
		}
	} catch (error) {
		handleError(res, error);
	}
}

async function listByUser(req, res) {
	try {
		const { id } = req.params;

		if (!(await Users.findByPk(id))) {
			return res.status(404).json({ message: "Usuário não existe." });
		}

		let options = {
			include: [
				{
					model: Places,
					as: "place",
					attributes: ["id", "name", "address", "lat", "lng"]
				},
				{
					model: Categories,
					as: "categories",
					attributes: ["id", "name"],
					through: {
						attributes: []
					},
					include: [
						{
							model: Tags,
							as: "tags",
							attributes: ["id", "name"],
							through: {
								attributes: []
							}
						},
					],
				},
			],
			order: [["updatedAt", "DESC"]],
			where: {
				userId: id,
				"$categories.tags.ReviewTags.reviewId$": { [Op.col]: "Reviews.id" }
			},
		};

		return res.send(await Reviews.findAll(options));
	} catch (error) {
		handleError(res, error);
	}
}

async function listByPlace(req, res) {
	try {
		const { id } = req.params;

		if (!(await Places.findByPk(id))) {
			return res.status(404).json({ message: "Lugar não existe." });
		}

		let options = {
			include: [
				{
					model: Users,
					as: "user",
					attributes: ["id", "name", "email"]
				},
				{
					model: Categories,
					as: "categories",
					attributes: ["id", "name"],
					through: {
						attributes: []
					},
					include: [
						{
							model: Tags,
							as: "tags",
							attributes: ["id", "name"],
							through: {
								attributes: []
							}
						},
					],
				},
			],
			order: [["updatedAt", "DESC"]],
			where: {
				placeId: id,
				"$categories.tags.ReviewTags.reviewId$": { [Op.col]: "Reviews.id" }
			},
		};

		return res.send(await Reviews.findAll(options));
	} catch (error) {
		handleError(res, error);
	}
}

async function add(req, res) {
	try {
		const { placeId } = req.params;
		const userId = req.decodedToken.user;

		if (!(await Places.findByPk(placeId))) {
			return res.status(404).json({ message: "Lugar não existe." });
		}
		if (
			await Reviews.findOne({
				where: { placeId: placeId, userId: userId },
			})
		) {
			return res.status(400).json({
				message:
					"Já existe uma avaliação desse lugar feita por este usuário.",
			});
		}

		const review = await Reviews.create({
			...req.body,
			placeId: placeId,
			userId: userId,
		});

		const { tags } = req.body;
		for (const [categoryName, _tags] of Object.entries(tags)) {
			let category = await Categories.findOne({
				where: { name: categoryName },
			});

			_tags.forEach(async (tagName, index) => {
				let [tag] = await Tags.findOrCreate({
					where: { name: tagName },
				});

				await ReviewTags.create({
					reviewId: review.id,
					categoryId: category.id,
					tagId: tag.id
				});
			});
		}

		return res.status(201).json({
			message: "Avaliação registrada com sucesso.",
			review: review,
		});
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
				message: "Avaliação excluída com sucesso.",
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
	remove,
};
