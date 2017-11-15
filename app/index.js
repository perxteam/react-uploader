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

//  formId, apiRoot, onSubmit, onError, onInit,
//  dataProcessor = data => data,
//  rootId = 'defaultFormId',
//
//        formId={formId}
//        onSubmit={onSubmit}
//        onError={onError}
//        onInit={onInit}
//        apiRoot={apiRoot}
//        dataProcessor={dataProcessor}
function init({
  rootId = 'defaultFormId',
}) {
  const rootElement = document.getElementById(rootId)

  console.log('rootElement', rootElement)
  if (rootElement) {
    render(
      <Uploader />,
      rootElement
    )
  }
}

window.perxUploader = {
  init,
  Component: Uploader,
}

