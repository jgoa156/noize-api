import { handleError } from "../utils";
import { Categories, Tags } from "../models";
import { Op } from "sequelize/dist";

async function list(req, res) {
	try {
		let options = {
			attributes: ["id", "name"]
		};

		const { limit, offset, search } = req.query;

		// Limit & offset
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

		// Search
		if (search && search.length != 0) {
			options = {
				...options, where: {
					name: { [Op.like]: `%${search}%` }
				}
			};
		}

		const { id } = req.params;
		if (id) {
			options = {
				...options,
				include: [
					{
						model: Categories,
						as: "categories",
						attributes: [],
						where: {
							id: id
						}
					}
				]
			}
		}

		return res.send(await Tags.findAll(options));
	} catch (error) {
		handleError(res, error);
	}
}

async function add(req, res) {
	try {
		const { id } = req.params;
		const category = await Categories.findByPk(id);

		const tag = await Tags.findOrCreate({
			where: { name: req.query.name },
		});

		category.addTag(tag);

		return res.status(201).json({
			message: "Tag adicionada com sucesso.",
			tag: tag,
		});
	} catch (error) {
		handleError(res, error);
	}
}

export default {
	list,
	add
};