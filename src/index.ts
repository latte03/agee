import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'
import { create } from './core/index.js'
import type { CreateOptions, PackageJSON } from './types.js'
import { isValidPackageName, toValidPackageName } from './utils/index.js'

const __filename = fileURLToPath(import.meta.url)
const packagePath = path.resolve(__filename, '../../package.json')

const packageJSON = fs.readJSONSync(packagePath) as PackageJSON

program
  .command('create <name>')
  .description('创建一个系统项目')
  .option('-f, --force', 'overwrite target directory if it exist')
  .action(async (name: string, options: CreateOptions) => {
    const packageName = toValidPackageName(name)
    if (isValidPackageName(packageName)) {
      await create(name, options)
    } else {
      console.log(`${chalk.bgRed(`${name} 不符合 package name 标准`)}`)
    }

    // 打印命令行输入的值
  })

program
  // 配置版本号信息
  .name('agee-cli')
  .version(`v${packageJSON.version}`)
  .usage('<command> [option]')

program.on('--help', () => {
  console.log(
    `\r\n${figlet.textSync('agee', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    })}`,
  )

  console.log(
    `\r\nRun ${chalk.cyan(`agee <command> --help`)} show details\r\n`,
  )
})

program.parse()
