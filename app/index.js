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

  if (rootElement) {
    render(
      <Uploader
        apiUrl="http://127.0.0.1:8080/forms/api/v1/uploads"
        onChange={handleChange}
        totalFilesSizeLimit={1000}
        totalFilesCount={5}
        actualDelete={false}
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
