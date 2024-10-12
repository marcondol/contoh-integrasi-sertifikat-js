const express = require("express");
const fs = require("fs");
const path = require("path");
const { faker } = require("@faker-js/faker");
const Jimp = require("jimp");
const certificatePdf = require("./certificate-pdf");
const fileUpload = require("express-fileupload");
const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const axios = require("axios");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "database.sqlite"),
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

  const Certificate = sequelize.define("Certificate", {
    ownerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    domicile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryCertificate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificateId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    certificateDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiredDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isIntegrated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  sequelize.sync({ force: false}).then(() => {
    console.log("Database & tables created!");
  });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

const PORT = process.env.APP_PORT || 4000;

app.get("/", async (req, res) => {
  const certificates = await Certificate.findAll();
  res.render("index", { certificates });
});

app.get("/generatecertificate", async (req, res) => {
  res.render("generate-certificate");
});

app.post("/generatecertificate", async (req, res) => {
  if (req.body.certificate === 1) {
    return res.status(400).send("Error: Minimal value is 2.");
  }

  const length = parseInt(req.body.certificate) || 5;

  const title = faker.lorem.sentence(3);
  const fakeData = Array.from({ length }, () => ({
    ownerName: faker.person.fullName(),
    phoneNumber: faker.phone.number(),
    domicile: faker.location.streetAddress(),
    email: faker.internet.email(),
    categoryCertificate: "Peserta",
    certificateId: faker.string.uuid(),
    title,
    certificateDate: faker.date.recent().toISOString().split("T")[0],
    expiredDate: faker.date.future().toISOString().split("T")[0],
  }));

  fakeData.unshift({
    ownerName: "ownerName",
    phoneNumber: "phoneNumber",
    domicile: "domicile",
    email: "email",
    categoryCertificate: "categoryCertificate",
    certificateId: "certificateId",
    title: "title",
    certificateDate: "certificateDate",
    expiredDate: "expiredDate",
  });

  fakeData.shift();

  await Certificate.bulkCreate(fakeData);

  // fs.writeFileSync("participants.json", JSON.stringify(fakeData, null, 2));
  // console.log("Data written to file json");

  // const x = 279;
  // const y = 535;

  // const dataObj = fakeData;
  // const printObj = [];
  // const len = dataObj.length;

  // for (let i = 1; i < len; i++) { // Start from index 1 to skip the first object
  //   if (dataObj[i].ownerName.split(" ")[1]) {
  //     printObj.push(
  //       dataObj[i].ownerName.split(" ")[0] +
  //         " " +
  //         dataObj[i].ownerName.split(" ")[1]
  //     );
  //   } else {
  //     printObj.push(dataObj[i].ownerName.split(" ")[0]);
  //   }
  //   await Jimp.read("assets/basesss.jpg")
  //     .then((image) =>
  //       Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then((font) => {
  //         let printS = printObj[i - 1].toString().toUpperCase(); // Adjust index for printObj
  //         image
  //           .print(font, x, y, printS)
  //           .write(`./public/outputimage/${dataObj[i].certificateId}.jpg`);
  //       })
  //     )
  //     .catch((err) => console.log(err));
  // }

  for (data of fakeData) {
    if (data.certificateId === "certificateId") {
      continue;
    }
    certificatePdf(data);
  }

  res.redirect("/generatecertificate");

});

app.post("/uploadcertificate", async (req, res) => {
  const fileBuffer = fs.readFileSync(path.join(__dirname, 'public', 'outputpdf', `${req.body.certificateId}.pdf`));
  const file = new Blob([fileBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append("title", req.body.title);
  formData.append("certificateId", req.body.certificateId);
  formData.append("ownerName", req.body.ownerName);
  formData.append("category", req.body.categoryCertificate);
  formData.append("publishDate", req.body.certificateDate);
  formData.append("expiredDate", req.body.expiredDate);
  formData.append("email", req.body.email);
  formData.append("image", file, `${req.body.certificateId}.pdf`);

  try {
    const response = await axios.post(
      "https://api.certificate.telkomblockchain.com/api/ori-metanesia/v1/rest-api/v2/create-certificate",
      formData,
      {
        headers: {
          "api-key": "",
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    );
    await Certificate.update({ isIntegrated: true }, { where: { certificateId: req.body.certificateId } });
    res.send({ success: true, data: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error uploading certificate.");
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
