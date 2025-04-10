// UserProfilePage.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';


vi.mock('react-router-dom', () => {
  return {
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('@/graphql/hooks', () => ({
  useGetUserByIdQuery: () => ({
    data: {
      getUserById: {
        id: '1',
        firstname: 'John',
        lastname: 'Doe',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/John_Doe%2C_born_John_Nommensen_Duchac.jpg/800px-John_Doe%2C_born_John_Nommensen_Duchac.jpg',
        email: 'john.doe@gmail.com'
      },
    },
    loading: false,
    error: null,
  }),
}));


test('renders user data in About component', async () => {

    const {default: UserProfilePage} = await import('../UserProfilePage');
    render(<UserProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });