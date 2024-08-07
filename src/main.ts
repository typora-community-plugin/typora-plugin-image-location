import { path, Plugin, decorate } from '@typora-community-plugin/core'
import { editor, File } from 'typora'


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

    // Front Matter `typora-root-url` support relative path from vault root as absolute path
    this.register(
      decorate.returnValue(editor.docMenu, 'getLocalRootUrl', ([], url) => {
        if (url && /^[/\\]/.test(url)) {
          url = path.join(this.app.vault.path, url)
        }
        return url
      }))

    // Pass vault root to custom uploader
    this.register(
      decorate.returnValue(editor.imgEdit, 'getImageUploaderCommand', (args, uploader) => {
        if (File.option.imageUploader === 'custom') {
          uploader = uploader.replace(/\$\{vault\}/g, this.app.vault.path)
        }
        return uploader
      }))
  }
}
