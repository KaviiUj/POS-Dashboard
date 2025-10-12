import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';

// Animations
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const progress = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// Styled Components
const ToastContainer = styled.div`
  position: fixed;
  bottom: ${spacing.lg};
  right: ${spacing.lg};
  z-index: 1001;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  pointer-events: none;
`;

const Toast = styled.div`
  background-color: ${props => 
    props.type === 'success' ? colors.status.success :
    props.type === 'error' ? colors.status.error :
    props.type === 'warning' ? colors.status.warning :
    colors.status.info
  };
  color: ${colors.text.white};
  padding: ${spacing.md} ${spacing.lg};
  border-radius: ${borderRadius.md};
  box-shadow: 0 4px 12px ${colors.shadow.medium};
  min-width: 300px;
  max-width: 400px;
  position: relative;
  overflow: hidden;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-out;
  pointer-events: auto;
`;

const ToastHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  margin-bottom: ${spacing.xs};
`;

const ToastIcon = styled.div`
  font-size: ${fontSize.lg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToastTitle = styled.div`
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.semibold};
  flex: 1;
`;

const ToastClose = styled.button`
  background: none;
  border: none;
  color: ${colors.text.white};
  font-size: ${fontSize.lg};
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const ToastMessage = styled.div`
  font-size: ${fontSize.sm};
  opacity: 0.9;
  line-height: 1.4;
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.3);
  animation: ${progress} ${props => props.duration || 3000}ms linear;
`;

// Toast Hook
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', title = '', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      title,
      duration,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);

    return id;
  };

  const hideToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { showToast, hideToast, toasts };
};

// Main Toast Component
const ToastComponent = ({ toasts, hideToast }) => {
  if (toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map((toast, index) => (
        <ToastWrapper
          key={toast.id}
          toast={toast}
          index={index}
          onClose={() => hideToast(toast.id)}
        />
      ))}
    </ToastContainer>
  );
};

const ToastWrapper = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getTitle = () => {
    if (toast.title) return toast.title;
    switch (toast.type) {
      case 'success':
        return 'Success!';
      case 'error':
        return 'Error!';
      case 'warning':
        return 'Warning!';
      case 'info':
      default:
        return 'Information';
    }
  };

  return (
    <Toast type={toast.type} isVisible={isVisible}>
      <ToastHeader>
        <ToastIcon>{getIcon()}</ToastIcon>
        <ToastTitle>{getTitle()}</ToastTitle>
        <ToastClose onClick={onClose}>×</ToastClose>
      </ToastHeader>
      <ToastMessage>{toast.message}</ToastMessage>
      <ProgressBar duration={toast.duration} />
    </Toast>
  );
};

export default ToastComponent;
