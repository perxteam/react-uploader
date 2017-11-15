import React, { Component } from "react"
import PropTypes from 'prop-types'
import R from 'ramda'
import fetch from 'isomorphic-fetch'

function noop() {}

class Uploader extends Component {
  state = {
    files: [],
    totalSize: 0,
    errors: {},
  }

  addFile = () => {
    this.fileInput.click()
  }

  removeFile = file => () => {
    const {
      apiUrl,
      method,
      headers,
      fetchConfig,
    } = this.props

    fetch(`${apiUrl}${file.id}/`, {
      method: 'DELETE',
      headers,
      ...fetchConfig,
    })
      .then(this.onRemovedSubmit(file))
      .catch(this.onError)
  }

  onRemovedSubmit = file => response => response.json()
    .then(data => {
      if (data.result === 'success') {
        const files = R.reject(R.propEq('id', file.id), this.state.files)
        const { totalSize, errors } = this.state
        const size = totalSize - file.size
        this.setState({ totalSize: size, files })
        const { totalFilesSizeLimit, onChange } = this.props
        onChange(files)
        if (totalFilesSizeLimit && size <= totalFilesSizeLimit * 1024) {
          this.setState(R.dissocPath(['errors', 'totalFilesSizeLimit']))
        }

        if (files.length < this.props.totalFilesCount) {
          this.setState(R.dissocPath(['errors', 'totalFilesCount']))
        }
      }
    })

  onAddSubmit = response => {
    response.json()
      .then(data => {
        this.setState(R.over(R.lensProp('files'), R.append(data)), () => {
          this.props.onChange(this.state.files)
        })
      })
  }

  onError = response => {
    console.warn('error response', response)
  }

  handleUpload = event => {
    const newfiles = event.target.files
    const {
      apiUrl,
      onChangeFilesSelection,
      method,
      headers,
      fetchConfig,
      totalFilesCount,
      totalFilesCountError,
      fileSizeMin,
      fileSizeMinError,
      fileSizeMax,
      fileSizeMaxError,
      totalFilesSizeLimit,
      totalFilesSizeLimitError,
      fileExtensions,
      fileExtensionsError,
    } = this.props

    onChangeFilesSelection(newfiles)
    let { files, totalSize, errors } = this.state

    Array.prototype.every.call(newfiles, (file, index) => {
      if (files.length + index + 1 > totalFilesCount) {
        const error = totalFilesCountError.replace('{}', totalFilesCount)
        this.setState(R.assocPath(['errors', 'totalFilesCount'], error))
        return false
      }

      const size = totalSize + file.size
      if (totalFilesSizeLimit && size > totalFilesSizeLimit * 1024) {
        const error = totalFilesSizeLimitError.replace('{}', totalFilesSizeLimit / 1000)
        this.setState(R.assocPath(['errors', 'totalFilesSizeLimit'], error))
        return false
      }

      if (file.size < fileSizeMin * 1024) {
        const error = fileSizeMinError.replace('{}', fileSizeMin / 1000)
        this.setState(R.assocPath(['errors', 'fileSizeMin'], error))
        return false
      }

      if (file.size >= fileSizeMax * 1024) {
        const error = fileSizeMaxError.replace('{}', fileSizeMax / 1000)
        this.setState(R.assocPath(['errors', 'fileSizeMax'], error))
        return false
      }

      const extension = file.name.indexOf('.') !== -1
        ? R.compose(
            R.toLower,
            R.last,
            R.split('.'),
            R.prop('name')
          )(file)
        : undefined

      if (
        fileExtensions && (!extension ||
        fileExtensions.replace(/ /g, '').split(',').indexOf(extension) === -1)
      ) {
        const error = fileExtensionsError.replace('{}', fileExtensions)
        this.setState(R.assocPath(['errors', 'fileExtensionsError'], error))
        return false
      }

      totalSize = size
      this.setState(R.evolve({ errors: R.empty }))

      const formData = new FormData
      formData.append('file', file)

      return fetch(apiUrl, {
        method,
        headers,
        body: formData,
        ...fetchConfig,
      })
        .then(this.onAddSubmit)
        .catch(this.onError)
    })

    this.setState(R.assoc('totalSize', totalSize))
    this.resetFileInput()
  }

  resetFileInput = () => {
      this.fileInput.value = ''
      if(!/safari/i.test(navigator.userAgent)){
          this.fileInput.type = ''
          this.fileInput.type = 'file'
      }
  }

