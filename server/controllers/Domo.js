const path = require('path');
const fs = require('fs');
const models = require('../models');

const { Domo } = models;

const makerPage = async (req, res) => {
  res.render('app');
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    image: req.body.image,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, image: newDomo.image });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age image').lean().exec();

    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

// https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
const uploadImage = async (req, res) => {
  if (!req.file) return res.status(500);

  const tempPath = req.file.path;
  let targetPath = path.join(__dirname, `../../hosted/uploads/${req.file.originalname}`);
  if (process.env.NODE_ENV === 'production') {
    targetPath = path.join(__dirname, `assets/uploads/${req.file.originalname}`);
  }
  const error = { status: 0, message: '' };

  if (path.extname(req.file.originalname).toLowerCase() === '.png' || path.extname(req.file.originalname).toLowerCase() === '.jpg') {
    fs.rename(tempPath, targetPath, (err) => {
      if (err) {
        error.status = 500;
        error.message = `Error uploading image: ${err}`;
      }
    });
    return res.json({ path: `assets/uploads/${req.file.originalname}` });
  }

  fs.unlink(tempPath, (err) => {
    if (err) {
      error.status = 500;
      error.message = `Image is not of type PNG or JPG: ${err}`;
    }
  });

  if (error.status !== 0) {
    return res.status(error.status).json({ error: error.message });
  }

  return res.status(403);
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  uploadImage,
};
