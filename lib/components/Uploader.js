'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Uploader$propTypes;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _ramda = require('ramda');

var _ramda2 = _interopRequireDefault(_ramda);

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function noop() {}

var initialState = {
  files: [],
  totalSize: 0,
  errors: {}

  //export const i18nHOC = (Component) => {
  //  class WrappedComponent extends React.Component {
  //    processError = (template, argument) => {
  ////      console.log('template', template, 'argumnt', argument)
  //      console.log('processError in WrappedComponent')
  //      return 'AAAAAAAaa'
  //    }
  //
  //    render() {
  //      console.log('aaa render')
  //      return <Component
  //        {...this.props}
  //        />
  //    }
  //  }
  //
  //  return WrappedComponent
  //}

};
var Uploader = function (_Component) {
  _inherits(Uploader, _Component);

  function Uploader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Uploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Uploader.__proto__ || Object.getPrototypeOf(Uploader)).call.apply(_ref, [this].concat(args))), _this), _this.state = initialState, _this.addFile = function (event) {
      event.preventDefault();
      _this.fileInput.click();
    }, _this.removeFile = function (file) {
      return function () {
        var _this$props = _this.props,
            apiUrl = _this$props.apiUrl,
            method = _this$props.method,
            headers = _this$props.headers,
            fetchConfig = _this$props.fetchConfig,
            trailingSlash = _this$props.trailingSlash,
            actualDelete = _this$props.actualDelete;


        if (!apiUrl) return undefined;
        if (!actualDelete) {
          _this.handleRemove(file);
          return undefined;
        }

        var url = apiUrl.slice(-1) === '/' ? '' + apiUrl + file.id : apiUrl + '/' + file.id;
        url = trailingSlash ? url + '/' : url;
        (0, _isomorphicFetch2.default)(url, _extends({
          method: 'DELETE',
          headers: headers
        }, fetchConfig)).then(_this.onRemovedSubmit(file)).catch(_this.onError);
      };
    }, _this.onRemovedSubmit = function (file) {
      return function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            if (data.result === 'success') {
              _this.handleRemove(file);
            }
          });
        } else {
          var status = response.status,
              statusText = response.statusText;

          _this.setState(_ramda2.default.assocPath(['errors', 'networkError'], 'Error: ' + statusText + ' (' + status + ')'));
        }
      };
    }, _this.handleRemove = function (file) {
      var files = _ramda2.default.reject(_ramda2.default.propEq('id', file.id), _this.state.files);
      var _this$state = _this.state,
          totalSize = _this$state.totalSize,
          errors = _this$state.errors;

      var size = totalSize - file.size;
      _this.setState({ totalSize: size, files: files });
      var _this$props2 = _this.props,
          totalFilesSizeLimit = _this$props2.totalFilesSizeLimit,
          onChange = _this$props2.onChange;

      onChange(files);
      if (totalFilesSizeLimit && size <= totalFilesSizeLimit * 1024) {
        _this.setState(_ramda2.default.dissocPath(['errors', 'totalFilesSizeLimit']));
      }

      if (files.length < _this.props.totalFilesCount) {
        _this.setState(_ramda2.default.dissocPath(['errors', 'totalFilesCount']));
      }
    }, _this.onAddSubmit = function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          _this.setState(_ramda2.default.over(_ramda2.default.lensProp('files'), _ramda2.default.append(data)), function () {
            _this.props.onChange(_this.state.files);
          });
        });
      } else {
        var status = response.status,
            statusText = response.statusText;

        _this.setState(_ramda2.default.assocPath(['errors', 'networkError'], 'Error: ' + statusText + ' (' + status + ')'));
      }
    }, _this.onError = function (response) {
      console.warn('error response', response);
    }, _this.processError = function (_ref2) {
      var template = _ref2.template,
          argument = _ref2.args.argument;

      return template.replace('{}', argument);
    }, _this.handleUpload = function (event) {
      var newfiles = event.target.files;
      var _this$props3 = _this.props,
          apiUrl = _this$props3.apiUrl,
          onChangeFilesSelection = _this$props3.onChangeFilesSelection,
          method = _this$props3.method,
          headers = _this$props3.headers,
          fetchConfig = _this$props3.fetchConfig,
          totalFilesCount = _this$props3.totalFilesCount,
          fileSizeMin = _this$props3.fileSizeMin,
          fileSizeMax = _this$props3.fileSizeMax,
          totalFilesSizeLimit = _this$props3.totalFilesSizeLimit,
          fileExtensions = _this$props3.fileExtensions,
          trailingSlash = _this$props3.trailingSlash,
          errorProcessor = _this$props3.errorProcessor,
          fileSizeMaxError = _this$props3.fileSizeMaxError,
          fileSizeMaxErrorKey = _this$props3.fileSizeMaxErrorKey,
          fileSizeMinError = _this$props3.fileSizeMinError,
          fileSizeMinErrorKey = _this$props3.fileSizeMinErrorKey,
          totalFilesCountError = _this$props3.totalFilesCountError,
          totalFilesCountErrorKey = _this$props3.totalFilesCountErrorKey,
          totalFilesSizeLimitError = _this$props3.totalFilesSizeLimitError,
          totalFilesSizeLimitErrorKey = _this$props3.totalFilesSizeLimitErrorKey,
          fileExtensionsError = _this$props3.fileExtensionsError,
          fileExtensionsErrorKey = _this$props3.fileExtensionsErrorKey;


      if (!apiUrl) return;

      onChangeFilesSelection(newfiles);
      var _this$state2 = _this.state,
          files = _this$state2.files,
          totalSize = _this$state2.totalSize,
          errors = _this$state2.errors;


      var processError = errorProcessor || _this.processError;
      Array.prototype.every.call(newfiles, function (file, index) {
        if (files.length + index + 1 > totalFilesCount) {
          var error = processError({
            key: totalFilesCountErrorKey,
            template: totalFilesCountError,
            args: { argument: totalFilesCount }
          });
          _this.setState(_ramda2.default.assocPath(['errors', 'totalFilesCount'], error));
          return false;
        }

        var size = totalSize + file.size;
        if (totalFilesSizeLimit && size > totalFilesSizeLimit * 1024) {
          //        const error = processError(totalFilesSizeLimitError, totalFilesSizeLimit / 1000)
          var _error = processError({
            key: totalFilesSizeLimitErrorKey,
            template: totalFilesSizeLimitError,
            args: { argument: totalFilesSizeLimit / 1000 }
          });
          _this.setState(_ramda2.default.assocPath(['errors', 'totalFilesSizeLimit'], _error));
          return false;
        }

        if (file.size < fileSizeMin * 1024) {
          //        const error = processError(fileSizeMinError, fileSizeMin / 1000)
          var _error2 = processError({
            key: fileSizeMinErrorKey,
            template: fileSizeMinError,
            args: { argument: fileSizeMin / 1000 }
          });
          _this.setState(_ramda2.default.assocPath(['errors', 'fileSizeMin'], _error2));
          return false;
        }

        if (file.size >= fileSizeMax * 1024) {
          //        const error = processError(fileSizeMaxError, fileSizeMax / 1000)
          var _error3 = processError({
            key: fileSizeMaxErrorKey,
            template: fileSizeMaxError,
            args: { argument: fileSizeMax / 1000 }
          });
          _this.setState(_ramda2.default.assocPath(['errors', 'fileSizeMax'], _error3));
          return false;
        }

        var extension = file.name.indexOf('.') !== -1 ? _ramda2.default.compose(_ramda2.default.toLower, _ramda2.default.last, _ramda2.default.split('.'), _ramda2.default.prop('name'))(file) : undefined;

        if (fileExtensions && (!extension || fileExtensions.replace(/ /g, '').split(',').indexOf(extension) === -1)) {
          //        const error = processError(fileExtensionsError, fileExtensions)
          var _error4 = processError({
            key: fileExtensionsErrorKey,
            template: fileExtensionsError,
            args: { argument: fileExtensions }
          });
          _this.setState(_ramda2.default.assocPath(['errors', 'fileExtensionsError'], _error4));
          return false;
        }

        totalSize = size;
        _this.setState(_ramda2.default.evolve({ errors: _ramda2.default.empty }));

        var formData = new FormData();
        var miscFormData = _this.props.miscFormData;

        if (miscFormData) {
          for (var key in miscFormData) {
            formData.append(key, miscFormData[key]);
          }
        }
        formData.append('file', file);

        return (0, _isomorphicFetch2.default)(trailingSlash ? apiUrl + '/' : apiUrl, _extends({
          method: method,
          headers: headers,
          body: formData
        }, fetchConfig)).then(_this.onAddSubmit).catch(_this.onError);
      });

      _this.setState(_ramda2.default.assoc('totalSize', totalSize));
      _this.resetFileInput();
    }, _this.resetFileInput = function () {
      _this.fileInput.value = '';
      if (!/safari/i.test(navigator.userAgent)) {
        _this.fileInput.type = '';
        _this.fileInput.type = 'file';
      }
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Uploader, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var value = nextProps.value;

      if (!value.length && value !== this.props.value) {
        this.setState(initialState);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          isMultiple = _props.isMultiple,
          addButtonLabel = _props.addButtonLabel,
          removeButtonLabel = _props.removeButtonLabel,
          showFilesList = _props.showFilesList,
          showErrorsList = _props.showErrorsList,
          componentContents = _props.componentContents,
          hint = _props.hint,
          filenameField = _props.filenameField,
          cssPrefix = _props.cssPrefix;
      var _state = this.state,
          files = _state.files,
          errors = _state.errors;

      var className = cssPrefix ? cssPrefix + '__files-uploader' : 'files-uploader';

      return _react2.default.createElement(
        'div',
        { className: className },
        _react2.default.createElement('input', {
          ref: function ref(el) {
            _this2.fileInput = el;
          },
          type: 'file',
          multiple: isMultiple,
          onChange: this.handleUpload,
          className: className + '__file-field',
          style: {
            display: 'none'
          }
        }),
        _ramda2.default.compose(_ramda2.default.map(function (component) {
          if (component === 'uploader') {
            return _react2.default.createElement(
              'button',
              {
                key: component,
                className: className + '__add-file-button',
                onClick: _this2.addFile
              },
              addButtonLabel
            );
          }
          if (component === 'hint' && hint) {
            return _react2.default.createElement(
              'div',
              { className: className + '__files-uploader__hint', key: component },
              hint
            );
          }
          if (component === 'filesList' && showFilesList) {
            return _react2.default.createElement(
              'div',
              { className: className + '__files-list', key: component },
              files.map(function (file) {
                return _react2.default.createElement(
                  'div',
                  _defineProperty({ key: file.id, className: className + '-files-list__item' }, 'key', file.id),
                  _react2.default.createElement(
                    'span',
                    {
                      className: className + '-files-list__item-name'
                    },
                    file[filenameField]
                  ),
                  _react2.default.createElement(
                    'button',
                    {
                      className: className + '-files-list__item-remove',
                      type: 'button',
                      onClick: _this2.removeFile(file)
                    },
                    removeButtonLabel
                  )
                );
              })
            );
          }
          if (component === 'errorsList' && showErrorsList && errors && Object.keys(errors).length) {
            return _react2.default.createElement(
              'div',
              { className: className + '__errors', key: component },
              Object.keys(errors).map(function (key) {
                return _react2.default.createElement(
                  'div',
                  { key: key, className: className + '__errors-error' },
                  errors[key]
                );
              })
            );
          }
          return null;
        }), _ramda2.default.uniq())(componentContents)
      );
    }
  }]);

  return Uploader;
}(_react.Component);

