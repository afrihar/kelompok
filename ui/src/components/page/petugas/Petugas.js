import React, { Component } from "react";
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
  itemPerPage,
} from "../../util/Helpers";
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
  Table,
} from "semantic-ui-react";
import { withKeycloak } from "@react-keycloak/web";
import { kelompokApi } from "../../util/KelompokApi";
import debounce from "lodash.debounce";

class Petugas extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "nik",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responsePetugas: [],
  };

  async componentDidMount() {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      let getPetugasOptions;
      if (isPusdatin(keycloak) || isProvinsi(keycloak)) {
        getPetugasOptions = await kelompokApi.getPetugasOptionsKota(
          keycloak.token
        );
      } else if (isKota(keycloak)) {
        getPetugasOptions = await kelompokApi.getPetugasOptionsKecamatan(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      } else if (isKecamatan(keycloak)) {
        getPetugasOptions = await kelompokApi.getPetugasOptionsKelurahan(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      } else if (isKelurahan(keycloak)) {
        getPetugasOptions = await kelompokApi.getPetugasOptionsRw(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      } else if (isRw(keycloak)) {
        getPetugasOptions = await kelompokApi.getPetugasOptionsRt(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      }
      if (getPetugasOptions !== undefined) {
        const petugasOptions = getPetugasOptions.data;
        this.setState({ petugasOptions });
      }
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
      const response = await kelompokApi.getPetugas(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      const responsePetugas = response.data;
      this.setState({ isLoading: false, responsePetugas });
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
          const response = await kelompokApi.getPetugas(
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
      const response = await kelompokApi.getPetugas(
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
      const response = await kelompokApi.getPetugas(
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
  handleOptionsChange = async (e, { value }) => {
    this.setState({ isLoadingPage: true, filterWilayah: value });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const response = await kelompokApi.getPetugas(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        const responsePetugas = response.data;
        this.setState({ responsePetugas });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        const response = await kelompokApi.getPetugas(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          undefined,
          filter
        );
        const responsePetugas = response.data;
        this.setState({ responsePetugas, filterWilayah: undefined });
      } catch (error) {
        handleLogError(error);
      }
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
        responsePetugas,
        petugasOptions,
        filter,
      } = this.state;
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responsePetugas.totalItems === 0) {
        popupMessage = "Tidak ada data petugas.";
      }
      return (
        <Container className="isi">
          <Header as="h1" textAlign="center">
            Petugas
          </Header>
          <Grid columns="equal" verticalAlign="middle">
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
                  {" Rt"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {isPusdatin(keycloak) ||
                isProvinsi(keycloak) ||
                isKota(keycloak) ||
                isKecamatan(keycloak) ||
                isKelurahan(keycloak) ||
                isRw(keycloak) ? (
                  <Dropdown
                    clearable
                    fluid
                    options={petugasOptions}
                    placeholder="Filter Petugas By Wilayah Tugas"
                    onChange={this.handleOptionsChange}
                    search
                    selection
                    scrolling
                  />
                ) : (
                  <></>
                )}
              </Grid.Column>
              <Grid.Column>
                <Popup
                  trigger={
                    <Input
                      placeholder="Cari Petugas"
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
                  <Table.HeaderCell>RT Tugas</Table.HeaderCell>
                  <Table.HeaderCell>RW Tugas</Table.HeaderCell>
                  <Table.HeaderCell>Kelurahan Tugas</Table.HeaderCell>
                  <Table.HeaderCell>Domisili</Table.HeaderCell>
                  <Table.HeaderCell>No Rekening</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responsePetugas.totalItems > 0 ? (
                  responsePetugas.data.map((petugas) => (
                    <Table.Row
                      key={petugas.nik}
                      onClick={() => {
                        this.props.history.push(`/petugas/${petugas.nik}`);
                      }}
                    >
                      <Table.Cell>{petugas.nik}</Table.Cell>
                      <Table.Cell>{petugas.nama}</Table.Cell>
                      {petugas.rtTugas ? (
                        <Table.Cell>{petugas.rtTugas.labelRt}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {petugas.rtTugas ? (
                        <Table.Cell>{petugas.rtTugas.rw.labelRw}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {petugas.rtTugas ? (
                        <Table.Cell>
                          {petugas.rtTugas.rw.kelurahan.namaKelurahan}
                        </Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      <Table.Cell>{petugas.alamatDomisili}</Table.Cell>
                      {petugas.noRekening ? (
                        <Table.Cell>{petugas.noRekening}</Table.Cell>
                      ) : (
                        <Table.Cell error>
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
                  <Table.HeaderCell colSpan="2">
                    <Button
                      onClick={() => this.props.history.push("/petugas/tambah")}
                      icon
                      labelPosition="left"
                      primary
                      size="small"
                    >
                      <Icon name="add" /> Petugas
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan="5">
                    {responsePetugas.totalItems > 0 &&
                    responsePetugas.totalPages > 1 ? (
                      <Pagination
                        floated="right"
                        onPageChange={this.handlePaginationChange}
                        activePage={responsePetugas.currentPage}
                        totalPages={responsePetugas.totalPages}
                        firstItem={{
                          content: <Icon name="angle double left" />,
                          icon: true,
                        }}
                        lastItem={{
                          content: <Icon name="angle double right" />,
                          icon: true,
                        }}
                        prevItem={{
                          content: <Icon name="angle left" />,
                          icon: true,
                        }}
                        nextItem={{
                          content: <Icon name="angle right" />,
                          icon: true,
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

export default withKeycloak(Petugas);
