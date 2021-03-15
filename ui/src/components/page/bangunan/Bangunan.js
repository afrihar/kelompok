import React, {Component} from "react";
import {withKeycloak} from "@react-keycloak/web";
import {alphanumeric, handleLogError, isKader, isKelurahan, isPusdatin, itemPerPage} from "../../util/Helpers";
import {kelompokApi} from "../../util/KelompokApi";
import debounce from "lodash.debounce";
import {Redirect} from "react-router-dom";
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

class Bangunan extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "id",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responseBangunan: [],
    bangunanKelompokOptions: []
  };

  async componentDidMount() {
    this.setState({isLoadingPage: true});
    try {
      const {keycloak} = this.props;
      const getKelompokOptions = await kelompokApi.getBangunanOptionsKelompok(keycloak.token);
      this.setState({bangunanKelompokOptions: getKelompokOptions.data});
      await this.handleGetBangunan();
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  }

  handleGetBangunan = async () => {
    this.setState({isLoadingPage: true});
    try {
      const {keycloak} = this.props;
      const {size, sortBy, direction, filterWilayah, filter} = this.state;
      const bangunan = await kelompokApi.getBangunan(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      this.setState({responseBangunan: bangunan.data});
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  }
  handleSearch = debounce(async (filter) => {
    this.setState({isLoadingSearch: true});
    if (filter !== "" && !alphanumeric.test(filter)) {
      this.setState({filterValid: false});
    } else {
      this.setState({filterValid: true, filter: filter});
      const {keycloak} = this.props;
      const {size, sortBy, direction, filterWilayah} = this.state;
      if (filter) {
        try {
          const bangunan = await kelompokApi.getBangunan(
            keycloak.token,
            1,
            size,
            sortBy,
            direction,
            filterWilayah,
            filter
          );
          this.setState({responseBangunan: bangunan.data});
        } catch (error) {
          handleLogError(error);
        }
      } else {
        this.setState({filter: null, filterValid: true});
        await this.handleGetBangunan();
      }
    }
    this.setState({isLoadingSearch: false});
  }, 350);
  handleOnSizeChange = async (e, {value}) => {
    this.setState({isLoadingPage: true, size: value});
    const {keycloak} = this.props;
    try {
      const {sortBy, direction, filterWilayah, filter} = this.state;
      const bangunan = await kelompokApi.getBangunan(
        keycloak.token,
        1,
        value,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      this.setState({responseBangunan: bangunan.data});
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  };
  handlePaginationChange = async (e, {activePage}) => {
    this.setState({isLoadingPage: true, page: activePage});
    const {keycloak} = this.props;
    const {size, sortBy, direction, filterWilayah, filter} = this.state;
    try {
      const bangunan = await kelompokApi.getBangunan(
        keycloak.token,
        activePage,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      this.setState({responseBangunan: bangunan.data});
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  };
  handleOptionsChange = async (e, {value}) => {
    this.setState({isLoadingPage: true, filterWilayah: value});
    const {keycloak} = this.props;
    const {size, sortBy, direction, filter} = this.state;
    if (value !== "") {
      try {
        const bangunan = await kelompokApi.getBangunan(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({responseBangunan: bangunan.data});
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        const bangunan = await kelompokApi.getBangunan(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          undefined,
          filter
        );
        this.setState({responseBangunan: bangunan.data, filterWilayah: undefined});
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({isLoadingPage: false});
  };

  render() {
    const {keycloak} = this.props;
    if (isPusdatin(keycloak) || isKelurahan(keycloak) || isKader(keycloak)) {
      const {
        size,
        filterValid,
        isLoadingPage,
        isLoadingSearch,
        responseBangunan,
        bangunanKelompokOptions,
        filter
      } = this.state;
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responseBangunan.totalItems === 0) {
        popupMessage = "Tidak ada data Bangunan.";
      }
      return (
        <Container className="isi">
          <Header as="h1" textAlign="center">
            Bangunan
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
                  Total Data : {responseBangunan.totalItems}
                  {" Rt"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {isPusdatin(keycloak) ||
                isKelurahan(keycloak) ||
                isKader(keycloak) ? (
                  <Dropdown
                    clearable
                    fluid
                    options={bangunanKelompokOptions}
                    placeholder="Filter Bangunan By Kelompok"
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
                      placeholder="Cari Bangunan"
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
                  open={!filterValid || responseBangunan.totalItems === 0}
                  position="right center"
                />
              </Grid.Column>
            </GridRow>
          </Grid>
          {isLoadingPage ? (
            <Loader active/>
          ) : (
            <Table compact selectable definition striped>
              <Table.Header fullWidth>
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>Id</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Indentifikasi Bangunan</Table.HeaderCell>
                  <Table.HeaderCell>No urut Bangunan</Table.HeaderCell>
                  <Table.HeaderCell>Nama Kelompok</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseBangunan.totalItems > 0 ? (
                  responseBangunan.data.map((bangunan) => (
                    <Table.Row
                      key={bangunan.id}
                      onClick={() => {
                        this.props.history.push(`/bangunan/${bangunan.id}`);
                      }}>
                      <Table.Cell>{bangunan.id}</Table.Cell>
                      {bangunan.identifikasi ? (
                        <Table.Cell>{bangunan.identifikasi}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {bangunan.noUrut ? (
                        <Table.Cell>{bangunan.noUrut}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {bangunan.kelompokBangunan.namaKelompok ? (
                        <Table.Cell>{bangunan.kelompokBangunan.namaKelompok}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
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
                  <Table.HeaderCell colSpan="1">
                    {(isPusdatin(keycloak) || isKelurahan(keycloak) || isKader(keycloak)) ?
                      <Button
                        onClick={() => this.props.history.push("/bangunan/tambah")}
                        icon labelPosition="left" primary size="small">
                        <Icon name="add"/> Bangunan
                      </Button> : <></>}
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan="3">
                    {responseBangunan.totalItems > 0 &&
                    responseBangunan.totalPages > 1 ? (
                      <Pagination
                        floated="right"
                        onPageChange={this.handlePaginationChange}
                        activePage={responseBangunan.currentPage}
                        totalPages={responseBangunan.totalPages}
                        firstItem={{
                          content: <Icon name="angle double left"/>,
                          icon: true
                        }}
                        lastItem={{
                          content: <Icon name="angle double right"/>,
                          icon: true
                        }}
                        prevItem={{
                          content: <Icon name="angle left"/>,
                          icon: true
                        }}
                        nextItem={{
                          content: <Icon name="angle right"/>,
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
      return <Redirect to="/"/>;
    }
  }
}

export default withKeycloak(Bangunan);