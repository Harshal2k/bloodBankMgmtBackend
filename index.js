const express = require('express');
require('dotenv').config();
const cookieParser = require('cookie-parser')
const app = express();
const donorRoutes = require("./Routes/donorRoutes");
const bloodBagRoutes = require("./Routes/bloodBagRoutes");
const bloodBankRoutes = require("./Routes/bankRoutes");
const hospitalRoutes = require("./Routes/hospitalRoutes");

//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/api/donor', donorRoutes);
app.use('/api/bloodBag', bloodBagRoutes);
app.use('/api/bloodBank', bloodBankRoutes);
app.use('/api/hospital', hospitalRoutes);

app.listen(8080, () => {
    console.log('Server started on port 8080');
});
