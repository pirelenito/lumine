import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import Gallery from './routes/Gallery'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import ScanningInfoWrapper from './routes/ScanningInfoWrapper'

ReactDOM.render(
  <ScanningInfoWrapper>
    <BrowserRouter>
      <Switch>
        <Route path="/:mediaType/" component={Gallery} />
        <Redirect from="/" to="/photos" />
      </Switch>
    </BrowserRouter>
  </ScanningInfoWrapper>,
  document.getElementById('root'),
)
