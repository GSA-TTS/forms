export const modalWrapperStyle = (isOpen: boolean) => ({
  textAlign: 'center',
  transition: 'opacity 0.3s ease',
  visibility: isOpen ? 'visible' : 'hidden',
  opacity: isOpen ? 1 : 0,
  position: 'fixed',
  zIndex: 1050,
});

export const modalOverlayStyle = {
  background: 'rgba(0, 0, 0, 0.7)',
  bottom: 0,
  height: '100%',
  left: 0,
  overflow: 'scroll',
  overflowX: 'hidden',
  padding: '1.5rem',
  position: 'fixed',
  top: 0,
  width: '100%',
  scrollBehavior: 'smooth',
  alignContent: 'center',
};

export const modalStyle = {
  background: '#fff',
  lineHeight: '1.5',
  borderRadius: '.5rem',
  display: 'inline-block',
  margin: '1.5rem auto',
  maxWidth: '30rem',
  position: 'relative',
  textAlign: 'left',
  verticalAlign: 'middle',
  width: '100%',
};

export const modalContentStyle = {
  display: 'flex',
  flexDirection: 'column-reverse',
  paddingTop: '2rem',
  width: '100%',
};

export const modalMainStyle = {
  margin: '0 auto',
  padding: '.5rem 2rem 2rem',
};

export const modalHeadingStyle = {
  fontSize: '1.22rem',
  lineHeight: '1.4',
  marginTop: 0,
};

export const modalProseStyle = {
  lineHeight: '1.5',
  fontSize: '1.06rem',
};

export const modalParagraphStyle = {
  maxWidth: '64ex',
};

export const modalFooterStyle = {
  marginTop: '1.5rem',
};

export const buttonStyle = {
  backgroundColor: '#005ea2',
  color: '#fff',
  lineHeight: '.9',
  fontSize: '1.06rem',
  padding: '.5rem 1rem',
  border: 'none',
  borderRadius: '.25rem',
  cursor: 'pointer',
  appearance: 'none',
  alignItems: 'center',
  columnGap: '0.5rem',
  display: 'inline-flex',
  fontWeight: '700',
  justifyContent: 'center',
  textAlign: 'center',
  textDecoration: 'none',
};

export const closeButtonStyle = {
  position: 'absolute',
  top: '16px',
  right: '16px',
  background: 'transparent',
  color: '#808080',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
};
