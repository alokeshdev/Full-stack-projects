// IMPORTING REQUIRED MODULES
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const app = express();
const mongoose=require("mongoose"); 

// SET PORT
const port = process.env.PORT || 3000;

// TEMPLATE PATH SETUP
const views_path = path.join(__dirname, "../templates/views");

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));  //decode
app.use(express.static('public'));
// MONGODB CONNECTION AND MODEL
require("./db/conn");
const pp = require("./models/register"); // Make sure model is named and exported correctly

// SET TEMPLATE ENGINE
app.set("view engine", "hbs");
app.set("views", views_path);

// START SERVER
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

// ROUTES

// GET - Index Page
app.get("/index", (req, res) => {
    res.render("index");
});

// POST - Handle Form Submission
app.post("/send", (req, res) => {
    const { name, roll_no, reg_no,event_info } = req.body;
    console.log(name, roll_no, reg_no,event_info);

    const save_data = new pp({
        name,
        roll_no,
        reg_no,
        event_info
    });

    save_data.save()
        .then(() => {
            console.log("Data saved to DB!");
            res.send("Data sent to backend!");
        })
        .catch((e) => {
            console.error(`Error saving data: ${e}`);
            res.status(500).send("Failed to save data.");
        });
});

// GET - Display All Data
app.get("/display", async (req, res) => {
    try {
        const data = await pp.find();
        console.log(data);
        res.render("display", { data });
    } catch (error) {
        console.error(`Error fetching data: ${error}`);
        res.status(500).send("Error fetching data.");
    }
});
app.post("/update", async (req, res) => {
    const { name, roll_no, reg_no,event_info, id, btn } = req.body;
    let status;

    if (btn === "UPDATE") {
        await pp.updateOne(
            { _id: new mongoose.Types.ObjectId(id) },
            { $set: { name, roll_no, reg_no,event_info } } // ✅ include all fields
        );
        status = 1;
    }

    if (btn === "DELETE") {
        await pp.deleteOne({ _id: new mongoose.Types.ObjectId(id) });
        status = 2;
    }

    const data = await pp.find();
    res.render("display", { data, status });
});
