const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Lineup = new Schema({
    nome: {
        type: String,
        default: "Meu Elenco",
        required: true
    },
    forca: {
        type: Number
    },
    carta1: {
        type: String
    },
    carta2: {
        type: String
    },
    carta3: {
        type: String
    },
    carta4: {
        type: String
    },
    carta5: {
        type: String
    },
    carta6: {
        type: String
    },
    carta7: {
        type: String
    },
    carta8: {
        type: String
    },
    carta9: {
        type: String
    },
    carta10: {
        type: String
    },
    carta11: {
        type: String
    },
    IDcarta1: {
        type: String
    },
    IDcarta2: {
        type: String
    },
    IDcarta3: {
        type: String
    },
    IDcarta4: {
        type: String
    },
    IDcarta5: {
        type: String
    },
    IDcarta6: {
        type: String
    },
    IDcarta7: {
        type: String
    },
    IDcarta8: {
        type: String
    },
    IDcarta9: {
        type: String
    },
    IDcarta10: {
        type: String
    },
    IDcarta11: {
        type: String
    },
    dono: {
        type: Schema.Types.ObjectId,
        ref: "jogadores",
        required: true
    },
    titular: {
        type: Number,
        default: 0
    }
})

mongoose.model("lineups", Lineup)