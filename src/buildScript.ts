import { Tag } from './buildTagTree'
import { kebabToUpperCamel } from './utils/stringUtils'

export const buildScript = (tag: Tag, componentName: string): string => {
  let serializeInputs = ''
  if (tag.isVariant) {
    serializeInputs = tag.inputs.map((input) => `@Input() private ${input.name}: ${input.type} = ${input.defaultValue}`).reduce((p, c) => p + '\n' + c, '')
  }
  // @Input
  // private text: string = "投稿"
  // @Input
  // private state: "Default" | "hover" | "disabled" = "Default"
  return `import { Component, Input } from '@angular/core';

@Component({
  selector: '${componentName}',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.css'],
})
export class ${kebabToUpperCamel(componentName)}Component {
  ${serializeInputs}
}
`
}
