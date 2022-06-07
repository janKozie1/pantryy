import '@testing-library/jest-dom'

import {render} from '@testing-library/svelte'

import Button from './Button.svelte'

test('shows proper heading when rendered', () => {
  const { getByRole } = render(Button, { type: 'submit', color: 'primary', fill: 'filled', size: 'lg' })
  expect(getByRole('button')).toBeInTheDocument()
})
