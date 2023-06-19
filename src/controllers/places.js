import { handleError } from "../utils";
import { Users, Places, OpeningHours, Reviews, Categories, Tags, PlaceImages } from "../models";
import { Op, fn, col } from "sequelize/dist";

async function list(req, res) {
	try {
		let options = {
			order: [["updatedAt", "DESC"]],
			include: [
				{
					model: OpeningHours,
					as: "openingHours",
					attributes: ["day", "hourStart", "hourEnd"]
				},
				{
					model: PlaceImages,
					as: "images",
					attributes: ["link"]
				}
			],
		};

		const { reviews } = req.query;
		if (reviews && Boolean(reviews).valueOf()) {
			options = {
				...options,
				include: [
					...options.include,
					{
						model: Reviews,
						as: "reviews",
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
						]
					}
				]
			}
		}

		const { id } = req.params;
		if (id) {
			const place = await Places.findByPk(id, options);

			if (place) {
				return res.send(place);
			}

			return res.status(404).json({ message: "Lugar não encontrado" });
		} else {
			const { limit, offset, search } = req.query;

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

			return res.send(await Places.findAll(options));
		}
	} catch (error) {
		handleError(res, error);
	}
}

async function listByProximity(req, res) {
	try {
		const { lat, lng } = req.query;

		let options = {
			order: [["updatedAt", "DESC"]],
		};

		return res.send(await Places.findAll(options));
	} catch (error) {
		handleError(res, error);
	}
}

async function add(req, res) {
	try {
		const { name, openingHours, images } = req.body;
		const _place = await Places.findOne({ where: { name: name } });
		if (_place) {
			return res.status(202).json({
				message: "Lugar já registrado.",
				place: _place,
			});
		}

		const place = await Places.create({ ...req.body });
		openingHours.forEach(async (openingHour, index) => {
			await OpeningHours.create({
				day: index,
				placeId: place.id,
				hourStart: openingHour.hourStart,
				hourEnd: openingHour.hourEnd,
			});
		});

		images.forEach(async (link) => {
			await PlaceImages.create({
				link: link,
				placeId: place.id
			});
		});

		return res.status(201).json({
			message: "Lugar adicionado com sucesso.",
			place: place,
		});
	} catch (error) {
		handleError(res, error);
	}
}

export default {
	list,
	listByProximity,
	add,
};
