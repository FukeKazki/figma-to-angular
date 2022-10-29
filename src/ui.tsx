import * as React from 'react'
import * as ReactDom from 'react-dom'
import { messageTypes } from './messagesTypes'
import styles from './ui.css'
import Spacer from './ui/Spacer'

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
    .replaceAll('const', `const <span class="${styles.variableName}">`)
    .replaceAll(': React.VFC', `</span>: React.VFC`)
    .replaceAll('= styled.', `</span>= styled.`)
    .replaceAll('React.VFC', `<span class="${styles.typeText}">React.VFC</span>`)
    .replaceAll('return', `<span class="${styles.returnText}">return</span>`)
    .replaceAll(': ', `<span class="${styles.expressionText}">: </span>`)
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
  const textRef = React.useRef<HTMLTextAreaElement>(null)
  const [html, setHtml] = React.useState('')
  const [css, setCss] = React.useState('')
  const [componentName, setComponentName] = React.useState('')

  const copyToClipboard = () => {
    if (textRef.current) {
      textRef.current.select()
      document.execCommand('copy')

      const msg: messageTypes = { type: 'notify-copy-success' }
      parent.postMessage(msg, '*')
    }
  }

  const syntaxHighlightedHtml = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(html)), [html])
  const syntaxHighlightedCss = React.useMemo(() => insertSyntaxHighlightText(escapeHtml(css)), [css])

  // set initial values taken from figma storage
  React.useEffect(() => {
    onmessage = (event) => {
      setHtml(event.data.pluginMessage.generatedCodeStr)
      setCss(event.data.pluginMessage.cssString)
      setComponentName(event.data.pluginMessage.componentName)
    }
  }, [])

  return (
    <div>
      <div className={styles.code}>
        {/* <textarea className={styles.textareaForClipboard} ref={textRef} value={code} readOnly /> */}
        {/* HTMLを表示 */}
        <p>{componentName}.component.html</p>
        <p className={styles.generatedCode} dangerouslySetInnerHTML={{ __html: syntaxHighlightedHtml }} />
        {/* CSSを表示 */}
        <p>{componentName}.component.css</p>
        <p
          className={styles.generatedCode}
          dangerouslySetInnerHTML={{
            __html: syntaxHighlightedCss
          }}
        />

        {/* <Spacer axis="vertical" size={12} /> */}

        {/* <div className={styles.buttonLayout}>
          <button className={styles.copyButton} onClick={copyToClipboard}>
            Copy to clipboard
          </button>
        </div> */}
      </div>
    </div>
  )
}

ReactDom.render(<App />, document.getElementById('app'))
