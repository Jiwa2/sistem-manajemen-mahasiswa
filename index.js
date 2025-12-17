const express = require("express");
const app = express();
const mahasiswaRoutes = require("./mahasiswa.cjs");

app.use(express.json());
app.use("/mahasiswa", mahasiswaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend jalan di port", PORT);
});
