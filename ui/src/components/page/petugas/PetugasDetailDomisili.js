import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { kelompokApi } from "../../util/KelompokApi";
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
import { toast, ToastContainer } from "react-toastify";
import { Redirect } from "react-router-dom";
import { Button, Container, Divider, Form, Header, Icon, Message, Segment } from "semantic-ui-react";
import ConfirmationModal from "../../util/ConfirmationModal";
import { DateInput } from "semantic-ui-calendar-react";

class PetugasDetailDomisili extends Component {
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
    rtDomisili: false
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
    if (isPusdatin(keycloak)) this.setState({ message: { isMatchWilayah: true } });
    try {
      const response = await kelompokApi.getPetugasByNik(this.props.match.params.nik, keycloak.token);
      const petugas = response.data;
      this.setState({ namaAsli: petugas.nama });
      // if (petugas.rtDomisili) {
      // }
      if ((isRt(keycloak) && (petugas.rtDomisili.kodeRt === getKodeWilayah(keycloak)))
        || (isRw(keycloak) && (petugas.rtDomisili.kodeRt.substr(0, 12) === getKodeWilayah(keycloak)))
        || (isKelurahan(keycloak) && (petugas.rtDomisili.kodeRt.substr(0, 9) === getKodeWilayah(keycloak)))
        || (isKecamatan(keycloak) && (petugas.rtDomisili.kodeRt.substr(0, 6) === getKodeWilayah(keycloak)))
        || (isKota(keycloak) && (petugas.rtDomisili.kodeRt.substr(0, 4) === getKodeWilayah(keycloak)))
        || (isProvinsi(keycloak) && (petugas.rtDomisili.kodeRt.substr(0, 2) === getKodeWilayah(keycloak)))
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
        const getKotaDomisiliOptions = await kelompokApi.getPetugasOptionsKotaDomisili(keycloak.token);
        const getKotaTugasOptions = await kelompokApi.getPetugasOptionsKotaTugas(keycloak.token);
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
          kotaDomisiliOptions: getKotaDomisiliOptions.data,
          kotaTugasOptions: getKotaTugasOptions.data,
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
          const getKecamatanDomisiliOptions = await kelompokApi.getPetugasOptionsKecamatanDomisili(form.kotaDomisili.kodeKota, keycloak.token);
          form.kecamatanDomisili.kodeKecamatan = petugas.rtDomisili.rw.kelurahan.kecamatan.kodeKecamatan;
          const getKelurahanDomisiliOptions = await kelompokApi.getPetugasOptionsKelurahanDomisili(form.kecamatanDomisili.kodeKecamatan, keycloak.token);
          form.kelurahanDomisili.kodeKelurahan = petugas.rtDomisili.rw.kelurahan.kodeKelurahan;
          const getRwDomisiliOptions = await kelompokApi.getPetugasOptionsRwDomisili(form.kelurahanDomisili.kodeKelurahan, keycloak.token);
          form.rwDomisili.kodeRw = petugas.rtDomisili.rw.kodeRw;
          const getRtDomisiliOptions = await kelompokApi.getPetugasOptionsRtDomisili(form.rwDomisili.kodeRw, keycloak.token);
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
          const getKecamatanTugasOptions = await kelompokApi.getPetugasOptionsKecamatanTugas(form.kotaTugas.kodeKota, keycloak.token);
          form.kecamatanTugas.kodeKecamatan = petugas.rtTugas.rw.kelurahan.kecamatan.kodeKecamatan;
          const getKelurahanTugasOptions = await kelompokApi.getPetugasOptionsKelurahanTugas(form.kecamatanTugas.kodeKecamatan, keycloak.token);
          form.kelurahanTugas.kodeKelurahan = petugas.rtTugas.rw.kelurahan.kodeKelurahan;
          const getRwTugasOptions = await kelompokApi.getPetugasOptionsRwTugas(form.kelurahanTugas.kodeKelurahan, keycloak.token);
          form.rwTugas.kodeRw = petugas.rtTugas.rw.kodeRw;
          const getRtTugasOptions = await kelompokApi.getPetugasOptionsRtTugas(form.rwTugas.kodeRw, keycloak.token);
          form.rtTugas.kodeRt = petugas.rtTugas.kodeRt;
          this.setState({
            kecamatanTugasOptions: getKecamatanTugasOptions.data,
            kelurahanTugasOptions: getKelurahanTugasOptions.data,
            rwTugasOptions: getRwTugasOptions.data,
            rtTugasOptions: getRtTugasOptions.data
          });
        } else if (petugas.rtDomisili) {
          form.kotaTugas.kodeKota = petugas.rtDomisili.rw.kelurahan.kecamatan.kota.kodeKota;
          const getKecamatanTugasOptions = await kelompokApi.getPetugasOptionsKecamatanTugas(form.kotaTugas.kodeKota, keycloak.token);
          form.kecamatanTugas.kodeKecamatan = petugas.rtDomisili.rw.kelurahan.kecamatan.kodeKecamatan;
          const getKelurahanTugasOptions = await kelompokApi.getPetugasOptionsKelurahanTugas(form.kecamatanTugas.kodeKecamatan, keycloak.token);
          form.kelurahanTugas.kodeKelurahan = petugas.rtDomisili.rw.kelurahan.kodeKelurahan;
          const getRwTugasOptions = await kelompokApi.getPetugasOptionsRwTugas(form.kelurahanTugas.kodeKelurahan, keycloak.token);
          this.setState({
            kecamatanTugasOptions: getKecamatanTugasOptions.data,
            kelurahanTugasOptions: getKelurahanTugasOptions.data,
            rwTugasOptions: getRwTugasOptions.data
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
        if (petugas.provinsiEmergencyCall) {
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
        if (petugas.kotaEmergencyCall) {
          if (petugas.provinsiEmergencyCall) {
            form.kotaEmergencyCall.kodeKota = petugas.kotaEmergencyCall.kodeKota;
          } else {
            form.provinsiEmergencyCall.kodeProvinsi = petugas.kotaEmergencyCall.kodeKota.substr(0, 2);
          }
        }
        if (petugas.noHpEmergencyCall) form.noHpEmergencyCall = petugas.noHpEmergencyCall;
        if (petugas.hubunganEmergency) form.hubunganEmergency.id = petugas.hubunganEmergency.id;
        this.setState({ form, isLoadingKotaEmergencyCall: false });
      }
    } catch (error) {
      handleLogError(error);
      this.props.history.push("/petugas-domisili");
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
    const error = { ...this.state.error };
    error.rtDomisili = false;
    error.rtTugas = false;
    const form = { ...this.state.form };
    form.kotaDomisili.kodeKota = value;
    form.kotaTugas.kodeKota = value;
    this.setState({
      isLoadingKecamatanDomisili: true,
      isLoadingKecamatanTugas: true,
      kecamatanDomisiliOptions: [],
      kecamatanTugasOptions: [],
      kelurahanDomisiliOptions: [],
      kelurahanTugasOptions: [],
      rwDomisiliOptions: [],
      rwTugasOptions: [],
      rtDomisiliOptions: [],
      rtTugasOptions: []
    });
    form.kecamatanDomisili.kodeKecamatan = "";
    form.kecamatanTugas.kodeKecamatan = "";
    form.kelurahanDomisili.kodeKelurahan = "";
    form.kelurahanTugas.kodeKelurahan = "";
    form.rwDomisili.kodeRw = "";
    form.rwTugas.kodeRw = "";
    form.rtTugas.kodeRt = "";
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKecamatanDomisiliOptions = await kelompokApi.getPetugasOptionsKecamatanDomisili(value, keycloak.token);
        const kecamatanDomisiliOptions = getKecamatanDomisiliOptions.data;
        const kecamatanTugasOptions = getKecamatanDomisiliOptions.data;
        this.setState({ kecamatanDomisiliOptions, kecamatanTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, error, isLoadingKecamatanDomisili: false, isLoadingKecamatanTugas: false });
  };
  handleChangeDropdownKecamatanDomisili = async (e, { value }) => {
    const error = { ...this.state.error };
    error.rtDomisili = false;
    error.rtTugas = false;
    const form = { ...this.state.form };
    form.kecamatanDomisili.kodeKecamatan = value;
    form.kecamatanTugas.kodeKecamatan = value;
    this.setState({
      isLoadingKelurahanDomisili: true,
      isLoadingKelurahanTugas: true,
      kelurahanDomisiliOptions: [],
      kelurahanTugasOptions: [],
      rwDomisiliOptions: [],
      rwTugasOptions: [],
      rtDomisiliOptions: [],
      rtTugasOptions: []
    });
    form.kelurahanDomisili.kodeKelurahan = "";
    form.kelurahanTugas.kodeKelurahan = "";
    form.rwDomisili.kodeRw = "";
    form.rwTugas.kodeRw = "";
    form.rtDomisili.kodeRt = "";
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getKelurahanDomisiliOptions = await kelompokApi.getPetugasOptionsKelurahanDomisili(value, keycloak.token);
        const kelurahanDomisiliOptions = getKelurahanDomisiliOptions.data;
        const kelurahanTugasOptions = getKelurahanDomisiliOptions.data;
        this.setState({ kelurahanDomisiliOptions, kelurahanTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, error, isLoadingKelurahanDomisili: false, isLoadingKelurahanTugas: false });
  };
  handleChangeDropdownKelurahanDomisili = async (e, { value }) => {
    const error = { ...this.state.error };
    error.rtDomisili = false;
    error.rtTugas = false;
    const form = { ...this.state.form };
    form.kelurahanDomisili.kodeKelurahan = value;
    form.kelurahanTugas.kodeKelurahan = value;
    this.setState({
      isLoadingRwDomisili: true,
      isLoadingRwTugas: true,
      rwDomisiliOptions: [],
      rwTugasOptions: [],
      rtDomisiliOptions: [],
      rtTugasOptions: []
    });
    form.rwDomisili.kodeRw = "";
    form.rwTugas.kodeRw = "";
    form.rtDomisili.kodeRt = "";
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getRwDomisiliOptions = await kelompokApi.getPetugasOptionsRwDomisili(value, keycloak.token);
        const rwDomisiliOptions = getRwDomisiliOptions.data;
        const rwTugasOptions = getRwDomisiliOptions.data;
        this.setState({ rwDomisiliOptions, rwTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, error, isLoadingRwDomisili: false, isLoadingRwTugas: false });
  };
  handleChangeDropdownRwDomisili = async (e, { value }) => {
    const error = { ...this.state.error };
    error.rtDomisili = false;
    error.rtTugas = false;
    const form = { ...this.state.form };
    form.rwDomisili.kodeRw = value;
    form.rwTugas.kodeRw = value;
    this.setState({
      isLoadingRtDomisili: true,
      isLoadingRtTugas: true,
      rtDomisiliOptions: [],
      rtTugasOptions: []
    });
    form.rtDomisili.kodeRt = "";
    form.rtTugas.kodeRt = "";
    if (value) {
      try {
        const { keycloak } = this.props;
        const getRtDomisiliOptions = await kelompokApi.getPetugasOptionsRtDomisili(value, keycloak.token);
        const rtDomisiliOptions = getRtDomisiliOptions.data;
        const rtTugasOptions = getRtDomisiliOptions.data;
        this.setState({ rtDomisiliOptions, rtTugasOptions });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ form, error, isLoadingRtDomisili: false, isLoadingRtTugas: false });
  };
  handleChangeDropdownRtDomisili = (e, { value }) => {
    const error = { ...this.state.error };
    error.rtDomisili = false;
    error.rtTugas = false;
    const form = { ...this.state.form };
    form.rtDomisili.kodeRt = value;
    form.rtTugas.kodeRt = value;
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
        const getKecamatanTugasOptions = await kelompokApi.getPetugasOptionsKecamatanTugas(value, keycloak.token);
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
        const getKelurahanTugasOptions = await kelompokApi.getPetugasOptionsKelurahanTugas(value, keycloak.token);
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
        const getRwTugasOptions = await kelompokApi.getPetugasOptionsRwTugas(value, keycloak.token);
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
        const getRtTugasOptions = await kelompokApi.getPetugasOptionsRtTugas(value, keycloak.token);
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
    const error = { ...this.state.error };
    error.noHpEmergencyCall = false;
    const re = /^[0-9]+$/;
    if (
      e.target.value === "" || re.test(e.target.value)) {
      const { id, value } = e.target;
      const form = { ...this.state.form };
      form[id] = value;
      this.setState({ error, form });
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
    if (form.noHpEmergencyCall.trim()
      && (form.noHpEmergencyCall.substr(0, 2) !== "08" && form.noHpEmergencyCall.substr(0, 3) !== "021")) {
      noHpEmergencyCallError = true;
      error.noHpEmergencyCall = { pointing: "below", content: "No HP harus diawali \"08\" atau \"021\"" };
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
      || rtDomisiliError));
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
        { onClose: () => this.props.history.push("/petugas-domisili") }
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
          { onClose: () => this.props.history.push("/petugas-domisili") }
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
  handleClickBack = () => this.props.history.push("/petugas-domisili");
  handleKeyPressBack = (e) => {
    if (e.charCode === 32 || e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      this.props.history.push("/petugas-domisili");
    }
  };
  handleClickKelompok = () => {
    const form = { ...this.state.form };
    this.props.history.push("/petugas-kelompok/" + form.nik);
  };
  handleKeyPressKelompok = (e) => {
    if (e.charCode === 32 || e.charCode === 13) {
      // Prevent the default action to stop scrolling when space is pressed
      e.preventDefault();
      const form = { ...this.state.form };
      this.props.history.push("/petugas-kelompok/" + form.nik);
    }
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
          <Button animated basic color="grey" onClick={this.handleClickBack} onKeyPress={this.handleKeyPressBack}>
            <Button.Content hidden>Kembali</Button.Content>
            <Button.Content visible>
              <Icon name="arrow left" />
            </Button.Content>
          </Button>
          {form.rtTugas.kodeRt !== "" ?
            <Button animated basic color="grey" floated="right" onClick={this.handleClickKelompok}
                    onKeyPress={this.handleKeyPressKelompok}>
              <Button.Content hidden>Kelompok</Button.Content>
              <Button.Content visible>
                <Icon name="map" />
              </Button.Content>
            </Button> : <></>}
          <Divider />
          <Form loading={isLoadingForm}>
            <Message negative hidden={message.isMatchWilayah}>
              <Message.Header>Domisili Petugas ini tidak berada di wilayah Anda.</Message.Header>
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
                  <Form.Field disabled>
                    <label>Provinsi Tugas</label>
                    <Form.Dropdown selection placeholder="Provinsi Tugas" options={provinsiOptions} value="31" />
                  </Form.Field>
                  <Form.Field disabled>
                    <label>Kota Tugas</label>
                    <Form.Dropdown clearable selection placeholder="Kota Tugas" options={kotaTugasOptions}
                                   onChange={this.handleChangeDropdownKotaTugas} value={form.kotaTugas.kodeKota} />
                  </Form.Field>
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.Field disabled>
                    <label>Kecamatan Tugas</label>
                    <Form.Dropdown clearable selection placeholder="Kecamatan Tugas"
                                   options={kecamatanTugasOptions} value={form.kecamatanTugas.kodeKecamatan}
                                   onChange={this.handleChangeDropdownKecamatanTugas}
                                   loading={isLoadingKecamatanTugas} />
                  </Form.Field>
                  <Form.Field disabled>
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
                  <Form.Field>
                    <label>RT Tugas</label>
                    <Form.Dropdown clearable selection placeholder="RT Tugas" options={rtTugasOptions}
                                   loading={isLoadingRtTugas} onChange={this.handleChangeDropdownRtTugas}
                                   value={form.rtTugas.kodeRt} />
                  </Form.Field>
                </Form.Group>
              </Segment>
              <Segment raised>
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
      return <Redirect to="/petugas-domisili" />;
    }
  }
}

export default withKeycloak(PetugasDetailDomisili);