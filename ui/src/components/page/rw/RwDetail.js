import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { handleLogError, isKecamatan, isKelurahan, isKota, isProvinsi, isPusdatin } from "../../util/Helpers";
import { Redirect } from "react-router-dom";
import { kelompokApi } from "../../util/KelompokApi";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Divider, Form, Header, Icon, Segment } from "semantic-ui-react";
import ConfirmationModal from "../../util/ConfirmationModal";

class RwDetail extends Component {
  formInitialState = {
    kelurahan: { kodeKelurahan: "", namaKelurahan: "" },
    kodeRw: "",
    labelRw: "",
    namaKetuaRw: "",
    noHpRw: "",
    noTelpRw: "",
    noTelpRwAlt: "",
    kodeRwError: false,
    labelRwError: false,
    kelurahanError: false
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
    deleteRw: null,
    kelurahanOptions: [],
    readOnly: true,
    isLoadingForm: false
  };

  async componentDidMount() {
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    try {
      const getKelurahanOptions = await kelompokApi.getRwOptionsKelurahan(
        keycloak.token
      );
      const kelurahanOptions = getKelurahanOptions.data;
      this.setState({ kelurahanOptions });
    } catch (error) {
      handleLogError(error);
    }
    const param = this.props.match.params.kodeRw;
    if (param === "tambah") {
      this.setState({ form: { ...this.formInitialState }, readOnly: false });
    } else {
      try {
        const response = await kelompokApi.getRwByKode(param, keycloak.token);
        const rw = response.data;
        const kodeKelurahan = rw.kelurahan ? rw.kelurahan.kodeKelurahan : "";
        const namaKelurahan = rw.kelurahan ? rw.kelurahan.namaKelurahan : "";
        const form = {
          kelurahan: { kodeKelurahan: kodeKelurahan, namaKelurahan: namaKelurahan },
          kodeRw: rw.kodeRw,
          labelRw: rw.labelRw,
          namaKetuaRw: rw.namaKetuaRw,
          noHpRw: rw.noHpRw,
          noTelpRw: rw.noTelpRw,
          noTelpRwAlt: rw.noTelpRwAlt,
          kodeRwError: false,
          labelRwError: false
        };
        this.setState({ form });
      } catch (error) {
        handleLogError(error);
        this.props.history.push("/rw");
      }
    }
    this.setState({ isLoadingForm: false });
  }

