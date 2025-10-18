import React from 'react';
import styled from 'styled-components';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import Layout from './Layout';
import CreateItemModal from './CreateItemModal';

const Container = styled.div`
  padding: ${spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${spacing.xl};
`;

const Title = styled.h1`
  font-size: ${fontSize.xxl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.sm} 0;
`;

const Subtitle = styled.p`
  font-size: ${fontSize.md};
  color: ${colors.text.secondary};
  margin: 0;
`;

const CreateItem = ({ showToast }) => {
  return (
    <Layout currentPage="items-create" showToast={showToast}>
      <Container>
        <Header>
          <Title>Create New Item</Title>
          <Subtitle>Add a new item to your menu with all the details</Subtitle>
        </Header>

        <CreateItemModal
          isOpen={true}
          onClose={() => window.history.back()}
          showToast={showToast}
        />
      </Container>
    </Layout>
  );
};

export default CreateItem;
