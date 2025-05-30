import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`connected to mongodb database ${conn.connection.host}`.bgMagenta);
    }
    catch(err){
        console.log(`error in mongodb ${error}`.bgRed.white);
    }
};

export default connectDB;