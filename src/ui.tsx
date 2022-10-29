import * as React from 'react'
import * as ReactDom from 'react-dom'
import styles from './ui.css'

function escapeHtml(str: string) {
  str = str.replace(/&/g, '&amp;')
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  str = str.replace(/"/g, '&quot;')
  str = str.replace(/'/g, '&#39;')
  return str
}

// I tried to use highlight.js https://highlightjs.readthedocs.io/en/latest/index.html
// but didn't like the color. so I give it a go for this dirty style💪
function insertSyntaxHighlightText(text: string) {
  return text
    .replaceAll('= ()', `<span class="${styles.expressionText}">= ()</span>`)
    .replaceAll('{', `<span class="${styles.expressionText}">{</span>`)
    .replaceAll('}', `<span class="${styles.expressionText}">}</span>`)
    .replaceAll('(', `<span class="${styles.expressionText}">(</span>`)
    .replaceAll(')', `<span class="${styles.expressionText}">)</span>`)
    .replaceAll('&lt;', `<span class="${styles.tagText}">&lt;</span><span class="${styles.tagNameText}">`)
    .replaceAll('&gt;', `</span><span class="${styles.tagText}">&gt;</span>`)
    .replaceAll('=</span><span class="tag-text">&gt;</span>', `<span class="${styles.defaultText}">=&gt;</span>`)
    .replaceAll('.div', `<span class="${styles.functionText}">.div</span>`)
    .replaceAll('`', `<span class="${styles.stringText}">${'`'}</span>`)
}

const App: React.VFC = () => {
  const [html, setHtml] = React.useState('')
  const [css, setCss] = React.useState('')
  const [script, setScript] = React.useState('')
  const [componentName, setComponentName] = React.useState('')

  const syntaxHighlightedHtml = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(html)), [html])
  const syntaxHighlightedCss = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(css)), [css])
  const syntaxHighlightedScriipt = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(script)), [script])

  React.useEffect(() => {
    onmessage = (event) => {
      setHtml(event.data.pluginMessage.generatedCodeStr)
      setCss(event.data.pluginMessage.cssString)
      setComponentName(event.data.pluginMessage.componentName)
      setScript(event.data.pluginMessage.scriptString)
    }
  }, [])

  return (
    <div>
      <div className={styles.code}>
        {/* tsを表示 */}
        <p className={styles.fileName}>{componentName}.component.ts</p>
        <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedScriipt }} />
        {/* HTMLを表示 */}
        <p className={styles.fileName}>{componentName}.component.html</p>
        <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedHtml }} />
        {/* CSSを表示 */}
        <p className={styles.fileName}>{componentName}.component.css</p>
        <p
          className={styles.generatedCode}
          dangerouslySetInnerHTML={{
            __html: syntaxHighlightedCss
          }}
        />
      </div>
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('app'))
