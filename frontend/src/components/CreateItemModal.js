import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { uploadAPI, itemAPI, categoryAPI } from '../services/api';
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
  max-width: 1200px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
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
  display: flex;
  flex-direction: row;
  gap: ${spacing.xl};
`;

const ImageSection = styled.div`
  flex: 0 0 300px;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const SectionTitle = styled.h3`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ImageUploadArea = styled.div`
  border: 2px dashed ${props => props.isDragOver ? colors.primary.purple : colors.border.light};
  border-radius: ${borderRadius.md};
  padding: ${spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => props.isDragOver ? 'rgba(124, 58, 237, 0.1)' : colors.background.tertiary};
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.md};

  &:hover {
    border-color: ${colors.primary.purple};
    background-color: rgba(124, 58, 237, 0.05);
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: ${colors.primary.purple};
`;

const UploadText = styled.div`
  color: ${colors.text.secondary};
  font-size: ${fontSize.sm};
  line-height: 1.5;
`;

const UploadLink = styled.span`
  color: ${colors.primary.purple};
  text-decoration: underline;
  cursor: pointer;
`;

const UploadGuidelines = styled.div`
  color: ${colors.text.tertiary};
  font-size: ${fontSize.xs};
  line-height: 1.4;
`;

const ImagePreview = styled.div`
  border-radius: ${borderRadius.md};
  overflow: hidden;
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.background.tertiary};
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: ${spacing.sm};
  right: ${spacing.sm};
  background-color: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: ${fontSize.lg};
  color: ${colors.status.error};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  z-index: 5;

  &:hover {
    background-color: ${colors.status.error};
    color: white;
    transform: scale(1.1);
  }
`;

const UploadButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, ${colors.primary.purple} 0%, ${colors.primary.purpleHover} 100%);
  color: ${colors.text.white};
  border: none;
  padding: ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  margin-top: ${spacing.md};

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

const ImageUrlSection = styled.div`
  margin-top: ${spacing.md};
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const HiddenFileInput = styled.input`
  display: none;
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

const ImageUrlInput = styled(Input)`
  font-size: ${fontSize.sm};
  padding: ${spacing.sm};
  width: 100%;
`;

const TextArea = styled.textarea`
  padding: ${spacing.md};
  font-size: ${fontSize.md};
  border: 2px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;

  &:focus {
    border-color: ${colors.primary.purple};
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }

  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  font-size: ${fontSize.sm};
  color: ${colors.text.primary};
  cursor: pointer;
  margin: 0;
`;

// Category Selection Styles
const CategorySection = styled.div`
  margin-bottom: ${spacing.lg};
`;

const CategoryFilter = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex-wrap: wrap;
  padding: ${spacing.sm} 0;
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

const ModifierSection = styled.div`
  margin-top: ${spacing.lg};
`;

const ModifierList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  margin-top: ${spacing.sm};
`;

const ModifierItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  padding: ${spacing.sm};
  background-color: ${colors.background.tertiary};
  border-radius: ${borderRadius.md};
`;

const ModifierInput = styled(Input)`
  flex: 1;
  margin: 0;
`;

const RemoveModifierButton = styled.button`
  background-color: ${colors.status.error};
  color: white;
  border: none;
  border-radius: ${borderRadius.sm};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: ${fontSize.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: #dc2626;
    transform: scale(1.05);
  }
