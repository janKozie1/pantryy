import '@testing-library/jest-dom'
import { mergeFieldErrors, setInitialValues } from './form'

describe('form', () => {
  const addTextInput = (node: HTMLFormElement, type: string, name: string) =>{
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('name', name);

    node.appendChild(input);

    return input
  }

  const addRadioInput = (node: HTMLFormElement, name: string, value: string) =>{
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', name);
    input.setAttribute('value', value);

    node.appendChild(input);

    return input
  }

  const getSimpleForm = () => {
    const form = document.createElement('form');

    const email = addTextInput(form, 'text', 'email');
    const password = addTextInput(form, 'password', 'password');
    const optionA = addRadioInput(form, 'options', 'optionA');
    const optionB = addRadioInput(form, 'options', 'optionB');

    return {form, inputs: {email, password, optionA, optionB}};
  }

  describe('mergeFieldErrors', () => {
    it('merges', () => {
      expect(mergeFieldErrors(
        {a: null, b: undefined, c: "error"},
        {a: 1, b: undefined, c: null}
      )).toEqual({a: 1, b: undefined, c: null});

      expect(mergeFieldErrors(
        {a: null, b: undefined, c: "error"},
        {a: 1, b: "error"}
      )).toEqual({a: 1, b: "error", c: "error"})

      expect(mergeFieldErrors(
        {a: null, b: undefined, c: "error"},
        {}
      )).toEqual({a: null, b: undefined, c: "error"})

      expect(mergeFieldErrors(
        {a: "error1", b: "error1", c: "error1"},
        {a: "error2", b: "error2", c: "error2"}
      )).toEqual({a: "error2", b: "error2", c: "error2"})
    })
  })

  describe('setInitialValues', () => {
    it('sets default values', () => {
      const {form, inputs} = getSimpleForm();

      expect(inputs.email).toHaveDisplayValue('');
      expect(inputs.password).toHaveDisplayValue('');
      expect(inputs.optionA).not.toBeChecked();
      expect(inputs.optionB).not.toBeChecked();

      setInitialValues(form ,{
        email: "asdf",
        password: "x",
        options: "optionB"
      })

      expect(inputs.email).toHaveDisplayValue('asdf');
      expect(inputs.password).toHaveDisplayValue('x');
      expect(inputs.optionA).not.toBeChecked();
      expect(inputs.optionB).toBeChecked();
    })
  })
})
