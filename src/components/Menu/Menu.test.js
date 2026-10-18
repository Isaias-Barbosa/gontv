import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Menu from './index';
import { useAuth } from 'context/AuthContext';
jest.mock('context/AuthContext');
jest.mock('components/Search', () => () => null);
jest.mock('hamburger-react', () => () => <span>Menu</span>);
beforeEach(() => { window.innerWidth = 1200; });
test.each([
  [{ role: 'admin' }, 'Dashboard', '/admin'],
  [{ role: 'editor' }, 'Perfil', '/profile/meuperfil'],
  [{ role: 'user' }, 'Perfil', '/profile/meuperfil'],
  [null, 'Login', '/login'],
])('menu desktop respeita o perfil da sessão %j', (user, label, path) => {
  useAuth.mockReturnValue({ user, loading: false });
  render(<MemoryRouter><Menu /></MemoryRouter>);
  expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', path);
  if (user?.role !== 'admin') expect(screen.queryByRole('link', { name: 'Dashboard' })).not.toBeInTheDocument();
});
test.each([
  [{ role: 'admin' }, 'Dashboard', '/admin'],
  [{ role: 'editor' }, 'Perfil', '/profile/meuperfil'],
])('menu móvel mantém o acesso correto para %j', (user, label, path) => {
  window.innerWidth = 375;
  useAuth.mockReturnValue({ user, loading: false });
  render(<MemoryRouter><Menu /></MemoryRouter>);
  fireEvent.click(screen.getByRole('button', { name: 'Abrir menu' }));
  expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', path);
});
test('não mostra Login enquanto a sessão está sendo verificada', () => {
  useAuth.mockReturnValue({ user: null, loading: true });
  render(<MemoryRouter><Menu /></MemoryRouter>);
  expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();
});
