 // Imports

const express = require("express")
const app = express()
const mongoose = require("mongoose")
const handlebars = require("handlebars")
const { engine } = require("express-handlebars")
const session = require("express-session")
const passport = require("passport")
const flash = require("connect-flash")
const path = require("path")
const bcrypt = require("bcryptjs")

// Declarando Rotas

const jogador = require("./routes/jogador")
const admin = require("./routes/admin")

// Declarando Models

require("./models/Jogador")
const Jogador = mongoose.model("jogadores")

// Metodos de Autenticação

require("./config/auth")(passport)

const { Logado } = require("./helpers/estaLogado")

// Configurações Connections MongoDB

const db = require("./config/db")

// Configuração da Sessão

app.use(
    session({
        secret: "dm1460",
        resave: true,
        saveUninitialized: true
    })
)

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// Configurações JSON para o Express

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Configurações Middlewares e Cookies

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    res.locals.admin = req.Admin || null
    next()
})

// Configurações Handlebars

app.engine('handlebars', engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// Mongoose 

mongoose.set("strictQuery", false);
mongoose.Promise = global.Promise
mongoose.connect(db.mongoURI).then(() => {

    console.log("SUCESSO! Login com o MongoDB Realizado com Sucesso!")

}).catch((erro) => {

    console.log(`ERRO! Não foi possível realizar o Login com o MongoDB: ${erro}`)

})

// Regex Email

function validarEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
} 

// Rotas

app.get('/', Logado, (req, res) => {

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

    res.render('jogador/index', { jogador: jogadorLogado})

})

app.get("/login", (req, res) => {

    res.render("usuario/inicio")

})

app.post("/login/done", passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: 'true',
    session: true
}), (req, res) => {
    req.flash('success_msg', 'Bem-Vindo, você foi logado com sucesso!')
})

app.get("/cadastrar", (req, res) => {

    res.render("usuario/cadastro")
    
})

app.post("/cadastrar", (req, res) => {

    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome Inválido" })
    }

    if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        erros.push({ texto: "Email Inválido" })
    }

    if (req.body.email.includes("@")) {
        console.log("Email Válido")
    } else {
        erros.push({ texto: "Isso não é um Email" })
    }

    if (req.body.email.includes(".com")) {
        console.log("Email Válido")
    } else {
        erros.push({ texto: "Email Inválido" })
    }

    if (validarEmail(req.body.email)) {
        console.log("Email Válido, Regex Funcionou")
    } else {
        erros.push({ texto: "Email Inválido" })
    }

    if (!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null) {
        erros.push({ texto: "Senha Inválida" })
    }

    if (!req.body.confirmarSenha || typeof req.body.confirmarSenha == undefined || req.body.confirmarSenha == null) {
        erros.push({ texto: "Senha Inválida" })
    }

    if (req.body.senha != req.body.confirmarSenha) {
        erros.push({ texto: "As Senhas são Diferentes! Tente Novamente..." })
    }

    if (erros.length > 0) {

        console.log(erros)
        res.render("usuario/cadastro", { erros: erros })

    } else {

        Jogador.findOne({ email: req.body.email }).lean().then((usuario) => {

            if (usuario) {

                req.flash('error_msg', 'Já existe uma conta com esse Email no Sistema...')
                res.redirect("/registro")

            } else {

                const novoJogador = new Jogador({

                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha,
                    nomeClube: req.body.nomeClube,
                    pstXP: 0,
                    lvlXP: "1",
                    dinheiro: 500,
                    escudo: "https://icones.pro/wp-content/uploads/2022/06/icone-de-bouclier-gris.png",
                    amigos: "",
                    logado: 1,
                    cartas: 0,
                    escudos: "https://icones.pro/wp-content/uploads/2022/06/icone-de-bouclier-gris.png",
                    convitesPendentes: 0,
                    amigosPendentes: ""

                })

                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoJogador.senha, salt, (erro, hash) => {
                        if (erro) {
                            console.log(`ERRO! Não foi possível salvar a senha com hash do usuário: ${erro}`)
                            res.redirect("/login")
                        }

                        novoJogador.senha = hash

                        novoJogador.save().then(() => {

                            req.flash('success_msg', 'Bem-Vindo, Conta Criada com Sucesso!')
                            res.redirect("/login")

                        }).catch((erro) => {

                            console.log(erro)
                            req.flash('error_msg', 'ERRO! Não foi possível criar a conta!')
                            res.redirect("/login")

                        })
                    })
                })

            }

        }).catch((erro) => {

            console.log(`ERRO! Houve um Erro Interno ao Cadastrar o Usuário: ${erro}`)
            res.redirect('/login')

        })

    }

})

app.get("/logout", (req, res) => {

    req.logout((erro) => {

        if (erro) {

            req.flash('error_msg', 'ERRO! Não foi possível deslogar')
            res.redirect("/")

        }

        req.flash('success_msg', 'SUCESSO! Você foi desconectado...')
        res.redirect("/login")

    })

})

app.get('/404', (req, res) => {

    res.send("Erro 404! Deu Licas...")

})

// Adicionar Rotas 

app.use('/jogador', Logado, jogador)
app.use('/admin', admin)

// Public

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {

    console.log("Middleware Ativado")
    next()

})

// Inicialização

const porta = process.env.PORT || 3000

app.listen(porta, () => {
    console.log(`SUCESSO! Servidor Funcionando na Porta ${porta}`)
})

