import React, { Component } from 'react'
import { Button, Container, Form } from 'semantic-ui-react'
import { kelompokApi } from '../../util/KelompokApi'
import { handleLogError, isPusdatin } from '../../util/Helpers'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmationModal from '../../util/ConfirmationModal'
import { Redirect } from 'react-router-dom'
import { withKeycloak } from '@react-keycloak/web'

class ProvinsiDetail extends Component {
  formInitialState = {
    kodeProvinsi: '',
    kodeProvinsiCapil: '',
    namaProvinsi: '',
    kodeProvinsiError: false,
    kodeProvinsiCapilError: false,
    namaProvinsiError: false
  }
  modalInitialState = {
    isOpen: false,
    header: '',
    content: '',
    onAction: null,
    onClose: null
  }
  state = {
    modal: { ...this.modalInitialState },
    form: { ...this.formInitialState },
    deleteProvinsi: null,
    readOnly: true,
    isLoadingForm: false
  }

  async componentDidMount () {
    this.setState({ isLoadingForm: true })
    const param = this.props.match.params.kodeProvinsi
    if (param === 'tambah') {
      this.setState({ form: { ...this.formInitialState }, readOnly: false }
      )
    } else {
      const { keycloak } = this.props
      try {
        const response = await kelompokApi.getProvinsiByKode(param, keycloak.token)
        const provinsi = response.data
        const form = {
          kodeProvinsi: provinsi.kodeProvinsi,
          kodeProvinsiCapil: provinsi.kodeProvinsiCapil,
          namaProvinsi: provinsi.namaProvinsi,
          kodeProvinsiError: false,
          kodeProvinsiCapilError: false,
          namaProvinsiError: false
        }
        this.setState({ provinsi, form })
      } catch (error) {
        handleLogError(error)
        this.props.history.push('/provinsi')
      }
    }
    this.setState({ isLoadingForm: false })
  }

