const Discord = require('discord.js');
var time;
let help;
module.exports.run = async (client, message, args) => {
    time = new Date().toLocaleString('cn',{hour12:false});
    console.log(`[${time}][INFO] ${message.author.username} 得到了神奇の使用指南`);
    
    switch(args[0]){
        case 'hailuo':
            help = new Discord.MessageEmbed()
            .setTitle(`**海螺指令使用指南**`)
            .setDescription('获取知识的方法，想知道什么就问问神奇海螺吧(´▽｀)')
            .setColor('#21a9b8')
            .addFields(
                {
                    name: '方法一 （指定主题，缩小查找范围）',
                    value: '输入 `?hailuo <主题> [关键字]` '
                },
                {
                    name: '方法二（范围模糊搜索）',
                    value: '输入 `?hailuo [关键字]` '
                },
            )
            break;

        case 'note':
            help = new Discord.MessageEmbed()
            .setTitle(`**笔记指令使用指南**`)
            .setDescription('与神奇海螺共享你的知识o(^▽^)o')
            .setColor('#21a9b8')
            .addFields(
                {
                    name: '共享你的知识',
                    value: '输入 `?note new [笔记标题]` '
                },
                {
                    name: '更新你/ta的知识（欢迎纠错）',
                    value: '输入 `?note rewrite [笔记关键字]` '
                },
                {
                    name: '夺走海螺的知识（管理员才行哦）',
                    value: '输入 `?note delete [笔记关键字]` '
                },
            )
            break;

        default:
            help = new Discord.MessageEmbed()
            .setTitle(`**使用指南**`)
            .setDescription('神奇海螺神奇の使用指南(◐‿◑)')
            .setColor('#21a9b8')
            .addFields(
                {
                    name: '获取知识',
                    value: '输入 `?hailuo <编程语言/主题> [关键字]` '
                },
                {
                    name: '共享知识',
                    value: '输入 `?note [new/rewrite/delete] [知识主题]` '
                },
                {
                    name: '详细帮助',
                    value: '> 输入 `?help hailuo` 来获取详细教程\n > 输入 `?help note` 来获取详细教程'
                }
            )
            break;
    }

    message.channel.send(help);
}