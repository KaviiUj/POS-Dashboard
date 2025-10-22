import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { QRCodeCanvas } from 'qrcode.react';
import html2canvas from 'html2canvas';
import Layout from './Layout';
import { tableAPI } from '../services/api';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import { QR_CONFIG } from '../constants/config';
import { encryptParams } from '../utils/encryption';

// Styled Components
const Container = styled.div`
  padding: ${spacing.xl};
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${spacing.xl};
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

const ContentContainer = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px ${colors.shadow.light};
  padding: ${spacing.xl};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.xl};
`;

const Label = styled.label`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  color: ${colors.text.primary};
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
    box-shadow: 0 0 0 3px ${colors.shadow.purpleLight};
  }
`;

const QRDisplay = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  background-color: ${colors.background.tertiary};
  border-radius: ${borderRadius.lg};
  border: 2px dashed ${colors.border.light};
`;

const QRPlaceholder = styled.div`
  font-size: 64px;
  margin-bottom: ${spacing.lg};
  color: ${colors.text.tertiary};
`;

const QRText = styled.p`
  font-size: ${fontSize.lg};
  color: ${colors.text.secondary};
  margin: 0;
`;

const QRCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.lg};
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.md};
  border: 1px solid ${colors.border.light};
`;

const QRCodeWrapper = styled.div`
  padding: ${spacing.md};
  background-color: white;
  border-radius: ${borderRadius.sm};
  box-shadow: 0 2px 8px ${colors.shadow.light};
`;

const DownloadQRContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  background-color: white;
  width: 400px;
  height: 500px;
  position: relative;
  overflow: hidden;
`;

const QRCodeSection = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  padding: 10px;
`;

const CornerBracket = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #000000;
  
  &.top-left {
    top: -10px;
    left: -10px;
    border-right: none;
    border-bottom: none;
  }
  
  &.top-right {
    top: -10px;
    right: -10px;
    border-left: none;
    border-bottom: none;
  }
  
  &.bottom-left {
    bottom: -10px;
    left: -10px;
    border-right: none;
    border-top: none;
  }
  
  &.bottom-right {
    bottom: -10px;
    right: -10px;
    border-left: none;
    border-top: none;
  }
`;

const ScanMeButton = styled.div`
  background-color: white;
  border: 4px solid #000000;
  border-radius: 25px;
  padding: 12px 30px;
  color: #000000;
  font-weight: bold;
  font-size: 16px;
  text-align: center;
  letter-spacing: 1px;
  min-width: 120px;
`;

const DownloadQRCode = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
  color: ${colors.text.secondary};
  font-size: ${fontSize.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
  color: ${colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${spacing.lg};
`;

const EmptyText = styled.p`
  font-size: ${fontSize.lg};
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${spacing.md};
  margin-top: ${spacing.xl};
`;

