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
      <img src={domo.image || '/assets/img/domoface.jpeg'} alt="domo face" className="domoFace" />
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

  e.target.querySelector('#imageForm').submit();

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
    onSubmit={(e) => { handleDomo(e); }}
    action="/maker"
    method="POST"
    className="domoForm"
    style={{ display: 'flex' }}
    {...props}
  >
    <div>
      <label htmlFor="name">Name: </label>
      <input id="domoName" type="text" name="name" placeholder="Domo Name" />
    </div>

    <div>
      <label htmlFor="age">Age: </label>
      <input id="domoAge" name="age" type="number" min="0" />
    </div>

    <div>
      <form id="imageForm" name="imageForm" action="/upload" method="POST" encType="multipart/form-data">
        <label htmlFor="image">Image: </label>
        <input
          type="file"
          id="domoImage"
          name="image"
          accept="image/png, image/jpeg"
        />
      </form>
    </div>

    <input className="makeDomoSubmit" type="submit" value="Make Domo" />
  </form>
);

const init = () => {
  makeRoot.render(<DomoForm />);

  domosRoot.render(<DomoList domos={[]} />);

  loadDomosFromServer();
};

window.onload = init;
