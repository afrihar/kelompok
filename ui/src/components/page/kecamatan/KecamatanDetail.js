import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { Button, Container, Form, Header } from "semantic-ui-react";
import { kelompokApi } from "../../util/KelompokApi";
import { handleLogError, isKota, isProvinsi, isPusdatin } from "../../util/Helpers";
import { Redirect } from "react-router-dom";
import ConfirmationModal from "../../util/ConfirmationModal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class KecamatanDetail extends Component {
  formInitialState = {
    kota: { kodeKota: "" },
    kodeKecamatan: "",
    kodeKecamatanCapil: "",
    namaKecamatan: "",
    kodeKecamatanError: false,
    kodeKecamatanCapilError: false,
    namaKecamatanError: false,
    kotaError: false
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
    deleteKecamatan: null,
    kotaOptions: [],
    readOnly: true,
    isLoadingForm: false
  };

  async componentDidMount() {
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    try {
      const getKotaOptions = await kelompokApi.getKecamatanOptionsKota(
        keycloak.token
      );
      const kotaOptions = getKotaOptions.data;
      this.setState({ kotaOptions });
    } catch (error) {
      toast.error(error.request.response);
      handleLogError(error);
    }
    const param = this.props.match.params.kodeKecamatan;
    if (param === "tambah") {
      this.setState({ form: { ...this.formInitialState }, readOnly: false });
    } else {
      try {
        const response = await kelompokApi.getKecamatanByKode(
          param,
          keycloak.token
        );
        const kecamatan = response.data;
        const kodeKota = kecamatan.kota ? kecamatan.kota.kodeKota : "";
        const form = {
          kota: { kodeKota: kodeKota },
          kodeKecamatan: kecamatan.kodeKecamatan,
          kodeKecamatanCapil: kecamatan.kodeKecamatanCapil,
          namaKecamatan: kecamatan.namaKecamatan,
          kodeKecamatanError: false,
          kodeKecamatanCapilError: false,
          namaKecamatanError: false
        };
        this.setState({ form });
      } catch (error) {
        handleLogError(error);
        this.props.history.push("/kecamatan");
      }
    }
    this.setState({ isLoadingForm: false });
  }

  isValidForm = async () => {
    const form = { ...this.state.form };
    let kodeKecamatanError = false;
    let kodeKecamatanCapilError = false;
    let namaKecamatanError = false;
    let kotaError = false;
    form.kodeKecamatanError = kodeKecamatanError;
    form.kodeKecamatanCapilError = kodeKecamatanCapilError;
    form.namaKecamatanError = namaKecamatanError;
    form.kotaError = kotaError;
    if (form.kodeKecamatan.trim() === "") {
      kodeKecamatanError = true;
      form.kodeKecamatanError = {
        pointing: "below",
        content: "Kode Kecamatan harus diisi"
      };
    } else if (form.kodeKecamatan.length !== 6) {
      kodeKecamatanError = true;
      form.kodeKecamatanError = {
        pointing: "below",
        content: "Kode Kecamatan harus 6 digit"
      };
    } else if (form.kota.kodeKota !== form.kodeKecamatan.substr(0, 4)) {
      kodeKecamatanError = true;
      form.kodeKecamatanError = {
        pointing: "below",
        content: "Kode Kecamatan harus diawali dengan " + form.kota.kodeKota
      };
    } else {
      try {
        const { keycloak } = this.props;
        const response = await kelompokApi.getKecamatanByKode(
          form.kodeKecamatan,
          keycloak.token
        );
        const kecamatan = response.data;
        kodeKecamatanError = true;
        form.kodeKecamatanError = {
          pointing: "below",
          content:
            "Kode Kecamatan sudah terpakai oleh Kecamatan " +
            kecamatan.namaKecamatan
        };
      } catch (error) {
        handleLogError(error);
        kodeKecamatanError = false;
        form.kodeKecamatanError = false;
      }
    }
    if (form.kodeKecamatanCapil.trim() === "") {
      kodeKecamatanCapilError = true;
      form.kodeKecamatanCapilError = {
        pointing: "below",
        content: "Kode Kecamatan Kemendagri harus diisi"
      };
    } else if (form.kodeKecamatanCapil.length !== 6) {
      kodeKecamatanCapilError = true;
      form.kodeKecamatanCapilError = {
        pointing: "below",
        content: "Kode Kecamatan Kemendagri harus 6 digit"
      };
    } else {
      try {
        const { keycloak } = this.props;
        const response = await kelompokApi.getKecamatanByKodeCapil(
          form.kodeKecamatanCapil,
          keycloak.token
        );
        const kecamatan = response.data;
        kodeKecamatanCapilError = true;
        form.kodeKecamatanCapilError = {
          pointing: "below",
          content:
            "Kode Kecamatan Capil sudah terpakai oleh Kecamatan " +
            kecamatan.namaKecamatan
        };
      } catch (error) {
        handleLogError(error);
        kodeKecamatanCapilError = false;
        form.kodeKecamatanCapilError = false;
      }
    }
    if (form.namaKecamatan.trim() === "") {
      namaKecamatanError = true;
      form.namaKecamatanError = {
        pointing: "below",
        content: "Nama Kecamatan harus diisi"
      };
    }
    if (form.kota.kodeKota.trim() === "") {
      kotaError = true;
      form.kotaError = { pointing: "below", content: "Kota harus dipilih" };
    }
    this.setState({ form });
    return !(
      kodeKecamatanError ||
      kodeKecamatanCapilError ||
      namaKecamatanError ||
      kotaError
    );
  };
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props;
      const { deleteKecamatan } = this.state;
      try {
        await kelompokApi.deleteKecamatan(
          deleteKecamatan.kodeKecamatan,
          keycloak.token
        );
        toast.info(
          <div>
            <p>
              Kecamatan {deleteKecamatan.namaKecamatan} telah dihapus, Mohon
              Tunggu...
            </p>
          </div>,
          { onClose: () => this.props.history.push("/kecamatan") }
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
    form.kota.kodeKota = value;
    form.kotaError = false;
    if (this.props.match.params.kodeKecamatan === "tambah") {
      form.kodeKecamatan = value;
      form.kodeKecamatanCapil = value;
    }
    this.setState({ form });
  };
  handleSaveKecamatan = async () => {
    if (!(await this.isValidForm())) {
      return;
    }
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    const {
      kodeKecamatan,
      kodeKecamatanCapil,
      namaKecamatan,
      kota
    } = this.state.form;
    const kecamatan = {
      kodeKecamatan,
      kodeKecamatanCapil,
      namaKecamatan,
      kota
    };
    try {
      await kelompokApi.saveKecamatan(kecamatan, keycloak.token);
      toast.success(
        <div>
          <p>Data telah tersimpan, Mohon Tunggu...</p>
        </div>,
        { onClose: () => this.props.history.push("/kecamatan") }
      );
    } catch (error) {
      toast.error(
        <div>
          <p>Ada Kesalahan, Silahkan Periksa Kode Kecamatan</p>
        </div>,
        { onClose: () => this.setState({ isLoadingForm: false }) }
      );
      handleLogError(error);
    }
  };
  handleDeleteKecamatan = (kecamatan) => {
    this.setState({ isLoadingForm: true });
    const modal = {
      isOpen: true,
      header: "Hapus Kecamatan",
      content: `Apakah anda yakin akan menghapus Kecamatan '${kecamatan.namaKecamatan}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    };
    this.setState({ modal, deleteKecamatan: kecamatan });
  };

  render() {
    const { keycloak } = this.props;
    const { isLoadingForm, modal, form, readOnly, kotaOptions } = this.state;
    if (isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak)) {
      return (
        <Container className="isi" text>
          <Header as="h1" textAlign="center">
            Tambah Kecamatan
          </Header>
          <Form loading={isLoadingForm}>
            <Form.Field required>
              <label>Kota</label>
              <Form.Dropdown
                placeholder="Kota"
                noResultsMessage="Tidak ada nama Kota..."
                onChange={this.handleChangeDropdown}
                search
                disabled={readOnly}
                options={kotaOptions}
                error={form.kotaError}
                selection
                clearable
                value={
                  form.kota.kodeKota === "" ? undefined : form.kota.kodeKota
                }
              />
            </Form.Field>
            <Form.Field required>
              <label>Kode Kecamatan (Tidak Dapat Diubah)</label>
              <Form.Input
                fluid
                readOnly={readOnly}
                placeholder="Kode Kecamatan"
                maxLength="6"
                id="kodeKecamatan"
                error={form.kodeKecamatanError}
                onChange={this.handleChangeNumber}
                value={form.kodeKecamatan}
              />
            </Form.Field>
            <Form.Field required>
              <label>Kode Kecamatan (Kemendagri)</label>
              <Form.Input
                fluid
                placeholder="Kode Kecamatan (Kemendagri)"
                error={form.kodeKecamatanCapilError}
                maxLength="6"
                id="kodeKecamatanCapil"
                onChange={this.handleChangeNumber}
                value={form.kodeKecamatanCapil}
              />
            </Form.Field>
            <Form.Field required>
              <label>Nama Kecamatan</label>
              <Form.Input
                fluid
                placeholder="Nama Kecamatan"
                id="namaKecamatan"
                error={form.namaKecamatanError}
                onChange={this.handleChangeToUpperCase}
                value={form.namaKecamatan}
              />
            </Form.Field>
            {this.props.match.params.kodeKecamatan !== "tambah" ? (
              <Button
                negative
                floated="left"
                onClick={() => this.handleDeleteKecamatan(form)}
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
              onClick={this.handleSaveKecamatan}
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
      return <Redirect to="/kecamatan" />;
    }
  }
}

export default withKeycloak(KecamatanDetail);
