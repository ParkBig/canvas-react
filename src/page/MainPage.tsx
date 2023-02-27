import styled from "styled-components"
import Canvas from "../components/Canvas";

const MainPage = () => {
  return (
    <Wrap>
      <Canvas />
    </Wrap>
  )
}

export default MainPage;

const Wrap = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #55efc4;
`;