// Imports Express

const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const { redirect } = require("react-router-dom")

// Declarando Models
require("../models/Jogador")
const Jogador = mongoose.model("jogadores")

require("../models/Carta")
const Carta = mongoose.model("cartas")

require("../models/CartaGerada")
const CartaGerada = mongoose.model("cartas_geradas")

require("../models/Lineup")
const Lineup = mongoose.model("lineups")

require("../models/Partida")
const Partida = mongoose.model("partidas")

require("../models/LineBatalha")
const LinePVP = mongoose.model("lineupsPVP")

// Funções


function getPassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJLMNOPQRSTUVWXYZ!@#$%&*?";
    var passwordLength = 10;
    var password = "";

    for (var i = 0; i < passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    return password
}


// Declarando Rotas

router.get('/')

router.get("/loja", (req, res) => {

    const jogadorLogado = {
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,

    }

    res.render("jogador/loja", { jogador: jogadorLogado })

})

router.post("/playersPack", (req, res) => {

    const jogadorLogado = {
        id: req.user.id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,

    }

    if (jogadorLogado.dinheiro >= 35000) {

        jogadorLogado.dinheiro -= 35000

        Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

            jogador.dinheiro = jogador.dinheiro - 35000
            jogador.cartas = jogador.cartas + 6

            Carta.find({ $and: [{ tipo: { $in: ["ouroRaro", "ouro", "TOTM", "OnesToWatch", "Idolo"] } }, { overall: { $in: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84] } }] }).lean().then((cartas) => {

                var drops = [] // Aqui serão armazenados todas as opções possíveis de Drops (Cartas, Escudos e Consumíveis);

                cartas.forEach(element => {
                    drops.push(element.idPifa)
                })

                var idCartas = [] // Aqui serão armazenados todos os IDs gerados, que serão relacionados com os ids dos drops

                for (var i = 1; i < 7; i++) { // Quantidade de Drops a serem gerados

                    var cartaId = Math.floor(Math.random() * drops.length) // Gerador de ID
                    var valueCarta = drops[cartaId]
                    idCartas.push(valueCarta)

                    Carta.findOne({ idPifa: valueCarta }).then((carta) => { // Vai encontrar uma carta com o Determinado ID

                        console.log(carta)

                        var novaCartaGerada = {
                            nome: carta.nome,
                            clube: carta.clube,
                            liga: carta.liga,
                            nacionalidade: carta.nacionalidade,
                            overall: carta.overall,
                            posicao: carta.posicao,
                            idPifa: carta.idPifa,
                            ritmo: carta.ritmo,
                            finalizacao: carta.finalizacao,
                            passe: carta.passe,
                            drible: carta.drible,
                            defesa: carta.defesa,
                            fisico: carta.fisico,
                            fotoCarta: carta.fotoCarta,
                            precoMax: carta.precoMax,
                            precoMin: carta.precoMin,
                            tipo: carta.tipo,
                            dono: jogadorLogado.id,
                            nomeDono: jogadorLogado.nomeClube,
                            listada: 0
                        }

                        new CartaGerada(novaCartaGerada).save().then(() => {

                            console.log("Carta Criada")

                        }).catch((erro) => {

                            console.log(erro)
                            console.log(`erro => ${carta}`)

                        })

                    })

                }

                jogador.save().then(() => {

                    console.log("Cartas Adicionadas à Conta")

                })

                Carta.find({ "idPifa": { $in: idCartas } }).sort({ overall: -1 }).lean().then((cartasGeradas) => {

                    req.flash('success_msg', 'SUCESSO! O pacote foi aberto...')
                    res.render("jogador/drops", { cartasGeradas: cartasGeradas, jogador: jogadorLogado })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                    res.redirect("/jogador/loja")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                res.redirect("/jogador/loja")

            })


        })

    } else {

        req.flash('error_msg', 'ERRO! Dinheiro Insuficiente')
        res.redirect("/jogador/loja")

    }

})

router.post("/rareGoldPack", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos
    }

    if (jogadorLogado.dinheiro >= 15000) {

        jogadorLogado.dinheiro -= 15000

        Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

            jogador.dinheiro = jogador.dinheiro - 15000
            jogador.cartas = jogador.cartas + 6

            Carta.find({ $and: [{ tipo: { $in: ["ouro", "ouroRaro"] } }, { overall: { $in: [75, 76, 77, 78, 79, 80] } }] }).lean().then((cartas) => {

                var drops = [] // Aqui serão armazenados todas as opções possíveis de Drops (Cartas, Escudos e Consumíveis);

                cartas.forEach(element => {
                    drops.push(element.idPifa)
                })

                var idCartas = [] // Aqui serão armazenados todos os IDs gerados, que serão relacionados com os ids dos drops

                for (var i = 1; i < 7; i++) { // Quantidade de Drops a serem gerados

                    var cartaId = Math.floor(Math.random() * drops.length) // Gerador de ID
                    var valueCarta = drops[cartaId]
                    idCartas.push(valueCarta)

                    Carta.findOne({ idPifa: valueCarta }).then((carta) => { // Vai encontrar uma carta com o Determinado ID

                        var novaCartaGerada = {
                            nome: carta.nome,
                            clube: carta.clube,
                            liga: carta.liga,
                            nacionalidade: carta.nacionalidade,
                            overall: carta.overall,
                            posicao: carta.posicao,
                            idPifa: carta.idPifa,
                            ritmo: carta.ritmo,
                            finalizacao: carta.finalizacao,
                            passe: carta.passe,
                            drible: carta.drible,
                            defesa: carta.defesa,
                            fisico: carta.fisico,
                            fotoCarta: carta.fotoCarta,
                            precoMax: carta.precoMax,
                            precoMin: carta.precoMin,
                            tipo: carta.tipo,
                            dono: jogadorLogado.id,
                            nomeDono: jogadorLogado.nomeClube,
                            listada: 0
                        }

                        new CartaGerada(novaCartaGerada).save().then(() => {

                            console.log("Carta Criada")

                        })

                    })

                }

                jogador.save().then(() => {

                    console.log("Cartas Adicionadas à Conta")

                })

                Carta.find({ "idPifa": { $in: idCartas } }).sort({ overall: -1 }).lean().then((cartasGeradas) => {

                    req.flash('success_msg', 'SUCESSO! O pacote foi aberto...')
                    res.render("jogador/drops", { cartasGeradas: cartasGeradas, jogador: jogadorLogado })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                    res.redirect("/jogador/loja")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                res.redirect("/jogador/loja")

            })


        })

    } else {

        req.flash('error_msg', 'ERRO! Dinheiro Insuficiente')
        res.redirect("/jogador/loja")

    }

})

router.post("/goldPack", (req, res) => {

    const jogadorLogado = {
        id: req.user.id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,

    }

    if (jogadorLogado.dinheiro >= 10000) {

        jogadorLogado.dinheiro -= 10000

        Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

            jogador.dinheiro = jogador.dinheiro - 10000
            jogador.cartas = jogador.cartas + 6

            Carta.find({ $and: [{ tipo: { $in: ["ouroRaro", "ouro"] } }, { overall: { $in: [75, 76, 77, 78] } }] }).lean().then((cartas) => {

                var drops = [] // Aqui serão armazenados todas as opções possíveis de Drops (Cartas, Escudos e Consumíveis);

                cartas.forEach(element => {
                    drops.push(element.idPifa)
                })

                var idCartas = [] // Aqui serão armazenados todos os IDs gerados, que serão relacionados com os ids dos drops

                for (var i = 1; i < 7; i++) { // Quantidade de Drops a serem gerados

                    var cartaId = Math.floor(Math.random() * drops.length) // Gerador de ID
                    var valueCarta = drops[cartaId]
                    idCartas.push(valueCarta)

                    Carta.findOne({ idPifa: valueCarta }).then((carta) => { // Vai encontrar uma carta com o Determinado ID

                        var novaCartaGerada = {
                            nome: carta.nome,
                            clube: carta.clube,
                            liga: carta.liga,
                            nacionalidade: carta.nacionalidade,
                            overall: carta.overall,
                            posicao: carta.posicao,
                            idPifa: carta.idPifa,
                            ritmo: carta.ritmo,
                            finalizacao: carta.finalizacao,
                            passe: carta.passe,
                            drible: carta.drible,
                            defesa: carta.defesa,
                            fisico: carta.fisico,
                            fotoCarta: carta.fotoCarta,
                            precoMax: carta.precoMax,
                            precoMin: carta.precoMin,
                            tipo: carta.tipo,
                            dono: jogadorLogado.id,
                            nomeDono: jogadorLogado.nomeClube,
                            listada: 0
                        }

                        new CartaGerada(novaCartaGerada).save().then(() => {

                            console.log("Carta Criada")

                        })

                    })

                }

                jogador.save().then(() => {

                    console.log("Cartas Adicionadas à Conta")

                })

                Carta.find({ "idPifa": { $in: idCartas } }).sort({ overall: -1 }).lean().then((cartasGeradas) => {

                    req.flash('success_msg', 'SUCESSO! O pacote foi aberto...')
                    res.render("jogador/drops", { cartasGeradas: cartasGeradas, jogador: jogadorLogado })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                    res.redirect("/jogador/loja")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                res.redirect("/jogador/loja")

            })


        })

    } else {

        req.flash('error_msg', 'ERRO! Dinheiro Insuficiente')
        res.redirect("/jogador/loja")

    }

})

