require('dotenv').config();
const {REST, Routes, ApplicationCommandOptionType} = require('discord.js');

//command names and descriptions, can add options too
const commands = [
    {
        name : 'woof',
        description : '>:(',
    },
    {
        name : 'hey',
        description : 'Woof',
    },
    {
        name: 'stop-that',
        description : 'Gets mad at User',
        options: [
            {
                name : 'user',
                description: 'user to be mad at',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    {
        name: 'links',
        description : 'links socials',
    },
    {
        name: 'nsfw-links',
        description : 'links nsfw socials',
    },
    {
        name: 'bark',
        description: 'Kicks a member from this server.',
        options: [
          {
            name: 'user',
            description: 'The user you want to kick.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
          },
          {
            name: 'reason',
            description: 'The reason you want to kick.',
            type: ApplicationCommandOptionType.String,
          },
        ],
    },
    {
        name: 'bite',
        description: 'Bans a member from this server.',
        options: [
          {
            name: 'user',
            description: 'The user you want to ban.',
            type: ApplicationCommandOptionType.Mentionable,
            required: true,
          },
          {
            name: 'reason',
            description: 'The reason you want to ban.',
            type: ApplicationCommandOptionType.String,
          },
        ],
    }
    
];

//cant just save, have to register commands before running bot to use newly added commands
//which is node src/register-commands.js
const rest = new REST({version : '10'}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...')
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        )
        console.log('Registration Successful!');

    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();