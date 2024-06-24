import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: Number;
}

const connection: ConnectionObject = {};

async function dbConnect():Promise<void>{
  if(connection.isConnected){
    console.log("DB is already connected");
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
    connection.isConnected = db.connections[0].readyState;
    console.log("DFatabase connected successfully")
  } catch (error) {
    console.log("Failed to connect database:",error)
    process.exit(1)
  }
 

}

export default dbConnect