const discord = require('discord.js');
const noteModel = require('../schema/noteSchema');
const hailuo = require('./hailuo');

var cate, key, content, author, title;

var type;

let topicChanged;

var id, topic;

var time;

var noteEvt = require('../events/note');

module.exports.run = async (client, message, args) => {
    const filter = m => m.author.id === message.author.id;

    let type = args.shift();
    if (args.length > 0) {
        title = args.join(" ");


        switch (type) {
            case 'new':
                author = message.author.tag;

                message.reply(`开始添加，当前笔记标题：${title}`);
                type = 'normal';
                //输入主题
                getCate(filter);


                break;
            // case 'draft':
            //     author = message.author.tag;
            //     message.reply(`开始添加，当前草稿标题：${title}`);
            //     type = 'draft';
            //     //输入主题
            //     getCate(filter);

            //     break;
            case 'rewrite':
                author = message.author.tag;
                noteModel.find({
                    noteKeyword: args.join(''),
                    draft: false
                }).then(res => {
                    console.log(res);

                    if(res.length <= 0) message.reply(`没有找到有关 ${keywords} 的笔记¯\_(ツ)_/¯`);

                    let searchRes = new discord.MessageEmbed()
                        .setTitle('请选择要重写的笔记')
                        .setDescription(`有关 ${args.join('')} 的笔记（输入相应的数字来选择）`)
                        .setColor('#21a9b8')
                        .setTimestamp()

                    let item = new Array(res.length);
                    let describe;
                    for (let i = 0; i < res.length; i++) {
                        item[i] = i + 1;
                        describe = res[i].noteContent.substring(0, 30);

                        searchRes.addFields(
                            {
                                name: `[${i + 1}] ` + res[i].noteTitle,
                                value: describe
                            }
                        );
                    }

                    message.channel.send(searchRes);

                    message.channel.awaitMessages(filter, {
                        max: 1
                    }).then(collected => {

                        if (collected.first().content === "cancel") {
                            return message.reply('已取消更改操作');
                        }

                        console.log(item.indexOf(parseInt(collected.first().content)));

                        let index = item.indexOf(parseInt(collected.first().content));

                        id = res[index]._id;

                        let noteChanged = res[index].noteTitle;

                        message.reply(`已选择的笔记:` + noteChanged);

                        rewriteNote(filter);

                    }).catch(err => {
                        time = new Date().toLocaleString('cn', { hour12: false });
                        console.error(`[${time}][ERROR] ` + err);
                    })

                })
                break;
            case 'delete':
                if (message.member.roles.cache.has('742905684625981512' || '742493246738923641' || '742078123645861949')) {
                    noteModel.find({
                        noteKeyword: args.join(''),
                        draft: false
                    }).then(res => {
                        console.log(res);

                        if(res.length <= 0) message.reply(`没有找到有关 ${keywords} 的笔记¯\_(ツ)_/¯`);
    
                        let searchRes = new discord.MessageEmbed()
                            .setTitle('请选择要删除的笔记')
                            .setDescription(`有关 ${args.join('')} 的笔记（输入相应的数字来选择）`)
                            .setColor('#ff0000')
                            .setTimestamp()
    
                        let item = new Array(res.length);
                        let describe;
                        for (let i = 0; i < res.length; i++) {
                            item[i] = i + 1;
                            describe = res[i].noteContent.substring(0, 30);
    
                            searchRes.addFields(
                                {
                                    name: `[${i + 1}] ` + res[i].noteTitle,
                                    value: describe
                                }
                            );
                        }
    
                        message.channel.send(searchRes);
    
                        message.channel.awaitMessages(filter, {
                            max: 1
                        }).then(collected => {
    
                            if (collected.first().content === "cancel") {
                                return message.reply('已取消删除操作');
                            }
    
                            console.log(item.indexOf(parseInt(collected.first().content)));
    
                            let index = item.indexOf(parseInt(collected.first().content));
    
                            id = res[index]._id;
    
                            let noteChanged = res[index].noteTitle;
    
                            message.reply(`已选择的笔记:` + noteChanged);
    
                            noteEvt.deleteNote(res[index]._id);
                            message.reply('成功删除笔记！');
    
                        }).catch(err => {
                            time = new Date().toLocaleString('cn', { hour12: false });
                            console.error(`[${time}][ERROR] ` + err);
                        })
    
                    })
                } else {
                    message.reply('您没有使用此命令的权限');
                }

                break;
            default:
                time = new Date().toLocaleString('cn', { hour12: false });
                console.error(`[${time}][ERROR] ${message.author.username} just used an invalid note type`)
                message.reply('Invalid note type')
                break;
        }
    } else {
        message.reply('请输入笔记的标题')
    }

    //附属函数

    /**
     *
     * 重写事件函数
     */
    function rewriteNote(filter) {
        message.reply('请选择要更改的部分 `[1]`- 标题 | `[2]`- 内容 （输入`cancel`取消）');
        message.channel.awaitMessages(filter, {
            max: 1
        }).then(collected => {

            if (collected.first().content === "cancel") {
                return message.reply('已取消更改操作');
            }

            topic = parseInt(collected.first().content);
            switch(topic){
                case 1:
                    topicChanged = '标题';
                    break;
                case 2:
                    topicChanged = '内容';
                    break;
                default:
                    message.reply('Invalid selection')
                    break;
            }
            message.reply(`已选择更改内容:` + topicChanged);

            changeTopic(filter);

        }).catch(err => {
            time = new Date().toLocaleString('cn', { hour12: false });
            console.error(`[${time}][ERROR] ` + err);
        })
    }

    function changeTopic(filter) {
        message.reply('请输入替换的文字');
        message.channel.awaitMessages(filter, {
            max: 1
        }).then(collected => {

            if (collected.first().content === "cancel") {
                return message.reply('已取消更改操作');
            }

            let changedDetail = collected.first().content;
            message.reply(`将原有内容替换为:` + changedDetail);

            let updateInfo = { 'content': changedDetail, 'noteid': id };

            noteEvt.updateNote(updateInfo, topic);
            message.reply('成功更新笔记！');

        }).catch(err => {
            time = new Date().toLocaleString('cn', { hour12: false });
            console.error(`[${time}][ERROR] ` + err);
        })
    }

    /**
     * 
     * 添加事件函数
     */

    function getCate(filter) {
        message.reply('请输入笔记的分类（取消请输入`cancel`）');
        message.channel.awaitMessages(filter, {
            max: 1
        }).then(collected => {

            if (collected.first().content === "cancel") {
                return message.reply('已取消写入');
            }

            cate = collected.first().content;
            message.reply(`笔记分类:` + cate);

            getKeywords(filter);

        }).catch(err => {
            time = new Date().toLocaleString('cn', { hour12: false });
            console.error(`[${time}][ERROR] ` + err);
        })
    }

    function getKeywords(filter) {

        //输入关键字
        message.reply('请输入笔记的关键字（使用`,`进行分割）');
        message.channel.awaitMessages(filter, {
            max: 1
        }).then(collected => {
            if (collected.first().content === "cancel") {
                return message.reply('已取消写入');
            }

            key = collected.first().content.split(',');
            message.reply(`关键字:` + key);

            getContent(filter);
        }).catch(err => {
            time = new Date().toLocaleString('cn', { hour12: false });
            console.error(`[${time}][ERROR] ` + err);
        })
    }

    function getContent(filter) {
        //输入内容
        message.reply(`请输入笔记的内容`);
        message.channel.awaitMessages(filter, {
            max: 1
        }).then(collected => {

            if (collected.first().content === "cancel") {
                return message.reply('已取消写入');
            }

            message.reply(`详细内容:` + collected.first().content);

            content = collected.first().content;

            newNote();

        }).catch(err => {
            time = new Date().toLocaleString('cn', { hour12: false });
            console.error(`[${time}][ERROR] ` + err);
        })
    }

    function newNote() {
        time = new Date().toLocaleString('cn', { hour12: false });

        message.channel.send('添加成功！');
        message.channel.send('https://cdn.discordapp.com/attachments/707342339936485480/744683389747069058/ceeb653ely1geq234w0i0g205c05c4qp.png');
        console.log(`[${time}][INFO] new note added`);
        console.log(`   - 标题：${title}`);
        console.log(`   - 分类：${cate}`);
        console.log(`   - 作者：${author}`);
        console.log(`   - 关键字：${key}`);
        console.log(`   - 内容：${content}`);

        let noteInfo = { 'title': title, 'cate': cate, 'author': author, 'keywords': key, 'content': content };

        switch (type) {
            case 'normal':
                noteEvt.newNote(noteInfo);
                break;

            case 'draft':
                noteEvt.draftNote(noteInfo);
                break;
        }

    }
}





