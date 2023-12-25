import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import  Jwt  from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req,_,next) => {
   try {
     const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ","");
 
     if(!token) throw new ApiError(401,"Unauthorized request");
 
     const decodedToken = Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
     const user = await User.findById(decodedToken?._id).select("-password -refreshToken -email");
 
     if(!user) throw new ApiError(401,"Invalid Access Token");
 
     req.user = user;
     next();
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid Access Token");
    }

});
