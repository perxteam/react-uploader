'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Uploader = require('./components/Uploader.js');

var _Uploader2 = _interopRequireDefault(_Uploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// To add to window
if (!window.Promise) {
  window.Promise = _promisePolyfill2.default;
}

if (module.hot) {
  module.hot.accept();
}

/* eslint-disable global-require */
if (!global._babelPolyfill) {
  require('babel-polyfill');
}

function handleChange(value) {
  console.log('files changed:', value);
}

function init(_ref) {
  var _ref$rootId = _ref.rootId,
      rootId = _ref$rootId === undefined ? 'defaultFormId' : _ref$rootId;

  var rootElement = document.getElementById(rootId);

  console.log('rootElement', rootElement);
  if (rootElement) {
    (0, _reactDom.render)(_react2.default.createElement(_Uploader2.default, {
      onChange: handleChange,
      apiUrl: 'http://127.0.0.1:8001/attachments-upload/',
      headers: {
        'X-CSRFToken': 'gRNeMHWm7q5dnKkMnheghjA7u2kenRbXdO9yYG2vOYv6ZfmkyydO2yXlLwIayB9s',
        'Cookie': 'csrftoken=gRNeMHWm7q5dnKkMnheghjA7u2kenRbXdO9yYG2vOYv6ZfmkyydO2yXlLwIayB9s'
      },
      fetchConfig: {
        credentials: 'include'
      },
      totalFilesSizeLimit: 1000,
      totalFilesCount: 5,
      fileSizeMin: 0,
      fileSizeMax: 1000,
      fileExtensions: 'go, log'
    }), rootElement);
  }
}

window.perxUploader = {
  init: init,
  Component: _Uploader2.default
};

exports.default = _Uploader2.default;