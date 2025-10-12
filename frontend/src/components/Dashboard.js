import React from 'react';
import styled from 'styled-components';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import Layout from './Layout';

// Styled Components
const DashboardContent = styled.div`
  padding: ${spacing.lg};
`;


const Header = styled.div`
  background-color: ${colors.primary.purple};
  color: ${colors.text.white};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${spacing.md};
  border: none;
  border-radius: ${borderRadius.md};
  background-color: rgba(255, 255, 255, 0.1);
  color: ${colors.text.white};
  font-size: ${fontSize.md};

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.lg};
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${colors.text.white};
  font-size: ${fontSize.lg};
  cursor: pointer;
  padding: ${spacing.sm};
  border-radius: ${borderRadius.sm};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: ${colors.status.error};
  color: ${colors.text.white};
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${fontWeight.bold};
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.primary.orange};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.white};
  font-weight: ${fontWeight.bold};
`;

const UserName = styled.span`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const StatCard = styled.div`
  background-color: ${colors.background.primary};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px ${colors.shadow.light};
  display: flex;
  align-items: center;
  gap: ${spacing.md};
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${fontSize.xl};
  background-color: ${props => props.color || colors.primary.purple};
  color: ${colors.text.white};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: ${fontSize.xxl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const StatLabel = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.lg};
`;

const ChartCard = styled.div`
  background-color: ${colors.background.primary};
  padding: ${spacing.lg};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px ${colors.shadow.light};
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${spacing.lg};
`;

const ChartTitle = styled.h3`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  margin: 0;
`;

const ChartDropdown = styled.select`
  padding: ${spacing.sm} ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.sm};
  background-color: ${colors.background.primary};
  color: ${colors.text.primary};
  font-size: ${fontSize.sm};
`;

const ChartPlaceholder = styled.div`
  height: 200px;
  background: linear-gradient(45deg, ${colors.background.tertiary} 25%, transparent 25%), 
              linear-gradient(-45deg, ${colors.background.tertiary} 25%, transparent 25%), 
              linear-gradient(45deg, transparent 75%, ${colors.background.tertiary} 75%), 
              linear-gradient(-45deg, transparent 75%, ${colors.background.tertiary} 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  border-radius: ${borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.secondary};
  font-size: ${fontSize.md};
  margin-bottom: ${spacing.md};
`;

const Legend = styled.div`
  display: flex;
  gap: ${spacing.lg};
  margin-bottom: ${spacing.md};
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const LegendDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const LegendLabel = styled.span`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
`;

const OutletsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

const OutletItem = styled.div`
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
`;

const OutletName = styled.div`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const OutletAddress = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xs};
`;

const OutletPhone = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  margin-bottom: ${spacing.xs};
`;

const OutletRating = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.primary.orange};
  font-weight: ${fontWeight.medium};
`;

const BottomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};
`;

const TrendingItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
`;

const TrendingImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: ${borderRadius.sm};
  background: linear-gradient(45deg, ${colors.primary.orange}, ${colors.primary.purple});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.white};
  font-size: ${fontSize.lg};
`;

const TrendingContent = styled.div`
  flex: 1;
`;

const TrendingName = styled.div`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.primary};
  margin-bottom: ${spacing.xs};
`;

const TrendingPrice = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.primary.purple};
  font-weight: ${fontWeight.semibold};
`;

const TrendingOrders = styled.div`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
`;

