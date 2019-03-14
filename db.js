//MySQL Connection
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "192.81.208.136",
  user: "gotcrm_krdspoc",
  password: "krdsindia12345",
  database: "gotcrm_krds_poc"
});

con.connect(function(err) {
    if (err) throw err;
});

module.exports = con;
