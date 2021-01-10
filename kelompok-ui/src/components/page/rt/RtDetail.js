import React, {Component} from "react";
import {withKeycloak} from "@react-keycloak/web";
import {handleLogError, isPusdatin, isRw} from "../../util/Helpers";
import {Redirect} from "react-router-dom";
import {kelompokApi} from "../../util/KelompokApi";
import {toast, ToastContainer} from "react-toastify";
import {Button, Container, Form} from "semantic-ui-react";
import ConfirmationModal from "../../util/ConfirmationModal";

class RtDetail extends Component {
  formInitialState = {
    id: '',
    masterRw: {kodeRw: ''},
    kodeRt: '',
    labelRt: '',
    namaKetuaRt: '',
    noHpRt: '',
    noTelpRt: '',
    noTelpRtAlt: '',
    kodeRtError: false,
    labelRtError: false,
    masterRwError: false
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
    deleteRt: null,
    rwOptions: [],
    readOnly: true,
    isLoadingForm: false
  }

  async componentDidMount() {
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    try {
      const getRwOptions = await kelompokApi.getRwOptions(keycloak.token)
      const rwOptions = getRwOptions.data
      this.setState({rwOptions})
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
        const response = await kelompokApi.getRtById(param, keycloak.token)
        const rt = response.data
        const form = {
          id: rt.id,
          masterRw: {kodeRw: rt.masterRw.kodeRw},
          kodeRt: rt.kodeRt,
          labelRt: rt.labelRt,
          namaKetuaRt: rt.namaKetuaRt,
          noHpRt: rt.noHpRt,
          noTelpRt: rt.noTelpRt,
          noTelpRtAlt: rt.noTelpRtAlt,
          kodeRtError: false,
          labelRtError: false
        }
        this.setState({form})
      } catch (error) {
        handleLogError(error)
        this.props.history.push("/rt");
      }
    }
    this.setState({isLoadingForm: false})
  }

  isValidForm = () => {
    const form = {...this.state.form}
    let kodeRtError = false
    let labelRtError = false
    let masterRwError = false
    form.kodeRtError = kodeRtError
    form.labelRtError = labelRtError
    form.masterRwError = masterRwError
    if (form.kodeRt.trim() === '') {
      kodeRtError = true
      form.kodeRtError = {pointing: 'below', content: 'Kode Rt harus diisi'}
    } else if (form.kodeRt.length !== 16) {
      kodeRtError = true
      form.kodeRtError = {pointing: 'below', content: 'Kode Rt harus 16 digit'}
    }
    if (form.labelRt.trim() === '') {
      labelRtError = true
      form.labelRtError = {pointing: 'below', content: 'Label Rt harus diisi'}
    } else if (form.labelRt.length !== 3) {
      labelRtError = true
      form.labelRtError = {pointing: 'below', content: 'Label Rt harus 3 digit'}
    }
    if (form.masterRw.kodeRw.trim() === '') {
      masterRwError = true
      form.masterRwError = {pointing: 'below', content: 'Rw harus dipilih'}
    }
    this.setState({form})
    return (!(kodeRtError || labelRtError || masterRwError))
  }
  handleActionModal = async (response) => {
    if (response) {
      const {keycloak} = this.props
      const {deleteRt} = this.state
      try {
        await kelompokApi.deleteRt(deleteRt.id, keycloak.token)
        toast.info(<div><p>RT {deleteRt.labelRt} telah dihapus, Mohon Tunggu...</p>
        </div>, {onClose: () => this.props.history.push("/rt")});
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
    form.masterRw.kodeRw = value
    form.masterRwError = false
    if (this.props.match.params.id === 'tambah') {
      form.kodeRt = value
    }
    this.setState({form})
  }
  handleSaveRt = async () => {
    if (!this.isValidForm()) {
      return
    }
    this.setState({isLoadingForm: true})
    const {keycloak} = this.props
    const {id, kodeRt, labelRt, namaKetuaRt, noHpRt, noTelpRt, noTelpRtAlt, masterRw} = this.state.form
    const rt = {id, kodeRt, labelRt, namaKetuaRt, noHpRt, noTelpRt, noTelpRtAlt, masterRw}
    try {
      await kelompokApi.saveRt(rt, keycloak.token)
      toast.success(<div><p>Data telah tersimpan, Mohon Tunggu...</p></div>,
        {onClose: () => this.props.history.push("/rt")});
    } catch (error) {
      toast.error(<div><p>Ada Kesalahan, Silahkan Periksa Data RT..</p>
      </div>, {onClose: () => this.setState({isLoadingForm: false})})

      handleLogError(error)
    }
  }
  handleDeleteRt = (rt) => {
    this.setState({isLoadingForm: true})
    const modal = {
      isOpen: true,
      header: 'Hapus RT',
      content: `Apakah anda yakin akan menghapus RT '${rt.labelRt}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    }
    this.setState({modal, deleteRt: rt})
    // The deletion is done in handleActionModal function
  }

  render() {
    const {keycloak} = this.props
    const {isLoadingForm, modal, form, readOnly, rwOptions} = this.state
    if (isPusdatin(keycloak) || isRw(keycloak)) {
      return (
        <Container className={'content'} text>
          <Form loading={isLoadingForm}>
            <Form.Field>
              <label>Id RT</label>
              <Form.Input
                fluid
                readOnly
                id='id'
                placeholder={'ID Akan dibentuk oleh Sistem'}
                onChange={this.handleChangeNumber}
                value={form.id}/>
            </Form.Field>
            <Form.Field>
              <label>Rw</label>
              <Form.Dropdown
                placeholder='Rw'
                noResultsMessage='Tidak ada nama Rw...'
                onChange={this.handleChangeDropdown}
                search
                options={rwOptions}
                error={form.masterRwError}
                selection
                clearable
                value={form.masterRw.kodeRw === '' ? undefined : form.masterRw.kodeRw}
              />
            </Form.Field>
            <Form.Field required>
              <label>Kode RT (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnly}
                placeholder='Kode RT'
                maxLength='16'
                id='kodeRt'
                error={form.kodeRtError}
                onChange={this.handleChangeNumber}
                value={form.kodeRt}/>
            </Form.Field>
            <Form.Field required>
              <label>Label RT (3 digit)</label>
              <Form.Input
                fluid
                placeholder='Label RT'
                error={form.labelRtError}
                maxLength='3'
                readOnly={readOnly}
                id='labelRt'
                onChange={this.handleChangeNumber}
                value={form.labelRt}/>
            </Form.Field>
            <Form.Field>
              <label>Nama Ketua RT</label>
              <Form.Input
                fluid
                placeholder='Nama Ketua RT'
                id='namaKetuaRt'
                onChange={this.handleChange}
                value={form.namaKetuaRt}/>
            </Form.Field>
            <Form.Field>
              <label>Nomor Handphone RT</label>
              <Form.Input
                fluid
                placeholder='Nomor Handphone RT'
                id='noHpRt'
                onChange={this.handleChangeNumber}
                value={form.noHpRt}/>
            </Form.Field>
            <Form.Field>
              <label>Nomor Telp RT</label>
              <Form.Input
                fluid
                placeholder='Nomor Telp RT'
                id='noTelpRt'
                onChange={this.handleChangeNumber}
                value={form.noTelpRt}/>
            </Form.Field>
            <Form.Field>
              <label>Nomor Telp RT (Alternatif)</label>
              <Form.Input
                fluid
                placeholder='Nomor Telp RT (Alternatif)'
                id='noTelpRtAlt'
                onChange={this.handleChangeNumber}
                value={form.noTelpRtAlt}/>
            </Form.Field>
            {form.id ?
              <Button
                negative
                floated='left'
                onClick={() => this.handleDeleteRt(form)}>Hapus</Button> : <></>}
            <Button
              positive
              floated='right'
              type='submit'
              onClick={this.handleSaveRt}>Simpan</Button>
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
      return <Redirect to='/rt'/>
    }
  }
}

export default withKeycloak(RtDetail)