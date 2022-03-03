import React from 'react'
import { MultiCheck, defaultLabel, Option, allChecked } from './MultiCheck'
import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

const mockLabel: string = 'MockLabel'
const mockOptions: Option[] = [
  { label: 'mockLabel0', value: 'mockValue0' },
  { label: 'mockLabel1', value: 'mockValue1' },
  { label: 'mockLabel2', value: 'mockValue2' }
]
const columns: number = 2
const randomOption: () => Option = () => {
  const length = mockOptions.length
  const index = Math.floor(Math.random() * length)
  return mockOptions[index]
}

describe('MultiCheck', () => {
  describe('initialize', () => {
    it('renders the label if label provided', () => {
      render(<MultiCheck label={mockLabel} options={[]} />)

      expect(screen.getByTestId('label').innerHTML).toEqual(mockLabel)
    })

    it('renders the default label if label is undefined', () => {
      render(<MultiCheck options={[]} />)

      expect(screen.getByTestId('label').innerHTML).toEqual(defaultLabel)
    })

    it('renders the options', () => {
      render(<MultiCheck options={mockOptions} />)

      for (let i = 0; i < mockOptions.length; i++) {
        const element = mockOptions[i]
        expect(screen.getByTestId(element.label)).toBeInTheDocument()
      }
      expect(screen.getByTestId(allChecked.label)).toBeInTheDocument()
    })

    it('renders default values', () => {
      const random: Option = randomOption()
      render(<MultiCheck values={[random.value]} options={mockOptions} />)

      expect(screen.getByTestId(random.label)).toBeChecked()
      expect(screen.getByTestId(allChecked.label)).not.toBeChecked()
    })

    it('renders column', () => {
      render(<MultiCheck options={mockOptions} columns={columns} />)
      
      expect(screen.getAllByTestId('column').length).toEqual(columns)
    })
  })

  describe('interactive', () => {
    it('changes checked', () => {
      render(<MultiCheck options={mockOptions} />)
      const random = randomOption()
      const randomCheckbox = screen.getByTestId(random.label)

      fireEvent.click(randomCheckbox)
      expect(randomCheckbox).toBeChecked()


      fireEvent.click(randomCheckbox)
      expect(randomCheckbox).not.toBeChecked()

      // test selectAll checked
      for (let i = 0; i < mockOptions.length; i++) {
        const element = mockOptions[i]
        fireEvent.click(screen.getByTestId(element.label))
        expect(screen.getByTestId(element.label)).toBeChecked()
      }
      expect(screen.getByTestId(allChecked.label)).toBeChecked()
      
      // test selectAll unchecked
      const random2 = randomOption()
      const randomCheckbox2 = screen.getByTestId(random2.label)

      fireEvent.click(randomCheckbox2)
      expect(screen.getByTestId(allChecked.label)).not.toBeChecked()
    })

    it('changes selected all', () => {
      render(<MultiCheck values={[randomOption().value]} options={mockOptions} />)
      const checkboxForAll = screen.getByTestId(allChecked.label)

      fireEvent.click(checkboxForAll)
      expect(checkboxForAll).toBeChecked()
      for (let i = 0; i < mockOptions.length; i++) {
        const element = mockOptions[i]
        expect(screen.getByTestId(element.label)).toBeChecked()
      }

      fireEvent.click(checkboxForAll)
      expect(checkboxForAll).not.toBeChecked()
      for (let i = 0; i < mockOptions.length; i++) {
        const element = mockOptions[i]
        expect(screen.getByTestId(element.label)).not.toBeChecked()
      }
    })

    it('calls onChange event', () => {
      const onChange = jest.fn()
      render(<MultiCheck onChange={onChange} options={mockOptions} />)

      fireEvent.click(screen.getByTestId(mockOptions[0].label))
      expect(onChange).toHaveBeenCalledTimes(1)
    })
  })
})
