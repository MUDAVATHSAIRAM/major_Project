const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const plm = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    }
});

// Use .default if it exists (ESM compat), otherwise use directly
const plugin = plm.default || plm;
userSchema.plugin(plugin);

module.exports = mongoose.model("User", userSchema);