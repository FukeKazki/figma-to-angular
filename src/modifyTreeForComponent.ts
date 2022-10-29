import { Tag } from './buildTagTree'

type ComponentSetting = {
  name: string
  matcher: (node: SceneNode) => boolean
  modifyFunc: (tag: Tag, _figma: PluginAPI) => Tag
}

const components: ComponentSetting[] = [
  {
    name: 'Spacer',
    matcher: (node: SceneNode) => {
      return node.name === 'Spacer' && (!('children' in node) || node.children.length === 0)
    },
    modifyFunc: (tag: Tag) => {
      if (tag.node.width > tag.node.height) {
        tag.properties.push({ name: 'height', value: tag.node.height.toString(), notStringValue: true })
      } else {
        tag.properties.push({ name: 'width', value: tag.node.width.toString(), notStringValue: true })
      }

      tag.isComponent = true
      return tag
    }
  }
]

async function modify(tag: Tag, _figma: PluginAPI) {
  if (!tag || !tag.node) {
    return tag
  }

  let modifiedOnce = false

  const comps = [...components]

  comps.forEach((setting) => {
    if (!modifiedOnce && setting.matcher(tag.node)) {
      tag = setting.modifyFunc(tag, _figma)
      modifiedOnce = true
    }
  })

  return tag
}

export async function modifyTreeForComponent(tree: Tag, _figma: PluginAPI) {
  const newTag = await modify(tree, _figma)

  if (newTag) {
    newTag.children.forEach(async (child, index) => {
      newTag.children[index] = await modifyTreeForComponent(child, _figma)
    })
  }

  return newTag
}