router.post("/rareSilverPack", (req, res) => {

    const jogadorLogado = {
        id: req.user.id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,

    }

    if (jogadorLogado.dinheiro >= 5000) {

        jogadorLogado.dinheiro -= 5000

        Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

            jogador.dinheiro = jogador.dinheiro - 5000
            jogador.cartas = jogador.cartas + 6

            Carta.find({ $and: [{ tipo: { $in: ["prataRaro", "prata"] } }, { overall: { $in: [69, 70, 71, 72, 73, 74] } }] }).lean().then((cartas) => {

                var drops = [] // Aqui serão armazenados todas as opções possíveis de Drops (Cartas, Escudos e Consumíveis);

                cartas.forEach(element => {
                    drops.push(element.idPifa)
                })

                var idCartas = [] // Aqui serão armazenados todos os IDs gerados, que serão relacionados com os ids dos drops

                for (var i = 1; i < 7; i++) { // Quantidade de Drops a serem gerados

                    var cartaId = Math.floor(Math.random() * drops.length) // Gerador de ID
                    var valueCarta = drops[cartaId]
                    idCartas.push(valueCarta)

                    Carta.findOne({ idPifa: valueCarta }).then((carta) => { // Vai encontrar uma carta com o Determinado ID

                        var novaCartaGerada = {
                            nome: carta.nome,
                            clube: carta.clube,
                            liga: carta.liga,
                            nacionalidade: carta.nacionalidade,
                            overall: carta.overall,
                            posicao: carta.posicao,
                            idPifa: carta.idPifa,
                            ritmo: carta.ritmo,
                            finalizacao: carta.finalizacao,
                            passe: carta.passe,
                            drible: carta.drible,
                            defesa: carta.defesa,
                            fisico: carta.fisico,
                            fotoCarta: carta.fotoCarta,
                            precoMax: carta.precoMax,
                            precoMin: carta.precoMin,
                            tipo: carta.tipo,
                            dono: jogadorLogado.id,
                            nomeDono: jogadorLogado.nomeClube,
                            listada: 0
                        }

                        new CartaGerada(novaCartaGerada).save().then(() => {

                            console.log("Carta Criada")

                        })

                    })

                }

                jogador.save().then(() => {

                    console.log("Cartas Adicionadas à Conta")

                })

                Carta.find({ "idPifa": { $in: idCartas } }).sort({ overall: -1 }).lean().then((cartasGeradas) => {

                    req.flash('success_msg', 'SUCESSO! O pacote foi aberto...')
                    res.render("jogador/drops", { cartasGeradas: cartasGeradas, jogador: jogadorLogado })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                    res.redirect("/jogador/loja")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                res.redirect("/jogador/loja")

            })


        })

    } else {

        req.flash('error_msg', 'ERRO! Dinheiro Insuficiente')
        res.redirect("/jogador/loja")

    }

})

router.post("/silverPack", (req, res) => {

    const jogadorLogado = {
        id: req.user.id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,

    }

    if (jogadorLogado.dinheiro >= 2500) {

        jogadorLogado.dinheiro -= 2500

        Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

            jogador.dinheiro = jogador.dinheiro - 2500
            jogador.cartas = jogador.cartas + 6

            Carta.find({ $and: [{ tipo: { $in: ["prataRaro", "prata"] } }, { overall: { $in: [67, 68, 69, 70, 71, 72, 73, 74] } }] }).lean().then((cartas) => {

                var drops = [] // Aqui serão armazenados todas as opções possíveis de Drops (Cartas, Escudos e Consumíveis);

                cartas.forEach(element => {
                    drops.push(element.idPifa)
                })

                var idCartas = [] // Aqui serão armazenados todos os IDs gerados, que serão relacionados com os ids dos drops

                for (var i = 1; i < 7; i++) { // Quantidade de Drops a serem gerados

                    var cartaId = Math.floor(Math.random() * drops.length) // Gerador de ID
                    var valueCarta = drops[cartaId]
                    idCartas.push(valueCarta)

                    Carta.findOne({ idPifa: valueCarta }).then((carta) => { // Vai encontrar uma carta com o Determinado ID

                        var novaCartaGerada = {
                            nome: carta.nome,
                            clube: carta.clube,
                            liga: carta.liga,
                            nacionalidade: carta.nacionalidade,
                            overall: carta.overall,
                            posicao: carta.posicao,
                            idPifa: carta.idPifa,
                            ritmo: carta.ritmo,
                            finalizacao: carta.finalizacao,
                            passe: carta.passe,
                            drible: carta.drible,
                            defesa: carta.defesa,
                            fisico: carta.fisico,
                            fotoCarta: carta.fotoCarta,
                            precoMax: carta.precoMax,
                            precoMin: carta.precoMin,
                            tipo: carta.tipo,
                            dono: jogadorLogado.id,
                            nomeDono: jogadorLogado.nomeClube,
                            listada: 0
                        }

                        new CartaGerada(novaCartaGerada).save().then(() => {

                            console.log("Carta Criada")
                            console.log(` ID ${idCartas}`)
                            console.log(valueCarta)
                            console.log(cartaId)
                            console.log(drops)

                        })

                    })

                }

                jogador.save().then(() => {

                    console.log("Cartas Adicionadas à Conta")

                })

                Carta.find({ "idPifa": { $in: idCartas } }).sort({ overall: -1 }).lean().then((cartasGeradas) => {

                    req.flash('success_msg', 'SUCESSO! O pacote foi aberto...')
                    res.render("jogador/drops", { cartasGeradas: cartasGeradas, jogador: jogadorLogado })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                    res.redirect("/jogador/loja")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                res.redirect("/jogador/loja")

            })


        })

    } else {

        req.flash('error_msg', 'ERRO! Dinheiro Insuficiente')
        res.redirect("/jogador/loja")

    }

})

router.post("/bronzePack", (req, res) => {

    const jogadorLogado = {
        id: req.user.id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,

    }

    if (jogadorLogado.dinheiro >= 500) {

        jogadorLogado.dinheiro -= 500

        Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

            jogador.dinheiro = jogador.dinheiro - 500
            jogador.cartas = jogador.cartas + 6

            Carta.find({ $and: [{ tipo: { $in: ["bronzeRaro", "bronze"] } }, { overall: { $in: [56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66] } }] }).lean().then((cartas) => {

                var drops = [] // Aqui serão armazenados todas as opções possíveis de Drops (Cartas, Escudos e Consumíveis);

                cartas.forEach(element => {
                    drops.push(element.idPifa)
                })

                var idCartas = [] // Aqui serão armazenados todos os IDs gerados, que serão relacionados com os ids dos drops

                for (var i = 1; i < 7; i++) { // Quantidade de Drops a serem gerados

                    var cartaId = Math.floor(Math.random() * drops.length) // Gerador de ID
                    var valueCarta = drops[cartaId]
                    idCartas.push(valueCarta)

                    Carta.findOne({ idPifa: valueCarta }).then((carta) => { // Vai encontrar uma carta com o Determinado ID

                        var novaCartaGerada = {
                            nome: carta.nome,
                            clube: carta.clube,
                            liga: carta.liga,
                            nacionalidade: carta.nacionalidade,
                            overall: carta.overall,
                            posicao: carta.posicao,
                            idPifa: carta.idPifa,
                            ritmo: carta.ritmo,
                            finalizacao: carta.finalizacao,
                            passe: carta.passe,
                            drible: carta.drible,
                            defesa: carta.defesa,
                            fisico: carta.fisico,
                            fotoCarta: carta.fotoCarta,
                            precoMax: carta.precoMax,
                            precoMin: carta.precoMin,
                            tipo: carta.tipo,
                            dono: jogadorLogado.id,
                            nomeDono: jogadorLogado.nomeClube,
                            listada: 0
                        }

                        new CartaGerada(novaCartaGerada).save().then(() => {

                            console.log("Carta Criada")

                        })

                    })

                }

                jogador.save().then(() => {

                    console.log("Cartas Adicionadas à Conta")

                })

                Carta.find({ "idPifa": { $in: idCartas } }).sort({ overall: -1 }).lean().then((cartasGeradas) => {

                    req.flash('success_msg', 'SUCESSO! O pacote foi aberto...')
                    res.render("jogador/drops", { cartasGeradas: cartasGeradas, jogador: jogadorLogado })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                    res.redirect("/jogador/loja")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível abrir o pacote...')
                res.redirect("/jogador/loja")

            })


        })

    } else {

        req.flash('error_msg', 'ERRO! Dinheiro Insuficiente')
        res.redirect("/jogador/loja")

    }

})

router.get("/drops", (req, res) => {

    res.render("jogador/drops")

})

router.get("/mercado", (req, res) => {

    const jogadorLogado = {
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,

    }

    CartaGerada.find({ listada: 1 }).lean().then((cartas) => {
        res.render("jogador/mercado", { jogador: jogadorLogado, cartas: cartas })
    })


})

