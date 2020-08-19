require('dotenv').config();
const discord = require('discord.js');
const database = require('./utils/mongoose');
const fs = require('fs').promises;
const client = new discord.Client();
const path = require('path');

var time;

client.commands = new Map();
client.events = new Map();
client.mongoose = require('./utils/mongoose');

client.mongoose.init();
client.login(process.env.BOT_TOKEN); 


(async function loadCommands(dir = 'commands') {
    //Read directory
    let files = await fs.readdir(path.join(__dirname, dir));
    console.log(files);

    //loop through each file
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory())
            loadCommands(path.join(dir, file));
        else {
            if(file.endsWith(".js")) {
                let command = file.substring(0, file.indexOf(".js"));
                let cmdModule = require(path.join(__dirname, dir, file));

                client.commands.set(command, cmdModule);
                time = new Date().toLocaleString('cn',{hour12:false});
                console.log(`[${time}][INFO] loaded command ${file.split('.').shift()}`)
            }
        }
    }
})();


(async function loadEvents(dir = 'events') {
    //Read directory
    let files = await fs.readdir(path.join(__dirname, dir));
    console.log(files);

    //loop through each file
    for(let file of files) {
        let stat = await fs.lstat(path.join(__dirname, dir, file));
        if(stat.isDirectory())
            loadEvents(path.join(dir, file));
        else {
            if(file.endsWith(".js")) {
                let event = file.substring(0, file.indexOf(".js"));
                let evtModule = require(path.join(__dirname, dir, file));
                client.on(event, evtModule.bind(null, client));

                client.events.set(event, evtModule);
                time = new Date().toLocaleString('cn',{hour12:false});
                console.log(`[${time}][INFO] loaded event ${file.split('.').shift()}`)
            }
        }
    }
})();



