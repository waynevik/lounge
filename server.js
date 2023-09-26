require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const { errorHandler }  = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const {connectMainDB, connectSchoolDB} = require('./config/dbConn');

const PORT = process.env.PORT || 4500;

// connect to mongo db

connectMainDB();

// custom middleware logger
app.use(logger);

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended : false}));

app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use('/' ,express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));

// connectSchoolDB();
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));
app.use('/classes', require('./routes/api/classes'));
app.use('/students', require('./routes/api/students'));
app.use('/fees', require('./routes/api/fees'));
app.use('/sms', require('./routes/api/sms'));
app.use('/data', require('./routes/api/data'));
app.use('/routes', require('./routes/api/routes'));
app.use('/logout', require('./routes/logout'));

app.all('*' , (req, res) => {
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')){
        res.json({
            error : "404 Not Found"
        }); 
    }else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to Mongo DB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});