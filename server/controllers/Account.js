const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({
      username, password: hash, imageKeys: [], images: [],
    });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }

    return res.status(500).json({ error: 'An error occurred!' });
  }
};

// https://stackoverflow.com/questions/15772394/how-to-upload-display-and-save-images-using-node-js-and-express
const uploadImage = async (req, res) => {
  if (!req.body.image || !req.body.name) return res.status(500).json({ error: 'Missing name or base64 image string!' });

  try {
    req.session.account.imageKeys.push(req.body.name);
    req.session.account.images.push(req.body.image);
    return res.status(200).json({ imageName: req.body.name });
  } catch (ex) {
    return res.status(500).json({ error: ex });
  }
};

const getImage = async (req, res) => {
  if (!req.params.key) return res.status(500).json({ error: 'Missing image key!' });

  try {
    const index = req.session.account.imageKeys.findIndex((key) => key === req.params.key);
    return res.status(200).json({ image: req.session.account.images[index] });
  } catch (ex) {
    return res.status(500).json({ error: ex });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  uploadImage,
  getImage,
};
