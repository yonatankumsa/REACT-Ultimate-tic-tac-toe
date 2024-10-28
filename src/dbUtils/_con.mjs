const uriLink =
  "mongodb+srv://00flibit:Ic3pPDEDyu9cmMnW@ultimate-tic-tac-toe.8xt5po1.mongodb.net/?retryWrites=true&w=majority";

import { MongoClient } from "mongodb";
//const MongoClient = require("mongodb").MongoClient;


const client = new MongoClient(uriLink);

let conn;
async function connect(){
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}
}

connect();

let db = conn.db("games");

export default db;