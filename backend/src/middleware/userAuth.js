import jwt from "jsonwebtoken";

const userAuth = async (req,res,next) => {
    
    try{
        const token = req.cookies?.token;
        if(!token){
            return res.status(401).json({success:false,message: "Not authorized. Please log in again."});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id) {
            return res.status(401).json({success: false, message: "Invalid token. Please log in again."});
        }
        req.userId = decoded.id;
        next();
    }
    catch(err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({success: false, message: "Session expired. Please log in again."});
        }
        return res.status(401).json({success: false, message: "Invalid or expired token."});
    }
}

export default userAuth;