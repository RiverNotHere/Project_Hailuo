var time;
const mongoose = require('mongoose');
require('dotenv').config();

module.exports.init = async() =>{

    const dbOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        poolSize: 5,
        connectTimeoutMS: 10000,
        family: 4,
        useFindAndModify: false
    };
    
    mongoose.connect(process.env.DBPATH, dbOptions);

    mongoose.connection.on('connected', () =>{
        getTime();
        console.log(`[${time}][DATABASE] Mongoose has successfully connected!`);
    });

    mongoose.connection.on('err', err =>{
        getTime();
        console.error(`[${time}][ERROR] Mongoose connection error: \n${err.stack}`);
    });

    mongoose.connection.on('disconnected', () =>{
        getTime();
        console.warn(`[${time}][ERROR] Mongoose connection lost`);
    });
}

function getTime(){
    time = new Date().toLocaleString('cn',{hour12:false});
}