Uploader.propTypes = (_Uploader$propTypes = {
  onChange: _propTypes2.default.func,
  apiUrl: _propTypes2.default.string,
  isMultiple: _propTypes2.default.bool,
  method: _propTypes2.default.string,
  headers: _propTypes2.default.object,
  fetchConfig: _propTypes2.default.object,
  addButtonLabel: _propTypes2.default.string,
  removeButtonLabel: _propTypes2.default.string,
  onChangeFilesSelection: _propTypes2.default.func,
  showFilesList: _propTypes2.default.bool,
  showErrorsList: _propTypes2.default.bool,
  componentContents: _propTypes2.default.arrayOf(_propTypes2.default.oneOf(['hint', 'uploader', 'filesList', 'errorsList'])),
  value: _propTypes2.default.array
}, _defineProperty(_Uploader$propTypes, 'showErrorsList', _propTypes2.default.bool), _defineProperty(_Uploader$propTypes, 'trailingSlash', _propTypes2.default.bool), _defineProperty(_Uploader$propTypes, 'cssPrefix', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'actualDelete', _propTypes2.default.bool), _defineProperty(_Uploader$propTypes, 'filenameField', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'totalFilesCount', _propTypes2.default.number), _defineProperty(_Uploader$propTypes, 'totalFilesCountError', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'totalFilesCountErrorKey', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'fileSizeMin', _propTypes2.default.number), _defineProperty(_Uploader$propTypes, 'fileSizeMinError', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'fileSizeMinErrorKey', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'fileSizeMax', _propTypes2.default.number), _defineProperty(_Uploader$propTypes, 'fileSizeMaxError', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'fileSizeMaxErrorKey', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'totalFilesSizeLimit', _propTypes2.default.number), _defineProperty(_Uploader$propTypes, 'totalFilesSizeLimitError', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'totalFilesSizeLimitErrorKey', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'fileExtensions', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'fileExtensionsError', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'fileExtensionsErrorKey', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'hint', _propTypes2.default.string), _defineProperty(_Uploader$propTypes, 'miscFormData', _propTypes2.default.object), _defineProperty(_Uploader$propTypes, 'errorProcessor', _propTypes2.default.func), _Uploader$propTypes);

