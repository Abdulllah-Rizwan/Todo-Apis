import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiResponse} from '../utils/ApiResponse.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/users.model.js';
import  jwt  from 'jsonwebtoken';

export const httpRegisterUser = asyncHandler(async (req,res) => {
    const {username,email,password} = req.body;

    if(
        [username,email,password].some((field) => field?.trim() === "" )
    ){
        throw new ApiError(400,"All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username,email }]
    });

    if(existedUser) throw new ApiError(409,"User already exists");

    const user = await User.create({
        username,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select( "-password -refreshToken" );

    if(createdUser){
        return res.status(201).json(
            new ApiResponse(201,createdUser,"User Created Successfuly"
            ));
    }
});

const generateAccessAndRefreshToken = async (userId) => {
   try {
     const user = await User.findById(userId);
 
     const accessToken = user.generateAccessToken();
     const refreshToken = user.generateRefreshToekn();
 
     user.refreshToken = refreshToken;
     await user.save({validateBeforeSave:false});
 
     return { accessToken, refreshToken }
   } catch (error) {
        throw new ApiError(500,error?.message || "Something went wrong whilst generating access & refresh token")
   }
}

export const httpLogin = asyncHandler(async (req,res) => {
    const {username,password} = req.body;
    if(!(username && password)) throw new ApiError(400,"All fields are required");

    const user = await User.findOne({ username });
    if(!user) throw new ApiError(404,"User not found");

    const ifPasswordCorrect = await user.isPasswordCorrect(password);
    if(!ifPasswordCorrect) throw new ApiError(401,"Invalid password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                "loggedIn User":loggedInUser,
            },
            "User Logged in"
            )
    )
});

export const httpLogout = asyncHandler(async (req,res) => {
    await User.findByIdAndUpdate(req.user._id,
    {
        $set:{ refreshToken:undefined }
    },
    {
        new:true
    });

    const options = {
        httpOnly:true,
        secure:true
    }

    res
    .status(200)
    .cookie("accessToken",options)
    .cookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User has logout")
    )
});

export const refreshAccessToken = asyncHandler(async (req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken) throw new ApiError(401,"Unauthorized request!");

    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
    if(!decodedToken) throw new ApiError(401,"Invalid refresh token");

    const user = await User.findById(decodedToken?._id);
    if(!user) throw new ApiError(404,"User not found");

    if(incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or used")
    };

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id);

   const options = {
    httpOnly:true,
    secure:true
   }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json( 
        new ApiResponse(200,
        {
            accessToken,
            refreshToken
        },"access token got refreshed successfuly") 
        );

});

export const updateUserPassword = asyncHandler(async (req,res) => {
    const {password,newPassword} = req.body;
    
    if(!(password && newPassword)) throw new ApiError(400,"Password fields are missing");

    const user = await User.findById(req.user._id);
    if(!user) throw new ApiError(404,"User not found");

    const ifPasswordValid = await user.isPasswordCorrect(password);
    if(!ifPasswordValid) throw new ApiError(400,"Invalid Password");

    user.password = newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json( new ApiResponse(200,{},"Password Changed Successfuly") );
});

export const getCurrentUser = asyncHandler(async (req,res) => {
    return res.status(200).json( new ApiResponse(200,req.user,"User Fetched Successuly") );
});