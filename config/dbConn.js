const mongoose = require('mongoose');

const connectMainDB = async () => {
    try {
        let DATABASE_URI =  `mongodb+srv://${process.env.DATABASE_MAIN_USERNAME}:${process.env.DATABASE_MAIN_PASSWORD}@${process.env.DATABASE_MAIN_CLUSTER}.a0utq9x.mongodb.net/${process.env.DATABASE_MAIN_DB_NAME}retryWrites=true&w=majority`;

        await mongoose.connect(DATABASE_URI), {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
    } catch (err) {
        console.error(err);        
    }
}

const connectSchoolDB = async (database_name) => {
    try {
        await mongoose.connect(process.env.DATABASE_URI), {
            useUnifiedTopology: true,
            useNewUrlParser: true
        };
    } catch (err) {
        console.error(err);        
    }
}

module.exports = {connectMainDB, connectSchoolDB};