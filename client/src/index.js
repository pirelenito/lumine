import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'

const MediaThumbnail = ({ onClick, id }) => (
  <img
    style={{
      margin: 15,
      border: '1px solid rgba(255,255,255,.5)',
      width: 200,
      height: 200,
      cursor: 'pointer',
    }}
    onClick={onClick}
    src={`/media/${id}/preview.jpg`}
  />
)

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      albums: [],
      selectedAlbumId: null,
    }
  }

  componentDidMount() {
    axios.get('/albums').then(response => {
      this.setState({ albums: response.data.albums })
    })
  }

  render() {
    const selectedAlbum =
      this.state.selectedAlbumId &&
      this.state.albums.find(album => album.id === this.state.selectedAlbumId)

    return (
      <div style={{ padding: 15 }}>
        {selectedAlbum
          ? selectedAlbum.medias.map(media => <MediaThumbnail key={media.id} id={media} />)
          : this.state.albums.map(album => (
              <MediaThumbnail
                key={album.id}
                id={album.medias[0]}
                onClick={() => {
                  this.setState({ selectedAlbumId: album.id })
                }}
              />
            ))}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
