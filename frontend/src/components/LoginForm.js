import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import colors, { spacing, borderRadius, fontSize, fontWeight } from '../styles/colors';
import { authAPI } from '../services/api';
import AlertDialog from './AlertDialog';

// Styled Components
const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.background.secondary};
  padding: ${spacing.lg};
`;

const LoginCard = styled.div`
  background-color: ${colors.background.primary};
  border-radius: ${borderRadius.lg};
  padding: ${spacing.xxl};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px ${colors.shadow.medium};
  animation: slideUp 0.3s ease-out;
`;


const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: ${spacing.xl};
`;

const WelcomeTitle = styled.h2`
  font-size: ${fontSize.xl};
  font-weight: ${fontWeight.bold};
  color: ${colors.text.primary};
  margin: 0 0 ${spacing.sm} 0;
`;

const WelcomeSubtitle = styled.p`
  font-size: ${fontSize.sm};
  color: ${colors.text.secondary};
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.lg};
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
`;

const InputContainer = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: ${spacing.md};
  border: 1px solid ${colors.border.light};
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  color: ${colors.text.primary};
  background-color: ${colors.background.primary};
  transition: all 0.2s ease;

  &::placeholder {
    color: ${colors.text.secondary};
  }

  &:focus {
    border-color: ${colors.border.dark};
    box-shadow: 0 0 0 3px ${colors.interactive.focus.shadow};
  }

  &:hover {
    border-color: ${colors.interactive.hover.border};
  }
`;


const SignInButton = styled.button`
  width: 100%;
  padding: ${spacing.md};
  background-color: ${colors.primary.purple};
  color: ${colors.text.white};
  border: none;
  border-radius: ${borderRadius.md};
  font-size: ${fontSize.md};
  font-weight: ${fontWeight.semibold};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  transition: all 0.2s ease;
  margin-top: ${spacing.md};

  &:hover {
    background-color: ${colors.primary.purpleHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(106, 63, 251, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: ${colors.interactive.disabled.background};
    color: ${colors.interactive.disabled.text};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ButtonIcon = styled.span`
  font-size: ${fontSize.md};
`;


// Main Login Form Component
const LoginForm = ({ showToast }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: '',
    passWord: '',
  });
  const [alert, setAlert] = useState({
    isOpen: false,
    type: 'error',
    title: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear alert when user starts typing
    if (alert.isOpen) {
      setAlert(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Sending login request:', formData);
      const response = await authAPI.login(formData);
      console.log('Login response:', response.data);
      const { success, message, data } = response.data;

      if (success && data) {
        // Save token and user data to localStorage
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify({
          userId: data.userId,
          userName: data.userName,
          role: data.role,
        }));

        // Show success toast
        showToast(`Welcome back, ${data.userName}!`, 'success', 'Login Successful!', 2000);

        // Navigate to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);

      } else {
        throw new Error(message || 'Login failed');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Login failed. Please try again.';
      
      setAlert({
        isOpen: true,
        type: 'error',
        title: 'Login Failed',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginCard className="fade-in">
        <WelcomeSection>
          <WelcomeTitle>
            Hi, Welcome Back 👋
          </WelcomeTitle>
          <WelcomeSubtitle>
            Enter your credentials to access your account.
          </WelcomeSubtitle>
        </WelcomeSection>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="userName">User Name</Label>
            <InputContainer>
              <Input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Enter User Name"
                required
              />
            </InputContainer>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="passWord">Password</Label>
            <InputContainer>
              <Input
                type="password"
                id="passWord"
                name="passWord"
                value={formData.passWord}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </InputContainer>
          </FormGroup>


          <SignInButton type="submit" disabled={loading}>
            <ButtonIcon>→</ButtonIcon>
            {loading ? 'Signing In...' : 'Sign In'}
          </SignInButton>
        </Form>

        <AlertDialog
          isOpen={alert.isOpen}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(prev => ({ ...prev, isOpen: false }))}
        />
      </LoginCard>
    </LoginContainer>
  );
};

export default LoginForm;
