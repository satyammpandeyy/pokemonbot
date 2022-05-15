const { MessageAttachment, WebhookClient } = require("discord.js")
const { webhooks } = require("./config")
const { get } = require('request-promise-native')
const Pokemon = require("./Classes/Pokemon");
const currentEvent = "easter";

module.exports = {
    genIV: (min, max) => {
        var gen = `${randomNumber(min, max)}`;
        if (gen[1] == ".") {
            gen = gen.substr(0, 3);
        } else if (gen[2] == ".") {
            gen = gen.substr(0, 4);
        } else if (gen[3] == ".") {
            gen = gen.substr(0, 5);
        }
        return gen;

    },
    getlength: (number) => {
        return number.toString().length;
    },
    capitalize: (arg) => {
        return arg.charAt(0).toUpperCase() + arg.slice(1);
    },
    check: (name) => {
        let array = require('fs')
        let x = array.readFileSync('./db/legends.txt')
            .toString()
            .toLowerCase()
            .replace(/g/g, "-").replace("’", "-")
            .trim()
            .split('\n')
        let y = array.readFileSync('./db/mythics.txt')
            .toString()
            .toLowerCase()
            .replace(/g/g, "-").replace("’", "-")
            .trim()
            .split('\n')
        let z = array.readFileSync('./db/ub.txt')
            .toString()
            .toLowerCase()
            .replace(/g/g, "-").replace("’", "-")
            .trim()
            .split('\n')
        return x.includes(name) || y.includes(name) || z.includes(name)
    },
    checkDex: (name) => {
        let array = require('fs')
        let x = array.readFileSync('./db/dex.txt')
            .toString()
            .toLowerCase()
            .replace(/ +/g, "-").replace("’", "-")
            .trim()
            .split('\n')
        return x.includes(name)
    },
    random: () => {
        let array = require('fs')
            .readFileSync('./db/common.txt')
            .toString()
            .toLowerCase()
            .replace(" ", "-").replace("’", "-")
            .trim()
            .split('\n')
            .map(r => r.trim())
        return array[Math.floor(Math.random() * array.length)]
    },
    hisuian: () => {
        let array = require("./db/hisuan.js").map(r => r.name);
        return array[Math.floor(Math.random() * array.length)]
    },
    legend: () => {
        let array = require('fs')
            .readFileSync('./db/legends.txt')
            .toString()
            .toLowerCase()
            .replace(" ", "-").replace("’", "-")
            .trim()
            .split('\n')
            .map(r => r.trim())
        return array[Math.floor(Math.random() * array.length)]
    },
    mythical: () => {
        let array = require('fs')
            .readFileSync('./db/mythics.txt')
            .toString()
            .toLowerCase()
            .replace(" ", "-").replace("’", "-")
            .trim()
            .split('\n')
            .map(r => r.trim())
        return array[Math.floor(Math.random() * array.length)]
    },
    ub: () => {
        let array = require('fs')
            .readFileSync('./db/ub.txt')
            .toString()
            .toLowerCase()
            .replace(" ", "-").replace("’", "-")
            .trim()
            .split('\n')
            .map(r => r.trim())
        return array[Math.floor(Math.random() * array.length)]
    },
    galarian: () => {
        let array = require('fs')
            .readFileSync('./db/galarians.txt')
            .toString()
            .toLowerCase()
            .replace(" ", "-").replace("’", "-")
            .trim()
            .split('\n')
            .map(r => r.trim())
        return array[Math.floor(Math.random() * array.length)]
    },
    shadow: () => {
        let array = require('fs')
            .readFileSync('./db/shadow.txt')
            .toString()
            .toLowerCase()
            .replace(" ", "-").replace("’", "-")
            .trim()
            .split('\n')
            .map(r => r.trim())
        return array[Math.floor(Math.random() * array.length)]
    },
    gen8: () => {
        let array = require('./db/gen8.js')
        let a = array.filter(r => r.name)
        return a[~~(Math.random() * a.length)].name
    },
    form: () => {
        let array = require('./db/forms.js')
        let a = array.filter(r => r.name)
        return a[~~(Math.random() * a.length)].name
    },
    concept: () => {
        let array = require('./db/concept.js')
        let a = array.filter(r => r.name)
        return a[~~(Math.random() * a.length)].name
    },
    event: () => {
        let array = require('./db/concept.js')
        let a = array.filter(r => r.name && r.name.startsWith(currentEvent))
        return a[~~(Math.random() * a.length)].name
    },
    getRandomNumberBetween: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    },

    generatePokemon: async (name = null, type = null, random = true, shiny = false) => {
        if (name) name = name;
        if (!name && !type && random) {
            let array = require('fs')
                .readFileSync('./db/dex.txt')
                .toString()
                .toLowerCase()
                .replace(" ", "-").replace("’", "-")
                .trim()
                .split('\n')
                .map(r => r.trim())
            name = array[Math.floor(Math.random() * array.length)]
        }
        if (type && !name) {
            if (type == "common") name = module.exports.random();
            if (type == "hisuian") name = module.exports.hisuian();
            if (type == "legend") name = module.exports.legend();
            if (type == "mythical") name = module.exports.mythical();
            if (type == "ub") name = module.exports.ub();
            if (type == "galarian") name = module.exports.galarian();
            if (type == "shadow") name = module.exports.shadow();
            if (type == "gen8") name = module.exports.gen8();
            if (type == "form") name = module.exports.form();
            if (type == "skin") name = module.exports.concept();
        }
        if (type && name) name = name;
        console.log(name)
        let url, poke, Type;
        let lvl = Math.floor(Math.random() * 50);

        shiny = shiny ? true : module.exports.getRandomNumberBetween(1, 4000) > 3990 ? true : false;
        let check
        let option = {
            url: `https://pokeapi.co/api/v2/pokemon/${name}`,
            json: true
        }
        option.url = module.exports.fixUrl(name, option.url);

        if (type == "skin") {
            let t = require("./db/concept.js").filter(r => r.name == name);
            poke = new Pokemon({ name: name, rarity: t[0].type, url: t[0].url, shiny: shiny, nickname: null }, lvl)
        } else if (type == "form") {
            let t = require("./db/forms.js").filter(r => r.name == name);
            poke = new Pokemon({ name: name, rarity: t[0].type, url: t[0].url, shiny: shiny, nickname: null }, lvl)
        } else {
            await get(option).then(async t => {
                check = t.id.toString().length
                if (check === 1) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/00${t.id}.png`
                } else if (check === 2) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/0${t.id}.png`
                } else if (check === 3) {
                    url = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${t.id}.png`
                }

                var re
                Type = t.types.map(r => {
                    if (r !== r) re = r;
                    if (re == r) return;
                    return `${r.type.name}`
                }).join(" | ")

                poke = new Pokemon({ name: name, rarity: Type, url: url, shiny: shiny, nickname: null }, lvl)
            })
        }

        return poke;
    },

    fixUrl: (name, url) => {
        if (name.toLowerCase().startsWith("urshifu")) url = "https://pokeapi.co/api/v2/pokemon/urshifu-single-strike";
        if (name.toLowerCase().startsWith("thundurus")) url = "https://pokeapi.co/api/v2/pokemon/thundurus-incarnate";
        if (name.toLowerCase().startsWith("zygarde")) url = "https://pokeapi.co/api/v2/pokemon/zygarde-50";
        if (name.toLowerCase().startsWith("keldeo")) url = "https://pokeapi.co/api/v2/pokemon/keldeo-ordinary";
        if (name.toLowerCase().startsWith("meloetta")) url = "https://pokeapi.co/api/v2/pokemon/meloetta-aria";
        if (name.toLowerCase().startsWith("zacian")) url = "https://pokeapi.co/api/v2/pokemon/zacian-hero";
        if (name.toLowerCase().startsWith("giratina")) url = "https://pokeapi.co/api/v2/pokemon/giratina-altered";
        if (name.toLowerCase().startsWith("deoxys")) url = "https://pokeapi.co/api/v2/pokemon/deoxys-normal";
        if (name.toLowerCase().startsWith("shaymin")) url = "https://pokeapi.co/api/v2/pokemon/shaymin-land";
        if (name.toLowerCase() === "nidoran") url = "https://pokeapi.co/api/v2/pokemon/nidoran-m";
        if (name.toLowerCase() === "nidoran-f") url = "https://pokeapi.co/api/v2/pokemon/nidoran-f";
        if (name.toLowerCase().startsWith("porygon-z")) url = "https://pokeapi.co/api/v2/pokemon/porygon-z";
        if (name.toLowerCase().startsWith("landorus")) url = "https://pokeapi.co/api/v2/pokemon/landorus-incarnate";
        if (name.toLowerCase().startsWith("thundurus")) url = "https://pokeapi.co/api/v2/pokemon/thunduru-incarnate";
        if (name.toLowerCase().startsWith("tornadus")) url = "https://pokeapi.co/api/v2/pokemon/tornadus-incarnate";
        if (name.toLowerCase().includes("mr.mime")) url = "https://pokeapi.co/api/v2/pokemon/mr-rime";
        if (name.toLowerCase().startsWith("pumpkaboo")) url = "https://pokeapi.co/api/v2/pokemon/pumpkaboo-average";
        if (name.toLowerCase().startsWith("meowstic")) url = "https://pokeapi.co/api/v2/pokemon/meowstic-male";
        if (name.toLowerCase().startsWith("toxtricity")) url = "https://pokeapi.co/api/v2/pokemon/toxtricity-amped";
        if (name.toLowerCase().startsWith("mimikyu")) url = "https://pokeapi.co/api/v2/pokemon/mimikyu-disguised";

        return url
    }
}