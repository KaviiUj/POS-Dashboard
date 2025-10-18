import React from 'react';
import styled from 'styled-components';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import Layout from './Layout';
import CreateStaffModal from './CreateStaffModal';

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
  font-size: ${fontSize.lg};
  color: ${colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const CreateStaff = ({ showToast }) => {
  const handleStaffCreated = (newStaff) => {
    // This will be called when a staff member is successfully created
    // The parent component can handle refreshing the staff list
    console.log('New staff created:', newStaff);
  };

  return (
    <Layout currentPage="staff-create" showToast={showToast}>
      <Container>
        <Header>
          <Title>Create New Staff</Title>
          <Subtitle>Add a new staff member to your team with all the details</Subtitle>
        </Header>

        <CreateStaffModal
          isOpen={true}
          onClose={() => window.history.back()}
          onStaffCreated={handleStaffCreated}
          showToast={showToast}
        />
      </Container>
    </Layout>
  );
};

export default CreateStaff;
