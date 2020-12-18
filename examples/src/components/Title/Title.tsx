import React from 'react'


export const Title: React.SFC = (props) => {
  const {
    children,
  } = props

  return (
    <h3>
      {children}
    </h3>
  )
}
