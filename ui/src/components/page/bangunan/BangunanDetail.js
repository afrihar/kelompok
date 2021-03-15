import React, {Component} from "react";
import {withKeycloak} from "@react-keycloak/web";
import {kelompokApi} from "../../util/KelompokApi";
import {getKodeWilayah, getNik, handleLogError, isKader, isKelurahan, isPusdatin} from "../../util/Helpers";
import {toast, ToastContainer} from "react-toastify";
import {Redirect} from "react-router-dom";
import {Button, Container, Divider, Form, Header, Icon, Message, Segment} from "semantic-ui-react";
import ConfirmationModal from "../../util/ConfirmationModal";

class BangunanDetail extends Component {
  modalInitialState = {
    isOpen: false,
    header: "",
    content: "",
    onAction: null,
    onClose: null
  };
  formInitialState = {
    id: 0,
    identifikasi: "",
    noUrut: null,
    kelompokBangunan: {id: 0}
  };
  errorInitialState = {identifikasi: false, kelompok: false};
  messageInitialState = {isMatchWilayah: false};
  state = {
    isLoadingForm: false,
    deleteBangunan: null,
    modal: {...this.modalInitialState},
    form: {...this.formInitialState},
    error: {...this.errorInitialState},
    message: {...this.messageInitialState},
    kelompokOptions: [],
    disabledKelompok: false
  };

  async componentDidMount() {
    this.setState({isLoadingForm: true});
    const id = this.props.match.params.id;
    const {keycloak} = this.props;
    const getKelompokOptions = await kelompokApi.getBangunanOptionsKelompok(keycloak.token);
    this.setState({kelompokOptions: getKelompokOptions.data});
    let form = {...this.formInitialState};
    if (id === "tambah") {
      if (isKader(keycloak)) {
        this.setState({disabledKelompok: true});

      }
      this.setState({form, message: {isMatchWilayah: true}});
    } else {
      try {
        const bangunan = await kelompokApi.getBangunanById(id, keycloak.token);
        const bangunanData = bangunan.data;
        if (bangunanData.kelompokBangunan) {
          if (isPusdatin(keycloak)
            || (isKelurahan(keycloak)
              && bangunanData.kelompokBangunan.rtKelompok.rw.kelurahan.kodeKelurahan === getKodeWilayah(keycloak))
            || (isKader(keycloak)
              && bangunanData.kelompokBangunan.petugasKelompok != null
              && bangunanData.kelompokBangunan.petugasKelompok.nik === getNik(keycloak))) {
            this.setState({message: {isMatchWilayah: true}});
            if (bangunanData.id) form.id = bangunanData.id
            if (bangunanData.identifikasi) form.identifikasi = bangunanData.identifikasi
            if (bangunanData.noUrut) form.noUrut = bangunanData.noUrut
            if (bangunanData.kelompokBangunan) form.kelompokBangunan.id = bangunanData.kelompokBangunan.id
            this.setState({form, disabledKelompok: true});
          }
        }
      } catch (error) {
        handleLogError(error);
        this.props.history.push("/bangunan");
      }
    }

    this.setState({isLoadingForm: false});
  }

