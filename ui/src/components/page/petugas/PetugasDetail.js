import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { kelompokApi } from "../../util/KelompokApi";
import { toast, ToastContainer } from "react-toastify";
import {
  handleLogError,
  isKecamatan,
  isKelurahan,
  isKota,
  isProvinsi,
  isPusdatin,
  isRt,
  isRw
} from "../../util/Helpers";
import { Button, Container, Form, Header, Message, Segment } from "semantic-ui-react";
import { Redirect } from "react-router-dom";
import ConfirmationModal from "../../util/ConfirmationModal";
import { DateInput } from "semantic-ui-calendar-react";

class PetugasDetail extends Component {
  modalInitialState = {
    isOpen: false,
    header: "",
    content: "",
    onAction: null,
    onClose: null
  };
  formInitialState = {
    nik: "",
    nama: "", alamatDomisili: "",
    gender: "", agama: { id: 0 },
    tempatLahir: "", tanggalLahir: "",
    kotaDomisili: { kodeKota: "" },
    kecamatanDomisili: { kodeKecamatan: "" }, kelurahanDomisili: { kodeKelurahan: "" },
    rwDomisili: { kodeRw: "" }, rtDomisili: { kodeRt: "" },
    noHpPetugas: "", noTelpPetugas: "",
    email: "", noRekening: "",
    noNpwp: "", noSkLurah: "",
    kotaTugas: { kodeKota: "" },
    kecamatanTugas: { kodeKecamatan: "" }, kelurahanTugas: { kodeKelurahan: "" },
    rwTugas: { kodeRw: "" }, rtTugas: { kodeRt: "" },
    namaIbuKandung: "", pendidikan: { id: 0 },
    pekerjaan: { id: 0 }, statusPekerjaan: { id: 0 },
    statusPernikahan: { id: 0 }, namaPasangan: "",
    namaEmergencyCall: "", alamatEmergencyCall: "",
    provinsiEmergencyCall: { kodeProvinsi: "" }, kotaEmergencyCall: { kodeKota: "" },
    noHpEmergencyCall: "", hubunganEmergency: { id: 0 }
  };
  errorInitialState = {
    nama: false, alamatDomisili: false,
    gender: false, agama: false,
    noHpPetugas: false, noTelpPetugas: false,
    email: false, noRekening: false,
    rtDomisili: false, rtTugas: false
  };
  messageInitialState = {
    isMatchWilayah: false
  };
  state = {
    namaAsli: "",
    isLoadingForm: false,
    modal: { ...this.modalInitialState },
    form: { ...this.formInitialState },
    error: { ...this.errorInitialState },
    message: { ...this.messageInitialState },
    genderOptions: [],
    agamaOptions: [],
    provinsiDomisiliOptions: [],
    kotaDomisiliOptions: [],
    kecamatanDomisiliOptions: [],
    kelurahanDomisiliOptions: [],
    rwDomisiliOptions: [],
    rtDomisiliOptions: [],
    provinsiTugasOptions: [],
    kotaTugasOptions: [],
    kecamatanTugasOptions: [],
    kelurahanTugasOptions: [],
    rwTugasOptions: [],
    rtTugasOptions: [],
    pendidikanOptions: [],
    pekerjaanOptions: [],
    statusPernikahanOptions: [],
    provinsiEmergencyCallOptions: [],
    kotaEmergencyCallOptions: [],
    hubunganEmergencyOptions: []
  };

