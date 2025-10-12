import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { itemAPI, categoryAPI } from '../services/api';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import Layout from './Layout';

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
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Title = styled.h1`
  font-size: ${fontSize.xxxl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.md} 0;
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: ${spacing.sm};
  overflow-x: auto;
  padding: ${spacing.sm} 0;
  margin-bottom: ${spacing.lg};
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.background.tertiary};
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.border.light};
    border-radius: 2px;
  }
`;

const CategoryChip = styled.div`
  background-color: ${props => props.active ? colors.primary.purple : colors.background.tertiary};
  color: ${props => props.active ? colors.text.white : colors.text.primary};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.full};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    background-color: ${props => props.active ? colors.primary.purpleHover : colors.border.light};
  }
`;

const TableContainer = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  overflow: auto;
  box-shadow: 0 2px 8px ${colors.shadow.light};
  max-height: calc(100vh - 200px);
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
  padding: ${spacing.md};
  text-align: left;
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: ${spacing.md};
  vertical-align: middle;
`;

const ItemImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${borderRadius.full};
  background-color: ${colors.background.tertiary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize.xl};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ItemName = styled.div`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const ItemDescription = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  line-height: 1.4;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Modifiers = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Price = styled.div`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.bold};
  color: ${colors.primary.purple};
`;


const CuisineType = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  background-color: ${colors.background.tertiary};
  padding: ${spacing.xs} ${spacing.sm};
  border-radius: ${borderRadius.sm};
  display: inline-block;
`;

const FoodType = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.isVeg ? '#60B060' : '#E55B4A'};
  border-radius: 6px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::after {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.isVeg ? '#60B060' : '#E55B4A'};
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
  font-size: ${fontSize.md};
  cursor: pointer;
  padding: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: ${colors.background.tertiary};
    transform: scale(1.1);
  }
`;

const ToggleSwitch = styled.div`
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background-color: ${props => props.active ? colors.status.success : colors.border.light};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: none;

  &:hover {
    opacity: 0.8;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '22px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: ${borderRadius.full};
    background-color: ${colors.text.white};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: left 0.3s ease;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${colors.text.secondary};
  font-size: ${fontSize.md};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${colors.status.error};
  font-size: ${fontSize.md};
`;

