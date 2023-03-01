import { setTimeout } from 'node:timers/promises'
import * as p from '@clack/prompts'
import color from 'picocolors'
import shell from 'shelljs'
import {
  downloadTemplate,
  getTargetPath,
  toValidPathIsExist,
  tryCath,
} from '../utils/index.js'
import { getRepoList } from './http.js'

interface MainPrompt {
  type: string | symbol
  name: string | symbol
  install: boolean | symbol
  download: void
}

async function main() {
  console.clear()
  await setTimeout(1000)

  const info = color.bgCyan(color.black(' create project '))
  p.intro(info)

  const project = await p.group<MainPrompt>({
    type: async () => {
      const s = p.spinner()
      s.start('获取模板中...')
      const res = await getRepoList()
      const options = res.map((r) => {
        return {
          label: r.name,
          value: r.name,
        }
      })
      s.stop()
      return p.select({
        message: `选择一个项目类型`,
        initialValue: res[0].name,
        options: [
          ...options,
          //   { value: 'ts-node-cli-template', label: '基础脚手架' },
          //   { value: 'vue3', label: 'vue3-ts-web 项目' },
          //   { value: 'vue3-h5', label: 'vue3-ts-h5 项目' },
        ],
      })
    },
    name: ({ results }) =>
      p.text({
        message: '一个伟大的项目的名称',
        placeholder: `${results.type || 'project'}-demo`,
        validate: (value) => {
          if (!value) return '请输入项目名称~'
          if (toValidPathIsExist(value)) return `${value} 该项目已存在~`
        },
      }),
    download: async ({ results }) => {
      const name = results.name
      const type = results.type
      if (!name || !type) return
      const s = p.spinner()
      s.start('下载模板中')

      const { state } = await tryCath(() =>
        downloadTemplate(type, getTargetPath(name)),
      )
      if (state === 'success') {
        s.stop('下载完成')
      } else {
        s.stop('下载失败')
      }
    },
    install: () =>
      p.confirm({
        message: `是否安装项目依赖？`,
        initialValue: true,
      }),
  })

  if (project.install) {
    const s = p.spinner()
    s.start('Installing via pnpm')
    const pnpmExec = shell.which('pnpm')
    if (!pnpmExec) {
      shell.exec('npm install pnpm -g')
    }
    shell.cd(project.name)
    shell.exec('git init && pnpm install')
    s.stop('Installed via pnpm')
  }

  const nextSteps = `cd ${color.underline(color.cyan(project.name))} \n${
    project.install ? '' : 'pnpm install\n'
  }pnpm dev`

  p.note(nextSteps, 'Next steps.')
  p.outro(`Have fun!`)
}

export default main
