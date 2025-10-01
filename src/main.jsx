import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './ErrorBoundary.jsx';
// import reportVitals from './reportVitals.js'; // Temporarily disabled until analytics endpoint implemented
import { useServiceWorkerUpdates } from './hooks/useServiceWorkerUpdates.js';
import UpdateToast from './components/UpdateToast.jsx';

function Root() {
  const { updateReady, acceptUpdate, dismiss } = useServiceWorkerUpdates();
  return (
    <StrictMode>
      <ErrorBoundary>
        <App />
        {updateReady && (
          <UpdateToast
            onReload={acceptUpdate}
            onDismiss={dismiss}
          />
        )}
      </ErrorBoundary>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')).render(<Root />);

// if (import.meta.env.PROD) reportVitals(); // Disabled: add backend endpoint then re-enable
