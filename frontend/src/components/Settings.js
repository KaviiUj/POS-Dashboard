import React, { useState } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import { uploadAPI, settingsAPI } from '../services/api';

// Styled Components
const Container = styled.div`
  padding: ${spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing.xl};
`;

const HeaderLeft = styled.div`
  text-align: left;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
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

const HeaderSaveButton = styled.button`
  background-color: ${colors.primary.purple};
  color: white;
  border: none;
  width: 110px;
  height: 48px;
  border-radius: 20px;
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};

  &:hover {
    background-color: ${colors.primary.purpleHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${colors.shadow.purple};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${colors.border.light};
    color: ${colors.text.tertiary};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ContentContainer = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px ${colors.shadow.light};
  padding: ${spacing.xl};
`;

const Section = styled.div`
  margin-bottom: ${spacing.xl};
  padding-bottom: ${spacing.xl};
  border-bottom: 1px solid ${colors.border.light};

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: ${fontWeight.normal};
  color: ${colors.text.primary};
  margin: 0 0 -10px 0;
`;

const SectionDescription = styled.p`
  font-size: ${fontSize.md};
  color: ${colors.text.secondary};
  margin: 0 0 ${spacing.lg} 0;
  line-height: 1.6;
`;

// Logo Upload Styles
const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.xxl};
  align-items: start;
`;

const ToggleSettingsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin-top: ${spacing.xxl};
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const LogoPreviewUploadArea = styled.div`
  width: 100%;
  height: 200px;
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${colors.background.primary};
  overflow: visible;
  position: relative;
  cursor: ${props => props.hasImage ? 'default' : 'pointer'};
  transition: all 0.2s ease;

  ${props => !props.hasImage && `
    &:hover {
      border-color: ${colors.primary.purple};
    }
  `}

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: ${spacing.md};
  }
`;

const RemoveLogoButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: ${colors.overlay.white};
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
  box-shadow: 0 2px 8px ${colors.shadow.dark};
  transition: all 0.2s ease;
  z-index: 10;

  &:hover {
    background-color: ${colors.status.error};
    color: white;
    transform: scale(1.1);
  }
`;

const UploadPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  padding: ${spacing.lg};
`;

const UploadIcon = styled.div`
  font-size: 32px;
  color: ${colors.text.tertiary};
`;

const UploadText = styled.div`
  color: ${colors.text.secondary};
  font-size: ${fontSize.sm};
  line-height: 1.5;
  text-align: center;
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
  text-align: center;
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const UploadButton = styled.button`
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
  justify-content: center;
  gap: ${spacing.sm};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${colors.shadow.purple};
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Outlet Name Styles
const OutletSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const ToggleSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const OutletNameRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`;

const OutletNameDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  flex: 1;
`;

const OutletNameText = styled.div`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  flex: 1;
`;

const OutletNameInput = styled.input`
  width: 100%;
  padding: ${spacing.md};
  font-size: ${fontSize.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  background-color: ${colors.background.primary};

  &:focus {
    border-color: ${colors.primary.purple};
    box-shadow: 0 0 0 3px ${colors.shadow.purpleLight};
  }

  &::placeholder {
    color: ${colors.text.tertiary};
  }
`;

const EditButton = styled.button`
  background-color: ${colors.background.tertiary};
  color: ${colors.primary.purple};
  border: 2px solid ${colors.primary.purple};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.primary.purple};
    color: ${colors.text.white};
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary.purple} 0%, ${colors.primary.purpleHover} 100%);
  color: ${colors.text.white};
  border: none;
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(124, 58, 237, 0.3);
  }
`;

const CancelButton = styled.button`
  background-color: ${colors.background.tertiary};
  color: ${colors.text.secondary};
  border: 2px solid ${colors.border.light};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.border.light};
    border-color: ${colors.text.secondary};
  }
`;

// Toggle Switch Styles
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${colors.status.success};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.border.light};
  transition: 0.2s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.2s;
    border-radius: 50%;
  }
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.s} 0;
`;

const SettingLabel = styled.div`
  flex: 1;
`;

const SettingTitle = styled.div`
  font-size: 14px;
  font-weight: ${fontWeight.normal};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const SettingDescription = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  line-height: 1.4;
`;

const CurrencyDropdown = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  font-size: ${fontSize.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
  background-color: ${colors.background.primary};
  cursor: pointer;

  &:focus {
    border-color: ${colors.primary.purple};
    box-shadow: 0 0 0 3px ${colors.shadow.purpleLight};
  }

  option {
    padding: ${spacing.sm};
  }
`;

