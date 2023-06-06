import { handleError } from "../utils";
import { Tokens, Users } from "../models";
import { Op } from "sequelize/dist";
import cron from "node-cron";
import moment from "moment";

const CRON_TIMER = '*/5 * * * *';
cron.schedule(CRON_TIMER, async () => {
	// Expire tokens not used in the last 12 hours
	console.log("Expiring tokens", moment());
	try {
		await Tokens.destroy({
			where: {
				createdAt: {
					[Op.lt]: moment().subtract(12, 'h')
				}
			}
		})
	} catch (err) {
		console.log(err);
	}
});

async function find(req, res) {
	try {
		const { token } = req.params;
		const { type } = req.query;

		let options = {
			include: [
				{
					model: Users,
					as: "user",
					attributes: {
						exclude: ["password"]
					},
				},
			],
			where: {
				type: type
			}
		};

		const tokenObj = await Tokens.findByPk(token, options);

		if (tokenObj) {
			return res.send(tokenObj);
		}

		return res.status(404).json({ message: "Token não encontrado." });
	} catch (error) {
		handleError(res, error);
	}
}

export default { find };