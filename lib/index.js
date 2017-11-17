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

  if (rootElement) {
    (0, _reactDom.render)(_react2.default.createElement(_Uploader2.default, {
      onChange: handleChange,
      apiUrl: 'http://127.0.0.1:8001/attachments-upload/',
      headers: {
        'X-CSRFToken': 't5V6QZAWFR2ADPNwxdDQmtLTbXZlm28twep6k6omlFO8J3FtDOP46BqntARqwIET',
        'Cookie': 'csrftoken=t5V6QZAWFR2ADPNwxdDQmtLTbXZlm28twep6k6omlFO8J3FtDOP46BqntARqwIET'
      },
      fetchConfig: {
        credentials: 'include'
      },
      totalFilesSizeLimit: 1000,
      totalFilesCount: 5
    }), rootElement);
  }
}

window.perxUploader = {
  init: init,
  Component: _Uploader2.default
};

exports.default = _Uploader2.default;