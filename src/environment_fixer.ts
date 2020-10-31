import * as core from '@actions/core'
import * as fs from 'fs'
import * as os from 'os'
import { env } from 'process'

export class SwiftEnvironmentFixer {
  static async fixSourceKitPath () {
    const envVar = 'LINUX_SOURCEKIT_LIB_PATH'
    if(env[envVar] != undefined) {
      return
    }
    await core.group(`Setting ${envVar}`, async () => {
      let exported = false
      const libName = 'libsourcekitdInProc.so'
      const possiblePaths = ['/usr/share/swift/usr/lib', '/usr/lib']
      for (const path of possiblePaths) {
        fs.stat(`${path}/${libName}`, (err) => {
          if (err == null) {
            core.info(`Setting to: '${path}'`)
            core.exportVariable(envVar, path)
            exported = true
          }
        })
        if (exported) {
          break
        }
      }
      if (!exported) {
        core.warning(`Failed to find suitable path for ${envVar}`)
      }
    })
  }

  static async fixAll() {
    if (os.platform() == 'linux') {
      await this.fixSourceKitPath()
    }
  }
}