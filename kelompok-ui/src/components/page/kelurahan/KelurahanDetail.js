import React, {Component} from 'react'
import {withKeycloak} from "@react-keycloak/web";
import {Button, Container, Form} from "semantic-ui-react";
import {kelompokApi} from "../../util/KelompokApi";
import {handleLogError, isKecamatan, isPusdatin} from "../../util/Helpers";
import {Redirect} from "react-router-dom";
import ConfirmationModal from "../../util/ConfirmationModal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class KelurahanDetail extends Component {
  formInitialState = {
    id: '',
    masterKecamatan: {kodeKecamatan: ''},
    kodeKelurahan: '',
    kodeKelurahanCapil: '',
    namaKelurahan: '',
    kodePos: '',
    namaKelompok: '',
    kodeKelurahanError: false,
    kodeKelurahanCapilError: false,
    namaKelurahanError: false,
    masterKecamatanError: false
  }
  modalInitialState = {
    isOpen: false,
    header: '',
    content: '',
    onAction: null,
    onClose: null
  }
  state = {
    modal: {...this.modalInitialState},
    form: {...this.formInitialState},
    deleteKelurahan: null,
    kecamatanOptions: [],
    readOnly: true,
    isLoadingForm: false
  }

  async componentDidMount() {
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    try {
      const getKecamatanIdName = await kelompokApi.getKecamatanOptions(keycloak.token)
      const kecamatanOptions = getKecamatanIdName.data
      this.setState({kecamatanOptions})
    } catch (error) {
      toast.error(error.request.response);
      handleLogError(error)
    }
    const param = this.props.match.params.id
    if (param === 'tambah') {
      this.setState({form: {...this.formInitialState}, readOnly: false}
      )
    } else {
      try {
        const response = await kelompokApi.getKelurahanById(param, keycloak.token)
        const kelurahan = response.data
        const form = {
          id: kelurahan.id,
          masterKecamatan: {kodeKecamatan: kelurahan.masterKecamatan.kodeKecamatan},
          kodeKelurahan: kelurahan.kodeKelurahan,
          kodeKelurahanCapil: kelurahan.kodeKelurahanCapil,
          namaKelurahan: kelurahan.namaKelurahan,
          kodePos: kelurahan.kodePos,
          namaKelompok: kelurahan.namaKelompok,
          idKelurahanError: false,
          kodeKelurahanError: false,
          kodeKelurahanCapilError: false,
          namaKelurahanError: false
        }
        this.setState({form})
      } catch (error) {
        handleLogError(error)
        this.props.history.push("/kelurahan");
      }
    }
    this.setState({isLoadingForm: false})
  }

  isValidForm = () => {
    const form = {...this.state.form}
    let kodeKelurahanError = false
    let kodeKelurahanCapilError = false
    let namaKelurahanError = false
    let masterKecamatanError = false
    form.kodeKelurahanError = kodeKelurahanError
    form.kodeKelurahanCapilError = kodeKelurahanCapilError
    form.namaKelurahanError = namaKelurahanError
    form.masterKecamatanError = masterKecamatanError
    if (form.kodeKelurahan.trim() === '') {
      kodeKelurahanError = true
      form.kodeKelurahanError = {pointing: 'below', content: 'Kode Kelurahan harus diisi'}
    } else if (form.kodeKelurahan.length !== 10) {
      kodeKelurahanError = true
      form.kodeKelurahanError = {pointing: 'below', content: 'Kode Kelurahan harus 10 digit'}
    }
    if (form.kodeKelurahanCapil.trim() === '') {
      kodeKelurahanCapilError = true
      form.kodeKelurahanCapilError = {pointing: 'below', content: 'Kode Kelurahan Capil harus diisi'}
    } else if (form.kodeKelurahanCapil.length !== 10) {
      kodeKelurahanCapilError = true
      form.kodeKelurahanCapilError = {pointing: 'below', content: 'Kode Kelurahan Capil harus 10 digit'}
    }
    if (form.namaKelurahan.trim() === '') {
      namaKelurahanError = true
      form.namaKelurahanError = {pointing: 'below', content: 'Nama Kelurahan harus diisi'}
    }
    if (form.masterKecamatan.kodeKecamatan.trim() === '') {
      masterKecamatanError = true
      form.masterKecamatanError = {pointing: 'below', content: 'Kecamatan harus dipilih'}
    }
    this.setState({form})
    return (!(kodeKelurahanError || kodeKelurahanCapilError || namaKelurahanError || masterKecamatanError))
  }
  handleActionModal = async (response) => {
    if (response) {
      const {keycloak} = this.props
      const {deleteKelurahan} = this.state
      try {
        await kelompokApi.deleteKelurahan(deleteKelurahan.id, keycloak.token)
        toast.info(<div><p>Kelurahan {deleteKelurahan.namaKelurahan} telah dihapus, Mohon Tunggu...</p>
        </div>, {onClose: () => this.props.history.push("/kelurahan")});
      } catch (error) {
        toast.error(error.request.response, {onClose: () => this.setState({isLoadingForm: false})});
        handleLogError(error)
      }
    } else {
      this.setState({isLoadingForm: false})
    }
    this.setState({modal: {...this.modalInitialState}})
  }
  handleCloseModal = () => {
    this.setState({modal: {...this.modalInitialState}, isLoadingForm: false})
  }
  handleChange = (e) => {
    const {id, value} = e.target
    const form = {...this.state.form}
    form[id] = value
    this.setState({form})
  }
  handleChangeToUpperCase = (e) => {
    const re = /^[a-zA-Z ]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      const {id, value} = e.target
      const form = {...this.state.form}
      form[id] = value.toUpperCase()
      this.setState({form})
    }
  }
  handleChangeNumber = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      const {id, value} = e.target
      const form = {...this.state.form}
      form[id] = value
      this.setState({form})
    }
  }
  handleChangeDropdown = (e, {value}) => {
    const form = {...this.state.form}
    form.masterKecamatan.kodeKecamatan = value
    form.masterKecamatanError = false
    if (this.props.match.params.id === 'tambah') {
      form.kodeKelurahan = value
      form.kodeKelurahanCapil = value
    }
    this.setState({form})
  }
  handleSaveKelurahan = async () => {
    if (!this.isValidForm()) {
      return
    }
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    const {id, kodeKelurahan, kodeKelurahanCapil, namaKelurahan, masterKecamatan} = this.state.form
    const kelurahan = {id, kodeKelurahan, kodeKelurahanCapil, namaKelurahan, masterKecamatan}
    try {
      await kelompokApi.saveKelurahan(kelurahan, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        {onClose: () => this.props.history.push("/kelurahan")});
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Kode Kelurahan</p>
      </div>, {onClose: () => this.setState({isLoadingForm: false})})
      handleLogError(error)
    }
  }
  handleDeleteKelurahan = (kelurahan) => {
    this.setState({isLoadingForm: true})
    const modal = {
      isOpen: true,
      header: 'Hapus Kelurahan',
      content: `Apakah anda yakin akan menghapus Kelurahan '${kelurahan.namaKelurahan}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({modal, deleteKelurahan: kelurahan})
  }

  render() {
    const {keycloak} = this.props
    const {isLoadingForm, modal, form, readOnly, kecamatanOptions} = this.state
    if (isPusdatin(keycloak) || isKecamatan(keycloak)) {
      return (
        <Container className={'content'} text>
          <Form loading={isLoadingForm}>
            <Form.Field>
              <label>Id Kelurahan</label>
              <Form.Input
                fluid
                readOnly
                id='id'
                placeholder={'ID Akan dibentuk oleh Sistem'}
                onChange={this.handleChangeNumber}
                value={form.id}/>
            </Form.Field>
            <Form.Field required>
              <label>Kecamatan</label>
              <Form.Dropdown
                placeholder='Kecamatan'
                noResultsMessage='Tidak ada nama Kecamatan...'
                onChange={this.handleChangeDropdown}
                search
                options={kecamatanOptions}
                error={form.masterKecamatanError}
                selection
                clearable
                value={form.masterKecamatan.kodeKecamatan === '' ? undefined : form.masterKecamatan.kodeKecamatan}
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
                maxLength='7'
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
                onChange={this.handleChangeNumber}
                value={form.kodePos}/>
            </Form.Field>
            <Form.Field>
              <label>Nama Kelompok</label>
              <Form.Input
                fluid
                placeholder='Nama Kelompok'
                id='namaKelompok'
                onChange={this.handleChange}
                value={form.namaKelompok}/>
            </Form.Field>
            {form.id ?
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