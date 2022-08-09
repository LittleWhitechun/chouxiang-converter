/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ContentContext } from '../context-manager';
import SuggestListItem from './SuggestListItem';
import NoContentFill from './NoContentFill';
import NoErrorFill from './NoErrorFill';
import SuggestTypesList from './SuggestTypesList';

interface ToDoItem {
  position: number[][];
  title: string;
  todo: string;
  replacement: string[];
}
const StyledSuggestList = styled.div`
  width: 450px;
  padding: 0 15px;
  overflow: auto;
  height: 98.7vh;
  min-height: 700px;
  border-radius: 5px;
  border: 1px solid #00000030;
  text-align: center;
  background-color: #fdfcff;
  img {
    display: inline-block;
  }
`;

const StyledSuggestListTitle = styled.div`
  font-weight: 700;
  line-height: 45px;
  padding: 0 0;
  text-align: left;
`;

const SuggestList = (props: {
  setDoReplaceProps: any;
  setListSelectedItem: any;
}) => {
  const { setDoReplaceProps, setListSelectedItem } = props;
  const [suggestTypesCount, setSuggestTypesCount] = useState<{
    [key: string]: number;
  }>({
    AllCount: 0,
    Misspelling: 0,
    SyntaxError: 0,
    FormatError: 0,
  });
  const [showContent, setShowContent] = useState<ToDoItem[]>([]);
  const [curType, setCurType] = useState<string>('AllCount');
  const context = useContext(ContentContext);
  const {
    content,
    setUnFoldItem,
  }: { content: ToDoItem[]; setUnFoldItem: () => void } = context;
  if (context.allContent) {
    context.allContent = context.allContent.trim();
  }

  const getShowContent = (type: string) => {
    if (type == 'AllCount') {
      return content;
    } else {
      return content.filter(item => item.todo == type);
    }
  };

  useEffect(() => {
    // 设置各类type数量 content改变时重新渲染
    const tmpSuggestTypesCount = suggestTypesCount;
    Object.keys(tmpSuggestTypesCount).forEach(type => {
      tmpSuggestTypesCount[type] = content.filter(
        item => item.todo == type,
      ).length;
    });
    tmpSuggestTypesCount.AllCount = eval(
      Object.values(tmpSuggestTypesCount).join('+'),
    );
    setSuggestTypesCount(tmpSuggestTypesCount);
    setShowContent(getShowContent(curType));
  }, [content]);

  useEffect(() => {
    setShowContent(getShowContent(curType));
  }, [curType]);

  return (
    <>
      <StyledSuggestList className="suggest-list">
        <StyledSuggestListTitle>
          {`抽象修改 `}
          <span className="text-gray-500 font-normal ml-2">
            {suggestTypesCount.AllCount}
          </span>
        </StyledSuggestListTitle>
        {showContent.length != 0 ? (
          showContent.map((item, index) => {
            return (
              <SuggestListItem
                itemData={item}
                setUnFoldItem={setUnFoldItem}
                setDoReplaceProps={setDoReplaceProps}
                setListSelectedItem={setListSelectedItem}
                key={index}
              />
            );
          })
        ) : context.allContent.length > 0 ? (
          <NoErrorFill />
        ) : (
          <NoContentFill />
        )}
      </StyledSuggestList>
      <SuggestTypesList
        suggestTypesCount={suggestTypesCount}
        curType={curType}
        setCurType={setCurType}
      />
    </>
  );
};

export default SuggestList;