// Main Component
const MenuItemsListing = ({ showToast }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      fetchItems();
    } else {
      fetchItemsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getActive();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await itemAPI.getAll();
      if (response.data.success) {
        console.log('Items data:', response.data.data);
        console.log('First item modifiers:', response.data.data[0]?.modifiers);
        
        // Sort items by creation date (newest first)
        const sortedItems = response.data.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.createdAt || b.updatedAt || 0);
          return dateB - dateA; // Descending order (newest first)
        });
        
        setItems(sortedItems);
      } else {
        setError(response.data.message || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByCategory = async (categoryId) => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      const response = await itemAPI.getByCategory(categoryId);
      if (response.data.success) {
        // Sort items by creation date (newest first)
        const sortedItems = response.data.data.sort((a, b) => {
          const dateA = new Date(a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.createdAt || b.updatedAt || 0);
          return dateB - dateA; // Descending order (newest first)
        });
        
        setItems(sortedItems);
      } else {
        setError(response.data.message || 'Failed to fetch items');
      }
    } catch (err) {
      console.error('Error fetching items by category:', err);
      setError('Failed to load items. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = !item.isActive;
      console.log(`Toggling ${item.itemName}: ${item.isActive} → ${newStatus}`);
      
      const response = await itemAPI.updateStatus({
        itemId: item._id || item.itemId,
        isActive: newStatus
      });

      if (response.data.success) {
        // Update the specific item's isActive status
        setItems(prev => 
          prev.map(it => {
            if ((it._id && it._id === item._id) || (it.itemId && it.itemId === item.itemId)) {
              return { ...it, isActive: newStatus };
            }
            return it;
          })
        );

        // Show success message
        const statusText = newStatus ? 'activated' : 'deactivated';
        showToast(
          `Item "${response.data.data.itemName}" ${statusText} successfully!`,
          'success',
          'Status Updated!',
          3000
        );
      }
    } catch (err) {
      console.error('Error updating item status:', err);
      showToast(
        'Failed to update item status',
        'error',
        'Update Failed!',
        3000
      );
    }
  };

  const handleEdit = (itemId) => {
    console.log('Edit item:', itemId);
    // TODO: Implement edit functionality
  };

  const handleDelete = (itemId) => {
    console.log('Delete item:', itemId);
    // TODO: Implement delete functionality
  };


  return (
    <Layout currentPage="items-listing">
      <Container>
        <Header>
          <Title>Menu Items</Title>
          
          <CategoryFilter>
            <CategoryChip 
              active={selectedCategory === 'all'} 
              onClick={() => handleCategoryFilter('all')}
            >
              All
            </CategoryChip>
            {categories.map((category) => (
              <CategoryChip 
                key={category.categoryId}
                active={selectedCategory === category.categoryId} 
                onClick={() => handleCategoryFilter(category.categoryId)}
              >
                {category.categoryName}
              </CategoryChip>
            ))}
          </CategoryFilter>
        </Header>

        {loading ? (
          <LoadingMessage>Loading menu items...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : (
        <TableContainer>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Photo</TableHeaderCell>
                <TableHeaderCell>Product Name</TableHeaderCell>
                <TableHeaderCell>Description</TableHeaderCell>
                <TableHeaderCell>Modifiers</TableHeaderCell>
                <TableHeaderCell>Price</TableHeaderCell>
                <TableHeaderCell>Cuisine Type</TableHeaderCell>
                <TableHeaderCell>Food Type</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <tbody>
              {items.map((item, index) => {
                console.log(`Item ${index}:`, item.itemName, 'isActive:', item.isActive, 'ID:', item._id || item.itemId);
                return (
                <TableRow key={item._id || item.itemId}>
                  <TableCell>
                    <ItemImage>
                      {item.itemImage ? (
                        <img src={item.itemImage} alt={item.itemName} />
                      ) : (
                        '🍕'
                      )}
                    </ItemImage>
                  </TableCell>
                  <TableCell>
                    <ItemName>{item.itemName}</ItemName>
                  </TableCell>
                  <TableCell>
                    <ItemDescription>
                      {item.itemDescription || 'No description available'}
                    </ItemDescription>
                  </TableCell>
                  <TableCell>
                    <Modifiers>
                      {(() => {
                        console.log('Item modifiers:', item.modifiers);
                        if (!item.modifiers || item.modifiers.length === 0) {
                          return 'No modifiers';
                        }
                        
                        return item.modifiers.map((mod, index) => {
                          if (typeof mod === 'string') {
                            return mod;
                          } else if (mod && mod.name) {
                            return mod.name;
                          } else if (mod && mod.modifierName) {
                            return mod.modifierName;
                          }
                          return `Modifier ${index + 1}`;
                        }).join(', ');
                      })()}
                    </Modifiers>
                  </TableCell>
                  <TableCell>
                    <Price>${item.price || '0.00'}</Price>
                  </TableCell>
                  <TableCell>
                    <CuisineType>
                      {item.cuisine || item.categoryName || 'N/A'}
                    </CuisineType>
                  </TableCell>
                  <TableCell>
                    <FoodType isVeg={item.isVeg} />
                  </TableCell>
                  <TableCell>
                    <ActionButtons>
                      <ToggleSwitch 
                        active={item.isActive}
                        onClick={() => handleToggleStatus(item)}
                        title={item.isActive ? 'Deactivate Item' : 'Activate Item'}
                      />
                      <ActionButton 
                        onClick={() => handleEdit(item._id || item.itemId)}
                        title="Edit Item"
                      >
                        ✏️
                      </ActionButton>
                      <ActionButton 
                        onClick={() => handleDelete(item._id || item.itemId)}
                        title="Delete Item"
                      >
                        🗑️
                      </ActionButton>
                    </ActionButtons>
                  </TableCell>
                </TableRow>
                );
              })}
            </tbody>
          </Table>
        </TableContainer>
        )}
      </Container>
    </Layout>
  );
};

export default MenuItemsListing;
