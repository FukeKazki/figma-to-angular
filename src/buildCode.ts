import { Tag } from './buildTagTree'
import { buildClassName } from './utils/cssUtils'
import { lowerCamelCase, removeHash } from './utils/stringUtils'

function buildSpaces(baseSpaces: number, level: number) {
  let spacesStr = ''

  for (let i = 0; i < baseSpaces; i++) {
    spacesStr += ' '
  }

  for (let i = 0; i < level; i++) {
    spacesStr += '  '
  }
  return spacesStr
}

function guessTagName(name: string) {
  const _name = name.toLowerCase()
  if (_name.includes('button')) {
    return 'button'
  }
  if (_name.includes('section')) {
    return 'section'
  }
  if (_name.includes('article')) {
    return 'article'
  }
  return 'div'
}

function getTagName(tag: Tag) {
  if (!tag.isComponent) {
    if (tag.isImg) {
      return 'img'
    }
    if (tag.isText) {
      return 'p'
    }
    return guessTagName(tag.name)
  }
  return tag.isText ? 'Text' : tag.name.replace(/\s/g, '')
}

function getClassName(tag: Tag) {
  if (!tag.isComponent) {
    if (tag.isImg) {
      return ''
    }
    return ` class="${buildClassName(tag.css.className)}"`
  }
  return ''
}

function buildPropertyString(prop: Tag['properties'][number]) {
  return ` ${prop.name}${prop.value !== null ? `=${prop.notStringValue ? '{' : '"'}${prop.value}${prop.notStringValue ? '}' : '"'}` : ''}`
}

function buildChildTagsString(tag: Tag, level: number): string {
  if (tag.children.length > 0) {
    return '\n' + tag.children.map((child) => buildHtmlString(child, level + 1)).join('\n')
  }
  if (tag.node.componentPropertyReferences) {
    // TODO: booleanの時の挙動を調査
    // ngIfを入れたい
    if (!tag.node.componentPropertyReferences.characters) return ''
    return `{${lowerCamelCase(removeHash(tag.node.componentPropertyReferences.characters))}}`
  }
  if (tag.isText) {
    return `${tag.textCharacters}`
  }
  return ''
}

export function buildHtml(tag: Tag): string {
  return `${buildHtmlString(tag, 0)}`
}

// htmlの生成
function buildHtmlString(tag: Tag, level: number) {
  if (!tag) return ''

  const spaceString = buildSpaces(0, level) // インデントのことかな？
  const hasChildren = tag.children.length > 0

  const tagName = getTagName(tag)
  const className = getClassName(tag)
  const properties = tag.properties.map(buildPropertyString).join('')

  const openingTag = `${spaceString}<${tagName}${className}${properties}${hasChildren || tag.isText ? `` : ' /'}>`
  const childTags = buildChildTagsString(tag, level)
  const closingTag = hasChildren || tag.isText ? `${!tag.isText ? '\n' + spaceString : ''}</${tagName}>` : ''

  return openingTag + childTags + closingTag
}