const GenerateButton = styled.button`
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

const DownloadButton = styled.button`
  background-color: ${colors.background.tertiary};
  color: ${colors.text.primary};
  border: 2px solid ${colors.border.light};
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
    background-color: ${colors.border.light};
    border-color: ${colors.text.secondary};
    transform: translateY(-2px);
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
const QR = ({ showToast }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(true);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [qrData, setQrData] = useState(null);
  const downloadRef = useRef(null);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      setLoading(true);
      const response = await tableAPI.getAll();
      
      if (response.data.success) {
        setTables(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
      showToast('Failed to fetch tables', 'error', 'Error', 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleTableSelect = (e) => {
    setSelectedTable(e.target.value);
    // Reset QR when table changes
    setQrGenerated(false);
    setQrData(null);
  };

  const handleGenerateQR = () => {
    if (!selectedTable) {
      showToast('Please select a table first', 'error', 'No Table Selected', 3000);
      return;
    }
    
    const selectedTableData = tables.find(t => t.tableId === selectedTable);
    
    // Encrypt table data
    const tableData = {
      tableName: selectedTableData.tableName,
      tableId: selectedTableData.tableId
    };
    
    const encryptedToken = encryptParams(tableData);
    
    // Create direct URL with encrypted token that opens immediately when scanned
    const qrUrl = `${QR_CONFIG.LOGIN_URL}?t=${encryptedToken}`;
    
    setQrData(qrUrl);
    setQrGenerated(true);
    showToast(`QR code generated for ${selectedTableData?.tableName}!`, 'success', 'QR Generated', 3000);
  };

  const handleDownload = async () => {
    if (!selectedTable || !qrGenerated) {
      showToast('Please generate QR code first', 'error', 'No QR Code', 3000);
      return;
    }
    
    const selectedTableData = tables.find(t => t.tableId === selectedTable);
    
    try {
      // Temporarily make the download container visible for capture
      const downloadElement = downloadRef.current;
      if (downloadElement) {
        downloadElement.style.visibility = 'visible';
        downloadElement.style.position = 'fixed';
        downloadElement.style.left = '0';
        downloadElement.style.top = '0';
        downloadElement.style.zIndex = '9999';
      }
      
      // Wait a moment for the element to render
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Capture the styled QR code container
      const canvas = await html2canvas(downloadElement, {
        backgroundColor: '#FFFFFF',
        scale: 2, // Higher resolution
        useCORS: true,
        allowTaint: true,
        width: 400,
        height: 500
      });
      
      // Hide the element again
      if (downloadElement) {
        downloadElement.style.visibility = 'hidden';
        downloadElement.style.position = 'absolute';
        downloadElement.style.left = '-9999px';
        downloadElement.style.top = '-9999px';
        downloadElement.style.zIndex = 'auto';
      }
      
      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `QR-${selectedTableData.tableName.replace(/\s+/g, '-')}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 'image/png');
      
      showToast(`Downloading QR code for ${selectedTableData?.tableName}...`, 'success', 'Download Started', 3000);
    } catch (error) {
      console.error('Download error:', error);
      showToast('Failed to download QR code', 'error', 'Download Failed', 3000);
    }
  };

  return (
    <Layout currentPage="qr" showToast={showToast}>
      <Container>
        <Header>
          <Title>Table QR</Title>
          <Subtitle>Generate QR codes for your restaurant tables</Subtitle>
        </Header>

        <ContentContainer>
          {loading ? (
            <LoadingState>Loading tables...</LoadingState>
          ) : tables.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🪑</EmptyIcon>
              <EmptyText>No tables found</EmptyText>
            </EmptyState>
          ) : (
            <>
              <FormGroup>
                <Label>Select Table</Label>
                <Select value={selectedTable} onChange={handleTableSelect}>
                  <option value="">Choose a table...</option>
                  {tables.map((table) => (
                    <option key={table.tableId} value={table.tableId}>
                      {table.tableName} (Pax: {table.pax})
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <QRDisplay>
                {selectedTable ? (
                  qrGenerated ? (
                    <>
                      <QRCodeContainer>
                        <QRText>
                          QR Code for {tables.find(t => t.tableId === selectedTable)?.tableName}
                        </QRText>
                        <QRCodeWrapper>
                          <QRCodeCanvas
                            value={qrData}
                            size={200}
                            level="M"
                            includeMargin={true}
                          />
                        </QRCodeWrapper>
                        <QRText style={{ fontSize: fontSize.sm, color: colors.text.tertiary }}>
                          Scan this QR code to access the table
                        </QRText>
                      </QRCodeContainer>
                      
                      {/* Download container - positioned off-screen but visible for capture */}
                      <div style={{ 
                        position: 'absolute', 
                        left: '-9999px', 
                        top: '-9999px',
                        visibility: 'hidden',
                        pointerEvents: 'none'
                      }}>
                        <DownloadQRContainer ref={downloadRef}>
                          <QRCodeSection>
                            <QRCodeCanvas
                              value={qrData}
                              size={250}
                              level="M"
                              includeMargin={true}
                              fgColor="#000000"
                              bgColor="#FFFFFF"
                            />
                            <CornerBracket className="top-left" />
                            <CornerBracket className="top-right" />
                            <CornerBracket className="bottom-left" />
                            <CornerBracket className="bottom-right" />
                          </QRCodeSection>
                          <ScanMeButton>SCAN ME</ScanMeButton>
                        </DownloadQRContainer>
                      </div>
                    </>
                  ) : (
                    <>
                      <QRPlaceholder>📱</QRPlaceholder>
                      <QRText>
                        QR Code for {tables.find(t => t.tableId === selectedTable)?.tableName}
                      </QRText>
                      <QRText style={{ fontSize: fontSize.sm, color: colors.text.tertiary, marginTop: spacing.sm }}>
                        Click "Generate QR" to create the QR code
                      </QRText>
                    </>
                  )
                ) : (
                  <>
                    <QRPlaceholder>📱</QRPlaceholder>
                    <QRText>Select a table to generate QR code</QRText>
                  </>
                )}
              </QRDisplay>

              <ButtonContainer>
                <GenerateButton onClick={handleGenerateQR} disabled={!selectedTable}>
                  🔄 Generate QR
                </GenerateButton>
                <DownloadButton onClick={handleDownload} disabled={!selectedTable || !qrGenerated}>
                  💾 Download
                </DownloadButton>
              </ButtonContainer>
            </>
          )}
        </ContentContainer>
      </Container>
    </Layout>
  );
};

export default QR;
