const Seqquelize = require("sequelize");
const sequelize = new Seqquelize("node_app","root","sina1234",{
    dialect:'mysql',
    host:'localhost'
})

module.exports = sequelize;