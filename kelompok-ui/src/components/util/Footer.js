import React, { Component } from 'react'
import { Container, Menu } from 'semantic-ui-react'

class Footer extends Component {
  render () {
    return (
      <Menu fixed={'bottom'}>
        <Container>
          <Menu.Item disabled>
            Copyright 2021 &copy; Pusdatin Keluarga
          </Menu.Item>
        </Container>
      </Menu>
    )
  }
}

export default Footer