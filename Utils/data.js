const Natures = require('../Database/Data/natures.js');
const Names = require('../Database/Data/names.js');
const Data = require('../Database/Data/pokemon.js');
const { MessageEmbed } = require('discord.js');
// const Pokemon = require('../Database/Models/pokemon.js');
const items = require('../Database/Data/items.js');
const evolutions = require('../Database/Data/evolution.js');
const moves = require('../Database/Data/moves.js');
// const Guild = require('../Database/Models/guild.js');
const machines = require('../Database/Data/machines.js');
const pokemonmoves = require('../Database/Data/pokemon_moves.js');
const Colors = require('../Database/Data/colors.js');

const NATURE_MULTIPLIERS = {
    "Hardy": { "hp": 1, "atk": 1, "defn": 1, "satk": 1, "sdef": 1, "spd": 1, },
    "Lonely": { "hp": 1, "atk": 1.1, "defn": 0.9, "satk": 1, "sdef": 1, "spd": 1, },
    "Brave": { "hp": 1, "atk": 1.1, "defn": 1, "satk": 1, "sdef": 1, "spd": 0.9, },
    "Adamant": { "hp": 1, "atk": 1.1, "defn": 1, "satk": 0.9, "sdef": 1, "spd": 1, },
    "Naughty": { "hp": 1, "atk": 1.1, "defn": 1, "satk": 1, "sdef": 0.9, "spd": 1, },
    "Bold": { "hp": 1, "atk": 0.9, "defn": 1.1, "satk": 1, "sdef": 1, "spd": 1, },
    "Docile": { "hp": 1, "atk": 1, "defn": 1, "satk": 1, "sdef": 1, "spd": 1, },
    "Relaxed": { "hp": 1, "atk": 1, "defn": 1.1, "satk": 1, "sdef": 1, "spd": 0.9, },
    "Impish": { "hp": 1, "atk": 1, "defn": 1.1, "satk": 0.9, "sdef": 1, "spd": 1, },
    "Lax": { "hp": 1, "atk": 1, "defn": 1.1, "satk": 1, "sdef": 0.9, "spd": 1, },
    "Timid": { "hp": 1, "atk": 0.9, "defn": 1, "satk": 1, "sdef": 1, "spd": 1.1, },
    "Hasty": { "hp": 1, "atk": 1, "defn": 0.9, "satk": 1, "sdef": 1, "spd": 1.1, },
    "Serious": { "hp": 1, "atk": 1, "defn": 1, "satk": 1, "sdef": 1, "spd": 1, },
    "Jolly": { "hp": 1, "atk": 1, "defn": 1, "satk": 0.9, "sdef": 1, "spd": 1.1, },
    "Naive": { "hp": 1, "atk": 1, "defn": 1, "satk": 1, "sdef": 0.9, "spd": 1.1, },
    "Modest": { "hp": 1, "atk": 0.9, "defn": 1, "satk": 1.1, "sdef": 1, "spd": 1, },
    "Mild": { "hp": 1, "atk": 1, "defn": 0.9, "satk": 1.1, "sdef": 1, "spd": 1, },
    "Quiet": { "hp": 1, "atk": 1, "defn": 1, "satk": 1.1, "sdef": 1, "spd": 0.9, },
    "Bashful": { "hp": 1, "atk": 1, "defn": 1, "satk": 1, "sdef": 1, "spd": 1, },
    "Rash": { "hp": 1, "atk": 1, "defn": 1, "satk": 1.1, "sdef": 0.9, "spd": 1, },
    "Calm": { "hp": 1, "atk": 0.9, "defn": 1, "satk": 1, "sdef": 1.1, "spd": 1, },
    "Gentle": { "hp": 1, "atk": 1, "defn": 0.9, "satk": 1, "sdef": 1.1, "spd": 1, },
    "Sassy": { "hp": 1, "atk": 1, "defn": 1, "satk": 1, "sdef": 1.1, "spd": 0.9, },
    "Careful": { "hp": 1, "atk": 1, "defn": 1, "satk": 0.9, "sdef": 1.1, "spd": 1, },
    "Quirky": { "hp": 1, "atk": 1, "defn": 1, "satk": 1, "sdef": 1, "spd": 1, },
};

TYPES = [
    null,
    "Normal",
    "Fighting",
    "Flying",
    "Poison",
    "Ground",
    "Rock",
    "Bug",
    "Ghost",
    "Steel",
    "Fire",
    "Water",
    "Grass",
    "Electric",
    "Psychic",
    "Ice",
    "Dragon",
    "Dark",
    "Fairy",
    "???",
    "Shadow"
];

const species_by_name = function (specie) {
    for (const d of Data) {
        if (Object.values(d.names).map(name => name.toLowerCase()).includes(specie.toLowerCase())) {
            return d
        }
    }
}

