const app = require("./app");


const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// handling uncaught Exception

process.on("uncaughtException", (err) => {
    console.log(`Error:${err.message}`);
    console.log(`Shutting down the server due to Unhandeled promise Rejection `);
    process.exit(1);
})

//config

dotenv.config({path:"backend/config/config.env"})


//connecting database 

connectDatabase()

const server = app.listen(process.env.PORT,()=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
});

// unhandeled error
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandeled promise Rejection`);
    server.close(()=>{
        process.exit(1);
    });
});