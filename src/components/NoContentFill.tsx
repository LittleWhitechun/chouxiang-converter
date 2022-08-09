import styled from 'styled-components';
import iconImgSrc from '../assets/chouxiang-icon.png';

const StyledNoSuggestFillText = styled.div`
  text-align: center;
  line-height: 100px;
  font-family: fantasy;
  color: black;
  font-size: 16px;
  font-weight: 700;
`;
const StyledNoSuggestFill = styled.div`
  margin-top: 10%;
`;
const NoContentFill = () => {
  return (
    <>
      <StyledNoSuggestFill>
        <img src={iconImgSrc} style={{width: '45%'}}></img>
        <StyledNoSuggestFillText>开启抽象转换</StyledNoSuggestFillText>
        <div className="text-xs text-gray-500">
          根据你的写作内容，提供实时精准的抽象转换
        </div>
      </StyledNoSuggestFill>
    </>
  );
};

export default NoContentFill;
