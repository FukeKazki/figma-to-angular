export function kebabize(str: string): string {
  // すでにケバブケースなら変換しない
  if (str.indexOf('-') === -1) return str
  return str
    .replace(/\s+/g, '')
    .split('')
    .map((letter, idx) => {
      return letter.toUpperCase() === letter ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}` : letter
    })
    .join('')
}

export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function kebabToUpperCamel(str: string): string {
  return capitalizeFirstLetter(str.split(/-|_/g).map(capitalizeFirstLetter).join(''))
}

export function removeHash(str: string): string {
  const index = str.indexOf('#')
  if (index !== -1) {
    return str.substring(0, index)
  }
  return str
}

// TODO: 実装する
export function lowerCamelCase(str: string): string {
  return str.replace(/\s+/g, '')
}