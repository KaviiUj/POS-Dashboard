import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import { authAPI } from '../services/api';
import AlertDialog from './AlertDialog';

// Styled Components
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${colors.background.tertiary};
`;

const Sidebar = styled.div`
  width: 280px;
  background-color: ${colors.background.primary};
  border-right: 1px solid ${colors.border.light};
  padding: ${spacing.lg} 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  padding: 0 ${spacing.lg} ${spacing.lg} ${spacing.lg};
  border-bottom: 1px solid ${colors.border.light};
  margin-bottom: ${spacing.lg};
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, ${colors.primary.orange} 0%, #FFB84D 100%);
  border-radius: ${borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize.lg};
  color: white;
  font-weight: ${fontWeight.bold};
`;

const LogoText = styled.h1`
  font-size: ${fontSize.xl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md} ${spacing.lg};
  color: ${props => props.active ? colors.text.white : colors.text.primary};
  background-color: ${props => props.active ? colors.primary.purple : colors.background.tertiary};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  font-weight: ${props => props.active ? fontWeight.bold : fontWeight.medium};

  &:hover {
    background-color: ${props => props.active ? colors.primary.purpleHover : colors.border.light};
  }
`;

const MenuDropdown = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  background-color: ${colors.background.primary};
  border-left: 3px solid ${colors.primary.purple};
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.sm} ${spacing.lg} ${spacing.sm} ${spacing.xxl};
  color: ${props => props.active ? colors.primary.purple : colors.text.primary};
  background-color: ${colors.background.tertiary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${fontSize.sm};
  font-weight: ${props => props.active ? fontWeight.bold : fontWeight.medium};

  &:hover {
    background-color: ${colors.border.light};
    color: ${colors.primary.purple};
  }
`;

const DropdownIcon = styled.span`
  font-size: ${fontSize.sm};
  transition: transform 0.2s ease;
  transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  background-color: ${props => props.active ? colors.text.white : 'transparent'};
  color: ${props => props.active ? colors.primary.purple : colors.text.primary};
  border-radius: ${borderRadius.sm};
  padding: 2px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
`;

const MenuIcon = styled.div`
  font-size: ${fontSize.md};
  width: 20px;
  text-align: center;
  background-color: ${props => props.active ? colors.text.white : colors.primary.purple};
  color: ${props => props.active ? colors.primary.purple : colors.text.white};
  border-radius: ${borderRadius.sm};
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
`;

const MenuText = styled.span`
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.medium};
  flex: 1;
`;

const Badge = styled.span`
  background-color: ${props => props.active ? colors.text.white : colors.status.success};
  color: ${props => props.active ? colors.primary.purple : colors.text.white};
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: ${fontWeight.bold};
  min-width: 20px;
  text-align: center;
`;

const MainContent = styled.div`
  flex: 1;
  margin-left: 280px;
`;

