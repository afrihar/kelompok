import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { handleLogError, isKecamatan, isKelurahan, isKota, isProvinsi, isPusdatin, isRw } from "../../util/Helpers";
import { Redirect } from "react-router-dom";
import { kelompokApi } from "../../util/KelompokApi";
import { toast, ToastContainer } from "react-toastify";
import { Button, Container, Divider, Form, Header, Icon, Popup, Segment } from "semantic-ui-react";
import ConfirmationModal from "../../util/ConfirmationModal";

class RtDetail extends Component {
  formInitialState = {
    rw: { kodeRw: "" },
    kodeRt: "",
    labelRt: "",
    namaKetuaRt: "",
    noHpRt: "",
    noTelpRt: "",
    noTelpRtAlt: "",
    jumlahKelompok: "",
    targetBangunan: "",
    targetRumahTangga: "",
    targetKeluarga: "",
    targetIndividu: "",
    kodeRtError: false,
    labelRtError: false,
    rwError: false
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
    deleteRt: null,
    rwOptions: [],
    readOnly: true,
    isLoadingForm: false
  };

  async componentDidMount() {
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    try {
      const getRwOptions = await kelompokApi.getRtOptionsRw(keycloak.token);
      const rwOptions = getRwOptions.data;
      this.setState({ rwOptions });
    } catch (error) {
      handleLogError(error);
    }
    const param = this.props.match.params.kodeRt;
    if (param === "tambah") {
      this.setState({ form: { ...this.formInitialState }, readOnly: false });
    } else {
      try {
        const response = await kelompokApi.getRtByKode(param, keycloak.token);
        const rt = response.data;
        const responseJmlKelompok = await kelompokApi.getJumlahKelompokByRt(rt.kodeRt, keycloak.token);
        const kodeRw = rt.rw ? rt.rw.kodeRw : "";
        const form = {
          rw: { kodeRw: kodeRw },
          kodeRt: rt.kodeRt,
          labelRt: rt.labelRt,
          namaKetuaRt: rt.namaKetuaRt,
          noHpRt: rt.noHpRt,
          noTelpRt: rt.noTelpRt,
          noTelpRtAlt: (rt.noTelpRtAlt ? null : ""),
          jumlahKelompok : responseJmlKelompok.data,
          targetBangunan: rt.targetBangunan,
          targetRumahTangga: rt.targetRumahTangga,
          targetKeluarga: rt.targetKeluarga,
          targetIndividu: rt.targetIndividu,
          kodeRtError: false,
          labelRtError: false
        };
        this.setState({ form });
      } catch (error) {
        handleLogError(error);
        this.props.history.push("/rt");
      }
    }
    this.setState({ isLoadingForm: false });
  }

