import bcrypt from 'bcrypt';
import User from "../db/models/user.js";
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullName,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            success: true,
            message: "User created successfully"

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }
        const token = jwt.sign({ userid: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });


        return res.status(200).cookie("token", token, { 
            httpOnly: true, 
            sameSite: "strict", 
            maxAge: 1000 * 60 * 60 * 24,
            secure: process.env.NODE_ENV === "production"
        }).json({
            success: true,
            message: `Welcome back ${user.fullName}`,
            fullName: user.fullName,
            token: token // Include token in the response for cross-browser compatibility
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

// Add a new endpoint to get the token
export const getToken = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }
        
        return res.status(200).json({
            success: true,
            token: token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Add a verify-token endpoint to validate tokens
export const verifyToken = async (req, res) => {
    try {
        // The token is already verified by the isAuthenticated middleware
        // If execution reaches here, the token is valid
        return res.status(200).json({
            success: true,
            message: "Token is valid"
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Invalid token",
            error: error.message
        });
    }
};

export const logout = async (_, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}