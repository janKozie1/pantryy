import '@testing-library/jest-dom'

import {render} from '@testing-library/svelte'

import TestComponent from './TestComponent.svelte'

test.skip('renders inputs', () => {
  const { getByRole } = render(TestComponent, {
    props: {
      props: {
        onCancel: (): null => null,
        onSuccess: (): null => null,
        open: false,
        initialValues: {
          name: 'product_name'
        }
      }
    }
  })
  expect(getByRole('button')).toBeInTheDocument()
})