// Main Dashboard Component
const Dashboard = ({ showToast }) => {

  // Mock data
  const stats = [
    {
      label: 'TOTAL REVENUE',
      value: '$35,428.09',
      icon: '$',
      color: colors.primary.purple,
    },
    {
      label: 'TOTAL ORDERS',
      value: '4526',
      icon: '🍽️',
      color: colors.text.secondary,
    },
    {
      label: 'TOTAL CUSTOMERS',
      value: '5736',
      icon: '👤',
      color: colors.text.secondary,
    },
    {
      label: 'CANCELLED ORDERS',
      value: '1310',
      icon: '📅',
      color: colors.primary.purple,
    },
  ];

  const outlets = [
    {
      name: 'TORONTO - CANADA',
      address: '88 Bloor St W, Toronto, ON M5S 1M5',
      phone: '+1 416-555-1122',
      rating: '★4.2',
    },
    {
      name: 'BERLIN - GERMANY',
      address: 'Kurfürstendamm 21, 10719 Berlin',
      phone: '+49 30 5555 3333',
      rating: '★4.6',
    },
    {
      name: 'DUBAI - UAE',
      address: 'Sheikh Zayed Rd, Dubai Marina',
      phone: '+971 4 555 7777',
      rating: '★4.9',
    },
  ];

  const trendingItems = [
    {
      name: 'Italian Burata Pizza',
      price: '$12.00',
      orders: '22x',
      icon: '🍕',
    },
    {
      name: 'Veg Indian Thali',
      price: '$14.00',
      orders: '13x',
      icon: '🍛',
    },
  ];

  return (
    <Layout currentPage="dashboard">
      <DashboardContent>
        <Header>
          <HeaderLeft>
            <SearchBar>
              <SearchInput placeholder="Start typing..." />
            </SearchBar>
          </HeaderLeft>
          <HeaderRight>
            <IconButton style={{ position: 'relative' }}>
              🌙
            </IconButton>
            <IconButton style={{ position: 'relative' }}>
              🔔
              <NotificationBadge>18</NotificationBadge>
            </IconButton>
            <UserProfile>
              <UserAvatar>DL</UserAvatar>
              <UserName>DORIS LIETZ</UserName>
            </UserProfile>
          </HeaderRight>
        </Header>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard key={index}>
              <StatIcon color={stat.color}>{stat.icon}</StatIcon>
              <StatContent>
                <StatValue>{stat.value}</StatValue>
                <StatLabel>{stat.label}</StatLabel>
              </StatContent>
            </StatCard>
          ))}
        </StatsGrid>

        <ContentGrid>
          <ChartCard>
            <ChartHeader>
              <ChartTitle>REVENUE SUMMARY</ChartTitle>
              <ChartDropdown>
                <option>Monthly</option>
                <option>Weekly</option>
                <option>Daily</option>
              </ChartDropdown>
            </ChartHeader>
            <Legend>
              <LegendItem>
                <LegendDot color={colors.primary.purple} />
                <LegendLabel>Income</LegendLabel>
              </LegendItem>
              <LegendItem>
                <LegendDot color={colors.text.secondary} />
                <LegendLabel>Expense</LegendLabel>
              </LegendItem>
            </Legend>
            <ChartPlaceholder>
              Revenue Chart (March - December)
            </ChartPlaceholder>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <ChartTitle>OTHER OUTLETS</ChartTitle>
              <IconButton>✏️</IconButton>
            </ChartHeader>
            <OutletsList>
              {outlets.map((outlet, index) => (
                <OutletItem key={index}>
                  <OutletName>{outlet.name}</OutletName>
                  <OutletAddress>{outlet.address}</OutletAddress>
                  <OutletPhone>{outlet.phone}</OutletPhone>
                  <OutletRating>{outlet.rating}</OutletRating>
                </OutletItem>
              ))}
            </OutletsList>
          </ChartCard>
        </ContentGrid>

        <BottomGrid>
          <ChartCard>
            <ChartHeader>
              <ChartTitle>DAILY DELIVERY CHART</ChartTitle>
              <ChartDropdown>
                <option>Weekly</option>
                <option>Monthly</option>
              </ChartDropdown>
            </ChartHeader>
            <div style={{ padding: spacing.md, textAlign: 'center', color: colors.text.primary }}>
              Yeah! You have delivered <strong>910</strong> orders today
            </div>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <ChartTitle>ORDERS OVERVIEW</ChartTitle>
              <ChartDropdown>
                <option>Weekly</option>
                <option>Monthly</option>
              </ChartDropdown>
            </ChartHeader>
            <div style={{ padding: spacing.md, textAlign: 'center', color: colors.text.primary }}>
              Yeah! You have received <strong>+33</strong> new orders today
            </div>
          </ChartCard>

          <ChartCard>
            <ChartHeader>
              <ChartTitle>DAILY TRENDING MENU</ChartTitle>
              <IconButton style={{ color: colors.primary.purple }}>VIEW MENU →</IconButton>
            </ChartHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              {trendingItems.map((item, index) => (
                <TrendingItem key={index}>
                  <TrendingImage>{item.icon}</TrendingImage>
                  <TrendingContent>
                    <TrendingName>#{index + 1} {item.name}</TrendingName>
                    <TrendingPrice>{item.price}</TrendingPrice>
                    <TrendingOrders>Orders: {item.orders}</TrendingOrders>
                  </TrendingContent>
                </TrendingItem>
              ))}
            </div>
          </ChartCard>
        </BottomGrid>
      </DashboardContent>
    </Layout>
  );
};

export default Dashboard;
