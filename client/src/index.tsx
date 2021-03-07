import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Gallery from './routes/Gallery'
import MediaDetail from './routes/MediaDetail'
import { BrowserRouter as Router, Route } from 'react-router-dom'

ReactDOM.render(
  <Router>
    <Route path="/:mediaType?" component={Gallery} />
    <Route path="/media/:mediaType/:id" component={MediaDetail} />
  </Router>,
  document.getElementById('root'),
)
