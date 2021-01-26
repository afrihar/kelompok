import React, { Component } from 'react'
import { withKeycloak } from '@react-keycloak/web'
import { Button, Container, Form } from 'semantic-ui-react'
import { kelompokApi } from '../../util/KelompokApi'
import { handleLogError, isKecamatan, isKota, isProvinsi, isPusdatin } from '../../util/Helpers'
import { Redirect } from 'react-router-dom'
import ConfirmationModal from '../../util/ConfirmationModal'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

class KelurahanDetail extends Component {
  formInitialState = {
    kecamatan: { kodeKecamatan: '' },
    kodeKelurahan: '',
    kodeKelurahanCapil: '',
    namaKelurahan: '',
    kodePos: '',
    namaKelompokKelurahan: '',
    kodeKelurahanError: false,
    kodeKelurahanCapilError: false,
    namaKelurahanError: false,
    kecamatanError: false
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
    deleteKelurahan: null,
    kecamatanOptions: [],
    readOnly: true,
    isLoadingForm: false
  }

  async componentDidMount () {
    this.setState({ isLoadingForm: true })
    const { keycloak } = this.props
    try {
      const getKecamatanOptions = await kelompokApi.getKelurahanOptionsKecamatan(keycloak.token)
      const kecamatanOptions = getKecamatanOptions.data
      this.setState({ kecamatanOptions })
    } catch (error) {
      toast.error(error.request.response)
      handleLogError(error)
    }
    const param = this.props.match.params.kodeKelurahan
    if (param === 'tambah') {
      this.setState({ form: { ...this.formInitialState }, readOnly: false }
      )
    } else {
      try {
        const response = await kelompokApi.getKelurahanByKode(param, keycloak.token)
        const kelurahan = response.data
        const form = {
          kecamatan: { kodeKecamatan: kelurahan.kecamatan.kodeKecamatan },
          kodeKelurahan: kelurahan.kodeKelurahan,
          kodeKelurahanCapil: kelurahan.kodeKelurahanCapil,
          namaKelurahan: kelurahan.namaKelurahan,
          kodePos: kelurahan.kodePos,
          namaKelompokKelurahan: kelurahan.namaKelompokKelurahan,
          kodeKelurahanError: false,
          kodeKelurahanCapilError: false,
          namaKelurahanError: false
        }
        this.setState({ form })
      } catch (error) {
        handleLogError(error)
        this.props.history.push('/kelurahan')
      }
    }
    this.setState({ isLoadingForm: false })
  }

