import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { staffAPI } from '../services/api';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import Layout from './Layout';
import AlertDialog from './AlertDialog';
import EditStaffModal from './EditStaffModal';

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
  color: ${colors.text.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TableCell = styled.td`
  padding: ${spacing.md};
  font-size: ${fontSize.md};
  color: ${colors.text.primary};
  vertical-align: middle;
`;

const StaffInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
`;

const StaffAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${colors.primary.purple};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.text.white};
  font-weight: ${fontWeight.bold};
  font-size: ${fontSize.sm};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

const StaffName = styled.div`
  font-weight: ${fontWeight.medium};
  color: ${colors.text.primary};
`;

const StaffDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xs};
`;

const DetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
`;

const DetailLabel = styled.span`
  font-weight: ${fontWeight.medium};
  min-width: 80px;
`;

const DetailValue = styled.span`
  color: ${colors.text.primary};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: ${spacing.sm};
  border-radius: ${borderRadius.sm};
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 ${spacing.xs};
  
  &:hover {
    background-color: ${colors.background.tertiary};
  }
`;

const EditButton = styled(ActionButton)`
  color: ${colors.primary.blue};
  
  &:hover {
    background-color: rgba(59, 130, 246, 0.1);
  }
`;

const DeleteButton = styled(ActionButton)`
  color: ${colors.status.error};
  
  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
  }
`;

const ActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

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

const LoadingMessage = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${colors.text.secondary};
  font-size: ${fontSize.lg};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${colors.status.error};
  font-size: ${fontSize.lg};
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: ${spacing.xl};
  color: ${colors.text.secondary};
  font-size: ${fontSize.lg};
`;

// Main Component
const StaffListing = ({ showToast }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    staffId: null,
    staffName: null
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    staff: null
  });

  // Fetch staff data
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffAPI.getAll();
      
      if (response.data.success) {
        setStaff(response.data.data);
      } else {
        setError('Failed to fetch staff data');
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to fetch staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle staff status toggle
  const handleToggleStatus = async (staffId, currentStatus) => {
    try {
      const requestData = {
        staffId: staffId,
        isActive: !currentStatus
      };
      
      console.log('Updating staff status:', requestData);
      const response = await staffAPI.updateStatus(requestData);
      console.log('Staff status update response:', response.data);

      if (response.data.success) {
        setStaff(prevStaff => 
          prevStaff.map(staff => 
            staff.staffId === staffId 
              ? { ...staff, isActive: !currentStatus }
              : staff
          )
        );
        showToast(
          response.data.message || `Staff ${!currentStatus ? 'activated' : 'deactivated'} successfully!`,
          'success',
          'Status Updated!',
          3000
        );
      }
    } catch (err) {
      console.error('Error updating staff status:', err);
      showToast(
        'Failed to update staff status',
        'error',
        'Update Failed!',
        3000
      );
    }
  };

  // Handle edit staff
  const handleEdit = (staff) => {
    setEditModal({
      isOpen: true,
      staff: staff
    });
  };

  // Handle close edit modal
  const handleCloseEditModal = () => {
    setEditModal({
      isOpen: false,
      staff: null
    });
  };

  // Handle staff update
  const handleUpdateStaff = (updatedStaff) => {
    setStaff(prevStaff => 
      prevStaff.map(staff => 
        staff.staffId === updatedStaff.staffId 
          ? { ...staff, ...updatedStaff }
          : staff
      )
    );
  };

  // Handle delete staff
  const handleDelete = (staff) => {
    setDeleteDialog({
      isOpen: true,
      staffId: staff.staffId,
      staffName: staff.staffName
    });
  };

  const confirmDelete = async () => {
    try {
      const requestData = {
        staffId: deleteDialog.staffId
      };
      
      console.log('Deleting staff:', requestData);
      const response = await staffAPI.delete(requestData);
      console.log('Delete staff response:', response.data);

      if (response.data.success) {
        setStaff(prevStaff => 
          prevStaff.filter(staff => staff.staffId !== deleteDialog.staffId)
        );
        setDeleteDialog({ isOpen: false, staffId: null, staffName: null });
        showToast(
          response.data.message || `Staff "${deleteDialog.staffName}" deleted successfully!`,
          'success',
          'Staff Deleted!',
          3000
        );
      }
    } catch (err) {
      console.error('Error deleting staff:', err);
      showToast(
        'Failed to delete staff',
        'error',
        'Delete Failed!',
        3000
      );
    }
  };

  const cancelDelete = () => {
    setDeleteDialog({ isOpen: false, staffId: null, staffName: null });
  };

  // Get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout currentPage="staff-listing" showToast={showToast}>
      <Container>
        <Header>
          <Title>Staff Management</Title>
        </Header>

        {loading ? (
          <LoadingMessage>Loading staff...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : staff.length === 0 ? (
          <EmptyMessage>No staff members found</EmptyMessage>
        ) : (
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Staff Name</TableHeaderCell>
                  <TableHeaderCell>Contact No.</TableHeaderCell>
                  <TableHeaderCell>Address</TableHeaderCell>
                  <TableHeaderCell>NIC</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Action</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <tbody>
                {staff.map((staffMember) => (
                  <TableRow key={staffMember.staffId}>
                    <TableCell>
                      <StaffInfo>
                        <StaffAvatar>
                          {staffMember.profileImageUrl ? (
                            <img 
                              src={staffMember.profileImageUrl} 
                              alt={staffMember.staffName}
                            />
                          ) : (
                            getInitials(staffMember.staffName)
                          )}
                        </StaffAvatar>
                        <StaffName>{staffMember.staffName}</StaffName>
                      </StaffInfo>
                    </TableCell>
                    <TableCell>
                      <DetailValue>{staffMember.mobileNumber}</DetailValue>
                    </TableCell>
                    <TableCell>
                      <DetailValue>{staffMember.address}</DetailValue>
                    </TableCell>
                    <TableCell>
                      <DetailValue>{staffMember.nic}</DetailValue>
                    </TableCell>
                    <TableCell>
                      <ToggleSwitch>
                        <ToggleInput
                          type="checkbox"
                          checked={staffMember.isActive}
                          onChange={() => handleToggleStatus(staffMember.staffId, staffMember.isActive)}
                        />
                        <ToggleSlider />
                      </ToggleSwitch>
                    </TableCell>
                    <TableCell>
                      <ActionContainer>
                        <EditButton 
                          title="Edit Staff"
                          onClick={() => handleEdit(staffMember)}
                        >
                          ✏️
                        </EditButton>
                        <DeleteButton 
                          title="Delete Staff"
                          onClick={() => handleDelete(staffMember)}
                        >
                          🗑️
                        </DeleteButton>
                      </ActionContainer>
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}

        {/* Edit Staff Modal */}
        <EditStaffModal
          isOpen={editModal.isOpen}
          staff={editModal.staff}
          onClose={handleCloseEditModal}
          onUpdate={handleUpdateStaff}
          showToast={showToast}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={deleteDialog.isOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          title="Delete Staff"
          message={`Are you sure you want to delete "${deleteDialog.staffName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="error"
          showCancel={true}
        />
      </Container>
    </Layout>
  );
};

export default StaffListing;
