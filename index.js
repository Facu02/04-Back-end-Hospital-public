const express = require('express');

require('dotenv').config()
const cors = require('cors')

const { dbConnection } = require('./database/config')
// Crear el servidor de express
const app = express()

dbConnection()

// Configurar cors
app.use(cors())

// Carpeta publica
app.use(  express.static('public') )

// lectura y parseo del body

app.use( express.json() )

// Rutas

app.use('/api/usuarios',  require('./routes/usuarios-routes'))
app.use('/api/hospitales',  require('./routes/hospitales'))
app.use('/api/medicos',  require('./routes/medico.routes'))
app.use('/api/login',  require('./routes/auth'))
app.use('/api/todo',  require('./routes/busquedas'))
app.use('/api/upload',  require('./routes/uploads'))

// Req es lo que viene, Res es lo que nosostros mandamos  al usuario

app.listen( process.env.PORT , () =>{
    console.log('servidor en puerto ' + process.env.PORT)
} )
