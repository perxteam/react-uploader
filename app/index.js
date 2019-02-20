import Promise from 'promise-polyfill'
import React from 'react'
import { render } from 'react-dom'
import Uploader from 'components/Uploader'

// To add to window
if (!window.Promise) {
  window.Promise = Promise
}

if (module.hot) {
  module.hot.accept()
}

class UploaderContainer extends React.Component {
  state = {
    files: [],
  }

  handleChange = (value) => {
    console.log('files changed:', value)
    this.setState({ files: value })
  }

  reset = () => {
    this.setState({ files: [] })
  }

  render() {
    return (
      <div>
        <Uploader
          apiUrl="http://127.0.0.1:8080/forms/api/v1/uploads"
          onChange={this.handleChange}
          totalFilesSizeLimit={20000}
          fileSizeMax={20000}
          totalFilesCount={5}
          fileExtensions='jpg,png,                      bmp,gif,     tif'
          actualDelete={false}
          value={this.state.files}
          miscFormData={{
            'form_id': '21321314fdsfdfsdnf',
          }}
        />
        <button onClick={this.reset}>Reset</button>
      </div>
    )
  }
}

function init({
  rootId = 'defaultFormId',
}) {
  const rootElement = document.getElementById(rootId)

  if (rootElement) {
    render(<UploaderContainer />, rootElement)
  }
}

window.perxUploader = {
  init,
  Component: Uploader,
}

export default Uploader
