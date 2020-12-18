import React from 'react'


export const Keypress: React.SFC = ({ children, ...props }) => {
  return (
    <div>
      {children}
    </div>
  )
}

export const KeyPad: React.SFC = (props) => {
  const {
    children,
  } = props

  return (
    <div>
      <span>press</span>

      <div>{children}</div>

      <span>to try! 🍭</span>
    </div>
  )
}
