import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Gallery from './routes/Gallery'
import MediaDetail from './routes/MediaDetail'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import ScanningInfoWrapper from './routes/ScanningInfoWrapper'

ReactDOM.render(
  <ScanningInfoWrapper>
    <Router>
      <Route path="/:mediaType?" component={Gallery} />
      <Route path="/:mediaType/:id" component={MediaDetail} />
    </Router>
  </ScanningInfoWrapper>,
  document.getElementById('root'),
)
