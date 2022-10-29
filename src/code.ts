import { messageTypes } from './messagesTypes'
import { modifyTreeForComponent } from './modifyTreeForComponent'
import { buildHtml } from './buildCode'
import { buildTagTree } from './buildTagTree'
import { buildCssString } from './buildCssString'
import { TextCount } from './getCssDataForTag'
import { buildScript } from './buildScript'

figma.showUI(__html__, { width: 480, height: 480 })

const selectedNodes = figma.currentPage.selection

async function generate(node: SceneNode) {
  const textCount = new TextCount()

  // 使いやすいオブジェクトに変換
  const originalTagTree = buildTagTree(node, 'px', textCount)
  if (originalTagTree === null) {
    figma.notify('Please select a visible node')
    return
  }

  // 独自のタグを登録してある場合はそれに変換できるように
  // modify→変更
  const tag = await modifyTreeForComponent(originalTagTree, figma)

  const componentName = tag.name.replace(/\s/g, '').toLowerCase()

  // コードの生成
  const generatedCodeStr = buildHtml(tag)
  const cssString = buildCssString(tag)
  const scriptString = buildScript(tag, componentName)

  figma.ui.postMessage({ generatedCodeStr, cssString, scriptString, componentName })
}

if (selectedNodes.length > 1) {
  figma.notify('Please select only 1 node')
  figma.closePlugin()
} else if (selectedNodes.length === 0) {
  figma.notify('Please select a node')
  figma.closePlugin()
} else {
  generate(selectedNodes[0])
}

figma.ui.onmessage = (msg: messageTypes) => {
  if (msg.type === 'notify-copy-success') {
    figma.notify('copied to clipboard👍')
  }
}
