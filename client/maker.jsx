const React = require('react');
const ReactDOM = require('react-dom/client');
const helper = require('./helper.js');

const domosRoot = ReactDOM.createRoot(document.getElementById('domos'));
const makeRoot = ReactDOM.createRoot(document.getElementById('makeDomo'));

const DomoList = (props) => {
  if (props.domos.length === 0) {
    return (<div className="domoList">
      <h3 className="emptyDomo">No Domos Yet!</h3>
    </div>);
  }

  const domoNodes = props.domos.map((domo) => (
    <div key={domo._id} className="domo">
      <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
      <h3 className="domoName">Name: {domo.name}</h3>
      <h3 className="domoAge">Age: {domo.age}</h3>
    </div>
  ));

  return <div className="domoList">
    {domoNodes}
  </div>;
};

DomoList.propTypes = {
  domos: [],
};

const loadDomosFromServer = async () => {
  const response = await fetch('/getDomos');
  const data = await response.json();
  domosRoot.render(<DomoList domos={data.domos} />);
};

const handleDomo = (e) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#domoName').value;
  const age = e.target.querySelector('#domoAge').value;

  if (!name || !age) {
    helper.handleError('All fields are required!');
    return false;
  }

  helper.sendPost(e.target.action, { name, age }, loadDomosFromServer);

  return false;
};

const DomoForm = (props) => (
  <form
    id="domoForm"
    name="domoForm"
    onSubmit={handleDomo}
    action="/maker"
    method="POST"
    className="domoForm"
    {...props}
  >
    <label htmlFor="name">Name: </label>
    <input id="domoName" type="text" name="name" placeholder="Domo Name" />

    <label htmlFor="age">Age: </label>
    <input id="domoAge" type="number" min="0" name="age" />

    <input className="makeDomoSubmit" type="submit" value="Make Domo" />
  </form>
);

const init = () => {
  makeRoot.render(<DomoForm />);

  domosRoot.render(<DomoList domos={[]} />);

  loadDomosFromServer();
};

window.onload = init;
