import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';

import { Layout, theme, Button, Space, Input, Divider } from 'antd';
import { useLocation } from 'react-router-dom';
const { Header, Content, Footer } = Layout;

const Example = () => {
  const editor = useRef(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const location = useLocation();
  const {
    token: { colorBgContainer },
  } = theme.useToken();


  const config = {
    zIndex: 0,
    readonly: true,

    theme: 'default',
 
    height: 400,
   
    imageDefaultWidth: 100,
   
  };
  useEffect(() => {
    debugger
    setTitle(location.state?.title);
    setContent(location.state?.content)

  }, []);
  return (
    <Layout>

      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: colorBgContainer
        }}
      >
        <Input  value={title} style={{ textAlign: "center", fontSize: 24 }} placeholder='请输入标题' />

        <JoditEditor
          ref={editor}
          value={content}
          config={config}
          //      tabIndex={1} // tabIndex of textarea
          onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        //  onChange={e => setContent(e)}
        />
      </Content>
      
    </Layout>
  );
};
export default Example