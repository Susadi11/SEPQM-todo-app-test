const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5555;
const MONGOURI = process.env.MONGOURI;

mongoose
    .connect(MONGOURI)
    .then(() => {
        console.log('App connected to the database');
        app.listen(PORT, () => {
            console.log(`App is listening to port : ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = app;