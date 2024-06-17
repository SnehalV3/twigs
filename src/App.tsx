import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient();
import Form from "./feature/profile/components";
import { Toastr } from '@sparrowengg/twigs-react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toastr duration={2000} />
      <Form />
      <ReactQueryDevtools initialIsOpen={false} />

    </QueryClientProvider>
  );
};

export default App;
