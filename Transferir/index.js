const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");

/* use the Cosmos DB connection string you copied ealier and replace in the `url` variable */
const url = "mongodb://mongodbdavid:hHk49dZPmrWinNOttle0ANL729qcKHXI2PztUIsz6kUxXmti0SAKuunSO83a7tvFhPNUPtWWyhPbz4WLkcaxIQ==@mongodbdavid.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@mongodbdavid@";
const client = new MongoClient(url);

module.exports = async function (context, req) {
  await client.connect();
  const database = client.db("crud");
  const collectionTransf = database.collection("transferencias");
  const collectionSaldos = database.collection("saldos");



  let {cuenta_origen, monto_transferido, cuenta_destino } = {...req.body };
 // let query = {_id:req.params.id}
 // let {cuenta_origen, monto_transferido, cuenta_destino } = data; 
 

  let obj = await collectionSaldos.findOne({ _no_Cuenta: cuenta_origen });
  let cuentaATransferir = await collectionSaldos.findOne({ _no_Cuenta: cuenta_destino });


  if(cuenta_origen == cuenta_destino){
    return context.res = {
      status: 500,
      body: {
        respuesta : "No puedes transferir a tu propia cuenta!"
      }
    }
  }


 

  if(!cuentaATransferir){
    return context.res = {
      status: 500,
      body: {
        respuesta : "No existe la cuenta Destino"
      }
    }
  }

   
  if ( monto_transferido.trim() < 0) {
    return context.res = {
      status: 500,
      body: {
        respuesta : "El monto a trasferir debe ser mayor a 0"
      }
    }
  }

  
 
  if ((obj.saldo- monto_transferido.trim()) < 0) {
    return context.res = {
      status: 500,
      body: {
        respuesta : "La cuenta no tiene suficentes fondos"
      }
    }
  }
  const saldoActualOrigen = obj.saldo- monto_transferido.trim();
  let newValuesSaldoOrigen = {
    $set: {
      saldo: saldoActualOrigen,
      
    }
    
  }

  const saldoActualDestino = cuentaATransferir.saldo + monto_transferido;
  let newValuesSaldoDestino = {
    $set:{
      saldo:saldoActualDestino,
    }
  }

  

  let update = await collectionSaldos.findOneAndUpdate({ _no_Cuenta: cuenta_origen },newValuesSaldoOrigen,{returnOriginal:false});
  let updateDestino = await collectionSaldos.findOneAndUpdate({ _no_Cuenta: cuenta_destino },newValuesSaldoDestino,{returnOriginal:false});
  

  let dataTransf = { 
    _id: uuidv4(),
     monto_anterior : obj.saldo,
     monto_despues : saldoActualOrigen,
     ...req.body
     };

  await collectionTransf.insertOne(dataTransf);

  

//context.log(update)


  return context.res = {
    status: 200,
    body: "Transferencia realizada"
  };
};