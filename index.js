require('dotenv').config();
const express = require('express'); 
const cors = require('cors');
const path = require('path');
const app = express();
const appRoutes = require('./routes');

app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname,'Public')));
app.use('/api/OfferPoint', appRoutes);

app.listen(8000, ()=>{
    console.log('Server is running at http://localhost:8000/');
});