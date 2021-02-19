import React, { Component } from "react";
import { Button, Container, Dropdown, Form, Header, Loader, Message, Segment } from "semantic-ui-react";
import { withKeycloak } from "@react-keycloak/web";
import {
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
import { kelompokApi } from "../../util/KelompokApi";
import { toast, ToastContainer } from "react-toastify";

class PetugasKelompok extends Component {
  petugasViewInitialState = {
    nik: "",
    nama: "",
    alamatDomisili: "",
    rtDomisili: "", rwDomisili: "", kelurahanDomisili: "", kecamatanDomisili: "", kotaDomisili: "",
    rtTugas: "", rwTugas: "", kelurahanTugas: "", kecamatanTugas: "", kotaTugas: "",
    tempatLahir: "",
    tanggalLahir: "",
    gender: "",
    agama: "",
    noHpPetugas: "",
    noTelpPetugas: "",
    email: "",
    noSkLurah: ""
  };
  state = {
    petugasView: { ...this.petugasViewInitialState },
    isLoadingPage: false,
    isMatchWilayah: false,
    isPetugasHaveRtTugas: false,
    isPetugasHaveKelompok: false,
    isRtHaveKelompok: false,
    kelompokOptions: [],
    rtKelompok: "",
    idKelompok: []
  };

  async componentDidMount() {
    this.setState({ isLoadingPage: true });
    let petugasView = { ...this.petugasViewInitialState };
    try {
      const { keycloak } = this.props;
      const getPetugas = await kelompokApi.getPetugasByNik(this.props.match.params.nik, keycloak.token);
      const petugas = getPetugas.data;
      petugas.nik ? petugasView.nik = petugas.nik : petugasView.nik = "";
      petugas.nama ? petugasView.nama = petugas.nama : petugasView.nama = "";
      petugas.alamatDomisili ? petugasView.alamatDomisili = petugas.alamatDomisili : petugasView.alamatDomisili = "";
      if (petugas.rtDomisili) {
        petugasView.rtDomisili = petugas.rtDomisili.labelRt;
        petugasView.rwDomisili = petugas.rtDomisili.rw.labelRw;
        petugasView.kelurahanDomisili = petugas.rtDomisili.rw.kelurahan.namaKelurahan;
        petugasView.kecamatanDomisili = petugas.rtDomisili.rw.kelurahan.kecamatan.namaKecamatan;
        petugasView.kotaDomisili = petugas.rtDomisili.rw.kelurahan.kecamatan.kota.namaKota;
      }
      if (petugas.rtTugas) {
        this.setState({ isPetugasHaveRtTugas: true });
        petugasView.rtTugas = petugas.rtTugas.labelRt;
        petugasView.rwTugas = petugas.rtTugas.rw.labelRw;
        petugasView.kelurahanTugas = petugas.rtTugas.rw.kelurahan.namaKelurahan;
        petugasView.kecamatanTugas = petugas.rtTugas.rw.kelurahan.kecamatan.namaKecamatan;
        petugasView.kotaTugas = petugas.rtTugas.rw.kelurahan.kecamatan.kota.namaKota;
        if ((isRt(keycloak) && (petugas.rtTugas.kodeRt === getKodeWilayah(keycloak)))
          || (isRw(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 12) === getKodeWilayah(keycloak)))
          || (isKelurahan(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 9) === getKodeWilayah(keycloak)))
          || (isKecamatan(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 6) === getKodeWilayah(keycloak)))
          || (isKota(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 4) === getKodeWilayah(keycloak)))
          || (isProvinsi(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 2) === getKodeWilayah(keycloak)))
          || (isPusdatin(keycloak))
        ) {
          this.setState({ isMatchWilayah: true, rtKelompok: petugas.rtTugas.kodeRt });
          const getKelompok = await kelompokApi.getKelompokByRtTugas(petugas.rtTugas.kodeRt, keycloak.token);
          if (getKelompok.data.length > 0) {
            const getKelompokPetugas = await kelompokApi.getKelompokByPetugas(petugas.nik, keycloak.token);
            this.setState({
              isRtHaveKelompok: true,
              kelompokOptions: getKelompok.data,
              idKelompok: getKelompokPetugas.data
            });
          }
        }
      }
    } catch (error) {
      handleLogError(error);
      this.props.history.push("/petugas");
    }
    this.setState({ petugasView, isLoadingPage: false });
  }

  handleChangeDropdownKelompok = (e, { value }) => {
    this.setState({ idKelompok: value });
  };
  handleSavePetugasKelompok = async () => {
    this.setState({ isLoadingPage: true });
    try {
      const { nik } = this.state.petugasView;
      const rtKelompok = this.state.rtKelompok;
      const idKelompok = this.state.idKelompok;
      const petugasKelompok = { nik, idKelompok, rtKelompok };
      const { keycloak } = this.props;
      await kelompokApi.savePetugasKelompok(petugasKelompok, keycloak.token);
      toast.success(
        <div>
          <p>Data telah tersimpan, Mohon Tunggu...</p>
        </div>,
        { onClose: () => this.props.history.push("/petugas") }
      );
    } catch (error) {
      handleLogError(error);
      toast.error(
        <div>
          <p>Ada Kesalahan, Silahkan Periksa Data Anda Kembali</p>
        </div>,
        { onClose: () => this.setState({ isLoadingPage: false }) }
      );
    }
  };

  render() {
    const {
      petugasView,
      isLoadingPage,
      isMatchWilayah,
      isPetugasHaveRtTugas,
      isRtHaveKelompok,
      kelompokOptions,
      idKelompok
    } = this.state;
    return (
      <Container className="isi" text>
        {isLoadingPage ? (
          <Loader active />
        ) : (
          <div>
            <Header as="h1" textAlign="center"> {petugasView.nama} </Header>
            <Header as="h2" textAlign="center"> {petugasView.nik} </Header>
            <Message negative hidden={isPetugasHaveRtTugas}>
              <Message.Header>
                Petugas ini belum mempunyai RT Tugas.
              </Message.Header>
              <Message.Content>klik <a href={"/petugas-domisili/" + petugasView.nik}>disini</a> untuk
                menugaskan..</Message.Content>
            </Message>
            <Message negative hidden={isRtHaveKelompok || !isPetugasHaveRtTugas}>
              <Message.Header>
                RT Tugas pada petugas ini belum mempunyai Kelompok Dasawisma.
              </Message.Header>
              <Message.Content>klik <a href={"/kelompok/tambah"}>disini</a> untuk
                menugaskan..</Message.Content>
            </Message>
            <Message negative hidden={!isPetugasHaveRtTugas || isMatchWilayah}>
              <Message.Header>
                RT Tugas nya tidak berada di wilayah tugas Anda.
              </Message.Header>
            </Message>
            <Form hidden={!isMatchWilayah || !isPetugasHaveRtTugas || !isRtHaveKelompok}>
              <Segment piled>
                <Message positive>
                  <Message.List>
                    <Message.Item>Alamat Domisili : <b>{petugasView.alamatDomisili}</b></Message.Item>
                    <Message.Item>RT Domisili : <b> RT. {petugasView.rtDomisili}
                      {" "}RW. {petugasView.rwDomisili}
                      {" "}Kelurahan {petugasView.kelurahanDomisili}
                      {" "}Kecamatan {petugasView.kecamatanDomisili}
                      {" "}{petugasView.kotaDomisili}
                    </b> </Message.Item>
                    <Message.Item>Tugas : <b> RT. {petugasView.rtTugas}
                      {" "}RW. {petugasView.rwTugas}
                      {" "}Kelurahan {petugasView.kelurahanTugas}
                      {" "}Kecamatan {petugasView.kecamatanTugas}
                      {" "}{petugasView.kotaTugas}
                    </b> </Message.Item>
                  </Message.List>
                </Message>
                <Form.Field>
                  <label>Kelompok Penugasan</label>
                  <Dropdown id={"idKelompok"} placeholder="Kelompok Dasawisma" fluid multiple selection
                            options={kelompokOptions} onChange={this.handleChangeDropdownKelompok}
                            value={idKelompok} />
                </Form.Field>
              </Segment>
              <Button positive floated="right" type="submit" onClick={this.handleSavePetugasKelompok}
                      disabled={!isMatchWilayah || !isPetugasHaveRtTugas || !isRtHaveKelompok}>
                Simpan
              </Button>
            </Form>
          </div>
        )}
        <ToastContainer position="top-center" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick
                        rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      </Container>
    );
  }
}

export default withKeycloak(PetugasKelompok);