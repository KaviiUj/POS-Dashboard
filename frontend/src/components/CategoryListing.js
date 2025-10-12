import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { categoryAPI } from '../services/api';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import Layout from './Layout';
import AlertDialog from './AlertDialog';

// Styled Components
const Container = styled.div`
  padding: ${spacing.lg};
`;

const Header = styled.div`
  margin-bottom: ${spacing.lg};
  background-color: ${colors.background.primary};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px ${colors.shadow.light};
`;

const Title = styled.h1`
  font-size: ${fontSize.xxxl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0;
`;

const TableContainer = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px ${colors.shadow.light};
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${colors.background.tertiary};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.border.light};
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableHeaderCell = styled.th`
  padding: ${spacing.lg};
  text-align: left;
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  border-bottom: 1px solid ${colors.border.light};
`;

const TableCell = styled.td`
  padding: ${spacing.lg};
  font-size: ${fontSize.md};
  color: ${colors.text.primary};
  vertical-align: middle;
`;

const CategoryId = styled.span`
  font-family: 'Courier New', monospace;
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  background-color: ${colors.background.tertiary};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
`;

const CategoryName = styled.a`
  color: ${colors.primary.purple};
  text-decoration: none;
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${colors.primary.purpleHover};
    text-decoration: underline;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: ${spacing.xs} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  background-color: ${props => props.active ? colors.status.success : colors.status.error};
  color: ${colors.text.white};
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-1px);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${spacing.sm};
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  font-size: ${fontSize.md};
  color: ${props => props.color || colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.color === colors.status.error ? 
      'rgba(231, 76, 60, 0.1)' : 
      props.color === colors.primary.purple ? 
      'rgba(106, 63, 251, 0.1)' : 
      colors.background.tertiary
    };
    transform: translateY(-1px);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
  color: ${colors.text.secondary};
  font-size: ${fontSize.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
  color: ${colors.status.error};
  font-size: ${fontSize.lg};
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: ${borderRadius.lg};
  margin: ${spacing.lg} 0;
`;

