import Promise from 'promise-polyfill'
import React from 'react'
import { render } from 'react-dom'
import Uploader from 'components/Uploader'
import 'css/main.css'

// To add to window
if (!window.Promise) {
  window.Promise = Promise
}

if (module.hot) {
  module.hot.accept()
}

/* eslint-disable global-require */
if (!global._babelPolyfill) {
  require('babel-polyfill')
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
          apiUrl="http://0.0.0.0:8001/attachments-upload/"
          onChange={this.handleChange}
          totalFilesSizeLimit={1000}
          totalFilesCount={5}
          actualDelete={false}
          value={this.state.files}
          miscFormData={{
            'form_id': '21321314fdsfdfsdnf',
          }}
          headers={{
            'X-CSRFToken': 'RoWgcGvo6mNHV4IovwqxU8V7gNy2RDSdYf6TmA5w5UyWbLFOPrtyogYJdvMK0hfK',
          }}
          fetchConfig={{
            credentials: 'include'
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
