import React , { Component }from 'react'
import 'braft-editor/dist/index.css'
import 'braft-extensions/dist/code-highlighter.css'
import BraftEditor from 'braft-editor'
import CodeHighlighter from 'braft-extensions/dist/code-highlighter'
import previewTel from './previewTel'
BraftEditor.use(CodeHighlighter({
  includeEditors: ['editor-with-code-highlighter'],
}))


export default class MyBraftEditor extends Component {

  state = {
    editorState: BraftEditor.createEditorState(this.props.value), // 设置编辑器初始内容
  }

  // 同步编辑器的内容
  handleChange = (editorState) => {
    this.setState({
      editorState: editorState,
      outputHTML: this.props.handleAsynChange('ueContent',editorState.toHTML(),'fromData') 
    })
  }

  // 预览按钮
  preview = () => {

    if (window.previewWindow) {
      window.previewWindow.close()
    }

    window.previewWindow = window.open()
    window.previewWindow.document.write(previewTel(this.state.editorState.toHTML()))
    window.previewWindow.document.close()

  }

  render () {

    const extendControls = [
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ]

    const { editorState } = this.state

    return (
        <div className="editor-wrapper"
         style={{"marginBottom": "12px", border: "1px solid #d1d1d1",borderRadius: "5px"}}>
          <BraftEditor
            id="editor-with-code-highlighter"
            extendControls={extendControls}
            value={editorState}
            onChange={this.handleChange}
          />
      </div>
    )

  }

}