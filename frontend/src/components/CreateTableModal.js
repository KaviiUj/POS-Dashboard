import React, { useState } from 'react';
import styled from 'styled-components';
import { tableAPI } from '../services/api';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${spacing.lg};
`;

const ModalContent = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitleDiv = styled.div`
  padding: ${spacing.lg};
  border-bottom: 1px solid ${colors.border.light};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h2`
  font-size: ${fontSize.xl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${fontSize.xl};
  cursor: pointer;
  color: ${colors.text.secondary};
  padding: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.background.tertiary};
    color: ${colors.text.primary};
  }
`;

const ModalContentDiv = styled.div`
  padding: ${spacing.lg};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Label = styled.label`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const RequiredIndicator = styled.span`
  color: ${colors.status.error};
  font-size: ${fontSize.md};
`;

const Input = styled.input`
  padding: ${spacing.md};
  font-size: ${fontSize.md};
  border: 2px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;

  &:focus {
    border-color: ${colors.primary.purple};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

const Select = styled.select`
  padding: ${spacing.md};
  font-size: ${fontSize.md};
  border: 2px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  background-color: ${colors.background.primary};
  cursor: pointer;

  &:focus {
    border-color: ${colors.primary.purple};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
  padding: ${spacing.lg} ${spacing.lg} ${spacing.xl} 0;
  border-top: 1px solid ${colors.border.light};
`;

const CancelButton = styled.button`
  background-color: ${colors.background.tertiary};
  color: ${colors.text.primary};
  border: 2px solid ${colors.border.light};
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.border.light};
    border-color: ${colors.text.secondary};
  }
`;

const CreateButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary.purple} 0%, ${colors.primary.purpleHover} 100%);
  color: ${colors.text.white};
  border: none;
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Main Component
const CreateTableModal = ({ isOpen, onClose, onTableCreated, showToast }) => {
  const [formData, setFormData] = useState({
    tableName: '',
    pax: 4,
    isAvailable: true
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value === 'true'
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.tableName.trim()) {
      showToast('Table name is required', 'error', 'Validation Error', 3000);
      return;
    }

    setLoading(true);
    try {
      const tableData = {
        tableName: formData.tableName,
        pax: formData.pax,
        isAvailable: formData.isAvailable,
        orderId: null
      };

      console.log('Creating table:', tableData);
      const response = await tableAPI.create(tableData);
      console.log('Create table response:', response.data);
      
      if (response.data.success) {
        showToast(response.data.message || 'Table created successfully!', 'success', 'Success', 3000);
        onTableCreated(response.data.data);
        
        // Clear form but don't close modal
        setFormData({
          tableName: '',
          pax: 4,
          isAvailable: true
        });
      }
    } catch (error) {
      console.error('Create table error:', error);
      showToast('Failed to create table', 'error', 'Error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      tableName: '',
      pax: 4,
      isAvailable: true
    });
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitleDiv>
          <ModalTitle>Create Table</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalTitleDiv>

        <ModalContentDiv>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>
                Table Name <RequiredIndicator>*</RequiredIndicator>
              </Label>
              <Input
                type="text"
                name="tableName"
                value={formData.tableName}
                onChange={handleInputChange}
                placeholder="Enter table name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Pax (Number of people)</Label>
              <Input
                type="number"
                name="pax"
                value={formData.pax}
                onChange={handleInputChange}
                placeholder="Enter number of people"
                min="1"
                max="20"
              />
            </FormGroup>
          </Form>
        </ModalContentDiv>

        <ButtonContainer>
          <CancelButton type="button" onClick={handleClose}>
            Cancel
          </CancelButton>
          <CreateButton type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Table'}
          </CreateButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateTableModal;