  isValidForm = async () => {
    const form = { ...this.state.form }
    let kodeProvinsiError = false
    let kodeProvinsiCapilError = false
    let namaProvinsiError = false
    form.kodeProvinsiError = kodeProvinsiError
    form.kodeProvinsiCapilError = kodeProvinsiCapilError
    form.namaProvinsiError = namaProvinsiError
    if (form.kodeProvinsi.trim() === '') {
      kodeProvinsiError = true
      form.kodeProvinsiError = { pointing: 'below', content: 'Kode Provinsi harus diisi' }
    } else if (form.kodeProvinsi.length !== 2) {
      kodeProvinsiError = true
      form.kodeProvinsiError = { pointing: 'below', content: 'Kode Provinsi harus 2 digit' }
    } else {
      if (this.props.match.params.kodeProvinsi === 'tambah') {
        try {
          const { keycloak } = this.props
          const response = await kelompokApi.getProvinsiByKode(form.kodeProvinsi, keycloak.token)
          const provinsi = response.data
          kodeProvinsiError = true
          form.kodeProvinsiError = {
            pointing: 'below',
            content: 'Kode Provinsi sudah terpakai oleh Provinsi ' + provinsi.namaProvinsi
          }
        } catch (error) {
          handleLogError(error)
          form.kodeProvinsiError = false
          kodeProvinsiError = false
        }
      }
    }
    if (form.kodeProvinsiCapil.trim() === '') {
      kodeProvinsiCapilError = true
      form.kodeProvinsiCapilError = { pointing: 'below', content: 'Kode Provinsi Kemendagri harus diisi' }
    } else if (form.kodeProvinsiCapil.length !== 2) {
      kodeProvinsiCapilError = true
      form.kodeProvinsiCapilError = { pointing: 'below', content: 'Kode Provinsi Kemendagri harus 2 digit' }
    } else {
      try {
        if (this.props.match.params.kodeProvinsi === 'tambah') {
          const { keycloak } = this.props
          const response = await kelompokApi.getProvinsiByKodeCapil(form.kodeProvinsiCapil, keycloak.token)
          const provinsi = response.data
          kodeProvinsiCapilError = true
          form.kodeProvinsiCapilError = {
            pointing: 'below',
            content: 'Kode Provinsi Capil sudah terpakai oleh Provinsi ' + provinsi.namaProvinsi
          }
        }
      } catch (error) {
        handleLogError(error)
        kodeProvinsiCapilError = false
        form.kodeProvinsiCapilError = false
      }
    }
    if (form.namaProvinsi.trim() === '') {
      namaProvinsiError = true
      form.namaProvinsiError = { pointing: 'below', content: 'Nama Provinsi harus diisi' }
    }
    this.setState({ form })
    return (!(kodeProvinsiError || kodeProvinsiCapilError || namaProvinsiError))
  }
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props
      const { deleteProvinsi } = this.state
      try {
        await kelompokApi.deleteProvinsi(deleteProvinsi.kodeProvinsi, keycloak.token)
        toast.info(<div><p>Provinsi {deleteProvinsi.namaProvinsi} telah dihapus, Mohon Tunggu...</p>
        </div>, { onClose: () => this.props.history.push('/provinsi') })
      } catch (error) {
        toast.error(error.request.response, { onClose: () => this.setState({ isLoadingForm: false }) })
        handleLogError(error)
      }
    } else {
      this.setState({ isLoadingForm: false })
    }
    this.setState({ modal: { ...this.modalInitialState } })
  }
  handleCloseModal = () => {
    this.setState({ modal: { ...this.modalInitialState }, isLoadingForm: false })
  }
  handleChangeToUpperCase = (e) => {
    const re = /^[a-zA-Z ]+$/
    if (
      e.target.value === '' || re.test(e.target.value)) {
      const { id, value } = e.target
      const form = { ...this.state.form }
      form[id] = value.toUpperCase()
      this.setState({ form })
    }
  }
  handleChangeNumber = (e) => {
    const re = /^[0-9\b]+$/
    if (
      e.target.value === '' || re.test(e.target.value)) {
      const { id, value } = e.target
      const form = { ...this.state.form }
      form[id] = value
      this.setState({ form })
    }
  }
  handleSaveProvinsi = async () => {
    if (!await this.isValidForm()) {
      return
    }
    this.setState({ isLoadingForm: true })
    const { keycloak } = this.props
    const { kodeProvinsi, kodeProvinsiCapil, namaProvinsi } = this.state.form
    const provinsi = { kodeProvinsi, kodeProvinsiCapil, namaProvinsi }
    try {
      await kelompokApi.saveProvinsi(provinsi, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        { onClose: () => this.props.history.push('/provinsi') })
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Kode Provinsi</p>
      </div>, { onClose: () => this.setState({ isLoadingForm: false }) })
      handleLogError(error)
    }
  }
  handleDeleteProvinsi = (provinsi) => {
    this.setState({ isLoadingForm: true })
    const modal = {
      isOpen: true,
      header: 'Hapus Provinsi',
      content: `Apakah anda yakin akan menghapus Provinsi '${provinsi.namaProvinsi}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({ modal, deleteProvinsi: provinsi })
  }

  render () {
    const { keycloak } = this.props
    const { isLoadingForm, modal, form, readOnly } = this.state
    if (isPusdatin(keycloak)) {
      return (
        <Container className={'isi'} text>
          <Form loading={isLoadingForm}>
            <Form.Field required>
              <label>Kode Provinsi (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnly}
                placeholder='Kode Provinsi'
                id='kodeProvinsi'
                maxLength="2"
                error={form.kodeProvinsiError}
                onChange={this.handleChangeNumber}
                value={form.kodeProvinsi}/>
            </Form.Field>
            <Form.Field required>
              <label>Kode Provinsi (Kemendagri)</label>
              <Form.Input
                fluid
                placeholder='Kode Provinsi (Kemendagri)'
                error={form.kodeProvinsiCapilError}
                id='kodeProvinsiCapil'
                maxLength="2"
                onChange={this.handleChangeNumber}
                value={form.kodeProvinsiCapil}/>
            </Form.Field>
            <Form.Field required>
              <label>Nama Provinsi</label>
              <Form.Input
                fluid
                placeholder='Nama Provinsi'
                id='namaProvinsi'
                error={form.namaProvinsiError}
                onChange={this.handleChangeToUpperCase}
                value={form.namaProvinsi}/>
            </Form.Field>
            {(this.props.match.params.kodeProvinsi !== 'tambah') ? <Button
              negative
              floated='left'
              onClick={() => this.handleDeleteProvinsi(form)}>Hapus</Button> : <></>}
            <Button
              positive
              floated='right'
              type='submit'
              onClick={this.handleSaveProvinsi}>Simpan</Button>
          </Form>
          <ConfirmationModal modal={modal}/>
          <ToastContainer
            position="top-center"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover/>
        </Container>
      )
    } else {
      return <Redirect to='/provinsi'/>
    }
  }
}

export default withKeycloak(ProvinsiDetail)