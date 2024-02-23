import chalk from 'chalk'
import axios from 'axios'
import fs from 'fs-extra'
import FormData from 'form-data'
import path from 'path'
const log = console.log
const info = (msg) => log(chalk.green(msg))
const error = (msg) => log(chalk.red(msg))

const uploadURL = 'http://183.6.107.160:22889/aliyun-cdn/upload/uploadFile'
export const upload = async (uploadList, to, watchingDir) => {
  if (uploadList.length === 0) return
  const failList = [] // 上传失败的列表
  const successList = [] // 上传成功的列表
  const taskList = []
  const cdnUrlMap = getCdnUrlMap()
  const _upload = async ({ filePath, hash }) => {
    const file = fs.createReadStream(filePath) // 创建读取流
    const form = new FormData() // new formdata实例
    const projectId = to
    form.append('file', file) // 把文件加入到formdata实例中
    form.append('prefix', `dollar/frontend/projects/${projectId}`) // 把文件加入到formdata实例中
    form.append('autoName', 1) // 自动命名
    const uploadTask = async () => {
      try {
        const { data } = await axios.post(uploadURL, form, {
          headers: form.getHeaders()
        })
        const cdnUrl = data.body
        if (data.errCode !== 'e0000') {
          failList.push({
            filePath,
            errMessage: data
          })
        } else {
          successList.push(cdnUrl)
          cdnUrlMap.set(hash, cdnUrl)
        }
      } catch (error) {
        failList.push({
          filePath,
          errMessage: error
        })
      }
    }
    taskList.push(uploadTask())
  }

  // 过滤掉hash相同的图片
  const filterDuplicate = (uploadList) => {
    return uploadList.reduce((acc, cur) => {
      const idx = acc.findIndex((item) => item.hash === cur.hash)
      if (idx === -1) {
        return [...acc, cur]
      }
      return acc
    }, [])
  }
  info(`开始上传文件至CDN,文件总数为:${filterDuplicate(uploadList).length}...`)
  filterDuplicate(uploadList).forEach(_upload)
  await Promise.all(taskList)
  updateCdnUrlMap(cdnUrlMap)
  log('图片上传完成！')
  info(`成功数：${successList.length}`)
  // info(`${successList}`)
  if (failList.length > 0) {
    error(`失败${failList.length}`)
    log('错误详情：\r\n', JSON.stringify(failList, null, 2))
  }

  // 缓存cdnUrlSet
  return {
    failList,
    successList
  }
}
// 获取cdn图片本地文件输出地址
export function getCdnUrlsFilePath () {
  return path.resolve(process.cwd(), './image2css-lock.json')
}
export function ensureLockJson () {
  const cdnUrlsFilePath = getCdnUrlsFilePath()
  if (!fs.existsSync(cdnUrlsFilePath)) {
    const defaultContent = {
      images: {}
    }
    fs.outputJsonSync(cdnUrlsFilePath, defaultContent)
  }
}
// 查询缓存
export function getCdnUrlMap () {
  ensureLockJson()
  const content = fs.readJsonSync(getCdnUrlsFilePath())
  return new Map(Object.entries(content || {}))
}
// 更新缓存
function updateCdnUrlMap (cdnUrlMap) {
  const obj = Object.fromEntries(cdnUrlMap)
  fs.outputJsonSync(getCdnUrlsFilePath(), obj, { space: 2 })
  return cdnUrlMap
}
