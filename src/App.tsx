/* eslint-disable @typescript-eslint/naming-convention */
import './App.css';
import 'tailwindcss/base.css';
import 'tailwindcss/components.css';
import 'tailwindcss/utilities.css';
import styled from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import SuggestList from './components/SuggestList';
import MyTextArea from './components/TextArea';
import { ContentContext } from './context-manager';

interface todoItem {
  position: number[][];
  title: string;
  todo: string;
  replacement: string[];
}
const StyledApp = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0 0 20px;
  background-color: white;
  height: 100vh;
  min-width: 1000px;
`;

function App() {
  const [content, setContent] = useState<todoItem[]>([]);
  const [allContent, setAllContent] = useState<string>('');
  const [unfoldItem, setUnFoldItem] = useState('');
  const [curListItemId, setCurListItemId] = useState('');
  const [doReplaceProps, setDoReplaceProps] = useState([]);
  const [listSelectedItem, setListSelectedItem] = useState([]);

  const textAreaRef: React.Ref<any> = useRef();
  const allConversion = textAreaRef.current?.allConversion
  const clearSelect: () => void = () => {
    const listDom = document.getElementsByClassName('suggest-list')[0];
    Array.from(listDom.children).forEach(item => {
      item.classList.remove('unfold');
    });
    textAreaRef.current?.clearTextAreaSelect();
  };

  useEffect(() => {
    // console.log('app content:',content)
  }, [content]);

  useEffect(() => {
    setCurListItemId(unfoldItem)
    const selectedDom = document.getElementById(unfoldItem);
    if (selectedDom) {
      const listDom = document.getElementsByClassName('suggest-list')[0];
      Array.from(listDom.children).forEach(item => {
        item.classList.remove('unfold');
      });
      selectedDom.classList.add('unfold');
    }
  }, [unfoldItem]);

  useEffect(() => {
    // console.log('reaplce:',doReplaceProps)
  }, [doReplaceProps]);
  return (
    <>
      <ContentContext.Provider
        value={{
          allContent,
          setAllContent,
          content,
          setContent,
          curListItemId,
          setCurListItemId,
          clearSelect,
          setUnFoldItem,
          allConversion,
        }}
      >
        <StyledApp>
          <MyTextArea
            doReplaceProps={doReplaceProps}
            listSelectedItem={listSelectedItem}
            setAllContent={setAllContent}
            textAreaRef={textAreaRef}
          />
          <SuggestList
            setDoReplaceProps={setDoReplaceProps}
            setListSelectedItem={setListSelectedItem}
          />
        </StyledApp>
      </ContentContext.Provider>
    </>
  );
}

export default App;
