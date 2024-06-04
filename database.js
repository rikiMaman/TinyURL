import mongoose from "mongoose";

const uri =
    "mongodb+srv://<username>:<password>@<host>/<dbname>?retryWrites=true&w=majority";
const uriLocal = "mongodb://localhost:27017/tinyurl";

// mongoose.connect('mongodb://localhost:27017/yourDatabase', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });
const connectToDB= async()=>{
    await mongoose.connect(uriLocal);
}
const database = mongoose.connection;

database.on('erroe', (error)=>{
    console.log(error)
})
database.once('connected',()=>{
    console.log('Connect to Database successfully!')
})
export default connectToDB;