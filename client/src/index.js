import React from 'react'
import { render } from 'react-dom'
import axios from 'axios'

const PhotoThumbnail = ({ onClick, id }) => (
  <img
    style={{
      margin: 15,
      border: '1px solid rgba(255,255,255,.5)',
      width: 200,
      height: 200,
      cursor: 'pointer',
    }}
    onClick={onClick}
    src={`/photos/${id}/thumbnails/small.jpg`}
  />
)

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      albumsIndex: [],
      albums: {},
      selectedAlbumId: null,
    }
  }

  componentDidMount() {
    axios.get('/albums').then(response => {
      this.setState({ albumsIndex: response.data.albums })
    })
  }

  render() {
    return (
      <div style={{ padding: 15 }}>
        {this.state.selectedAlbumId &&
          this.state.albums[this.state.selectedAlbumId] &&
          this.state.albums[this.state.selectedAlbumId].map(photo => (
            <PhotoThumbnail key={photo.id} id={photo.id} />
          ))}

        {!this.state.selectedAlbumId &&
          this.state.albumsIndex.map(album => (
            <PhotoThumbnail
              id={album.coverPhotoId}
              key={album.coverPhotoId}
              onClick={() => {
                this.setState({ selectedAlbumId: album.id })

                axios.get(`/albums/${album.id}`).then(response => {
                  this.setState({ albums: { ...this.state.albums, [album.id]: response.data } })
                })
              }}
            />
          ))}
      </div>
    )
  }
}

render(<App />, document.getElementById('root'))
