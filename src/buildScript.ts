import { Tag } from './buildTagTree'
import { kebabToUpperCamel } from './utils/stringUtils'

export const buildScript = (tag: Tag, componentName: string): string => {
  return `import { Component } from '@angular/core';

@Component({
  selector: '${componentName}',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.css'],
})
export class ${kebabToUpperCamel(componentName)}Component {
}
`
}
