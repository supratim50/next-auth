import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!); // '!' means that I know this env will come for sure. otherwise it will throw an error for type script
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected!');
        })

        connection.on('error', (err) => {
            console.log('MongoDB connection error, please make sure DB is up and running!' + err);
            process.exit();
            
        })

    } catch (error) {
        console.log('Something went wrong in connecting to DB');
        console.log(error);
        
    }
}