// Main Category Listing Component
const CategoryListing = ({ showToast }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    category: null
  });
  const [statusConfirm, setStatusConfirm] = useState({
    isOpen: false,
    category: null
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    console.log('Found category for editing:', category);
    console.log('Category ID from parameter:', categoryId);
    console.log('Category categoryId field:', category?.categoryId);
    
    if (category) {
      setEditModal({
        isOpen: true,
        category: category
      });
    }
  };

  const handleDelete = (categoryId) => {
    console.log('Delete category:', categoryId);
    // TODO: Implement delete functionality with confirmation
  };

  // Handle status toggle
  const handleStatusToggle = (category) => {
    setStatusConfirm({
      isOpen: true,
      category: category
    });
  };

  // Confirm status change
  const handleStatusConfirm = async () => {
    try {
      const response = await categoryAPI.updateStatus({
        categoryId: statusConfirm.category.categoryId,
        isActive: !statusConfirm.category.isActive
      });

      if (response.data.success) {
        // Update the categories list
        setCategories(prev => 
          prev.map(cat => 
            cat.categoryId === statusConfirm.category.categoryId 
              ? { ...cat, isActive: response.data.data.isActive }
              : cat
          )
        );
        
        // Show success toast
        const statusText = response.data.data.isActive ? 'activated' : 'deactivated';
        showToast(
          `Category "${response.data.data.categoryName}" ${statusText} successfully!`,
          'success',
          'Status Updated!',
          3000
        );
        
        setStatusConfirm({ isOpen: false, category: null });
      }
    } catch (err) {
      console.error('Error updating category status:', err);
      showToast(
        'Failed to update category status',
        'error',
        'Update Failed!',
        3000
      );
    }
  };

  // Cancel status change
  const handleStatusCancel = () => {
    setStatusConfirm({ isOpen: false, category: null });
  };

  const handleUpdateCategory = async (updatedData) => {
    try {
      console.log('Edit Modal Category:', editModal.category);
      console.log('Category ID:', editModal.category?._id);
      console.log('Updated Data:', updatedData);
      
      // Make sure we have the category ID
      const categoryId = editModal.category?.categoryId;
      console.log('Final Category ID to use:', categoryId);
      
      if (!categoryId) {
        console.error('No category ID found!');
        return;
      }
      
      const requestData = {
        categoryId: categoryId,
        categoryName: updatedData.categoryName,
        discount: updatedData.discount
      };
      
      console.log('Request Data being sent:', requestData);
      
      const response = await categoryAPI.update(requestData);

      if (response.data.success) {
        // Update the categories list
        setCategories(prev => 
          prev.map(cat => 
            cat.categoryId === editModal.category.categoryId 
              ? { ...cat, ...updatedData }
              : cat
          )
        );
        setEditModal({ isOpen: false, category: null });
      }
    } catch (err) {
      console.error('Error updating category:', err);
      console.error('Error response:', err.response?.data);
      // TODO: Show error message
    }
  };

        if (loading) {
          return (
            <Layout currentPage="categories-listing">
              <Container>
                <Header>
                  <Title>CATEGORIES</Title>
                </Header>
                <LoadingMessage>Loading categories...</LoadingMessage>
              </Container>
            </Layout>
          );
        }

        if (error) {
          return (
            <Layout currentPage="categories-listing">
              <Container>
                <Header>
                  <Title>CATEGORIES</Title>
                </Header>
                <ErrorMessage>{error}</ErrorMessage>
              </Container>
            </Layout>
          );
        }

        return (
          <Layout currentPage="categories-listing">
            <Container>
      <Header>
        <Title>CATEGORIES</Title>
      </Header>

      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Categories ID</TableHeaderCell>
              <TableHeaderCell>Categories Name</TableHeaderCell>
              <TableHeaderCell>Typical Ingredients</TableHeaderCell>
              <TableHeaderCell>Discount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Action</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <tbody>
            {categories.map((category, index) => (
              <TableRow key={category.categoryId}>
                <TableCell>
                  <CategoryId>#CAT-{String(index + 1).padStart(3, '0')}</CategoryId>
                </TableCell>
                <TableCell>
                  <CategoryName>
                    {category.categoryName}
                  </CategoryName>
                </TableCell>
                <TableCell>
                  {category.typicalIngredients || 'N/A'}
                </TableCell>
                <TableCell>
                  {category.discount ? `${category.discount}%` : '0%'}
                </TableCell>
                <TableCell>
                  <StatusBadge 
                    active={category.isActive}
                    onClick={() => handleStatusToggle(category)}
                    style={{ cursor: 'pointer' }}
                  >
                    {category.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ActionButtons>
                    <ActionButton 
                      onClick={() => handleEdit(category.categoryId)}
                      color={colors.primary.purple}
                      title="Edit Category"
                    >
                      ✏️
                    </ActionButton>
                    <ActionButton 
                      onClick={() => handleDelete(category.categoryId)}
                      color={colors.status.error}
                      title="Delete Category"
                    >
                      🗑️
                    </ActionButton>
                  </ActionButtons>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </Container>

    <EditCategoryModal
      isOpen={editModal.isOpen}
      category={editModal.category}
      onClose={() => setEditModal({ isOpen: false, category: null })}
      onSave={handleUpdateCategory}
    />

    <AlertDialog
      isOpen={statusConfirm.isOpen}
      type="info"
      title="Confirm Status Change"
      message={`Are you sure you want to ${statusConfirm.category?.isActive ? 'deactivate' : 'activate'} the category "${statusConfirm.category?.categoryName}"?`}
      onClose={handleStatusCancel}
      onConfirm={handleStatusConfirm}
      confirmText={`Yes, ${statusConfirm.category?.isActive ? 'Deactivate' : 'Activate'}`}
      cancelText="Cancel"
      showCancel={true}
    />
    </Layout>
  );
};

// Edit Category Modal Component
const EditCategoryModal = ({ isOpen, category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    categoryName: '',
    discount: 0
  });

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName || '',
        discount: category.discount || 0
      });
    }
  }, [category]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    console.log('onSave function:', onSave);
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'discount' ? parseFloat(value) || 0 : value
    }));
  };

  if (!isOpen || !category) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Edit Category</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="categoryName">Category Name</Label>
              <Input
                type="text"
                id="categoryName"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="discount">Discount (%)</Label>
              <Input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                placeholder="Enter discount percentage"
              />
            </FormGroup>

            <ButtonGroup>
              <CancelButton type="button" onClick={onClose}>
                Cancel
              </CancelButton>
              <SaveButton type="submit" onClick={() => console.log('Save button clicked')}>
                Save Changes
              </SaveButton>
            </ButtonGroup>
          </Form>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

// Modal Styled Components
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
  animation: fadeIn 0.3s ease-out;
`;

const ModalContent = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 40px ${colors.shadow.dark};
  animation: slideUp 0.3s ease-out;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${spacing.lg} ${spacing.xl};
  border-bottom: 1px solid ${colors.border.light};
`;

const ModalTitle = styled.h2`
  font-size: ${fontSize.xl};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: ${fontSize.xxl};
  color: ${colors.text.secondary};
  cursor: pointer;
  padding: ${spacing.sm};
  border-radius: ${borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.background.tertiary};
    color: ${colors.text.primary};
  }
`;

const ModalBody = styled.div`
  padding: ${spacing.xl};
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
`;

const Input = styled.input`
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  color: ${colors.text.primary};
  background-color: ${colors.background.primary};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${colors.primary.purple};
    box-shadow: 0 0 0 3px rgba(106, 63, 251, 0.1);
  }

  &::placeholder {
    color: ${colors.text.secondary};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: flex-end;
  margin-top: ${spacing.lg};
`;

const CancelButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  background-color: transparent;
  color: ${colors.text.secondary};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.background.tertiary};
    border-color: ${colors.border.medium};
  }
`;

const SaveButton = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  border: none;
  border-radius: ${borderRadius.md};
  background-color: ${colors.primary.purple};
  color: ${colors.text.white};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primary.purpleHover};
    transform: translateY(-1px);
  }
`;

export default CategoryListing;
