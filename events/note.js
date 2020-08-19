var time;
const mongoose = require('../utils/mongoose');
const noteModel = require('../schema/noteSchema');
const { update } = require('../schema/noteSchema');

module.exports = (client) => {}

/**
 * 
 * @param { noteInfo } 从 commands/note.js 传递过来的对象 
 */

//将笔记存入数据库
module.exports.newNote = async (noteInfo) => {

    console.log(noteInfo);
    console.log(
        'noteAuthor:' + noteInfo.author,
        'noteTitle:' + noteInfo.title,
        'noteCate:' + noteInfo.cate,
        'noteKeyword:' + noteInfo.keywords,
        'noteContent:' + noteInfo.content
    );

    let note = new noteModel({
        noteAuthor: noteInfo.author,
        draft: false,
        noteTitle: noteInfo.title,
        noteCate: noteInfo.cate,
        noteKeyword: noteInfo.keywords,
        noteContent: noteInfo.content
    }).save().then(m => console.log(m)).catch(err => console.log(err));
}

//更新笔记数据
module.exports.updateNote = async (updateInfo, topic) => {
    console.log(updateInfo);
    console.log(topic);
    let topicChanged;

    switch(topic){
        case 1:
            changeTitle();
            break;
        case 2:
            changeContent();
            break;
        default:
            break;
    }

    function changeTitle(){
        noteModel.findByIdAndUpdate(updateInfo.noteid,{
            'noteTitle': updateInfo.content
        }).then(res => console.log(res)).catch(err => console.log(err));
    }

    function changeContent(){
        noteModel.findByIdAndUpdate(updateInfo.noteid,{
            'noteContent': updateInfo.content
        }).then(res => console.log(res)).catch(err => console.log(err));
    }
}

// //将笔记存为草稿
// module.exports.draftNote = async (noteInfo) => {
//     console.log(noteInfo);
//     console.log(
//         'noteAuthor:' + noteInfo.author,
//         'noteTitle:' + noteInfo.title,
//         'noteCate:' + noteInfo.cate,
//         'noteKeyword:' + noteInfo.keywords,
//         'noteContent:' + noteInfo.content
//     );

//     let note = new noteModel({
//         noteAuthor: noteInfo.author,
//         draft: true,
//         noteTitle: noteInfo.title,
//         noteCate: noteInfo.cate,
//         noteKeyword: noteInfo.keywords,
//         noteContent: noteInfo.content
//     }).save().then(m => console.log(m)).catch(err => console.log(err));
// }

//删除笔记
module.exports.deleteNote = async (noteid) => {

    console.log(noteid);
    noteModel.findByIdAndRemove(noteid).then(res => console.log(res)).catch(err => console.log(err));
}