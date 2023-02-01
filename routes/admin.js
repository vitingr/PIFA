const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")

// Models

require("../models/Carta")
const Carta = mongoose.model("cartas")


router.get('/gerador', (req, res) => {

    res.render("admin/geradorCartas")

})

router.post("/gerarCarta", (req, res) => {

    var valorPifa = 0

    Carta.find().lean().then((cartas) => {

        cartas.forEach(item => {

            valorPifa += 1
            console.log(`ID PIFA => ${valorPifa}`)

        })

        const novaCarta = {

            nome: req.body.nome,
            clube: req.body.clube,
            liga: req.body.liga,
            nacionalidade: req.body.nacionalidade,
            overall: req.body.overall,
            posicao: req.body.posicao,
            idPifa: valorPifa,
            ritmo: req.body.ritmo,
            finalizacao: req.body.finalizacao,
            passe: req.body.passe,
            drible: req.body.drible,
            defesa: req.body.defesa,
            fisico: req.body.fisico,
            fotoCarta: req.body.foto,
            precoMax: req.body.precoMax,
            precoMin: req.body.precoMin,
            tipo: req.body.tipo
        }

        console.log(`valor final => ${valorPifa}`)

        new Carta(novaCarta).save().then(() => {

            req.flash('success_msg', 'SUCESSO! A carta foi adicionada.')
            res.redirect("/admin/gerador")
    
        }).catch((erro) => {
    
            req.flash('error_msg','ERRO! Não foi possível adicionar a carta...')
            res.redirect("/admin/gerador")
    
        })

    })

    console.log(`valor final => ${valorPifa}`)


})

module.exports = router;