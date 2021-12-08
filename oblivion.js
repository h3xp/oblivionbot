const Discord = require('discord.js');
const client = new Discord.Client();
const Cleverbot = require('cleverbot');
var request = require('request');
var cheerio = require("cheerio");
var moment = require('moment');
const fs = require('fs');
const ytdl = require('ytdl-core');
var mysql = require('mysql');
var moment = require('moment');
cfg = require('./config.js');

const prefix = cfg.prefix;

let clev = new Cleverbot({
	  key: cfg.cleverbot
});

var con = mysql.createConnection(cfg.mysql);

setInterval(function () {
    con.query('SELECT 1');
}, 5000);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("by hexp");
});

client.on('guildMemberRemove', (member) => {
  client.channels.get(cfg.logChannelId).send(`${member} has left the server.`);
});

client.on('message', msg => {
  if (msg.content === prefix + 'ping') {
    msg.reply('pong');
  }

  if (msg.content.startsWith(prefix + 'rolle ')){
    msg.guild.members.fetch();
    var roleName = msg.content.replace(prefix + 'rolle ','')
    if (msg.guild.roles.find(role => role.name === roleName) == undefined){
      msg.channel.send("check your input")
    } else {
      var roleID = msg.guild.roles.find(role => role.name === roleName).id;
      msg.channel.send(msg.guild.roles.get(roleID).members.map(member=>member.user.tag).join('\n'))
    }
  }


  //Cleverbot
  if (msg.content.startsWith("<@!"+cfg.BotId+">") || msg.content.startsWith("<@"+cfg.BotId+">")){
    var question = msg.content.replace("<@!"+cfg.BotId+"> ","");
    question = msg.content.replace("<@"+cfg.BotId+"> ","");
      console.log("cleverbot question: " +question);
      clev.query(question)
	.then(function (response) {
	  msg.channel.send(response.output);
	});
   }

    //resets
    if (msg.content === prefix + 'reset' || msg.content === prefix + 'resets'){

    	 const DAYS = 24 * 3600 * 1000;
  	 const countdowns = [{
  	    id: "euMcReset",
  		  helper: "euMcHelper",
  	    timestamp: new Date("Dec  4, 2019 02:00:00 GMT-05:00").getTime(),
  	    interval: 7 * DAYS,
  	    text: "🔥 MC&BWL reset in "
  	  },
  	    {
  	    id: "euOnyReset",
  		  helper: "euOnyHelper",
  	    timestamp: new Date("Dec  10, 2019 02:00:00 GMT-05:00").getTime(),
  	    interval: 5 * DAYS,
  	    text: "👹 Onyxia reset in "
  	  },
  	  	{
  	    id: "euZGReset",
  		  helper: "euZGHelper",
  	     timestamp: new Date("Apr 16, 2020 02:00:00 GMT-05:00").getTime(),
  	    interval: 3 * DAYS,
  	    text: "👺 ZG reset in "
  	  },
  	  	{
  	    id: "euAQReset",
  		  helper: "euAQHelper",
  	    timestamp: new Date("Dec  10, 2019 02:00:00 GMT-05:00").getTime(),
  	    interval: 5 * DAYS,
  	    text: "🗿 AQ40 reset in "
  	  },
  	  	  	  	{
  	    id: "euAQ2Reset",
  		  helper: "euAQ2Helper",
  	    timestamp: new Date("Dec  10, 2019 02:00:00 GMT-05:00").getTime(),
  	    interval: 3 * DAYS,
  	    text: "🗿 AQ20 reset in "
  	  }
  	];

    const now = new Date().getTime();
    countdowns.forEach(c => {
      while (c.timestamp < now) c.timestamp += c.interval;
      const tSecs = Math.floor((c.timestamp - now) / 1000);
      const secs = tSecs % 60;
      const tMins = (tSecs - secs) / 60;
      const mins = tMins % 60;
      const tHours = (tMins - mins) / 60;
      const hours = tHours % 24;
      const days = (tHours - hours) / 24;
  	const reset = new Date(c.timestamp);
  	const ctext = c.text;
      msg.channel.send(`${ctext} ${days}d ${hours}h ${mins}m ${secs}s`);

    });
  }

//automessage - contains
if (msg.author.id != cfg.BotID){
  if (msg.content.indexOf("forum") > -1){
    msg.channel.send(cfg.forumURL)    
  }
  if (msg.content.indexOf("raidplaner") > -1){
    msg.channel.send(cfg.calendarURL)    
  }
}

//automessage - exactly

    switch(msg.content.toLowerCase()) {
    case "ayy":
        msg.channel.send("lmao")
        break;
    default:
    }

//soundbot
  if (msg.content.startsWith(prefix + 'sound')){
    var sfile = msg.content
    sfile = sfile.replace(".sound","");
    sfile = sfile.replace(" ","");

      if (msg.channel.id != cfg.musicChannelId){
        return;
      }
      
      var filelist = [];
      const soundFolder = './sounds/';
      
      function startingwith(element) {
        return element.startsWith(sfile)
        
      }
      
      function finisharray () {
       if (sfile == 'list') {
       
      msg.channel.send(filelist.join("\n"));
      
      } else {
        if (sfile !== '') {
             if (msg.member.voice.channel != undefined) {
                  const channel = msg.member.voice.channel;
                  channel.join()
                  .then(connection => {
                    const dispatcher = connection.play("./sounds/" + filelist.find(startingwith));
                    dispatcher.on("end", end => {console.log('played sound')});
                  })
                } else {
                    msg.channel.send("please join a voice channel");
                }

          } else {
          let result = []
        let files = fs.readdirSync('./sounds/')
        let length = files.length;
        let selectedIndex = Math.floor(Math.random() * length)
        let selected = (files.splice(selectedIndex, 1).toString());
        selected = soundFolder + selected
        if (msg.member.voice.channel != undefined) {
                const channel = msg.member.voice.channel;
                channel.join()
                .then(connection => {
                  const dispatcher = connection.play(selected);
                  dispatcher.on("end", end => {console.log('played sound')});
                })
            } else {
                return 'please join a voice channel';
            }
          }
    } 
  }

    var itemsProcessed = 0;
      
      fs.readdir(soundFolder, (err, files) => {
      files.forEach(file => {
      filelist.push(file);
      itemsProcessed++;
        if(itemsProcessed === files.length) {
            finisharray();
        }
        });
      });
  }

  	//technobase
  	if (msg.content === prefix + "technobase"){
  		if (msg.member.voice.channel != undefined) {
                  const channel = msg.member.voice.channel;
                  channel.join()
                  .then(connection => {
                    const dispatcher = connection.play('http://listen.technobase.fm/tunein-mp3-asx', { quality: 'highestaudio', volume: 0.1 });
                    dispatcher.on("end", end => {console.log('played sound')});
                  })
        } else {
                    msg.channel.send("please join a voice channel");
        }
  	}

  	//stop any sounds
  	if (msg.content === prefix + "stop"){
  		if (msg.member.voice.channel != undefined) {
                  const channel = msg.member.voice.channel;
                  console.log(client.voice.connections.first())
                  client.voice.connections.first().dispatcher.end();
                  
        } else {
                    msg.channel.send("already not playing");
        }
  	}

  	//youtube
  	if (msg.content.startsWith(prefix + "youtube")){
  		var youtubelink = msg.content.replace(prefix + "youtube", "");
  		if (msg.member.voice.channel != undefined) {
                  const channel = msg.member.voice.channel;
                  channel.join()
                  .then(connection => {
                    const dispatcher = connection.play(ytdl(youtubelink), { quality: 'highestaudio', volume: 0.22 });
                    dispatcher.on("end", end => {console.log('played sound')});
                  })
        } else {
                    msg.channel.send("please join a voice channel");
        }
  	}
    
  	if (msg.content.startsWith(prefix + "registrations")){

      var date;

      if (msg.content == (prefix + "registrations")){
        date = "CURDATE()";
        console.log ("CURDATE " + date)
      }else {
        date = msg.content.replace(prefix+"registrations ","");
        date = "'"+date+"'";
        console.log("DATE " + date)
      }

      var raidid;
      var raidstart;
      var raidend;
      var angemeldet;
      var abgemeldet;
      var ersatzbank;
      var kader;
      var kadername;
      var kaderfarbe;
      var shitlist = "blabla ";

    	con.connect(function(err) {
        var sql = "SELECT * FROM eqdkp23_calendar_events WHERE FROM_UNIXTIME(timestamp_start,'%Y-%m-%d') = "+date;
        console.log ("DATE2: " +date);
        con.query(sql, function (err, result) {
            if (result == ""){
              msg.channel.send("no raid today")
            }else {
              raidid = result[0].id;
              switch (result[0].calendar_id){
                case 1:
                  kader = "2";
                  kadername = "Blue";
                  kaderfarbe = "#0000FF";
                  break;
                case 4:
                  kader = "1";
                  kadername = "Red";
                  kaderfarbe = "#FF0000";
                  break;
                default:
                  kader = "1 OR 2";
                  kadername = "Red und Blue";
                  kaderfarbe = "#8A2BE2";
              }
              raidstart = moment.unix(result[0].timestamp_start).utcOffset(60).format("D.M.YYYY h:mm")
              raidend = moment.unix(result[0].timestamp_end).utcOffset(60).format("D.M.YYYY h:mm")
              var sql = "SELECT * FROM eqdkp23_calendar_raid_attendees WHERE calendar_events_id = "+raidid+ " AND (signup_status = 0 OR signup_status = 1)";
              con.query(sql, function (err, result) {
                angemeldet = result.length;
                var sql = "SELECT * FROM eqdkp23_calendar_raid_attendees WHERE calendar_events_id = "+raidid+ " AND signup_status = 2";
                con.query(sql, function (err, result){
                  abgemeldet = result.length;
                  var sql = "SELECT * FROM eqdkp23_calendar_raid_attendees WHERE calendar_events_id = "+raidid+ " AND signup_status = 3";
                  con.query(sql, function (err, result){
                    ersatzbank = result.length;
                    var sql = "SELECT eqdkp23_calendar_raid_attendees.member_id, eqdkp23_groups_raid_members.member_id, eqdkp23_members.member_name FROM eqdkp23_groups_raid_members LEFT JOIN eqdkp23_calendar_raid_attendees ON (eqdkp23_groups_raid_members.member_id = eqdkp23_calendar_raid_attendees.member_id AND eqdkp23_calendar_raid_attendees.calendar_events_id = "+raidid+") LEFT JOIN eqdkp23_members ON eqdkp23_members.member_id = eqdkp23_groups_raid_members.member_id WHERE eqdkp23_calendar_raid_attendees.member_id Is Null AND eqdkp23_members.member_name Is Not Null AND (eqdkp23_groups_raid_members.group_id = "+kader+");"
                    con.query(sql, function (err, result){

                      Object.keys(result).forEach(function(key) {
                        shitlist = shitlist + ", " +result[key].member_name;
                        if (key == result.length -1){
                          console.log(shitlist);

                          const embed = new Discord.MessageEmbed()
                            .setColor(kaderfarbe)
                            //.setThumbnail('http://i.imgur.com/yBvXgiG.png')
                            .addField(':bust_in_silhouette:'+kadername,':inbox_tray: Start: ``'+raidstart+'``\n:outbox_tray: **Ende:** ``'+raidend+'``\n:white_check_mark: **Angemeldet:** ``'+angemeldet+'``\n:clock1:**Ersatzbank:** ``'+ersatzbank+'``\n:x:**Abgemeldet:** ``'+abgemeldet+'``')
                            .addField(':skull: Keine An-/Abmeldung: ',''+shitlist.replace("blabla , ",""))
                          msg.channel.send({ embed });

                        }
                        

                      });
                    })
                  })
                });
              });

            }
              
        


        });        
      });
    }

    //membercheck
    const membercheck = function(name){
      return new Promise(resolve => {
        con.connect(function(err) {
        //if (err) throw err;
        var sql = "SELECT * FROM eqdkp23_members WHERE member_name = '"+name+"'";
        console.log(sql);
        con.query(sql, function (err, result) {
          //if (err) throw err;

          console.log("member: "+name)
          console.log(result[0].member_id);

          resolve(result[0].member_id);
              
        });
        });
      });
    }

    const memberanswer = function(name, id){
      if (request == undefined){
          msg.channel.send("Couldn't find that user.")
        }else{
          msg.channel.send(name + " has the ID: " + id)
        }
    }

    async function membermessage (msg){
      var targetname = msg.content.replace(prefix+"member ","");
      if (targetname != prefix+"member"){
        var dbname = await membercheck(targetname);
        await memberanswer(targetname,await dbname);

      }else{
        msg.channel.send("Please provide a name.")
      }
    }

    if (msg.content.startsWith(prefix+"member")){
      var var1 = "";
      var var2 = "";
      membermessage(msg);
    }
    


    //raid summary
    var code = '';

    if (msg.content === prefix + 'raid' || msg.content === prefix + 'raids'){
      request('https://classic.warcraftlogs.com:443/v1/reports/guild/Oblivion/dragons-call/EU?api_key='+cfg.WarcraftlogsAPI+'', function (error, response, body) {
          var bodyobject = JSON.parse(body);
          var code = bodyobject[0].id;
          request('https://classic.warcraftlogs.com:443/v1/report/fights/'+code+'?api_key='+cfg.WarcraftlogsAPI+'', function (error, response, body) {
            console.log('error:', error);
            var bodyobject = JSON.parse(body);
            var startDate = moment(bodyobject.start).utcOffset(1).format("DD.MM.YYYY, HH:mm:ss");
            var endDate = moment(bodyobject.end).utcOffset(1).format("DD.MM.YYYY, HH:mm:ss");
            var title = bodyobject.title;
            var start = startDate;
            var end = endDate;
            var duration = moment.duration(bodyobject.end - bodyobject.start);
            var owner = bodyobject.owner;
            switch (bodyobject.zone) {
              case 1000:
                var zone = "Molten Core";
                break;
              case 1001:
                var zone = "Onyxia";
                break;
              case 1002:
                var zone = "Blackwing Lair";
                break;
              default: 
                var zone = 'unbekannt';
            }
            var link = 'https://classic.warcraftlogs.com/reports/' + code
            
            msg.channel.send('**'+title+'**\nZone: '+zone+'\nStart: '+start+'\nEnd: '+end+'\nDauer: '+duration.hours()+':'+duration.minutes()+':'+duration.seconds()+'\nlog from: '+owner+'\n'+link);
          });
      });
    }
  
});


client.login(cfg.token);

