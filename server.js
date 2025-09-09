const express = require('express')
const { resolve, join } = require('path')
require('dotenv').config()

const app = express()

// Servir arquivos estáticos do build (React, Vite, etc.)
app.use('/', express.static(resolve(__dirname, 'build')))

// Rota para sempre devolver o index.html (SPA)
app.get('*', (_, res) => {
  res.sendFile(join(__dirname, 'build', 'index.html'))
})

// Pega a porta do .env ou usa 3338 como fallback
const PORT = process.env.PORT || 3338

app.listen(PORT, (err) => {
  if (err) {
    return console.error(err)
  } else {
    console.log(`Frontend server running on port ${PORT}`)
  }
})
