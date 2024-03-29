import { app } from "./app.js";
import connectDb from "./db/index.db.js";

import dotenv from "dotenv"


dotenv.config({
    path : "./.env"
})

// 1- first setup is not setup the db into index.js
connectDb()
    .then(() => {



        const Port = process.env.PORT || 3000


        app.on("Error", (Error) => {
            console.log("Error", Error)
            throw new Error
        })
        app.listen(Port, () => {
            console.log("server is running on this port ", Port)
        })
    }).catch((err) => {

        console.log("Error starting the app:", err);

    });
