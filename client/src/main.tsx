import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { trpc, trpcClient } from './trpc';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Modal from './components/Modal';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      <QueryClientProvider client={queryClient}>
        <App />
        <Modal />
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>
);