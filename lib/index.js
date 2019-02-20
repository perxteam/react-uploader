'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

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

var UploaderContainer = function (_React$Component) {
  (0, _inherits3.default)(UploaderContainer, _React$Component);

  function UploaderContainer() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, UploaderContainer);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = UploaderContainer.__proto__ || (0, _getPrototypeOf2.default)(UploaderContainer)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      files: []
    }, _this.handleChange = function (value) {
      console.log('files changed:', value);
      _this.setState({ files: value });
    }, _this.reset = function () {
      _this.setState({ files: [] });
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(UploaderContainer, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_Uploader2.default, {
          apiUrl: 'http://127.0.0.1:8080/forms/api/v1/uploads',
          onChange: this.handleChange,
          totalFilesSizeLimit: 20000,
          fileSizeMax: 20000,
          totalFilesCount: 5,
          fileExtensions: 'jpg,png,                      bmp,gif,     tif',
          actualDelete: false,
          value: this.state.files,
          miscFormData: {
            'form_id': '21321314fdsfdfsdnf'
          }
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