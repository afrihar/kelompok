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
  Table,
} from "semantic-ui-react";
import {
  alphanumeric,
  handleLogError,
  isKota,
  isProvinsi,
  isPusdatin,
  itemPerPage,
} from "../../util/Helpers";
import { kelompokApi } from "../../util/KelompokApi";
import { withKeycloak } from "@react-keycloak/web";
import { Redirect } from "react-router-dom";
import debounce from "lodash.debounce";

class Kecamatan extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "kodeKecamatan",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responseKecamatan: [],
    kotaOptions: [],
  };

  async componentDidMount() {
    this.setState({ isLoadingPage: true });
    const { keycloak } = this.props;
    try {
      const getKotaOptions = await kelompokApi.getKecamatanOptionsKota(
        keycloak.token
      );
      const kotaOptions = getKotaOptions.data;
      this.setState({ kotaOptions });
      await this.handleGetKecamatan();
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  }

  handleGetKecamatan = async () => {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterKota, filter } = this.state;
      const response = await kelompokApi.getKecamatan(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        filterKota,
        filter
      );
      const responseKecamatan = response.data;
      this.setState({ responseKecamatan });
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
      const { size, sortBy, direction, filterKota } = this.state;
      if (filter) {
        try {
          const response = await kelompokApi.getKecamatan(
            keycloak.token,
            1,
            size,
            sortBy,
            direction,
            filterKota,
            filter
          );
          const responseKecamatan = response.data;
          this.setState({ responseKecamatan });
        } catch (error) {
          handleLogError(error);
        }
      } else {
        this.setState({ filter: null, filterValid: true });
        await this.handleGetKecamatan();
      }
    }
    this.setState({ isLoadingSearch: false });
  }, 350);

  handleOnChangeSize = async (e, { value }) => {
    this.setState({ isLoadingPage: true, size: value });
    try {
      const { keycloak } = this.props;
      const { sortBy, direction, filterKota, filter } = this.state;
      const response = await kelompokApi.getKecamatan(
        keycloak.token,
        1,
        value,
        sortBy,
        direction,
        filterKota,
        filter
      );
      const responseKecamatan = response.data;
      this.setState({ responseKecamatan });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handlePaginationChange = async (e, { activePage }) => {
    this.setState({ isLoadingPage: true, page: activePage });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterKota, filter } = this.state;
      const response = await kelompokApi.getKecamatan(
        keycloak.token,
        activePage,
        size,
        sortBy,
        direction,
        filterKota,
        filter
      );
      const responseKecamatan = response.data;
      this.setState({ responseKecamatan });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handleDropdownChange = async (e, { value }) => {
    this.setState({ isLoadingPage: true, filterKota: value });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const response = await kelompokApi.getKecamatan(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        const responseKecamatan = response.data;
        this.setState({ responseKecamatan });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        const response = await kelompokApi.getKecamatan(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          undefined,
          filter
        );
        const responseKecamatan = response.data;
        this.setState({ responseKecamatan, filterKota: undefined });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ isLoadingPage: false });
  };

  render() {
    const { keycloak } = this.props;
    if (isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak)) {
      const {
        size,
        filterValid,
        isLoadingPage,
        isLoadingSearch,
        responseKecamatan,
        kotaOptions,
        filter,
      } = this.state;
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responseKecamatan.totalItems === 0) {
        popupMessage = "Tidak ada data Kecamatan.";
      }
      return (
        <Container className="isi">
          <Header as="h1" textAlign="center">
            Master Kecamatan
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
                  Total Data : {responseKecamatan.totalItems}
                  {" Kecamatan"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {isPusdatin(keycloak) || isProvinsi(keycloak) ? (
                  <Dropdown
                    clearable
                    fluid
                    options={kotaOptions}
                    placeholder="Filter Kota"
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
                      placeholder="Cari Kecamatan"
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
                  open={!filterValid || responseKecamatan.totalItems === 0}
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
                    <Label ribbon>Kode Kecamatan</Label>
                  </Table.Cell>
                  <Table.HeaderCell>
                    Kode Kecamatan (Kemendagri)
                  </Table.HeaderCell>
                  <Table.HeaderCell>Nama Kecamatan</Table.HeaderCell>
                  <Table.HeaderCell>Kota</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseKecamatan.totalItems > 0 ? (
                  responseKecamatan.data.map((kecamatan) => (
                    <Table.Row
                      key={kecamatan.kodeKecamatan}
                      onClick={() => {
                        this.props.history.push(
                          `/kecamatan/${kecamatan.kodeKecamatan}`
                        );
                      }}
                    >
                      <Table.Cell>{kecamatan.kodeKecamatan}</Table.Cell>
                      <Table.Cell>{kecamatan.kodeKecamatanCapil}</Table.Cell>
                      <Table.Cell>{kecamatan.namaKecamatan}</Table.Cell>
                      {kecamatan.kota ? (
                        <Table.Cell>{kecamatan.kota.namaKota}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" /> Tidak Punya Kota
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
                        this.props.history.push("/kecamatan/tambah")
                      }
                      icon
                      labelPosition="left"
                      primary
                      size="small"
                    >
                      <Icon name="add" /> Kecamatan
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan="2">
                    {responseKecamatan.totalItems > 0 &&
                    responseKecamatan.totalPages > 1 ? (
                      <Pagination
                        floated="right"
                        onPageChange={this.handlePaginationChange}
                        activePage={responseKecamatan.currentPage}
                        totalPages={responseKecamatan.totalPages}
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

export default withKeycloak(Kecamatan);
