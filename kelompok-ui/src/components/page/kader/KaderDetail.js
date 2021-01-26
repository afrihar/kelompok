import React, { Component } from 'react'
import { withKeycloak } from '@react-keycloak/web'
import { kelompokApi } from '../../util/KelompokApi'
import { toast, ToastContainer } from 'react-toastify'
import {
  getPrefixKader,
  handleLogError,
  isKecamatan,
  isKelurahan,
  isKota,
  isProvinsi,
  isPusdatin,
  isRt,
  isRw,
  noKader
} from '../../util/Helpers'
import { Redirect } from 'react-router-dom'
import { Button, Container, Form } from 'semantic-ui-react'
import ConfirmationModal from '../../util/ConfirmationModal'

class KaderDetail extends Component {
  formInitialState = {
    noKader: '',
    petugas: { nik: '' },
    rt: { kodeRt: '' },
    rw: { kodeRw: '' },
    kelurahan: { kodeKelurahan: '' },
    kecamatan: { kodeKecamatan: '' },
    kota: { kodeKota: '' },
    noKaderError: false
  }
  modalInitialState = {
    isOpen: false,
    header: '',
    content: '',
    onAction: null,
    onClose: null
  }
  state = {
    isLoadingForm: false,
    isLoadingKecamatan: false,
    isLoadingKelurahan: false,
    isLoadingRw: false,
    isLoadingRt: false,
    isLoadingPetugas: false,
    modal: { ...this.modalInitialState },
    form: { ...this.formInitialState },
    deleteKader: null,
    kotaOptions: [],
    kecamatanOptions: [],
    kelurahanOptions: [],
    rwOptions: [],
    rtOptions: [],
    petugasOptions: [],
    readOnly: true,
    readOnlyNoKader: true,
    kodeKotaUser: '0'
  }

  async componentDidMount () {
    this.setState({ isLoadingForm: true })
    const { keycloak } = this.props
    if (isKota(keycloak)) this.setState({ kodeKotaUser: keycloak.tokenParsed['kode_wilayah'].toString() })
    else if (isKecamatan(keycloak) || isKelurahan(keycloak) || isRw(keycloak) || isRt(keycloak))
      this.setState({ kodeKotaUser: keycloak.tokenParsed['kode_wilayah'].toString().substr(0, 4) })
    try {
      const getOptionsKota = await kelompokApi.getKaderOptionsKota(keycloak.token)
      const kotaOptions = getOptionsKota.data
      this.setState({ kotaOptions })
    } catch (error) {
      toast.error(error.request.response)
      handleLogError(error)
    }
    const param = this.props.match.params.noKader
    if (param === 'tambah') {
      const form = { ...this.state.form }
      form.noKader = getPrefixKader(this.state.kodeKotaUser)
      this.setState({ form, readOnly: false, readOnlyNoKader: false })
    } else {
      try {
        const response = await kelompokApi.getKaderByNoKader(param, keycloak.token)
        const kader = response.data
        let form = { ...this.formInitialState }
        form.noKader = kader.noKader
        if (kader.rt !== null) {
          const getOptionsKecamatan = await kelompokApi.getKaderOptionsKecamatan(kader.rt.rw.kelurahan.kecamatan.kota.kodeKota, keycloak.token)
          const kecamatanOptions = getOptionsKecamatan.data
          const getOptionsKelurahan = await kelompokApi.getKaderOptionsKelurahan(kader.rt.rw.kelurahan.kecamatan.kodeKecamatan, keycloak.token)
          const kelurahanOptions = getOptionsKelurahan.data
          const getOptionsRw = await kelompokApi.getKaderOptionsRw(kader.rt.rw.kelurahan.kodeKelurahan, keycloak.token)
          const rwOptions = getOptionsRw.data
          const getOptionsRt = await kelompokApi.getKaderOptionsRt(kader.rt.rw.kodeRw, keycloak.token)
          const rtOptions = getOptionsRt.data
          const getOptionsPetugas = await kelompokApi.getKaderOptionsPetugas(kader.rt.kodeRt, keycloak.token)
          const petugasOptions = getOptionsPetugas.data
          form = {
            noKader: kader.noKader,
            kota: { kodeKota: kader.rt.rw.kelurahan.kecamatan.kota.kodeKota },
            kecamatan: { kodeKecamatan: kader.rt.rw.kelurahan.kecamatan.kodeKecamatan },
            kelurahan: { kodeKelurahan: kader.rt.rw.kelurahan.kodeKelurahan },
            rw: { kodeRw: kader.rt.rw.kodeRw },
            rt: { kodeRt: kader.rt.kodeRt },
            petugas: { nik: kader.petugas ? kader.petugas.nik : '' },
            noKaderError: false
          }
          this.setState({ kecamatanOptions, kelurahanOptions, rwOptions, rtOptions, petugasOptions })
        } else {
          this.setState({ readOnly: false })
        }
        this.setState({ form })
      } catch (error) {
        handleLogError(error)
        this.props.history.push('/kader')
      }
    }
    this.setState({ isLoadingForm: false })
  }

