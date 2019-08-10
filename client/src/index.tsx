import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { GaleryProvider } from './galery'
import Galery from './routes/Galery'
import MediaDetail from './routes/MediaDetail'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

ReactDOM.render(
  <GaleryProvider>
    <Router>
      <Route path="/" component={Galery} />
      <Route path="/media/:mediaType/:id" component={MediaDetail} />
    </Router>
  </GaleryProvider>,
  document.getElementById('root'),
)
