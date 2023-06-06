import { handleError } from "../utils";
import { Rides, RidePassengers, Users, UserVehicles } from "../models";
import { Op, fn, col } from "sequelize/dist";

async function list(req, res) {
	try {
		let options = {
			order: [["updatedAt", "DESC"]],
		};

		const { id } = req.params;

		if (id) {
			const place = await Places.findByPk(id, options);

			if (place) {
				return res.send(ride);
			}

			return res.status(404).json({ message: "Lugar não encontrado" });
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

			return res.send(await Rides.findAll(options));
		}
	} catch (error) {
		handleError(res, error);
	}
}

async function listByProximity(req, res) {
	try {
		let options = {
			order: [["updatedAt", "DESC"]]
		};

		return res.send(await Places.findAll(options));
	} catch (error) {
		handleError(res, error);
	}
}

async function add(req, res) {
	try {
		const { userId } = req.body;

		if (req.decodedToken.user != userId) {
			return res.status(403).json({ message: "Acesso negado." });
		}
		if (!(await Users.findByPk(userId))) {
			return res.status(404).json({ message: "Usuário não existe." });
		}
		if ((await Rides.findAll({ where: { userId: userId, [Op.or]: [{ status: "A" }, { status: "P" }] } })).length > 0) {
			return res.status(400).json({ message: "Usuário só pode ter um pedido ou solicitação de carona pendente por vez." });
		}

		const ride = await Rides.create({ ...req.body, userId: userId, status: "P" });
		const response = {
			message: "Carona registrada com sucesso.",
			ride: ride,
		};

		return res.status(201).json(response);
	} catch (error) {
		handleError(res, error);
	}
}

export default {
	list,
	listByProximity,
	add
};
