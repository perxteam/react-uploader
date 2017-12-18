'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _promisePolyfill = require('promise-polyfill');

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _Uploader = require('./components/Uploader.js');

var _Uploader2 = _interopRequireDefault(_Uploader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var UploaderContainer = function (_React$Component) {
  _inherits(UploaderContainer, _React$Component);

  function UploaderContainer() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, UploaderContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = UploaderContainer.__proto__ || Object.getPrototypeOf(UploaderContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      files: []
    }, _this.handleChange = function (value) {
      console.log('files changed:', value);
      _this.setState({ files: value });
    }, _this.reset = function () {
      _this.setState({ files: [] });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(UploaderContainer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Uploader2.default, {
          apiUrl: 'http://127.0.0.1:8080/forms/api/v1/uploads',
          onChange: this.handleChange,
          totalFilesSizeLimit: 1000,
          totalFilesCount: 5,
          actualDelete: false,
          value: this.state.files
        }),
        _react2.default.createElement(
          'button',
          { onClick: this.reset },
          'Reset'
        )
      );
    }
  }]);

  return UploaderContainer;
}(_react2.default.Component);

function init(_ref2) {
  var _ref2$rootId = _ref2.rootId,
      rootId = _ref2$rootId === undefined ? 'defaultFormId' : _ref2$rootId;

  var rootElement = document.getElementById(rootId);

  if (rootElement) {
    (0, _reactDom.render)(_react2.default.createElement(UploaderContainer, null), rootElement);
  }
}

window.perxUploader = {
  init: init,
  Component: _Uploader2.default
};

exports.default = _Uploader2.default;