require('dotenv').config();
const {Client, IntentsBitField, EmbedBuilder, ActivityType, Embed} = require('discord.js');
const tmi = require('tmi.js');
const mongoose = require('mongoose') //

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
})


//checks if Streamer is live, returns boolean and logs every minute
async function isLive() {
    const response = await fetch(process.env.API_FETCH, {
        headers: {
            Authorization: process.env.BEARER_TOKEN,
            'Client-Id': process.env.T_CLID
        }
      })
      // check to see if response is good
      if (!response.ok){
      // loop until response is ok
        var badResponse = setInterval( async () => {
            response = await fetch(process.env.API_FETCH, {
                headers: {
                    Authorization: process.env.BEARER_TOKEN,
                    'Client-Id': process.env.T_CLID
                }
              })
            if(response.ok){
                clearInterval(badResponse);
            }
        }, 60000);
      }
      // cant be made into .json if response is not ok
      const data = await response.json()
      if (data.data[0] != undefined){
        console.log("Live")
        return true
      }
      else{
        console.log("Offline")
        return false
      }
    }
    

//Bot actions on startup, also logging
client.on('ready', (c)=>{

    //Logs if online
    console.log(`${c.user.username} is online 🐶`);

    //Set activity for bot
    client.user.setActivity({
        name: "Zeus Jams 🐕‍🦺 ",
        type: ActivityType.Listening
    })

    //embed builder, can add more methods. See discord.js docs for more
    const stream = new EmbedBuilder()
    .setTitle('Click here to find her stream 👈')
    .setDescription('Join us live on twitch!')
    .setURL(process.env.TWITCH_URL)
    .setAuthor({ name: process.env.NAME_ID, iconURL: process.env.TWITCH_PFP, url: process.env.TWITCH_URL})
    .setColor(0x800080)
    .setThumbnail(process.env.TWITCH_PFP)
    .setImage(process.env.INSTA_PFP)

    //Offline and Live Detectors , checks every minute or 60000 ms. Sends embed and message when live
    async function whenOffline(){
        var offline_check = setInterval(async () => {
             if (await isLive()) {
                 whenOnline(); //activated different loop
                 await client.channels.cache.get('1186904376581836870').send(
                    process.env.STREAM
                    )
                 await client.channels.cache.get('1186904376581836870').send({
                    embeds : [stream]
                });
                 clearInterval(offline_check); //Closes loop
             }
         }, 15000); // dont set to 2 seconds or below. Twitch will time zeus out  
      }
    function whenOnline(){
        var online_check = setInterval(() => {
            if (!isLive()){
                whenOffline();
                clearInterval(online_check)
            }
          }, 120000);
      }
      whenOffline()

})

//To create message when reading certain input from channels it has access to.
//manipulate whats seen here and what to react to
client.on('messageCreate', (message)=>{
    if (message.author.bot){
        return;
    }

    if (message.content === "Who's the best boy?"){
        message.reply('Woof Woof!')
    }

    if (message.content === '!links'){
        const embed = new EmbedBuilder()
        .setTitle("Here's My Socials 🙌")
        .setURL(process.env.INSTA_URL)
        .setAuthor({ name: process.env.NAME_ID, iconURL: process.env.TWITCH_PFP, url: process.env.INSTA_URL})
        .setDescription('Come on and follow me!')
        .setColor(0x962fbf)
        .setThumbnail(process.env.INSTA_PFP)
        .setImage(process.env.X_PFP)
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name:'Instagram', value : process.env.INSTA_TEXT},
            { name: 'Twitch', value : process.env.TWITCH_TEXT  },
            { name: 'Twitter', value : process.env.TWITTER_TEXT },
            )

        message.channel.send({
            embeds : [embed]
        })
    }
    if (message.content === '!NSFWlinks'){
        if ((message.channel.name != 'feature-testing') && (message.channel.name != '📷pics-and-videos')){
            return;
        }
        const embed = new EmbedBuilder()
        .setTitle(process.env.N_TITLE)
        .setURL(process.env.RARE_LINK)
        .setAuthor({ name: process.env.NAME_ID, iconURL: process.env.TWITCH_PFP, url: process.env.INSTA_URL})
        .setDescription(process.env.N_DESC)
        .setColor(0x000000)
        .setThumbnail(process.env.PLAY_PFP)
        .setImage(process.env.SP_PFP)
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: process.env.PLAY, value : process.env.PLAY_TEXT , inline: true},
            { name: process.env.SP, value : process.env.SP_TEXT, inline: true  },
            )

        message.channel.send({
            embeds : [embed]
        });
        console.log(message.channel.name)     
    }
})

//These are interactions. The 'Slash' commands like /hey. To change names and descriptions go to register-commands.js
//To change what it does, change it here
client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === 'woof'){
        interaction.reply('I am my own sheperd. You will not tell me what to do >:(')
    }

    if (interaction.commandName === 'hey'){
        interaction.reply('Woof!')
    }
    if (interaction.commandName === 'stop-that'){
        const user1 = interaction.options.get('user').member.nickname
        interaction.reply('Woof! Woof! Stop that ' + user1 + ' 😠')
    }
    if (interaction.commandName === 'links'){
        const embed = new EmbedBuilder()
        .setTitle("Here's My Socials 🙌")
        .setURL(process.env.INSTA_URL)
        .setAuthor({ name: process.env.NAME_ID, iconURL: process.env.TWITCH_PFP, url: process.env.INSTA_URL})
        .setDescription('Come on and follow me!')
        .setColor(0x962fbf)
        .setThumbnail(process.env.INSTA_PFP)
        .setImage(process.env.X_PFP)
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name:'Instagram', value : process.env.INSTA_TEXT},
            { name: 'Twitch', value : process.env.TWITCH_TEXT  },
            { name: 'Twitter', value : process.env.TWITTER_TEXT },
            )
        interaction.reply("Woof! Gotchu")
        interaction.channel.send({
            embeds : [embed]
        })
    }
    if (interaction.commandName === 'nsfw-links'){
        if ((interaction.channel.name != 'feature-testing') && (interaction.channel.name != '📷pics-and-videos')){
            interaction.reply('Cant send that on this channel, try in an age restricted one')
            return;
        }
        const embed = new EmbedBuilder()
        .setTitle(process.env.N_TITLE)
        .setURL(process.env.RARE_LINK)
        .setAuthor({ name: process.env.NAME_ID, iconURL: process.env.TWITCH_PFP, url: process.env.INSTA_URL})
        .setDescription(process.env.N_DESC)
        .setColor(0x000000)
        .setThumbnail(process.env.PLAY_PFP)
        .setImage(process.env.SP_PFP)
        .addFields(
            { name: '\u200B', value: '\u200B' },
            { name: process.env.PLAY, value : process.env.PLAY_TEXT, inline: true},
            { name: process.env.SP, value : process.env.SP_TEXT, inline: true  },
            )
        interaction.reply('Woof! 😎')
        interaction.channel.send({
            embeds : [embed]
        });
    }
    //kick interaction, hidden from other users in discord
    if (interaction.commandName === 'bark'){
        if(interaction.member.roles.cache.has('1181856100618883152')){
            interaction.options.get('user').member.kick
        } else{
            interaction.reply("You are not allowed to use this command, soz :c")
        }
    }

})
client.login(process.env.TOKEN)