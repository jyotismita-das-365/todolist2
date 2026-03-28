import e from "express";
import { collectionName, connection } from "./dbconfig.js";
import cors from "cors";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const app = e();

app.use(e.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }),
);
app.use(cookieParser());

app.post("/login", async (req, resp) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection("users");
    const result = await collection.findOne({
      email: userData.email,
      password: userData.password,
    });
    if (result) {
      jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
        resp.send({
          success: true,
          msg: "login done",
          token,
        });
      });
    } else {
      resp.send({
        success: false,
        msg: "User not found",
        token,
      });
    }
  } else {
    resp.send({
      success: false,
      msg: "login not done",
      token,
    });
  }
});

app.post("/signup", async (req, resp) => {
  const userData = req.body;
  if (userData.email && userData.password) {
    const db = await connection();
    const collection = await db.collection("users");
    const result = await collection.insertOne(userData);
    if (result) {
      jwt.sign(userData, "Google", { expiresIn: "5d" }, (error, token) => {
        resp.send({
          success: true,
          msg: "signup done",
          token,
        });
      });
    }
  } else {
    resp.send({
      success: false,
      msg: "signup not done",
      token,
    });
  }
});

app.post("/add-task", verifyJWTToken, async (req, resp) => {
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

app.get("/tasks", verifyJWTToken, async (req, resp) => {
  const db = await connection();

  const collection = await db.collection(collectionName);
  const result = await collection.find().toArray();
  if (result) {
    resp.send({ message: "task list fetched", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.get("/task/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const id = req.params.id;
  const result = await collection.findOne({ _id: new ObjectId(id) });
  if (result) {
    resp.send({ message: "task fetched", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.put("/update-task", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const collection = await db.collection(collectionName);
  const { _id, ...fields } = req.body;
  const update = { $set: fields };
  console.log(req.body);
  const result = await collection.updateOne({ _id: new ObjectId(_id) }, update);
  if (result) {
    resp.send({ message: "task data update", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.delete("/delete/:id", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const id = req.params.id;
  const collection = await db.collection(collectionName);
  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  if (result) {
    resp.send({ message: "task deleted", success: true, result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

app.delete("/delete-multiple", verifyJWTToken, async (req, resp) => {
  const db = await connection();
  const ids = req.body;
  const deleteTaskIds = ids.map((item) => new ObjectId(item));
  console.log(ids);
  const collection = await db.collection(collectionName);
  const result = await collection.deleteMany({ _id: { $in: deleteTaskIds } });
  if (result) {
    resp.send({ message: "task deleted", success: result });
  } else {
    resp.send({ message: "error try after sometime", success: false });
  }
});

function verifyJWTToken(req, resp, next) {
  // console.log("verifyJWTToken",req.cookies['token']);
  const token = req.cookies["token"];
  jwt.verify(token, "Google", (error, decoded) => {
    if(error){
      return resp.send ({
        msg:"Invalid token",
        success: false
      })
    }
    next();
  });
}

app.listen(3200);
