import { Tag } from './buildTagTree'
import { capitalizeFirstLetter } from './utils/stringUtils'

export const buildScript = (tag: Tag, componentName: string): string => {
  return `import { Component } from '@angular/core';

@Component({
  selector: 'my-${componentName}',
  templateUrl: './${componentName}.component.html',
  styleUrls: ['./${componentName}.component.css'],
})
export class ${capitalizeFirstLetter(componentName)}Component {
}
`
}