  render() {
    const {
      isMultiple,
      addButtonLabel,
      removeButtonLabel,
      showFilesList,
      showErrorsList,
      componentContents,
      hint,
    } = this.props
    const {
      files,
      errors,
    } = this.state
    return (
      <div className='files-uploader'>
        <input
          ref={(el) => { this.fileInput = el }}
          type="file"
          multiple={isMultiple}
          onChange={this.handleUpload}
          className="files-uploader__file-field"
          style={{ display: 'none' }}
        />
        {
          componentContents.map(component => {
            if (component === 'uploader') {
              return (
                <div
                  className="files-uploader__add-file-button"
                  style={{
                    cursor: 'pointer',
                    backgroundColor: '#ff9c9c',
                    color: 'azure',
                    display: 'inline-block',
                    padding: 10,
                  }}
                  onClick={this.addFile}
                >
                  {addButtonLabel}
                </div>
              )
            }
            if (component === 'hint') {
              return (
                <div className="files-uploader__hint">{hint}</div>
              )
            }
            if (component === 'filesList' && showFilesList) {
              return (
                <div className="files-uploader__files-list">
                  {
                    files.map(file =>
                      <div className="files-uploader-files-list__item" key={file.id}>
                        <span className="files-uploader-files-list__item-name">{file.name}</span>
                        <button
                          className="files-uploader-files-list__item-remove"
                          type="button"
                          onClick={this.removeFile(file)}
                        >{removeButtonLabel}</button>
                      </div>
                    )
                  }
                </div>
              )
            }
            if (component === 'errorsList' &&
              showErrorsList &&
              errors &&
              Object.keys(errors).length
            ) {
              return (
                <div className="files-uploader__errors">
                  {
                    Object.keys(errors).map(key =>
                      <div key={key} className="files-uploader__errors-error">{errors[key]}</div>
                    )
                  }
                </div>
              )
            }
            return null
          })
        }
      </div>
    )
  }
}

Uploader.propTypes = {
  onChange: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
  isMultiple: PropTypes.bool,
  method: PropTypes.string,
  headers: PropTypes.object,
  fetchConfig: PropTypes.object,
  addButtonLabel: PropTypes.string,
  removeButtonLabel: PropTypes.string,
  onChangeFilesSelection: PropTypes.func,
  showFilesList: PropTypes.bool,
  showErrorsList: PropTypes.bool,
  componentContents: PropTypes.arrayOf(
    PropTypes.oneOf(['hint', 'uploader', 'filesList', 'errorsList']),
  ),
	// Количество файлов которое пользователь может приложить
  totalFilesCount: PropTypes.number,
	// Сообщение об ошибке при превышении totalFilesCount
  totalFilesCountError: PropTypes.string,
  // Минимальный размер одного файла (в Кб)
  fileSizeMin: PropTypes.number,
	// Сообщение об ошибке если размер файла меньше fileSizeMin
  fileSizeMinError: PropTypes.string,
  // Максимальный размер одного файла (в Кб)
  fileSizeMax: PropTypes.number,
	// Сообщение об ошибке если размер файла больше fileSizeMax
  fileSizeMaxError: PropTypes.string,
  // Максимальный общий размер приложенных файлов (В Кб)
  totalFilesSizeLimit: PropTypes.number,
	// Сообщение об ошибке если суммарный размер файлов превышает totalFilesSizeLimit
  totalFilesSizeLimitError: PropTypes.string,
	// Разрешенные расширения через запятую
	fileExtensions: PropTypes.string,
	// Сообщение об ошибке если указан файл с запрещенным расширением
	fileExtensionsError: PropTypes.string,
	// Пояснительный текст
  hint: PropTypes.string,
}

Uploader.defaultProps = {
  isMultiple: true,
  method: 'POST',
  headers: {},
  fetchConfig: {},
  addButtonLabel: 'Добавить файлы',
  removeButtonLabel: 'Удалить',
  onChangeFilesSelection: noop,
  componentContents: [
    'hint', 'uploader', 'filesList', 'errorsList'
  ],
  showFilesList: true,
  showErrorsList: true,
  totalFilesCount: 1,
  totalFilesCountError: 'Вы не можете загрузить более {} файлов',
  fileSizeMin: 0,
  fileSizeMinError:  'Размер файла не может быть меньше {} МБ',
  fileSizeMax: 10000,
  fileSizeMaxError:  'Размер файла не может превышать {} МБ',
  totalFilesSizeLimit: 20000,
  totalFilesSizeLimitError: 'Суммарный размер файлов не может превышать {} МБ',
	fileExtensions: undefined,
	fileExtensionsError: 'Поддерживаемые форматы файлов: {}',
  hint: 'Вы можете прикрепить не более 10 файлов с расширением jpg'
}

export default Uploader
