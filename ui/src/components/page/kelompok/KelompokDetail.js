import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { kelompokApi } from "../../util/KelompokApi";
import {
  getKodeKecamatan,
  getKodeKota,
  getKodeWilayah,
  handleLogError,
  isKecamatan,
  isKelurahan,
  isKota,
  isProvinsi,
  isPusdatin,
  isRt,
  isRw
} from "../../util/Helpers";
import { Redirect } from "react-router-dom";
import { Button, Container, Divider, Form, Header, Icon, Message, Segment } from "semantic-ui-react";
import { toast, ToastContainer } from "react-toastify";
import ConfirmationModal from "../../util/ConfirmationModal";

class KelompokDetail extends Component {
  modalInitialState = {
    isOpen: false,
    header: "",
    content: "",
    onAction: null,
    onClose: null
  };
  formInitialState = {
    id: "",
    namaKelompok: "",
    kota: { kodeKota: "" },
    kecamatan: { kodeKecamatan: "" },
    kelurahan: { kodeKelurahan: "" },
    rw: { kodeRw: "" },
    rtKelompok: { kodeRt: "" },
    petugasKelompok: { nik: "" }
  };
  errorInitialState = { rt: false };
  messageInitialState = {
    isMatchWilayah: false
  };
  state = {
    isLoadingForm: false,
    deleteKelompok: null,
    modal: { ...this.modalInitialState },
    form: { ...this.formInitialState },
    error: { ...this.errorInitialState },
    message: { ...this.messageInitialState },
    provinsiOptions: [],
    kotaOptions: [],
    kecamatanOptions: [],
    kelurahanOptions: [],
    rwOptions: [],
    rtOptions: [],
    petugasOptions: [],
    namaKelompokKelurahan: "",
    disabledWilayah: false
  };

