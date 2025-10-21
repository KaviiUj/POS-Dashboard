import React from 'react';
import styled, { keyframes } from 'styled-components';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';

// Animations
const slideIn = keyframes`
  from {
    transform: translate(-50%, -50%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

// Styled Components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors.shadow.dark};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Dialog = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xl};
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px ${colors.shadow.dark};
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin: 0 auto ${spacing.lg} auto;
  background-color: ${props => 
    props.type === 'error' ? `${colors.status.error}1A` :
    props.type === 'success' ? `${colors.status.success}1A` :
    props.type === 'warning' ? `${colors.status.warning}1A` :
    `${colors.status.info}1A`
  };
`;

const Icon = styled.div`
  font-size: 24px;
  color: ${props => 
    props.type === 'error' ? colors.status.error :
    props.type === 'success' ? colors.status.success :
    props.type === 'warning' ? colors.status.warning :
    colors.status.info
  };
`;

const Title = styled.h3`
  font-size: ${fontSize.lg};
  font-weight: ${fontWeight.semibold};
  color: ${colors.text.primary};
  text-align: center;
  margin: 0 0 ${spacing.sm} 0;
`;

const Message = styled.p`
  font-size: ${fontSize.md};
  color: ${colors.text.secondary};
  text-align: center;
  margin: 0 0 ${spacing.xl} 0;
  line-height: 1.5;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${spacing.md};
  justify-content: center;
`;

const Button = styled.button`
  padding: ${spacing.md} ${spacing.lg};
  border: none;
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;

  ${props => props.variant === 'primary' && `
    background-color: ${props.type === 'error' ? colors.status.error : colors.primary.purple};
    color: ${colors.text.white};

    &:hover {
      background-color: ${props.type === 'error' ? colors.status.error : colors.primary.purpleHover};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  ${props => props.variant === 'secondary' && `
    background-color: transparent;
    color: ${colors.text.secondary};
    border: 1px solid ${colors.border.light};

    &:hover {
      background-color: ${colors.background.tertiary};
      border-color: ${colors.border.medium};
    }
  `}
`;

const AlertDialog = ({ 
  isOpen, 
  type = 'error', 
  title, 
  message, 
  onClose, 
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false 
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'error':
      default:
        return '✕';
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Success!';
      case 'warning':
        return 'Warning!';
      case 'info':
        return 'Information';
      case 'error':
      default:
        return 'Error!';
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Overlay onClick={onClose ? onClose : undefined}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <IconContainer type={type}>
          <Icon type={type}>{getIcon()}</Icon>
        </IconContainer>
        
        <Title>{getTitle()}</Title>
        <Message>{message}</Message>
        
        <ButtonContainer>
          {showCancel && onClose && (
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button variant="primary" type={type} onClick={handleConfirm}>
            {confirmText}
          </Button>
        </ButtonContainer>
      </Dialog>
    </Overlay>
  );
};

export default AlertDialog;
