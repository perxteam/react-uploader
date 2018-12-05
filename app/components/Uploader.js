import React, { Component } from "react"
import PropTypes from 'prop-types'
import R from 'ramda'
import fetch from 'isomorphic-fetch'

function noop() {}

const initialState = {
  files: [],
  totalSize: 0,
  errors: {},
}

class Uploader extends Component {
  constructor(props) {
    super(props)
    const { fileExtensions } = props
    this.state = {
      ...initialState,
      fileExtensions: fileExtensions && fileExtensions.replace(/ /g, '').split(',').join(', ')
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    if (!value.length && value !== this.props.value) {
      this.setState(initialState)
    }
  }

  addFile = (event) => {
    event.preventDefault()
    this.fileInput.click()
  }

  removeFile = file => () => {
    const {
      apiUrl,
      method,
      headers,
      fetchConfig,
      trailingSlash,
      actualDelete,
    } = this.props

    if (!apiUrl) return undefined
    if (!actualDelete) {
      this.handleRemove(file)
      return undefined
    }

    let url = apiUrl.slice(-1) === '/'
      ? `${apiUrl}${file.id}`
      : `${apiUrl}/${file.id}`
    url = trailingSlash ? `${url}/` : url
    fetch(url, {
      method: 'DELETE',
      headers,
      ...fetchConfig,
    })
      .then(this.onRemovedSubmit(file))
      .catch(this.onError)
  }


  onRemovedSubmit = file => response => {
    if (response.ok) {
      response.json()
        .then(data => {
          if (data.result === 'success') {
            this.handleRemove(file)
          }
        })
    } else {
      const { status, statusText } = response
      this.setState(R.assocPath(['errors', 'networkError'], `Error: ${statusText} (${status})`))
    }
  }

  handleRemove = file => {
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

  onAddSubmit = response => {
    if (response.ok) {
      response.json()
        .then(data => {
          this.setState(R.over(R.lensProp('files'), R.append(data)), () => {
            this.props.onChange(this.state.files)
          })
        })
    } else {
      const { status, statusText } = response
      this.setState(R.assocPath(['errors', 'networkError'], `Error: ${statusText} (${status})`))
    }
  }

  onError = response => {
    console.warn('error response', response)
  }

  processError = ({ template, args: { argument } }) => {
    return template.replace('{}', argument)
  }

  handleUpload = event => {
    const newfiles = event.target.files

    // У IE есть баг - файловый input вызывает onChange три раза
    // Первый вызов корректный - с файлами
    // Все последующие уже __без__ файлов
    // Из-за этого затираются ошибки
    // В теории проверка на кол-во файлов и прерывание ф-ции в случае их отсутствия не должна ничего сломать
    // Т.к. onChange без файлов невозможен
    if (newfiles.length === 0) {
      return;
    }

    const {
      apiUrl,
      onChangeFilesSelection,
      method,
      headers,
      fetchConfig,
      totalFilesCount,
      fileSizeMin,
      fileSizeMax,
      totalFilesSizeLimit,
      trailingSlash,
      errorProcessor,
      fileSizeMaxError,
      fileSizeMaxErrorKey,
      fileSizeMinError,
      fileSizeMinErrorKey,
      totalFilesCountError,
      totalFilesCountErrorKey,
      totalFilesSizeLimitError,
      totalFilesSizeLimitErrorKey,
      fileExtensionsError,
      fileExtensionsErrorKey,
    } = this.props

    if (!apiUrl) return

    onChangeFilesSelection(newfiles)
    let { files, totalSize, errors } = this.state
    const { fileExtensions } = this.state

    const processError = errorProcessor || this.processError
    const uploadResult = Array.prototype.map.call(newfiles, (file, index) => {
      if (files.length + index + 1 > totalFilesCount) {
        const error = processError({
          key: totalFilesCountErrorKey,
          template: totalFilesCountError,
          args: { argument: totalFilesCount }
        })
        return { totalFilesCount: error }
      }

      const size = totalSize + file.size
      if (totalFilesSizeLimit && size > totalFilesSizeLimit * 1024) {
        const error = processError({
          key: totalFilesSizeLimitErrorKey,
          template: totalFilesSizeLimitError,
          args: { argument: totalFilesSizeLimit / 1000 }
        })
        return { totalFilesSizeLimit: error }
      }

      if (file.size < fileSizeMin * 1024) {
        const error = processError({
          key: fileSizeMinErrorKey,
          template: fileSizeMinError,
          args: { argument: fileSizeMin / 1000 }
        })
        return { fileSizeMin: error }
      }

      if (file.size >= fileSizeMax * 1024) {
        const error = processError({
          key: fileSizeMaxErrorKey,
          template: fileSizeMaxError,
          args: { argument: fileSizeMax / 1000 }
        })
        return { fileSizeMax: error }
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
        const error = processError({
          key: fileExtensionsErrorKey,
          template: fileExtensionsError,
          args: { argument: fileExtensions }
        })
        return { fileExtensionsError: error }
      }

      totalSize = size
      this.setState(R.evolve({ errors: R.empty }))

      const formData = new FormData
      const { miscFormData } = this.props
      if (miscFormData) {
        for (const key in miscFormData) {
          formData.append(key, miscFormData[key])
        }
      }
      formData.append('file', file)

      return fetch(trailingSlash ? `${apiUrl}/` : apiUrl, {
        method,
        headers,
        body: formData,
        ...fetchConfig,
      })
        .then(this.onAddSubmit)
        .catch(this.onError)
    })

    const uploadErrors = R.compose(
      R.reduce((result, current) => R.merge(result, current), {}),
      // Leave only errors objects, reject successful uploads
      R.reject(item => item instanceof Promise),
    )(uploadResult)

    this.setState(R.merge(R.__, {
      errors: uploadErrors,
      totalSize,
    }))
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
      filenameField,
      cssPrefix,
    } = this.props
    const {
      files,
      errors,
    } = this.state
    const className = cssPrefix
      ? `${cssPrefix}__files-uploader`
      : 'files-uploader'

    return (
      <div className={className}>
        <input
          ref={(el) => { this.fileInput = el }}
          type="file"
          multiple={isMultiple}
          onChange={this.handleUpload}
          className={`${className}__file-field`}
          style={{
            display: 'none',
          }}
        />
        {
          R.compose(
            R.map(component => {
              if (component === 'uploader') {
                return (
                  <button
                    key={component}
                    className={`${className}__add-file-button`}
                    onClick={this.addFile}
                  >
                    {addButtonLabel}
                  </button>
                )
              }
              if (component === 'hint' && hint) {
                return (
                  <div className={`${className}__files-uploader__hint`} key={component}>{hint}</div>
                )
              }
              if (component === 'filesList' && showFilesList) {
                return (
                  <div className={`${className}__files-list`} key={component}>
                    {
                      files.map(file =>
                        <div key={file.id} className={`${className}-files-list__item`} key={file.id}>
                          <span
                            className={`${className}-files-list__item-name`}
                          >
                            {file[filenameField]}
                          </span>
                          <button
                            className={`${className}-files-list__item-remove`}
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
                  <div className={`${className}__errors`} key={component}>
                    {
                      Object.keys(errors).map(key =>
                        <div key={key} className={`${className}__errors-error`}>{errors[key]}</div>
                      )
                    }
                  </div>
                )
              }
              return null
            }),
            R.uniq()
          )(componentContents)
        }
      </div>
    )
  }
}

Uploader.propTypes = {
  onChange: PropTypes.func,
  apiUrl: PropTypes.string,
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
  value: PropTypes.array,
  showErrorsList: PropTypes.bool,
  trailingSlash: PropTypes.bool,
  cssPrefix: PropTypes.string,
  // Вызывать ли API удаления файлов
  actualDelete: PropTypes.bool,
  // Наименование поля, значение которого будет использовано для
  // получения имени файла, отображаемого в списке файлов.
  filenameField: PropTypes.string,
  // Количество файлов которое пользователь может приложить
  totalFilesCount: PropTypes.number,
  // Сообщение об ошибке при превышении totalFilesCount
  totalFilesCountError: PropTypes.string,
  // Сокращенное обозначение (код) ошибки totalFilesCountError
  totalFilesCountErrorKey: PropTypes.string,
  // Минимальный размер одного файла (в Кб)
  fileSizeMin: PropTypes.number,
  // Сообщение об ошибке если размер файла меньше fileSizeMin
  fileSizeMinError: PropTypes.string,
  // Сокращенное обозначение (код) ошибки fileSizeMinError
  fileSizeMinErrorKey: PropTypes.string,
  // Максимальный размер одного файла (в Кб)
  fileSizeMax: PropTypes.number,
  // Сообщение об ошибке если размер файла больше fileSizeMax
  fileSizeMaxError: PropTypes.string,
  // Сокращенное обозначение (код) ошибки fileSizeMaxError
  fileSizeMaxErrorKey: PropTypes.string,
  // Максимальный общий размер приложенных файлов (В Кб)
  totalFilesSizeLimit: PropTypes.number,
  // Сообщение об ошибке если суммарный размер файлов превышает totalFilesSizeLimit
  totalFilesSizeLimitError: PropTypes.string,
  // Сокращенное обозначение (код) ошибки totalFilesSizeLimitError
  totalFilesSizeLimitErrorKey: PropTypes.string,
  // Разрешенные расширения через запятую
  fileExtensions: PropTypes.string,
  // Сообщение об ошибке если указан файл с запрещенным расширением
  fileExtensionsError: PropTypes.string,
  // Сокращенное обозначение (код) ошибки fileExtensionsError
  fileExtensionsErrorKey: PropTypes.string,
  // Пояснительный текст
  hint: PropTypes.string,
  miscFormData: PropTypes.object,
  errorProcessor: PropTypes.func,
}

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
  componentContents: [
    'hint', 'uploader', 'filesList', 'errorsList'
  ],
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
  fileSizeMinError:  'Размер файла не может быть меньше {} МБ',
  fileSizeMinErrorKey:  'filesUploaderFileSizeMin',
  fileSizeMax: 10000,
  fileSizeMaxError:  'Размер файла не может превышать {} МБ',
  fileSizeMaxErrorKey:  'filesUploaderFileSizeMax',
  totalFilesSizeLimit: 20000,
  totalFilesSizeLimitError: 'Суммарный размер файлов не может превышать {} МБ',
  totalFilesSizeLimitErrorKey: 'filesUploaderTotalFilesSizeLimit',
  fileExtensions: undefined,
  fileExtensionsError: 'Поддерживаемые форматы файлов: {}',
  fileExtensionsErrorKey: 'filesUploaderFileExtensions',
  hint: undefined,
  miscFormData: undefined,
  errorProcessor: undefined,
}

export default Uploader