  async componentDidMount() {
    this.setState({ isLoadingForm: true });
    const id = this.props.match.params.id;
    const { keycloak } = this.props;
    const provinsiOptions = [{
      key: "31",
      text: "DKI JAKARTA",
      value: "31"
    }];
    const getKotaOptions = await kelompokApi.getKelompokOptionsKota(keycloak.token);
    this.setState({ provinsiOptions, kotaOptions: getKotaOptions.data });
    let form = { ...this.formInitialState };
    if (id === "tambah") {
      if (isKelurahan(keycloak)) {
        form.kota.kodeKota = getKodeKota(keycloak);
        const getKecamatanOptions = await kelompokApi.getKelompokOptionsKecamatan(getKodeKota(keycloak), keycloak.token);
        form.kecamatan.kodeKecamatan = getKodeKecamatan(keycloak);
        const getKelurahanOptions = await kelompokApi.getKelompokOptionsKelurahan(form.kecamatan.kodeKecamatan, keycloak.token);
        form.kelurahan.kodeKelurahan = getKodeWilayah(keycloak);
        const getKelurahan = await kelompokApi.getKelompokDetailKelurahan(form.kelurahan.kodeKelurahan, keycloak.token);
        const kelurahanDetail = getKelurahan.data;
        const getRwOptions = await kelompokApi.getKelompokOptionsRw(form.kelurahan.kodeKelurahan, keycloak.token);
        this.setState({
          kecamatanOptions: getKecamatanOptions.data,
          kelurahanOptions: getKelurahanOptions.data,
          rwOptions: getRwOptions.data,
          namaKelompokKelurahan: kelurahanDetail.namaKelompokKelurahan
        });
      }
      this.setState({ form, message: { isMatchWilayah: true } });
    } else {
      try {
        const response = await kelompokApi.getKelompokById(id, keycloak.token);
        const kelompok = response.data;
        if (kelompok.rtKelompok) {
          if ((isRt(keycloak) && (kelompok.rtKelompok.kodeRt === getKodeWilayah(keycloak)))
            || (isRw(keycloak) && (kelompok.rtKelompok.kodeRt.substr(0, 12) === getKodeWilayah(keycloak)))
            || (isKelurahan(keycloak) && (kelompok.rtKelompok.kodeRt.substr(0, 9) === getKodeWilayah(keycloak)))
            || (isKecamatan(keycloak) && (kelompok.rtKelompok.kodeRt.substr(0, 6) === getKodeWilayah(keycloak)))
            || (isKota(keycloak) && (kelompok.rtKelompok.kodeRt.substr(0, 4) === getKodeWilayah(keycloak)))
            || (isProvinsi(keycloak) && (kelompok.rtKelompok.kodeRt.substr(0, 2) === getKodeWilayah(keycloak)))
            || (isPusdatin(keycloak))
          ) {
            this.setState({ message: { isMatchWilayah: true } });
            if (kelompok.id) form.id = kelompok.id;
            if (kelompok.namaKelompok) form.namaKelompok = kelompok.namaKelompok;
            if (kelompok.rtKelompok) {
              form.kota.kodeKota = kelompok.rtKelompok.rw.kelurahan.kecamatan.kota.kodeKota;
              const getKecamatanOptions = await kelompokApi.getKelompokOptionsKecamatan(form.kota.kodeKota, keycloak.token);
              form.kecamatan.kodeKecamatan = kelompok.rtKelompok.rw.kelurahan.kecamatan.kodeKecamatan;
              const getKelurahanOptions = await kelompokApi.getKelompokOptionsKelurahan(form.kecamatan.kodeKecamatan, keycloak.token);
              form.kelurahan.kodeKelurahan = kelompok.rtKelompok.rw.kelurahan.kodeKelurahan;
              const getKelurahan = await kelompokApi.getKelompokDetailKelurahan(form.kelurahan.kodeKelurahan, keycloak.token);
              const kelurahanDetail = getKelurahan.data;
              this.setState({ namaKelompokKelurahan: kelurahanDetail.namaKelompokKelurahan });
              const getRwOptions = await kelompokApi.getKelompokOptionsRw(form.kelurahan.kodeKelurahan, keycloak.token);
              form.rw.kodeRw = kelompok.rtKelompok.rw.kodeRw;
              const getRtOptions = await kelompokApi.getKelompokOptionsRt(form.rw.kodeRw, keycloak.token);
              form.rtKelompok.kodeRt = kelompok.rtKelompok.kodeRt;
              const getPetugasOptions = await kelompokApi.getKelompokOptionsPetugas(form.rtKelompok.kodeRt, keycloak.token);
              this.setState({
                kecamatanOptions: getKecamatanOptions.data,
                kelurahanOptions: getKelurahanOptions.data,
                rwOptions: getRwOptions.data,
                rtOptions: getRtOptions.data,
                petugasOptions: getPetugasOptions.data
              });
            }
            if (kelompok.petugasKelompok) {
              form.petugasKelompok.nik = kelompok.petugasKelompok.nik;
            }
            this.setState({ form, disabledWilayah: true });
          }
        }
      } catch (error) {
        handleLogError(error);
        this.props.history.push("/kelompok");
      }
    }
    this.setState({ isLoadingForm: false });
  }

