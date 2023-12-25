import mongoose from 'mongoose';

export const MongoConnect = async () => {
    try{
        const mongoInstance = await mongoose.connect(process.env.MONGODB_URL);
        // mongoose.connection.on('open',() => {
        //     console.log(`Alhumdullillah connection successful!! host id is: ${mongoInstance.connection.host}`)
        // });
       console.log(`Alhumdullillah connection successful!! host id is: ${mongoInstance.connection.host}`);
    }catch(err){
        mongoose.connection.on("error",() => {
            console.log(`MongoDB Connection error: ${err}`);
        });
        process.exit(1);
    }
}

export const MongoDisconnect = async () => {
    await mongoose.disconnect();
}