const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
/* use the Cosmos DB connection string you copied ealier and replace in the `url` variable */
const url = "mongodb://mongodbdavid:hHk49dZPmrWinNOttle0ANL729qcKHXI2PztUIsz6kUxXmti0SAKuunSO83a7tvFhPNUPtWWyhPbz4WLkcaxIQ==@mongodbdavid.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mongodbdavid@";
const client = new MongoClient(url);

let resetList = [
  {
    _id: uuidv4(),
    _no_id_usuario: "4d2cb127-5d93-4ed3-a0d6-b4b486efc5aa",

  },
  {
    _id: uuidv4(),
    _no_id_usuario: "57334715-1cc6-4d2f-8284-677b730af90a",
    
  },
 

];

module.exports = async function (context, req) {
  await client.connect();
  const database = client.db("crud");
  const collection = database.collection("cuentas");
  await collection.deleteMany({});
  await collection.insertMany(resetList);

  return (context.res = {
    status: 200,
    body: "Initialization successful",
  });
};