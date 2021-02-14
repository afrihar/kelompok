import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { Button, Container, Divider, Form, Header, Icon, Segment } from "semantic-ui-react";
import { kelompokApi } from "../../util/KelompokApi";
import { handleLogError, isProvinsi, isPusdatin } from "../../util/Helpers";
import { Redirect } from "react-router-dom";
import ConfirmationModal from "../../util/ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class KotaDetail extends Component {
  formInitialState = {
    provinsi: { kodeProvinsi: "31" },
    kodeKota: "31",
    kodeKotaCapil: "31",
    namaKota: "",
    kodeKotaError: false,
    kodeKotaCapilError: false,
    namaKotaError: false,
    provinsiError: false
  };
  modalInitialState = {
    isOpen: false,
    header: "",
    content: "",
    onAction: null,
    onClose: null
  };
  state = {
    modal: { ...this.modalInitialState },
    form: { ...this.formInitialState },
    deleteKota: null,
    provinsiOptions: [],
    readOnly: true,
    isLoadingForm: false
  };

  async componentDidMount() {
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    try {
      const getProvinsiOptions = await kelompokApi.getKotaOptionsProvinsi(keycloak.token);
      const provinsiOptions = getProvinsiOptions.data;
      this.setState({ provinsiOptions });
    } catch (error) {
      handleLogError(error);
    }
    const param = this.props.match.params.kodeKota;
    if (param === "tambah") {
      this.setState({ form: { ...this.formInitialState }, readOnly: false });
    } else {
      try {
        const response = await kelompokApi.getKotaByKode(param, keycloak.token);
        const kota = response.data;
        const kodeProvinsi = kota.provinsi ? kota.provinsi.kodeProvinsi : "";
        const form = {
          kodeKota: kota.kodeKota,
          kodeKotaCapil: kota.kodeKotaCapil,
          namaKota: kota.namaKota,
          provinsi: { kodeProvinsi: kodeProvinsi },
          kodeKotaError: false,
          kodeKotaCapilError: false,
          namaKotaError: false
        };
        this.setState({ form });
      } catch (error) {
        handleLogError(error);
        this.props.history.push("/kota");
      }
    }
    this.setState({ isLoadingForm: false });
  }

  isValidForm = async () => {
    const form = { ...this.state.form };
    let kodeKotaError = false;
    let kodeKotaCapilError = false;
    let namaKotaError = false;
    let provinsiError = false;
    form.kodeKotaError = kodeKotaError;
    form.kodeKotaCapilError = kodeKotaCapilError;
    form.namaKotaError = namaKotaError;
    form.provinsiError = provinsiError;
    if (form.kodeKota.trim() === "") {
      kodeKotaError = true;
      form.kodeKotaError = {
        pointing: "below",
        content: "Kode Kota harus diisi"
      };
    } else if (form.kodeKota.length !== 4) {
      kodeKotaError = true;
      form.kodeKotaError = {
        pointing: "below",
        content: "Kode Kota harus 4 digit"
      };
    } else if (form.provinsi.kodeProvinsi !== form.kodeKota.substr(0, 2)) {
      kodeKotaError = true;
      form.kodeKotaError = {
        pointing: "below",
        content: "Kode Kota harus diawali dengan " + form.provinsi.kodeProvinsi
      };
    } else {
      if (this.props.match.params.kodeKota === "tambah") {
        try {
          const { keycloak } = this.props;
          const response = await kelompokApi.getKotaByKode(
            form.kodeKota,
            keycloak.token
          );
          const kota = response.data;
          kodeKotaError = true;
          form.kodeKotaError = {
            pointing: "below",
            content: "Kode Kota sudah terpakai oleh Kota " + kota.namaKota
          };
        } catch (error) {
          handleLogError(error);
          kodeKotaError = false;
          form.kodeKotaError = false;
        }
      }
    }
    if (form.kodeKotaCapil.trim() === "") {
      kodeKotaCapilError = true;
      form.kodeKotaCapilError = {
        pointing: "below",
        content: "Kode Kota Kemendagri harus diisi"
      };
    } else if (form.kodeKotaCapil.length !== 4) {
      kodeKotaCapilError = true;
      form.kodeKotaCapilError = {
        pointing: "below",
        content: "Kode Kota Kemendagri harus 4 digit"
      };
    } else {
      if (this.props.match.params.kodeKota === "tambah") {
        try {
          const { keycloak } = this.props;
          const response = await kelompokApi.getKotaByKodeCapil(
            form.kodeKotaCapil,
            keycloak.token
          );
          const kota = response.data;
          kodeKotaCapilError = true;
          form.kodeKotaCapilError = {
            pointing: "below",
            content:
              "Kode Kota Capil sudah terpakai oleh Kota " + kota.namaKota
          };
        } catch (error) {
          handleLogError(error);
          kodeKotaCapilError = false;
          form.kodeKotaCapilError = false;
        }
      }
    }
    if (form.namaKota.trim() === "") {
      namaKotaError = true;
      form.namaKotaError = {
        pointing: "below",
        content: "Nama Kota harus diisi"
      };
    }
    this.setState({ form });
    return !(
      kodeKotaError ||
      kodeKotaCapilError ||
      namaKotaError ||
      provinsiError
    );
  };
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props;
      const { deleteKota } = this.state;
      try {
        await kelompokApi.deleteKota(deleteKota.kodeKota, keycloak.token);
        toast.info(
          <div>
            <p>Kota {deleteKota.namaKota} telah dihapus, Mohon Tunggu...</p>
          </div>,
          { onClose: () => this.props.history.push("/kota") }
        );
      } catch (error) {
        toast.error(error.request.response, {
          onClose: () => this.setState({ isLoadingForm: false })
        });
        handleLogError(error);
      }
    } else {
      this.setState({ isLoadingForm: false });
    }
    this.setState({ modal: { ...this.modalInitialState } });
  };
  handleCloseModal = () => {
    this.setState({
      modal: { ...this.modalInitialState },
      isLoadingForm: false
    });
  };
  handleChangeToUpperCase = (e) => {
    const re = /^[a-zA-Z ]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form });
    }
  };
  handleChangeNumber = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ form });
    }
  };
  handleChangeDropdown = (e, { value }) => {
    const form = { ...this.state.form };
    form.provinsi.kodeProvinsi = value;
    if (this.props.match.params.kodeKota === "tambah") {
      form.kodeKota = value;
      form.kodeKotaCapil = value;
    }
    this.setState({ form });
  };
  handleSaveKota = async () => {
    if (!(await this.isValidForm())) {
      return;
    }
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    const { kodeKota, kodeKotaCapil, namaKota, provinsi } = this.state.form;
    const kota = { kodeKota, kodeKotaCapil, namaKota, provinsi };
    try {
      await kelompokApi.saveKota(kota, keycloak.token);
      toast.success(
        <div>
          <p>Data telah tersimpan, Mohon Tunggu...</p>
        </div>,
        { onClose: () => this.props.history.push("/kota") }
      );
    } catch (error) {
      toast.error(
        <div>
          <p>Ada Kesalahan, Silahkan Periksa Kode Kota</p>
        </div>,
        { onClose: () => this.setState({ isLoadingForm: false }) }
      );
      handleLogError(error);
    }
  };
  handleDeleteKota = (kota) => {
    this.setState({ isLoadingForm: true });
    const modal = {
      isOpen: true,
      header: "Hapus Kota",
      content: `Apakah anda yakin akan menghapus Kota '${kota.namaKota}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    };
    this.setState({ modal, deleteKota: kota });
  };
  handleClickBack = () => this.props.history.push("/kota");
  handleKeyPressBack = (e) => {
    if (e.charCode === 32 || e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      this.props.history.push("/kota");
    }
  };

  render() {
    const { keycloak } = this.props;
    const {
      isLoadingForm,
      modal,
      form,
      readOnly,
      provinsiOptions
    } = this.state;
    if (isPusdatin(keycloak) || isProvinsi(keycloak)) {
      return (
        <Container className="isi" text>
          {this.props.match.params.kodeKota === "tambah" ? (
            <Header as="h1" textAlign="center"> Tambah Kota </Header>
          ) : (
            <Header as="h1" textAlign="center"> {form.namaKota} </Header>
          )}
          <Button animated basic color="grey" onClick={this.handleClickBack} onKeyPress={this.handleKeyPressBack}>
            <Button.Content hidden>Kembali</Button.Content>
            <Button.Content visible>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
          <Divider />
          <Form loading={isLoadingForm}>
            <Segment piled>
              <Form.Field required>
                <label>Provinsi</label>
                <Form.Dropdown
                  placeholder="Provinsi"
                  noResultsMessage="Tidak ada nama Provinsi..."
                  onChange={this.handleChangeDropdown}
                  search
                  disabled={readOnly}
                  options={provinsiOptions}
                  error={form.provinsiError}
                  selection
                  value={
                    form.provinsi.kodeProvinsi === ""
                      ? "31"
                      : form.provinsi.kodeProvinsi
                  }
                />
              </Form.Field>
              <Form.Field required>
                <label>Kode Kota (Tidak Dapat Diubah)</label>
                <Form.Input
                  fluid
                  readOnly={readOnly}
                  placeholder="Kode Kota"
                  maxLength="4"
                  id="kodeKota"
                  error={form.kodeKotaError}
                  onChange={this.handleChangeNumber}
                  value={form.kodeKota}
                />
              </Form.Field>
              <Form.Field required>
                <label>Kode Kota (Kemendagri)</label>
                <Form.Input
                  fluid
                  placeholder="Kode Kota (Kemendagri)"
                  error={form.kodeKotaCapilError}
                  maxLength="4"
                  id="kodeKotaCapil"
                  onChange={this.handleChangeNumber}
                  value={form.kodeKotaCapil}
                />
              </Form.Field>
              <Form.Field required>
                <label>Nama Kota</label>
                <Form.Input
                  fluid
                  placeholder="Nama Kota"
                  id="namaKota"
                  error={form.namaKotaError}
                  onChange={this.handleChangeToUpperCase}
                  value={form.namaKota}
                />
              </Form.Field>
            </Segment>
            {this.props.match.params.kodeKota !== "tambah" ? (
              <Button
                negative
                floated="left"
                onClick={() => this.handleDeleteKota(form)}
              >
                Hapus
              </Button>
            ) : (
              <></>
            )}
            <Button positive floated="right" type="submit" onClick={this.handleSaveKota}> Simpan </Button>
          </Form>
          <ConfirmationModal modal={modal} />
          <ToastContainer
            position="top-center"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </Container>
      );
    } else {
      return <Redirect to="/kota" />;
    }
  }
}

export default withKeycloak(KotaDetail);
