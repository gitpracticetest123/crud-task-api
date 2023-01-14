const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//mongoose.set('strictQuery', false);
mongoose.set('strictQuery', false);

mongoose.connect('mongodb://127.0.0.1:27017/taskmanagerDB')
    .then( () => {
        console.log('DB is connected Successfully!');
    })
    .catch((error) => {
        console.log(error);
    });

    module.exports = mongoose;