// Main Settings Component
const Settings = ({ showToast }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [outletName, setOutletName] = useState('');
  const [showCuisineFilter, setShowCuisineFilter] = useState(false);
  const [showModifiers, setShowModifiers] = useState(false);
  const [showModifiersPrice, setShowModifiersPrice] = useState(false);
  const [outletCurrency, setOutletCurrency] = useState('USD');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    } else {
      showToast('Please select a valid image file', 'error', 'Invalid File', 3000);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
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
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!selectedFile) {
      showToast('Please select an image first', 'error', 'No Image Selected', 3000);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      // Rename the file to 'app-logo.png' when uploading
      const fileExtension = selectedFile.name.split('.').pop();
      const logoFileName = `app-logo.${fileExtension}`;
      formData.append('image', selectedFile, logoFileName);

      const response = await uploadAPI.uploadImage(formData);
      
      if (response.data.success) {
        const uploadedUrl = response.data.data.imageUrl;
        setLogoUrl(uploadedUrl);
        showToast('Logo uploaded successfully as "app-logo"!', 'success', 'Upload Success', 3000);
        
        // Clear the selected file but keep the preview
        setSelectedFile(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast('Failed to upload logo', 'error', 'Upload Failed', 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setSelectedFile(null);
    setLogoPreview(null);
    setLogoUrl('');
    showToast('Logo removed', 'info', 'Removed', 3000);
  };

  const handleSaveOutletName = () => {
    // Save to localStorage
    localStorage.setItem('outletName', outletName);
  };

  const handleCuisineFilterToggle = () => {
    const newValue = !showCuisineFilter;
    setShowCuisineFilter(newValue);
    localStorage.setItem('showCuisineFilter', newValue.toString());
  };

  const handleShowModifiersToggle = () => {
    const newValue = !showModifiers;
    setShowModifiers(newValue);
    localStorage.setItem('showModifiers', newValue.toString());
  };

  const handleShowModifiersPriceToggle = () => {
    const newValue = !showModifiersPrice;
    setShowModifiersPrice(newValue);
    localStorage.setItem('showModifiersPrice', newValue.toString());
  };

  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setOutletCurrency(newCurrency);
    localStorage.setItem('outletCurrency', newCurrency);
  };

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data.success && response.data.data) {
        const settings = response.data.data;
        
        // Update state with API data
        if (settings.outletName) setOutletName(settings.outletName);
        if (settings.logo) setLogoUrl(settings.logo);
        if (typeof settings.showCuisineFilter === 'boolean') setShowCuisineFilter(settings.showCuisineFilter);
        if (typeof settings.showModifiers === 'boolean') setShowModifiers(settings.showModifiers);
        if (typeof settings.showModifiersPrice === 'boolean') setShowModifiersPrice(settings.showModifiersPrice);
        if (settings.outletCurrency) setOutletCurrency(settings.outletCurrency);
        
        // Update localStorage with API data
        localStorage.setItem('outletName', settings.outletName || '');
        localStorage.setItem('restaurantLogo', settings.logo || '');
        localStorage.setItem('showCuisineFilter', settings.showCuisineFilter?.toString() || 'false');
        localStorage.setItem('showModifiers', settings.showModifiers?.toString() || 'false');
        localStorage.setItem('showModifiersPrice', settings.showModifiersPrice?.toString() || 'false');
        localStorage.setItem('outletCurrency', settings.outletCurrency || 'USD');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      // Fallback to localStorage if API fails
      const savedOutletName = localStorage.getItem('outletName') || '';
      const savedCuisineFilter = localStorage.getItem('showCuisineFilter') === 'true';
      const savedShowModifiers = localStorage.getItem('showModifiers') === 'true';
      const savedShowModifiersPrice = localStorage.getItem('showModifiersPrice') === 'true';
      const savedCurrency = localStorage.getItem('outletCurrency') || 'USD';
      setOutletName(savedOutletName);
      setShowCuisineFilter(savedCuisineFilter);
      setShowModifiers(savedShowModifiers);
      setShowModifiersPrice(savedShowModifiersPrice);
      setOutletCurrency(savedCurrency);
    }
  };


  // Save settings to API
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const settingsData = {
        outletName,
        showCuisineFilter,
        showModifiers,
        showModifiersPrice,
        outletCurrency,
        logo: logoUrl
      };

      const response = await settingsAPI.update(settingsData);
      if (response.data.success) {
        // Update localStorage with saved data
        localStorage.setItem('outletName', outletName);
        localStorage.setItem('restaurantLogo', logoUrl);
        localStorage.setItem('showCuisineFilter', showCuisineFilter.toString());
        localStorage.setItem('showModifiers', showModifiers.toString());
        localStorage.setItem('showModifiersPrice', showModifiersPrice.toString());
        localStorage.setItem('outletCurrency', outletCurrency);
        
        showToast('Settings saved successfully!', 'success', 'Success', 3000);
      } else {
        showToast('Failed to save settings', 'error', 'Error', 3000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('Failed to save settings', 'error', 'Error', 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Load settings from API on component mount
  React.useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <Layout currentPage="settings" showToast={showToast}>
      <Container>
        <Header>
          <HeaderLeft>
            <Title>Settings</Title>
            <Subtitle>Manage your application settings and preferences</Subtitle>
          </HeaderLeft>
          <HeaderRight>
            <HeaderSaveButton onClick={handleSaveSettings} disabled={isSaving}>
              {isSaving ? '⏳ Saving...' : '💾 Save'}
            </HeaderSaveButton>
          </HeaderRight>
        </Header>

        <ContentContainer>
          <SettingsGrid>
            {/* Logo Upload Section */}
            <LogoSection>
              <SectionTitle>Upload Restaurant Logo</SectionTitle>
              <LogoPreviewUploadArea
                isDragOver={isDragOver}
                hasImage={!!(logoPreview || logoUrl)}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => {
                  if (!logoPreview && !logoUrl) {
                    document.getElementById('logoFileInput').click();
                  }
                }}
              >
                {logoPreview || logoUrl ? (
                  <>
                    <img src={logoPreview || logoUrl} alt="App Logo" />
                    <RemoveLogoButton onClick={handleRemoveLogo} disabled={isUploading}>
                      ×
                    </RemoveLogoButton>
                  </>
                ) : (
                  <UploadPlaceholder>
                    <UploadIcon>📷</UploadIcon>
                    <UploadText>
                      Drag & drop your logo here, or <UploadLink>click to browse</UploadLink>
                    </UploadText>
                    <UploadGuidelines>
                      Supports: JPG, PNG, GIF, WebP up to 10MB
                    </UploadGuidelines>
                  </UploadPlaceholder>
                )}
              </LogoPreviewUploadArea>

              <HiddenFileInput
                id="logoFileInput"
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
              />

              {selectedFile && (
                <UploadButton onClick={handleUploadLogo} disabled={isUploading}>
                  {isUploading ? '⏳ Uploading...' : '📤 Upload Logo'}
                </UploadButton>
              )}
            </LogoSection>

            {/* Restaurant Name Section */}
            <OutletSection>
              <SectionTitle>Restaurant Name</SectionTitle>
              <OutletNameInput
                type="text"
                value={outletName}
                onChange={(e) => setOutletName(e.target.value)}
                placeholder="Admin"
                onBlur={handleSaveOutletName}
              />
            </OutletSection>
          </SettingsGrid>

          {/* Toggle Settings Row */}
          <ToggleSettingsGrid>
            {/* Show Cuisine Filter */}
            <ToggleSection>
              <SectionTitle>Show Cuisine Filter</SectionTitle>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={showCuisineFilter}
                  onChange={handleCuisineFilterToggle}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </ToggleSection>

            {/* Show Modifiers */}
            <ToggleSection>
              <SectionTitle>Show Modifiers</SectionTitle>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={showModifiers}
                  onChange={handleShowModifiersToggle}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </ToggleSection>

            {/* Show Modifiers Price */}
            <ToggleSection>
              <SectionTitle>Show Modifiers Price</SectionTitle>
              <ToggleSwitch>
                <ToggleInput
                  type="checkbox"
                  checked={showModifiersPrice}
                  onChange={handleShowModifiersPriceToggle}
                />
                <ToggleSlider />
              </ToggleSwitch>
            </ToggleSection>

            {/* Outlet Currency */}
            <ToggleSection>
              <SectionTitle>Outlet Currency</SectionTitle>
              <CurrencyDropdown
                value={outletCurrency}
                onChange={handleCurrencyChange}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CHF">CHF (CHF)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="INR">INR (₹)</option>
                <option value="BRL">BRL (R$)</option>
                <option value="MXN">MXN ($)</option>
                <option value="KRW">KRW (₩)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="HKD">HKD (HK$)</option>
                <option value="NOK">NOK (kr)</option>
                <option value="SEK">SEK (kr)</option>
                <option value="DKK">DKK (kr)</option>
                <option value="PLN">PLN (zł)</option>
                <option value="RUB">RUB (₽)</option>
                <option value="TRY">TRY (₺)</option>
                <option value="ZAR">ZAR (R)</option>
                <option value="LKR">LKR (₨)</option>
              </CurrencyDropdown>
            </ToggleSection>
          </ToggleSettingsGrid>
        </ContentContainer>
      </Container>
    </Layout>
  );
};

export default Settings;