exports.species_by_name = species_by_name;

const species_by_num = (id) => {
    for (d of Data) {
        if (d.species_id == parseInt(id)) {
            return d;
        }
    }
}
exports.species_by_num = species_by_num

exports.get_types = (species_id) => {
    let sp
    if (!isNaN(species_id)) {
        sp = species_by_num(parseInt(species_id));
    }
    if (typeof species_id === 'string') {
        sp = species_by_name(species_id);
    }
    let types = [];
    for (t of sp.types) {
        types.push(TYPES[t]);
    }
    return types
}

exports.get_image = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

exports.get_shiny_image = (id) => {
    if (id < 100 && id > 9) {
        id = `0${id}`;
    }
    if (id < 10) {
        id = `00${id}`;
    }
    return `https://www.serebii.net/Shiny/SWSH/${id}.png`
}

const LANGUAGES = [
    null,
    [1, 'Japanese', '🇯🇵'],
    [2, 'Romaji', '🇯🇵'],
    [3, 'Korean', '🇰🇷'],
    [4, 'Chineese', '🇨🇳'],
    [5, 'French', '🇫🇷'],
    [6, 'German', '🇩🇪'],
    [7, 'Spanish', '🇪🇸'],
    [8, 'Italian', '🇮🇹'],
    [9, 'English', '🇺🇸'],
    [10, 'Czech', '🇨🇿']
];

exports.get_lang = (id) => {
    return LANGUAGES[id];
}

exports.item_by_name = name => {
    let ritem = null;
    for (item of items) {
        if (item.name.toLowerCase() === name.toLowerCase()) {
            ritem = item;
            break;
        }
    }
    return ritem;
}

exports.item_by_id = id => {
    let ritem = null;
    for (item of items) {
        if (item.id == id) {
            ritem = item;
            break;
        }
    }
    return ritem;
}

exports.move_by_id = (id) => {
    return moves[id - 1];
}

exports.get_evo_data = evoid => {
    let evo = null;
    for (let ev of evolutions) {
        if (ev.evolved_species_id === evoid) {
            evo = ev;
            break;
        }
    }
    return evo;
}

exports.get_next_evo = (pokemon, species) => {
    let can = true;
    let possible = null;
    if (species.evolution_to != []) {
        for (let ev of evolutions) {
            if (ev.evolved_species_id == species.evolution_to[0]) {
                if (ev.minimum_level != null && pokemon.level < ev.minimum_level) {
                    can = false;
                }
                if (ev.trigger_item_id != null && pokwmon.held_item != ev.trigger_item_id) {
                    can = false;
                }
                if (ev.known_move_id != null && !(pokemon.moves.includes(parseInt(ev.known_move_id)))) {
                    can = false;
                }
                if (ev.relative_physical_stats == 1 && pokemon.atk <= pokemon.defn) {
                    can = false;
                }
                if (ev.relative_physical_stats == -1 && pokemon.defn <= pokemon.atk) {
                    can = false;
                }
                if (ev.relative_physical_stats == 0 && pokemon.atk != pokemon.defn) {
                    can = false;
                }

                if (can) {
                    possible = species.evolution_to[0];
                }
                ///////////////////////////////////////////////////////////////////////////
                // if (ev.known_move_type_id != null) {
                //     let mvarr = [];
                //     for (move of pokemon.moves) {
                //         let mv = moves[move - 1];
                //         mvarr.push(mv.type_id == ev.known_move_type_id);
                //     }
                // }
                ///////////////////////////////////////////////////////////////////////////
            }
        }
    }
    return possible;
}

// exports.fetch_guild = async guild_id => {
//     let g = await Guild.findOne({ id: guild_id });
//     if (g == null) {
//         g = new Guild({ id: guild_id });
//         guild_data.save((err) => {
//             if (err) return console.log(err);
//         });
//     }
//     return g;
// }

exports.machine_by_num = num => {
    let machine = null;
    for (m of machines) {
        if (m.machine_number == num) {
            machine = m;
            break;
        }
    }
    return machine;
}

exports.move_by_name = (name) => {
    for (const mv of moves) {
        if (mv.name.toLowerCase() === name.toLowerCase()) return mv;
    }
}

exports.move_by_id = (id) => {
    for (const mv of moves) {
        if (mv.id == id) return mv;
    }
}

exports.move_type = (typeid) => {
    return TYPES[typeid];
}

const DAMAGE_CLASSES = [null, "Status", "Physical", "Special"];

exports.move_damage_class = (damageid) => {
    return DAMAGE_CLASSES[damageid];
}

