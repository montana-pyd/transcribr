import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import client from '../util/client';
import { Page } from '../styles/App';
import Input from '../components/Input';
import Button from '../components/Button';
import styled from 'styled-components';
import colors from '../styles/colors';


const Container = styled.div`
  width: 100%;
  position: relative;
  margin: 20px 0;
  background-color: ${colors.white};
  border-radius: 5px;
  padding: 20px 20px 10px;
  box-shadow: 0px 1px 6px -2px rgba(0,0,0,0.5);
`;

const Header = styled.div`
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  font-size: 1.6rem;
  font-weight: 600;
  margin-right: 10px;
`;


export default class Dashboard extends Component {
  renderError() {
    if (this.state.error) {
      return (
        <div className="Error">
          {this.state.error}
        </div>
      );
    }
  }
  render() {
    return (
      <Page>
        <Container>
          <Header>
            <Row>
              <StyledLink to="/dashboard">Home</StyledLink>
              <StyledLink to="/billing">Billing</StyledLink>
            </Row>
            <Row>
              <StyledLink to="/new-transcription">+ New Transcription</StyledLink>
            </Row>
          </Header>
        </Container>
      </Page>
    );
  }
}
