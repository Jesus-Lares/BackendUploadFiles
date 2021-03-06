const mongoose = require("mongoose");
const app = require("./app");
const { API_VERSION, IP_SERVER, PORT_DB } = require("./config");

const port = process.env.PORT || 3977;

//mongoose.set("userFindAndModify",false)
mongoose.connect(
  `mongodb://${IP_SERVER}:${PORT_DB}/uploadfiles`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) {
      throw err;
    } else {
      console.log("Conexión exitosa con la base de datos");

      app.listen(port, () => {
        console.log("##############");
        console.log("###API REST###");
        console.log("##############");
        console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
      });
    }
  }
);
