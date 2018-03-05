'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class, _temp, _initialiseProps, _Uploader$propTypes;

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
};

var Uploader = (_temp = _class = function (_Component) {
  _inherits(Uploader, _Component);

  function Uploader(props) {
    _classCallCheck(this, Uploader);

    var _this = _possibleConstructorReturn(this, (Uploader.__proto__ || Object.getPrototypeOf(Uploader)).call(this, props));

    _initialiseProps.call(_this);

    var fileExtensions = props.fileExtensions;

    _this.state = _extends({}, initialState, {
      fileExtensions: fileExtensions && fileExtensions.replace(/ /g, '').split(',').join(', ')
    });
    return _this;
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
}(_react.Component), _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.addFile = function (event) {
    event.preventDefault();
    _this3.fileInput.click();
  };

  this.removeFile = function (file) {
    return function () {
      var _props2 = _this3.props,
          apiUrl = _props2.apiUrl,
          method = _props2.method,
          headers = _props2.headers,
          fetchConfig = _props2.fetchConfig,
          trailingSlash = _props2.trailingSlash,
          actualDelete = _props2.actualDelete;


      if (!apiUrl) return undefined;
      if (!actualDelete) {
        _this3.handleRemove(file);
        return undefined;
      }

      var url = apiUrl.slice(-1) === '/' ? '' + apiUrl + file.id : apiUrl + '/' + file.id;
      url = trailingSlash ? url + '/' : url;
      (0, _isomorphicFetch2.default)(url, _extends({
        method: 'DELETE',
        headers: headers
      }, fetchConfig)).then(_this3.onRemovedSubmit(file)).catch(_this3.onError);
    };
  };

  this.onRemovedSubmit = function (file) {
    return function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          if (data.result === 'success') {
            _this3.handleRemove(file);
          }
        });
      } else {
        var status = response.status,
            statusText = response.statusText;

        _this3.setState(_ramda2.default.assocPath(['errors', 'networkError'], 'Error: ' + statusText + ' (' + status + ')'));
      }
    };
  };

  this.handleRemove = function (file) {
    var files = _ramda2.default.reject(_ramda2.default.propEq('id', file.id), _this3.state.files);
    var _state2 = _this3.state,
        totalSize = _state2.totalSize,
        errors = _state2.errors;

    var size = totalSize - file.size;
    _this3.setState({ totalSize: size, files: files });
    var _props3 = _this3.props,
        totalFilesSizeLimit = _props3.totalFilesSizeLimit,
        onChange = _props3.onChange;

    onChange(files);
    if (totalFilesSizeLimit && size <= totalFilesSizeLimit * 1024) {
      _this3.setState(_ramda2.default.dissocPath(['errors', 'totalFilesSizeLimit']));
    }

    if (files.length < _this3.props.totalFilesCount) {
      _this3.setState(_ramda2.default.dissocPath(['errors', 'totalFilesCount']));
    }
  };

  this.onAddSubmit = function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        _this3.setState(_ramda2.default.over(_ramda2.default.lensProp('files'), _ramda2.default.append(data)), function () {
          _this3.props.onChange(_this3.state.files);
        });
      });
    } else {
      var status = response.status,
          statusText = response.statusText;

      _this3.setState(_ramda2.default.assocPath(['errors', 'networkError'], 'Error: ' + statusText + ' (' + status + ')'));
    }
  };

  this.onError = function (response) {
    console.warn('error response', response);
  };

  this.processError = function (_ref) {
    var template = _ref.template,
        argument = _ref.args.argument;

    return template.replace('{}', argument);
  };

  this.handleUpload = function (event) {
    var newfiles = event.target.files;
    var _props4 = _this3.props,
        apiUrl = _props4.apiUrl,
        onChangeFilesSelection = _props4.onChangeFilesSelection,
        method = _props4.method,
        headers = _props4.headers,
        fetchConfig = _props4.fetchConfig,
        totalFilesCount = _props4.totalFilesCount,
        fileSizeMin = _props4.fileSizeMin,
        fileSizeMax = _props4.fileSizeMax,
        totalFilesSizeLimit = _props4.totalFilesSizeLimit,
        trailingSlash = _props4.trailingSlash,
        errorProcessor = _props4.errorProcessor,
        fileSizeMaxError = _props4.fileSizeMaxError,
        fileSizeMaxErrorKey = _props4.fileSizeMaxErrorKey,
        fileSizeMinError = _props4.fileSizeMinError,
        fileSizeMinErrorKey = _props4.fileSizeMinErrorKey,
        totalFilesCountError = _props4.totalFilesCountError,
        totalFilesCountErrorKey = _props4.totalFilesCountErrorKey,
        totalFilesSizeLimitError = _props4.totalFilesSizeLimitError,
        totalFilesSizeLimitErrorKey = _props4.totalFilesSizeLimitErrorKey,
        fileExtensionsError = _props4.fileExtensionsError,
        fileExtensionsErrorKey = _props4.fileExtensionsErrorKey;


    if (!apiUrl) return;

    onChangeFilesSelection(newfiles);
    var _state3 = _this3.state,
        files = _state3.files,
        totalSize = _state3.totalSize,
        errors = _state3.errors;
    var fileExtensions = _this3.state.fileExtensions;


    var processError = errorProcessor || _this3.processError;
    var uploadResult = Array.prototype.map.call(newfiles, function (file, index) {
      if (files.length + index + 1 > totalFilesCount) {
        var error = processError({
          key: totalFilesCountErrorKey,
          template: totalFilesCountError,
          args: { argument: totalFilesCount }
        });
        return { totalFilesCount: error };
      }

      var size = totalSize + file.size;
      if (totalFilesSizeLimit && size > totalFilesSizeLimit * 1024) {
        var _error = processError({
          key: totalFilesSizeLimitErrorKey,
          template: totalFilesSizeLimitError,
          args: { argument: totalFilesSizeLimit / 1000 }
        });
        return { totalFilesSizeLimit: _error };
      }

      if (file.size < fileSizeMin * 1024) {
        var _error2 = processError({
          key: fileSizeMinErrorKey,
          template: fileSizeMinError,
          args: { argument: fileSizeMin / 1000 }
        });
        return { fileSizeMin: _error2 };
      }

      if (file.size >= fileSizeMax * 1024) {
        var _error3 = processError({
          key: fileSizeMaxErrorKey,
          template: fileSizeMaxError,
          args: { argument: fileSizeMax / 1000 }
        });
        return { fileSizeMax: _error3 };
      }

      var extension = file.name.indexOf('.') !== -1 ? _ramda2.default.compose(_ramda2.default.toLower, _ramda2.default.last, _ramda2.default.split('.'), _ramda2.default.prop('name'))(file) : undefined;

      if (fileExtensions && (!extension || fileExtensions.replace(/ /g, '').split(',').indexOf(extension) === -1)) {
        var _error4 = processError({
          key: fileExtensionsErrorKey,
          template: fileExtensionsError,
          args: { argument: fileExtensions }
        });
        return { fileExtensionsError: _error4 };
      }

      totalSize = size;
      _this3.setState(_ramda2.default.evolve({ errors: _ramda2.default.empty }));

      var formData = new FormData();
      var miscFormData = _this3.props.miscFormData;

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
      }, fetchConfig)).then(_this3.onAddSubmit).catch(_this3.onError);
    });

    var uploadErrors = _ramda2.default.compose(_ramda2.default.reduce(function (result, current) {
      return _ramda2.default.merge(result, current);
    }, {}),
    // Leave only errors objects, reject successful uploads
    _ramda2.default.reject(function (item) {
      return item instanceof Promise;
    }))(uploadResult);

    _this3.setState(_ramda2.default.merge(_ramda2.default.__, {
      errors: uploadErrors,
      totalSize: totalSize
    }));
    _this3.resetFileInput();
  };

  this.resetFileInput = function () {
    _this3.fileInput.value = '';
    if (!/safari/i.test(navigator.userAgent)) {
      _this3.fileInput.type = '';
      _this3.fileInput.type = 'file';
    }
  };
}, _temp);


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
  filenameField: 'filename',
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