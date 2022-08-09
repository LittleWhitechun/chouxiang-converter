import styled from 'styled-components';
import noErrorImgSrc from '../assets/noErrorImg.svg';
const StyledNoSuggestFillText = styled.div`
  text-align: center;
  line-height: 100px;
  font-family: fantasy;
  color: black;
  font-size: 16px;
  font-weight: 700;
`;
const StyledNoSuggestFill = styled.div`
  margin-top: 40%;
`;
const NoErrorFill = () => {
  return (
    <>
      <StyledNoSuggestFill>
        <img src={noErrorImgSrc}></img>
        <StyledNoSuggestFillText>
          过于抽象，无法翻译
        </StyledNoSuggestFillText>
      </StyledNoSuggestFill>
    </>
  );
};

export default NoErrorFill;
