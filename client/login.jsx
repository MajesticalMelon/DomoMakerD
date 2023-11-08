const React = require('react');
const ReactDOM = require('react-dom/client');
const helper = require('./helper.js');

const contentRoot = ReactDOM.createRoot(document.getElementById('content'));

const handleLogin = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  if (!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass });

  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  helper.hideError();

  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;

  if (!username || !pass || !pass2) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  if (pass !== pass2) {
    helper.handleError('Passwords do not match!');
    return false;
  }

  helper.sendPost(e.target.action, { username, pass, pass2 });

  return false;
};

const LoginWindow = (props) => (
    <form
      id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
      {...props}
    >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username" />

      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password" />

      <input className="formSubmit" type="submit" value="Sign in" />
    </form>
);

const SignupWindow = (props) => (
  <form
    id="signupForm"
    name="loginForm"
    onSubmit={handleSignup}
    action="/signup"
    method="POST"
    className="mainForm"
    {...props}
  >
    <label htmlFor="username">Username: </label>
    <input id="user" type="text" name="username" placeholder="username" />

    <label htmlFor="pass">Password: </label>
    <input id="pass" type="password" name="pass" placeholder="password" />

    <label htmlFor="pass2">Password: </label>
    <input id="pass2" type="password" name="pass2" placeholder="retype password" />

    <input className="formSubmit" type="submit" value="Sign up" />
  </form>
);

const init = () => {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    contentRoot.render(<LoginWindow />);
    return false;
  });

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    contentRoot.render(<SignupWindow />);
    return false;
  });

  contentRoot.render(<LoginWindow />);
};

window.onload = init;