router.get("/meuClube", (req, res) => {


    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    var qtdAmigos = []

    var str = jogadorLogado.amigos.split(" ")

    str.forEach(amigo => {

        if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
            console.log("Amigo Invalido")
        } else {
            qtdAmigos.push(amigo)
        }

    })

    res.render("jogador/meuClube", { jogador: jogadorLogado, amigos: qtdAmigos })

})

router.get("/minhasCartas", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }] }).sort({ overall: -1 }).lean().then((cartas) => {

        req.flash('success_msg', 'Suas Cartas foram encontradas com Sucesso! :D')
        res.render("jogador/minhasCartas", { cartas: cartas, jogador: jogadorLogado })

    }).catch((erro) => {

        req.flash('error_msg', 'Houve um erro ao encontrar as suas cartas! :C')
        res.redirect("/jogador/meuClube")

    })

})

router.get("/listarCarta/:id", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    CartaGerada.findOne({ _id: req.params.id }).lean().then((carta) => {

        res.render("jogador/listar-carta", { carta: carta, jogador: jogadorLogado })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível listar a carta...')
        res.redirect("/jogador/meuClube")

    })

})

router.post("/listarCarta/listar", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    CartaGerada.findOne({ _id: req.body.id }).then((carta) => {

        carta.listada = 1,
            carta.valorVenda = req.body.valorVenda

        carta.save().then(() => {

            Lineup.find({ dono: jogadorLogado.id }).then((elencos) => {
                console.log(`ELENCOS => ${elencos}`)

                elencos.forEach(elenco => {

                    console.log(`ELENCO => ${elenco}`)

                    if (elenco.carta1 == `${carta.fotoCarta}` || elenco.IDcarta1 == carta._id) {
                        elenco.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta1 = ""
                    }
                    if (elenco.carta2 == `${carta.fotoCarta}` || elenco.IDcarta2 == carta._id) {
                        elenco.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta2 = ""
                    }
                    if (elenco.carta3 == `${carta.fotoCarta}` || elenco.IDcarta3 == carta._id) {
                        elenco.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta3 = ""
                    }
                    if (elenco.carta4 == `${carta.fotoCarta}` || elenco.IDcarta4 == carta._id) {
                        elenco.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta4 = ""
                    }
                    if (elenco.carta5 == `${carta.fotoCarta}` || elenco.IDcarta5 == carta._id) {
                        elenco.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta5 = ""
                    }
                    if (elenco.carta6 = `${carta.fotoCarta}` || elenco.IDcarta6 == carta._id) {
                        elenco.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta6 = ""
                    }
                    if (elenco.carta7 == `${carta.fotoCarta}` || elenco.IDcarta7 == carta._id) {
                        elenco.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta7 = ""
                    }
                    if (elenco.carta8 == `${carta.fotoCarta}` || elenco.IDcarta8 == carta._id) {
                        elenco.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta8 = ""
                    }
                    if (elenco.carta9 == `${carta.fotoCarta}` || elenco.IDcarta9 == carta._id) {
                        elenco.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta9 = ""
                    }
                    if (elenco.carta10 == `${carta.fotoCarta}` || elenco.IDcarta10 == carta._id) {
                        elenco.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta10 = ""
                    }
                    if (elenco.carta11 == `${carta.fotoCarta}` || elenco.IDcarta11 == carta._id) {
                        elenco.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                        elenco.IDcarta11 = ""
                    }

                    elenco.save()

                })

                Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

                    if (jogador.cartas > 0) {

                        jogador.cartas = jogador.cartas - 1
                        jogador.save().then(() => {

                            req.flash('success_msg', 'SUCESSO! A carta foi listada...')
                            res.redirect("/jogador/minhasCartas")

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Houve um erro ao salvar as alterações no perfil do jogador...')
                            res.redirect("/jogador/minhasCartas")

                        })

                    } else {

                        jogador.cartas = jogador.cartas - 0
                        jogador.save().then(() => {

                            req.flash('success_msg', 'SUCESSO! A carta foi listada...')
                            res.redirect("/jogador/minhasCartas")

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Houve um erro ao salvar as alterações no perfil do jogador...')
                            res.redirect("/jogador/minhasCartas")

                        })

                    }

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Houve um erro ao alterar a quantidade de cartas do jogador...')
                    res.redirect("/jogador/minhasCartas")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Essa carta já utilizada em um elenco ativo')
                res.redirect("/jogador/minhasCartas")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível salvar as configurações de listagem.')
            res.redirect("/jogador/minhasCartas")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar a carta em seu banco de dados.')
        res.redirect("/jogador/minhasCartas")

    })

})

router.post("/comprarCarta", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    CartaGerada.findOne({ _id: req.body.id }).then((carta) => { // ID da carta

        if (jogadorLogado.dinheiro >= carta.valorVenda) {

            carta.listada = 0

            Jogador.findOne({ _id: carta.dono }).then((vendedor) => {

                vendedor.dinheiro = vendedor.dinheiro + carta.valorVenda
                vendedor.save()

                Jogador.findOne({ _id: jogadorLogado.id }).then((comprador) => {

                    comprador.dinheiro = comprador.dinheiro - carta.valorVenda
                    comprador.save()

                    carta.dono = comprador.id
                    carta.save()

                    req.flash('success_msg', 'SUCESSO! Carta comprada com sucesso!')
                    res.redirect("/jogador/mercado")

                }).catch((erro) => {


                    req.flash('error_msg', 'Não foi possível encontrar o comprador...')
                    res.redirect("/jogador/mercado")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'Não foi possível obter o valor da carta...')
                res.redirect("/jogador/mercado")

            })

        } else {

            req.flash('error_msg', 'ERRO! Dinheiro Insuficiente...')
            res.redirect("/jogador/mercado")

        }

    }).catch((erro) => {

        req.flash('error_msg', 'Não foi possível trocar a carta...')
        res.redirect("/jogador/mercado")

    })

})

router.get("/amigos", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    var amigos = []

    var amigosSeparados = jogadorLogado.amigos.split(" ")
    amigosSeparados.forEach(amigo => {
        if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
            console.log("Amigo Invalido")
        } else {
            amigos.push(amigo)
        }
    })

    Jogador.find({ "_id": { $in: amigos } }).lean().then((amigos) => {

        req.flash('success_msg', 'SUCESSO, Amigos Encontrados')
        res.render("jogador/amigos", { jogador: jogadorLogado, amigos: amigos })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar os amigos...')
        res.render("jogador/amigos", { jogador: jogadorLogado })

    })

})

router.get("/amigosPendentes", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    var amigosPendentes = []

    var convites = jogadorLogado.amigosPendentes.split(" ")
    convites.forEach(convite => {

        if (convite == 0 || convite == null || convite == undefined || convite == "") {
            console.log("Amigo Invalido")
        } else {
            amigosPendentes.push(convite)
        }

    })

    Jogador.find({ "_id": { $in: amigosPendentes } }).lean().then((convites) => {

        res.render("jogador/amigosPendentes", { jogador: jogadorLogado, convites: convites })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar os convites de Amizade...')
        res.redirect('/jogador/amigos')

    })


})

router.get("/adicionarAmigos", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.find({ "_id": { $ne: jogadorLogado.id } }).lean().then((jogadores) => {

        res.render("jogador/adicionarAmigos", { jogador: jogadorLogado, jogadores: jogadores })

    })

})

router.post("/adicionarAmigos/adicionar", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.findOne({ _id: req.body.id }).then((jogador) => {

        var str = jogador.amigosPendentes
        var str2 = jogador.amigos

        if (str.includes(jogadorLogado.id) || str2.includes(jogadorLogado.id)) {

            req.flash('error_msg', 'ERRO! Não é possível adicionar o mesmo amigo duas vezes...')
            res.redirect("/jogador/adicionarAmigos")

        } else {

            jogador.convitesPendentes = jogador.convitesPendentes + 1
            jogador.amigosPendentes = jogador.amigosPendentes + `${jogadorLogado.id} `

            jogador.save().then(() => {

                req.flash('success_msg', 'SUCESSO! O Convite de Amizade foi enviado...')
                res.redirect("/jogador/adicionarAmigos")

            })

        }

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível enviar o convite de Amizade...')
        res.redirect("/jogador/adicionarAmigos")

    })

})

router.post("/adicionarAmigos/deletar", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => { // Ta vindo o ID do teste no caso

        var amigos = []

        var amigosSeparados = jogador.amigos.split(" ")
        amigosSeparados.forEach(amigo => {

            if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
                console.log("Amigo Invalido")
            } else {
                amigos.push(amigo)
            }

        })

        var amigoAtual = req.body.id // Vai retornar o ID do cara que mandou o convite
        var indice = amigos.indexOf(amigoAtual)

        amigos.splice(indice, 1)

        jogador.amigos = amigos.join(" ")
        jogador.save()

        Jogador.findOne({ _id: req.body.id }).then((jogador2) => {

            var amigos = []

            var amigosSeparados = jogador2.amigos.split(" ")
            amigosSeparados.forEach(amigo => {

                if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
                    console.log("Amigo Invalido")
                } else {
                    amigos.push(amigo)
                }

            })

            var amigoAtual = jogadorLogado.id
            var indice = amigos.indexOf(amigoAtual)

            amigos.splice(indice, 1)

            jogador2.amigos = amigos.join(" ")
            jogador2.save().then(() => {

                req.flash('success_msg', 'SUCESSO! Você desfez a amizade.')
                res.redirect("/jogador/amigos")

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível deletar o Amigo.')
                res.redirect("/jogador/amigos")

            })

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Amigo não Encontrado.')
        res.redirect("/jogador/amigos")

    })

})

