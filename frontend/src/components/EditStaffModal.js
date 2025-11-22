import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { uploadAPI, staffAPI } from '../services/api';
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
  max-width: 800px;
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
const EditStaffModal = ({ isOpen, staff, onClose, onUpdate, showToast }) => {
  const [formData, setFormData] = useState({
    staffName: '',
    mobileNumber: '',
    email: '',
    address: '',
    profileImageUrl: ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize form data when staff prop changes
  useEffect(() => {
    if (staff) {
      setFormData({
        staffName: staff.staffName || '',
        mobileNumber: staff.mobileNumber || '',
        email: staff.email || '',
        address: staff.address || '',
        profileImageUrl: staff.profileImageUrl || ''
      });
      setImagePreview(staff.profileImageUrl || null);
    }
  }, [staff]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
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
          profileImageUrl: newImageUrl
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
      profileImageUrl: ''
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.staffName.trim()) {
      showToast('Staff name is required', 'error', 'Validation Error', 3000);
      return;
    }

    if (!formData.mobileNumber.trim()) {
      showToast('Mobile number is required', 'error', 'Validation Error', 3000);
      return;
    }

    if (!formData.email.trim()) {
      showToast('Email address is required', 'error', 'Validation Error', 3000);
      return;
    }

    // Basic email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(formData.email.trim())) {
      showToast('Please provide a valid email address', 'error', 'Validation Error', 3000);
      return;
    }

    setLoading(true);
    try {
      const staffData = {
        staffId: staff.staffId,
        staffName: formData.staffName,
        mobileNumber: formData.mobileNumber,
        email: formData.email,
        address: formData.address,
        profileImageUrl: formData.profileImageUrl
      };

      const response = await staffAPI.update(staffData);
      
      if (response.data.success) {
        showToast(response.data.message || 'Staff updated successfully!', 'success', 'Success', 3000);
        onUpdate(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Update staff error:', error);
      showToast('Failed to update staff', 'error', 'Error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    setFormData({
      staffName: '',
      mobileNumber: '',
      email: '',
      address: '',
      profileImageUrl: ''
    });
    setSelectedFile(null);
    setImagePreview(null);
  };

  if (!isOpen || !staff) return null;

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalTitleDiv>
          <ModalTitle>Edit Staff</ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalTitleDiv>

        <ModalContentDiv>
          <ImageSection>
            <SectionTitle>Profile Photo</SectionTitle>
            
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
                value={formData.profileImageUrl}
                onChange={handleInputChange}
                name="profileImageUrl"
              />
            </ImageUrlSection>
          </ImageSection>

          <FormSection>
            <SectionTitle>Staff Information</SectionTitle>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>
                  Staff Name <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Input
                  type="text"
                  name="staffName"
                  value={formData.staffName}
                  onChange={handleInputChange}
                  placeholder="Enter staff name"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Mobile Number <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>
                  Email Address <RequiredIndicator>*</RequiredIndicator>
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </FormGroup>
            </Form>
          </FormSection>
        </ModalContentDiv>

        <ButtonContainer>
          <CancelButton type="button" onClick={handleClose}>
            Cancel
          </CancelButton>
          <SaveButton type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Updating...' : 'Update Staff'}
          </SaveButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditStaffModal;
