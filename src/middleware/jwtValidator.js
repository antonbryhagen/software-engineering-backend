import jwt from "jsonwebtoken";

const validateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader){
        return res.status(403).json({ message: "Access Denied" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        const jwtPayload = jwt.verify(authHeader, secret);
        req.user = jwtPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Access Denied" });
    }

}

export default validateJWT;