  async componentDidMount() {
    this.setState({ isLoadingForm: true });
    const { keycloak } = this.props;
    try {
      const response = await kelompokApi.getPetugasByNik(this.props.match.params.nik, keycloak.token);
      const petugas = response.data;
      this.setState({ namaAsli: petugas.nama });
      if (petugas.rtTugas) {
        if ((isRt(keycloak) && (petugas.rtTugas.kodeRt === keycloak.tokenParsed["kode_wilayah"].toString()))
          || (isRw(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 12) === keycloak.tokenParsed["kode_wilayah"].toString()))
          || (isKelurahan(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 9) === keycloak.tokenParsed["kode_wilayah"].toString()))
          || (isKecamatan(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 6) === keycloak.tokenParsed["kode_wilayah"].toString()))
          || (isKota(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 4) === keycloak.tokenParsed["kode_wilayah"].toString()))
          || (isProvinsi(keycloak) && (petugas.rtTugas.kodeRt.substr(0, 2) === keycloak.tokenParsed["kode_wilayah"].toString()))
          || (isPusdatin(keycloak))
        ) {
          this.setState({ message: { isMatchWilayah: true } });
          const genderOptions = [{
            key: "L",
            text: "Laki laki",
            value: "L"
          }, {
            key: "P",
            text: "Perempuan",
            value: "P"
          }];
          const getAgamaOptions = await kelompokApi.getOptionsAgama(keycloak.token);
          const getPendidikanOptions = await kelompokApi.getOptionsPendidikan(keycloak.token);
          const getStatusPernikahanOptions = await kelompokApi.getOptionsStatusPernikahan(keycloak.token);
          const getPekerjaanOptions = await kelompokApi.getOptionsPekerjaan(keycloak.token);
          const getStatusPekerjaanOptions = await kelompokApi.getOptionsStatusPekerjaan(keycloak.token);
          const provinsiOptions = [{
            key: "31",
            text: "DKI JAKARTA",
            value: "31"
          }];
          const getKotaOptions = await kelompokApi.getPetugasOptionsKota(keycloak.token);
          const getProvinsiEcOptions = await kelompokApi.getPetugasOptionsProvinsiEmergency(keycloak.token);
          const getHubunganEmergencyOptions = await kelompokApi.getOptionsHubunganEmergency(keycloak.token);
          this.setState({
            genderOptions,
            agamaOptions: getAgamaOptions.data,
            pendidikanOptions: getPendidikanOptions.data,
            statusPernikahanOptions: getStatusPernikahanOptions.data,
            pekerjaanOptions: getPekerjaanOptions.data,
            statusPekerjaanOptions: getStatusPekerjaanOptions.data,
            provinsiOptions,
            kotaDomisiliOptions: getKotaOptions.data,
            kotaTugasOptions: getKotaOptions.data,
            provinsiEmergencyCallOptions: getProvinsiEcOptions.data,
            hubunganEmergencyOptions: getHubunganEmergencyOptions.data
          });
          let form = { ...this.formInitialState };
          if (petugas.nik) form.nik = petugas.nik;
          if (petugas.nama) form.nama = petugas.nama;
          if (petugas.alamatDomisili) form.alamatDomisili = petugas.alamatDomisili;
          if (petugas.gender) form.gender = petugas.gender;
          if (petugas.agama) form.agama.id = petugas.agama.id;
          if (petugas.tempatLahir) form.tempatLahir = petugas.tempatLahir;
          if (petugas.tanggalLahir) form.tanggalLahir = petugas.tanggalLahir;
          if (petugas.noHpPetugas) form.noHpPetugas = petugas.noHpPetugas;
          if (petugas.noTelpPetugas) form.noTelpPetugas = petugas.noTelpPetugas;
          if (petugas.email) form.email = petugas.email;
          if (petugas.noRekening) form.noRekening = petugas.noRekening;
          if (petugas.noNpwp) form.noNpwp = petugas.noNpwp;
          if (petugas.noSkLurah) form.noSkLurah = petugas.noSkLurah;
          if (petugas.rtDomisili) {
            form.kotaDomisili.kodeKota = petugas.rtDomisili.rw.kelurahan.kecamatan.kota.kodeKota;
            const getKecamatanDomisiliOptions = await kelompokApi.getPetugasOptionsKecamatan(form.kotaDomisili.kodeKota, keycloak.token);
            form.kecamatanDomisili.kodeKecamatan = petugas.rtDomisili.rw.kelurahan.kecamatan.kodeKecamatan;
            const getKelurahanDomisiliOptions = await kelompokApi.getPetugasOptionsKelurahan(form.kecamatanDomisili.kodeKecamatan, keycloak.token);
            form.kelurahanDomisili.kodeKelurahan = petugas.rtDomisili.rw.kelurahan.kodeKelurahan;
            const getRwDomisiliOptions = await kelompokApi.getPetugasOptionsRw(form.kelurahanDomisili.kodeKelurahan, keycloak.token);
            form.rwDomisili.kodeRw = petugas.rtDomisili.rw.kodeRw;
            const getRtDomisiliOptions = await kelompokApi.getPetugasOptionsRt(form.rwDomisili.kodeRw, keycloak.token);
            form.rtDomisili.kodeRt = petugas.rtDomisili.kodeRt;
            this.setState({
              kecamatanDomisiliOptions: getKecamatanDomisiliOptions.data,
              kelurahanDomisiliOptions: getKelurahanDomisiliOptions.data,
              rwDomisiliOptions: getRwDomisiliOptions.data,
              rtDomisiliOptions: getRtDomisiliOptions.data
            });
          }
          if (petugas.rtTugas) {
            form.kotaTugas.kodeKota = petugas.rtTugas.rw.kelurahan.kecamatan.kota.kodeKota;
            const getKecamatanTugasOptions = await kelompokApi.getPetugasOptionsKecamatan(form.kotaTugas.kodeKota, keycloak.token);
            form.kecamatanTugas.kodeKecamatan = petugas.rtTugas.rw.kelurahan.kecamatan.kodeKecamatan;
            const getKelurahanTugasOptions = await kelompokApi.getPetugasOptionsKelurahan(form.kecamatanTugas.kodeKecamatan, keycloak.token);
            form.kelurahanTugas.kodeKelurahan = petugas.rtTugas.rw.kelurahan.kodeKelurahan;
            const getRwTugasOptions = await kelompokApi.getPetugasOptionsRw(form.kelurahanTugas.kodeKelurahan, keycloak.token);
            form.rwTugas.kodeRw = petugas.rtTugas.rw.kodeRw;
            const getRtTugasOptions = await kelompokApi.getPetugasOptionsRt(form.rwTugas.kodeRw, keycloak.token);
            form.rtTugas.kodeRt = petugas.rtTugas.kodeRt;
            this.setState({
              kecamatanTugasOptions: getKecamatanTugasOptions.data,
              kelurahanTugasOptions: getKelurahanTugasOptions.data,
              rwTugasOptions: getRwTugasOptions.data,
              rtTugasOptions: getRtTugasOptions.data
            });
          }
          if (petugas.namaIbuKandung) form.namaIbuKandung = petugas.namaIbuKandung;
          if (petugas.pendidikan) form.pendidikan.id = petugas.pendidikan.id;
          if (petugas.pekerjaan) form.pekerjaan.id = petugas.pekerjaan.id;
          if (petugas.statusPekerjaan) form.statusPekerjaan.id = petugas.statusPekerjaan.id;
          if (petugas.statusPernikahan) form.statusPernikahan.id = petugas.statusPernikahan.id;
          if (petugas.namaPasangan) form.namaPasangan = petugas.namaPasangan;
          if (petugas.namaEmergencyCall) form.namaEmergencyCall = petugas.namaEmergencyCall;
          if (petugas.alamatEmergencyCall) form.alamatEmergencyCall = petugas.alamatEmergencyCall;
          if (petugas.provinsiEmergencyCall.kodeProvinsi) {
            form.provinsiEmergencyCall.kodeProvinsi = petugas.provinsiEmergencyCall.kodeProvinsi;
            this.setState({
              isLoadingKotaEmergencyCall: true,
              kotaEmergencyCallOptions: []
            });
            try {
              const getPetugasOptionsKotaEmergencyOptions = await kelompokApi.getPetugasOptionsKotaEmergency(form.provinsiEmergencyCall.kodeProvinsi, keycloak.token);
              const kotaEmergencyCallOptions = getPetugasOptionsKotaEmergencyOptions.data;
              this.setState({ kotaEmergencyCallOptions });
            } catch (error) {
              handleLogError(error);
            }
          }
          if (petugas.kotaEmergencyCall.kodeKota) form.kotaEmergencyCall.kodeKota = petugas.kotaEmergencyCall.kodeKota;
          if (petugas.noHpEmergencyCall) form.noHpEmergencyCall = petugas.noHpEmergencyCall;
          if (petugas.hubunganEmergency) form.hubunganEmergency.id = petugas.hubunganEmergency.id;
          this.setState({ form, isLoadingKotaEmergencyCall: false });
        }
      }
    } catch (error) {
      handleLogError(error);
      this.props.history.push("/petugas");
    }
    this.setState({ isLoadingForm: false });
  }

  handleChangeNama = (e) => {
    const error = { ...this.state.error };
    error.nama = false;
    const re = /^[a-zA-Z .`]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form, error });
    }
  };
  handleChangeAlamat = (e) => {
    const error = { ...this.state.error };
    error.alamatDomisili = false;
    const re = /^[a-zA-Z0-9 .]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form, error });
    }
  };
  handleChangeDropdownGender = (e, { value }) => {
    const error = { ...this.state.error };
    error.gender = false;
    const form = { ...this.state.form };
    form.gender = value;
    this.setState({ form, error });
  };
  handleChangeDropdownAgama = (e, { value }) => {
    const error = { ...this.state.error };
    error.agama = false;
    const form = { ...this.state.form };
    if (value === "") form.agama.id = 0; else form.agama.id = value;
    this.setState({ form, error });
  };
  handleChangeTempatLahir = (e) => {
    const re = /^[a-zA-Z .]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form });
    }
  };
  handleChangeTanggalLahir = (event, { value }) => {
    const form = { ...this.state.form };
    form.tanggalLahir = value;
    this.setState({ form });
  };
  handleChangeNoHpPetugas = (e) => {
    const error = { ...this.state.error };
    error.noHpPetugas = false;
    const re = /^[0-9]+$/;
    if (
      e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ form, error });
    }
  };
  handleChangeNoTelpPetugas = (e) => {
    const error = { ...this.state.error };
    error.noTelpPetugas = false;
    const re = /^[0-9]+$/;
    if (
      e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ form, error });
    }
  };
  handleChangeEmail = (e) => {
    const error = { ...this.state.error };
    error.email = false;
    const { id, value } = e.target;
    const form = { ...this.state.form };
    form[id] = value;
    this.setState({ form, error });
  };
  handleChangeNomorRekening = (e) => {
    const error = { ...this.state.error };
    error.noRekening = false;
    const re = /^[0-9]+$/;
    if (
      e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ form, error });
    }
  };
  handleChangeNomorNPWP = (e) => {
    const re = /^[0-9]+$/;
    if (
      e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ form });
    }
  };
  handleChangeNomorSkLurah = (e) => {
    const re = /^[0-9]+$/;
    if (
      e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ form });
    }
  };
  handleChangeDropdownKotaDomisili = async (e, { value }) => {
    const form = { ...this.state.form };
    form.kotaDomisili.kodeKota = value;
    this.setState({
      isLoadingKecamatanDomisili: true,
      kecamatanDomisiliOptions: [],
      kelurahanDomisiliOptions: [],
      rwDomisiliOptions: [],
      rtDomisiliOptions: []
    });
    form.kecamatanDomisili.kodeKecamatan = "";
    form.kelurahanDomisili.kodeKelurahan = "";
    form.rwDomisili.kodeRw = "";
    form.rtDomisili.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKecamatanDomisiliOptions = await kelompokApi.getPetugasOptionsKecamatan(value, keycloak.token);
        const kecamatanDomisiliOptions = getKecamatanDomisiliOptions.data;
        this.setState({ kecamatanDomisiliOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingKecamatanDomisili: false });
  };
  handleChangeDropdownKecamatanDomisili = async (e, { value }) => {
    const form = { ...this.state.form };
    form.kecamatanDomisili.kodeKecamatan = value;
    this.setState({
      isLoadingKelurahanDomisili: true,
      kelurahanDomisiliOptions: [],
      rwDomisiliOptions: [],
      rtDomisiliOptions: []
    });
    form.kelurahanDomisili.kodeKelurahan = "";
    form.rwDomisili.kodeRw = "";
    form.rtDomisili.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKelurahanDomisiliOptions = await kelompokApi.getPetugasOptionsKelurahan(value, keycloak.token);
        const kelurahanDomisiliOptions = getKelurahanDomisiliOptions.data;
        this.setState({ kelurahanDomisiliOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingKelurahanDomisili: false });
  };
  handleChangeDropdownKelurahanDomisili = async (e, { value }) => {
    const form = { ...this.state.form };
    form.kelurahanDomisili.kodeKelurahan = value;
    this.setState({
      isLoadingRwDomisili: true,
      rwDomisiliOptions: [],
      rtDomisiliOptions: []
    });
    form.rwDomisili.kodeRw = "";
    form.rtDomisili.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getRwDomisiliOptions = await kelompokApi.getPetugasOptionsRw(value, keycloak.token);
        const rwDomisiliOptions = getRwDomisiliOptions.data;
        this.setState({ rwDomisiliOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingRwDomisili: false });
  };
  handleChangeDropdownRwDomisili = async (e, { value }) => {
    const form = { ...this.state.form };
    form.rwDomisili.kodeRw = value;
    this.setState({ isLoadingRtDomisili: true, rtDomisiliOptions: [] });
    form.rtDomisili.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getRtDomisiliOptions = await kelompokApi.getPetugasOptionsRt(value, keycloak.token);
        const rtDomisiliOptions = getRtDomisiliOptions.data;
        this.setState({ rtDomisiliOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingRtDomisili: false });
  };
  handleChangeDropdownRtDomisili = (e, { value }) => {
    const error = { ...this.state.error };
    error.rtDomisili = false;
    const form = { ...this.state.form };
    form.rtDomisili.kodeRt = value;
    this.setState({ form, error });
  };
  handleChangeDropdownKotaTugas = async (e, { value }) => {
    const form = { ...this.state.form };
    form.kotaTugas.kodeKota = value;
    this.setState({
      isLoadingKecamatanTugas: true,
      kecamatanTugasOptions: [],
      kelurahanTugasOptions: [],
      rwTugasOptions: [],
      rtTugasOptions: []
    });
    form.kecamatanTugas.kodeKecamatan = "";
    form.kelurahanTugas.kodeKelurahan = "";
    form.rwTugas.kodeRw = "";
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKecamatanTugasOptions = await kelompokApi.getPetugasOptionsKecamatan(value, keycloak.token);
        const kecamatanTugasOptions = getKecamatanTugasOptions.data;
        this.setState({ kecamatanTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingKecamatanTugas: false });
  };
  handleChangeDropdownKecamatanTugas = async (e, { value }) => {
    const form = { ...this.state.form };
    form.kecamatanTugas.kodeKecamatan = value;
    this.setState({
      isLoadingKelurahanTugas: true,
      kelurahanTugasOptions: [],
      rwTugasOptions: [],
      rtTugasOptions: []
    });
    form.kelurahanTugas.kodeKelurahan = "";
    form.rwTugas.kodeRw = "";
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKelurahanTugasOptions = await kelompokApi.getPetugasOptionsKelurahan(value, keycloak.token);
        const kelurahanTugasOptions = getKelurahanTugasOptions.data;
        this.setState({ kelurahanTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingKelurahanTugas: false });
  };
  handleChangeDropdownKelurahanTugas = async (e, { value }) => {
    const form = { ...this.state.form };
    form.kelurahanTugas.kodeKelurahan = value;
    this.setState({
      isLoadingRwTugas: true,
      rwTugasOptions: [],
      rtTugasOptions: []
    });
    form.rwTugas.kodeRw = "";
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getRwTugasOptions = await kelompokApi.getPetugasOptionsRw(value, keycloak.token);
        const rwTugasOptions = getRwTugasOptions.data;
        this.setState({ rwTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingRwTugas: false });
  };
  handleChangeDropdownRwTugas = async (e, { value }) => {
    const form = { ...this.state.form };
    form.rwTugas.kodeRw = value;
    this.setState({ isLoadingRtTugas: true, rtTugasOptions: [] });
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getRtTugasOptions = await kelompokApi.getPetugasOptionsRt(value, keycloak.token);
        const rtTugasOptions = getRtTugasOptions.data;
        this.setState({ rtTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingRtTugas: false });
  };
  handleChangeDropdownRtTugas = async (e, { value }) => {
    const error = { ...this.state.error };
    error.rtTugas = false;
    const form = { ...this.state.form };
    form.rtTugas.kodeRt = value;
    this.setState({ form, error });
  };
  handleChangeNamaIbuKandung = (e) => {
    const re = /^[a-zA-Z .`]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form });
    }
  };
  handleChangeDropdownPendidikan = (e, { value }) => {
    const form = { ...this.state.form };
    if (value === "") form.pendidikan.id = 0; else form.pendidikan.id = value;
    this.setState({ form });
  };
  handleChangeDropdownPekerjaan = (e, { value }) => {
    const form = { ...this.state.form };
    if (value === "") form.pekerjaan.id = 0; else form.pekerjaan.id = value;
    this.setState({ form });
  };
  handleChangeDropdownStatusPekerjaan = (e, { value }) => {
    const form = { ...this.state.form };
    if (value === "") form.statusPekerjaan.id = 0; else form.statusPekerjaan.id = value;
    this.setState({ form });
  };
  handleChangeDropdownStatusPernikahan = (e, { value }) => {
    const form = { ...this.state.form };
    if (value === "") form.statusPernikahan.id = 0; else form.statusPernikahan.id = value;
    form.namaPasangan = "";
    this.setState({ form });
  };
  handleChangeNamaPasangan = (e) => {
    const re = /^[a-zA-Z .`]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form });
    }
  };
  handleChangeNamaEmergencyCall = (e) => {
    const re = /^[a-zA-Z .`]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form });
    }
  };
  handleChangeAlamatEmergencyCall = (e) => {
    const re = /^[a-zA-Z0-9 .]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value.toUpperCase();
      this.setState({ form });
    }
  };
  handleChangeDropdownProvinsiEmergencyCall = async (e, { value }) => {
    const form = { ...this.state.form };
    form.provinsiEmergencyCall.kodeProvinsi = value;
    this.setState({
      isLoadingKotaEmergencyCall: true,
      kotaEmergencyCallOptions: []
    });
    form.kotaEmergencyCall.kodeKota = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getPetugasOptionsKotaEmergencyOptions = await kelompokApi.getPetugasOptionsKotaEmergency(value, keycloak.token);
        const kotaEmergencyCallOptions = getPetugasOptionsKotaEmergencyOptions.data;
        this.setState({ kotaEmergencyCallOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, isLoadingKotaEmergencyCall: false });
  };
  handleChangeDropdownKotaEmergencyCall = (e, { value }) => {
    const form = { ...this.state.form };
    form.kotaEmergencyCall.kodeKota = value;
    this.setState({ form });
  };
  handleChangeNoHpEmergencyCall = (e) => {
    const re = /^[0-9]+$/;
    if (
      e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ form });
    }
  };
  handleChangeDropdownHubunganEmergency = (e, { value }) => {
    const form = { ...this.state.form };
    if (value === "") form.hubunganEmergency.id = 0; else form.hubunganEmergency.id = value;
    this.setState({ form });
  };
  isValidForm = () => {
    const form = { ...this.state.form };
    const error = { ...this.state.error };
    const emailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let namaError = false;
    let alamatDomisiliError = false;
    let genderError = false;
    let agamaError = false;
    let noHpPetugasError = false;
    let noTelpPetugasError = false;
    let emailError = false;
    let noRekeningError = false;
    let rtDomisiliError = false;
    let rtTugasError = false;
    let noHpEmergencyCallError = false;
    if (form.nama.trim() === "") {
      namaError = true;
      error.nama = { pointing: "below", content: "Nama harus diisi" };
    }
    if (form.alamatDomisili.trim() === "") {
      alamatDomisiliError = true;
      error.alamatDomisili = { pointing: "below", content: "Alamat Domisili harus diisi" };
    }
    if (form.gender.trim() === "") {
      genderError = true;
      error.gender = { pointing: "below", content: "Jenis Kelamin harus diisi" };
    }
    if (form.agama.id === 0) {
      agamaError = true;
      error.agama = { pointing: "below", content: "Agama harus diisi" };
    }
    if (form.rtDomisili.kodeRt.trim() === "") {
      rtDomisiliError = true;
      error.rtDomisili = { pointing: "above", content: "RT Domisili harus diisi" };
    }
    if (form.rtTugas.kodeRt.trim() === "") {
      rtTugasError = true;
      error.rtTugas = { pointing: "above", content: "RT Tugas harus diisi" };
    }
    if (form.noHpPetugas.trim() && form.noHpPetugas.substr(0, 2) !== "08") {
      noHpPetugasError = true;
      error.noHpPetugas = { pointing: "below", content: "No HP harus diawali \"08\"" };
    }
    if (form.noTelpPetugas.trim() && form.noTelpPetugas.substr(0, 3) !== "021") {
      noTelpPetugasError = true;
      error.noTelpPetugas = { pointing: "below", content: "No Telp harus diawali \"021\"" };
    }
    if (form.email.trim() && !emailRegEx.test(form.email)) {
      emailError = true;
      error.email = { pointing: "below", content: "Format email harus sesuai ketentuan" };
    }
    if (form.noRekening.substr(0, 1) === "0") {
      noRekeningError = true;
      error.noRekening = { pointing: "below", content: "Nomor Rekening tidak boleh diawali angka \"0\"" };
    }
    if (form.noHpEmergencyCall.trim() && form.noHpEmergencyCall.substr(0, 2) !== "08") {
      noHpEmergencyCallError = true;
      error.noHpEmergencyCall = { pointing: "below", content: "No HP harus diawali \"08\"" };
    }
    this.setState({ error });
    return (!(namaError
      || alamatDomisiliError
      || noHpPetugasError
      || noTelpPetugasError
      || emailError
      || noRekeningError
      || noHpEmergencyCallError
      || genderError
      || agamaError
      || rtDomisiliError
      || rtTugasError));
  };
  handleSavePetugas = async () => {
    if (!(this.isValidForm())) {
      return;
    }
    this.setState({ isLoadingForm: true });
    try {
      const {
        nik,
        nama,
        alamatDomisili,
        gender,
        agama,
        tempatLahir,
        tanggalLahir,
        rtDomisili,
        noHpPetugas,
        noTelpPetugas,
        email,
        noRekening,
        noNpwp,
        noSkLurah,
        rtTugas,
        namaIbuKandung,
        pendidikan,
        pekerjaan,
        statusPekerjaan,
        statusPernikahan,
        namaPasangan,
        namaEmergencyCall,
        alamatEmergencyCall,
        provinsiEmergencyCall,
        kotaEmergencyCall,
        noHpEmergencyCall,
        hubunganEmergency
      } = this.state.form;
      const petugas = {
        nik,
        nama,
        alamatDomisili,
        gender,
        agama,
        tempatLahir,
        tanggalLahir,
        rtDomisili,
        noHpPetugas,
        noTelpPetugas,
        email,
        noRekening,
        noNpwp,
        noSkLurah,
        rtTugas,
        namaIbuKandung,
        pendidikan,
        pekerjaan,
        statusPekerjaan,
        statusPernikahan,
        namaPasangan,
        namaEmergencyCall,
        alamatEmergencyCall,
        provinsiEmergencyCall,
        kotaEmergencyCall,
        noHpEmergencyCall,
        hubunganEmergency
      };
      const { keycloak } = this.props;
      await kelompokApi.savePetugas(petugas, keycloak.token);
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
        { onClose: () => this.setState({ isLoadingForm: false }) }
      );
    }
  };
  handleDeletePetugas = (petugas) => {
    this.setState({ isLoadingForm: true });
    const modal = {
      isOpen: true,
      header: "Hapus Petugas",
      content: `Apakah anda yakin akan menghapus Petugas dengan NIK '${petugas.nik}'?`,
      onAction: this.handleActionModal,
      onClose: this.handleCloseModal
    };
    this.setState({ modal, deletePetugas: petugas });
  };
  handleActionModal = async (response) => {
    if (response) {
      const { keycloak } = this.props;
      const { deletePetugas } = this.state;
      try {
        await kelompokApi.deletePetugas(deletePetugas.nik, keycloak.token);
        toast.info(
          <div>
            <p>Petugas {deletePetugas.nik} telah dihapus, Mohon Tunggu...</p>
          </div>,
          { onClose: () => this.props.history.push("/petugas") }
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

  render() {
    const {
      namaAsli,
      modal,
      form,
      error,
      message,
      isLoadingForm,
      isLoadingKecamatanDomisili,
      isLoadingKelurahanDomisili,
      isLoadingRwDomisili,
      isLoadingRtDomisili,
      isLoadingKecamatanTugas,
      isLoadingKelurahanTugas,
      isLoadingRwTugas,
      isLoadingRtTugas,
      isLoadingKotaEmergencyCall,
      genderOptions,
      agamaOptions,
      provinsiOptions,
      kotaDomisiliOptions,
      kecamatanDomisiliOptions,
      kelurahanDomisiliOptions,
      rwDomisiliOptions,
      rtDomisiliOptions,
      kotaTugasOptions,
      kecamatanTugasOptions,
      kelurahanTugasOptions,
      rwTugasOptions,
      rtTugasOptions,
      pendidikanOptions,
      statusPernikahanOptions,
      pekerjaanOptions,
      statusPekerjaanOptions,
      provinsiEmergencyCallOptions,
      kotaEmergencyCallOptions,
      hubunganEmergencyOptions
    } = this.state;
    const { keycloak } = this.props;
    if (
      isPusdatin(keycloak) ||
      isProvinsi(keycloak) ||
      isKota(keycloak) ||
      isKecamatan(keycloak) ||
      isKelurahan(keycloak) ||
      isRw(keycloak) ||
      isRt(keycloak)) {
      return (
        <Container className="isi" text>
          <Header as="h1" textAlign="center"> {namaAsli} </Header>
          <Header as="h2" textAlign="center"> {form.nik} </Header>
          <Form loading={isLoadingForm}>
            <Message negative hidden={message.isMatchWilayah}>
              <Message.Header>Petugas ini tidak berada di wilayah tugas Anda.</Message.Header>
            </Message>
            <Segment hidden={!message.isMatchWilayah} piled>
              <Segment raised>
                <Form.Group widths="equal">
                  <Form.Field required>
                    <label>Nama Petugas</label>
                    <Form.Input fluid id="nama" value={form.nama} error={error.nama}
                                placeholder="Nama Petugas" onChange={this.handleChangeNama} />
                  </Form.Field>
                  <Form.Field required>
                    <label>Alamat Domisili</label>
                    <Form.Input fluid id="alamatDomisili" value={form.alamatDomisili} placeholder="Alamat Domisili"
                                error={error.alamatDomisili} onChange={this.handleChangeAlamat} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field required>
                    <label>Jenis Kelamin</label>
                    <Form.Dropdown selection placeholder="Jenis Kelamin" options={genderOptions} error={error.gender}
                                   onChange={this.handleChangeDropdownGender} value={form.gender} />
                  </Form.Field>
                  <Form.Field required>
                    <label>Agama</label>
                    <Form.Dropdown clearable selection placeholder="Agama" options={agamaOptions} error={error.agama}
                                   onChange={this.handleChangeDropdownAgama}
                                   value={form.agama.id === 0 ? "" : form.agama.id} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Tempat Lahir</label>
                    <Form.Input fluid id="tempatLahir" value={form.tempatLahir}
                                placeholder="Tempat Lahir" onChange={this.handleChangeTempatLahir} />
                  </Form.Field>
                  <Form.Field>
                    <label>Tanggal Lahir</label>
                    <DateInput name="tanggalLahir" iconPosition="left" value={form.tanggalLahir} dateFormat="YYYY-MM-DD"
                               placeholder="Tanggal Lahir" onChange={this.handleChangeTanggalLahir}
                               maxDate={new Date()} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Nomor Handphone</label>
                    <Form.Input id="noHpPetugas" value={form.noHpPetugas} maxLength="13"
                                placeholder="Nomor Handphone" error={error.noHpPetugas}
                                onChange={this.handleChangeNoHpPetugas} />
                  </Form.Field>
                  <Form.Field>
                    <label>Nomor Telephone</label>
                    <Form.Input id="noTelpPetugas" value={form.noTelpPetugas} maxLength="13" error={error.noTelpPetugas}
                                placeholder="Nomor Telephone" onChange={this.handleChangeNoTelpPetugas} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Email</label>
                    <Form.Input fluid id="email" value={form.email}
                                placeholder="Email" error={error.email}
                                onChange={this.handleChangeEmail} />
                  </Form.Field>
                  <Form.Field>
                    <label>Nomor Rekening</label>
                    <Form.Input fluid id="noRekening" value={form.noRekening} maxLength="12"
                                placeholder="Nomor Rekening" error={error.noRekening}
                                onChange={this.handleChangeNomorRekening} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Nomor NPWP</label>
                    <Form.Input fluid id="noNpwp" value={form.noNpwp}
                                placeholder="Nomor NPWP" maxLength="15"
                                onChange={this.handleChangeNomorNPWP} />
                  </Form.Field>
                  <Form.Field>
                    <label>Nomor SK Lurah</label>
                    <Form.Input fluid id="noSkLurah" value={form.noSkLurah}
                                placeholder="Nomor SK Lurah"
                                onChange={this.handleChangeNomorSkLurah} />
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Provinsi Domisili</label>
                    <Form.Dropdown selection placeholder="Provinsi Domisili" options={provinsiOptions}
                                   value="31" />
                  </Form.Field>
                  <Form.Field>
                    <label>Kota Domisili</label>
                    <Form.Dropdown clearable selection placeholder="Kota Domisili" options={kotaDomisiliOptions}
                                   onChange={this.handleChangeDropdownKotaDomisili}
                                   value={form.kotaDomisili.kodeKota} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Kecamatan Domisili</label>
                    <Form.Dropdown clearable selection placeholder="Kecamatan Domisili"
                                   value={form.kecamatanDomisili.kodeKecamatan} loading={isLoadingKecamatanDomisili}
                                   options={kecamatanDomisiliOptions}
                                   onChange={this.handleChangeDropdownKecamatanDomisili} />
                  </Form.Field>
                  <Form.Field>
                    <label>Kelurahan Domisili</label>
                    <Form.Dropdown clearable selection placeholder="Kelurahan Domisili"
                                   value={form.kelurahanDomisili.kodeKelurahan} loading={isLoadingKelurahanDomisili}
                                   options={kelurahanDomisiliOptions}
                                   onChange={this.handleChangeDropdownKelurahanDomisili} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>RW Domisili</label>
                    <Form.Dropdown clearable selection placeholder="RW Domisili" options={rwDomisiliOptions}
                                   value={form.rwDomisili.kodeRw} onChange={this.handleChangeDropdownRwDomisili}
                                   loading={isLoadingRwDomisili} />
                  </Form.Field>
                  <Form.Field required>
                    <label>RT Domisili</label>
                    <Form.Dropdown clearable selection placeholder="RT Domisili" options={rtDomisiliOptions}
                                   error={error.rtDomisili} value={form.rtDomisili.kodeRt}
                                   onChange={this.handleChangeDropdownRtDomisili}
                                   loading={isLoadingRtDomisili} />

                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Provinsi Tugas</label>
                    <Form.Dropdown selection placeholder="Provinsi Tugas" options={provinsiOptions} value="31" />
                  </Form.Field>
                  <Form.Field>
                    <label>Kota Tugas</label>
                    <Form.Dropdown clearable selection placeholder="Kota Tugas" options={kotaTugasOptions}
                                   onChange={this.handleChangeDropdownKotaTugas} value={form.kotaTugas.kodeKota} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Kecamatan Tugas</label>
                    <Form.Dropdown clearable selection placeholder="Kecamatan Tugas"
                                   options={kecamatanTugasOptions} value={form.kecamatanTugas.kodeKecamatan}
                                   onChange={this.handleChangeDropdownKecamatanTugas}
                                   loading={isLoadingKecamatanTugas} />
                  </Form.Field>
                  <Form.Field>
                    <label>Kelurahan Tugas</label>
                    <Form.Dropdown clearable selection placeholder="Kelurahan Tugas"
                                   options={kelurahanTugasOptions} value={form.kelurahanTugas.kodeKelurahan}
                                   onChange={this.handleChangeDropdownKelurahanTugas}
                                   loading={isLoadingKelurahanTugas} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>RW Tugas</label>
                    <Form.Dropdown clearable selection placeholder="RW Tugas" options={rwTugasOptions}
                                   onChange={this.handleChangeDropdownRwTugas} value={form.rwTugas.kodeRw}
                                   loading={isLoadingRwTugas} />
                  </Form.Field>
                  <Form.Field required>
                    <label>RT Tugas</label>
                    <Form.Dropdown clearable selection placeholder="RT Tugas" options={rtTugasOptions}
                                   error={error.rtTugas} loading={isLoadingRtTugas}
                                   onChange={this.handleChangeDropdownRtTugas} value={form.rtTugas.kodeRt} />
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Nama Ibu Kandung</label>
                    <Form.Input fluid id="namaIbuKandung" value={form.namaIbuKandung}
                                placeholder="Nama Ibu Kandung"
                                onChange={this.handleChangeNamaIbuKandung} />
                  </Form.Field>
                  <Form.Field>
                    <label>Pendidikan</label>
                    <Form.Dropdown clearable selection placeholder="Pendidikan" options={pendidikanOptions}
                                   onChange={this.handleChangeDropdownPendidikan}
                                   value={form.pendidikan.id === 0 ? "" : form.pendidikan.id} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Pekerjaan</label>
                    <Form.Dropdown clearable selection placeholder="Pekerjaan" options={pekerjaanOptions}
                                   onChange={this.handleChangeDropdownPekerjaan}
                                   value={form.pekerjaan.id === 0 ? "" : form.pekerjaan.id} />
                  </Form.Field>
                  <Form.Field>
                    <label>Status Pekerjaan</label>
                    <Form.Dropdown clearable selection placeholder="Status Pekerjaan" options={statusPekerjaanOptions}
                                   onChange={this.handleChangeDropdownStatusPekerjaan}
                                   value={form.statusPekerjaan.id === 0 ? "" : form.statusPekerjaan.id} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Status Pernikahan</label>
                    <Form.Dropdown clearable selection placeholder="Status Pernikahan" options={statusPernikahanOptions}
                                   onChange={this.handleChangeDropdownStatusPernikahan}
                                   value={form.statusPernikahan.id === 0 ? "" : form.statusPernikahan.id} />
                  </Form.Field>
                  <Form.Field hidden={form.statusPernikahan.id !== 2}>
                    <label>Nama Pasangan (Istri / Suami)</label>
                    <Form.Input fluid id="namaPasangan" value={form.namaPasangan}
                                placeholder="Nama Pasangan"
                                onChange={this.handleChangeNamaPasangan} />
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
                <Message floating>Pihak yang tidak serumah yang dapat dihubungi dalam keadaan darurat</Message>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Nama Lengkap</label>
                    <Form.Input fluid id="namaEmergencyCall" value={form.namaEmergencyCall}
                                placeholder="Nama Lengkap"
                                onChange={this.handleChangeNamaEmergencyCall} />
                  </Form.Field>
                  <Form.Field>
                    <label>Alamat</label>
                    <Form.Input fluid id="alamatEmergencyCall" value={form.alamatEmergencyCall}
                                placeholder="Alamat"
                                onChange={this.handleChangeAlamatEmergencyCall} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Provinsi</label>
                    <Form.Dropdown clearable selection placeholder="Provinsi" options={provinsiEmergencyCallOptions}
                                   onChange={this.handleChangeDropdownProvinsiEmergencyCall}
                                   value={form.provinsiEmergencyCall.kodeProvinsi} />
                  </Form.Field>
                  <Form.Field>
                    <label>Kota Domisili</label>
                    <Form.Dropdown clearable selection placeholder="Kota" options={kotaEmergencyCallOptions}
                                   onChange={this.handleChangeDropdownKotaEmergencyCall}
                                   value={form.kotaEmergencyCall.kodeKota} loading={isLoadingKotaEmergencyCall} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field>
                    <label>Nomor Handphone</label>
                    <Form.Input fluid id="noHpEmergencyCall" value={form.noHpEmergencyCall} maxLength="13"
                                placeholder="Nomor Handphone" error={error.noHpEmergencyCall}
                                onChange={this.handleChangeNoHpEmergencyCall} />
                  </Form.Field>
                  <Form.Field>
                    <label>Hubungan dengan Petugas</label>
                    <Form.Dropdown clearable selection placeholder="Hubungan dengan Petugas"
                                   options={hubunganEmergencyOptions}
                                   value={form.hubunganEmergency.id === 0 ? "" : form.hubunganEmergency.id}
                                   onChange={this.handleChangeDropdownHubunganEmergency} />
                  </Form.Field>
                </Form.Group>
              </Segment>
            </Segment>
            <Button negative floated="left" onClick={() => this.handleDeletePetugas(form)}
                    disabled={!message.isMatchWilayah}>
              Hapus
            </Button>
            <Button positive floated="right" type="submit" onClick={this.handleSavePetugas}
                    disabled={!message.isMatchWilayah}>
              Simpan
            </Button>
          </Form>
          <ConfirmationModal modal={modal} />
          <ToastContainer position="top-center" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick
                          rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </Container>
      );
    } else {
      return <Redirect to="/petugas" />;
    }
  }
}

export default withKeycloak(PetugasDetail);