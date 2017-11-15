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

/* eslint-disable global-require */
if (!global._babelPolyfill) {
  require('babel-polyfill')
}

function handleChange(value) {
  console.log('files changed:', value)
}

function init({
  rootId = 'defaultFormId',
}) {
  const rootElement = document.getElementById(rootId)

  console.log('rootElement', rootElement)
  if (rootElement) {
    render(
      <Uploader
        onChange={handleChange}
        apiUrl="http://127.0.0.1:8001/attachments-upload/"
        headers={{
          'X-CSRFToken': 'gRNeMHWm7q5dnKkMnheghjA7u2kenRbXdO9yYG2vOYv6ZfmkyydO2yXlLwIayB9s',
          'Cookie': 'csrftoken=gRNeMHWm7q5dnKkMnheghjA7u2kenRbXdO9yYG2vOYv6ZfmkyydO2yXlLwIayB9s',
        }}
        fetchConfig={{
          credentials: 'include',
        }}
        totalFilesSizeLimit={1000}
        totalFilesCount={5}
      />,
      rootElement
    )
  }
}

window.perxUploader = {
  init,
  Component: Uploader,
}

export default Uploader
