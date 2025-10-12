import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { uploadAPI } from '../services/api';
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

const CuisineDropdown = styled.div`
  position: relative;
`;

const CuisineSearchInput = styled(Input)`
  cursor: pointer;
`;

const CuisineDropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${colors.background.primary};
  border: 2px solid ${colors.border.light};
  border-top: none;
  border-radius: 0 0 ${borderRadius.md} ${borderRadius.md};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const CuisineOption = styled.div`
  padding: ${spacing.sm} ${spacing.md};
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: ${fontSize.sm};
  color: ${colors.text.primary};

  &:hover {
    background-color: ${colors.background.tertiary};
  }

  &:last-child {
    border-radius: 0 0 ${borderRadius.md} ${borderRadius.md};
  }
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
  accent-color: ${colors.primary.purple};
`;

const CheckboxLabel = styled.label`
  font-size: ${fontSize.sm};
  color: ${colors.text.primary};
  cursor: pointer;
`;

const ModifiersContainer = styled.div`
  border: 2px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  padding: ${spacing.md};
  background-color: ${colors.background.tertiary};
`;

const ModifierRow = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: center;
  margin-bottom: ${spacing.sm};

  &:last-child {
    margin-bottom: 0;
  }
`;

const ModifierInput = styled(Input)`
  flex: 1;
`;

const ModifierPriceInput = styled(Input)`
  width: 100px;
`;

const AddModifierButton = styled.button`
  background-color: ${colors.primary.purple};
  color: ${colors.text.white};
  border: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.sm};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primary.purpleHover};
  }
`;

const RemoveModifierButton = styled.button`
  background-color: ${colors.status.error};
  color: ${colors.text.white};
  border: none;
  padding: ${spacing.xs};
  border-radius: ${borderRadius.sm};
  font-size: ${fontSize.sm};
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #d32f2f;
  }
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