  handleChangeDropdownKelompok = (e, {value}) => {
    const form = {...this.state.form};
    if (value === "") form.kelompokBangunan.id = 0; else form.kelompokBangunan.id = value;
    this.setState({form, error: {kelompok: false}});
  };
  handleSaveBangunan = async () => {
    if (!(this.isValidForm())) {
      return;
    }
    this.setState({isLoadingForm: true});
    try {
      const {id, identifikasi, kelompokBangunan} = this.state.form;
      const bangunan = {id, identifikasi, kelompokBangunan};
      const {keycloak} = this.props;
      await kelompokApi.saveBangunan(bangunan, keycloak.token);
      toast.success(
        <div>
          <p>Data telah tersimpan, Mohon Tunggu...</p>
        </div>,
        {onClose: () => this.props.history.push("/bangunan")}
      );
    } catch (error) {
      handleLogError(error);
      toast.error(
        <div>
          <p>{error.request.responseText.jumlahBangunan}</p>
        </div>,
        {onClose: () => this.setState({isLoadingForm: false})}
      );
    }
  };
  isValidForm = () => {
    const form = {...this.state.form};
    const error = {...this.state.error};
    let identifikasiError = false;
    if (form.identifikasi.trim() === "") {
      identifikasiError = true;
      error.identifikasi = {pointing: "above", content: "Identifikasi Bangunan harus diisi"};
    }
    let kelompokError = false;
    if (form.kelompokBangunan.id === 0) {
      kelompokError = true;
      error.kelompok = {pointing: "above", content: "Kelompok harus diisi"};
    }
    this.setState({error});
    return (!(kelompokError || identifikasiError));
  };
  handleChange = (e) => {
    const { id, value } = e.target;
    const form = { ...this.state.form };
    form[id] = value;
    this.setState({ form });
  };
  handleClickBack = () => this.props.history.push("/bangunan");
  handleKeyPressBack = (e) => {
    if (e.charCode === 32 || e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      this.props.history.push("/bangunan");
    }
  };

  render() {
    const {keycloak} = this.props;
    const {
      isLoadingForm,
      modal,
      form,
      error,
      message,
      kelompokOptions,
      disabledKelompok
    } = this.state;
    if (isPusdatin(keycloak) || isKelurahan(keycloak) || isKader(keycloak)) {
      return (
        <Container className="isi" text>
          {this.props.match.params.id === "tambah" ? (
            <Header as="h1" textAlign="center"> Tambah Bangunan </Header>
          ) : (
            <Header as="h1" textAlign="center">Bangunan{" "}{form.identifikasi} </Header>
          )}
          <Button animated basic color="grey" onClick={this.handleClickBack} onKeyPress={this.handleKeyPressBack}>
            <Button.Content hidden>Kembali</Button.Content>
            <Button.Content visible>
              <Icon name="arrow left"/>
            </Button.Content>
          </Button>
          <Divider/>
          <Form loading={isLoadingForm}>
            <Message negative hidden={message.isMatchWilayah}>
              <Message.Header>Bangunan ini tidak berada di kelompok Anda.</Message.Header>
            </Message>
            <Segment hidden={!message.isMatchWilayah} piled>
              <Segment raised>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Id Bangunan</label>
                    <Form.Input
                      fluid
                      readOnly
                      placeholder="Generated by System"
                      id="id"
                      value={form.id ? form.id : undefined}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>No Urut Bangunan</label>
                    <Form.Input fluid id="nama" value={form.noUrut}
                                placeholder="Generated by System" readOnly/>
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
                <Form.Field required>
                  <label>Penanggung Jawab Bangunan</label>
                  <Form.Input fluid id="identifikasi" value={form.identifikasi} error={error.identifikasi}
                              onChange={this.handleChange}
                              placeholder="Nama orang / keterangan untuk identifikasi bangunan"/>
                </Form.Field>
              </Segment>
              <Segment raised>
                <Form.Field required>
                  <label>Kelompok</label>
                  <Form.Dropdown selection placeholder="Kelompok" options={kelompokOptions} error={error.kelompok}
                                 value={form.kelompokBangunan.id === 0 ? "" : form.kelompokBangunan.id}
                                 onChange={this.handleChangeDropdownKelompok}/>
                </Form.Field>
              </Segment>
            </Segment>
            <Button positive disabled={!message.isMatchWilayah} floated="right" type="submit"
                    onClick={this.handleSaveBangunan}> Simpan
            </Button>
          </Form>
          <ConfirmationModal modal={modal}/>
          <ToastContainer position="top-center" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick
                          rtl={false} pauseOnFocusLoss draggable pauseOnHover/>
        </Container>
      );
    } else {
      return <Redirect to="/bangunan"/>;
    }
  }
}

export default withKeycloak(BangunanDetail);