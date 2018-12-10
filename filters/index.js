// set function parseTime,formatTime to filter
export { parseTime, formatTime } from '@/utils'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/* 数字 格式化*/
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 根据字典id去显示字典对应的名称
 */
export function displayNameFilter(sid, options) {
  if (options) {
    const finded = options.find((option) => option.id === sid)
    if (finded) {
      return finded.name
    } else {
      console.log(sid)
    }
  } else {
    return sid
  }
}
/**
 * 根据账号的sids去显示店铺列表
 */
export function displayShopFilter(sids, options) {
  if (options) {
    var ids = sids.split(',');
    return  options.filter((option) => isInArray(ids,option.id+''))
  } else {
    return sids
  }
}
function isInArray(arr,value){
  if(arr.indexOf&&typeof(arr.indexOf)=='function'){
      var index = arr.indexOf(value);
      if(index >= 0){
          return true;
      }
  }
  return false;
}