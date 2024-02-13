const express = require("express"); //O QUE É EXPRESS

// const allTodos = [{nome: "aaaaaa", status: false}];
const todosRoutes = express.Router();
const {PrismaClient} = require("@prisma/client"); // responsável pela conexão com o prisma

const prisma = new PrismaClient(); 
/*
    Toda vez que digitarmos "prisma.todo......",
    estamos nos referindo ao MODEL TODO,
    que criamos dentro do arquivo schema
*/

//Create
todosRoutes.post("/todos", async (request, response) =>{ //req, res
    const {name} = request.body
    // allTodos.push({name, status: false})
    const todo = await prisma.todo.create({
        data:{
            name,
        }, 
    });
    return response.status(201).json(todo)
});

//Read
todosRoutes.get("/todos", async (request, response) => {
    const todos = await prisma.todo.findMany(); // encontre todos os registros
    return response.status(200).json(todos)
});

//Update
todosRoutes.put("/todos", async (request, response) => {
    const {name, id, status} = request.body;

    if(!id){ // se o id não existir
        return response.status(400).json("Ei fia, Id is mandatory");
    }

    const todoAlreadyExists = await prisma.todo.findUnique({where: { id } });

    if(!todoAlreadyExists){
        return response.status(404).json("Ei, Todo does not exist")
    }

    const todo = await prisma.todo.update({
        where:{ // o dado de referência do body (id)
            id,
        },
        data: { // os dados do body que vão ser atualizados (name, status)
            name,
            status,
        },
    })

    return response.status(200).json(todo);
});

//Delete
todosRoutes.delete("/todos/:id", async (request, response) => {
    const {id} = request.params;
    const intId = parseInt(id);

    if(!intId){ // se o id não existir
        return response.status(400).json("Ei fia, Id is mandatory");
    }

    const todoAlreadyExists = await prisma.todo.findUnique({where: { id: intId } });

    if(!todoAlreadyExists){
        return response.status(404).json("Ei, Todo does not exist")
    }

    await prisma.todo.delete({where:{ id: intId }});
    return response.status(200).send();
});

module.exports = todosRoutes;