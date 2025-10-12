import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { categoryAPI } from '../services/api';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import Layout from './Layout';
import AlertDialog from './AlertDialog';

// Styled Components
const Container = styled.div`
  padding: ${spacing.lg};
  max-width: 800px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${spacing.xl};
`;

const Title = styled.h1`
  font-size: ${fontSize.xxxl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.sm} 0;
`;

const Subtitle = styled.p`
  font-size: ${fontSize.md};
  color: ${colors.text.secondary};
  margin: 0;
`;

const Card = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  box-shadow: 0 2px 8px ${colors.shadow.light};
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const Label = styled.label`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.primary};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const RequiredIndicator = styled.span`
  color: ${colors.status.error};
  font-size: ${fontSize.lg};
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

  &:disabled {
    background-color: ${colors.background.tertiary};
    cursor: not-allowed;
  }
`;

const InputHelper = styled.span`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  margin-top: ${spacing.xs};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  margin-top: ${spacing.lg};
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: ${spacing.md} ${spacing.xl};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  border: none;
  border-radius: ${borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-family: inherit;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const CancelButton = styled(Button)`
  background-color: ${colors.background.tertiary};
  color: ${colors.text.primary};

  &:hover:not(:disabled) {
    background-color: ${colors.border.light};
  }
`;

const SubmitButton = styled(Button)`
  background: linear-gradient(135deg, ${colors.primary.purple} 0%, ${colors.primary.purpleHover} 100%);
  color: ${colors.text.white};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;

const InfoBox = styled.div`
  background-color: rgba(124, 58, 237, 0.05);
  border-left: 4px solid ${colors.primary.purple};
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  margin-top: ${spacing.lg};
`;

const InfoTitle = styled.div`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.semibold};
  color: ${colors.primary.purple};
  margin-bottom: ${spacing.xs};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const InfoText = styled.p`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

// Main Component
const CategoryCreate = ({ showToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryName: '',
    discount: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'error',
    title: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for discount to ensure it's within range
    if (name === 'discount') {
      const numValue = value === '' ? '' : parseFloat(value);
      if (numValue !== '' && (numValue < 0 || numValue > 100)) {
        return; // Don't update if out of range
      }
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare request data
      const requestData = {
        categoryName: formData.categoryName.trim()
      };

      // Only include discount if it's provided and greater than 0
      if (formData.discount !== '' && formData.discount > 0) {
        requestData.discount = parseFloat(formData.discount);
      }

      console.log('Creating category with data:', requestData);

      const response = await categoryAPI.add(requestData);
      console.log('Category creation response:', response.data);

      if (response.data.success) {
        showToast(
          `Category "${response.data.data.categoryName}" created successfully!`,
          'success',
          'Category Created!',
          3000
        );

        // Clear the form
        setFormData({
          categoryName: '',
          discount: ''
        });
      } else {
        throw new Error(response.data.message || 'Failed to create category');
      }

    } catch (err) {
      console.error('Category creation error:', err);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Failed to create category. Please try again.';
      
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Creation Failed',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/categories/listing');
  };

  return (
    <Layout currentPage="categories-create" showToast={showToast}>
      <Container>
        <Header>
          <Title>Create New Category</Title>
          <Subtitle>Add a new category to organize your menu items</Subtitle>
        </Header>

        <Card>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="categoryName">
                Category Name
                <RequiredIndicator>*</RequiredIndicator>
              </Label>
              <Input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                placeholder="e.g., Beverages, Pizza, Desserts"
                required
                disabled={loading}
                maxLength={100}
              />
              <InputHelper>
                Enter a unique name for this category
              </InputHelper>
            </FormGroup>

            <FormGroup>
              <Label htmlFor="discount">
                Discount (%)
              </Label>
              <Input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
                step="0.1"
                disabled={loading}
              />
              <InputHelper>
                Optional: Set a category-wide discount (0-100%)
              </InputHelper>
            </FormGroup>

            <ButtonGroup>
              <CancelButton 
                type="button" 
                onClick={handleCancel}
                disabled={loading}
              >
                ✕ Cancel
              </CancelButton>
              <SubmitButton 
                type="submit"
                disabled={loading || !formData.categoryName.trim()}
              >
                {loading ? '⏳ Creating...' : '✓ Create Category'}
              </SubmitButton>
            </ButtonGroup>
          </Form>

          <InfoBox>
            <InfoTitle>
              💡 Quick Tips
            </InfoTitle>
            <InfoText>
              • Category names should be clear and descriptive<br />
              • Discounts apply to all items within this category<br />
              • You can edit or deactivate categories later<br />
              • All new categories are active by default
            </InfoText>
          </InfoBox>
        </Card>

        <AlertDialog
          isOpen={alert.isOpen}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        />
      </Container>
    </Layout>
  );
};

export default CategoryCreate;

