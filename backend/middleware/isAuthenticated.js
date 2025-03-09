import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // First try to get token from cookies
        let token = req.cookies.token;
        
        // If no token in cookies, check Authorization header
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.id = decoded.userid;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });
    }
};

export default isAuthenticated;