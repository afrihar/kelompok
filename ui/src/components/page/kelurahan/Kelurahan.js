import React, { Component } from "react";
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
import {
  alphanumeric,
  handleLogError,
  isKecamatan,
  isKota,
  isProvinsi,
  isPusdatin,
  itemPerPage
} from "../../util/Helpers";
import { kelompokApi } from "../../util/KelompokApi";
import { withKeycloak } from "@react-keycloak/web";
import { Redirect } from "react-router-dom";
import debounce from "lodash.debounce";

class Kelurahan extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "kodeKelurahan",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responseKelurahan: [],
    kecamatanOptions: []
  };

  async componentDidMount() {
    this.setState({ isLoadingPage: true });
    const { keycloak } = this.props;
    try {
      const getKecamatanOptions = await kelompokApi.getKelurahanOptionsKecamatan(
        keycloak.token
      );
      const kecamatanOptions = getKecamatanOptions.data;
      this.setState({ kecamatanOptions });
      await this.handleGetKelurahan();
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  }

  handleGetKelurahan = async () => {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterKecamatan, filter } = this.state;
      const response = await kelompokApi.getKelurahan(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        filterKecamatan,
        filter
      );
      const responseKelurahan = response.data;
      this.setState({ responseKelurahan });
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
      const { size, sortBy, direction, filterKecamatan } = this.state;
      if (filter) {
        try {
          const response = await kelompokApi.getKelurahan(
            keycloak.token,
            1,
            size,
            sortBy,
            direction,
            filterKecamatan,
            filter
          );
          const responseKelurahan = response.data;
          this.setState({ responseKelurahan });
        } catch (error) {
          handleLogError(error);
        }
      } else {
        this.setState({ filterValid: true });
        await this.handleGetKelurahan();
      }
    }
    this.setState({ isLoadingSearch: false });
  }, 350);

  handleOnChangeSize = async (e, { value }) => {
    this.setState({ isLoadingPage: true, size: value });
    const { keycloak } = this.props;
    try {
      const { sortBy, direction, filterKecamatan, filter } = this.state;
      const response = await kelompokApi.getKelurahan(
        keycloak.token,
        1,
        value,
        sortBy,
        direction,
        filterKecamatan,
        filter
      );
      const responseKelurahan = response.data;
      this.setState({ responseKelurahan });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handlePaginationChange = async (e, { activePage }) => {
    this.setState({ isLoadingPage: true, page: activePage });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterKecamatan, filter } = this.state;
      const response = await kelompokApi.getKelurahan(
        keycloak.token,
        activePage,
        size,
        sortBy,
        direction,
        filterKecamatan,
        filter
      );
      const responseKelurahan = response.data;
      this.setState({ responseKelurahan });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handleDropdownChange = async (e, { value }) => {
    this.setState({ isLoadingPage: true, filterKecamatan: value });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const response = await kelompokApi.getKelurahan(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        const responseKelurahan = response.data;
        this.setState({ responseKelurahan });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        const response = await kelompokApi.getKelurahan(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          undefined,
          filter
        );
        const responseKelurahan = response.data;
        this.setState({ responseKelurahan, filterKecamatan: undefined });
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
      isKecamatan(keycloak)
    ) {
      const {
        size,
        filterValid,
        isLoadingPage,
        isLoadingSearch,
        responseKelurahan,
        kecamatanOptions,
        filter
      } = this.state;
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responseKelurahan.totalItems === 0) {
        popupMessage = "Tidak ada data Kelurahan.";
      }
      return (
        <Container className="isi">
          <Header as="h1" textAlign="center">
            Master Kelurahan
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
                    onChange={this.handleOnChangeSize}
                    defaultValue={String(size)}
                  />{" "}
                  Total Data : {responseKelurahan.totalItems}
                  {" Kelurahan"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {isPusdatin(keycloak) ||
                isProvinsi(keycloak) ||
                isKota(keycloak) ? (
                  <Dropdown
                    clearable
                    fluid
                    options={kecamatanOptions}
                    placeholder="Filter Kecamatan"
                    onChange={this.handleDropdownChange}
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
                      placeholder="Cari Nama Kelurahan / Kelompok"
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
                  open={!filterValid || responseKelurahan.totalItems === 0}
                  position="right center"
                />
              </Grid.Column>
            </GridRow>
          </Grid>
          {isLoadingPage ? (
            <Loader active />
          ) : (
            <Table compact selectable singleLine definition striped>
              <Table.Header fullWidth>
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>Kode Kelurahan</Label>
                  </Table.Cell>
                  <Table.HeaderCell>
                    Kode Kelurahan (Kemendagri)
                  </Table.HeaderCell>
                  <Table.HeaderCell>Nama Kelurahan</Table.HeaderCell>
                  <Table.HeaderCell>Kode Pos</Table.HeaderCell>
                  <Table.HeaderCell>Nama Kelompok</Table.HeaderCell>
                  <Table.HeaderCell>Kecamatan</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseKelurahan.totalItems > 0 ? (
                  responseKelurahan.data.map((kelurahan) => (
                    <Table.Row
                      key={kelurahan.kodeKelurahan}
                      onClick={() => {
                        this.props.history.push(
                          `/kelurahan/${kelurahan.kodeKelurahan}`
                        );
                      }}
                    >
                      <Table.Cell>{kelurahan.kodeKelurahan}</Table.Cell>
                      <Table.Cell>{kelurahan.kodeKelurahanCapil}</Table.Cell>
                      <Table.Cell>{kelurahan.namaKelurahan}</Table.Cell>
                      <Table.Cell>{kelurahan.kodePos}</Table.Cell>
                      <Table.Cell>{kelurahan.namaKelompokKelurahan}</Table.Cell>
                      {kelurahan.kecamatan ? (
                        <Table.Cell>
                          {kelurahan.kecamatan.namaKecamatan}
                        </Table.Cell>
                      ) : (
                        <Table.Cell textAlign='center' error>
                          {" "}
                          <Icon name="attention" /> Tidak Punya Kecamatan
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
                      onClick={() =>
                        this.props.history.push("/kelurahan/tambah")
                      }
                      icon
                      labelPosition="left"
                      primary
                      size="small"
                    >
                      <Icon name="add" /> Kelurahan
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan="4">
                    {responseKelurahan.totalItems > 0 &&
                    responseKelurahan.totalPages > 1 ? (
                      <Pagination
                        floated="right"
                        onPageChange={this.handlePaginationChange}
                        activePage={responseKelurahan.currentPage}
                        totalPages={responseKelurahan.totalPages}
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

export default withKeycloak(Kelurahan);
