/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import styled from "styled-components";
import { Tag, Button, Divider } from "@arco-design/web-react";
import { IconArrowRight, IconDelete } from "@arco-design/web-react/icon";
import "@arco-design/web-react/dist/css/arco.css";
import { ContentContext } from "../context-manager";
import redPointImgSrc from "../assets/redPointImg.svg";

const typeCNNames: { [key: string]: string } = {
  AllCount: "全部类别",
  Misspelling: "抽象类1",
  SyntaxError: "抽象类2",
  FormatError: "抽象类3",
};
interface childProps {
  itemData: any;
  setUnFoldItem: (value: string) => void;
  setDoReplaceProps: any;
  setListSelectedItem: any;
}

const SuggestListItemTodo = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  font-size: 20px;
  /* transition: all 0.35s ease; */
  .arco-tag-checked {
    font-size: 14px;
    border-radius: 0.75rem;
    padding: 0 0.5rem;
  }
`;

const SuggestListIteTitleTodo = styled.span`
  font-size: 12px;
  float: right;
  color: gray;
  margin-left: 0.5rem;
`;

const SuggestListItemReplace = styled.div`
  width: 100%;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  font-family: "FZYASHS--GB1-0", sans-serif;
  letter-spacing: 0.5px;
  color: #1d2129;
  margin-left: 0.5rem;
`;

const SuggestListItemDetail = styled.div`
  display: flex;
  flex-direction: row-reverse;
  font-size: 1rem;
  padding-right: 1rem;
  & svg:hover {
    background-color: #e5e6eb;
    border-radius: 5px;
  }
`;

const SuggestListItemStyled = styled.div`
  padding: 13px 20px;
  border: 1px solid #0000001f;
  margin-bottom: 1rem;
  margin-top: 1rem;
  line-height: 22px;
  margin-bottom: 5px;
  transition: all 0.25s ease;
  will-change: height;
  transform: translateY(0px);
  padding: 14px 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  cursor: default;
  user-select: none;
  .arco-divider {
    margin: 10px 0;
  }
  height: 55px;
  &.unfold {
    height: 200px;
  }
`;

const SuggestListItem: React.FC<childProps> = (props) => {
  const { itemData, setUnFoldItem, setDoReplaceProps, setListSelectedItem } =
    props;
  const { title, todo, replacement, position } = itemData;
  const context = useContext(ContentContext);
  const showDetail = (e: React.MouseEvent): void => {
    setUnFoldItem(position.join("-"));
    const curDom = document.getElementById(position.join("-"));
    setListSelectedItem([...position, curDom?.getBoundingClientRect().top]);

    context.setCurListItemId(position.join("-"));
  };
  const doReplace = (emoji:string): void => {
    setDoReplaceProps([position, emoji]);
    context.clearSelect()
  };
  const deleteSuggest = (): void => {
    let tmpContent: any = context.content;
    tmpContent = tmpContent.filter((item: { position: any[] }) => {
      return item.position.join("-") !== position.join("-");
    });
    context.setContent(tmpContent);
  };
  return (
    <>
      <SuggestListItemStyled
        id={position.join("-")}
        onClick={(e) => showDetail(e)}
      >
        {position.join("-") !== context.curListItemId ? (
          <>
            <div className="cursor-pointer flex gap-1">
              <img src={redPointImgSrc} className="inline-block mr-2"></img>
              <span className="mr-3 inline-block longWordStyle">{title}</span>
              <SuggestListIteTitleTodo>
                {typeCNNames[todo]}
              </SuggestListIteTitleTodo>
            </div>
          </>
        ) : (
          <>
            <SuggestListItemTodo>
              <img
                src={redPointImgSrc}
                style={{ display: "inline-block", marginRight: "0.5rem" }}
              ></img>
              <Tag color="gray" size="medium">
                {typeCNNames[todo]}
              </Tag>
            </SuggestListItemTodo>
            <div className="flex justify-start items-center my-4 pl-2">
              <span className="longWordStyle">{title}</span>
              <IconArrowRight style={{ margin: "0 1rem" }} />
              {replacement.map((emoji:string,index:number) => {
                return (
                  <>
                    <Button
                      shape="round"
                      type="primary"
                      onClick={() => doReplace(emoji)}
                      key={index}
                    >
                      {emoji}
                    </Button>
                    {' '}
                  </>
                );
              })}
            </div>
            <SuggestListItemReplace>{`建议把${title}改成${replacement}。`}</SuggestListItemReplace>
            <Divider />
            <SuggestListItemDetail>
              <IconDelete
                onClick={() => deleteSuggest()}
                className="hover:bg-gray-100 cursor-pointer rounded-md p-1"
                style={{ fontSize: "1.6rem", color: "rgb(134, 144, 156)" }}
              />
            </SuggestListItemDetail>
          </>
        )}
      </SuggestListItemStyled>
    </>
  );
};

export default SuggestListItem;
