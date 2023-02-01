const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Carta = new Schema({
    nome: {
        type: String,
        required: true
    },
    clube: {
        type: String,
        required: true
    },
    liga: {
        type: String,
        required: true
    },
    nacionalidade: {
        type: String,
        required: true
    },
    overall: {
        type: Number,
        required: true
    },
    posicao: {
        type: String,
        required: true
    },
    idPifa: {
        type: Number,
        required: true 
    },
    ritmo: {
        type: Number,
        required: true
    },
    finalizacao: {
        type: Number,
        required: true
    }, 
    passe: {
        type: Number,
        required: true
    },
    drible: {
        type: Number,
        required: true
    },
    defesa: {
        type: Number,
        required: true
    }, 
    fisico: {
        type: Number,
        required: true
    },
    fotoCarta: {
        type: String,
        required: true
    },
    precoMax: {
        type: Number,
        default: 200,
        required: true
    },
    precoMin: {
        type: Number,
        default: 150,
        required: true
    },
    tipo: {
        type: String,
        required: true
    },
    dono: {
        type: Schema.Types.ObjectId,
        ref: "jogadores",
        required: true
    },
    nomeDono: {
        type: String,
        ref: "jogadores",
        required: true
    },
    listada: {
        type: Number,
        default: 0,
        required: true
    },
    valorVenda: {
        type: Number,
        default: 0
    }
})


mongoose.model("cartas_geradas", Carta)