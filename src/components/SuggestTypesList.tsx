import styled from "styled-components";
import { useContext } from "react";
import { ContentContext } from "../context-manager";
import { Button } from "@arco-design/web-react";
import redPointImgSrc from "../assets/redPointImg.svg";
import ScoreSvg from "./Svg/ScoreSvg";

const StyledSuggestTypesList = styled.div`
  padding: 0 15px;
  height: 450px;
  border-radius: 5px;
  margin-top: 10px;
`;

const StyledScore = styled.div`
  margin-bottom: -25px;
  margin-left: 7px;
  font-style: normal;
  font-weight: 400;
  font-size: 40px;
  line-height: 71px;
  color: rgb(16 16 16);
  font-family: HYTangMeiRenW, sans-serif;
  text-align: center;
`;

const StyledSuggestTypesListItem = styled.div`
  background-color: rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: #000000c7;
  padding: 0.375rem;
  border-radius: 0.5rem;
  text-align: center;
  margin-bottom: 10px;
  user-select: none;
  width: 128px;
  &:hover,
  &.active {
    background-color: #ebf3ff;
    color: #2579ff;
    font-weight: 700;
  }
  &:hover .StyledSuggestTypesListItemCount {
    background-color: #2579ff;
    color: white;
  }
`;

const StyledSuggestTypesListItemCount = styled.span`
  // mix-blend-mode: difference;
  border-radius: 5px;
  margin-left: 5px;
  padding: 0 7.5px;
  color: #4e5969;
  background-color: #f2f3f5;
  border-radius: 0.5rem;
  &:hover,
  &.active {
    background-color: #2579ff;
    color: white;
  }
`;
const typeCNNames: { [key: string]: string } = {
  AllCount: "全部类别",
  Misspelling: "抽象类1",
  SyntaxError: "抽象类2",
  FormatError: "抽象类3",
};

const SuggestTypesList = (props: {
  suggestTypesCount: { [key: string]: number };
  curType: string;
  setCurType: (value: string) => void;
}) => {
  const context = useContext(ContentContext);
  const { clearSelect, setCurListItemId } = context;
  const { suggestTypesCount, curType, setCurType } = props;
  if (context.allContent) {
    context.allContent = context.allContent.trim();
  }
  return (
    <>
      <StyledSuggestTypesList>
        <div className="flex justify-center items-center h-48">
          <div>
            <div>
              <StyledScore>
                {context.allContent.length > 0
                  ? (
                      (suggestTypesCount.AllCount / context.allContent.length) *
                      100
                    ).toFixed(0)
                  : "0"}
              </StyledScore>
              <ScoreSvg />
            </div>
          </div>
        </div>
        <div className="flex justify-center text-gray-900 py-4">
          <Button
            shape="round"
            type="primary"
            onClick={() => context.allConversion()}
          >
            一键抽象
          </Button>
        </div>
        <div className="p-1 mb-3">
          <img
            src={redPointImgSrc}
            className="inline-block mr-2"
            alt="point"
          ></img>
          <span className="text-sm text-gray-400">智能纠错</span>
        </div>
        {Object.keys(suggestTypesCount).map((type, index) => {
          return (
            <StyledSuggestTypesListItem
              onClick={() => {
                setCurType(type);
                clearSelect();
                setCurListItemId("");
              }}
              className={type === curType ? "active" : ""}
              key={index}
            >
              {typeCNNames[type]}
              <StyledSuggestTypesListItemCount
                className={`StyledSuggestTypesListItemCount ${
                  type === curType ? "active" : ""
                }`}
              >
                {suggestTypesCount[type]}
              </StyledSuggestTypesListItemCount>
            </StyledSuggestTypesListItem>
          );
        })}
      </StyledSuggestTypesList>
    </>
  );
};

export default SuggestTypesList;