exports.pokemon_moves = (pkid) => {
    let moves = [];
    for (const mv of pokemonmoves) {
        if (mv.pokemon_id == pkid) moves.push(mv.move_id);
    }
    return moves;
}

exports.raw_pokemon_moves = (pkid) => {
    let moves = [];
    for (const mv of pokemonmoves) {
        if (mv.pokemon_id == pkid) moves.push(mv);
    }
    return moves;
}

exports.get_move_machine = (mvid) => {
    const mchs = [];
    for (const machine of machines) {
        if (machine.move_ids.includes(mvid)) mchs.push(machine);
    }
    return mchs;
}

const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

const get_pokemon_color = (spid) => {
    let color = null;
    for (const clr of Colors) {
        if (clr.species_id == spid) {
            color = rgbToHex(...clr.normal_color.slice(0, 3));
        }
    }
    if (color == null) {
        return '#288B72';
    }
    return color;
}

exports.get_pokemon_color = get_pokemon_color;

const TYPE_EFFICACY = [
    null,
    [null, 1, 1, 1, 1, 1, 0.5, 1, 0, 0.5, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [null, 2, 1, 0.5, 0.5, 1, 2, 0.5, 0, 2, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5],
    [null, 1, 2, 1, 1, 1, 0.5, 2, 1, 0.5, 1, 1, 2, 0.5, 1, 1, 1, 1, 1],
    [null, 1, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 0, 1, 1, 2, 1, 1, 1, 1, 1, 2],
    [null, 1, 1, 0, 2, 1, 2, 0.5, 1, 2, 2, 1, 0.5, 2, 1, 1, 1, 1, 1],
    [null, 1, 0.5, 2, 1, 0.5, 1, 2, 1, 0.5, 2, 1, 1, 1, 1, 2, 1, 1, 1],
    [null, 1, 0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 0.5, 1, 2, 1, 2, 1, 1, 2, 0.5],
    [null, 0, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 1],
    [null, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5, 0.5, 1, 0.5, 1, 2, 1, 1, 2],
    [null, 1, 1, 1, 1, 1, 0.5, 2, 1, 2, 0.5, 0.5, 2, 1, 1, 2, 0.5, 1, 1],
    [null, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 1, 0.5, 1, 1],
    [null, 1, 1, 0.5, 0.5, 2, 2, 0.5, 1, 0.5, 0.5, 2, 0.5, 1, 1, 1, 0.5, 1, 1],
    [null, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 2, 0.5, 0.5, 1, 1, 0.5, 1, 1],
    [null, 1, 2, 1, 2, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 0, 1],
    [null, 1, 1, 2, 1, 2, 1, 1, 1, 0.5, 0.5, 0.5, 2, 1, 1, 0.5, 2, 1, 1],
    [null, 1, 1, 1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 1, 1, 2, 1, 0],
    [null, 1, 0.5, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 0.5, 0.5],
    [null, 1, 2, 1, 0.5, 1, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 1, 1, 2, 2, 1],
];

exports.TYPE_EFFICACY = TYPE_EFFICACY;

exports.get_weakness = (sp) => {
    let weak = new Set();
    let normal = new Set();
    let resist = new Set();
    let immune = new Set();

    let sp_types = [];
    for (const idx of sp.types) {
        sp_types.push(TYPES[idx]);
    }

    for (const [idx, typ_name] of TYPES.slice(1, -2).entries()) {
        let x = 1;
        for (const typ of sp.types) {
            x *= TYPE_EFFICACY[parseInt(idx) + 1][typ];
        }

        if (x > 1) {
            if (!(sp_types.includes(typ_name))) weak.add(typ_name);
            else weak.add(`**${typ_name}**`);
        }
        else if (x == 1) {
            if (!(sp_types.includes(typ_name))) normal.add(typ_name);
            else normal.add(`**${typ_name}**`);
        }
        else if (x == 0) {
            if (!(sp_types.includes(typ_name))) immune.add(typ_name);
            else immune.add(`**${typ_name}**`);
        }
        else {
            if (!(sp_types.includes(typ_name))) resist.add(typ_name);
            else resist.add(`**${typ_name}**`);
        }
    }

    const emb = new MessageEmbed()
        .setTitle(`${sp.names['9']} (${sp_types.join('/')})`)
        .setColor(client.config.color)
        .setThumbnail(sp.sprites.normal)

    if (Array.from(weak).length != 0) emb.addField(`Weak`, Array.from(weak).join(', '));
    if (Array.from(normal).length != 0) emb.addField(`Normal`, Array.from(normal).join(', '));
    if (Array.from(resist).length != 0) emb.addField(`Resist`, Array.from(resist).join(', '));
    if (Array.from(immune).length != 0) emb.addField(`Immune`, Array.from(immune).join(', '));

    return emb;
}