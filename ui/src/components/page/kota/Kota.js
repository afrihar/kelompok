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
  isProvinsi,
  isPusdatin,
  itemPerPage,
} from "../../util/Helpers";
import { kelompokApi } from "../../util/KelompokApi";
import { withKeycloak } from "@react-keycloak/web";
import { Redirect } from "react-router-dom";
import debounce from "lodash.debounce";

class Kota extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "kodeKota",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responseKota: [],
    provinsiOptions: [],
  };

  async componentDidMount() {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      const getProvinsiOptions = await kelompokApi.getKotaOptionsProvinsi(
        keycloak.token
      );
      const provinsiOptions = getProvinsiOptions.data;
      this.setState({ provinsiOptions });
      await this.handleGetKota();
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  }

  handleGetKota = async () => {
    this.setState({ isLoadingPage: true });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterProvinsi, filter } = this.state;
      const response = await kelompokApi.getKota(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        filterProvinsi,
        filter
      );
      const responseKota = response.data;
      this.setState({ responseKota });
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
      const { size, sortBy, direction, filterProvinsi } = this.state;
      if (filter) {
        try {
          const response = await kelompokApi.getKota(
            keycloak.token,
            1,
            size,
            sortBy,
            direction,
            filterProvinsi,
            filter
          );
          const responseKota = response.data;
          this.setState({ responseKota });
        } catch (error) {
          handleLogError(error);
        }
      } else {
        this.setState({ filter: null, filterValid: true });
        await this.handleGetKota();
      }
    }
    this.setState({ isLoadingSearch: false });
  }, 350);

  handleOnChangeSize = async (e, { value }) => {
    this.setState({ isLoadingPage: true, size: value });
    try {
      const { keycloak } = this.props;
      const { sortBy, direction, filterProvinsi, filter } = this.state;
      const response = await kelompokApi.getKota(
        keycloak.token,
        1,
        value,
        sortBy,
        direction,
        filterProvinsi,
        filter
      );
      const responseKota = response.data;
      this.setState({ responseKota });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handlePaginationChange = async (e, { activePage }) => {
    this.setState({ isLoadingPage: true, page: activePage });
    try {
      const { keycloak } = this.props;
      const { size, sortBy, direction, filterProvinsi, filter } = this.state;
      const response = await kelompokApi.getKota(
        keycloak.token,
        activePage,
        size,
        sortBy,
        direction,
        filterProvinsi,
        filter
      );
      const responseKota = response.data;
      this.setState({ responseKota });
    } catch (error) {
      handleLogError(error);
    }
    this.setState({ isLoadingPage: false });
  };
  handleDropdownChange = async (e, { value }) => {
    this.setState({ isLoadingPage: true, filterProvinsi: value });
    const { keycloak } = this.props;
    const { size, sortBy, direction, filter } = this.state;
    if (value !== "") {
      try {
        const response = await kelompokApi.getKota(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        const responseKota = response.data;
        this.setState({ responseKota });
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        const response = await kelompokApi.getKota(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          undefined,
          filter
        );
        const responseKota = response.data;
        this.setState({ responseKota, filterProvinsi: undefined });
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({ isLoadingPage: false });
  };

  render() {
    const { keycloak } = this.props;
    if (isPusdatin(keycloak) || isProvinsi(keycloak)) {
      const {
        size,
        filterValid,
        isLoadingPage,
        isLoadingSearch,
        responseKota,
        provinsiOptions,
        filter,
      } = this.state;
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responseKota.totalItems === 0) {
        popupMessage = "Tidak ada data Kota.";
      }
      return (
        <Container className="isi">
          <Header as="h1" textAlign="center">
            Master Kota
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
                  Total Data : {responseKota.totalItems}
                  {" Kota"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {isPusdatin(keycloak) ? (
                  <Dropdown
                    fluid
                    clearable
                    options={provinsiOptions}
                    search
                    selection
                    placeholder="Filter Provinsi"
                    onChange={this.handleDropdownChange}
                  />
                ) : (
                  <></>
                )}
              </Grid.Column>
              <Grid.Column>
                <Popup
                  trigger={
                    <Input
                      placeholder="Cari Kota"
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
                  open={!filterValid || responseKota.totalItems === 0}
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
                    <Label ribbon>Kode Kota</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Kode Kota (Kemendagri)</Table.HeaderCell>
                  <Table.HeaderCell>Nama Kota</Table.HeaderCell>
                  <Table.HeaderCell>Provinsi</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseKota.totalItems > 0 ? (
                  responseKota.data.map((kota) => (
                    <Table.Row
                      key={kota.kodeKota}
                      onClick={() => {
                        this.props.history.push(`/kota/${kota.kodeKota}`);
                      }}
                    >
                      <Table.Cell>{kota.kodeKota}</Table.Cell>
                      <Table.Cell>{kota.kodeKotaCapil}</Table.Cell>
                      <Table.Cell>{kota.namaKota}</Table.Cell>
                      {kota.provinsi ? (
                        <Table.Cell>{kota.provinsi.namaProvinsi}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention" /> Tidak Punya Provinsi
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
                      onClick={() => this.props.history.push("/kota/tambah")}
                      icon
                      labelPosition="left"
                      primary
                      size="small"
                    >
                      <Icon name="add" /> Kota
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan="2">
                    {responseKota.totalItems > 0 &&
                    responseKota.totalPages > 1 ? (
                      <Pagination
                        floated="right"
                        onPageChange={this.handlePaginationChange}
                        activePage={responseKota.currentPage}
                        totalPages={responseKota.totalPages}
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

export default withKeycloak(Kota);
