import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('@/store/useUserStore', () => ({
  useUserStore: () => ({
    user: {
      id: '1'
    }
  })
}));

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
  useGetProfileQuery: () => ({
    data: {
      getProfile: {
        id: '1',
        phoneNumber: '123-456-7890',
        description: 'Test description'
      }
    },
    loading: false,
    error: null,
  }),
  useGetCancelationRateQuery: () => ({
    data: {
      getCancelationRate: "Taux moyen"
    },
    loading: false,
    error: null,
  }),
  // Ajoutez cette ligne pour le hook manquant
  useGetReviewsByUserQuery: () => ({
    data: {
      getReviewsByUser: []
    },
    loading: false,
    error: null,
  })
}));

test('renders user profile page correctly', async () => {
  const {default: UserProfilePage} = await import('../UserProfilePage');
  render(<UserProfilePage />);
  
  await waitFor(() => {
    expect(screen.getAllByText("Mon profil").length).toBeGreaterThan(0);
    
    const emailElements = screen.getAllByTestId("user-email");
    expect(emailElements.length).toBeGreaterThan(0);
    expect(emailElements[0]).toHaveTextContent("john.doe@gmail.com");
  });
});