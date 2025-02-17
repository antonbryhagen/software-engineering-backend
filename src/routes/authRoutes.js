import express from "express";

const router = express.Router();

router.post("/register", async (req, res) => {
    const { username, password, admin } = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password required"});
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    //TODO: Add user to database

    // res.status(201).json({
    //     user_id: 1,
    //     username: "name",
    //     admin: "true"
    // });

});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    //TODO: Find user, compare passwords, genearte JWT token
})

export default router;