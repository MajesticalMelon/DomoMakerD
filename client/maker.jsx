const React = require('react');
const ReactDOM = require('react-dom/client');
const helper = require('./helper.js');

const domosRoot = ReactDOM.createRoot(document.getElementById('domos'));
const makeRoot = ReactDOM.createRoot(document.getElementById('makeDomo'));

const DomoList = (props) => {
  const [domos, setDomos] = React.useState([]);

  React.useEffect(() => {
    setDomos(props.domos);
  }, [props.domos]);

  if (domos.length === 0) {
    return (<div className="domoList">
      <h3 className="emptyDomo">No Domos Yet!</h3>
    </div>);
  }

  const domoNodes = domos.map((domo) => (
    <div key={domo._id} className="domo">
      <img src={ domo.image || '/assets/img/domoface.jpeg'} alt="domo face" className="domoFace" />
      <h3 className="domoName">Name: {domo.name}</h3>
      <h3 className="domoAge">Age: {domo.age}</h3>
      <button className="domoDelete" onClick={() => {
        fetch(`/delete/${domo.name}/${domo.age}`, { method: 'DELETE' }).then((res) => {
          res.json().then((data) => {
            setDomos(data.domos);
          });
        });
      }}><img src="/assets/img/cross.svg" alt="domo delete" className="domoDelete" /></button>
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

const handleDomo = async (e) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#domoName').value;
  const age = e.target.querySelector('#domoAge').value;
  const image = e.target.querySelector('#domoImage').files[0];

  if (!name || !age) {
    helper.handleError('All fields are required!');
    return false;
  }

  const waitForFileLoad = () => new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = async () => {
      await helper.sendPost(
        e.target.action,
        { name, age, image: reader.result },
        loadDomosFromServer,
      );
      resolve();
    };
    reader.readAsDataURL(image);
  });

  if (image) {
    await waitForFileLoad();
  } else {
    await helper.sendPost(
      e.target.action,
      { name, age },
      loadDomosFromServer,
    );
  }

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
      <label htmlFor="image">Image: </label>
      <input
        type="file"
        id="domoImage"
        name="image"
        accept="image/png, image/jpeg"
      />
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
