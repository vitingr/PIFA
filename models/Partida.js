const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Partida = new Schema({
    idPartida: {
        type: String,
        required: true
    },
    jogador: {
        type: String,
        required: true
    },
    oponente: {
        type: String,
        required: true 
    },
    lineMinha: {
        type: String
    },
    lineOponente: {
        type: String
    },
    ptsJogador: {
        type: Number,
        default: 0
    },
    ptsOponente: {
        type: Number,
        default: 0
    },
    rodada1: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada2: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada3: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada4: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada5: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada6: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada7: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada8: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada9: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada10: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    rodada11: {
        type: String,
        required: true,
        default: "Não Jogado" 
    },
    data: {
        type: Date,
        default: Date.now()
    },
    ganhador: {
        type: String
    },
    cartasUsadas: {
        type: String
    }

})

mongoose.model("partidas", Partida)