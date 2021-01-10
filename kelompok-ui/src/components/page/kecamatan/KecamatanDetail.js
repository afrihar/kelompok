import React, {Component} from 'react'
import {withKeycloak} from "@react-keycloak/web";
import {Button, Container, Form} from "semantic-ui-react";
import {kelompokApi} from "../../util/KelompokApi";
import {handleLogError, isKota, isPusdatin} from "../../util/Helpers";
import {Redirect} from "react-router-dom";
import ConfirmationModal from "../../util/ConfirmationModal";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

class KecamatanDetail extends Component {
  formInitialState = {
    id: '',
    masterKota: {kodeKota: ''},
    kodeKecamatan: '',
    kodeKecamatanCapil: '',
    namaKecamatan: '',
    kodeKecamatanError: false,
    kodeKecamatanCapilError: false,
    namaKecamatanError: false,
    masterKotaError: false
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
    deleteKecamatan: null,
    kotaOptions: [],
    readOnly: true,
    isLoadingForm: false
  }

  async componentDidMount() {
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    try {
      const getKotaIdName = await kelompokApi.getKotaOptions(keycloak.token)
      const kotaOptions = getKotaIdName.data
      this.setState({kotaOptions})
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
        const response = await kelompokApi.getKecamatanById(param, keycloak.token)
        const kecamatan = response.data
        const form = {
          id: kecamatan.id,
          masterKota: {kodeKota: kecamatan.masterKota.kodeKota},
          kodeKecamatan: kecamatan.kodeKecamatan,
          kodeKecamatanCapil: kecamatan.kodeKecamatanCapil,
          namaKecamatan: kecamatan.namaKecamatan,
          idKecamatanError: false,
          kodeKecamatanError: false,
          kodeKecamatanCapilError: false,
          namaKecamatanError: false
        }
        this.setState({form})
      } catch (error) {
        handleLogError(error)
        this.props.history.push("/kecamatan");
      }
    }
    this.setState({isLoadingForm: false})
  }

  isValidForm = () => {
    const form = {...this.state.form}
    let kodeKecamatanError = false
    let kodeKecamatanCapilError = false
    let namaKecamatanError = false
    let masterKotaError = false
    form.kodeKecamatanError = kodeKecamatanError
    form.kodeKecamatanCapilError = kodeKecamatanCapilError
    form.namaKecamatanError = namaKecamatanError
    form.masterKotaError = masterKotaError
    if (form.kodeKecamatan.trim() === '') {
      kodeKecamatanError = true
      form.kodeKecamatanError = {pointing: 'below', content: 'Kode Kecamatan harus diisi'}
    } else if (form.kodeKecamatan.length !== 7) {
      kodeKecamatanError = true
      form.kodeKecamatanError = {pointing: 'below', content: 'Kode Kecamatan harus 7 digit'}
    }
    if (form.kodeKecamatanCapil.trim() === '') {
      kodeKecamatanCapilError = true
      form.kodeKecamatanCapilError = {pointing: 'below', content: 'Kode Kecamatan Capil harus diisi'}
    } else if (form.kodeKecamatanCapil.length !== 7) {
      kodeKecamatanCapilError = true
      form.kodeKecamatanCapilError = {pointing: 'below', content: 'Kode Kecamatan Capil harus 7 digit'}
    }
    if (form.namaKecamatan.trim() === '') {
      namaKecamatanError = true
      form.namaKecamatanError = {pointing: 'below', content: 'Nama Kecamatan harus diisi'}
    }
    if (form.masterKota.kodeKota.trim() === '') {
      masterKotaError = true
      form.masterKotaError = {pointing: 'below', content: 'Kota harus dipilih'}
    }
    this.setState({form})
    return (!(kodeKecamatanError || kodeKecamatanCapilError || namaKecamatanError || masterKotaError))
  }
  handleActionModal = async (response) => {
    if (response) {
      const {keycloak} = this.props
      const {deleteKecamatan} = this.state
      try {
        await kelompokApi.deleteKecamatan(deleteKecamatan.id, keycloak.token)
        toast.info(<div><p>Kecamatan {deleteKecamatan.namaKecamatan} telah dihapus, Mohon Tunggu...</p>
        </div>, {onClose: () => this.props.history.push("/kecamatan")});
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
    form.masterKota.kodeKota = value
    form.masterKotaError = false
    if (this.props.match.params.id === 'tambah') {
      form.kodeKecamatan = value
      form.kodeKecamatanCapil = value
    }
    this.setState({form})
  }
  handleSaveKecamatan = async () => {
    if (!this.isValidForm()) {
      return
    }
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    const {id, kodeKecamatan, kodeKecamatanCapil, namaKecamatan, masterKota} = this.state.form
    const kecamatan = {id, kodeKecamatan, kodeKecamatanCapil, namaKecamatan, masterKota}
    try {
      await kelompokApi.saveKecamatan(kecamatan, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        {onClose: () => this.props.history.push("/kecamatan")});
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Kode Kecamatan</p>
      </div>, {onClose: () => this.setState({isLoadingForm: false})})
      handleLogError(error)
    }
  }
  handleDeleteKecamatan = (kecamatan) => {
    this.setState({isLoadingForm: true})
    const modal = {
      isOpen: true,
      header: 'Hapus Kecamatan',
      content: `Apakah anda yakin akan menghapus Kecamatan '${kecamatan.namaKecamatan}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({modal, deleteKecamatan: kecamatan})
  }

  render() {
    const {keycloak} = this.props
    const {isLoadingForm, modal, form, readOnly, kotaOptions} = this.state
    if (isPusdatin(keycloak) || isKota(keycloak)) {
      return (
        <Container className={'content'} text>
          <Form loading={isLoadingForm}>
            <Form.Field>
              <Form.Input
                fluid
                readOnly
                label='Id Kecamatan'
                id='id'
                placeholder={'ID Akan dibentuk oleh Sistem'}
                onChange={this.handleChangeNumber}
                value={form.id}/>
            </Form.Field>
            <Form.Field required>
              <label>Kota</label>
              <Form.Dropdown
                placeholder='Kota'
                noResultsMessage='Tidak ada nama Kota...'
                onChange={this.handleChangeDropdown}
                search
                options={kotaOptions}
                error={form.masterKotaError}
                selection
                clearable
                value={form.masterKota.kodeKota === '' ? undefined : form.masterKota.kodeKota}
              />
            </Form.Field>
            <Form.Field required>
              <label>Kode Kecamatan (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnly}
                placeholder='Kode Kecamatan'
                maxLength='7'
                id='kodeKecamatan'
                error={form.kodeKecamatanError}
                onChange={this.handleChangeNumber}
                value={form.kodeKecamatan}/>
            </Form.Field>
            <Form.Field required>
              <label>Kode Kecamatan (Kemendagri)</label>
              <Form.Input
                fluid
                placeholder='Kode Kecamatan (Kemendagri)'
                error={form.kodeKecamatanCapilError}
                maxLength='7'
                id='kodeKecamatanCapil'
                onChange={this.handleChangeNumber}
                value={form.kodeKecamatanCapil}/>
            </Form.Field>
            <Form.Field required>
              <label>Nama Kecamatan</label>
              <Form.Input
                fluid
                placeholder='Nama Kecamatan'
                id='namaKecamatan'
                error={form.namaKecamatanError}
                onChange={this.handleChangeToUpperCase}
                value={form.namaKecamatan}/>
            </Form.Field>
            {form.id ?
              <Button
                negative
                floated='left'
                onClick={() => this.handleDeleteKecamatan(form)}>Hapus</Button> : <></>}
            <Button
              positive
              floated='right'
              type='submit'
              onClick={this.handleSaveKecamatan}>Simpan</Button>
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
      return <Redirect to='/kecamatan'/>
    }
  }
}

export default withKeycloak(KecamatanDetail)