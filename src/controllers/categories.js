import { handleError } from "../utils";
import { Categories } from "../models";

async function list(req, res) {
	try {
		return res.send(await Categories.findAll({
			attributes: ["id", "name"]
		}));
	} catch (error) {
		handleError(res, error);
	}
}

export default {
	list
};