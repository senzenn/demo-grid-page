/**
 * SkyAgent Payment Widget
 * Embeddable payment button for websites
 * 
 * Usage:
 * <script src="https://yourdomain.com/widget.js"></script>
 * <div 
 *   data-skyagent-widget="payment"
 *   data-link-id="xxx"
 *   data-button-text="Pay Now"
 *   data-button-color="#000000"
 * ></div>
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import Image from 'next/image';

interface WidgetProps {
  linkId: string;
  buttonText?: string;
  buttonColor?: string;
  logoUrl?: string;
}

function PaymentButton({ linkId, buttonText = 'Pay Now', buttonColor = '#000000', logoUrl }: WidgetProps) {
  const handleClick = () => {
    // Open checkout in popup window
    const checkoutUrl = `${window.location.origin}/checkout/${linkId}`;
    window.open(
      checkoutUrl,
      'SkyAgent Payment',
      'width=600,height=800,scrollbars=yes,resizable=yes'
    );
  };

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          backgroundColor: buttonColor,
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {logoUrl && (
          <Image
            src={logoUrl}
            alt="Logo"
            width={20}
            height={20}
            style={{ borderRadius: '4px' }}
          />
        )}
        <span>{buttonText}</span>
      </button>
    </>
  );
}

// Auto-initialize widgets on page load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    const widgets = document.querySelectorAll('[data-skyagent-widget="payment"]');
    
    widgets.forEach((element) => {
      const linkId = element.getAttribute('data-link-id');
      const buttonText = element.getAttribute('data-button-text');
      const buttonColor = element.getAttribute('data-button-color');
      const logoUrl = element.getAttribute('data-logo-url');

      if (linkId) {
        const root = createRoot(element);
        root.render(
          <PaymentButton
            linkId={linkId}
            buttonText={buttonText || undefined}
            buttonColor={buttonColor || undefined}
            logoUrl={logoUrl || undefined}
          />
        );
      }
    });
  });
}

export default PaymentButton;

