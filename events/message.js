const PREFIX = process.env.PREFIX;
var time;

module.exports = async(client, message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(PREFIX)) return;
    let args = message.content.substring(message.content.indexOf(PREFIX)+1).split(new RegExp(/\s+/));
    let command = args.shift().toLowerCase();
    console.log(args,command);

    if(client.commands.get(command))
        client.commands.get(command).run(client, message, args);
    else{
        time = new Date().toLocaleString('cn',{hour12:false});
        console.log(`[${time}][INFO] Command does not exist.`);
        message.reply("指令不存在！");
    }
};