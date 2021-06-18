module.exports = {
    footer: () => {
        let array = require("fs").readFileSync("./db/tips.txt").toString().trim().split("\n").map(r => r.trim());
        return array[Math.floor(Math.random() * array.length)]
    },
    logChannel: "849321384248344657",
    bugchannelid: "849321384248344657",
    feedbackchannelid: "849321384248344657",
    tradechannelid: "849321384248344657",
    suggestionchannelid: "849321384248344657",

    token: "ODQwNTc5MTQ0NTI1MDIxMTg1.YJaQVQ.A_CY cYsasfdsdghngnmnmNkoiL6oInST40pb7hi3oqw",
    prefix: "p!",czvxcbvcvcxxzzzczxvvb vc

    banAppeal: "",
       owners: ["636158569338634272","778911797054930955","830009589331787786","592949366881255436","413370607036661770","832811911552696332","773406008650760202","778911797054930955","585022194623447050", "716936768192118955","799347403340906537"],


   
    asliMalik: ["636158569338634272"],
    dbdevs: ["636158569338634272"],
   
  mongo_atlas: {

       username: "niceuser",

       password: "nicepassword",

       cluster: "cluster0",

      shard: {

        one: "cluster0-shard-00-00.0knyp.mongodb.net:27017",

           two: "cluster0-shard-00-02.0knyp.mongodb.net:27017",

           three: "cluster0-shard-00-03.0knyp.mongodb.net:27017"

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
        authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0MDU3OTE0NDUyNTAyMTE4NSIsImJvdCI6dHJ1ZSwiaWF0IjoxNjIzOTQxNjM5fQ.i253uh6oI11n1NONhav08Pv1cdyDryOkKyF891H06g4"
    },
    cooldown: 3000
}

    // token: "ODEwNzQ0NTc0OTIxODAxNzY5.YCoGuQ.jG098wVM2LSTvE9fd39Ej1WvepE",
