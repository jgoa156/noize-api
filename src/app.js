require("dotenv").config();

import express from "express";
import routes from "./routes";
import cors from "cors";
import formidable from "express-formidable";

const morgan = require("morgan");

const app = express();
app.use(formidable());
app.use(express.static("public"));
app.use(morgan("combined"));
app.use(cors());
app.use(routes);

const http = require("http").createServer(app);
const io = require("socket.io")(http, {
	cors: {
		origin: "*",
		methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"],
		credentials: false
	}
});

http.listen(process.env.PORT, () => {
	console.log(`Server running at ${process.env.PORT}`);
});

export { io };
