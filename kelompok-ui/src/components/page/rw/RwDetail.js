import React, {Component} from "react";
import {withKeycloak} from "@react-keycloak/web";
import {handleLogError, isKelurahan, isPusdatin} from "../../util/Helpers";
import {Redirect} from "react-router-dom";
import {kelompokApi} from "../../util/KelompokApi";
import {toast, ToastContainer} from "react-toastify";
import {Button, Container, Form} from "semantic-ui-react";
import ConfirmationModal from "../../util/ConfirmationModal";

class RwDetail extends Component {
  formInitialState = {
    id: '',
    masterKelurahan: {kodeKelurahan: ''},
    kodeRw: '',
    labelRw: '',
    namaKetuaRw: '',
    noHpRw: '',
    noTelpRw: '',
    noTelpRwAlt: '',
    kodeRwError: false,
    labelRwError: false,
    masterKelurahanError: false
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
    deleteRw: null,
    kelurahanOptions: [],
    readOnly: true,
    isLoadingForm: false
  }

  async componentDidMount() {
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    try {
      const getKelurahanOptions = await kelompokApi.getKelurahanOptions(keycloak.token)
      const kelurahanOptions = getKelurahanOptions.data
      this.setState({kelurahanOptions})
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
        const response = await kelompokApi.getRwById(param, keycloak.token)
        const rw = response.data
        const form = {
          id: rw.id,
          masterKelurahan: {kodeKelurahan: rw.masterKelurahan.kodeKelurahan},
          kodeRw: rw.kodeRw,
          labelRw: rw.labelRw,
          namaKetuaRw: rw.namaKetuaRw,
          noHpRw: rw.noHpRw,
          noTelpRw: rw.noTelpRw,
          noTelpRwAlt: rw.noTelpRwAlt,
          kodeRwError: false,
          labelRwError: false
        }
        this.setState({form})
      } catch (error) {
        handleLogError(error)
        this.props.history.push("/rw");
      }
    }
    this.setState({isLoadingForm: false})
  }

  isValidForm = () => {
    const form = {...this.state.form}
    let kodeRwError = false
    let labelRwError = false
    let masterKelurahanError = false
    form.kodeRwError = kodeRwError
    form.labelRwError = labelRwError
    form.masterKelurahanError = masterKelurahanError
    if (form.kodeRw.trim() === '') {
      kodeRwError = true
      form.kodeRwError = {pointing: 'below', content: 'Kode Rw harus diisi'}
    } else if (form.kodeRw.length !== 13) {
      kodeRwError = true
      form.kodeRwError = {pointing: 'below', content: 'Kode Rw harus 13 digit'}
    }
    if (form.labelRw.trim() === '') {
      labelRwError = true
      form.labelRwError = {pointing: 'below', content: 'Label Rw harus diisi'}
    } else if (form.labelRw.length !== 3) {
      labelRwError = true
      form.labelRwError = {pointing: 'below', content: 'Label Rw harus 3 digit'}
    }
    if (form.masterKelurahan.kodeKelurahan.trim() === '') {
      masterKelurahanError = true
      form.masterKelurahanError = {pointing: 'below', content: 'Kelurahan harus dipilih'}
    }
    this.setState({form})
    return (!(kodeRwError || labelRwError || masterKelurahanError))
  }
  handleActionModal = async (response) => {
    if (response) {
      const {keycloak} = this.props
      const {deleteRw} = this.state
      try {
        await kelompokApi.deleteRw(deleteRw.id, keycloak.token)
        toast.info(<div><p>RW {deleteRw.labelRw} telah dihapus, Mohon Tunggu...</p>
        </div>, {onClose: () => this.props.history.push("/rw")});
      } catch (error) {
        toast.error(error.request.response, {onClose: () => this.setState({isLoadingForm: false})});
        handleLogError(error)
      }
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
    form.masterKelurahan.kodeKelurahan = value
    form.masterKelurahanError = false
    if (this.props.match.params.id === 'tambah') {
      form.kodeRw = value
    }
    this.setState({form})
  }
  handleSaveRw = async () => {
    if (!this.isValidForm()) {
      return
    }
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    const {id, kodeRw, labelRw, namaKetuaRw, noHpRw, noTelpRw, noTelpRwAlt, masterKelurahan} = this.state.form
    const rw = {id, kodeRw, labelRw, namaKetuaRw, noHpRw, noTelpRw, noTelpRwAlt, masterKelurahan}
    try {
      await kelompokApi.saveRw(rw, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        {onClose: () => this.props.history.push("/rw")});
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Data RW..</p>
      </div>, {onClose: () => this.setState({isLoadingForm: false})})

      handleLogError(error)
    }
  }
  handleDeleteRw = (rw) => {
    this.setState({isLoadingForm: true})
    const modal = {
      isOpen: true,
      header: 'Hapus RW',
      content: `Apakah anda yakin akan menghapus RW '${rw.labelRw}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({modal, deleteRw: rw})
    // The deletion is done in handleActionModal function
  }

  render() {
    const {keycloak} = this.props
    const {isLoadingForm, modal, form, readOnly, kelurahanOptions} = this.state
    if (isPusdatin(keycloak) || isKelurahan(keycloak)) {
      return (
        <Container className={'content'} text>
          <Form loading={isLoadingForm}>
            <Form.Field>
              <label>Id RW</label>
              <Form.Input
                fluid
                readOnly
                id='id'
                placeholder={'ID Akan dibentuk oleh Sistem'}
                onChange={this.handleChangeNumber}
                value={form.id}/>
            </Form.Field>
            <Form.Field>
              <label>Kelurahan</label>
              <Form.Dropdown
                placeholder='Kelurahan'
                noResultsMessage='Tidak ada nama Kelurahan...'
                onChange={this.handleChangeDropdown}
                search
                options={kelurahanOptions}
                error={form.masterKelurahanError}
                selection
                clearable
                value={form.masterKelurahan.kodeKelurahan === '' ? undefined : form.masterKelurahan.kodeKelurahan}
              />
            </Form.Field>
            <Form.Field required>
              <label>Kode RW (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnly}
                placeholder='Kode RW'
                maxLength='13'
                id='kodeRw'
                error={form.kodeRwError}
                onChange={this.handleChangeNumber}
                value={form.kodeRw}/>
            </Form.Field>
            <Form.Field required>
              <label>Label RW (3 digit)</label>
              <Form.Input
                fluid
                placeholder='Label RW'
                error={form.labelRwError}
                readOnly={readOnly}
                maxLength='3'
                id='labelRw'
                onChange={this.handleChangeNumber}
                value={form.labelRw}/>
            </Form.Field>
            <Form.Field>
              <label>Nama Ketua RW</label>
              <Form.Input
                fluid
                placeholder='Nama Ketua RW'
                id='namaKetuaRw'
                onChange={this.handleChange}
                value={form.namaKetuaRw}/>
            </Form.Field>
            <Form.Field>
              <label>Nomor Handphone RW</label>
              <Form.Input
                fluid
                placeholder='Nomor Handphone RW'
                id='noHpRw'
                onChange={this.handleChangeNumber}
                value={form.noHpRw}/>
            </Form.Field>
            <Form.Field>
              <label>Nomor Telp RW</label>
              <Form.Input
                fluid
                placeholder='Nomor Telp RW'
                id='noTelpRw'
                onChange={this.handleChangeNumber}
                value={form.noTelpRw}/>
            </Form.Field>
            <Form.Field>
              <label>Nomor Telp RW (Alternatif)</label>
              <Form.Input
                fluid
                placeholder='Nomor Telp RW (Alternatif)'
                id='noTelpRwAlt'
                onChange={this.handleChangeNumber}
                value={form.noTelpRwAlt}/>
            </Form.Field>
            {form.id ?
              <Button
                negative
                floated='left'
                onClick={() => this.handleDeleteRw(form)}>Hapus</Button> : <></>}
            <Button
              positive
              floated='right'
              type='submit'
              onClick={this.handleSaveRw}>Simpan</Button>
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
      return <Redirect to='/rw'/>
    }
  }
}

export default withKeycloak(RwDetail)