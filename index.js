const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const cors = require('cors');

const app = express();
const donorRoutes = require("./Routes/donorRoutes");
const bloodBagRoutes = require("./Routes/bloodBagRoutes");
const bloodBankRoutes = require("./Routes/bankRoutes");
const hospitalRoutes = require("./Routes/hospitalRoutes");
const patientRoutes = require("./Routes/patientRoutes");

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cors());


app.use('/api/donor', donorRoutes);
app.use('/api/bloodBag', bloodBagRoutes);
app.use('/api/bloodBank', bloodBankRoutes);
app.use('/api/hospital', hospitalRoutes);
app.use('/api/patient', patientRoutes);

app.listen(8080, () => {
    console.log('Server started on port 8080');
});