  isValidForm = async () => {
    const form = { ...this.state.form }
    let noKaderError = false
    let rtError = false
    form.noKaderError = noKaderError
    form.rtError = rtError
    if (form.noKader.trim() === '') {
      noKaderError = true
      form.noKaderError = { pointing: 'below', content: 'Nomor Kader harus diisi' }
    } else if (form.noKader.length !== 6) {
      noKaderError = true
      form.noKaderError = { pointing: 'below', content: 'Nomor Kader harus 6 digit' }
    } else {
      if (this.props.match.params.noKader === 'tambah') {
        const { keycloak } = this.props
        if (noKader.test(form.noKader)) {
          if ((form.kota.kodeKota !== '') && (form.noKader.substr(0, 1) !== getPrefixKader(form.kota.kodeKota))) {
            noKaderError = true
            form.noKaderError = {
              pointing: 'below',
              content: 'No Kader harus diawali huruf ' + getPrefixKader(form.kota.kodeKota)
            }
          } else {
            try {
              await kelompokApi.getKaderByNoKader(form.noKader, keycloak.token)
              noKaderError = true
              form.noKaderError = {
                pointing: 'below',
                content: 'Nomor Kader sudah tersedia'
              }
            } catch (error) {
              noKaderError = false
              form.noKaderError = noKaderError
            }
          }
        } else {
          noKaderError = true
          form.noKaderError = {
            pointing: 'below',
            content: 'Format Nomor Kader tidak sesuai ketentuan'
          }
        }
      }
    }
    if (form.rt.kodeRt.trim() === '') {
      rtError = true
      form.rtError = { pointing: 'above', content: 'RT harus dipilih' }
    }
    this.setState({ form })
    return (!(noKaderError || rtError))
  }
  handleChangeNoKader = (e) => {
    const { id, value } = e.target
    const form = { ...this.state.form }
    form[id] = value
    this.setState({ form })
  }
  handleChangeDropdownKota = async (e, { value }) => {
    this.setState({ isLoadingKecamatan: true })
    try {
      const form = { ...this.state.form }
      form.kota.kodeKota = value
      const { keycloak } = this.props
      const getOptionsKecamatan = await kelompokApi.getKaderOptionsKecamatan(value, keycloak.token)
      const kecamatanOptions = getOptionsKecamatan.data
      this.setState({ form, kecamatanOptions, kelurahanOptions: [], rwOptions: [], rtOptions: [], petugasOptions: [] })
    } catch (error) {
      toast.error(error.request.response)
      handleLogError(error)
    }
    this.setState({ isLoadingKecamatan: false })
  }
  handleChangeDropdownKecamatan = async (e, { value }) => {
    this.setState({ isLoadingKelurahan: true })
    try {
      const form = { ...this.state.form }
      form.kecamatan.kodeKecamatan = value
      const { keycloak } = this.props
      const getOptionsKelurahan = await kelompokApi.getKaderOptionsKelurahan(value, keycloak.token)
      const kelurahanOptions = getOptionsKelurahan.data
      this.setState({ form, kelurahanOptions, rwOptions: [], rtOptions: [], petugasOptions: [] })
    } catch (error) {
      toast.error(error.request.response)
      handleLogError(error)
    }
    this.setState({ isLoadingKelurahan: false })
  }
  handleChangeDropdownKelurahan = async (e, { value }) => {
    this.setState({ isLoadingRw: true })
    try {
      const form = { ...this.state.form }
      form.kelurahan.kodeKelurahan = value
      const { keycloak } = this.props
      const getOptionsRw = await kelompokApi.getKaderOptionsRw(value, keycloak.token)
      const rwOptions = getOptionsRw.data
      this.setState({ form, rwOptions, rtOptions: [], petugasOptions: [] })
    } catch (error) {
      toast.error(error.request.response)
      handleLogError(error)
    }
    this.setState({ isLoadingRw: false })
  }
  handleChangeDropdownRw = async (e, { value }) => {
    this.setState({ isLoadingRt: true })
    try {
      const form = { ...this.state.form }
      form.rw.kodeRw = value
      const { keycloak } = this.props
      const getOptionsRt = await kelompokApi.getKaderOptionsRt(value, keycloak.token)
      const rtOptions = getOptionsRt.data
      this.setState({ form, rtOptions, petugasOptions: [] })
    } catch (error) {
      toast.error(error.request.response)
      handleLogError(error)
    }
    this.setState({ isLoadingRt: false })
  }
  handleChangeDropdownRt = async (e, { value }) => {
    this.setState({ isLoadingPetugas: true })
    try {
      const form = { ...this.state.form }
      form.rt.kodeRt = value
      const { keycloak } = this.props
      const getOptionsPetugas = await kelompokApi.getKaderOptionsPetugas(value, keycloak.token)
      const petugasOptions = getOptionsPetugas.data
      this.setState({ form, petugasOptions })
    } catch (error) {
      toast.error(error.request.response)
      handleLogError(error)
    }
    this.setState({ isLoadingPetugas: false })
  }
  handleChangeDropdownPetugas = (e, { value }) => {
    const form = { ...this.state.form }
    form.petugas.nik = value
    this.setState({ form })
  }
  handleSaveKader = async () => {
    if (!await this.isValidForm()) {
      return
    }
    this.setState({ isLoadingForm: true })
    let kader
    if (this.state.form.petugas.nik === '') {
      const { noKader, rt } = this.state.form
      kader = { noKader, rt }
    } else {
      const { noKader, petugas, rt } = this.state.form
      kader = { noKader, petugas, rt }
    }
    try {
      const { keycloak } = this.props
      await kelompokApi.saveKader(kader, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        { onClose: () => this.props.history.push('/kader') })
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Kode Kader</p>
      </div>, { onClose: () => this.setState({ isLoadingForm: false }) })
      handleLogError(error)
    }
  }
  handleDeleteKader = (kader) => {
    this.setState({ isLoadingForm: true })
    const modal = {
      isOpen: true,
      header: 'Hapus Kader',
      content: `Apakah anda yakin akan menghapus Ketua dasawisma No '${kader.noKader}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({ modal, deleteKader: kader })
  }
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props
      const { deleteKader } = this.state
      try {
        await kelompokApi.deleteKader(deleteKader.noKader, keycloak.token)
        toast.info(<div><p>Kader {deleteKader.noKader} telah dihapus, Mohon Tunggu...</p>
        </div>, { onClose: () => this.props.history.push('/kader') })
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

  render () {
    const { keycloak } = this.props
    const {
      isLoadingForm,
      isLoadingKecamatan,
      isLoadingKelurahan,
      isLoadingRw,
      isLoadingRt,
      modal,
      form,
      readOnly,
      readOnlyNoKader,
      kotaOptions,
      kecamatanOptions,
      kelurahanOptions,
      rwOptions,
      rtOptions,
      petugasOptions
    } = this.state
    if (isPusdatin(keycloak)
      || isProvinsi(keycloak)
      || isKota(keycloak)
      || isKecamatan(keycloak)
      || isKelurahan(keycloak)
      || isRw(keycloak)
      || isRt(keycloak)) {
      return (
        <Container className={'isi'} text>
          <Form loading={isLoadingForm}>
            <Form.Field required>
              <label>Nomor Kader (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnlyNoKader}
                placeholder='Nomor Kader'
                maxLength='6'
                id='noKader'
                error={form.noKaderError}
                onChange={this.handleChangeNoKader}
                value={form.noKader}/>
            </Form.Field>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Kota</label>
                <Form.Dropdown
                  placeholder='Kota'
                  noResultsMessage='Tidak ada Kota...'
                  onChange={this.handleChangeDropdownKota}
                  disabled={readOnly}
                  search
                  options={kotaOptions}
                  selection
                  value={form.kota.kodeKota === '' ? undefined : form.kota.kodeKota}
                />
              </Form.Field>
              <Form.Field>
                <label>Kecamatan</label>
                <Form.Dropdown
                  placeholder='Kecamatan'
                  noResultsMessage='Tidak ada Kecamatan...'
                  onChange={this.handleChangeDropdownKecamatan}
                  disabled={readOnly}
                  search
                  options={kecamatanOptions}
                  selection
                  loading={isLoadingKecamatan}
                  value={form.kecamatan.kodeKecamatan === '' ? undefined : form.kecamatan.kodeKecamatan}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Kelurahan</label>
                <Form.Dropdown
                  placeholder='Kelurahan'
                  noResultsMessage='Tidak ada Kelurahan...'
                  onChange={this.handleChangeDropdownKelurahan}
                  disabled={readOnly}
                  search
                  options={kelurahanOptions}
                  selection
                  loading={isLoadingKelurahan}
                  value={form.kelurahan.kodeKelurahan === '' ? undefined : form.kelurahan.kodeKelurahan}
                />
              </Form.Field>
            </Form.Group>
            <Form.Group widths='equal'>
              <Form.Field>
                <label>Rw</label>
                <Form.Dropdown
                  placeholder='Rw'
                  noResultsMessage='Tidak ada Rw...'
                  onChange={this.handleChangeDropdownRw}
                  disabled={readOnly}
                  search
                  options={rwOptions}
                  selection
                  loading={isLoadingRw}
                  value={form.rw.kodeRw === '' ? undefined : form.rw.kodeRw}
                />
              </Form.Field>
              <Form.Field required>
                <label>Rt</label>
                <Form.Dropdown
                  placeholder='Rt'
                  noResultsMessage='Tidak ada Rt...'
                  onChange={this.handleChangeDropdownRt}
                  disabled={readOnly}
                  search
                  options={rtOptions}
                  selection
                  error={form.rtError}
                  loading={isLoadingRt}
                  value={form.rt.kodeRt === '' ? undefined : form.rt.kodeRt}
                />
              </Form.Field>
            </Form.Group>
            <Form.Field>
              <label>Petugas</label>
              <Form.Dropdown
                placeholder='Petugas'
                noResultsMessage='Tidak ada Petugas...'
                onChange={this.handleChangeDropdownPetugas}
                search
                options={petugasOptions}
                selection
                clearable
                value={form.petugas.nik === '' ? undefined : form.petugas.nik}
              />
            </Form.Field>
            {(this.props.match.params.noKader !== 'tambah') ?
              <Button
                negative
                floated='left'
                onClick={() => this.handleDeleteKader(form)}>Hapus</Button> : <></>}
            <Button
              positive
              floated='right'
              type='submit'
              onClick={this.handleSaveKader}>Simpan</Button>
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
      return <Redirect to='/kader'/>
    }
  }
}

export default withKeycloak(KaderDetail)