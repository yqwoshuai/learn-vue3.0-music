// 定义洗牌函数，遍历数组，依次将数组中的项和 0 - i 中的随机一项进行位置交换
export default function shuffle(source) {
  // 复制一份数组，防止修改原数组
  const arr = source.slice()
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 取 0 - max 之间随机值
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

// 交换函数
function swap(arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

// 格式化时间
export function formatTime(interval) {
  interval = interval | 0
  const minute = (((interval / 60) | 0) + '').padStart(2, '0')
  const second = ((interval % 60) + '').padStart(2, '0')
  return `${minute}:${second}`
}
