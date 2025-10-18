import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Layout from './Layout';
import AlertDialog from './AlertDialog';
import CreateTableModal from './CreateTableModal';
import { tableAPI } from '../services/api';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';

// Styled Components
const Container = styled.div`
  padding: ${spacing.xl};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderLeft = styled.div`
  flex: 1;
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

const CreateButton = styled.button`
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
  white-space: nowrap;

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

const TableContainer = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${colors.background.tertiary};
  border-bottom: 2px solid ${colors.border.light};
`;

const TableHeaderCell = styled.th`
  padding: ${spacing.lg};
  text-align: left;
  font-size: ${fontSize.sm};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${colors.border.light};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors.background.tertiary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: ${spacing.lg};
  font-size: ${fontSize.md};
  color: ${colors.text.primary};
`;

const DeleteButton = styled.button`
  background-color: transparent;
  border: 2px solid ${colors.status.error};
  color: ${colors.status.error};
  padding: ${spacing.sm} ${spacing.md};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${spacing.xs};

  &:hover {
    background-color: ${colors.status.error};
    color: ${colors.text.white};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
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

const LoadingState = styled.div`
  text-align: center;
  padding: ${spacing.xxl};
  color: ${colors.text.secondary};
  font-size: ${fontSize.lg};
`;

// Main Component
const TableListing = ({ showToast }) => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    tableId: null,
    tableName: null
  });

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

  const handleDelete = (table) => {
    setDeleteDialog({
      isOpen: true,
      tableId: table.tableId,
      tableName: table.tableName
    });
  };

  const confirmDelete = async () => {
    try {
      const requestData = {
        tableId: deleteDialog.tableId
      };
      
      console.log('Deleting table:', requestData);
      const response = await tableAPI.delete(requestData);
      console.log('Delete table response:', response.data);

      if (response.data.success) {
        setTables(prevTables => 
          prevTables.filter(table => table.tableId !== deleteDialog.tableId)
        );
        setDeleteDialog({ isOpen: false, tableId: null, tableName: null });
        showToast(
          response.data.message || `Table "${deleteDialog.tableName}" deleted successfully!`,
          'success',
          'Table Deleted!',
          3000
        );
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      showToast(
        'Failed to delete table',
        'error',
        'Delete Failed!',
        3000
      );
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, tableId: null, tableName: null });
  };

  const handleCreateTable = () => {
    setCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModal(false);
  };

  const handleTableCreated = (newTable) => {
    // Refresh the tables list
    fetchTables();
  };

  return (
    <Layout currentPage="table" showToast={showToast}>
      <Container>
        <Header>
          <HeaderLeft>
            <Title>Table Management</Title>
            <Subtitle>Manage your restaurant tables</Subtitle>
          </HeaderLeft>
          <CreateButton onClick={handleCreateTable}>
            <span style={{ color: '#ffffff !important' }}>➕</span> Create
          </CreateButton>
        </Header>

        <TableContainer>
          {loading ? (
            <LoadingState>Loading tables...</LoadingState>
          ) : tables.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🪑</EmptyIcon>
              <EmptyText>No tables found</EmptyText>
            </EmptyState>
          ) : (
            <Table>
              <TableHeader>
                <tr>
                  <TableHeaderCell>Table Name</TableHeaderCell>
                  <TableHeaderCell>Pax</TableHeaderCell>
                  <TableHeaderCell>Availability</TableHeaderCell>
                  <TableHeaderCell>Action</TableHeaderCell>
                </tr>
              </TableHeader>
              <tbody>
                {tables.map((table) => (
                  <TableRow key={table.tableId}>
                    <TableCell>
                      <strong>{table.tableName}</strong>
                    </TableCell>
                    <TableCell>{table.pax || 'N/A'}</TableCell>
                    <TableCell>
                      <span style={{ 
                        color: table.isAvailable ? colors.status.success : colors.status.error,
                        fontWeight: fontWeight.medium 
                      }}>
                        {table.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DeleteButton onClick={() => handleDelete(table)}>
                        🗑️ Delete
                      </DeleteButton>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          )}
        </TableContainer>
      </Container>

      <CreateTableModal
        isOpen={createModal}
        onClose={handleCloseCreateModal}
        onTableCreated={handleTableCreated}
        showToast={showToast}
      />

      <AlertDialog
        isOpen={deleteDialog.isOpen}
        type="error"
        title="Delete Table"
        message={`Are you sure you want to delete "${deleteDialog.tableName}"? This action cannot be undone.`}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
        showCancel={true}
      />
    </Layout>
  );
};

export default TableListing;
