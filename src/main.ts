import { path, Plugin, decorate } from '@typora-community-plugin/core'
import { editor } from 'typora'


export default class extends Plugin {

  onload() {

    // Resolve relative path from vault root as absolute path
    this.register(
      decorate.parameters(editor.imgEdit, 'getRealSrc', ([url]) => {
        if (/^[/\\]/.test(url)) {
          url = 'file://' + path.join(this.app.vault.path, url)
        }
        return [url] as [string]
      }))
  }
}
