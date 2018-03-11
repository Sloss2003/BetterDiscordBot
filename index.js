const Discord = require("discord.js");
const client = new Discord.Client();
var fs = require("fs");
const token = "";

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

function wait(time,callback) {
   setTimeout(function(){
        callback();
   }, time);
}

var defaultConfig = ({
	"defaultPrefix": "!",
	"prefix": "None"
})

function getServersPrefix(gid){
	return "!";
}


client.on('guildCreate',guild =>{
	var gid = guild.id;
	var owner = guild.ownerID;
	guild.createRole({name: 'BetterDiscord Bot Managers',}).then(role => {
		guild.owner.addRole(role.id);
	})
})
client.on('guildDelete',guild =>{
	var gid = guild.id;
	var roles = guild.roles;
	roles.forEach(function(role){
		if (role.Name == "BetterDiscord Bot Managers"){
			role.delete("The bot has been kicked, or banned from the server, or just asked to plaino leave!");
		}
	})
})

client.on('message', msg => {
  let prefix = getServersPrefix(msg.channel.id);
  if (msg.channel.type == "text"){
  let guildId = msg.guild.id;
  }else{
      guildId = "Undecirpahble";	  
  }
  
  function isSenderAdmin(){
	  let roles = msg.member.roles;
	  let isadmin = false;
	  roles.forEach(function(role){
		if (role.Name == "BetterDiscord Bot Managers" || msg.author.id == "115147252850360325"){
			isadmin = true;
		}
	})
	return isadmin;
  }
  
  let content = msg.content;
  
  if (prefix === "unknown"){
	  msg.channel.send("test");
  }else{
	var commands = require("./commands.js").commands
	
	commands.forEach(function(cmd){
		if (content.toLowerCase().startsWith(prefix + cmd[0])){
			amIn = 0;
			if (msg.author.bot == false){
				msg.channel.startTyping();
				let chanelTypeCorrect = false;
				let types = "";
				cmd[1]["chanelRequirement"].forEach(function(name){
					types = types+" " + name;
					amIn++;
					if (msg.channel.type == name){
						chanelTypeCorrect = true;
						if (cmd[1]["isAdmin"] == "true"){
							if (isSenderAdmin){
								cmd[2](msg,prefix);
							}else{
								msg.channel.send("Excuse me! You have to be an administrator to perform " + cmd[0] +"!")
							}
						}else{
							cmd[2](msg,prefix);
						}
					}
				})
				if (chanelTypeCorrect == false){
					msg.channel.send("Excuse me, it seems as if you can not use this command here! Try it in an " + types + " " + (amIn == 1 ? "channel" : "channels"))
				}
				msg.channel.stopTyping();
			}
		}
	})
  }
  
  
});

client.login(token);
