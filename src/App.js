import React, { useState } from 'react';

import 'rsuite/dist/styles/rsuite-default.css';
import './App.scss';

import ClassLoginForm from './components/LoginForm/LoginForm';
import LoginForm from './component-func/LoginForm/LoginForm';

function App() {
  const [count, setCount] = useState(0);
	
  return (
    <div className="App">
      <div>
        <h2>Class component</h2>
        <ClassLoginForm />
      </div>
      <div>
        <h2>Functional component</h2>
        <LoginForm />
      </div>
      <div className='footer'>
        <p>You clicked {count} times</p>
        <button 
          onClick={() => setCount(count + 1)}
        >
          Click me
        </button>
      </div>
    </div>
  );
}

export default App;
