import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { GalleryProvider } from './gallery'
import Gallery from './routes/Gallery'
import MediaDetail from './routes/MediaDetail'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

ReactDOM.render(
  <GalleryProvider>
    <Router>
      <Route path="/" component={Gallery} />
      <Route path="/media/:mediaType/:id" component={MediaDetail} />
    </Router>
  </GalleryProvider>,
  document.getElementById('root'),
)
