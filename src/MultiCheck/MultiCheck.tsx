import './MultiCheck.css';

import React, { ChangeEvent, useState } from 'react';
import {FC} from 'react';

export type Option = {
  label: string,
  value: string
}

/**
 * Notice:
 * 1. There should be a special `Select All` option with checkbox to control all passing options
 * 2. If columns > 1, the options should be placed from top to bottom in each column
 *
 * @param {string} label - the label text of this component
 * @param {Option[]} options - options. Assume no duplicated labels or values
 * @param {string[]} values - If `undefined`, makes the component in uncontrolled mode with no options checked;
 *                            if not undefined, makes the component to controlled mode with corresponding options checked.
 *                            Assume no duplicated values.
 * @param {number} columns - default value is 1, and assume it can only be [1, 2, ... 9]
 * @param {Function} onChange - if not undefined, when checked options are changed, they should be passed to outside;
 *                              if undefined, the options can still be selected, but won't notify the outside
 */
type Props = {
  label?: string,
  options: Option[],
  columns?: number,
  values?: string[],
  onChange?: (options: Option[]) => void,
}

export const defaultLabel: string = 'MultiCheck'
export const allChecked: Option = { label: 'Select All', value: '000', }
/**
 * convert options with props.columns
 * @param props - component props
 * @returns option groups
 */
const formatOptions: (props: Props) => Option[][] = (props: Props) => {
  const arr = Array(props.columns || 1)
  const optionGroup = []
  const options = [allChecked, ...props.options]
  let start = 0
  
  for (let index = 0; index < options.length; index++) {
    const key = props.columns ? (index % props.columns) : 0
    if (arr[key]) {
      arr[key].push(index)
    } else {
      arr[key] = [index]
    }
  }

  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    const num = element.length + start
    optionGroup.push(options.slice(start, num))
    start += element.length
  }
  return optionGroup
}

export const MultiCheck: FC<Props> = (props): JSX.Element => {
  const optionGroup = formatOptions(props)
  const [values, setValues] = useState<string[]>(props.values || [])

  const handleClick = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, value } = event.target
    const { onChange, options } = props
    let newValues: string[] = []
    
    if (value === allChecked.value) {
      if (checked) {
        newValues = options.map(option => option.value)
      }
    } else {
      if (checked) {
        newValues = [...values, value]
      } else {
        newValues = values.filter(v => v !== value)
      }
    }
    
    const newOptions = options.filter(option => newValues.includes(option.value))
    
    if (newOptions.length === options.length) {
      newValues.push(allChecked.value)
    } else {
      newValues = newValues.filter(v => v !== allChecked.value)
    }
    setValues(newValues)
    if (onChange) {
      onChange(newOptions)
    }
  }

  const renderCheckbox = (option: Option) => {
    const checked = values.includes(option.value)
    return <div className="item" key={option.value}>
      <label>
        <input type="checkbox" value={option.value} data-testid={option.label} checked={checked} onChange={(e) => handleClick(e)} />
        {option.label}
      </label>
    </div>
  }

  return <div className='MultiCheck'>
    <div className="label" data-testid="label">
      {props.label || defaultLabel}
    </div>
    <div className="container">
      {optionGroup.map((options, index) => {
        return <div className="column" data-testid="column" key={index}>
          {options.map(option => renderCheckbox(option))}
        </div>
      })}
    </div>
  </div>
}
