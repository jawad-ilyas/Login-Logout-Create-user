import { asyncHandler } from "../utilis/AsyncHandler.js"
import { ApiError } from "../utilis/ApiError.js"
import { ApiResponse } from "../utilis/ApiResponse.js"
import { uploadCloudinary } from "../utilis/cloudinary.js"
import { User } from "../models/user.models.js"


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAcessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Some thing while wrong while generating refresh token", error)
    }
}


// registerUser Controllers
const registerUser = asyncHandler(async (req, res, next) => {


    // setup 1 - get data from the user 
    console.log(req.body)
    const { fullName, userName, email, password } = req.body
    console.log(fullName)
    console.log(userName)
    console.log(email)
    console.log(password)
    // if (userName === '') {
    //     throw new ApiError(400, "All Fields Are Required")

    // }
    // setup 2 - validate the data come from the fron end 

    if(userName  === "")
    {
        throw new ApiError(400 , "username error ")
    }
    // if ([fullName, userName, email, password].some((fields) => { fields?.trim() === '' || undefined })) {
    //     throw new ApiError(400, "All Fields Are Required")
    // }

    // setup 3 - check user is already present or not into database 
    const exitingUser = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (exitingUser) {
        throw new ApiError(409, "User is Already Present ")
    }


    // step 4- check for image and upload into cloudinary 
    const avatarLocalPath = req.files?.avatar[0]?.path
    // console.log("avatarLocalPath", avatarLocalPath)
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    let coverImage;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
        coverImage = await uploadCloudinary(coverImageLocalPath);
    }

    // 5- upload them into cloudinary 
    const avatar = await uploadCloudinary(avatarLocalPath);
    // const coverImage = await uploadCloudinary(coverImageLocalPath);

    // console.log("avatar", avatar)
    if (!avatar) {
        throw new ApiError(409, "Avatar filed is required")
    }



    // step 6 - create user and upload into db 

    const createdUser = await User.create({
        userName: userName.toLowerCase(),
        email,
        avatar: avatar?.url,
        coverImage: coverImage?.url || " ",
        password,
        fullName
    })

    // step 6 user create on not 
    const createdUserExist = await User.findById(createdUser._id).select(
        "-password -refreshToken"
    )

    if (!createdUserExist) {
        throw new ApiError(500, "Something went wrong when registering the Error")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUserExist, "User Register Successfull")
    )

})



// login User Controllers 
const LoginUser = asyncHandler(async (req, res) => {


    // todos For Login User 
    // step 1 - get the data from the user 
    // step 2 - validate the data from the user 
    // step 3 - password check 
    // step 4 - throw the error if exits 
    // step 5 = return the response to user (with access token and refresh token)
    // step 6 - send cookies 



    // step 1 - get the date from the user 
    const { email, password, userName } = req.body;
    // console.log(req.body)
    console.log("email " , email)
    console.log("username " , userName)
    console.log(password)
    // step 2 - validate the data 
    if (userName === "") {
        throw new ApiError(400, "username or email is required")
    }

    // step 3 - check user is exists or not 
    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })
    // console.log(user)
    if (!user) {
        throw new ApiError(404, "User does not Exists")
    }

    // step 4 = check password match or not 
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid User credials")
    }


    // step 5 - return access and refresh token 

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    let accessTokenValue;
    console.log("accessToken", await accessToken.then((res) => { return accessTokenValue = res, "access asldkflsdjflk" }));
    console.log("refreshToken", refreshToken);


    // step 6 - return the cookie 

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    // console.log(loggedInUser)


    // design the cookie that we want to send

    const options = {
        httpOnly: true,
        secure: true

    }
  

    res.cookie('accessToken', accessToken, options);
    res.cookie('refreshToken', refreshToken, options);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken: accessTokenValue,
                    refreshToken: refreshToken
                },
                "User logged In Successfully "

            )
        )


})


// logout Controllers 

const logoutUser = asyncHandler(async (req, res) => {

    // step 1 - remove the cookie 
    // step 2 - remove the refresh token , access token 
    // step 3 - find the user id 
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        }, {
        new: true
    })


    const options = {
        httpOnly: true,
        secure: true
    }

    return res.
        status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out"))
})

export { registerUser, LoginUser, logoutUser }