  isValidForm = async () => {
    const form = { ...this.state.form };
    let kodeRwError = false;
    let labelRwError = false;
    let kelurahanError = false;
    form.kodeRwError = kodeRwError;
    form.labelRwError = labelRwError;
    form.kelurahanError = kelurahanError;
    if (form.kodeRw.trim() === "") {
      kodeRwError = true;
      form.kodeRwError = { pointing: "below", content: "Kode Rw harus diisi" };
    } else if (form.kodeRw.length !== 12) {
      kodeRwError = true;
      form.kodeRwError = {
        pointing: "below",
        content: "Kode Rw harus 12 digit"
      };
    } else if (form.kelurahan.kodeKelurahan !== form.kodeRw.substr(0, 9)) {
      kodeRwError = true;
      form.kodeRwError = {
        pointing: "below",
        content: "Kode RW harus diawali dengan " + form.kelurahan.kodeKelurahan
      };
    } else {
      if (this.props.match.params.kodeRw === "tambah") {
        try {
          const { keycloak } = this.props;
          const response = await kelompokApi.getRwByKode(
            form.kodeRw,
            keycloak.token
          );
          const rw = response.data;
          kodeRwError = true;
          form.labelRwError = {
            pointing: "below",
            content:
              "RW " +
              rw.labelRw +
              " sudah ada di kelurahan " +
              rw.kelurahan.namaKelurahan
          };
        } catch (error) {
          handleLogError(error);
          kodeRwError = false;
          form.labelRwError = false;
        }
      }
    }
    if (form.labelRw.trim() === "") {
      labelRwError = true;
      form.labelRwError = {
        pointing: "below",
        content: "Label Rw harus diisi"
      };
    } else if (form.labelRw.length !== 3) {
      labelRwError = true;
      form.labelRwError = {
        pointing: "below",
        content: "Label Rw harus 3 digit"
      };
    } else if (form.labelRw.trim() === "000") {
      labelRwError = true;
      form.labelRwError = {
        pointing: "below",
        content: "Label Rw tidak boleh 000"
      };
    }
    if (form.kelurahan.kodeKelurahan.trim() === "") {
      kelurahanError = true;
      form.kelurahanError = {
        pointing: "below",
        content: "Kelurahan harus dipilih"
      };
    }
    this.setState({ form });
    return !(kodeRwError || labelRwError || kelurahanError);
  };
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props;
      const { deleteRw } = this.state;
      try {
        await kelompokApi.deleteRw(deleteRw.kodeRw, keycloak.token);
        toast.info(
          <div>
            <p>RW {deleteRw.labelRw} telah dihapus, Mohon Tunggu...</p>
          </div>,
          { onClose: () => this.props.history.push("/rw") }
        );
      } catch (error) {
        toast.error(error.request.response, {
          onClose: () => this.setState({ isLoadingForm: false })
        });
        handleLogError(error);
      }
    }
    this.setState({ modal: { ...this.modalInitialState } });
  };
  handleCloseModal = () => {
    this.setState({
      modal: { ...this.modalInitialState },
      isLoadingForm: false
    });
  };
  handleChange = (e) => {
    const { id, value } = e.target;
    const form = { ...this.state.form };
    form[id] = value;
    this.setState({ form });
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
  handleChangeLabelRw = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form.labelRwError = false;
      form.kodeRwError = false;
      form[id] = value;
      form.kodeRw = form.kelurahan.kodeKelurahan.trim() + value;
      this.setState({ form });
    }
  };
  handleChangeDropdown = (e, { value }) => {
    const form = { ...this.state.form };
    form.kelurahan.kodeKelurahan = value;
    form.kelurahanError = false;
    form.kodeRwError = false;
    form.kodeRw = value + form.labelRw;
    this.setState({ form });
  };
  handleSaveRw = async () => {
    if (!(await this.isValidForm())) {
      return;
    }
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    const {
      kodeRw,
      labelRw,
      namaKetuaRw,
      noHpRw,
      noTelpRw,
      noTelpRwAlt,
      kelurahan
    } = this.state.form;
    const rw = {
      kodeRw,
      labelRw,
      namaKetuaRw,
      noHpRw,
      noTelpRw,
      noTelpRwAlt,
      kelurahan
    };
    try {
      await kelompokApi.saveRw(rw, keycloak.token);
      toast.success(
        <div>
          <p>Data telah tersimpan, Mohon Tunggu...</p>
        </div>,
        { onClose: () => this.props.history.push("/rw") }
      );
    } catch (error) {
      toast.error(
        <div>
          <p>Ada Kesalahan, Silahkan Periksa Data RW..</p>
        </div>,
        { onClose: () => this.setState({ isLoadingForm: false }) }
      );

      handleLogError(error);
    }
  };
  handleDeleteRw = (rw) => {
    this.setState({ isLoadingForm: true });
    const modal = {
      isOpen: true,
      header: "Hapus RW",
      content: `Apakah anda yakin akan menghapus RW '${rw.labelRw}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    };
    this.setState({ modal, deleteRw: rw });
  };
  handleClickBack = () => this.props.history.push("/rw");
  handleKeyPressBack = (e) => {
    if (e.charCode === 32 || e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      this.props.history.push("/rw");
    }
  };

  render() {
    const { keycloak } = this.props;
    const {
      isLoadingForm,
      modal,
      form,
      readOnly,
      kelurahanOptions
    } = this.state;
    if (
      isPusdatin(keycloak) ||
      isProvinsi(keycloak) ||
      isKota(keycloak) ||
      isKecamatan(keycloak) ||
      isKelurahan(keycloak)
    ) {
      return (
        <Container className="isi" text>
          {this.props.match.params.kodeRw === "tambah" ? (
            <Header as="h1" textAlign="center"> Tambah Rw </Header>
          ) : (
            <Header as="h1" textAlign="center">RW {form.labelRw} Kelurahan {form.kelurahan.namaKelurahan}</Header>
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
                <label>Kode RW (Tidak Dapat Diubah)</label>
                <Form.Input
                  fluid
                  readOnly
                  placeholder="Kode RW"
                  maxLength="12"
                  id="kodeRw"
                  error={form.kodeRwError}
                  onChange={this.handleChangeNumber}
                  value={form.kodeRw}
                />
              </Form.Field>
              <Divider />
              <Form.Field>
                <label>Kelurahan</label>
                <Form.Dropdown
                  placeholder="Kelurahan"
                  noResultsMessage="Tidak ada nama Kelurahan..."
                  onChange={this.handleChangeDropdown}
                  search
                  disabled={readOnly}
                  options={kelurahanOptions}
                  error={form.kelurahanError}
                  selection
                  clearable
                  value={
                    form.kelurahan.kodeKelurahan === ""
                      ? undefined
                      : form.kelurahan.kodeKelurahan
                  }
                />
              </Form.Field>
              <Form.Field required>
                <label>Label RW (3 digit)</label>
                <Form.Input
                  fluid
                  readOnly={readOnly}
                  placeholder="Label RW"
                  error={form.labelRwError}
                  maxLength="3"
                  id="labelRw"
                  onChange={this.handleChangeLabelRw}
                  value={form.labelRw}
                />
              </Form.Field>
              <Form.Field>
                <label>Nama Ketua RW</label>
                <Form.Input
                  fluid
                  placeholder="Nama Ketua RW"
                  id="namaKetuaRw"
                  onChange={this.handleChange}
                  value={form.namaKetuaRw}
                />
              </Form.Field>
              <Form.Field>
                <label>Nomor Handphone RW</label>
                <Form.Input
                  fluid
                  placeholder="Nomor Handphone RW"
                  id="noHpRw"
                  onChange={this.handleChangeNumber}
                  value={form.noHpRw}
                />
              </Form.Field>
              <Form.Field>
                <label>Nomor Telp RW</label>
                <Form.Input
                  fluid
                  placeholder="Nomor Telp RW"
                  id="noTelpRw"
                  onChange={this.handleChangeNumber}
                  value={form.noTelpRw}
                />
              </Form.Field>
              <Form.Field>
                <label>Nomor Telp RW (Alternatif)</label>
                <Form.Input
                  fluid
                  placeholder="Nomor Telp RW (Alternatif)"
                  id="noTelpRwAlt"
                  onChange={this.handleChangeNumber}
                  value={form.noTelpRwAlt}
                />
              </Form.Field>
            </Segment>
            {this.props.match.params.kodeRw !== "tambah" ? (
              <Button
                negative
                floated="left"
                onClick={() => this.handleDeleteRw(form)}
              >
                Hapus
              </Button>
            ) : (
              <></>
            )}
            <Button
              positive
              floated="right"
              type="submit"
              onClick={this.handleSaveRw}
            >
              Simpan
            </Button>
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
      return <Redirect to="/rw" />;
    }
  }
}

export default withKeycloak(RwDetail);