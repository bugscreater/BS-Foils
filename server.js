let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dotenv = require('dotenv');


// Acessing the environment variable...
dotenv.config();
  
// Express Route
const adminRoute = require('./routes/adminRoute');
const employeeRoute = require('./routes/employeeRoute');
const attendenceRoute = require('./routes/attendenceRoute');
const payrollRoute = require('./routes/payrollRoute');
  
const app = express()
const port = process.env.PORT || 4000;
const dbURL = process.env.DB_URL;

  
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
app.use('/', attendenceRoute);
app.use('/', payrollRoute);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})