const User = require('../../models/user.js');

module.exports = {
    name: 'unselect',
    description: 'Unselect your selected pokémon !',
    run: async (client, interaction, args, color, prefix) => {

        let user = await User.findOne({ id: interaction.user.id })
        if (!user) return interaction.followUp({ content: `You must pick your starter pokémon with \`${prefix}start\` before using this command.` })

        if (user.selected == null || user.selected == undefined || !user.pokemons[user.selected]) return interaction.followUp({ content: "You don't have any active pokémon selected !" })
        let x = user.pokemons[user.selected].name.replace(/-+/g, " ").replace(/\b\w/g, l => l.toUpperCase())

        user.selected = null
        await user.save().catch(() => { })
        return interaction.followUp({ content: `You have unselected your pokémon ! ( \`${x}\` )` })
    }
}