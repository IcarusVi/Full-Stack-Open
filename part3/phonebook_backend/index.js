const { json } = require('express');
var express = require('express')
var morgan = require('morgan')
const app = express()

morgan.token('post', (req)=>{
    let postInfo = req.body;
    return JSON.stringify(postInfo)

})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))


let phoneBook = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '040-123456'
    },
    {
        id: 2,
        name: 'Ada Lovelace',
        number: '39-44-5323523'
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id:4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
]

const genId = () =>{
    let newId = Math.floor(Math.random() * Math.floor(1000));
    return newId;
}

app.get('/api/persons', (request, response)=>{
    response.json(phoneBook)
})

app.post('/api/persons', (request, response)=>{
    let body = request.body;
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'Name or number is missing'
        })
    }
    else if(phoneBook.find(entry=> entry.name === body.name)){
        return response.status(400).json({
            error: 'Name already in phonebook'
        })
    }

    let newEntry = {
        id: genId(),
        name: body.name,
        number: body.number
    }

    phoneBook = phoneBook.concat(...phoneBook, newEntry)
    
    response.json(newEntry)
    
})

app.get('/info', (request, response)=>{
    response.send('<p>Phonebook has info for '+ phoneBook.length +' people </p>' + new Date())
})

app.get('/api/persons/:id', (request, response)=>{
    let id = Number(request.params.id);
    const entry = phoneBook.find(entry=> entry.id === id)
    if(entry){
        response.json(entry)
    }
    else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    let id = Number(request.params.id);
    const entry = phoneBook.find(entry=> entry.id === id)
    phoneBook = phoneBook.filter(entry=> entry.id !== id)
    response.status(204).end()
})



const PORT = 3001
app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`)
})