  isValidForm = async () => {
    const form = { ...this.state.form };
    let kodeRtError = false;
    let labelRtError = false;
    let rwError = false;
    form.kodeRtError = kodeRtError;
    form.labelRtError = labelRtError;
    form.rwError = rwError;
    if (form.kodeRt.trim() === "") {
      kodeRtError = true;
      form.kodeRtError = { pointing: "below", content: "Kode Rt harus diisi" };
    } else if (form.kodeRt.length !== 15) {
      kodeRtError = true;
      form.kodeRtError = {
        pointing: "below",
        content: "Kode Rt harus 15 digit"
      };
    } else if (form.rw.kodeRw !== form.kodeRt.substr(0, 12)) {
      kodeRtError = true;
      form.kodeRtError = {
        pointing: "below",
        content: "Kode RT harus diawali dengan " + form.rw.kodeRw
      };
    } else {
      if (this.props.match.params.kodeRt === "tambah") {
        try {
          const { keycloak } = this.props;
          const response = await kelompokApi.getRtByKode(
            form.kodeRt,
            keycloak.token
          );
          const rt = response.data;
          kodeRtError = true;
          form.labelRtError = {
            pointing: "below",
            content: "RT " + rt.labelRt + " sudah ada di RW " + rt.rw.labelRw
          };
        } catch (error) {
          handleLogError(error);
          kodeRtError = false;
          form.labelRtError = false;
        }
      }
    }
    if (form.labelRt.trim() === "") {
      labelRtError = true;
      form.labelRtError = {
        pointing: "below",
        content: "Label Rt harus diisi"
      };
    } else if (form.labelRt.length !== 3) {
      labelRtError = true;
      form.labelRtError = {
        pointing: "below",
        content: "Label Rt harus 3 digit"
      };
    } else if (form.labelRt.trim() === "000") {
      labelRtError = true;
      form.labelRtError = {
        pointing: "below",
        content: "Label Rt Tidak boleh 000"
      };
    }
    if (form.rw.kodeRw.trim() === "") {
      rwError = true;
      form.rwError = { pointing: "below", content: "Rw harus dipilih" };
    }
    this.setState({ form });
    return !(kodeRtError || labelRtError || rwError);
  };
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props;
      const { deleteRt } = this.state;
      try {
        await kelompokApi.deleteRt(deleteRt.kodeRt, keycloak.token);
        toast.info(
          <div>
            <p>RT {deleteRt.labelRt} telah dihapus, Mohon Tunggu...</p>
          </div>,
          { onClose: () => this.props.history.push("/rt") }
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
  handleChangeLabelRt = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form.labelRtError = false;
      form.kodeRtError = false;
      form[id] = value;
      form.kodeRt = form.rw.kodeRw.trim() + value;
      this.setState({ form });
    }
  };
  handleChangeDropdown = (e, { value }) => {
    const form = { ...this.state.form };
    form.rw.kodeRw = value;
    form.rwError = false;
    form.kodeRtError = false;
    form.kodeRt = value + form.labelRt;
    this.setState({ form });
  };
  handleSaveRt = async () => {
    if (!(await this.isValidForm())) {
      return;
    }
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    const {
      kodeRt,
      labelRt,
      namaKetuaRt,
      noHpRt,
      noTelpRt,
      noTelpRtAlt,
      targetBangunan,
      targetRumahTangga,
      targetKeluarga,
      targetIndividu,
      rw
    } = this.state.form;
    const rt = {
      kodeRt,
      labelRt,
      namaKetuaRt,
      noHpRt,
      noTelpRt,
      noTelpRtAlt,
      targetBangunan,
      targetRumahTangga,
      targetKeluarga,
      targetIndividu,
      rw
    };
    try {
      await kelompokApi.saveRt(rt, keycloak.token);
      toast.success(
        <div>
          <p>Data telah tersimpan, Mohon Tunggu...</p>
        </div>,
        { onClose: () => this.props.history.push("/rt") }
      );
    } catch (error) {
      toast.error(
        <div>
          <p>Ada Kesalahan, Silahkan Periksa Data RT..</p>
        </div>,
        { onClose: () => this.setState({ isLoadingForm: false }) }
      );
      handleLogError(error);
    }
  };
  handleDeleteRt = (rt) => {
    this.setState({ isLoadingForm: true });
    const modal = {
      isOpen: true,
      header: "Hapus RT",
      content: `Apakah anda yakin akan menghapus RT '${rt.labelRt}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    };
    this.setState({ modal, deleteRt: rt });
    // The deletion is done in handleActionModal function
  };
  handleClickBack = () => this.props.history.push("/rt");
  handleKeyPressBack = (e) => {
    if (e.charCode === 32 || e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      this.props.history.push("/rt");
    }
  };

  render() {
    const { keycloak } = this.props;
    const { isLoadingForm, modal, form, readOnly, rwOptions } = this.state;
    if (isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak) ||
      isKecamatan(keycloak) || isKelurahan(keycloak) || isRw(keycloak)
    ) {
      return (
        <Container className="isi" text>
          {this.props.match.params.kodeRw === "tambah" ? (
            <Header as="h1" textAlign="center"> Tambah Rt </Header>
          ) : (
            <Header as="h1" textAlign="center">RT {form.labelRt}</Header>
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
                <label>Kode RT (Tidak Dapat Diubah)</label>
                <Form.Input
                  fluid
                  readOnly
                  placeholder="Kode RT"
                  maxLength="15"
                  id="kodeRt"
                  error={form.kodeRtError}
                  onChange={this.handleChangeNumber}
                  value={form.kodeRt}
                />
              </Form.Field>
              <Divider />
              <Segment stacked>
                <Form.Field required>
                  <label>Rw</label>
                  <Form.Dropdown
                    placeholder="Rw"
                    noResultsMessage="Tidak ada nama Rw..."
                    onChange={this.handleChangeDropdown}
                    search
                    disabled={readOnly}
                    options={rwOptions}
                    error={form.rwError}
                    selection
                    clearable
                    value={form.rw.kodeRw === "" ? undefined : form.rw.kodeRw}
                  />
                </Form.Field>
                <Form.Field required>
                  <label>Label RT (3 digit)</label>
                  <Form.Input
                    fluid
                    placeholder="Label RT"
                    error={form.labelRtError}
                    readOnly={readOnly}
                    maxLength="3"
                    id="labelRt"
                    onChange={this.handleChangeLabelRt}
                    value={form.labelRt}
                  />
                </Form.Field>
              </Segment>
              <Divider />
              <Segment stacked>
                <Header as="h3" textAlign="center">Jumlah Kelompok : {form.jumlahKelompok}</Header>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Jumlah Bangunan di RT {form.labelRt} {" "}
                      <Popup
                        trigger={<Icon name="info circle" color='red' />}
                        content="Jumlah Target Bangunan akan dijadikan dasar untuk pembentukan Kelompok secara otomatis per RT, harap input dengan benar."
                        position="top center"
                      /></label>
                    <Form.Input
                      icon="home" iconPosition="left"
                      fluid
                      placeholder="Target Bangunan per RT"
                      maxLength="4"
                      id="targetBangunan"
                      onChange={this.handleChangeNumber}
                      value={form.targetBangunan} />
                  </Form.Field>
                  <Form.Field>
                    <label>Jumlah Rumah Tangga di RT {form.labelRt}</label>
                    <Form.Input
                      icon="industry" iconPosition="left"
                      fluid
                      placeholder="Target Rumah Tangga per RT"
                      maxLength="5"
                      id="targetRumahTangga"
                      onChange={this.handleChangeNumber}
                      value={form.targetRumahTangga} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Jumlah Keluarga di RT {form.labelRt}</label>
                    <Form.Input
                      icon="users" iconPosition="left"
                      fluid
                      placeholder="Target Keluarga per RT"
                      maxLength="6"
                      id="targetKeluarga"
                      onChange={this.handleChangeNumber}
                      value={form.targetKeluarga} />
                  </Form.Field>
                  <Form.Field>
                    <label>Jumlah Individu di RT {form.labelRt}</label>
                    <Form.Input
                      icon="child" iconPosition="left"
                      fluid
                      placeholder="Target Individu per RT"
                      maxLength="7"
                      id="targetIndividu"
                      onChange={this.handleChangeNumber}
                      value={form.targetIndividu} />
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Divider />
              <Segment stacked>
                <Form.Field>
                  <label>Nama Ketua RT</label>
                  <Form.Input
                    fluid
                    placeholder="Nama Ketua RT"
                    id="namaKetuaRt"
                    onChange={this.handleChange}
                    value={form.namaKetuaRt}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Nomor Handphone RT</label>
                  <Form.Input
                    fluid
                    placeholder="Nomor Handphone RT"
                    id="noHpRt"
                    onChange={this.handleChangeNumber}
                    value={form.noHpRt}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Nomor Telp RT</label>
                  <Form.Input
                    fluid
                    placeholder="Nomor Telp RT"
                    id="noTelpRt"
                    onChange={this.handleChangeNumber}
                    value={form.noTelpRt}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Nomor Telp RT (Alternatif)</label>
                  <Form.Input
                    fluid
                    placeholder="Nomor Telp RT (Alternatif)"
                    id="noTelpRtAlt"
                    onChange={this.handleChangeNumber}
                    value={form.noTelpRtAlt}
                  />
                </Form.Field>
              </Segment>
            </Segment>
            {this.props.match.params.kodeRt !== "tambah" ? (
              <Button negative floated="left" onClick={() => this.handleDeleteRt(form)}> Hapus </Button>
            ) : (
              <></>
            )}
            <Button positive floated="right" type="submit" onClick={this.handleSaveRt}> Simpan </Button>
          </Form>
          <ConfirmationModal modal={modal} />
          <ToastContainer draggable rtl={false} newestOnTop pauseOnHover closeOnClick autoClose={3500}
                          pauseOnFocusLoss position="top-center" hideProgressBar={false} />
        </Container>
      );
    } else {
      return <Redirect to="/rt" />;
    }
  }
}

export default withKeycloak(RtDetail);