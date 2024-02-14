const express = require("express")
const cors = require("cors");
const todosRoutes = require("./todos.routes") // rotas do crud
const app = express() //??????

app.use(express.json())
app.use(cors());
app.use(todosRoutes);

// checar se o servidor está funcionando
app.get("/health", (req,res) => {
    return res.json("up");
});

// atualiza a gente do status do servidor no console
app.listen(3333, () => console.log("Server up in 3333"));
