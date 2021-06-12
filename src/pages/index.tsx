import { Input } from 'antd'
const { TextArea } = Input
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom'
import { transform, availablePresets } from '@babel/standalone'
import { BabelFileResult } from '@babel/core'
import prettier from 'prettier/standalone'
import parserTypeScript from 'prettier/parser-typescript'

export default function IndexPage() {
  const [data, setData] = useState('<div>aaa</div>')
  useEffect(() => {
    let result: BabelFileResult | undefined
    try {
      result = transform(data, {
        filename: 'x.tsx',
        sourceType: 'script',
        presets: [
          availablePresets['env'],
          availablePresets['react'],
          availablePresets['typescript'],
        ],
      })
    } catch (e) {
      console.log(e)
    }
    if (!result?.code) {
      return
    }
    const formatted = prettier.format(result.code, {
      semi: false,
      parser: 'typescript',
      plugins: [parserTypeScript],
    })
    const renderFunc = new Function('React', 'render', `render(${formatted})`)
    const render2 = (node: Parameters<typeof render>[0]) => {
      render(node, document.getElementById('preview'))
    }
    renderFunc(React, render2)
  }, [data])

  return (
    <>
      <TextArea
        rows={4}
        value={data}
        onChange={(t) => setData(t.currentTarget.value)}
      />
      <div id="preview"></div>
    </>
  )
}
