import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../../models/index.js"

const { User } = db;

export const createUser = async (req, res) => {
    try {
        const { username, password, admin } = req.body;

        if (!username || !password) {
            return res.status(400).json({message: "Username and password required"});
        } 

        console.log(admin)

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            password: hashedPassword,
            admin: admin ? admin : false
        });

        return res.status(201).json({
            message: "Created user",
            user_id: newUser.id
        })

    } catch (error) {
        console.log("Error creating user: ", error);
        if (error.name == "SequelizeUniqueConstraintError") {
            return res.status(500).json({ message: "Username already exists" });
        }
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
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getUserById = async (req, res) => {
    try {
        const id = req.params.user_id;

        const user = await User.findByPk(id, {
            attributes: ["id", "username", "admin"],
        });

        if (!user){
            return res.status(404).json({ message: "User not found" });
        }

        if ((req.user.user_id != req.params.user_id) && !req.user.admin){
            console.log(req.user.admin)
            return res.status(403).json({ message: "Invalid authorization" });
        }

        res.json({
            user_id: user.id,
            username: user.username,
            admin: user.admin
        })
    } catch (error) {
        console.log("Error getting user: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        if(!req.user.admin){
            return res.status(403).json({ message: "Invalid authorization" });
        }
        const users = await User.findAll({
            attributes: ["id", "username", "admin"],
        });

        const formattedUsers = users.map(user => ({
            user_id: user.id,
            username: user.username,
            admin: user.admin
        })) 

        res.json(formattedUsers)
    } catch (error) {
        console.log("Error getting users: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteUserById = async (req, res) => {
    try {
        if(!req.user.admin){
            return res.status(403).json({ message: "Invalid authorization" });
        }

        const id = req.params.user_id;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.destroy();

        res.json({ message: "User deleted" });

    } catch (error) {
        console.log("Error deleting user: ", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}