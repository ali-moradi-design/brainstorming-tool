import { render, screen } from '@testing-library/react';
import { Button } from './Button';

it('uses the default size unless the caller passes its own height or padding', () => {
  render(
    <>
      <Button>plain</Button>
      <Button className="w-9 px-0">icon</Button>
      <Button className="h-7 px-2 text-xs">small</Button>
    </>,
  );
  const classes = (name: string) => screen.getByRole('button', { name }).className.split(' ');

  expect(classes('plain')).toEqual(expect.arrayContaining(['h-9', 'px-3']));
  expect(classes('icon')).toEqual(expect.arrayContaining(['h-9', 'px-0']));
  expect(classes('icon')).not.toContain('px-3');
  expect(classes('small')).toEqual(expect.arrayContaining(['h-7', 'px-2']));
  expect(classes('small')).not.toContain('h-9');
});
