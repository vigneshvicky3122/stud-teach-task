var express = require("express");
var router = express.Router();
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const client = new MongoClient(process.env.DB_URL);

router.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

router.get("/user", async (req, res) => {
  await client.connect();
  try {
    let db = client.db(process.env.DB_NAME);
    let Mentor = await db
      .collection(process.env.DB_COLLECTION_ONE)
      .find({ role: "Mentor" })
      .toArray();
    let Unassigned = await db
      .collection(process.env.DB_COLLECTION_ONE)
      .find({ mentor: "" })
      .toArray();

    if (Mentor) {
      res.json({
        status: 200,
        Mentor,
        Unassigned,
      });
    } else {
      res.json({
        status: 400,
        message: "connection error",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal error occurred",
      error: error,
    });
  } finally {
    await client.close();
  }
});

router.put("/assigned/:id", async (req, res) => {
  await client.connect();
  try {
    let db = client.db(process.env.DB_NAME);

    let Mentor = await db
      .collection(process.env.DB_COLLECTION_ONE)
      .find({ name: req.params.id })
      .toArray();
    if (
      Mentor[0].Students === undefined ||
      (Mentor[0].Students.length < 5 && !Mentor[0].Students.includes(req.body))
    ) {
      let student = await db
        .collection(process.env.DB_COLLECTION_ONE)
        .findOneAndUpdate(
          { name: req.body.name },
          { $set: { mentor: req.params.id } }
        );
      let mentor = await db
        .collection(process.env.DB_COLLECTION_ONE)
        .findOneAndUpdate(
          { name: req.params.id },
          { $push: { Students: req.body } }
        );

      if (mentor) {
        res.json({
          status: 200,
          message: "mentor assigned...",
        });
      } else {
        res.json({
          status: 400,
          message: "connection error",
        });
      }
    } else {
      res.json({
        status: 401,
        message: "A mentor's student limit is 5, you can assign another mentor",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal error occurred",
    });
  } finally {
    await client.close();
  }
});
router.put("/Unassigned/:id", async (req, res) => {
  await client.connect();
  try {
    let db = client.db(process.env.DB_NAME);

    let Mentor = await db
      .collection(process.env.DB_COLLECTION_ONE)
      .findOneAndUpdate({ name: req.body.name }, { $set: { mentor: "" } });
    let RemoveOldOne = await db
      .collection(process.env.DB_COLLECTION_ONE)
      .findOneAndUpdate(
        { name: req.params.id },
        { $pull: { Students: { _id: req.body._id } } }
      );

    if (RemoveOldOne) {
      res.json({
        status: 200,
        message: "mentor unassigned...",
      });
    } else {
      res.json({
        status: 400,
        message: "connection error",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal error occurred",
    });
  } finally {
    await client.close();
  }
});

router.post("/create", async (req, res) => {
  await client.connect();
  try {
    let db = client.db(process.env.DB_NAME);
    if (req.body.role === "Student") {
      let connect = await db
        .collection(process.env.DB_COLLECTION_ONE)
        .insertOne({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          role: req.body.role,
          mentor: "",
        });
      if (connect) {
        res.json({
          status: 200,
          message: "user created successfully",
        });
      } else {
        res.json({
          status: 400,
          message: "connection error",
        });
      }
    } else {
      let connect = await db
        .collection(process.env.DB_COLLECTION_ONE)
        .insertOne({
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          role: req.body.role,
          Students: [],
        });
      if (connect) {
        res.json({
          status: 200,
          message: "user created successfully",
        });
      } else {
        res.json({
          status: 400,
          message: "connection error",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({
      statusCode: 500,
      message: "internal error occurred",
    });
  } finally {
    await client.close();
  }
});

module.exports = router;