router.post("/adicionarAmigos/rejeitarConvite", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

        jogador.convitesPendentes -= 1

        var amigos = []

        var amigosSeparados = jogador.amigosPendentes.split(" ")
        amigosSeparados.forEach(amigo => {

            if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") {
                console.log("Amigo Invalido")
            } else {
                amigos.push(amigo)
            }

        })

        var amigoAtual = req.body._id // Vai retornar o ID do cara que mandou o convite
        var indice = amigos.indexOf(amigoAtual)

        amigos.splice(indice, 1)

        jogador.amigosPendentes = amigos.join(" ")
        jogador.save().then(() => {

            req.flash('success_msg', 'SUCESSO! Convite rejeitado')
            res.redirect("/jogador/amigos")

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível rejeitar o convite...')
            res.redirect("/jogador/amigos")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar esse convite em sua conta...')
        res.redirect("/jogador/amigos")

    })

})

router.post("/adicionarAmigos/aceitarConvite", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

        jogador.amigos += `${req.body.id} `

        jogador.convitesPendentes -= 1

        var amigos = []

        var amigosSeparados = jogador.amigosPendentes.split(" ") // Vai separar todos os amigos pelo espaço
        amigosSeparados.forEach(amigo => {

            if (amigo == 0 || amigo == null || amigo == undefined || amigo == "") { // Se não for vazio vai gerar um Array
                console.log("Amigo Invalido")
            } else {
                amigos.push(amigo)
            }

        })

        var amigoAtual = req.body._id // Vai retornar o ID do cara que mandou o convite
        var indice = amigos.indexOf(amigoAtual) // Procurar qual é o index do cara que mando o convite

        amigos.splice(indice, 1) // Vai tirar o cara dos pendentes da lista

        jogador.amigosPendentes = amigos.join(" ") // Vai refazer o array antigo sem o pendente anterior 
        jogador.save()

        Jogador.findOne({ _id: req.body.id }).then((amigo) => {

            amigo.amigos += `${jogadorLogado.id}`
            amigo.save().then(() => {

                req.flash('success_msg', 'SUCESSO! Convite Aceito.')
                res.redirect("/jogador/amigos")

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível aceitar o convite...')
                res.redirect("/jogador/amigos")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível sincronizar o convite...')
            res.redirect("/jogador/amigos")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar esse convite em sua conta...')
        res.redirect("/jogador/amigos")

    })

})

router.get("/editarEscudo/:id", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    var escudosDisponiveis = []

    Jogador.findOne({ _id: jogadorLogado.id }).lean().then((jogadorLogado) => {

        var escudosSeparados = jogadorLogado.escudos.split(" ")
        escudosSeparados.forEach(escudo => {

            escudosDisponiveis.push({ escudo: escudo })

        })

        res.render("jogador/edit-escudo", { jogador: jogadorLogado, escudos: escudosDisponiveis })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível carregar os escudos...')
        res.redirect("/jogador/meuClube")

    })

})

router.post("/editarEscudo", (req, res) => {

    Jogador.findOne({ _id: req.body.id }).then((jogador) => {

        jogador.escudo = req.body.escudo

        jogador.save().then(() => {

            req.flash('success_msg', 'SUCESSO! O seu escudo atual foi alterado...')
            res.redirect("/jogador/meuClube")

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível alterar o seu escudo...')
            res.redirect("/jogador/meuClube")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Houve um problema ao alterar o escudo...')
        res.redirect("/jogador/meuClube")

    })

})

router.get("/minhasEscalacoes", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

        console.log("Jogador Encontrado")

        Lineup.find({ dono: jogador._id }).lean().then((escalacao) => {

            res.render("jogador/minhasEscalacoes", { escalacao: escalacao, jogador: jogadorLogado })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar nenhuma escalação...')
            res.redirect("/jogador/minhasEscalacoes")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar nenhuma escalação...')
        res.redirect("/jogador/minhasEscalacoes")

    })

})

router.get("/avisoEscalacao", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    res.render("jogador/avisoEscalacao", { jogador: jogadorLogado })

})

router.get("/criarEscalacao", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    res.render("jogador/criarEscalacao", { jogador: jogadorLogado })

})

