import React, { Component } from 'react';
import styled from 'styled-components';
import colors from './../styles/colors';
import { Input } from 'semantic-ui-react';

const InputStyle = styled.div`
  .ui.input {
    height: 40px;
    margin-bottom: 1rem;

  }

  .input {
    > input {
      height: 40px;
    }
  }
`;

export default function ({ ...props }) {
  return (
    <InputStyle {...props}>
      <Input {...props} />
    </InputStyle>
  );
}