`;

const AddModifierButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary.purple} 0%, ${colors.primary.purpleHover} 100%);
  color: ${colors.text.white};
  border: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
  margin-top: ${spacing.sm};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
  padding: ${spacing.lg} 0 ${spacing.xl} 0;
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

const SaveButton = styled.button`
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
const CreateItemModal = ({ isOpen, onClose, showToast }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    itemPrice: '',
    itemDiscount: '',
    itemImage: '',
    isVegetarian: false,
    categoryId: '',
    cuisine: ''
  });
  
  const [categories, setCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [modifiers, setModifiers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cuisine options
  const cuisineOptions = [
    'Indian', 'Chinese', 'Italian', 'Mexican', 'Thai', 'Japanese', 
    'American', 'Mediterranean', 'Korean', 'French', 'Other'
  ];

  // Check if selected category is a beverage/drink category
  const isBeverageCategory = () => {
    if (!formData.categoryId) return false;
    const selectedCategory = categories.find(cat => cat.categoryId === formData.categoryId);
    if (!selectedCategory) return false;
    
    const categoryName = selectedCategory.categoryName.toLowerCase();
    return categoryName.includes('beverage') || categoryName.includes('drink') || categoryName.includes('beverages');
  };

  // Fetch categories on component mount
  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);




  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      showToast('Failed to fetch categories', 'error', 'Error', 3000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCategorySelect = (categoryId) => {
    const selectedCategory = categories.find(cat => cat.categoryId === categoryId);
    const isBeverage = selectedCategory && (
      selectedCategory.categoryName.toLowerCase().includes('beverage') ||
      selectedCategory.categoryName.toLowerCase().includes('drink') ||
      selectedCategory.categoryName.toLowerCase().includes('beverages')
    );
    
    setFormData(prevData => ({
      ...prevData,
      categoryId: categoryId,
      cuisine: isBeverage ? '' : prevData.cuisine // Clear cuisine if beverage category
    }));
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      showToast('Please select an image first', 'error', 'No Image Selected', 3000);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await uploadAPI.uploadImage(formData);
      
      if (response.data.success) {
        const newImageUrl = response.data.data.imageUrl;
        setFormData(prevData => ({
          ...prevData,
          itemImage: newImageUrl
        }));
        showToast('Image uploaded successfully!', 'success', 'Upload Success', 3000);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload image', 'error', 'Upload Failed', 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setFormData(prevData => ({
      ...prevData,
      itemImage: ''
    }));
  };

  const handleAddModifier = () => {
    setModifiers(prev => [...prev, { name: '', price: '' }]);
  };

  const handleModifierChange = (index, field, value) => {
    setModifiers(prev => prev.map((modifier, i) => 
      i === index ? { ...modifier, [field]: value } : modifier
    ));
  };

  const handleRemoveModifier = (index) => {
    setModifiers(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.itemName.trim()) {
      showToast('Item name is required', 'error', 'Validation Error', 3000);
      return;
    }

    if (!formData.categoryId) {
      showToast('Please select a category', 'error', 'Validation Error', 3000);
      return;
    }

    if (!isBeverageCategory() && !formData.cuisine) {
      showToast('Please select a cuisine', 'error', 'Validation Error', 3000);
      return;
    }

    setLoading(true);
    try {
      // Find the selected category to get categoryName
      const selectedCategory = categories.find(cat => cat.categoryId === formData.categoryId);
      
      const itemData = {
        categoryId: formData.categoryId,
        categoryName: selectedCategory?.categoryName || '',
        itemName: formData.itemName,
        itemDescription: formData.itemDescription,
        itemImage: formData.itemImage,
        isVeg: formData.isVegetarian,
        cuisine: formData.cuisine || 'Indian', // Use selected cuisine or default
        price: parseFloat(formData.itemPrice) || 0,
        discount: parseFloat(formData.itemDiscount) || 0,
        modifiers: modifiers
          .filter(mod => mod.name.trim() && mod.price.trim())
          .map(mod => ({
            modifierName: mod.name,
            modifierPrice: parseFloat(mod.price) || 0
          }))
      };


      const response = await itemAPI.add(itemData);
      
      if (response.data.success) {
        showToast('Item created successfully!', 'success', 'Success', 3000);
        
        // Clear form but don't close modal
        setFormData({
          itemName: '',
          itemDescription: '',
          itemPrice: '',
          itemDiscount: '',
          itemImage: '',
          isVegetarian: false,
          categoryId: '',
          cuisine: ''
        });
        setModifiers([]);
        setSelectedFile(null);
        setImagePreview(null);
      }
    } catch (error) {
      console.error('Create item error:', error);
      showToast('Failed to create item', 'error', 'Error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      itemName: '',
      itemDescription: '',
      itemPrice: '',
      itemDiscount: '',
      itemImage: '',
      isVegetarian: false,
      categoryId: '',
      cuisine: ''
    });
    setModifiers([]);
    setSelectedFile(null);
    setImagePreview(null);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitleDiv>
          <ModalTitle>Create Item</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalTitleDiv>

        <ModalContentDiv>
          <ImageSection>
            <SectionTitle>Add Product Photo</SectionTitle>
            
            {imagePreview ? (
              <ImagePreview>
                <img src={imagePreview} alt="Preview" />
                <RemoveImageButton onClick={handleRemoveImage}>×</RemoveImageButton>
              </ImagePreview>
            ) : (
              <ImageUploadArea
                isDragOver={isDragOver}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
              >
                <UploadIcon>📷</UploadIcon>
                <UploadText>
                  Drag & drop an image here, or <UploadLink>click to browse</UploadLink>
                </UploadText>
                <UploadGuidelines>
                  Supports: JPG, PNG, GIF up to 10MB
                </UploadGuidelines>
              </ImageUploadArea>
            )}

            <HiddenFileInput
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
            />

            {selectedFile && (
              <UploadButton onClick={handleUploadImage} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </UploadButton>
            )}

            <ImageUrlSection>
              <Label>Or enter image URL</Label>
              <ImageUrlInput
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.itemImage}
                onChange={handleInputChange}
                name="itemImage"
              />
            </ImageUrlSection>
          </ImageSection>

          <FormSection>
            <SectionTitle>General Information</SectionTitle>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  Product Name <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Input
                  type="text"
                  name="itemName"
                  value={formData.itemName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  name="itemDescription"
                  value={formData.itemDescription}
                  onChange={handleInputChange}
                  placeholder="Enter product description"
                />
              </FormGroup>

              <CategorySection>
                <Label>Category <RequiredIndicator>*</RequiredIndicator></Label>
                <CategoryFilter>
                  {categories.map((category) => (
                    <CategoryChip
                      key={category.categoryId}
                      active={formData.categoryId === category.categoryId}
                      onClick={() => handleCategorySelect(category.categoryId)}
                    >
                      {category.categoryName}
                    </CategoryChip>
                  ))}
                </CategoryFilter>
              </CategorySection>

              {!isBeverageCategory() && (
                <CategorySection>
                  <Label>
                    Cuisine <RequiredIndicator>*</RequiredIndicator>
                  </Label>
                  <CategoryFilter>
                    {cuisineOptions.map((cuisine) => (
                      <CategoryChip
                        key={cuisine}
                        active={formData.cuisine === cuisine}
                        onClick={() => setFormData(prevData => ({
                          ...prevData,
                          cuisine: cuisine
                        }))}
                      >
                        {cuisine}
                      </CategoryChip>
                    ))}
                  </CategoryFilter>
                </CategorySection>
              )}

              <FormGroup>
                <Label>
                  Price <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Input
                  type="number"
                  name="itemPrice"
                  value={formData.itemPrice}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  name="itemDiscount"
                  value={formData.itemDiscount}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </FormGroup>

              <FormGroup>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    name="isVegetarian"
                    checked={formData.isVegetarian}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel>Vegetarian Item</CheckboxLabel>
                </CheckboxContainer>
              </FormGroup>

              <ModifierSection>
                <Label>Modifiers</Label>
                <ModifierList>
                  {modifiers.map((modifier, index) => (
                    <ModifierItem key={index}>
                      <ModifierInput
                        type="text"
                        placeholder="Modifier name"
                        value={modifier.name}
                        onChange={(e) => handleModifierChange(index, 'name', e.target.value)}
                      />
                      <ModifierInput
                        type="number"
                        placeholder="Price"
                        value={modifier.price}
                        onChange={(e) => handleModifierChange(index, 'price', e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      <RemoveModifierButton
                        type="button"
                        onClick={() => handleRemoveModifier(index)}
                      >
                        ×
                      </RemoveModifierButton>
                    </ModifierItem>
                  ))}
                </ModifierList>
                <AddModifierButton type="button" onClick={handleAddModifier}>
                  ➕ Add Modifier
                </AddModifierButton>
              </ModifierSection>
            </Form>
          </FormSection>
        </ModalContentDiv>

        <ButtonContainer>
          <CancelButton type="button" onClick={handleClose}>
            Cancel
          </CancelButton>
          <SaveButton type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Item'}
          </SaveButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default CreateItemModal;
