import util from 'node:util'
import path from 'node:path'
import process from 'node:process'
import fs from 'fs-extra'
import downloadGitRepo from 'download-git-repo'

export const REPO_NAME = 'lattelu'

/**
 * 验证项目名称正确性
 */
export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName,
  )
}

/**
 * 格式化项目名称
 * @param {string} projectName 项目名称
 * @returns {string}
 */
export function toValidPackageName(projectName: string): string {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

/**
 * 判断该目录是否存在
 * @param filePath 项目路径
 * @returns
 */
export function toValidPathIsExist(filePath: string) {
  return fs.existsSync(getTargetPath(filePath))
}

/**
 * 获取当前命令行执行路径
 * @param filePath 路径
 * @returns
 */
export function getTargetPath(filePath: string) {
  // 当前命令行选择的目录
  const cwd = process.cwd()

  // 目录地址
  return path.join(cwd, filePath)
}

const downloadGitRepoByPromise = util.promisify(downloadGitRepo)

/**
 * 下载仓库
 * @param repo 仓库名称
 * @param targetPath 下载后保存的路径
 */
export async function downloadTemplate(repo: string, targetPath: string) {
  const requestUrl = `${REPO_NAME}/${repo}`
  const localPath = path.resolve(process.cwd(), targetPath)

  await downloadGitRepoByPromise(requestUrl, localPath)
}
/**
 * Promise 执行验证
 * @param fn
 * @returns
 */
export async function tryCath<T>(fn: () => Promise<T>) {
  try {
    const res = await fn()
    //  成功的
    return Promise.resolve({
      state: 'success',
      data: res,
    })
  } catch (e) {
    // 失败的
    return Promise.resolve({
      state: 'error',
      message: e,
    })
  }
}
