const senhaDB = ""

const express = require("express");
const mongoose = require("mongoose");
const Usuario = require("./models/usuarioModel");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}))

app.use(express.static("HTML"));

// Criar 
app.get("/criar", (req, res) =>
{
    res.sendFile(__dirname + "/HTML/criar.html");
});

app.post("/criar", async(req, res) =>
{
    try
    {
        const usuario = await Usuario.criar(req.body);
        console.log("Usuario criado: ", usuario);
        res.redirect('/');
    }
    catch (erro)
    {
        console.log(erro.message);
        res.status(500).json({message: erro.message});
    }
});

// Visualizar 

app.get("/visualizar", (req, res) =>
{
    res.sendFile(__dirname + "/html/visualizar.html");
});

app.get("/api/visualizar", async(req, res) =>
{
    try
    {
        const usuario = await Usuario.find({})
        res.status(200).json(usuario);
    }
    catch (erro)
    {
        console.log(erro.message);
        res.status(500).json({message: erro.message});
    }
});

app.get("/visualizar/:id", async(req, res) => 
{
    try
    {
        const {id} = req.params;
        const usuario = await Usuario.findById(id);
        res.status(200).json(usuario);
    }
    catch (erro)
    {
        console.log(erro.message);
        res.status(500).json({message: erro.message});
    }
})


//  Deletar
app.get("/excluir", (req, res) =>
{
    res.sendFile(__dirname + "/html/excluir.html");
});

app.post("/excluir", async (req, res) => {
    try {
        const { id } = req.body;
        const usuarioExcluido = await Usuario.findByIdAndexcluir(id);

        if (!usuarioExcluido) {
            return res.status(404).json({ message: `Usuário com ID: ${id} não encontrado` });
        }

        res.redirect("/");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// rota raiz
app.get("/", (req, res) =>
{
    res.sendFile(__dirname + "/html/index.html");
});

// conectar ao banco
mongoose.connect(`mongodb+srv://admin:${senhaDB}@faculdade.arcr4e1.mongodb.net/API-CRUD?retryWrites=true&w=majority`)
.then(() =>
{
    console.log("conectado ao MongoDB");
    app.listen(3000, () => 
    {
        console.log("API rodando na porta 3000.")
    })    
}).catch((erro) =>
{
    console.log(erro)
})