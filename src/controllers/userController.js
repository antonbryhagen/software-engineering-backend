import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../models/index.js"

const { User } = db;

export const createUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({message: "Username and password required"});
        } 


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "Created user",
            id: newUser.id
        })

    } catch (error) {
        console.log("Error creating user: ", error);
        //TODO: Send back correct error for username already exists
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const authenticateUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({message: "Username and password required"});
        }

        const user = await User.findOne({ where: {username} });

        if (!user) {
            return res.status(404).json({ message: "Incorrect username and/or password" });
        }

        const matchingPassword = await bcrypt.compare(password, user.password);

        if (!matchingPassword) {
            return res.status(401).json({ message: "Incorrect username and/or password" });
        }

        const token = jwt.sign(
            { user_id: user.id, username: user.username, admin: user.admin },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({"token": token});
        
    } catch (error) {
        console.log("Error authenticating user: ", error);
        //TODO: Send back correct error
        return res.status(500).json({ message: "Internal Server Error" });
    }
}