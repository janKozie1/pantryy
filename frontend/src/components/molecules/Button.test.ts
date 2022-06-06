import '@testing-library/jest-dom'

import {render} from '@testing-library/svelte'

import Button from './Button.svelte'

test('shows proper heading when rendered', () => {
  const {getByText} = render(Button, {name: 'World'})

  expect(getByText('Hello World!')).toBeInTheDocument()
})
