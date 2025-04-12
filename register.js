const mongoose = require("mongoose");

const {model} = require("mongoose");

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll_no: {
        type: String,
        required: true
    },
    reg_no: {
        type: String,
        required: true
    }
});

const Register = mongoose.model("Register", registerSchema);

module.exports=Register;