const express = require('express');
const auth = require('./routes/userRoutes')
const car = require('./routes/carRoutes')
const reserve = require('./routes/rentRoutes')

const cors = require('cors');
const app = express();
const cloudinary = require("cloudinary");
const fileUpload = require('express-fileupload');

const dotenv = require('dotenv');
const errorMiddleware = require('./middleware/error');
const connectTODataBase = require('./config/database');
dotenv.config();



//handelling uncought error
process.on("uncaughtException", err => {
    console.log(`Error:${err.stack}`);
    console.log("sutting down sever due to uncaught Exception ")
    process.exit(1);

})

const port = process.env.PORT || 5000;
//data base connection
connectTODataBase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(express.json())
app.use(cors(corsOptions))
app.use(fileUpload());

app.use('/auth', auth)
app.use('/car', car)
app.use('/rent', reserve)



app.use(errorMiddleware)

const server = app.listen(port, () => console.log(`server is running on ${port}`));


//unhandled promise

process.on("unhandledRejection", err => {
    console.log(`Error:${err.stack}`)
    console.log("sutting down sever due to unhandled promise rejection")

    server.close(() => {
        process.exit(1);
    })
})