const SaveButton = styled(Button)`
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

const EditItemModal = ({ isOpen, item, onClose, onUpdate, showToast }) => {
  const [formData, setFormData] = useState({
    itemName: '',
    itemDescription: '',
    itemImage: '',
    isVeg: false,
    cuisine: '',
    price: 0,
    discount: 0,
    modifiers: []
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSource, setImageSource] = useState('url');
  const [isDragOver, setIsDragOver] = useState(false);
  const [cuisineSearch, setCuisineSearch] = useState('');
  const [showCuisineDropdown, setShowCuisineDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const cuisineList = [
    'Italian', 'Japanese', 'Greek', 'Spanish', 'Indian', 'Mexican', 
    'Turkish', 'Chinese', 'French', 'Thai', 'South Indian', 'Sri Lankan',
    'Lebanese', 'Korean', 'Vietnamese', 'Moroccan', 'Brazilian', 
    'Ethiopian', 'Peruvian', 'Russian'
  ];

  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  
  // Update form data when modal opens (only on initial load)
  useEffect(() => {
    if (item && isOpen && isInitialLoad) {
      setFormData({
        itemName: item.itemName || '',
        itemDescription: item.itemDescription || '',
        itemImage: item.itemImage || '',
        isVeg: item.isVeg || false,
        cuisine: item.cuisine || '',
        price: item.price || 0,
        discount: item.discount || 0,
        modifiers: item.modifiers || []
      });
      
      setCuisineSearch(item.cuisine || '');
      
      if (item.itemImage) {
        setImagePreview(item.itemImage);
        setImageSource('url');
      }
      
      setIsInitialLoad(false);
    }
    
    // Reset on modal close
    if (!isOpen) {
      setIsInitialLoad(true);
      setSelectedFile(null);
      setImagePreview(null);
      setImageSource('url');
    }
  }, [item, isOpen, isInitialLoad]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onUpdate(formData);
    } catch (error) {
      console.error('Error updating item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleModifierChange = (index, field, value) => {
    setFormData(prevData => {
      const updatedModifiers = [...prevData.modifiers];
      if (!updatedModifiers[index]) {
        updatedModifiers[index] = { modifierName: '', modifierPrice: 0 };
      }
      updatedModifiers[index][field] = value;
      return { ...prevData, modifiers: updatedModifiers };
    });
  };

  const addModifier = () => {
    setFormData(prevData => ({
      ...prevData,
      modifiers: [...prevData.modifiers, { modifierName: '', modifierPrice: 0 }]
    }));
  };

  const removeModifier = (index) => {
    setFormData(prevData => {
      const updatedModifiers = prevData.modifiers.filter((_, i) => i !== index);
      return { ...prevData, modifiers: updatedModifiers };
    });
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file only.', 'error', 'Invalid File!', 3000);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size must be less than 5MB.', 'error', 'File Too Large!', 3000);
        return;
      }
      
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageSource('file');
    }
  };
  
  const handleUploadImage = async () => {
    if (!selectedFile) {
      showToast('No image selected to upload.', 'error', 'No File!', 3000);
      return;
    }
    
    try {
      setIsUploading(true);
      
      const uploadFormData = new FormData();
      uploadFormData.append('image', selectedFile);
      
      const response = await uploadAPI.uploadImage(uploadFormData);
      
      if (response.data.success) {
        const newImageUrl = response.data.data.imageUrl;
        
        setFormData(prevData => ({ ...prevData, itemImage: newImageUrl }));
        setImagePreview(newImageUrl);
        setSelectedFile(null);
        setImageSource('url');
        
        showToast('Image uploaded successfully!', 'success', 'Upload Success!', 3000);
      }
    } catch (error) {
      console.error('Upload error:', error.message);
      showToast('Failed to upload image. Please try again.', 'error', 'Upload Failed!', 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUrlChange = (url) => {
    setFormData(prevData => ({ ...prevData, itemImage: url }));
    if (url) {
      setImagePreview(url);
      setImageSource('url');
    }
  };

  const handleUploadAreaClick = () => {
    document.getElementById('file-upload').click();
  };

  const handleCuisineSearch = (value) => {
    setCuisineSearch(value);
    setShowCuisineDropdown(true);
    setFormData(prevData => ({ ...prevData, cuisine: value }));
  };

  const handleCuisineSelect = (cuisine) => {
    setCuisineSearch(cuisine);
    setFormData(prevData => ({ ...prevData, cuisine: cuisine }));
    setShowCuisineDropdown(false);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prevData => ({ ...prevData, itemImage: '' }));
    setImageSource('url');
    setSelectedFile(null);
  };

  const filteredCuisines = cuisineList.filter(cuisine =>
    cuisine.toLowerCase().includes(cuisineSearch.toLowerCase())
  );

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
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        handleFileSelect({ target: { files: [file] } });
      } else {
        showToast('Please drop an image file only.', 'error', 'Invalid File!', 3000);
      }
    }
  };

  if (!isOpen || !item) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitleDiv>
          <ModalTitle>Edit Item</ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalTitleDiv>
        
        <ModalContentDiv>
          <ImageSection>
            <SectionTitle>ADD PRODUCT PHOTO</SectionTitle>
            
            {imagePreview ? (
              <>
                <ImagePreview>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    key={imagePreview}
                  />
                  <RemoveImageButton onClick={handleRemoveImage} title="Remove Image">
                    ×
                  </RemoveImageButton>
                </ImagePreview>
                {selectedFile && imageSource === 'file' && (
                  <UploadButton 
                    onClick={handleUploadImage} 
                    disabled={isUploading}
                  >
                    {isUploading ? '⏳ Uploading...' : '⬆️ Upload Image'}
                  </UploadButton>
                )}
              </>
            ) : (
              <ImageUploadArea 
                onClick={handleUploadAreaClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                isDragOver={isDragOver}
              >
                <UploadIcon>☁️</UploadIcon>
                <UploadText>
                  Drop your images here, or <UploadLink>click to browse</UploadLink>
                </UploadText>
                <UploadGuidelines>
                  1600 x 1200 (4:3) recommended. PNG, JPG and GIF files are allowed.
                </UploadGuidelines>
              </ImageUploadArea>
            )}
            
            <HiddenFileInput
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
            
            <ImageUrlSection>
              <Label>Or enter image URL</Label>
              <ImageUrlInput
                type="url"
                value={formData.itemImage}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                placeholder="Enter image URL"
              />
            </ImageUrlSection>
          </ImageSection>

          <FormSection>
            <SectionTitle>GENERAL INFORMATION</SectionTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  Product Name <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData(prevData => ({ ...prevData, itemName: e.target.value }))}
                  placeholder="Enter Name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Description</Label>
                <TextArea
                  value={formData.itemDescription}
                  onChange={(e) => setFormData(prevData => ({ ...prevData, itemDescription: e.target.value }))}
                  placeholder="Type description"
                />
              </FormGroup>

              <FormGroup>
                <Label>Food Type</Label>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isVeg}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, isVeg: e.target.checked }))}
                  />
                  <CheckboxLabel>Vegetarian Item</CheckboxLabel>
                </CheckboxContainer>
              </FormGroup>

              {item.categoryName && 
               item.categoryName.toLowerCase() !== 'drinks' && 
               item.categoryName.toLowerCase() !== 'beverages' && (
                <FormGroup>
                  <Label>Cuisine Type</Label>
                  <CuisineDropdown>
                    <CuisineSearchInput
                      type="text"
                      value={cuisineSearch}
                      onChange={(e) => handleCuisineSearch(e.target.value)}
                      onFocus={() => setShowCuisineDropdown(true)}
                      onBlur={() => setTimeout(() => setShowCuisineDropdown(false), 200)}
                      placeholder="Search cuisine type..."
                      autoComplete="off"
                    />
                    {showCuisineDropdown && filteredCuisines.length > 0 && (
                      <CuisineDropdownList>
                        {filteredCuisines.map((cuisine, index) => (
                          <CuisineOption
                            key={index}
                            onClick={() => handleCuisineSelect(cuisine)}
                          >
                            {cuisine}
                          </CuisineOption>
                        ))}
                      </CuisineDropdownList>
                    )}
                  </CuisineDropdown>
                </FormGroup>
              )}

              <FormGroup>
                <Label>
                  Price <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prevData => ({ ...prevData, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData(prevData => ({ ...prevData, discount: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter discount percentage"
                  min="0"
                  max="100"
                  step="0.01"
                />
              </FormGroup>

              <FormGroup>
                <Label>Modifiers</Label>
                <ModifiersContainer>
                  {formData.modifiers.map((modifier, index) => (
                    <ModifierRow key={index}>
                      <ModifierInput
                        type="text"
                        value={modifier.modifierName || ''}
                        onChange={(e) => handleModifierChange(index, 'modifierName', e.target.value)}
                        placeholder="Modifier name"
                      />
                      <ModifierPriceInput
                        type="number"
                        value={modifier.modifierPrice || 0}
                        onChange={(e) => handleModifierChange(index, 'modifierPrice', parseFloat(e.target.value) || 0)}
                        placeholder="Price"
                        min="0"
                        step="0.01"
                      />
                      <RemoveModifierButton
                        type="button"
                        onClick={() => removeModifier(index)}
                      >
                        ×
                      </RemoveModifierButton>
                    </ModifierRow>
                  ))}
                  <AddModifierButton
                    type="button"
                    onClick={addModifier}
                  >
                    + Add Modifier
                  </AddModifierButton>
                </ModifiersContainer>
              </FormGroup>

              <ButtonGroup>
                <CancelButton type="button" onClick={onClose}>
                  Cancel
                </CancelButton>
                <SaveButton type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Save Changes'}
                </SaveButton>
              </ButtonGroup>
            </Form>
          </FormSection>
        </ModalContentDiv>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditItemModal;

