// const { MongoClient } = require("mongodb");
import { MongoClient } from "mongodb";
const url =
  "mongodb+srv://jyotismitadas365:root@cluster0.dispglj.mongodb.net/?appName=Cluster0";
const dbName = "node-project";
export const collectionName = "todo";
const client = new MongoClient(url);
export const connection = async () => {
  const connect = await client.connect();
  return await connect.db(dbName);
};
