import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs-extra'
import chalk from 'chalk'
import { program } from 'commander'
import figlet from 'figlet'
import type { PackageJSON } from './types/index.js'
import { main } from './core/index.js'

const __filename = fileURLToPath(import.meta.url)
const packagePath = path.resolve(__filename, '../../package.json')

const packageJSON = fs.readJSONSync(packagePath) as PackageJSON

program
  .command('create')
  .description('创建一个系统项目')
  .action(async () => {
    await main().catch(console.error)
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
  console.log(`\r\nRun ${chalk.cyan(`agee <command> --help`)} show details\r\n`)
})

program.parse()
