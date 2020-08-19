const db = require('../utils/mongoose');
const noteModel = require('../schema/noteSchema');

module.exports = async (client) => {
        let time = new Date().toLocaleString('cn',{hour12:false});
        console.log(`[${time}][INFO] ${client.user.tag} 已上线`);
        
        // let test = new noteModel({
        //         noteAuthor: 'o0River0o#7352',
        //         noteTitle: 'testNote',
        //         noteCate: 'test',
        //         noteKeyword: ['test'],
        //         noteContent: 'This is a test note'
        // }).save().then(m => console.log(m)).catch(err => console.log(err));
};