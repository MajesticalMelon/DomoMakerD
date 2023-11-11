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

const deleteDomo = async (req, res) => {
  if (!req.params.name || !req.params.age) return res.status(500).json({ error: 'Name and age are required fields!' });

  try {
    await Domo.deleteOne({ name: req.params.name, age: req.params.age });
    const domos = await Domo.find({ owner: req.session.account._id });
    return res.status(200).json({ domos });
  } catch (ex) {
    return res.status(404).json({ error: 'Could not find Domo to delete!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};
