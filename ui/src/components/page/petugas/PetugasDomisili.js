import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import {
  alphanumeric,
  handleLogError,
  isKecamatan,
  isKelurahan,
  isKota,
  isProvinsi,
  isPusdatin,
  isRt,
  isRw,
  itemPerPage
} from "../../util/Helpers";
import { kelompokApi } from "../../util/KelompokApi";
import debounce from "lodash.debounce";
import { Redirect } from "react-router-dom";
import {
  Button,
  Container,
  Dropdown,
  Grid,
  GridRow,
  Header,
  Icon,
  Input,
  Label,
  Loader,
  Pagination,
  Popup,
  Table
} from "semantic-ui-react";

class PetugasDomisili extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "rtDomisili_KodeRt",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responsePetugas: [],
    kotaOptions: [],
    kecamatanOptions: [],
    kelurahanOptions: [],
    rwOptions: [],
    rtOptions: []
  };

  async componentDidMount() {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      const getKotaOptions = await kelompokApi.getPetugasOptionsKotaDomisili(keycloak.token);
      let valueKota;
      if (getKotaOptions.data.length === 1) {
        valueKota = getKotaOptions.data[0].key;
        const getKecamatanOptions = await kelompokApi.getPetugasOptionsKecamatanDomisili(valueKota, keycloak.token);
        let valueKecamatan;
        if (getKecamatanOptions.data.length === 1) {
          valueKecamatan = getKecamatanOptions.data[0].key;
          const getKelurahanOptions = await kelompokApi.getPetugasOptionsKelurahanDomisili(valueKecamatan, keycloak.token);
          let valueKelurahan;
          if (getKelurahanOptions.data.length === 1) {
            valueKelurahan = getKelurahanOptions.data[0].key;
            const getRwOptions = await kelompokApi.getPetugasOptionsRwDomisili(valueKelurahan, keycloak.token);
            let valueRw;
            if (getRwOptions.data.length === 1) valueRw = getRwOptions.data[0].key;
            this.setState({ rwOptions: getRwOptions.data, valueRw });
          }
          this.setState({ kelurahanOptions: getKelurahanOptions.data, valueKelurahan });
        }
        this.setState({ kecamatanOptions: getKecamatanOptions.data, valueKecamatan });
      } else {
        this.setState({ clearableKota: true });
      }
      this.setState({ kotaOptions: getKotaOptions.data, valueKota });
      await this.handleGetPetugas();
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  }

  handleGetPetugas = async () => {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterWilayah, filter } = this.state;
      const response = await kelompokApi.getPetugasDomisili(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      const responsePetugas = response.data;
      this.setState({ responsePetugas });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handleSearch = debounce(async (filter) => {
    this.setState({ isLoadingSearch: true });
    if (filter !== "" && !alphanumeric.test(filter)) {
      this.setState({ filterValid: false });
    } else {
      this.setState({ filterValid: true, filter: filter });
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterWilayah } = this.state;
      if (filter) {
        try {
          const response = await kelompokApi.getPetugasDomisili(
            keycloak.token,
            1,
            size,
            sortBy,
            direction,
            filterWilayah,
            filter
          );
          const responsePetugas = response.data;
          this.setState({ responsePetugas });
        } catch (error) {
          handleLogError(error);
        }
      } else {
        this.setState({ filter: null, filterValid: true });
        await this.handleGetPetugas();
      }
    }
    this.setState({ isLoadingSearch: false });
  }, 350);
  handleOnSizeChange = async (e, { value }) => {
    this.setState({ isLoadingPage: true, size: value });
    const { keycloak } = this.props;
    try {
      const { sortBy, direction, filterWilayah, filter } = this.state;
      const response = await kelompokApi.getPetugasDomisili(
        keycloak.token,
        1,
        value,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      const responsePetugas = response.data;
      this.setState({ responsePetugas });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handlePaginationChange = async (e, { activePage }) => {
    this.setState({ isLoadingPage: true, page: activePage });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filterWilayah, filter } = this.state;
    try {
      const response = await kelompokApi.getPetugasDomisili(
        keycloak.token,
        activePage,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      const responsePetugas = response.data;
      this.setState({ responsePetugas });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handleOptionsChangeKota = async (e, { value }) => {
    this.setState({
      isLoadingPage: true,
      isLoadingOptionKecamatan: true,
      kecamatanOptions: [],
      kelurahanOptions: [],
      rwOptions: [],
      rtOptions: [],
      valueKecamatan: "",
      valueKelurahan: "",
      valueRw: "",
      valueRt: "",
      filterWilayah: value
    });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const getKecamatanOptions = await kelompokApi.getPetugasOptionsKecamatanDomisili(value, keycloak.token);
        this.setState({
          kecamatanOptions: getKecamatanOptions.data,
          isLoadingOptionKecamatan: false,
          clearableKecamatan: true
        });
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({ responsePetugas: response.data });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      this.setState({ isLoadingOptionKecamatan: false });
      try {
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          31,
          filter
        );
        const responsePetugas = response.data;
        this.setState({ responsePetugas, filterWilayah: 31 });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ isLoadingPage: false });
  };
  handleOptionsChangeKecamatan = async (e, { value }) => {
    this.setState({
      isLoadingPage: true,
      isLoadingOptionKelurahan: true,
      kelurahanOptions: [],
      rwOptions: [],
      rtOptions: [],
      valueKecamatan: value,
      valueKelurahan: "",
      valueRw: "",
      valueRt: "",
      filterWilayah: value
    });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const getKelurahanOptions = await kelompokApi.getPetugasOptionsKelurahanDomisili(value, keycloak.token);
        this.setState({
          kelurahanOptions: getKelurahanOptions.data,
          isLoadingOptionKelurahan: false,
          clearableKelurahan: true
        });
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({ responsePetugas: response.data });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        this.setState({ isLoadingOptionKelurahan: false });
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          this.state.valueKecamatan,
          filter
        );
        this.setState({ responsePetugas: response.data });
      } catch (error) {
        handleLogError(error);
      }
      this.setState({ isLoadingOptionKecamatan: false });
    }
    this.setState({ isLoadingPage: false });
  };
  handleOptionsChangeKelurahan = async (e, { value }) => {
    this.setState({
      isLoadingPage: true,
      isLoadingOptionRw: true,
      rwOptions: [],
      rtOptions: [],
      valueKelurahan: value,
      valueRw: "",
      valueRt: "",
      filterWilayah: value
    });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const getRwOptions = await kelompokApi.getPetugasOptionsRwDomisili(value, keycloak.token);
        this.setState({ rwOptions: getRwOptions.data, isLoadingOptionRw: false, clearableRw: true });
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({ responsePetugas: response.data });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        this.setState({ isLoadingOptionRw: false });
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          this.state.valueKecamatan,
          filter
        );
        this.setState({ responsePetugas: response.data });
      } catch (error) {
        handleLogError(error);
      }
      this.setState({ isLoadingOptionKelurahan: false });
    }
    this.setState({ isLoadingPage: false });
  };
  handleOptionsChangeRw = async (e, { value }) => {
    this.setState({
      isLoadingPage: true,
      rtOptions: [],
      isLoadingOptionRt: true,
      valueRw: value,
      valueRt: "",
      filterWilayah: value
    });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const getRtOptions = await kelompokApi.getPetugasOptionsRtDomisili(value, keycloak.token);
        this.setState({ rtOptions: getRtOptions.data, isLoadingOptionRt: false, clearableRt: true });
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({ responsePetugas: response.data });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        this.setState({ isLoadingOptionRt: false });
        const response = await kelompokApi.getPetugasDomisili(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          this.state.valueKelurahan,
          filter
        );
        this.setState({ responsePetugas: response.data });
      } catch (error) {
        handleLogError(error);
      }
      this.setState({ isLoadingOptionRt: false });
    }
    this.setState({ isLoadingPage: false });
  };
  handleOptionsChangeRt = async (e, { value }) => {
    this.setState({
      isLoadingPage: true,
      valueRt: value,
      filterWilayah: value
    });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    try {
      const response = await kelompokApi.getPetugasDomisili(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        value ? value : this.state.valueRw,
        filter
      );
      this.setState({ responsePetugas: response.data });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };


  render() {
    const { keycloak } = this.props;
    if (
      isPusdatin(keycloak) ||
      isProvinsi(keycloak) ||
      isKota(keycloak) ||
      isKecamatan(keycloak) ||
      isKelurahan(keycloak) ||
      isRw(keycloak) ||
      isRt(keycloak)
    ) {
      const {
        size,
        filterValid,
        isLoadingPage,
        isLoadingSearch,
        isLoadingOptionKecamatan,
        isLoadingOptionKelurahan,
        isLoadingOptionRw,
        isLoadingOptionRt,
        responsePetugas,
        kotaOptions,
        valueKota,
        clearableKota,
        kecamatanOptions,
        valueKecamatan,
        clearableKecamatan,
        kelurahanOptions,
        valueKelurahan,
        clearableKelurahan,
        rwOptions,
        valueRw,
        clearableRw,
        rtOptions,
        valueRt,
        clearableRt,
        filter
      } = this.state;
      const provinsiOptions = [{
        key: "31",
        text: "DKI JAKARTA",
        value: "31"
      }];
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responsePetugas.totalItems === 0) {
        popupMessage = "Tidak ada data petugas.";
      }
      return (
        <Container className="isi">
          <Header as="h1" textAlign="center">
            Kader Berdasarkan Domisili
          </Header>
          <Grid columns="equal" verticalAlign="middle">
            <GridRow>
              <Grid.Column>
                <Dropdown
                  fluid
                  options={provinsiOptions}
                  selection
                  value={"31"}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  clearable={clearableKota}
                  fluid
                  options={kotaOptions}
                  placeholder="Kota Domisili"
                  onChange={this.handleOptionsChangeKota}
                  search
                  selection
                  scrolling
                  value={valueKota}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  clearable={clearableKecamatan}
                  fluid
                  options={kecamatanOptions}
                  placeholder="Kecamatan Domisili"
                  onChange={this.handleOptionsChangeKecamatan}
                  search
                  selection
                  scrolling
                  value={valueKecamatan}
                  loading={isLoadingOptionKecamatan}
                />
              </Grid.Column>
            </GridRow>
            <GridRow>
              <Grid.Column>
                <Dropdown
                  clearable={clearableKelurahan}
                  fluid
                  options={kelurahanOptions}
                  placeholder="Kelurahan Domisili"
                  onChange={this.handleOptionsChangeKelurahan}
                  search
                  selection
                  scrolling
                  value={valueKelurahan}
                  loading={isLoadingOptionKelurahan}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  clearable={clearableRw}
                  fluid
                  options={rwOptions}
                  placeholder="Rw Domisili"
                  onChange={this.handleOptionsChangeRw}
                  search
                  selection
                  scrolling
                  value={valueRw}
                  loading={isLoadingOptionRw}
                />
              </Grid.Column>
              <Grid.Column>
                <Dropdown
                  clearable={clearableRt}
                  fluid
                  options={rtOptions}
                  placeholder="Rt Domisili"
                  onChange={this.handleOptionsChangeRt}
                  search
                  selection
                  scrolling
                  value={valueRt}
                  loading={isLoadingOptionRt}
                />
              </Grid.Column>
            </GridRow>
            <GridRow>
              <Grid.Column>
                <React.Fragment>
                  Data per halaman :{" "}
                  <Dropdown
                    inline={true}
                    placeholder={String(size)}
                    options={itemPerPage()}
                    onChange={this.handleOnSizeChange}
                    defaultValue={String(size)}
                  />{" "}
                  Total Data : {responsePetugas.totalItems}
                  {" Kader"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column><Popup
              trigger={<Icon name="info circle" color="red" />}
              content="Pencarian bisa berdasarkan NIK, Nama, No Hp, Email, No Rekening atau No NPWP "
              position="top center"
            />
              <Grid.Column>
                <Popup
                  trigger={
                    <Input
                      placeholder="Cari Kader"
                      name="filter"
                      error={!filterValid}
                      fluid
                      size="small"
                      icon="search"
                      loading={isLoadingSearch}
                      onChange={(e) => this.handleSearch(e.target.value)}
                    />
                  }
                  content={popupMessage}
                  on="click"
                  open={!filterValid || responsePetugas.totalItems === 0}
                  position="right center"
                />
              </Grid.Column>
            </GridRow>
          </Grid>
          {isLoadingPage ? (
            <Loader active />
          ) : (
            <Table compact selectable definition striped>
              <Table.Header fullWidth>
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>NIK</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Nama</Table.HeaderCell>
                  <Table.HeaderCell>Alamat Domisili</Table.HeaderCell>
                  <Table.HeaderCell>RT Domisili</Table.HeaderCell>
                  <Table.HeaderCell>RW Domisili</Table.HeaderCell>
                  <Table.HeaderCell>Kelurahan Domisili</Table.HeaderCell>
                  <Table.HeaderCell>RT Tugas</Table.HeaderCell>
                  <Table.HeaderCell>RW Tugas</Table.HeaderCell>
                  <Table.HeaderCell>Tanggal Lahir</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responsePetugas.totalItems > 0 ? (
                  responsePetugas.data.map((petugas) => (
                    <Table.Row
                      key={petugas.nik}
                      onClick={() => {
                        this.props.history.push(`/petugas-domisili/${petugas.nik}`);
                      }}>
                      <Table.Cell>{petugas.nik}</Table.Cell>
                      <Table.Cell>{petugas.nama}</Table.Cell>
                      <Table.Cell>{petugas.alamatDomisili}</Table.Cell>
                      {petugas.rtDomisili ? (
                        <Table.Cell>{petugas.rtDomisili.labelRt}</Table.Cell>
                      ) : (
                        <Table.Cell textAlign="center" error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {petugas.rtDomisili ? (
                        <Table.Cell>{petugas.rtDomisili.rw.labelRw}</Table.Cell>
                      ) : (
                        <Table.Cell textAlign="center" error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {petugas.rtDomisili ? (
                        <Table.Cell>
                          {petugas.rtDomisili.rw.kelurahan.namaKelurahan}
                        </Table.Cell>
                      ) : (
                        <Table.Cell textAlign="center" error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {petugas.rtTugas ? (
                        <Table.Cell>{petugas.rtTugas.labelRt}</Table.Cell>
                      ) : (
                        <Table.Cell textAlign="center" error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {petugas.rtTugas ? (
                        <Table.Cell>{petugas.rtTugas.rw.labelRw}</Table.Cell>
                      ) : (
                        <Table.Cell textAlign="center" error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {petugas.tanggalLahir ? (
                        <Table.Cell>
                          {new Date(petugas.tanggalLahir).toDateString()}
                        </Table.Cell>
                      ) : (
                        <Table.Cell textAlign="center" error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))
                ) : (
                  <></>
                )}
              </Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan="3">
                    <Button
                      onClick={() => this.props.history.push("/petugas-tambah")}
                      icon labelPosition="left" primary size="small">
                      <Icon name="add" /> Kader
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan="6">
                    {responsePetugas.totalItems > 0 &&
                    responsePetugas.totalPages > 1 ? (
                      <Pagination
                        floated="right"
                        onPageChange={this.handlePaginationChange}
                        activePage={responsePetugas.currentPage}
                        totalPages={responsePetugas.totalPages}
                        firstItem={{
                          content: <Icon name="angle double left" />,
                          icon: true
                        }}
                        lastItem={{
                          content: <Icon name="angle double right" />,
                          icon: true
                        }}
                        prevItem={{
                          content: <Icon name="angle left" />,
                          icon: true
                        }}
                        nextItem={{
                          content: <Icon name="angle right" />,
                          icon: true
                        }}
                        pointing
                        secondary
                      />
                    ) : (
                      <></>
                    )}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          )}
        </Container>
      );
    } else {
      return <Redirect to="/" />;
    }
  }
}

export default withKeycloak(PetugasDomisili);