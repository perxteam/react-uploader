'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var Uploader = function (_Component) {
  _inherits(Uploader, _Component);

  function Uploader() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Uploader);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Uploader.__proto__ || Object.getPrototypeOf(Uploader)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      files: [],
      totalSize: 0,
      errors: {}
    }, _this.addFile = function () {
      _this.fileInput.click();
    }, _this.removeFile = function (file) {
      return function () {
        var _this$props = _this.props,
            apiUrl = _this$props.apiUrl,
            method = _this$props.method,
            headers = _this$props.headers,
            fetchConfig = _this$props.fetchConfig;


        (0, _isomorphicFetch2.default)('' + apiUrl + file.id + '/', _extends({
          method: 'DELETE',
          headers: headers
        }, fetchConfig)).then(_this.onRemovedSubmit(file)).catch(_this.onError);
      };
    }, _this.onRemovedSubmit = function (file) {
      return function (response) {
        return response.json().then(function (data) {
          if (data.result === 'success') {
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
          }
        });
      };
    }, _this.onAddSubmit = function (response) {
      response.json().then(function (data) {
        _this.setState(_ramda2.default.over(_ramda2.default.lensProp('files'), _ramda2.default.append(data)), function () {
          _this.props.onChange(_this.state.files);
        });
      });
    }, _this.onError = function (response) {
      console.warn('error response', response);
    }, _this.handleUpload = function (event) {
      var newfiles = event.target.files;
      var _this$props3 = _this.props,
          apiUrl = _this$props3.apiUrl,
          onChangeFilesSelection = _this$props3.onChangeFilesSelection,
          method = _this$props3.method,
          headers = _this$props3.headers,
          fetchConfig = _this$props3.fetchConfig,
          totalFilesCount = _this$props3.totalFilesCount,
          totalFilesCountError = _this$props3.totalFilesCountError,
          fileSizeMin = _this$props3.fileSizeMin,
          fileSizeMinError = _this$props3.fileSizeMinError,
          fileSizeMax = _this$props3.fileSizeMax,
          fileSizeMaxError = _this$props3.fileSizeMaxError,
          totalFilesSizeLimit = _this$props3.totalFilesSizeLimit,
          totalFilesSizeLimitError = _this$props3.totalFilesSizeLimitError,
          fileExtensions = _this$props3.fileExtensions,
          fileExtensionsError = _this$props3.fileExtensionsError;


      onChangeFilesSelection(newfiles);
      var _this$state2 = _this.state,
          files = _this$state2.files,
          totalSize = _this$state2.totalSize,
          errors = _this$state2.errors;


      Array.prototype.every.call(newfiles, function (file, index) {
        if (files.length + index + 1 > totalFilesCount) {
          var error = totalFilesCountError.replace('{}', totalFilesCount);
          _this.setState(_ramda2.default.assocPath(['errors', 'totalFilesCount'], error));
          return false;
        }

        var size = totalSize + file.size;
        if (totalFilesSizeLimit && size > totalFilesSizeLimit * 1024) {
          var _error = totalFilesSizeLimitError.replace('{}', totalFilesSizeLimit / 1000);
          _this.setState(_ramda2.default.assocPath(['errors', 'totalFilesSizeLimit'], _error));
          return false;
        }

        if (file.size < fileSizeMin * 1024) {
          var _error2 = fileSizeMinError.replace('{}', fileSizeMin / 1000);
          _this.setState(_ramda2.default.assocPath(['errors', 'fileSizeMin'], _error2));
          return false;
        }

        if (file.size >= fileSizeMax * 1024) {
          var _error3 = fileSizeMaxError.replace('{}', fileSizeMax / 1000);
          _this.setState(_ramda2.default.assocPath(['errors', 'fileSizeMax'], _error3));
          return false;
        }

        var extension = file.name.indexOf('.') !== -1 ? _ramda2.default.compose(_ramda2.default.toLower, _ramda2.default.last, _ramda2.default.split('.'), _ramda2.default.prop('name'))(file) : undefined;

        if (fileExtensions && (!extension || fileExtensions.replace(/ /g, '').split(',').indexOf(extension) === -1)) {
          var _error4 = fileExtensionsError.replace('{}', fileExtensions);
          _this.setState(_ramda2.default.assocPath(['errors', 'fileExtensionsError'], _error4));
          return false;
        }

        totalSize = size;
        _this.setState(_ramda2.default.evolve({ errors: _ramda2.default.empty }));

        var formData = new FormData();
        formData.append('file', file);

        return (0, _isomorphicFetch2.default)(apiUrl, _extends({
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
          hint = _props.hint;
      var _state = this.state,
          files = _state.files,
          errors = _state.errors;

      return _react2.default.createElement(
        'div',
        { className: 'files-uploader' },
        _react2.default.createElement('input', {
          ref: function ref(el) {
            _this2.fileInput = el;
          },
          type: 'file',
          multiple: isMultiple,
          onChange: this.handleUpload,
          className: 'files-uploader__file-field'
        }),
        _ramda2.default.compose(_ramda2.default.map(function (component) {
          if (component === 'uploader') {
            return _react2.default.createElement(
              'div',
              {
                key: component,
                className: 'files-uploader__add-file-button',
                onClick: _this2.addFile
              },
              addButtonLabel
            );
          }
          if (component === 'hint' && hint) {
            return _react2.default.createElement(
              'div',
              { className: 'files-uploader__hint', key: component },
              hint
            );
          }
          if (component === 'filesList' && showFilesList) {
            return _react2.default.createElement(
              'div',
              { className: 'files-uploader__files-list', key: component },
              files.map(function (file) {
                return _react2.default.createElement(
                  'div',
                  _defineProperty({ key: file.id, className: 'files-uploader-files-list__item' }, 'key', file.id),
                  _react2.default.createElement(
                    'span',
                    { className: 'files-uploader-files-list__item-name' },
                    file.name
                  ),
                  _react2.default.createElement(
                    'button',
                    {
                      className: 'files-uploader-files-list__item-remove',
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
              { className: 'files-uploader__errors', key: component },
              Object.keys(errors).map(function (key) {
                return _react2.default.createElement(
                  'div',
                  { key: key, className: 'files-uploader__errors-error' },
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

Uploader.propTypes = {
  onChange: _propTypes2.default.func.isRequired,
  apiUrl: _propTypes2.default.string.isRequired,
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
  // Количество файлов которое пользователь может приложить
  totalFilesCount: _propTypes2.default.number,
  // Сообщение об ошибке при превышении totalFilesCount
  totalFilesCountError: _propTypes2.default.string,
  // Минимальный размер одного файла (в Кб)
  fileSizeMin: _propTypes2.default.number,
  // Сообщение об ошибке если размер файла меньше fileSizeMin
  fileSizeMinError: _propTypes2.default.string,
  // Максимальный размер одного файла (в Кб)
  fileSizeMax: _propTypes2.default.number,
  // Сообщение об ошибке если размер файла больше fileSizeMax
  fileSizeMaxError: _propTypes2.default.string,
  // Максимальный общий размер приложенных файлов (В Кб)
  totalFilesSizeLimit: _propTypes2.default.number,
  // Сообщение об ошибке если суммарный размер файлов превышает totalFilesSizeLimit
  totalFilesSizeLimitError: _propTypes2.default.string,
  // Разрешенные расширения через запятую
  fileExtensions: _propTypes2.default.string,
  // Сообщение об ошибке если указан файл с запрещенным расширением
  fileExtensionsError: _propTypes2.default.string,
  // Пояснительный текст
  hint: _propTypes2.default.string
};

Uploader.defaultProps = {
  isMultiple: true,
  method: 'POST',
  headers: {},
  fetchConfig: {},
  addButtonLabel: 'Добавить файлы',
  removeButtonLabel: 'Удалить',
  onChangeFilesSelection: noop,
  componentContents: ['hint', 'uploader', 'filesList', 'errorsList'],
  showFilesList: true,
  showErrorsList: true,
  totalFilesCount: 1,
  totalFilesCountError: 'Вы не можете загрузить более {} файлов',
  fileSizeMin: 0,
  fileSizeMinError: 'Размер файла не может быть меньше {} МБ',
  fileSizeMax: 10000,
  fileSizeMaxError: 'Размер файла не может превышать {} МБ',
  totalFilesSizeLimit: 20000,
  totalFilesSizeLimitError: 'Суммарный размер файлов не может превышать {} МБ',
  fileExtensions: undefined,
  fileExtensionsError: 'Поддерживаемые форматы файлов: {}',
  hint: undefined
};

exports.default = Uploader;