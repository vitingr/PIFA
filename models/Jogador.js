const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Jogador = new Schema({
    nome: {
        type: String,
        required: true
    },
    nomeClube: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    senha: {
        type: String,
        required: true
    },
    ptsXP: {
        type: Number
    },
    lvlXP: {
        type: String,
        required: true
    },
    dinheiro: {
        type: Number,
        required: true
    },
    escudo: {
        type: String,
        required: true
    },
    amigos: {
        type: String
    },
    logado: {
        type: Number,
        default: 1
    },
    cartas: {
        type: Number 
    },
    escudos: {
        type: String,
        required: true
    },
    convitesPendentes: {
        type: Number
    },
    amigosPendentes: {
        type: String
    },
    novo: {
        type: Number,
        default: 0
    },
    logoRanking: {
        type: String,
        default: "https://cdn.clashwiki.com/wp-content/uploads/BronzeLeague.png"
    },
    ranking: {
        type: String,
        default: "Bronze",
        required: true
    },
    ptsRank: {
        type: Number,
        default: 0
    },
    jogosGanhos: {
        type: Number,
        default: 0
    },
    linesCriadas: {
        type: Number,
        default: 0
    }
})


mongoose.model("jogadores", Jogador)