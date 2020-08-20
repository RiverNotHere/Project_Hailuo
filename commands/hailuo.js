const discord = require('discord.js');
const noteModel = require('../schema/noteSchema');

let searchResult;

module.exports.run = async (client, message, args) => {
    if (args.length > 1) {
        let cate = args.shift();
        let keywords = args.join('');

        noteModel.find({
            noteCate: cate,
            noteKeyword: keywords,
            draft: false
        }).then(res => {
            console.log(res);

            if(res.length <= 0) message.reply(`没有在分类 ${cate} 中找到有关 ${keywords} 的内容¯\_(ツ)_/¯`);

            let searchRes = new discord.MessageEmbed()
                .setTitle('神奇海螺回应了你的请求o(^▽^)o')
                .setDescription(`${cate} 分类中有关 ${keywords} 的笔记（输入相应的数字来选择）`)
                .setThumbnail('https://cdn.discordapp.com/attachments/742416848422961396/745430139394850816/awT7N5S_.jpg')
                .setColor('#f6b8f6')
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

            const filter = m => m.author.id === message.author.id;

            message.channel.awaitMessages(filter, {
                max: 1
            }).then(collected => {

                console.log(collected.first().content);

                console.log(item.indexOf(parseInt(collected.first().content)));

                let index = item.indexOf(parseInt(collected.first().content));

                console.log(res[index].noteContent)

                message.channel.send(res[index].noteContent);

            }).catch(err => {
                time = new Date().toLocaleString('cn', { hour12: false });
                console.error(`[${time}][ERROR] ` + err);
            })
        }).catch(err => {

        })

    } else if (args.length === 1) {
        let keywords = args.join('');

        noteModel.find({
            noteKeyword: keywords,
            draft: false
        }).then(res => {
            console.log(res);

            if(res.length <= 0) message.reply(`没有找到有关 ${keywords} 的内容¯\_(ツ)_/¯`);

            let searchRes = new discord.MessageEmbed()
                .setTitle('神奇海螺回应了你的请求o(^▽^)o')
                .setDescription(`所有有关 ${keywords} 的笔记（输入相应的数字来选择）`)
                .setThumbnail('https://cdn.discordapp.com/attachments/742416848422961396/745430139394850816/awT7N5S_.jpg')
                .setColor('#f6b8f6')
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

            const filter = m => m.author.id === message.author.id;

            message.channel.awaitMessages(filter, {
                max: 1
            }).then(collected => {

                console.log(collected.first().content);

                console.log(item.indexOf(parseInt(collected.first().content)));

                let index = item.indexOf(parseInt(collected.first().content));

                console.log(res[index].noteContent)

                message.channel.send(res[index].noteContent);

            }).catch(err => {
                time = new Date().toLocaleString('cn', { hour12: false });
                console.error(`[${time}][ERROR] ` + err);
            })
        }).catch(err => {

        })
    }
}