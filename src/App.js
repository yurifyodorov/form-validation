import React from 'react';

import 'rsuite/dist/styles/rsuite-default.css';
import './App.scss';

import DefaultForm from './components/DefaultForm/DefaultForm';
import RSuiteForm from './components/RSuiteForm/RSuiteForm';

function App() {
	
  return (
    <div className="App">
		<DefaultForm />
    <div>
    <RSuiteForm />
    </div>
		
    </div>
  );
}

export default App;
