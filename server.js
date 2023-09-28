let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dotenv = require('dotenv');


// Acessing the environment variable...
dotenv.config();
  
// Express Route
const adminRoute = require('./routes/adminRoute')
const employeeRoute = require('./routes/employeeRoute')
  
const app = express()
const port = 4000
const dbURL = 'mongodb://127.0.0.1:27017/BS-Foils'

  
app.use(cors())
// Connect to MongoDB 
mongoose.connect(dbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err)
    })

// Middleware
app.use(bodyParser.json())

// Routes
app.use('/', adminRoute);
app.use('/', employeeRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})