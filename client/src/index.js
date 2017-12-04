import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      albums: [],
    }
  }

  componentDidMount() {
    axios.get('/albums').then(response => {
      this.setState(response.data)
    })
  }

  render() {
    return (
      <div style={{ padding: 15 }}>
        {this.state.albums.map(album => (
          <img
            style={{
              margin: 15,
              border: '1px solid rgba(255,255,255,.5)',
              width: 200,
              height: 200,
              cursor: 'pointer',
            }}
            key={album.id}
            onClick={() => this.setState({ selected: { album: album.id } })}
            src={`/photos/${album.coverPhotoId}/thumbnails/small.jpg`}
          />
        ))}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
