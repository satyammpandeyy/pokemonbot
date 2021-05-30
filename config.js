module.exports = {
    footer: () => {
        let array = require("fs").readFileSync("./db/tips.txt").toString().trim().split("\n").map(r => r.trim());
        return array[Math.floor(Math.random() * array.length)]
    },
    logChannel: "840164615781351424",
    bugchannelid: "840164615781351424",
    feedbackchannelid: "840164615781351424",
    tradechannelid: "840164615781351424",
    suggestionchannelid: "840164615781351424",

    token: "ODQwNTc5MTQ0NTI1MDIxMTg1.YJaQVQ.cMzG4JogKF0_K29OZfsG68btAWg",
    prefix: ".",

    banAppeal: "",
    owners: ["636158569338634272","838653637395349504","799347403340906537","585022194623447050","413370607036661770","773406008650760202","592949366881255436","791577215980404758"],
    /*satyam, Spidey, yamato , Anshu,Savage,Demon,Agam,Sarthal*/
    asliMalik: ["636158569338634272"],
    dbdevs: ["636158569338634272"],
   
   mongo_atlas: {
       username: "mrx",
       password: "imtheowner",
       cluster: "pokekcord",
      shard: {
        one: "pokecord-shard-00-00.lx83s.mongodb.net:27017",
           two: "pokecord-shard-00-01.lx83s.mongodb.net:27017",
           three: "pokecord-shard-00-02.lx83s.mongodb.net:27017"
       }
    },
    webhooks: {
        cmd: {
            ID: "844849746920210442",
            Token: "XPnCGR-Tvcsbfw1Hqo1BaDjO7Bt4CoaSZw_QDvQYnmOtKWBWJco8uZrJc8-h7jgOcU80"
        },
        guild: {
            ID: "846366794993106944",
            Token: "RlIq8GtXUqB2mv3te5JSpLSSApOSZeQGKifA9G-kuPHIrfZUyBq2ek4ECyDDOmFuTpS3"
        }
    },
    dbl: {
        authorization: "test"
    },
    cooldown: 3000
}

    // token: "ODEwNzQ0NTc0OTIxODAxNzY5.YCoGuQ.jG098wVM2LSTvE9fd39Ej1WvepE",