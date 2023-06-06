import jwt from "jsonwebtoken";
require("dotenv").config();

function verifyAuth(req, res, next) {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send({ message: "Usuário não autenticado" });
  }

  token = token.replace("Bearer ", "");

  try {
    req.decodedToken = jwt.verify(token, process.env.SECRET);
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError" || error.name == "JsonWebTokenError") {
      return res.status(401).json({
        message: "Token inválido"
      });
    }

    return res.status(500).json({
      message: "Erro autenticando token; por favor, tente novamente"
    });
  }
}

export default { verifyAuth };
