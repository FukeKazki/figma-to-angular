import { UnitType } from './buildSizeStringByUnit'
import { CSSData, getCssDataForTag, TextCount } from './getCssDataForTag'
import { isImageNode } from './utils/isImageNode'

type Property = {
  name: string
  value: string
  notStringValue?: boolean
}

type Input = {
  name: string
  defaultValue: string
  type: string
}

export type Tag =
  | {
      name: string
      isText: boolean
      textCharacters: string | null
      isImg: boolean
      properties: Property[]
      css: CSSData
      children: Tag[]
      node: SceneNode
      isComponent?: boolean
      isVariant: false
    }
  | {
      name: string
      isText: boolean
      textCharacters: string | null
      isImg: boolean
      properties: Property[]
      css: CSSData
      children: Tag[]
      node: SceneNode
      isComponent?: boolean
      isVariant: true
      inputs: Input[]
  }

type ComponentPropertyDefinitions = {
  [key: string]: {
    defaultValue: string
    type: string
    variantOptions?: string[]
  }
}

export function buildTagTree(node: SceneNode, unitType: UnitType, textCount: TextCount): Tag | null {
  if (!node.visible) {
    return null
  }

  const isImg = isImageNode(node)
  const properties: Property[] = []

  if (isImg) {
    properties.push({ name: 'src', value: '' })
  }

  const childTags: Tag[] = []
  if ('children' in node && !isImg) {
    node.children.forEach((child) => {
      const childTag = buildTagTree(child, unitType, textCount)
      if (childTag) {
        childTags.push(childTag)
      }
    })
  }
  // variantの時は親コンポーネントの名前にする
  const name = isImg ? 'img' : node.parent?.type === 'COMPONENT_SET' ? node.parent.name : node.name

  const inputs = []
  // variantの時はInputs型が生えるように
  const parent = node.parent
  if (parent?.type === 'COMPONENT_SET') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const property = parent?.componentPropertyDefinitions as ComponentPropertyDefinitions
    for (const [key, value] of Object.entries(property)) {
      const input: Input = {
        name: '',
        defaultValue: '',
        type: ''
      }

      if (value.type === 'TEXT') {
        input.name = 'text'
        input.defaultValue = `"${value.defaultValue}"`
        input.type = 'string'
        inputs.push(input)
      }

      if (value.type === 'VARIANT') {
        input.name = key
        input.defaultValue = `"${value.defaultValue}"`
        input.type = value.variantOptions?.reduce((p, c) => {
          if (p === '') return p + `"${c}"`
          return p + ' | ' + `"${c}"`
        }, '') as string
        inputs.push(input)
      }
    }
  }

  const tag: Tag = {
    name: name,
    isText: node.type === 'TEXT',
    textCharacters: node.type === 'TEXT' ? node.characters : null,
    isImg,
    css: getCssDataForTag(node, unitType, textCount),
    properties,
    children: childTags,
    node,
    isVariant: node.parent?.type === 'COMPONENT_SET',
    inputs
  }

  return tag
}
