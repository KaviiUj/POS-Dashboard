// Color Schema for POS Dashboard
// Designed to be theme-ready for future dark mode implementation

export const colors = {
  // Primary Colors
  primary: {
    orange: '#FF8C00',      // Logo flame color
    purple: '#6A3FFB',      // Button and accent color
    purpleHover: '#5A32E8', // Darker purple for hover states
  },

  // Background Colors
  background: {
    primary: '#FFFFFF',     // White card background
    secondary: '#4A6572',   // Dark teal-gray main background
    tertiary: '#F8F9FA',    // Light gray for subtle backgrounds
  },

  // Text Colors
  text: {
    primary: '#2C3E50',     // Dark gray for main text (logo, headings, labels)
    secondary: '#7F8C8D',   // Light gray for sub-text and placeholders
    tertiary: '#95A5A6',    // Even lighter gray for disabled text
    white: '#FFFFFF',       // White text for buttons
    accent: '#6A3FFB',      // Purple for links and accents
  },

  // Border Colors
  border: {
    light: '#DCDCDC',       // Light gray for input borders
    medium: '#BDC3C7',      // Medium gray for checkboxes
    dark: '#34495E',        // Dark gray for focused borders
  },

  // Status Colors
  status: {
    success: '#27AE60',     // Green for success states
    error: '#E74C3C',       // Red for error states
    warning: '#F39C12',     // Orange for warning states
    info: '#3498DB',        // Blue for info states
  },

  // Interactive States
  interactive: {
    hover: {
      background: '#F8F9FA',  // Light background on hover
      border: '#6A3FFB',      // Purple border on hover
    },
    focus: {
      border: '#6A3FFB',      // Purple border when focused
      shadow: '0 0 0 3px rgba(106, 63, 251, 0.1)', // Purple shadow
    },
    disabled: {
      background: '#ECF0F1',  // Light gray for disabled
      text: '#95A5A6',        // Muted text for disabled
    },
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.1)',    // Light shadow
    medium: 'rgba(0, 0, 0, 0.15)',  // Medium shadow
    dark: 'rgba(0, 0, 0, 0.2)',     // Dark shadow
  },
};

// Dark Theme Colors (for future implementation)
export const darkColors = {
  // Primary Colors (same)
  primary: colors.primary,

  // Background Colors (inverted)
  background: {
    primary: '#2C3E50',     // Dark card background
    secondary: '#34495E',   // Darker main background
    tertiary: '#1A252F',    // Very dark for subtle backgrounds
  },

  // Text Colors (inverted)
  text: {
    primary: '#FFFFFF',     // White for main text
    secondary: '#BDC3C7',   // Light gray for sub-text
    tertiary: '#7F8C8D',    // Medium gray for disabled text
    white: '#FFFFFF',       // White text (same)
    accent: '#6A3FFB',      // Purple for links (same)
  },

  // Border Colors (adjusted for dark theme)
  border: {
    light: '#4A6572',       // Darker gray for input borders
    medium: '#5D6D7E',      // Medium dark gray for checkboxes
    dark: '#6A3FFB',        // Purple for focused borders
  },

  // Status Colors (same)
  status: colors.status,

  // Interactive States (adjusted for dark theme)
  interactive: {
    hover: {
      background: '#34495E',  // Dark background on hover
      border: '#6A3FFB',      // Purple border on hover
    },
    focus: {
      border: '#6A3FFB',      // Purple border when focused
      shadow: '0 0 0 3px rgba(106, 63, 251, 0.2)', // Stronger purple shadow
    },
    disabled: {
      background: '#34495E',  // Dark gray for disabled
      text: '#7F8C8D',        // Muted text for disabled
    },
  },

  // Shadow Colors (adjusted for dark theme)
  shadow: {
    light: 'rgba(0, 0, 0, 0.3)',    // Darker shadow
    medium: 'rgba(0, 0, 0, 0.4)',   // Medium dark shadow
    dark: 'rgba(0, 0, 0, 0.5)',     // Very dark shadow
  },
};

// Theme selector function
export const getThemeColors = (isDarkMode = false) => {
  return isDarkMode ? darkColors : colors;
};

// Common spacing values
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

// Common border radius values
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '50%',
};

// Common font sizes
export const fontSize = {
  xs: '12px',
  sm: '14px',
  md: '16px',
  lg: '18px',
  xl: '20px',
  xxl: '24px',
  xxxl: '32px',
};

// Common font weights
export const fontWeight = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

export default colors;
