import { CSSData } from './getCssDataForTag'
import { Tag } from './buildTagTree'
import { buildClassName } from './utils/cssUtils'

function buildArray(tag: Tag, arr: CSSData[]): CSSData[] {
  // TODO: icComponentの役割を調査
  // if (!tag.isComponent) {
  arr.push(tag.css)
  // }

  tag.children.forEach((child) => {
    arr = buildArray(child, arr)
  })

  return arr
}

export function buildCssString(tag: Tag): string {
  const cssArray = buildArray(tag, [])
  let codeStr = ''

  if (!cssArray) {
    return codeStr
  }
  cssArray.forEach((cssData) => {
    if (!cssData || cssData.properties.length === 0) {
      return
    }
    const cssStr = `.${buildClassName(cssData?.className)} {
${cssData.properties.map((property) => `  ${property.name}: ${property.value};`).join('\n')}
}\n`

    codeStr += cssStr
  })

  return codeStr
}
