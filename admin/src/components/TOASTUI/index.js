import React from 'react';
import PropTypes from 'prop-types';

import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import { Button } from '@buffetjs/core';

import MediaLib from '../MediaLib';

class TOIEditor extends React.Component {
  editorRef = React.createRef();

  constructor(props) {
    super(props);
    this.height = "400px";
    this.initialEditType = "markdown";
    this.previewStyle = "vertical";
    this.state = { isOpen : false };
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    const editor = this.editorRef.current.getInstance();
    const toolbar = editor.getUI().getToolbar();

    editor.eventManager.addEventType('insertMediaButton');
    editor.eventManager.listen('insertMediaButton', () => {
      this.handleToggle();
    } );

    toolbar.insertItem(0, {
      type: 'button',
      options: {
        className: 'first tui-image',
        event: 'insertMediaButton',
        tooltip: 'Insert Media',
        text: '@',
      }
    });
  }

  componentDidUpdate() {
    // Bug fix, where switch button become submit type - editor bug
    const elements = document.getElementsByClassName('te-switch-button');
    if ( elements.length ) {
      elements[0].setAttribute('type','button');
      elements[1].setAttribute('type','button');
    }
  }

  handleChange = data => {
    let value = this.props.value;
    if (data.mime.includes('image')) {
      let image = `![${data.caption}](${data.url})`;
      this.editorRef.current.getInstance().insertText(image);
    }
    if (data.mime.includes('video')) {
      let video = `[![${data.name}](${data.previewUrl})](${data.url})`;
      this.editorRef.current.getInstance().insertText(video);
    }
  };

  handleToggle = () => this.setState({ isOpen : !this.state.isOpen });

  render() {
    return (
      <>
        <Editor
          previewStyle={this.previewStyle}
          height={this.height}
          initialEditType={this.initialEditType}
          initialValue={this.props.value}
          ref={this.editorRef}
          onChange={(event) => {
            this.props.onChange({
              target: {
                value: this.editorRef.current.getInstance().getMarkdown(),
                name: this.props.name,
                type: 'textarea',
              },
            });
          }}
          toolbarItems={[
            'heading',
            'bold',
            'italic',
            'strike',
            'divider',
            'hr',
            'quote',
            'divider',
            'ul',
            'ol',
            'task',
            'indent',
            'outdent',
            'divider',
            'table',
            'link',
            'divider',
            'code',
            'codeblock',
            'divider',
          ]}
        />

        <MediaLib onToggle={this.handleToggle} isOpen={this.state.isOpen} onChange={this.handleChange}/>
      </>
    );
  }

}

export default TOIEditor;
