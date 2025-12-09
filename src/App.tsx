import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Home } from '@/pages/Home/Home';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import '@/styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Home />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
