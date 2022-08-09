/* eslint-disable eqeqeq */
/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  useContext,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "../style/quill.css";
import { ContentContext } from "../context-manager";
import LogoSvg from "./Svg/LogoSvg";
import SuggestRule from "./utils/SuggestRule";

const { banWordsEmoji } = SuggestRule;
const banWords = Object.keys(banWordsEmoji);

let lastContent = "";
let lastHighLightWord: number[] = [];
const banWordColor = "black";
const MyTextArea = (props: {
  doReplaceProps: any;
  listSelectedItem: any;
  setAllContent: (value: string) => void;
  textAreaRef: React.Ref<any>;
}) => {
  const [banText, setBanText] = useState<number[][]>([]);
  // 当前高亮显示的词，输入或者选择别的词时取消上一个高亮，并设置新高亮
  const [highLightWord, setHighLightWord] = useState<number[]>([]);
  const quillRef = useRef<null | Quill>(null);
  const {
    // setContent,
    // setUnFoldItem,
    doReplaceProps,
    listSelectedItem,
    setAllContent,
    textAreaRef,
  } = props;
  const context = useContext(ContentContext);
  const { setContent, setUnFoldItem } = context;
  // 取消高亮，需要重新设置修改词提示下划线
  function cancelHighLight(pos: number[]): void {
    if (
      quillRef.current?.getFormat(pos[0], pos[1]).color &&
      quillRef.current?.getFormat(pos[0], pos[1]).link
    ) {
      quillRef.current?.removeFormat(pos[0], pos[1]);
      quillRef.current?.formatText(pos[0], pos[1], {
        color: banWordColor,
      });
      quillRef.current?.formatText(pos[0], pos[1], "link", true);
    }
  }
  function findSubStr(str: string, subStr: string): number[] {
    const positions = [];
    let pos = str.indexOf(subStr);
    while (pos > -1) {
      positions.push(pos);
      pos = str.indexOf(subStr, pos + 1);
    }
    return positions;
  }
  function markBanWords(): void {
    banText.forEach((item) => {
      quillRef.current?.formatText(item[0], item[1], {
        color: banWordColor,
      });
      quillRef.current?.formatText(item[0], item[1], "link", true);
      quillRef.current?.removeFormat(item[0] + item[1], 0);
    });
  }
  function clearTextAreaSelect(): void {
    cancelHighLight(lastHighLightWord);
  }
  //一键替换
  function allConversion(): void {
    const curContent = quillRef.current?.getText();
    const textContent = curContent?.split("") || [];
    const resultContent = [];
    for (let text of textContent) {
      let char = banWordsEmoji[text] || [text];
      resultContent.push(char[0]);
    }
    quillRef.current?.deleteText(0, quillRef.current?.getLength());
    quillRef.current?.insertText(0, resultContent.join(""));
    console.log(resultContent.join(""));
  }
  useImperativeHandle(textAreaRef, () => ({
    clearTextAreaSelect: () => {
      clearTextAreaSelect();
    },
    allConversion: () => {
      allConversion();
    },
  }));
  // 高亮当前highlightword
  useEffect(() => {
    if (lastHighLightWord.length === 2) {
      cancelHighLight(lastHighLightWord);
    }
    if (highLightWord.length === 2) {
      quillRef.current?.formatText(
        highLightWord[0],
        highLightWord[1],
        "background",
        "rgb(0 121 243 / 52%)"
      );
    }
    lastHighLightWord = highLightWord;
  }, [highLightWord]);
  // 右侧列表点击了某个word，需要对左侧textarea进行位置跳转，并修改相应文字样式
  useEffect(() => {
    if (listSelectedItem.length === 3) {
      // 取消原来的高亮，设置新的高亮
      setHighLightWord([listSelectedItem[0], listSelectedItem[1]]);

      const textTop =
        quillRef.current?.getBounds(listSelectedItem[0], listSelectedItem[1])
          .top || 0;
      const listItemTop = listSelectedItem[2] || 0;
      document.getElementsByClassName("ql-editor")[0].scrollTop +=
        textTop - listItemTop + 20;
    }
  }, [listSelectedItem]);
  useEffect(() => {
    markBanWords();
  }, [banText]);

  // 替换文字
  useEffect(() => {
    // console.log("doreplace props:", doReplaceProps);
    if (doReplaceProps.length == 2) {
      quillRef.current?.deleteText(doReplaceProps[0][0], doReplaceProps[0][1]);
      quillRef.current?.insertText(
        doReplaceProps[0][0],
        doReplaceProps[1],
        "link",
        true
      );
      quillRef.current?.removeFormat(doReplaceProps[0][0], 2);
      setHighLightWord([]);
    }
  }, [doReplaceProps]);

  // 绑定text-change 和 select事件
  useEffect(() => {
    let changeContent: any[];
    if (quillRef.current) {
      return;
    }
    quillRef.current = new Quill("#editor", {
      theme: "snow",
      placeholder: "请在这里输入...",
    });
    quillRef.current.focus();
    // 输入 删除 修改文字
    quillRef.current.on("text-change", (del, oldDel, source) => {
      if (quillRef.current) {
        // 修改format也会触发text-change，判断一下文字是不是变了
        // 文字变了再去找banword
        const curContent = quillRef.current?.getText();
        if (curContent && lastContent == curContent) {
          return;
        }
        setAllContent(curContent);
        lastContent = curContent;

        const changeText: number[][] = [];
        let changeWords: string[] = [];

        // 找到现在的输入内容中的所有banwords，保存他们的Index length
        banWords.forEach((word) => {
          const poss = findSubStr(curContent, word);
          poss.forEach((pos) => {
            changeText.push([pos, word.length]);
          });
        });
        // 找到的banwords存储结果顺序是按照banwords的顺序，需要调整为按照出现的顺序
        changeText.sort((a: number[], b: number[]) => {
          return a[0] - b[0];
        });
        changeWords = changeText.map((item) => {
          return curContent.slice(item[0], item[0] + item[1]);
        });
        // 修改bantext,后续按照bantext对banwords进行标注
        setBanText(changeText);

        changeContent = changeText.map((item, idx) => {
          const curEmojis = banWordsEmoji[changeWords[idx]];
          const randomEmoji =
            curEmojis[Math.floor(Math.random() * curEmojis.length)];
          return {
            position: [item[0], item[1]],
            title: changeWords[idx],
            todo:
              changeWords[idx].length == 3
                ? "Misspelling"
                : changeWords[idx].length == 4
                ? "SyntaxError"
                : "FormatError",
            replacement: curEmojis || "Emoji",
          };
        });
        setContent(changeContent);
      }
    });

    // 选中文本回调
    quillRef.current.on("selection-change", (range, oldRange, source) => {
      //   console.log('range',quillRef.current?.getSelection())
      const selection = quillRef.current?.getSelection();

      if (selection) {
        const selectedId = `${selection?.index}-${selection?.length}`;
        if (
          document.getElementById(`${selection?.index}-${selection?.length}`)
        ) {
          setHighLightWord([selection.index, selection.length]);
          setUnFoldItem(selectedId);

          const selectionTop = quillRef.current?.getBounds(
            selection.index,
            selection.length
          ).top;
          const listItemTop = document
            .getElementById(selectedId)
            ?.getBoundingClientRect().top;
          if (selectionTop && listItemTop) {
            document.getElementsByClassName("suggest-list")[0].scrollTop +=
              listItemTop - selectionTop + 20;
          }
        }
      }
    });
  }, []);

  return (
    <>
      <div className=" select-none rounded-xl h-16 py-1 px-5 flex items-center flex-col">
        <div className="text-2xl">{"🚬🐘💬"}</div>
        <div className='text-gray-400'> 抽象话转换器</div>
      </div>

      <div id="editor"></div>
    </>
  );
};

export default MyTextArea;
