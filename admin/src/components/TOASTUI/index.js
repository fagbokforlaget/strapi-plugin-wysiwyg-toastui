import React from 'react';
import PropTypes from 'prop-types';

import '@toast-ui/editor/dist/toastui-editor.css';
import 'codemirror/lib/codemirror.css';
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

  componentWillReceiveProps = (nextProps) => {
    // It seems that Strapi sets the value property after the editor was initialized,
    // this rendering initialValue useless, and proper value never making it into 
    // the component. Instead, we are setting the value manually, but only on the first 
    // update.
    if (nextProps.value !== this.props.value && this.props.value == null) {
      const editor = this.editorRef.current.getInstance();
      editor.setMarkdown(nextProps.value, false);
    }
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
    let editor_instance = this.editorRef.current.getInstance();
    if (data.mime.includes('image')) {
      editor_instance.exec('AddImage', { 'altText': data.caption, 'imageUrl': data.url } );
    }
    else {
      editor_instance.exec('AddLink', { 'linkText': data.name, 'url': data.url } );
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
          usageStatistics={false}
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
