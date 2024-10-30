// required modules
const app = require('./app');
const path = require('path');
require('dotenv').config({path: path.join(__dirname, 'config/config.env')});


// start server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});