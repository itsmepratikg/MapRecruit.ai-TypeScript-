
import React, { createContext, useContext, useCallback } from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import { Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // If context is missing, provide a fallback that wraps direct toast calls
    // This allows components to potentially use it even if context is lost, though Provider is recommended
    return {
        addToast: (message: string, type: ToastType = 'info') => {
            if (type === 'success') toast.success(message);
            else if (type === 'error') toast.error(message);
            else toast(message);
        }
    };
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const options: ToastOptions = {
        duration: 4000,
    };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      case 'info':
      default:
        toast(message, {
            ...options,
            icon: <Info className="text-blue-500" size={20} />,
        });
        break;
    }
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
            // Styling uses Tailwind classes where possible, but reacts-hot-toast uses inline styles by default.
            // We override inline styles via the style prop using CSS variables defined in index.html for theme support.
            className: 'text-sm font-medium shadow-xl',
            style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                border: '1px solid var(--toast-border)',
                padding: '12px 16px',
                borderRadius: '0.75rem',
            },
            success: {
                iconTheme: {
                    primary: '#10b981', // emerald-500
                    secondary: 'white',
                },
            },
            error: {
                iconTheme: {
                    primary: '#ef4444', // red-500
                    secondary: 'white',
                },
            },
        }}
      />
    </ToastContext.Provider>
  );
};