  isValidForm = async () => {
    const form = { ...this.state.form }
    let kodeKelurahanError = false
    let kodeKelurahanCapilError = false
    let namaKelurahanError = false
    let kecamatanError = false
    form.kodeKelurahanError = kodeKelurahanError
    form.kodeKelurahanCapilError = kodeKelurahanCapilError
    form.namaKelurahanError = namaKelurahanError
    form.kecamatanError = kecamatanError
    if (form.kodeKelurahan.trim() === '') {
      kodeKelurahanError = true
      form.kodeKelurahanError = { pointing: 'below', content: 'Kode Kelurahan harus diisi' }
    } else if (form.kodeKelurahan.length !== 10) {
      kodeKelurahanError = true
      form.kodeKelurahanError = { pointing: 'below', content: 'Kode Kelurahan harus 10 digit' }
    } else if (form.kecamatan.kodeKecamatan !== form.kodeKelurahan.substr(0, 7)) {
      kodeKelurahanError = true
      form.kodeKelurahanError = {
        pointing: 'below',
        content: 'Kode Kelurahan harus diawali dengan ' + form.kecamatan.kodeKecamatan
      }
    } else {
      if (this.props.match.params.kodeKelurahan === 'tambah') {
        try {
          const { keycloak } = this.props
          const response = await kelompokApi.getKelurahanByKode(form.kodeKelurahan, keycloak.token)
          const kelurahan = response.data
          kodeKelurahanError = true
          form.kodeKelurahanError = {
            pointing: 'below',
            content: 'Kode Kelurahan sudah terpakai oleh Kelurahan ' + kelurahan.namaKelurahan
          }
        } catch (error) {
          handleLogError(error)
          kodeKelurahanError = false
          form.kodeKelurahanError = false
        }
      }
    }
    if (form.kodeKelurahanCapil.trim() === '') {
      kodeKelurahanCapilError = true
      form.kodeKelurahanCapilError = { pointing: 'below', content: 'Kode Kelurahan Kemendagri harus diisi' }
    } else if (form.kodeKelurahanCapil.length !== 10) {
      kodeKelurahanCapilError = true
      form.kodeKelurahanCapilError = { pointing: 'below', content: 'Kode Kelurahan Kemendagri harus 10 digit' }
    } else {
      if (this.props.match.params.kodeKelurahan === 'tambah') {
        try {
          const { keycloak } = this.props
          const response = await kelompokApi.getKelurahanByKodeCapil(form.kodeKelurahanCapil, keycloak.token)
          const kelurahan = response.data
          kodeKelurahanCapilError = true
          form.kodeKelurahanCapilError = {
            pointing: 'below',
            content: 'Kode Kelurahan Capil sudah terpakai oleh Kelurahan ' + kelurahan.namaKecamatan
          }
        } catch (error) {
          handleLogError(error)
          kodeKelurahanCapilError = false
          form.kodeKelurahanCapilError = false
        }
      }
    }
    if (form.namaKelurahan.trim() === '') {
      namaKelurahanError = true
      form.namaKelurahanError = { pointing: 'below', content: 'Nama Kelurahan harus diisi' }
    }
    if (form.kecamatan.kodeKecamatan.trim() === '') {
      kecamatanError = true
      form.kecamatanError = { pointing: 'below', content: 'Kecamatan harus dipilih' }
    }
    this.setState({ form })
    return (!(kodeKelurahanError || kodeKelurahanCapilError || namaKelurahanError || kecamatanError))
  }
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props
      const { deleteKelurahan } = this.state
      try {
        await kelompokApi.deleteKelurahan(deleteKelurahan.kodeKelurahan, keycloak.token)
        toast.info(<div><p>Kelurahan {deleteKelurahan.namaKelurahan} telah dihapus, Mohon Tunggu...</p>
        </div>, { onClose: () => this.props.history.push('/kelurahan') })
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
  handleChange = (e) => {
    const { id, value } = e.target
    const form = { ...this.state.form }
    form[id] = value
    this.setState({ form })
  }
  handleChangeToUpperCase = (e) => {
    const re = /^[a-zA-Z ]+$/
    if (e.target.value === '' || re.test(e.target.value)) {
      const { id, value } = e.target
      const form = { ...this.state.form }
      form[id] = value.toUpperCase()
      this.setState({ form })
    }
  }
  handleChangeNumber = (e) => {
    const re = /^[0-9\b]+$/
    if (e.target.value === '' || re.test(e.target.value)) {
      const { id, value } = e.target
      const form = { ...this.state.form }
      form[id] = value
      this.setState({ form })
    }
  }
  handleChangeDropdown = (e, { value }) => {
    const form = { ...this.state.form }
    form.kecamatan.kodeKecamatan = value
    form.kecamatanError = false
    if (this.props.match.params.kodeKelurahan === 'tambah') {
      form.kodeKelurahan = value
      form.kodeKelurahanCapil = value
    }
    this.setState({ form })
  }
  handleSaveKelurahan = async () => {
    if (!await this.isValidForm()) {
      return
    }
    this.setState({ isLoadingForm: true })
    const { keycloak } = this.props
    const { kodeKelurahan, kodeKelurahanCapil, namaKelurahan, kecamatan } = this.state.form
    const kelurahan = { kodeKelurahan, kodeKelurahanCapil, namaKelurahan, kecamatan }
    try {
      await kelompokApi.saveKelurahan(kelurahan, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        { onClose: () => this.props.history.push('/kelurahan') })
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Kode Kelurahan</p>
      </div>, { onClose: () => this.setState({ isLoadingForm: false }) })
      handleLogError(error)
    }
  }
  handleDeleteKelurahan = (kelurahan) => {
    this.setState({ isLoadingForm: true })
    const modal = {
      isOpen: true,
      header: 'Hapus Kelurahan',
      content: `Apakah anda yakin akan menghapus Kelurahan '${kelurahan.namaKelurahan}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({ modal, deleteKelurahan: kelurahan })
  }

  render () {
    const { keycloak } = this.props
    const { isLoadingForm, modal, form, readOnly, kecamatanOptions } = this.state
    if (isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak) || isKecamatan(keycloak)) {
      return (
        <Container className={'isi'} text>
          <Form loading={isLoadingForm}>
            <Form.Field required>
              <label>Kecamatan</label>
              <Form.Dropdown
                placeholder='Kecamatan'
                noResultsMessage='Tidak ada nama Kecamatan...'
                onChange={this.handleChangeDropdown}
                search
                disabled={readOnly}
                options={kecamatanOptions}
                error={form.kecamatanError}
                selection
                clearable
                value={form.kecamatan.kodeKecamatan === '' ? undefined : form.kecamatan.kodeKecamatan}
              />
            </Form.Field>
            <Form.Field required>
              <label>Kode Kelurahan (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnly}
                placeholder='Kode Kelurahan'
                maxLength='10'
                id='kodeKelurahan'
                error={form.kodeKelurahanError}
                onChange={this.handleChangeNumber}
                value={form.kodeKelurahan}/>
            </Form.Field>
            <Form.Field required>
              <label>Kode Kelurahan (Kemendagri)</label>
              <Form.Input
                fluid
                placeholder='Kode Kelurahan (Kemendagri)'
                error={form.kodeKelurahanCapilError}
                maxLength='10'
                id='kodeKelurahanCapil'
                onChange={this.handleChangeNumber}
                value={form.kodeKelurahanCapil}/>
            </Form.Field>
            <Form.Field required>
              <label>Nama Kelurahan</label>
              <Form.Input
                fluid
                placeholder='Nama Kelurahan'
                id='namaKelurahan'
                error={form.namaKelurahanError}
                onChange={this.handleChangeToUpperCase}
                value={form.namaKelurahan}/>
            </Form.Field>
            <Form.Field>
              <label>Kode Pos</label>
              <Form.Input
                fluid
                placeholder='Kode Pos'
                id='kodePos'
                maxLength='5'
                onChange={this.handleChangeNumber}
                value={form.kodePos}/>
            </Form.Field>
            <Form.Field>
              <label>Nama Kelompok Dasawisma</label>
              <Form.Input
                fluid
                placeholder='Nama Kelompok'
                id='namaKelompok'
                onChange={this.handleChange}
                value={form.namaKelompokKelurahan}/>
            </Form.Field>
            {(this.props.match.params.kodeKelurahan !== 'tambah') ?
              <Button
                negative
                floated='left'
                onClick={() => this.handleDeleteKelurahan(form)}>Hapus</Button> : <></>}
            <Button
              positive
              floated='right'
              type='submit'
              onClick={this.handleSaveKelurahan}>Simpan</Button>
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
      return <Redirect to='/kelurahan'/>
    }
  }
}

export default withKeycloak(KelurahanDetail)