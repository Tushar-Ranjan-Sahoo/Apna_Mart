const mongoose = require('mongoose');

const connectDatabase = () => {
 mongoose
 .connect(process.env.DB_URI, {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 })
 .then((data) => {
 console.log(`Mongodb connected with server : ${data.connection.host}`);
 })
 .catch((error) => {
 console.error(error);
 });
};

module.exports = connectDatabase;




// const mongoose = require('mongoose');

// const connectDatabase = () =>{
//     mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true}).then((data)=>{
//         console.log(`Mongodb connected with server : ${data.connection.host}`);
    
//     }).catch((error)=>{
//         console.error(error);
//     })
// }

// module.exports =connectDatabase