import e from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";

const app = e();

app.use(e.json());
app.use(cors());
app.post("/add-task", async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.insertOne(req.body);
  if (result) {
    resp.send({ message: "new task added", success: true, result });
  } else {
    resp.send({ message: "task not added", success: false });
  }
  resp.send("working....");
});
app.get("/", (req, resp) => {
  resp.send({
    message: "basic API done",
    success: true,
  });
});

app.get("/tasks", async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const result = await collection.find().toArray();
  if (result) {
    resp.send({ message: "task list fetched", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.get("/task/:id", async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const id = req.params.id
  const result = await collection.findOne({_id: new ObjectId(id)});
  if (result) {
    resp.send({ message: "task fetched", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.put("/update-task", async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const {_id, ...fields} = req.body;
  const update = {$set:fields}
  console.log(req.body)
  const result = await collection.updateOne({_id:new ObjectId(_id)}, update);
  if (result) {
    resp.send({ message: "task data update", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.delete("/delete/:id", async (req, resp) => {
  const db = await connection();
  const id = req.params.id
  const collection = await db.collection(collectionName);
  const result = await collection.deleteOne({_id: new ObjectId(id)});
  if (result) {
    resp.send({ message: "task deleted", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.delete("/delete-multiple", async (req, resp) => {
  const db = await connection();
  const ids = req.body;
  console.log(ids);
  // const collection = await db.collection(collectionName);
  // const result = await collection.deleteOne({_id: new ObjectId(id)});
  if (result) {
    resp.send({ message: "task deleted", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.listen(3200);
