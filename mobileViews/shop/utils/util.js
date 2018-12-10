import { doSyncStock } from '@/utils/store'

const formatTime = date => {

    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()

    return [month, day].map(formatNumber).join('/') + ' ' + [hour, minute, ].map(formatNumber).join(':')
  }

  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }


export function itemsToFoods(itemList, that) {
  const foods = itemList.map(item => {
    const temp = {}
    temp.id = item.pid
    temp.pid = item.pid
    temp.fid = item.id
    temp.isGift = item.isGift
    temp.name = item.pName
    temp.unit = item.pUnit
    temp.count = item.pMass === 0 ? item.pNum : item.pMass
    temp.price = item.pPrice
    temp.mpropPrice = 0
    temp.propPrice = 0
    temp.newPrice = 0
    temp.isSku = item.pSkuStr ? 1 : 0
    temp.isSubmit = item.isSubmit
    temp.pPropIDs = item.pPropIDs
    temp.pPropIDPars = item.pPropIDPars
    temp.pSkuStr = item.pSkuStr
    temp.remark = item.remarkList && item.remarkList.length > 0 ? item.remarkList[0] : ''
    temp.isbyMass = item.pMass === 0 ? 0 : 1
    temp.stepMass = item.stepMass
    const product = that.$store.getters.productList.find(p => {
      return p.id === temp.id
    })
    if (product) {              // Sat Sep 29 09:15:05 2018 workround fix 结账订单项列表显示
      temp.pts = product.pts
      if (temp.pts && temp.pPropIDs) {
        temp.propList = temp.pPropIDs.split(',').map((vid, index) => {
          const prop = temp.pts[index]
          vid = parseInt(vid)
          const propSelectd = { pid: prop.pid, pname: prop.pn, pv: prop.pvs.find(i => { return i.vid === vid }) }
          if (temp.pPropIDPars) {
            const paFinded = temp.pPropIDPars.split(',').map(item => {
              const temp = item.split(':')
              return { vid: parseInt(temp[0]), paCount: parseFloat(temp[1]) }
            }).find((item) => {
              return item.vid === vid
            })
            if (paFinded) {
              propSelectd.paCount = paFinded.paCount
            }
          }
          return propSelectd
        })
      }
      temp.catID = product.catID
      temp.isbyMass = product.isbyMass
      temp.stepMass = product.stepMass
      temp.picUrl = product.picUrl
      temp.icon = product.icon
      temp.mPrice = product.mPrice
      temp.mpropPrice = calcMPrice(temp)
      temp.opMinute = product.opMinute
      temp.ename = product.ename
    }
    return temp
  })
  const stockList = that.$store.state.shop.stockList
  return doSyncStock(stockList, foods)
}

export function calcMPrice(food) {
  // 重新计算会员价格
  let mPrice = food.mPrice
  if (food.propList && food.propList.length > 0) {
    food.propList.forEach(prop => {
      const count = prop.pv.pa === 1 && prop.paCount > 0 ? prop.paCount : 1
      mPrice += parseFloat(prop.pv.mp ? prop.pv.mp : 0) * count
    })
  }
  return mPrice.toFixed(2)
}
/**
 * 使用test方法实现模糊查询
 * @param  {Array}  list     原数组
 * @param  {String} keyWord  查询的关键词
 * @return {Array}           查询的结果
 */
export function fuzzyQuery(list = [], keyWord, key = undefined) {
  var reg =  new RegExp(keyWord.split('').join('.*'))
  return list.filter((item, index) => {
    if (key) {
      return reg.test(item[key])
    } else {
      console.log(item)
      return reg.test(item)
    }
  })
}

/**
 *
 */
export default { formatTime, itemsToFoods }
