import styled from 'styled-components';
import colors from './../colors';

export const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const Form = styled.div`
  width: 400px;
  position: relative;
  margin-top: -60px;
  background-color: ${colors.white};
  border-radius: 5px;
  padding: 20px 20px 10px;
  box-shadow: 0px 1px 6px -2px rgba(0,0,0,0.5);

`;

export const Header = styled.h1`
    margin: 0 0 2rem;
    text-transform: inherit;
`;

export const Text = styled.div`
  text-align: center;
  margin: 2rem 0 1.5rem;
`;