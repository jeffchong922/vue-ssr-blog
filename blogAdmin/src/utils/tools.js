/**
 * 获取符合v-select组件的数据
 * @param {Array} data 原始数据
 * @param {String} textKey 展示文本的原始数据属性名
 * @param {String} valueKey 作为结果的原始数据属性名
 */
export const getVSelectData = (data, textKey, valueKey) => {
  const retData = data.map(item => {
    const selectItem = {}
    selectItem.text = item[textKey]
    selectItem.value = item[valueKey]
    return selectItem
  })
  return retData
}