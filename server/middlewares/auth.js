// import jwt from "jsonwebtoken";
// const isAuthenticated = async (req,res, next) => {
//     try {
//         const token = req.cookies.token;
//         if(!token){
//             return res.status(401).json({
//                 message:"User not authenticated",
//                 success:false
//             })
//         };
//         const decode = await jwt.verify(token, process.env.SECRET_KEY);
//         if(!decode){
//             return res.status(401).json({
//                 message:"Invalid token",
//                 success:false
//             });
//         }
//         req.id = decode.userId;
//         next();
//     } catch (error) {
//         console.log(error);
//     }
// }
// export default isAuthenticated;




import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    // Try cookie first, then Authorization header (Bearer <token>)
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers?.authorization;
    const headerToken =
      authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({
        message: "No token provided. User not authenticated.",
        success: false,
      });
    }

    const secret = process.env.SECRET_KEY;
    if (!secret) {
      // This is a server configuration issue — don't proceed with verify
      console.error(
        "JWT secret (process.env.SECRET_KEY) is not set. Make sure dotenv.config() runs before importing this module."
      );
      return res.status(500).json({
        message: "Server misconfiguration: authentication secret missing.",
        success: false,
      });
    }

    // Verify synchronously (throws if invalid/expired)
    const decoded = jwt.verify(token, secret);

    // Attach the user id (adjust property name if different in your token)
    // e.g., decoded.userId or decoded.id or decoded.sub
    req.id = decoded.userId ?? decoded.id ?? decoded.sub;

    next();
  } catch (err) {
    console.error("JWT verify error:", err);

    // Provide clear responses for common jwt errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired. Please login again.",
        success: false,
      });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
        success: false,
      });
    }

    // Fallback
    return res.status(401).json({
      message: "Authentication failed.",
      success: false,
    });
  }
};

export default isAuthenticated;
