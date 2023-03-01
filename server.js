const { urlencoded } = require("express");
const express = require("express");
const multer = require("multer");
const path = require("path");
const getColors = require('get-image-colors')
const ejs = require("ejs");

const app = new express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const imageName = Date.now();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
      cb(null, imageName + path.extname(file.originalname));
      check=false
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("form", {});
});
app.post("/Generate", upload.single("img"), (req, res) => {
  console.log(imageName)
  var colours = ['']
  getColors(path.join(__dirname, 'public/images/'+imageName+'.jpg')).then(colors => {
    var color = Math.floor(Math.random() * colors.length);
    console.log(colors[color].hex())
    res.render("index", {
    song: req.body.song,
    artist: req.body.artist,
    pass: imageName,
    colors: colors[color].hex()
  });
  })
  
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Example app listening on port 5000`);
});
