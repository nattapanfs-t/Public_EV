import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import ProgressBar from './progressBar';

const Layout = ({ title, children, progressBarProps }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {progressBarProps && <ProgressBar {...progressBarProps} />}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '1',
          width: '100%', 

        }}
      >
        <Card
          title={<span style={{ fontSize: '1.5rem'}}>{title}</span>}
          style={{
            width: '100%', 
            backgroundColor: '#fff',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
          }}
          headStyle={{
            borderBottom: '3px solid #1677ff',
            padding: '0 16px',
            fontSize: '1.5em',
          }}
        >
          {children}
        </Card>
      </div>
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  progressBarProps: PropTypes.object, 
};

export default Layout;