  handleChangeDropdownKota = async (e, { value }) => {
    this.setState({
      isLoadingKecamatan: true,
      kecamatanOptions: [],
      kelurahanOptions: [],
      rwOptions: [],
      rtOptions: []
    });
    const error = { ...this.state.error };
    error.rt = false;
    const form = { ...this.state.form };
    form.kota.kodeKota = value;
    form.namaKelompok = "";
    form.kecamatan.kodeKecamatan = "";
    form.kelurahan.kodeKelurahan = "";
    form.rw.kodeRw = "";
    form.rtKelompok.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKecamatanOptions = await kelompokApi.getKelompokOptionsKecamatan(value, keycloak.token);
        this.setState({ kecamatanOptions: getKecamatanOptions.data });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, error, isLoadingKecamatan: false });
  };
  handleChangeDropdownKecamatan = async (e, { value }) => {
    this.setState({
      isLoadingKelurahan: true,
      kelurahanOptions: [],
      rwOptions: [],
      rtOptions: []
    });
    const error = { ...this.state.error };
    error.rt = false;
    const form = { ...this.state.form };
    form.kecamatan.kodeKecamatan = value;
    form.namaKelompok = "";
    form.kelurahan.kodeKelurahan = "";
    form.rw.kodeRw = "";
    form.rtKelompok.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKelurahanOptions = await kelompokApi.getKelompokOptionsKelurahan(value, keycloak.token);
        this.setState({ kelurahanOptions: getKelurahanOptions.data });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, error, isLoadingKelurahan: false });
  };
  handleChangeDropdownKelurahan = async (e, { value }) => {
    this.setState({
      isLoadingRw: true,
      rwOptions: [],
      rtOptions: []
    });
    const error = { ...this.state.error };
    error.rt = false;
    const form = { ...this.state.form };
    form.kelurahan.kodeKelurahan = value;
    form.namaKelompok = "";
    form.rw.kodeRw = "";
    form.rtKelompok.kodeRt = "";
    this.setState({ namaKelompokKelurahan: "" });
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKelurahan = await kelompokApi.getKelompokDetailKelurahan(value, keycloak.token);
        const kelurahanDetail = getKelurahan.data;
        form.namaKelompok = kelurahanDetail.namaKelompokKelurahan;
        this.setState({ namaKelompokKelurahan: kelurahanDetail.namaKelompokKelurahan });
        const getRwOptions = await kelompokApi.getKelompokOptionsRw(value, keycloak.token);
        this.setState({ rwOptions: getRwOptions.data });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, error, isLoadingRw: false });
  };
  handleChangeDropdownRw = async (e, { value }) => {
    this.setState({ isLoadingRt: true, rtOptions: [] });
    const error = { ...this.state.error };
    error.rt = false;
    const form = { ...this.state.form };
    form.rw.kodeRw = value;
    form.rtKelompok.kodeRt = "";
    if (value) {
      try {
        form.namaKelompok = this.state.namaKelompokKelurahan + " " + form.rw.kodeRw.substr(9, 3);
        const { keycloak } = this.props;
        const getRtOptions = await kelompokApi.getKelompokOptionsRt(value, keycloak.token);
        this.setState({ rtOptions: getRtOptions.data });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      form.namaKelompok = this.state.namaKelompokKelurahan;
    }
    this.setState({ form, error, isLoadingRt: false });
  };
  handleChangeDropdownRt = async (e, { value }) => {
    this.setState({ isLoadingPetugas: true, petugasOptions: [] });
    const error = { ...this.state.error };
    error.rt = false;
    const form = { ...this.state.form };
    form.petugasKelompok.nik = "";
    form.rtKelompok.kodeRt = value;
    if (value) {
      try {
        const { keycloak } = this.props;
        const getLastNumber = await kelompokApi.getKelompokLastNumber(value, keycloak.token);
        const getOptionsPetugas = await kelompokApi.getKelompokOptionsPetugas(value, keycloak.token);
        this.setState({ petugasOptions: getOptionsPetugas.data });
        const lastNumber = getLastNumber.data;
        form.namaKelompok = this.state.namaKelompokKelurahan
          + " " + form.rw.kodeRw.substr(9, 3)
          + "." + form.rtKelompok.kodeRt.substr(12, 3)
          + "." + lastNumber;
      } catch (error) {
        handleLogError(error);
      }
    } else {
      form.namaKelompok = this.state.namaKelompokKelurahan
        + " " + form.rw.kodeRw.substr(9, 3);
    }

    this.setState({ form, error, isLoadingPetugas: false });
  };
  handleChangeDropdownPetugas = (e, { value }) => {
    const form = { ...this.state.form };
    form.petugasKelompok.nik = value;
    this.setState({ form });
  };
  handleSaveKelompok = async () => {
    if (!(this.isValidForm())) {
      return;
    }
    this.setState({ isLoadingForm: true });
    try {
      const { id, namaKelompok, rtKelompok, petugasKelompok } = this.state.form;
      const kelompok = { id, namaKelompok, rtKelompok, petugasKelompok };
      const { keycloak } = this.props;
      await kelompokApi.saveKelompok(kelompok, keycloak.token);
      toast.success(
        <div>
          <p>Data telah tersimpan, Mohon Tunggu...</p>
        </div>,
        { onClose: () => this.props.history.push("/kelompok") }
      );
    } catch (error) {
      handleLogError(error);
      toast.error(
        <div>
          <p>Ada Kesalahan, Silahkan Periksa Data Anda Kembali</p>
        </div>,
        { onClose: () => this.setState({ isLoadingForm: false }) }
      );
    }
  };
  isValidForm = () => {
    const form = { ...this.state.form };
    const error = { ...this.state.error };
    let rtError = false;
    if (form.rtKelompok.kodeRt.trim() === "") {
      rtError = true;
      error.rt = { pointing: "above", content: "RT Kelompok harus diisi" };
    }
    this.setState({ error });
    return (!rtError);
  };
  handleClickBack = () => this.props.history.push("/kelompok");
  handleKeyPressBack = (e) => {
    if (e.charCode === 32 || e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      this.props.history.push("/kelompok");
    }
  };

  render() {
    const { keycloak } = this.props;
    const {
      isLoadingForm,
      modal,
      form,
      error,
      message,
      isLoadingKecamatan,
      isLoadingKelurahan,
      isLoadingRw,
      isLoadingRt,
      isLoadingPetugas,
      provinsiOptions,
      kotaOptions,
      kecamatanOptions,
      kelurahanOptions,
      rwOptions,
      rtOptions,
      petugasOptions,
      disabledWilayah
    } = this.state;
    if (isPusdatin(keycloak) || isKelurahan(keycloak)) {
      return (
        <Container className="isi" text>
          {this.props.match.params.id === "tambah" ? (
            <Header as="h1" textAlign="center"> Tambah Kelompok </Header>
          ) : (
            <Header as="h1" textAlign="center">Kelompok<br />{form.namaKelompok} </Header>
          )}
          <Button animated basic color="grey" onClick={this.handleClickBack} onKeyPress={this.handleKeyPressBack}>
            <Button.Content hidden>Kembali</Button.Content>
            <Button.Content visible>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
          <Divider />
          <Form loading={isLoadingForm}>
            <Message negative hidden={message.isMatchWilayah}>
              <Message.Header>Kelompok ini tidak berada di wilayah Anda.</Message.Header>
            </Message>
            <Segment hidden={!message.isMatchWilayah} piled>
              <Segment raised>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Id Kelompok</label>
                    <Form.Input
                      fluid
                      readOnly
                      placeholder="Generated by System"
                      id="id"
                      value={form.id ? form.id : undefined}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label>Nama Kelompok</label>
                    <Form.Input fluid id="nama" value={form.namaKelompok}
                                placeholder="Generated by System" readOnly />
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
                <Form.Group widths="equal">
                  <Form.Field disabled={disabledWilayah}>
                    <label>Provinsi</label>
                    <Form.Dropdown selection placeholder="Provinsi" options={provinsiOptions} value="31" />
                  </Form.Field>
                  <Form.Field disabled={disabledWilayah}>
                    <label>Kota</label>
                    <Form.Dropdown clearable selection placeholder="Kota" options={kotaOptions}
                                   onChange={this.handleChangeDropdownKota}
                                   value={form.kota.kodeKota} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field disabled={disabledWilayah}>
                    <label>Kecamatan</label>
                    <Form.Dropdown clearable selection placeholder="Kecamatan"
                                   options={kecamatanOptions} value={form.kecamatan.kodeKecamatan}
                                   onChange={this.handleChangeDropdownKecamatan}
                                   loading={isLoadingKecamatan} />
                  </Form.Field>
                  <Form.Field disabled={disabledWilayah}>
                    <label>Kelurahan</label>
                    <Form.Dropdown clearable selection placeholder="Kelurahan"
                                   options={kelurahanOptions} value={form.kelurahan.kodeKelurahan}
                                   onChange={this.handleChangeDropdownKelurahan}
                                   loading={isLoadingKelurahan} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field disabled={disabledWilayah}>
                    <label>RW</label>
                    <Form.Dropdown clearable selection placeholder="RW" options={rwOptions}
                                   onChange={this.handleChangeDropdownRw} value={form.rw.kodeRw}
                                   loading={isLoadingRw} />
                  </Form.Field>
                  <Form.Field disabled={disabledWilayah} required>
                    <label>RT</label>
                    <Form.Dropdown clearable selection placeholder="RT" options={rtOptions}
                                   error={error.rt} loading={isLoadingRt}
                                   onChange={this.handleChangeDropdownRt} value={form.rtKelompok.kodeRt} />
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
                <Form.Field>
                  <label>Kader</label>
                  <Form.Dropdown clearable selection placeholder="Kader" options={petugasOptions}
                                 loading={isLoadingPetugas}
                                 onChange={this.handleChangeDropdownPetugas} value={form.petugasKelompok.nik} />
                </Form.Field>
              </Segment>
            </Segment>
            <Button positive disabled={!message.isMatchWilayah} floated="right" type="submit"
                    onClick={this.handleSaveKelompok}>
              Simpan
            </Button>
          </Form>
          <ConfirmationModal modal={modal} />
          <ToastContainer position="top-center" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick
                          rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Container>
      );
    } else {
      return <Redirect to="/kelompok" />;
    }
  }
}

export default withKeycloak(KelompokDetail);