import React, {Component} from 'react'
import {withKeycloak} from "@react-keycloak/web";
import {Button, Container, Form} from "semantic-ui-react";
import {kelompokApi} from "../../util/KelompokApi";
import {handleLogError, isProvinsi, isPusdatin} from "../../util/Helpers";
import {Redirect} from "react-router-dom";
import ConfirmationModal from "../../util/ConfirmationModal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class KotaDetail extends Component {
  formInitialState = {
    id: '',
    masterProvinsi: {kodeProvinsi: ''},
    kodeKota: '31',
    kodeKotaCapil: '31',
    namaKota: '',
    kodeKotaError: false,
    kodeKotaCapilError: false,
    namaKotaError: false,
    masterProvinsiError: false
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
    deleteKota: null,
    provinsiOptions: [],
    readOnly: true,
    isLoadingForm: false
  }

  async componentDidMount() {
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    try {
      const getProvinsiOptions = await kelompokApi.getProvinsiOptions(keycloak.token)
      const provinsiOptions = getProvinsiOptions.data
      this.setState({provinsiOptions})
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
        const response = await kelompokApi.getKotaById(param, keycloak.token)
        const kota = response.data
        const form = {
          id: kota.id,
          kodeKota: kota.kodeKota,
          kodeKotaCapil: kota.kodeKotaCapil,
          namaKota: kota.namaKota,
          masterProvinsi: {kodeProvinsi: kota.masterProvinsi.kodeProvinsi},
          idKotaError: false,
          kodeKotaError: false,
          kodeKotaCapilError: false,
          namaKotaError: false
        }
        this.setState({form})
      } catch (error) {
        handleLogError(error)
        this.props.history.push("/kota");
      }
    }
    this.setState({isLoadingForm: false})
  }

  isValidForm = () => {
    const form = {...this.state.form}
    let kodeKotaError = false
    let kodeKotaCapilError = false
    let namaKotaError = false
    let masterProvinsiError = false
    form.kodeKotaError = kodeKotaError
    form.kodeKotaCapilError = kodeKotaCapilError
    form.namaKotaError = namaKotaError
    form.masterProvinsiError = masterProvinsiError
    if (form.kodeKota.trim() === '') {
      kodeKotaError = true
      form.kodeKotaError = {pointing: 'below', content: 'Kode Kota harus diisi'}
    } else if (form.kodeKota.length !== 4) {
      kodeKotaError = true
      form.kodeKotaError = {pointing: 'below', content: 'Kode Kota harus 4 digit'}
    }
    if (form.kodeKotaCapil.trim() === '') {
      kodeKotaCapilError = true
      form.kodeKotaCapilError = {pointing: 'below', content: 'Kode Kota Capil harus diisi'}
    } else if (form.kodeKotaCapil.length !== 4) {
      kodeKotaCapilError = true
      form.kodeKotaCapilError = {pointing: 'below', content: 'Kode Kota Capil harus 4 digit'}
    }
    if (form.namaKota.trim() === '') {
      namaKotaError = true
      form.namaKotaError = {pointing: 'below', content: 'Nama Kota harus diisi'}
    }
    this.setState({form})
    return (!(kodeKotaError || kodeKotaCapilError || namaKotaError || masterProvinsiError))
  }
  handleActionModal = async (response) => {
    if (response) {
      const {keycloak} = this.props
      const {deleteKota} = this.state
      try {
        await kelompokApi.deleteKota(deleteKota.id, keycloak.token)
        toast.info(<div><p>Kota {deleteKota.namaKota} telah dihapus, Mohon Tunggu...</p>
        </div>, {onClose: () => this.props.history.push("/kota")});
      } catch (error) {
        toast.error(error.request.response, {onClose: () => this.setState({isLoadingForm: false})});
        handleLogError(error)
      }
    }else{
      this.setState({isLoadingForm: false})
    }
    this.setState({modal: {...this.modalInitialState}})
  }
  handleCloseModal = () => {
    this.setState({modal: {...this.modalInitialState}, isLoadingForm: false})
  }
  handleChangeToUpperCase = (e) => {
    const re = /^[a-zA-Z ]+$/;
    if (
      e.target.value === '' || re.test(e.target.value)) {
      const {id, value} = e.target
      const form = {...this.state.form}
      form[id] = value.toUpperCase()
      this.setState({form})
    }
  }
  handleChangeNumber = (e) => {
    const re = /^[0-9\b]+$/;
    if (
      e.target.value === '' || re.test(e.target.value)) {
      const {id, value} = e.target
      const form = {...this.state.form}
      form[id] = value
      this.setState({form})
    }
  }
  handleChangeDropdown = (e, {value}) => {
    const form = {...this.state.form}
    form.masterProvinsi.kodeProvinsi = value
    if (this.props.match.params.id === 'tambah') {
      form.kodeKota = value
      form.kodeKotaCapil = value
    }
    this.setState({form})
  }
  handleSaveKota = async () => {
    if (!this.isValidForm()) {
      return
    }
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    const {id, kodeKota, kodeKotaCapil, namaKota, masterProvinsi} = this.state.form
    const kota = {id, kodeKota, kodeKotaCapil, namaKota, masterProvinsi}
    try {
      await kelompokApi.saveKota(kota, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        {onClose: () => this.props.history.push("/kota")});
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Kode Kota</p>
      </div>, {onClose: () => this.setState({isLoadingForm: false})})
      handleLogError(error)
    }
  }
  handleDeleteKota = (kota) => {
    this.setState({isLoadingForm: true})
    const modal = {
      isOpen: true,
      header: 'Hapus Kota',
      content: `Apakah anda yakin akan menghapus Kota '${kota.namaKota}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({modal, deleteKota: kota})
  }

  render() {
    const {keycloak} = this.props
    const {isLoadingForm, modal, form, readOnly, provinsiOptions} = this.state
    if (isPusdatin(keycloak) || isProvinsi(keycloak)) {
      return (
        <Container className={'content'} text>
          <Form loading={isLoadingForm}>
            <Form.Field>
              <Form.Input
                fluid
                readOnly
                label='Id Kota'
                id='id'
                placeholder={'ID Akan dibentuk oleh Sistem'}
                onChange={this.handleChangeNumber}
                value={form.id}/>
            </Form.Field>
            <Form.Field required>
              <label>Provinsi</label>
              <Form.Dropdown
                placeholder='Provinsi'
                noResultsMessage='Tidak ada nama Provinsi...'
                onChange={this.handleChangeDropdown}
                search
                options={provinsiOptions}
                error={form.masterProvinsiError}
                selection
                value={form.masterProvinsi.kodeProvinsi === '' ? '31' : form.masterProvinsi.kodeProvinsi}
              />
            </Form.Field>
            <Form.Field required>
              <label>Kode Kota (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnly}
                placeholder='Kode Kota'
                maxLength="4"
                id='kodeKota'
                error={form.kodeKotaError}
                onChange={this.handleChangeNumber}
                value={form.kodeKota}>
              </Form.Input>
            </Form.Field>
            <Form.Field required>
              <label>Kode Kota (Kemendagri)</label>
              <Form.Input
                fluid
                placeholder='Kode Kota (Kemendagri)'
                error={form.kodeKotaCapilError}
                maxLength="4"
                id='kodeKotaCapil'
                onChange={this.handleChangeNumber}
                value={form.kodeKotaCapil}/>
            </Form.Field>
            <Form.Field required>
              <label>Nama Kota</label>
              <Form.Input
                fluid
                placeholder='Nama Kota'
                id='namaKota'
                error={form.namaKotaError}
                onChange={this.handleChangeToUpperCase}
                value={form.namaKota}/>
            </Form.Field>
            {form.id ?
              <Button
                negative
                floated='left'
                onClick={() => this.handleDeleteKota(form)}>Hapus</Button> : <></>}
            <Button
              positive
              floated='right'
              type='submit'
              onClick={this.handleSaveKota}>Simpan</Button>
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
      return <Redirect to='/kota'/>
    }
  }
}

export default withKeycloak(KotaDetail)