const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
/* use the Cosmos DB connection string you copied ealier and replace in the `url` variable */
const url = "mongodb://mongodbdavid:hHk49dZPmrWinNOttle0ANL729qcKHXI2PztUIsz6kUxXmti0SAKuunSO83a7tvFhPNUPtWWyhPbz4WLkcaxIQ==@mongodbdavid.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mongodbdavid@";
const client = new MongoClient(url);

let resetList = [
  {
    _id: uuidv4(),
    nombre_completo: "Juan Carlos Brenes",
    rol:"user",
    password:"123"
   
  },

  {
    _id: uuidv4(),
    nombre_completo: "Gerardo Andres Cerdas",
    rol:"user",
    password:"123"
   
  },

  {
    _id: uuidv4(),
    nombre_completo: "Erick Jose Pizarro",
    rol:"user",
    password:"123"
   
  },


];

module.exports = async function (context, req) {
  await client.connect();
  const database = client.db("crud");
  const collection = database.collection("usuarios");
  
  await collection.insertMany(resetList);

  return (context.res = {
    status: 200,
    body: "Initialization successful",
  });
};