// Main Layout Component
const Layout = ({ children, currentPage = 'dashboard', showToast }) => {
  const navigate = useNavigate();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [itemsDropdownOpen, setItemsDropdownOpen] = useState(false);

  // Determine if category dropdown should stay open
  const isCategoryDropdownActive = currentPage === 'categories' || currentPage === 'categories-listing' || currentPage === 'categories-create';
  
  // Determine which dropdown item is active
  const isCategoryListingActive = currentPage === 'categories-listing';
  const isCategoryCreateActive = currentPage === 'categories-create';

  // Determine if items dropdown should stay open
  const isItemsDropdownActive = currentPage === 'items' || currentPage === 'items-listing' || currentPage === 'items-create';
  
  // Determine which items dropdown item is active
  const isItemsListingActive = currentPage === 'items-listing';
  const isItemsCreateActive = currentPage === 'items-create';

  // Handle logout confirmation
  const handleLogoutConfirm = async () => {
    setLogoutConfirm(false);
    
    try {
      await authAPI.logout();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Navigate to login
      navigate('/login');

    } catch (error) {
      console.error('Logout error:', error);
      
      // Even if logout API fails, clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  // Handle logout cancellation
  const handleLogoutCancel = () => {
    setLogoutConfirm(false);
  };

  // Handle category dropdown toggle
  const toggleCategoryDropdown = () => {
    setCategoryDropdownOpen(!categoryDropdownOpen);
  };

  // Handle items dropdown toggle
  const toggleItemsDropdown = () => {
    setItemsDropdownOpen(!itemsDropdownOpen);
  };

  // Keep dropdown open when on category pages
  React.useEffect(() => {
    if (isCategoryDropdownActive) {
      setCategoryDropdownOpen(true);
    }
  }, [isCategoryDropdownActive]);

  // Keep dropdown open when on items pages
  React.useEffect(() => {
    if (isItemsDropdownActive) {
      setItemsDropdownOpen(true);
    }
  }, [isItemsDropdownActive]);

  // Handle category listing navigation
  const handleCategoryListing = () => {
    navigate('/categories/listing');
    // Keep dropdown open - don't toggle
  };

  const handleCategoryCreate = () => {
    navigate('/categories/create');
    // Keep dropdown open - don't toggle
  };

  // Handle items navigation
  const handleItemsListing = () => {
    navigate('/items/listing');
    // Keep dropdown open - don't toggle
  };

  const handleItemsCreate = () => {
    navigate('/items/create');
    // Keep dropdown open - don't toggle
  };

  // Handle dashboard navigation
  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <LayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <Logo>
            <LogoIcon>🔥</LogoIcon>
            <LogoText>Metor</LogoText>
          </Logo>
        </SidebarHeader>

        <div style={{ padding: `${spacing.lg} 0`, flex: 1, paddingBottom: '80px' }}>
          <MenuItem active={currentPage === 'dashboard'} onClick={handleDashboard}>
            <MenuIcon active={currentPage === 'dashboard'}>📊</MenuIcon>
            <MenuText>DASHBOARD</MenuText>
            <Badge active={currentPage === 'dashboard'}>9+</Badge>
          </MenuItem>

          <div>
            <MenuItem onClick={toggleCategoryDropdown} active={isCategoryDropdownActive}>
              <MenuIcon active={isCategoryDropdownActive}>📁</MenuIcon>
              <MenuText>CATEGORIES</MenuText>
              <DropdownIcon isOpen={categoryDropdownOpen} active={isCategoryDropdownActive}>▼</DropdownIcon>
            </MenuItem>
            <MenuDropdown isOpen={categoryDropdownOpen}>
              <DropdownItem onClick={handleCategoryListing} active={isCategoryListingActive}>
                <MenuIcon>📋</MenuIcon>
                <MenuText>Listing</MenuText>
              </DropdownItem>
              <DropdownItem onClick={handleCategoryCreate} active={isCategoryCreateActive}>
                <MenuIcon>➕</MenuIcon>
                <MenuText>Add New</MenuText>
              </DropdownItem>
            </MenuDropdown>
          </div>

          <div>
            <MenuItem onClick={toggleItemsDropdown} active={isItemsDropdownActive}>
              <MenuIcon active={isItemsDropdownActive}>🍽️</MenuIcon>
              <MenuText>ITEMS</MenuText>
              <DropdownIcon isOpen={itemsDropdownOpen} active={isItemsDropdownActive}>▼</DropdownIcon>
            </MenuItem>
            <MenuDropdown isOpen={itemsDropdownOpen}>
              <DropdownItem onClick={handleItemsListing} active={isItemsListingActive}>
                <MenuIcon>📋</MenuIcon>
                <MenuText>Listing</MenuText>
              </DropdownItem>
              <DropdownItem onClick={handleItemsCreate} active={isItemsCreateActive}>
                <MenuIcon>➕</MenuIcon>
                <MenuText>Add New</MenuText>
              </DropdownItem>
            </MenuDropdown>
          </div>
        </div>

        <div style={{ 
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          backgroundColor: colors.background.primary
        }}>
          <MenuItem onClick={() => setLogoutConfirm(true)} style={{ 
            borderTop: '1px solid #f0f0f0', 
            paddingTop: spacing.md,
            margin: 0,
            borderRadius: 0
          }}>
            <MenuIcon>🚪</MenuIcon>
            <MenuText>LOGOUT</MenuText>
          </MenuItem>
        </div>
      </Sidebar>

      <MainContent>
        {children}
      </MainContent>

      <AlertDialog
        isOpen={logoutConfirm}
        type="info"
        title="Confirm Logout"
        message="Do you want to logout? You will need to login again to access the dashboard."
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        confirmText="Yes, Logout"
        cancelText="Cancel"
        showCancel={true}
      />
    </LayoutContainer>
  );
};

export default Layout;
