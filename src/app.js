import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();


// 1- implement the cors because we want to talk with front end
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// impelment the middle wavers

// now user send data to us so we need to takle them into json 
app.use(express.json({ limit: "1mb" }))

// some data come from the url for this we used the urlencoded 
app.use(express.urlencoded({ extended: true, limit : "16kb"}))

// now where i store my images 
app.use(express.static("public"))

// also need to tackel wiht coookie 
app.use(cookieParser())







// implement the routers



// import { registerUser } from "./contollers/user.contollers.js";
import userRouter from "./routers/user.routers.js"



app.use("/api/v1/users", userRouter)



export { app }