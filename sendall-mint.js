const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

// Initialize Sequelize to connect to SQLite database
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite')
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

// Function to query certificates where isIntegrated is false
async function getNonIntegratedCertificates() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        const certificates = await Certificate.findAll({
            where: {
                isIntegrated: false
            }
        });
        for (const certificate of certificates) {
            await sendAllCertificates(certificate.title, certificate.certificateId, certificate.ownerName, certificate.categoryCertificate, certificate.certificateDate, certificate.expiredDate, certificate.email, certificate.certificateId);
            console.log('Certificate sent:', certificate.certificateId);
        }

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

async function sendAllCertificates(title, certificateId, ownerName, categoryCertificate, certificateDate, expiredDate, email, certificateId) {
  const startTime = Date.now();
  const fileBuffer = fs.readFileSync(path.join(__dirname, 'public', 'outputpdf', `${certificateId}.pdf`));
  const file = new Blob([fileBuffer], { type: 'application/pdf' });
  const formData = new FormData();
  formData.append("title", title);
  formData.append("certificateId", certificateId);
  formData.append("ownerName", ownerName);
  formData.append("category", categoryCertificate);
  formData.append("publishDate", certificateDate);
  formData.append("expiredDate", expiredDate);
  formData.append("email", email);
  formData.append("image", file, `${certificateId}.pdf`);

  try {
    const response = await axios.post(
      "https://api.certificate.telkomblockchain.com/api/ori-metanesia/v1/rest-api/create-certificate",
      // "http://localhost:3000/api/ori-metanesia/v1/rest-api/create-certificate",
      formData,
      {
        headers: {
          "api-key": "02891343349379836284",
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      }
    );
    await Certificate.update({ isIntegrated: true }, { where: { certificateId: certificateId } });
    const endTime = Date.now();
    await new Promise(resolve => setTimeout(resolve, 5000));// sleep for 5 seconds wait transaction to be minted
    console.log(`Certificate ${certificateId} processed in ${endTime - startTime} ms`);
  } catch (error) {
    console.error(error);
  }
}

// Execute the function
getNonIntegratedCertificates();