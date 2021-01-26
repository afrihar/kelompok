import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

function ConfirmationModal ({ modal }) {
  const { isOpen, header, content, onClose, onAction } = modal
  return (
    <Modal size='tiny' open={isOpen} onClose={onClose}>
      <Modal.Header>{header}</Modal.Header>
      <Modal.Content>
        <p>{content}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button
          negative
          icon='x'
          content='Tidak'
          onClick={() => onAction(false)}
        />
        <Button
          positive
          icon={'check'}
          labelPosition='right'
          content='Ya'
          onClick={() => onAction(true)}
        />
      </Modal.Actions>
    </Modal>
  )
}

export default ConfirmationModal