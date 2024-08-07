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

    // Simplify absolute path to relative path from vault root.
    this.register(
      decorate.returnValue(editor.imgEdit, 'resolveImagePath', (args, imgPath) => {
        const vaultPath = this.app.vault.path
        const prefix = `file://${vaultPath}`

        if (imgPath.startsWith(prefix)) {
          imgPath = imgPath.slice(prefix.length)
        }
        else if (imgPath.startsWith(vaultPath)) {
          imgPath = imgPath.slice(vaultPath.length)
            .replace(/\\/g, '/')
        }
        else if (imgPath.startsWith('file://./')) {
          imgPath = imgPath.slice(9)
        }
        return imgPath
      }))
  }
}
