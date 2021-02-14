import React, { Component } from "react";
import { withKeycloak } from "@react-keycloak/web";
import { kelompokApi } from "../../util/KelompokApi";
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

class Kelompok extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "id",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responseKelompok: []
  };

  async componentDidMount() {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      let getKelompokOptions;
      if (isPusdatin(keycloak) || isProvinsi(keycloak)) {
        getKelompokOptions = await kelompokApi.getKelompokOptionsKota(
          keycloak.token
        );
      } else if (isKota(keycloak)) {
        getKelompokOptions = await kelompokApi.getKelompokOptionsKecamatan(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      } else if (isKecamatan(keycloak)) {
        getKelompokOptions = await kelompokApi.getKelompokOptionsKelurahan(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      } else if (isKelurahan(keycloak)) {
        getKelompokOptions = await kelompokApi.getKelompokOptionsRw(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      } else if (isRw(keycloak)) {
        getKelompokOptions = await kelompokApi.getKelompokOptionsRt(
          keycloak.tokenParsed["kode_wilayah"],
          keycloak.token
        );
      }
      if (getKelompokOptions !== undefined) {
        const kelompokOptions = getKelompokOptions.data;
        this.setState({ kelompokOptions });
      }
      await this.handleGetKelompok();
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  }

  handleGetKelompok = async () => {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterWilayah, filter } = this.state;
      const response = await kelompokApi.getKelompok(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      const responseKelompok = response.data;
      this.setState({ responseKelompok });
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
          const response = await kelompokApi.getKelompok(
            keycloak.token,
            1,
            size,
            sortBy,
            direction,
            filterWilayah,
            filter
          );
          this.setState({ responseKelompok: response.data });
        } catch (error) {
          handleLogError(error);
        }
      } else {
        this.setState({ filter: null, filterValid: true });
        await this.handleGetKelompok();
      }
    }
    this.setState({ isLoadingSearch: false });
  }, 350);
  handleOnSizeChange = async (e, { value }) => {
    this.setState({ isLoadingPage: true, size: value });
    const { keycloak } = this.props;
    try {
      const { sortBy, direction, filterWilayah, filter } = this.state;
      const response = await kelompokApi.getKelompok(
        keycloak.token,
        1,
        value,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      this.setState({ responseKelompok: response.data });
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
      const response = await kelompokApi.getKelompok(
        keycloak.token,
        activePage,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      this.setState({ responseKelompok: response.data });
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
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({ responseKelompok: response.data });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          undefined,
          filter
        );
        this.setState({ responseKelompok: response.data, filterWilayah: undefined });
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
        responseKelompok,
        kelompokOptions,
        filter
      } = this.state;
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responseKelompok.totalItems === 0) {
        popupMessage = "Tidak ada data kelompok dasawisma.";
      }
      return (
        <Container className="isi">
          <Header as="h1" textAlign="center">
            Kelompok Dasawisma
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
                  Total Data : {responseKelompok.totalItems}
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
                    options={kelompokOptions}
                    placeholder="Filter Kelompok By Wilayah"
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
                      placeholder="Cari Nama Kelompok"
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
                  open={!filterValid || responseKelompok.totalItems === 0}
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
                    <Label ribbon>Id</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Nama Kelompok</Table.HeaderCell>
                  <Table.HeaderCell>NIK Petugas</Table.HeaderCell>
                  <Table.HeaderCell>Nama Petugas</Table.HeaderCell>
                  <Table.HeaderCell>RT</Table.HeaderCell>
                  <Table.HeaderCell>RW</Table.HeaderCell>
                  <Table.HeaderCell>Kelurahan</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseKelompok.totalItems > 0 ? (
                  responseKelompok.data.map((kelompok) => (
                    <Table.Row
                      key={kelompok.id}
                      onClick={() => {
                        this.props.history.push(`/kelompok/${kelompok.id}`);
                      }}>
                      <Table.Cell>{kelompok.id}</Table.Cell>
                      <Table.Cell>{kelompok.namaKelompok}</Table.Cell>
                      {kelompok.petugasKelompok ? (
                        <Table.Cell>{kelompok.petugasKelompok.nik}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {kelompok.petugasKelompok ? (
                        <Table.Cell>{kelompok.petugasKelompok.nama}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {kelompok.rtKelompok ? (
                        <Table.Cell>{kelompok.rtKelompok.labelRt}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {kelompok.rtKelompok ? (
                        <Table.Cell>{kelompok.rtKelompok.rw.labelRw}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" />
                        </Table.Cell>
                      )}
                      {kelompok.rtKelompok ? (
                        <Table.Cell>{kelompok.rtKelompok.rw.kelurahan.namaKelurahan}</Table.Cell>
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
                      onClick={() => this.props.history.push("/kelompok/tambah")}
                      icon
                      labelPosition="left"
                      primary
                      size="small"
                    >
                      <Icon name="add" /> Kelompok
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan="5">
                    {responseKelompok.totalItems > 0 &&
                    responseKelompok.totalPages > 1 ? (
                      <Pagination
                        floated="right"
                        onPageChange={this.handlePaginationChange}
                        activePage={responseKelompok.currentPage}
                        totalPages={responseKelompok.totalPages}
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

export default withKeycloak(Kelompok);
