const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Model de Usuário
require("../models/Jogador")
const Jogador = mongoose.model("jogadores")

module.exports = (passport) => {

    console.log("chegou no auth")

    passport.use(
        new localStrategy({
            usernameField: 'email',
            passwordField: 'senha'
        },
            (email, senha, done) => {

                Jogador.findOne({ email: email }).lean().then((usuario) => {

                    if (!usuario) {
                        console.log("ERRO! Essa Conta não Existe!")
                        return done(null, false, { message: "Essa Conta não Existe" }) // null = error | false = user
                    }

                    bcrypt.compare(senha, usuario.senha, (erro, sucesso) => {  // Verificador do Hash para verificar se a senha hashesada equivale a senha digitada

                        if (erro) {
                            console.log(`${erro}`)
                            throw erro
                        }

                        if (sucesso) { 

                            return done(null, usuario, { message: "Conectado com Sucesso!" }) // Necessário Serialize e Deseriliaze para salvar a sessão

                        } else {

                            console.log("senha incorreta")
                            return done(null, false, { message: "Senha Incorreta!" })

                        }

                    })

                })
  
            }))

    // Assim que o usuário logar no seu site, os dados dele vão ser salvos com a Sessão

    passport.serializeUser((usuario, done) => {

        done(null, usuario._id)

    }) // Envia os dados para o req.user, que é uma função do passport que pega os dados do user atual da page.

    passport.deserializeUser((id, done) => {

        Jogador.findOne({_id: id}, (erro, usuario) => {

            done(erro, usuario)

        })

    })

}
