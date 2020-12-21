import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './widgets/main/App'

/*
 * Material UI still use findDOMNode so we can't use StrictMode
 * without seeing tons of warnings "Warning: findDOMNode is deprecated in StrictMode."
 *
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
*/
ReactDOM.render(<App />, document.getElementById('root'))