router.post("/criarEscalacao/novo", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos,
        linesCriadas: req.user.linesCriadas

    }

    Jogador.findOne({ _id: req.body.id }).then((jogador) => {

        if (req.body.nomeLineup.length >= 3 && req.body.nomeLineup.length <= 40) {

            if (jogadorLogado.linesCriadas == 0) {

                var novoElenco = ({

                    nome: req.body.nomeLineup,
                    forca: 0,
                    carta1: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta2: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta3: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta4: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta5: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta6: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta7: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta8: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta9: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta10: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta11: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    IDcarta1: "",
                    IDcarta2: "",
                    IDcarta3: "",
                    IDcarta4: "",
                    IDcarta5: "",
                    IDcarta6: "",
                    IDcarta7: "",
                    IDcarta8: "",
                    IDcarta9: "",
                    IDcarta10: "",
                    IDcarta11: "",
                    dono: jogadorLogado.id,
                    titular: 1
    
                })

            } else {

                var novoElenco = ({

                    nome: req.body.nomeLineup,
                    forca: 0,
                    carta1: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta2: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta3: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta4: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta5: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta6: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta7: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta8: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta9: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta10: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    carta11: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png",
                    IDcarta1: "",
                    IDcarta2: "",
                    IDcarta3: "",
                    IDcarta4: "",
                    IDcarta5: "",
                    IDcarta6: "",
                    IDcarta7: "",
                    IDcarta8: "",
                    IDcarta9: "",
                    IDcarta10: "",
                    IDcarta11: "",
                    dono: jogadorLogado.id,
                    titular: 0
    
                })

            }

            new Lineup(novoElenco).save().then(() => {

                console.log("Line Criada")

                Jogador.findOne({_id: jogadorLogado.id}).then((jogador) => {

                    jogador.linesCriadas += 1
                    jogador.save().then(() => {

                        req.flash('success_msg', 'SUCESSO! O Elenco foi criado...')
                        res.redirect("/jogador/minhasEscalacoes")

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Erro Interno ao salvar o a Line Criada.')
                        res.redirect("/jogador/criarEscalacao")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Erro Interno ao encontrar o usuário atual.')
                    res.redirect("/jogador/criarEscalacao")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Erro Interno ao salvar o Elenco.')
                res.redirect("/jogador/criarEscalacao")

            })

        } else {

            req.flash('error_msg', 'ERRO! Nome Inválido')
            res.redirect("/jogador/criarEscalacao")

        }

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Erro ao Adicionar o Elenco à sua conta...')
        res.redirect("/jogador/criarEscalacao")

    })

})

router.post("/deletarEscalacao", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Lineup.deleteOne({ _id: req.body.id }).then(() => {

        Jogador.findOne({_id: jogadorLogado.id}).then((jogador) => {

            jogador.linesCriadas -= 1
            jogador.save().then(() => {

                req.flash('success_msg', 'SUCESSO! o Elenco foi deletado.')
                res.redirect("/jogador/minhasEscalacoes")

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível ao relacionar o elenco ao jogador...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar o jogador atual...')
            res.redirect("/jogador/minhasEscalacoes")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível deletar o Elenco...')
        res.redirect("/jogador/minhasEscalacoes")

    })

})

router.post("/favoritar", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Lineup.findOne({ $and: [{ dono: jogadorLogado.id }, { titular: 1 }] }).then((favoritaAtual) => {

        favoritaAtual.titular = 0

        Lineup.findOne({ _id: req.body.id }).then((novaFavorita) => {

            if (novaFavorita.carta1 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta2 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta3 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta4 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta5 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta6 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta7 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta8 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta9 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta10 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.carta11 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && novaFavorita.IDcarta1 != "" && novaFavorita.IDcarta2 != "" && novaFavorita.IDcarta3 != "" && novaFavorita.IDcarta4 != "" && novaFavorita.IDcarta5 != "" && novaFavorita.IDcarta6 != "" && novaFavorita.IDcarta7 != "" && novaFavorita.IDcarta8 != "" && novaFavorita.IDcarta9 != "" && novaFavorita.IDcarta10 != "" && novaFavorita.IDcarta11 != "") {

                novaFavorita.titular = 1

                favoritaAtual.save().then(() => {

                    novaFavorita.save().then(() => {

                        req.flash('success_msg', 'SUCESSO! o Elenco se tornou favorito.')
                        res.redirect("/jogador/minhasEscalacoes")

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível favoritar o Elenco.')
                        res.redirect("/jogador/minhasEscalacoes")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível abrir o Elenco.')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            } else {

                req.flash('error_msg', 'ERRO! Elenco Incompleto.')
                res.redirect("/jogador/minhasEscalacoes")

            }

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Nenhuma Escalação foi Selecionada.')
            res.redirect("/jogador/minhasEscalacoes")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Você não possui escalações favoritas.')
        res.redirect("/jogador/minhasEscalacoes")

    })

})

router.get("/escalacao/:id", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

        Lineup.findOne({ _id: req.params.id }).lean().then((escalacao) => { // Usa o lean quando no handlebars tem que pegar uma propriedade do item do FIND

            res.render("jogador/escalacao", { jogador: jogadorLogado, escalacao: escalacao })

        })

    })

})

router.get("/escalacao/:escalacao/:id/:carta", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Lineup.findOne({ _id: req.params.escalacao }).lean().then((escalacao) => {

        Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

            if (req.params.carta == "carta1") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["PontaEsquerda", "AlaEsquerdo", "Atacante"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta2") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["Atacante", "SegundoAtacante"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta3") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["PontaDireita", "AlaDireito", "Atacante"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta4") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["MeiaCentral", "Volante", "MeiaAtacante"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta5") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["MeiaCentral", "Volante", "MeiaAtacante", "SegundoAtacante"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta6") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["MeiaCentral", "Volante", "MeiaAtacante"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta7") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["LateralEsquerdo", "AlaDireito"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta8") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: "Zagueiro" }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta9") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: "Zagueiro" }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta10") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: ["LateralDireito", "AlaDireito"] }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (req.params.carta == "carta11") {

                CartaGerada.find({ $and: [{ dono: jogadorLogado.id }, { listada: 0 }, { posicao: "Goleiro" }] }).sort({ overall: -1 }).lean().then((cartas) => {

                    req.flash('success_msg', 'Cartas Encontradas...')
                    res.render("jogador/escolherCarta", { jogador: jogadorLogado, cartas: cartas, carta: req.params.carta, escalacao: escalacao })

                })

            }

            if (!req.params.carta || req.params.carta == null || req.params.carta == undefined) {

                req.flash('error_msg', 'ERRO! Não foi possível escolher um jogador...')
                res.redirect("/jogador/escalacao")

            }

        })

    })

})

router.post("/escalacao/:escalacao/:id/:carta", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Lineup.findOne({ $and: [{ _id: req.params.escalacao }, { dono: jogadorLogado.id }] }).then((escalacao) => {

        if (req.params.carta == "carta1") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta1 = `${carta.fotoCarta}`
                escalacao.IDcarta1 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta2") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta2 = `${carta.fotoCarta}`
                escalacao.IDcarta2 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta3") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta3 = `${carta.fotoCarta}`
                escalacao.IDcarta3 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta4") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta4 = `${carta.fotoCarta}`
                escalacao.IDcarta4 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta5") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta5 = `${carta.fotoCarta}`
                escalacao.IDcarta5 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta6") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta6 = `${carta.fotoCarta}`
                escalacao.IDcarta6 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta7") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta7 = `${carta.fotoCarta}`
                escalacao.IDcarta7 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta8") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta8 = `${carta.fotoCarta}`
                escalacao.IDcarta8 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta9") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta9 = `${carta.fotoCarta}`
                escalacao.IDcarta9 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta10") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta10 = `${carta.fotoCarta}`
                escalacao.IDcarta10 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

        if (req.params.carta == "carta11") {

            CartaGerada.findOne({ _id: req.body.idCarta }).then((carta) => {

                escalacao.carta11 = `${carta.fotoCarta}`
                escalacao.IDcarta11 = `${carta._id}`

                escalacao.save().then(() => {

                    req.flash('success_msg', 'SUCESSO! a Carta foi Selecionada.')
                    res.redirect("/jogador/minhasEscalacoes")

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível salvar a Carta...')
                    res.redirect("/jogador/minhasEscalacoes")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a Carta...')
                res.redirect("/jogador/minhasEscalacoes")

            })

        }

    })

})

router.get("/pvpOffline/escolherElenco", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos
    }

    Jogador.findOne({ _id: jogadorLogado.id }).then((jogador) => {

        Lineup.find({ dono: jogador._id }).lean().then((escalacao) => {

            var escalacoesDisponiveis = []

            escalacao.forEach(line => {

                if (line.carta1 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta2 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta3 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta4 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta5 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta6 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta7 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta8 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta9 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta10 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.carta11 != "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png" && line.IDcarta1 != "" && line.IDcarta2 != "" && line.IDcarta3 != "" && line.IDcarta4 != "" && line.IDcarta5 != "" && line.IDcarta6 != "" && line.IDcarta7 != "" && line.IDcarta8 != "" && line.IDcarta9 != "" && line.IDcarta10 != "" && line.IDcarta11 != "") {

                    escalacoesDisponiveis.push(line)

                }

            })

            if (!escalacoesDisponiveis || escalacoesDisponiveis == null || escalacoesDisponiveis == undefined || escalacoesDisponiveis == 0 || escalacoesDisponiveis == "") {

                req.flash('error_msg', 'ERRO! Você não tem nenhuma escalação completa...')
                res.redirect("/")

            }

            console.log(`${escalacao}`)
            console.log(`${escalacoesDisponiveis}`)
            res.render("jogador/escalacoesOffline", { escalacao: escalacoesDisponiveis, jogador: jogadorLogado })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar nenhuma escalação, cria uma!...')
            res.redirect("/")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível encontrar nenhuma escalação, crie uma!...')
        res.redirect("/")

    })

})

router.get("/pvpOffline/encontrarAdversario/:escalacao", (req, res) => { // Aqui vai renderizar aquele menu de aceitar o cara

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos
    }

    console.log("CHEGOU NO ENCONTRAR ADVERSARIO")

    Lineup.findOne({ _id: req.params.escalacao }).then((escalacao) => {

        Jogador.find({ novo: 1 }).lean().then((jogadores) => {

            var jogadoresDisponiveis = []

            jogadores.forEach(jogador => {

                if (jogador.nomeClube != jogadorLogado.nomeClube) {

                    console.log(`${jogador._id} => ${jogadorLogado.id}`)

                    jogadoresDisponiveis.push(jogador.nomeClube)

                }

            })

            var idAdversario = Math.floor(Math.random() * jogadoresDisponiveis.length)
            var Adversario = jogadoresDisponiveis[idAdversario]

            console.log(`JOGADORES => ${jogadoresDisponiveis}`)
            console.log(`Adversário => ${Adversario}`)

            Jogador.findOne({ nomeClube: Adversario }).lean().then((oponente) => {

                var LineupID = getPassword()

                var partidaID = getPassword()

                var novaLine = {
                    nome: escalacao.nome,
                    forca: escalacao.forca,
                    carta1: escalacao.carta1,
                    carta2: escalacao.carta2,
                    carta3: escalacao.carta3,
                    carta4: escalacao.carta4,
                    carta5: escalacao.carta5,
                    carta6: escalacao.carta6,
                    carta7: escalacao.carta7,
                    carta8: escalacao.carta8,
                    carta9: escalacao.carta9,
                    carta10: escalacao.carta10,
                    carta11: escalacao.carta11,
                    IDcarta1: escalacao.IDcarta1,
                    IDcarta2: escalacao.IDcarta2,
                    IDcarta3: escalacao.IDcarta3,
                    IDcarta4: escalacao.IDcarta4,
                    IDcarta5: escalacao.IDcarta5,
                    IDcarta6: escalacao.IDcarta6,
                    IDcarta7: escalacao.IDcarta7,
                    IDcarta8: escalacao.IDcarta8,
                    IDcarta9: escalacao.IDcarta9,
                    IDcarta10: escalacao.IDcarta10,
                    IDcarta11: escalacao.IDcarta11,
                    dono: escalacao.dono,
                    titular: escalacao.titular,
                    idLinePVP: LineupID
                }

                var novaPartida = {
                    idPartida: partidaID,
                    jogador: jogadorLogado.id,
                    oponente: oponente._id,

                }

                new Partida(novaPartida).save().then(() => {

                    new LinePVP(novaLine).save().then(() => {

                        LinePVP.findOne({ idLinePVP: LineupID }).then((escalacaoNova) => {

                            console.log(escalacaoNova)

                            console.log(`OPONENTE => ${oponente.nome}`)

                            Partida.findOne({ idPartida: partidaID }).lean().then((partida) => {

                                console.log(partida)

                                res.render("jogador/aceitarPvpOff", { jogador: jogadorLogado, adversario: oponente, lineup: escalacaoNova._id, partida: partida })

                            }).catch((erro) => {

                                console.log(erro)
                                req.flash('error_msg', 'ERRO! Não foi possível carregar a partida...')
                                res.redirect("/")

                            })

                        }).catch((erro) => {

                            req.flash('error_msg', 'ERRO! Não foi possível carregar seus jogadores...')
                            res.redirect("/")

                        })

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível carregar sua escalação...')
                        res.redirect("/")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível gerar a nova partida...')
                    res.redirect("/")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar um adversário...')
                res.redirect("/")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar nenhum jogador...')
            res.redirect("/")

        })


    })

})

router.get("/PvpOffline/meuTime/:partida/:escalacao", (req, res) => { // Aqui vem o cara pq ja aceitou

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Jogador.findOne({ _id: jogadorLogado.id }).then((jogadorAtual) => {

        Partida.findOne({ _id: req.params.partida }).then((partida) => {

            Jogador.findOne({ _id: partida.oponente }).lean().then((oponente) => {

                Lineup.findOne({ $and: [{ dono: oponente._id }, { titular: 1 }] }).lean().then((escalacaoOponente) => {

                    partida.lineOponente = escalacaoOponente._id
                    console.log(`ESCALACAO DO OPONENTE => ${escalacaoOponente.nome}`)

                    LinePVP.findOne({ _id: req.params.escalacao }).lean().then((escalacaoMinha) => {

                        partida.lineMinha = escalacaoMinha._id

                        partida.save().then(() => {

                            console.log(`MINHA ESCALACAO => ${escalacaoMinha.nome}`)

                            if (partida.rodada1 != "Não Jogado" & partida.rodada2 != "Não Jogado" & partida.rodada3 != "Não Jogado" & partida.rodada4 != "Não Jogado" & partida.rodada5 != "Não Jogado" & partida.rodada6 != "Não Jogado" & partida.rodada7 != "Não Jogado" & partida.rodada8 != "Não Jogado" & partida.rodada9 != "Não Jogado" & partida.rodada10 != "Não Jogado" & partida.rodada11 != "Não Jogado") {

                                req.flash('success_msg', 'Partida Finalizada')

                                if (partida.ptsJogador > partida.ptsOponente) {

                                    var resultado = ""
                                    var pontos = ""
                                    var ranking = ""

                                    partida.ganhador = jogadorLogado.nomeClube
                                    console.log(`${jogadorLogado.nomeClube} ganhou = ${partida.ptsJogador} x ${partida.ptsOponente}`)

                                    if (jogadorAtual.ranking == "Bronze") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 125
                                            pontos = "+125 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 150
                                            pontos = "+150 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 200
                                            pontos = "+200 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 250
                                            pontos = "+250 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 300
                                            pontos = "+300 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 325
                                            pontos = "+325 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 350
                                            pontos = "+350 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Prata") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 80
                                            pontos = "+80 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 150
                                            pontos = "+150 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 175
                                            pontos = "+175 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 225
                                            pontos = "+225 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 250
                                            pontos = "+250 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 300
                                            pontos = "+300 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 325
                                            pontos = "+325 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Ouro") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 65
                                            pontos = "+65 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 80
                                            pontos = "+80 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 125
                                            pontos = "+125 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 165
                                            pontos = "+165 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 200
                                            pontos = "+200 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 250
                                            pontos = "+250 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 300
                                            pontos = "+300 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Cristal") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 50
                                            pontos = "+50 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 65
                                            pontos = "+65 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 80
                                            pontos = "+80 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 125
                                            pontos = "+125 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 150
                                            pontos = "+150 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 200
                                            pontos = "+200 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 250
                                            pontos = "+250 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Mestre") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 30
                                            pontos = "+30 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 50
                                            pontos = "+50 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 65
                                            pontos = "+65 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 80
                                            pontos = "+80 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 125
                                            pontos = "+125 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 150
                                            pontos = "+150 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 200
                                            pontos = "+200 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking = "Campeão") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 15
                                            pontos = "+15 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 30
                                            pontos = "+30 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 50
                                            pontos = "+50 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 65
                                            pontos = "+65 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 80
                                            pontos = "+80 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 125
                                            pontos = "+125 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 150
                                            pontos = "+150 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking = "Titan") {
                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 10
                                            pontos = "+10 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 25
                                            pontos = "+25 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 35
                                            pontos = "+35 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 50
                                            pontos = "+50 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 65
                                            pontos = "+65 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 80
                                            pontos = "+80 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 125
                                            pontos = "+125 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Lendario") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank += 5
                                            pontos = "+5 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank += 15
                                            pontos = "+15 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank += 25
                                            pontos = "+25 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank += 35
                                            pontos = "+35 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank += 50
                                            pontos = "+50 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank += 65
                                            pontos = "+65 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank += 80
                                            pontos = "+80 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank += 100
                                            pontos = "+100 Pontos"
                                        }

                                    }

                                    jogadorAtual.jogosGanhos += 1
                                    resultado = "Você Ganhou!"

                                }

                                if (partida.ptsJogador < partida.ptsOponente) {

                                    partida.ganhador = oponente.nomeClube
                                    console.log(`${oponente.nomeClube} ganhou de voce = ${partida.ptsJogador} x ${partida.ptsOponente}`)
                                    resultado = "Você Perdeu!"

                                    if (jogadorAtual.ranking == "Bronze") {

                                        if (oponente.ranking == "Bronze") {

                                            if (jogadorAtual.ptsRank < 100) {

                                                console.log(`Impossível Tirar Pontos`)

                                            } else {

                                                jogadorAtual.ptsRank -= 100
                                                pontos = "-100 Pontos"

                                            }

                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 80
                                            pontos = "-80 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 60
                                            pontos = "-60 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 50
                                            pontos = "-50 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 40
                                            pontos = "-40 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 25
                                            pontos = "-25 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 10
                                            pontos = "-10 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 5
                                            pontos = "-5 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Prata") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 90
                                            pontos = "-90 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 75
                                            pontos = "-75 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 60
                                            pontos = "-60 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 50
                                            pontos = "-50 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 35
                                            pontos = "-35 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 20
                                            pontos = "-20 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 10
                                            pontos = "-10 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Ouro") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank -= 115
                                            pontos = "-115 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 85
                                            pontos = "-85 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 75
                                            pontos = "-75 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 65
                                            pontos = "-65 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 50
                                            pontos = "-50 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 25
                                            pontos = "-25 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 15
                                            pontos = "-15 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Cristal") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank -= 150
                                            pontos = "-150 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 125
                                            pontos = "-125 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 85
                                            pontos = "-85 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 75
                                            pontos = "-75 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 65
                                            pontos = "-65 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 40
                                            pontos = "-40 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 25
                                            pontos = "-25 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Mestre") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank -= 175
                                            pontos = "-175 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 125
                                            pontos = "-125 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 85
                                            pontos = "-85 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 75
                                            pontos = "-75 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 50
                                            pontos = "-50 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 35
                                            pontos = "-35 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking = "Campeão") {

                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank -= 200
                                            pontos = "-200 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 175
                                            pontos = "-175 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 150
                                            pontos = "-150 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 125
                                            pontos = "-125 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 80
                                            pontos = "-80 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 65
                                            pontos = "-65 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 50
                                            pontos = "-50 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking = "Titan") {
                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank -= 250
                                            pontos = "-250 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 225
                                            pontos = "-225 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 200
                                            pontos = "-200 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 175
                                            pontos = "-175 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 150
                                            pontos = "-150 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 125
                                            pontos = "-125 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 75
                                            pontos = "-75 Pontos"
                                        }

                                    }

                                    if (jogadorAtual.ranking == "Lendario") {
                                        if (oponente.ranking == "Bronze") {
                                            jogadorAtual.ptsRank -= 350
                                            pontos = "-350 Pontos"
                                        }

                                        if (oponente.ranking == "Prata") {
                                            jogadorAtual.ptsRank -= 325
                                            pontos = "-325 Pontos"
                                        }

                                        if (oponente.ranking == "Ouro") {
                                            jogadorAtual.ptsRank -= 275
                                            pontos = "-275 Pontos"
                                        }

                                        if (oponente.ranking == "Cristal") {
                                            jogadorAtual.ptsRank -= 250
                                            pontos = "-250 Pontos"
                                        }

                                        if (oponente.ranking == "Mestre") {
                                            jogadorAtual.ptsRank -= 200
                                            pontos = "-200 Pontos"
                                        }

                                        if (oponente.ranking == "Campeão") {
                                            jogadorAtual.ptsRank -= 165
                                            pontos = "-165 Pontos"
                                        }

                                        if (oponente.ranking == "Titan") {
                                            jogadorAtual.ptsRank -= 125
                                            pontos = "-125 Pontos"
                                        }

                                        if (oponente.ranking == "Lendario") {
                                            jogadorAtual.ptsRank -= 100
                                            pontos = "-100 Pontos"
                                        }

                                    }

                                }

                                if (partida.ptsJogador == partida.ptsOponente) {

                                    partida.ganhador = "Empate"
                                    console.log(`EMPATE`)

                                    resultado = "Você Empatou!"
                                    pontos = `+0 Pontos`

                                }

                                if (jogadorAtual.ptsRank >= 0 && jogadorAtual.ptsRank <= 500) {

                                    jogadorAtual.ranking = "Bronze"
                                    jogadorAtual.logoRanking = "https://cdn.clashwiki.com/wp-content/uploads/BronzeLeague.png"
                                    ranking = "Bronze League"


                                }

                                if (jogadorAtual.ptsRank > 500 && jogadorAtual.ptsRank <= 1000) {

                                    jogadorAtual.ranking = "Prata"
                                    jogadorAtual.logoRanking = "https://cdn.clashwiki.com/wp-content/uploads/SilverLeague.png"
                                    ranking = "Silver League"

                                }

                                if (jogadorAtual.ptsRank > 1000 && jogadorAtual.ptsRank <= 1500) {

                                    jogadorAtual.ranking = "Ouro"
                                    jogadorAtual.logoRanking = "https://cdn.clashwiki.com/wp-content/uploads/GoldLeague.png"
                                    ranking = "Gold League"

                                }

                                if (jogadorAtual.ptsRank > 1500 && jogadorAtual.ptsRank <= 2000) {

                                    jogadorAtual.ranking = "Cristal"
                                    jogadorAtual.logoRanking = "https://cdn.clashwiki.com/wp-content/uploads/CrystalLeague.png"
                                    ranking = "Cristal League"

                                }

                                if (jogadorAtual.ptsRank > 2000 && jogadorAtual.ptsRank <= 3250) {

                                    jogadorAtual.ranking = "Mestre"
                                    jogadorAtual.logoRanking = "https://cdn.clashwiki.com/wp-content/uploads/MasterLeague.png"
                                    ranking = "Master League"

                                }

                                if (jogadorAtual.ptsRank > 3250 && jogadorAtual.ptsRank <= 4250) {

                                    jogadorAtual.ranking = "Campeao"
                                    jogadorAtual.logoRanking = "https://cdn.clashwiki.com/wp-content/uploads/ChampionLeague.png"
                                    ranking = "Champions League"

                                }

                                if (jogadorAtual.ptsRank > 4250 && jogadorAtual.ptsRank <= 5000) {

                                    jogadorAtual.ranking = "Titan"
                                    jogadorAtual.logoRanking = "https://cdn.clashwiki.com/wp-content/uploads/TitanLeague.png"
                                    ranking = "Titan League"

                                }

                                if (jogadorAtual.ptsRank > 5000) {

                                    jogadorAtual.ranking = "Lendario"
                                    jogadorAtual.logoRanking = "https://api-assets.clashofclans.com/leagues/288/R2zmhyqQ0_lKcDR5EyghXCxgyC9mm_mVMIjAbmGoZtw.png"
                                    ranking = "Legendary League"

                                }

                                var logo = jogadorAtual.logoRanking

                                req.flash('success_msg', 'Partida Finalizada')

                                res.render("jogador/recompensasOffline", { jogador: jogadorLogado, escalacao: escalacaoMinha, escalacaoOponente: escalacaoOponente, adversario: oponente, partida: idPartida, ptsJogador: ptsJogador, ptsOponente: ptsOponente, resultado: resultado, pontos: pontos, ranking: ranking, logo: logo })

                                jogadorAtual.save()

                            } else {

                                var idPartida = partida._id
                                var ptsJogador = partida.ptsJogador
                                var ptsOponente = partida.ptsOponente

                                res.render("jogador/PvpOfflineEscalacao", { jogador: jogadorLogado, escalacao: escalacaoMinha, escalacaoOponente: escalacaoOponente, adversario: oponente, partida: idPartida, ptsJogador: ptsJogador, ptsOponente: ptsOponente })

                            }

                        })

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível salvar algumas configurações...')
                        res.redirect("/")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível encontrar a sua escalação...')
                    res.redirect("/")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Não foi possível encontrar a escalação do adversário...')
                res.redirect("/")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar o adversário...')
            res.redirect("/")

        })

    }).catch((erro) => {

        req.flash('error_msg', 'ERRO! Não foi possível carregar a partida...')
        res.redirect("/")


    })

})


router.get("/pvpOffline/escolherCarta/:partida/:carta/:numeroCarta", (req, res) => {

    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    console.log("CHEGOU NO POST")

    console.log(`carta antes => ${req.params.carta}`)

    Partida.findOne({ _id: req.params.partida }).lean().then((partida) => {

        CartaGerada.findOne({ _id: req.params.carta }).lean().then((carta) => {

            console.log(`carta => ${carta._id}`)

            Jogador.findOne({ _id: partida.oponente }).lean().then((oponente) => {

                console.log(`OPONENTE => ${oponente.nome}`)

                Lineup.findOne({ _id: partida.lineOponente }).lean().then((escalacaoOponente) => {

                    console.log(`OPONENTE ESCALACAO => ${escalacaoOponente.nome}`)

                    LinePVP.findOne({ _id: partida.lineMinha }).lean().then((escalacaoMinha) => {

                        console.log(`MINHA ESCALACAO => ${escalacaoMinha.nome}`)

                        var numeroCarta = req.params.numeroCarta
                        res.render("jogador/escolherAtributoOffline", { jogador: jogadorLogado, escalacao: escalacaoMinha, escalacaoOponente: escalacaoOponente, adversario: oponente, carta: carta, numeroCarta: numeroCarta, partida: partida })


                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Não foi possível encontrar a sua escalação...')
                        res.redirect("/")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Não foi possível encontrar a escalação do adversário...')
                    res.redirect("/")

                })

            }).catch((erro) => {

                console.log(erro)
                req.flash('error_msg', 'ERRO! Não foi possível encontrar um adversário...')
                res.redirect("/")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Não foi possível encontrar a carta...')
            res.redirect("/")

        })

    })

})

router.get("/pvpOffline/escolherCarta/:partida/:carta/:numeroCarta/:atributo", (req, res) => { // Depois que o cara escolher o atributo


    const jogadorLogado = {
        id: req.user._id,
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        nomeClube: req.user.nomeClube,
        ptsXP: req.user.ptsXP,
        lvlXP: req.user.lvlXP,
        dinheiro: req.user.dinheiro,
        escudo: req.user.escudo,
        amigos: req.user.amigos,
        logado: req.user.logado,
        cartas: req.user.cartas,
        escudos: req.user.escudos,
        convitesPendentes: req.user.convitesPendentes,
        amigosPendentes: req.user.amigosPendentes,
        novo: req.user.novo,
        logoRanking: req.user.logoRanking,
        ranking: req.user.ranking,
        ptsRanking: req.user.ptsRank,
        jogosGanhos: req.user.jogosGanhos

    }

    Partida.findOne({ _id: req.params.partida }).then((partida) => {

        Jogador.findOne({ _id: jogadorLogado.id }).lean().then((jogador) => {

            console.log("SUCESSO AO ENCONTRAR O JOGADOR ATUAL")

            Jogador.findOne({ _id: partida.oponente }).lean().then((adversario) => {

                console.log(`SUCESSO AO ENCONTRAR O OPONENTE => ${adversario.nomeClube}`)

                LinePVP.findOne({ _id: partida.lineMinha }).then((minhaEscalacao) => {

                    console.log(`SUCESSO AO ENCONTRAR A SUA LINEUP => ${minhaEscalacao.nome}`)

                    Lineup.findOne({ _id: partida.lineOponente }).lean().then((oponenteEscalacao) => {

                        console.log(`SUCESSO AO ENCONTRAR A LINEUP DO CARA => ${oponenteEscalacao.nome}`)

                        CartaGerada.findOne({ _id: req.params.carta }).lean().then((minhaCarta) => {

                            console.log(`SUCESSO CARTA ENCONTRADA => ${minhaCarta.nome}`)

                            var idCartaOponente = ""

                            if (req.params.numeroCarta == "carta1") {

                                idCartaOponente = oponenteEscalacao.IDcarta1
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta2") {

                                idCartaOponente = oponenteEscalacao.IDcarta2
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta3") {

                                idCartaOponente = oponenteEscalacao.IDcarta3
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta4") {

                                idCartaOponente = oponenteEscalacao.IDcarta4
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta5") {

                                idCartaOponente = oponenteEscalacao.IDcarta5
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta6") {

                                idCartaOponente = oponenteEscalacao.IDcarta6
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta7") {

                                idCartaOponente = oponenteEscalacao.IDcarta7
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta8") {

                                idCartaOponente = oponenteEscalacao.IDcarta8
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta9") {

                                idCartaOponente = oponenteEscalacao.IDcarta9
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta10") {

                                idCartaOponente = oponenteEscalacao.IDcarta10
                                console.log(`${idCartaOponente}`)

                            }

                            if (req.params.numeroCarta == "carta11") {

                                idCartaOponente = oponenteEscalacao.IDcarta11
                                console.log(`${idCartaOponente}`)

                            }

                            CartaGerada.findOne({ _id: idCartaOponente }).lean().then((oponenteCarta) => {

                                console.log(`SUCESSO CARTA ENCONTRADA => ${oponenteCarta}`)

                                if (req.params.atributo == "ritmo") {

                                    var valor_1 = minhaCarta.ritmo
                                    var valor_2 = oponenteCarta.ritmo

                                    if (valor_1 > valor_2) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Vitória"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Vitória"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Vitória"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Vitória"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Vitória"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Vitória"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Vitória"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Vitória"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Vitória"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Vitória"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Vitória"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsJogador = partida.ptsJogador + 1

                                        req.flash('success_msg', 'Você ganhou')

                                    }

                                    if (valor_2 > valor_1) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Derrota"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Derrota"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Derrota"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Derrota"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Derrota"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Derrota"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Derrota"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Derrota"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Derrota"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Derrota"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Derrota"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsOponente = partida.ptsOponente + 1

                                        req.flash('error_msg', 'Você perdeu')

                                    }

                                    if (valor_1 == valor_2) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Empate"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Empate"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Empate"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Empate"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Empate"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Empate"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Empate"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Empate"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Empate"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Empate"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Empate"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }


                                    }


                                }

                                if (req.params.atributo == "finalizacao") {

                                    var valor_1 = minhaCarta.finalizacao
                                    var valor_2 = oponenteCarta.finalizacao

                                    if (valor_1 > valor_2) {


                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Vitória"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Vitória"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Vitória"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Vitória"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Vitória"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Vitória"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Vitória"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Vitória"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Vitória"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Vitória"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Vitória"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsJogador = partida.ptsJogador + 1

                                        req.flash('success_msg', 'Você ganhou')

                                    }

                                    if (valor_2 > valor_1) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Derrota"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Derrota"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Derrota"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Derrota"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Derrota"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Derrota"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Derrota"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Derrota"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Derrota"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Derrota"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Derrota"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }
                                        partida.ptsOponente = partida.ptsOponente + 1

                                        req.flash('error_msg', 'Você perdeu')

                                    }

                                    if (valor_1 == valor_2) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Empate"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Empate"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Empate"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Empate"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Empate"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Empate"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Empate"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Empate"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Empate"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Empate"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Empate"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        req.flash('success_msg', 'Empate')

                                    }

                                }

                                if (req.params.atributo == "passe") {

                                    var valor_1 = minhaCarta.passe
                                    var valor_2 = oponenteCarta.passe

                                    if (valor_1 > valor_2) {


                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Vitória"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Vitória"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Vitória"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Vitória"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Vitória"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Vitória"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Vitória"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Vitória"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Vitória"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Vitória"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Vitória"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsJogador = partida.ptsJogador + 1

                                        req.flash('success_msg', 'Você ganhou')

                                    }

                                    if (valor_2 > valor_1) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Derrota"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Derrota"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Derrota"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Derrota"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Derrota"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Derrota"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Derrota"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Derrota"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Derrota"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Derrota"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Derrota"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsOponente = partida.ptsOponente + 1

                                        req.flash('error_msg', 'Você perdeu')

                                    }

                                    if (valor_1 == valor_2) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Empate"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Empate"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Empate"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Empate"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Empate"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Empate"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Empate"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Empate"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Empate"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Empate"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Empate"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        req.flash('success_msg', 'Empate')

                                    }

                                }

                                if (req.params.atributo == "drible") {

                                    var valor_1 = minhaCarta.drible
                                    var valor_2 = oponenteCarta.drible

                                    if (valor_1 > valor_2) {


                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Vitória"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Vitória"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Vitória"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Vitória"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Vitória"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Vitória"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Vitória"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Vitória"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Vitória"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Vitória"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Vitória"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsJogador = partida.ptsJogador + 1

                                        req.flash('success_msg', 'Você ganhou')

                                    }

                                    if (valor_2 > valor_1) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Derrota"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Derrota"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Derrota"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Derrota"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Derrota"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Derrota"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Derrota"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Derrota"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Derrota"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Derrota"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Derrota"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }
                                        partida.ptsOponente = partida.ptsOponente + 1

                                        req.flash('error_msg', 'Você perdeu')

                                    }

                                    if (valor_1 == valor_2) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Empate"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Empate"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Empate"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Empate"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Empate"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Empate"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Empate"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Empate"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Empate"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Empate"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Empate"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }
                                        req.flash('success_msg', 'Empate')

                                    }

                                }

                                if (req.params.atributo == "defesa") {

                                    var valor_1 = minhaCarta.defesa
                                    var valor_2 = oponenteCarta.defesa

                                    if (valor_1 > valor_2) {


                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Vitória"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Vitória"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Vitória"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Vitória"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Vitória"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Vitória"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Vitória"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Vitória"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Vitória"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Vitória"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Vitória"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsJogador = partida.ptsJogador + 1

                                        req.flash('success_msg', 'Você ganhou')

                                    }

                                    if (valor_2 > valor_1) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Derrota"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Derrota"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Derrota"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Derrota"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Derrota"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Derrota"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Derrota"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Derrota"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Derrota"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Derrota"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Derrota"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsOponente = partida.ptsOponente + 1

                                        req.flash('error_msg', 'Você perdeu')

                                    }

                                    if (valor_1 == valor_2) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Empate"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Empate"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Empate"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Empate"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Empate"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Empate"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Empate"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Empate"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Empate"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Empate"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Empate"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        req.flash('success_msg', 'Empate')

                                    }

                                }

                                if (req.params.atributo == "fisico") {

                                    var valor_1 = minhaCarta.fisico
                                    var valor_2 = oponenteCarta.fisico

                                    if (valor_1 > valor_2) {


                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Vitória"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Vitória"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Vitória"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Vitória"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Vitória"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Vitória"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Vitória"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Vitória"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Vitória"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Vitória"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Vitória"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsJogador = partida.ptsJogador + 1

                                        req.flash('success_msg', 'Você ganhou')

                                    }

                                    if (valor_2 > valor_1) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Derrota"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Derrota"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Derrota"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Derrota"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Derrota"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Derrota"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Derrota"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Derrota"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Derrota"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Derrota"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Derrota"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        partida.ptsOponente = partida.ptsOponente + 1

                                        req.flash('error_msg', 'Você perdeu')

                                    }

                                    if (valor_1 == valor_2) {

                                        if (req.params.numeroCarta == "carta1") {

                                            partida.rodada1 = "Empate"

                                            minhaEscalacao.carta1 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta1 = ""

                                        }
                                        if (req.params.numeroCarta == "carta2") {

                                            partida.rodada2 = "Empate"

                                            minhaEscalacao.carta2 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta2 = ""

                                        }
                                        if (req.params.numeroCarta == "carta3") {

                                            partida.rodada3 = "Empate"

                                            minhaEscalacao.carta3 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta3 = ""

                                        }
                                        if (req.params.numeroCarta == "carta4") {

                                            partida.rodada4 = "Empate"

                                            minhaEscalacao.carta4 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta4 = ""

                                        }
                                        if (req.params.numeroCarta == "carta5") {

                                            partida.rodada5 = "Empate"

                                            minhaEscalacao.carta5 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta5 = ""

                                        }
                                        if (req.params.numeroCarta == "carta6") {

                                            partida.rodada6 = "Empate"

                                            minhaEscalacao.carta6 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta6 = ""

                                        }
                                        if (req.params.numeroCarta == "carta7") {

                                            partida.rodada7 = "Empate"

                                            minhaEscalacao.carta7 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta7 = ""

                                        }
                                        if (req.params.numeroCarta == "carta8") {

                                            partida.rodada8 = "Empate"

                                            minhaEscalacao.carta8 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta8 = ""

                                        }
                                        if (req.params.numeroCarta == "carta9") {

                                            partida.rodada9 = "Empate"

                                            minhaEscalacao.carta9 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta9 = ""

                                        }
                                        if (req.params.numeroCarta == "carta10") {

                                            partida.rodada10 = "Empate"

                                            minhaEscalacao.carta10 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta10 = ""

                                        }
                                        if (req.params.numeroCarta == "carta11") {

                                            partida.rodada11 = "Empate"

                                            minhaEscalacao.carta11 = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/HD_transparent_picture.png/640px-HD_transparent_picture.png"
                                            minhaEscalacao.IDcarta11 = ""

                                        }

                                        req.flash('success_msg', 'Empate')

                                    }

                                }

                                minhaEscalacao.save().then(() => {

                                    partida.save().then(() => {

                                        res.redirect(`/jogador/PvpOffline/meuTime/${partida._id}/${minhaEscalacao._id}`)

                                    })

                                })


                            })

                        }).catch((erro) => {

                            console.log(erro)
                            req.flash('error_msg', 'ERRO! Houve um erro ao encontrar ao encontrar a sua carta!')
                            res.redirect("/")

                        })

                    }).catch((erro) => {

                        req.flash('error_msg', 'ERRO! Houve um erro ao encontrar a escalação do adversário!')
                        res.redirect("/")

                    })

                }).catch((erro) => {

                    req.flash('error_msg', 'ERRO! Houve um erro ao encontrar a sua escalação!')
                    res.redirect("/")

                })

            }).catch((erro) => {

                req.flash('error_msg', 'ERRO! Houve um erro ao conectar-se com o adversário!')
                res.redirect("/")

            })

        }).catch((erro) => {

            req.flash('error_msg', 'ERRO! Houve um erro ao conectar-se a sua conta!')
            res.redirect("/")

        })

    })

})

module.exports = router;
