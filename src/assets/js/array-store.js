import storage from 'good-storage'

// 顶部插入元素
function inertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    return
  }
  arr.unshift(val)
  // 超过最大值则删除末尾元素
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 删除对应元素
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 保存到localStorage
export function save(item, key, compare, maxLen) {
  const items = storage.get(key, [])
  inertArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

// 从localStorage中移除
export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}
// 从localStorage中读取
export function load(key) {
  return storage.get(key, [])
}
