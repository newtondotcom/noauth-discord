import { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import constants from '../../constants.js';

export default {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('Open your panel and manage your bot, users... And enjoy !'),
        
    async execute(interaction) {
        
        const userid = interaction.user.id;
        const req = await fetch(constants.masterUri + `get_whitelist/?guild_id=${constants.guildId}`);
        const data = await req.json();
        const whitelist = data.whitelist;
        console.log(whitelist);
        console.log(userid);
        if (!constants.owners.includes(userid)&&!whitelist.includes(userid)) {
            await interaction.reply("You don't have permission to use this command.");
            return;
        }

        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🚨')
                .setLabel('Custom button')
                .setDescription('Custom the verification button')
                .setValue('managecustom'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🔘')
                .setLabel('Spawn the button')
                .setDescription('Generate the verification button')
                .setValue('button'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🤖')
                .setLabel('About your bot')
                .setDescription('Manage your bot')
                .setValue('managebot'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('🧑')
                .setLabel('Manage users')
                .setDescription('Manages users')
                .setValue('manageuser'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('✔️')
                .setLabel('Manage Whitelist')
                .setDescription('Manages users who have access to the whitelist')
                .setValue('managewl'),
        )
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setEmoji('❌')
                .setLabel('Close Menu')
                .setDescription('Close the menu')
                .setValue("closemenu"),
        )
            .setCustomId('selectCommand');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        try{
          await interaction.update({ content: '', components: [row],
            embeds: [{
                color: 0xff8000 ,
                title: `🆔  Manage your NOAuth bot`,
                description: '**Welcome, *on your NOAuth.***\n **There is some rules to read before use. \n `[1]`Do not resell the bot ❌ \n `[2]`...** \n \n **Si vous avez acheté ce bot à un particulié signalez le [ici](https://discord.com/channels/1005570403932049458/1005573106779304016/1129072045246914630). \n Vous serez récompensé**',}]
        });
            } catch(error){
            await interaction.reply({ content: '', components: [row],
                embeds: [{
                    color: 0xff8000 ,
                    title: `🆔  Manage your NOAuth bot`,
                    description: '**Welcome, *on your NOAuth.***\n **There is some rules to read before use : \n\n `[1]`Do not resell the bot ❌ \n `[2]`...** \n \n **If you have purchased this bot from a private individual, please report it [here](https://discord.com/channels/1005570403932049458/1005573106779304016/1129072045246914630). \n You will be rewarded**',
            }]
        });
        }
    },
};
