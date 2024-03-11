import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ButtonBuilder} from 'discord.js';
import constants from '../constants.js';
import fetch from 'node-fetch';

export default {
    ///////////////////////////////////////SPAWN BOUTON
async button(interaction) {

        const query = await fetch(constants.masterUri+'get_button/?guild_id='+constants.guildId, {method: 'GET',headers: constants.header})
        const datat = await query.json()
        const data = datat.button[0]

        const urlImage = decodeURIComponent(data.image)

        const exampleEmbed = {
            color: parseInt(data.color),
            image: {
                url: urlImage,
              },
            title: data.title,
            url: constants.authLink,
            author: {
                name: data.name,
                icon_url: urlImage,
                url: constants.authLink,
            },
            description: data.description,
            timestamp: new Date().toISOString(),
            footer: {
                text: data.footer,
                icon_url: urlImage,
            },
        };

        const button = new ButtonBuilder()
            .setLabel(data.content)
            .setURL(constants.authLink)
            .setStyle(5);

        const actionRow = new ActionRowBuilder()
            .addComponents(button);

        //await interaction.message.delete();
        //await interaction.reply({ content: 'Bouton spawn !', ephemeral: true });

        //Send the embed to this channel
        let id = interaction.channelId;
        let channel = await interaction.guild.channels.cache.get(id);
        await channel.send({ embeds: [exampleEmbed], components: [actionRow] });
    },

    ////////////////////////////////////////////////GRAPHIC BOUTON

    async custombuttongraphic(interaction) {

        const query = await fetch(constants.masterUri+'get_button/?guild_id='+constants.guildId, {method: 'GET',headers: constants.header})
        const datat = await query.json()
        const data = datat.button[0]

        const modal = new ModalBuilder()
            .setCustomId('custombuttongraphic')
            .setTitle('Final step');

        const image = new TextInputBuilder()
            .setCustomId('image')
            .setLabel("What's the image?")
            .setValue(decodeURIComponent(data.image))
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const color = new TextInputBuilder()
            .setCustomId('color')
            .setRequired(false)
            .setLabel("Color (INT value) like 1752220 for Aqua")
            .setValue(data.color)
            .setStyle(TextInputStyle.Short);

        const imageActionRow = new ActionRowBuilder().addComponents(image);
        const colorActionRow = new ActionRowBuilder().addComponents(color);

        modal.addComponents(imageActionRow);
        modal.addComponents(colorActionRow);

        await interaction.showModal(modal);
    },

    /////////////////////////////CUSTOMBUTTONTESXT

    async custombuttontext(interaction) {

        const query = await fetch(constants.masterUri+'get_button/?guild_id='+constants.guildId, {method: 'GET',headers: constants.header})
        const datat = await query.json()
        const data = datat.button[0]

        const modal = new ModalBuilder()
            .setCustomId('custombuttontext')
            .setTitle('Final step');

        const name = new TextInputBuilder()
            .setCustomId('name')
            .setValue(data.name)
            .setLabel("What's the name?")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const title = new TextInputBuilder()
            .setCustomId('title')
            .setValue(data.title)
            .setLabel("What's the title?")
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const description = new TextInputBuilder()
            .setCustomId('description')
            .setLabel("What's the description?")
            .setValue(data.description)
            .setRequired(false)
            .setStyle(TextInputStyle.Paragraph);

        const footer = new TextInputBuilder()
            .setCustomId('footer')
            .setLabel("What's the footer?")
            .setValue(data.footer)
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const nameActionRow = new ActionRowBuilder().addComponents(name);
        const titleActionRow = new ActionRowBuilder().addComponents(title);
        const descriptionActionRow = new ActionRowBuilder().addComponents(description);
        const footerActionRow = new ActionRowBuilder().addComponents(footer);

        modal.addComponents(nameActionRow);
        modal.addComponents(titleActionRow);
        modal.addComponents(descriptionActionRow);
        modal.addComponents(footerActionRow);

        await interaction.showModal(modal);
    },

    ////////////////////////////MANAGECUSTOM

    async managecustom(interaction) {
        const selectMenu = new StringSelectMenuBuilder()
            .setPlaceholder('Select an option')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🖋️')
                    .setLabel('Text')
                    .setDescription('Custom the text of the verification message')
                    .setValue('custombuttontext'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🖼️')
                    .setLabel('Graphic')
                    .setDescription('Custom the design of  the verification message')
                    .setValue('custombuttongraphic'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🏷️')
                    .setLabel('Role')
                    .setDescription('Select role to give after verification')
                    .setValue('selectrole'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('☑️')
                    .setLabel('Content')
                    .setDescription('Edit the button content')
                    .setValue('buttonname'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('🏁')
                    .setLabel('Spawn the button')
                    .setDescription('Generate the verification button')
                    .setValue('button'),
            )
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setEmoji('⏪')
                    .setLabel('Go back')
                    .setValue('backtozero'),
            )
            .setCustomId('selectCustom');
  
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({ content: '', components: [row] });
    },

    async selectrole(interaction) {    
        const roleOptions = [];
    
        interaction.guild.roles.cache.forEach(role => {
            roleOptions.push({
                label: role.name,
                value: role.id
            });
        });

        const selectMenuGame = new StringSelectMenuBuilder()
            .setPlaceholder('')
            .addOptions(roleOptions)
            .setCustomId('selectroletoadd');
    
        const rowGame = new ActionRowBuilder().addComponents(selectMenuGame);
        await interaction.update({ content: '', components: [rowGame] });
    },

    async buttoncontent(interaction) {
        const query = await fetch(constants.masterUri+'get_button/?guild_id='+constants.guildId, {method: 'GET',headers: constants.header})
        const datat = await query.json()
        const data = datat.button[0]

        const modal = new ModalBuilder()
            .setCustomId('custombuttoncontent')
            .setTitle('Edit the button name');

        const content = new TextInputBuilder()
            .setCustomId('content')
            .setValue(data.content)
            .setLabel("What's the button content?")
            .setRequired(true)
            .setStyle(TextInputStyle.Short);

        const nameActionRow = new ActionRowBuilder().addComponents(content);
        modal.addComponents(nameActionRow);
        await interaction.showModal(modal);
    }

}
