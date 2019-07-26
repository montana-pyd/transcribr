import React, { Component } from 'react';
import styled from 'styled-components';
import colors from './../styles/colors';
import { Button } from 'semantic-ui-react';

const ButtonStyle = styled.div`
  .ui.button {
    position: relative;
    height: 40px;
    border-radius: 5px;
    color: ${colors.white};
    margin: 1rem 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.6rem;
    padding: 0px;

    &:hover {
      cursor: pointer;
    }
  }
`;

export default function ({ children, ...props }) {
  return (
    <ButtonStyle {...props}>
      <Button {...props}>{children}</Button>
    </ButtonStyle>
  );
}
