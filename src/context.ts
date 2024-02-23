let _pluginConfig, _pluginOptions

function create (pluginOptions, pluginConfig) {
  _pluginConfig = pluginConfig
  _pluginOptions = pluginOptions
}
export default {
  create,
  get pluginOptions () {
    return _pluginOptions
  },
  get pluginConfig () {
    return _pluginConfig
  }
}