Uploader.defaultProps = {
  onChange: noop,
  apiUrl: undefined,
  isMultiple: true,
  method: 'POST',
  headers: {},
  fetchConfig: {},
  addButtonLabel: 'Добавить файлы',
  removeButtonLabel: 'Удалить',
  onChangeFilesSelection: noop,
  componentContents: ['hint', 'uploader', 'filesList', 'errorsList'],
  value: [],
  showFilesList: true,
  trailingSlash: false,
  actualDelete: true,
  filenameField: 'name',
  cssPrefix: undefined,
  showErrorsList: true,
  totalFilesCount: 1,
  totalFilesCountError: 'Вы не можете загрузить более {} файлов',
  totalFilesCountErrorKey: 'filesUploaderTotalFilesCount',
  fileSizeMin: 0,
  fileSizeMinError: 'Размер файла не может быть меньше {} МБ',
  fileSizeMinErrorKey: 'filesUploaderFileSizeMin',
  fileSizeMax: 10000,
  fileSizeMaxError: 'Размер файла не может превышать {} МБ',
  fileSizeMaxErrorKey: 'filesUploaderFileSizeMax',
  totalFilesSizeLimit: 20000,
  totalFilesSizeLimitError: 'Суммарный размер файлов не может превышать {} МБ',
  totalFilesSizeLimitErrorKey: 'filesUploaderTotalFilesSizeLimit',
  fileExtensions: undefined,
  fileExtensionsError: 'Поддерживаемые форматы файлов: {}',
  fileExtensionsErrorKey: 'filesUploaderFileExtensions',
  hint: undefined,
  miscFormData: undefined,
  errorProcessor: undefined
};

exports.default = Uploader;