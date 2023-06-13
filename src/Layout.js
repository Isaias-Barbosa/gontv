import Menu from 'components/Menu'
import Rodape from 'components/Rodape'
import React from 'react'

export default function Layout({ children }) {
    return (
        <>
          <Menu />
          {children}
          <Rodape />
       </>
  )
}
