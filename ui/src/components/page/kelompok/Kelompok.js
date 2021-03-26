import React, {Component} from "react";
import {withKeycloak} from "@react-keycloak/web";
import {kelompokApi} from "../../util/KelompokApi";
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

class Kelompok extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "id",
    filterValid: true,
    isLoadingPage: false,
    isLoadingSearch: false,
    responseKelompok: [],
    kelompokOptions: []
  };

  async componentDidMount() {
    this.setState({isLoadingPage: true});
    try {
      const {keycloak} = this.props;
      const getKotaOptions = await kelompokApi.getKelompokOptionsKota(keycloak.token);
      let valueKota;
      if (getKotaOptions.data.length === 1) {
        valueKota = getKotaOptions.data[0].key;
        const getKecamatanOptions = await kelompokApi.getKelompokOptionsKecamatan(valueKota, keycloak.token);
        let valueKecamatan;
        if (getKecamatanOptions.data.length === 1) {
          valueKecamatan = getKecamatanOptions.data[0].key;
          const getKelurahanOptions = await kelompokApi.getKelompokOptionsKelurahan(valueKecamatan, keycloak.token);
          let valueKelurahan;
          if (getKelurahanOptions.data.length === 1) {
            valueKelurahan = getKelurahanOptions.data[0].key;
            const getRwOptions = await kelompokApi.getKelompokOptionsRw(valueKelurahan, keycloak.token);
            let valueRw;
            if (getRwOptions.data.length === 1) valueRw = getRwOptions.data[0].key; else this.setState({clearableRw: true});
            this.setState({rwOptions: getRwOptions.data, valueRw});
          } else this.setState({clearableKelurahan: true});
          this.setState({kelurahanOptions: getKelurahanOptions.data, valueKelurahan});
        } else this.setState({clearableKecamatan: true});
        this.setState({kecamatanOptions: getKecamatanOptions.data, valueKecamatan});
      } else this.setState({clearableKota: true});
      this.setState({kotaOptions: getKotaOptions.data, valueKota});
      await this.handleGetKelompok();
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  }

  handleGetKelompok = async () => {
    this.setState({isLoadingPage: true});
    try {
      const {keycloak} = this.props;
      const {size, sortBy, direction, filterWilayah, filter} = this.state;
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
      this.setState({responseKelompok});
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  };
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
          const response = await kelompokApi.getKelompok(
            keycloak.token,
            1,
            size,
            sortBy,
            direction,
            filterWilayah,
            filter
          );
          this.setState({responseKelompok: response.data});
        } catch (error) {
          handleLogError(error);
        }
      } else {
        this.setState({filter: null, filterValid: true});
        await this.handleGetKelompok();
      }
    }
    this.setState({isLoadingSearch: false});
  }, 350);
  handleOnSizeChange = async (e, {value}) => {
    this.setState({isLoadingPage: true, size: value});
    const {keycloak} = this.props;
    try {
      const {sortBy, direction, filterWilayah, filter} = this.state;
      const response = await kelompokApi.getKelompok(
        keycloak.token,
        1,
        value,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      this.setState({responseKelompok: response.data});
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
      const response = await kelompokApi.getKelompok(
        keycloak.token,
        activePage,
        size,
        sortBy,
        direction,
        filterWilayah,
        filter
      );
      this.setState({responseKelompok: response.data});
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  };
  handleOptionsChangeKota = async (e, {value}) => {
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
    const {keycloak} = this.props;
    const {size, sortBy, direction, filter} = this.state;
    if (value !== "") {
      try {
        const getKecamatanOptions = await kelompokApi.getKelompokOptionsKecamatan(value, keycloak.token);
        this.setState({
          kecamatanOptions: getKecamatanOptions.data,
          isLoadingOptionKecamatan: false,
          clearableKecamatan: true
        });
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({responseKelompok: response.data});
      } catch (error) {
        handleLogError(error);
      }
    } else {
      this.setState({isLoadingOptionKecamatan: false});
      try {
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          31,
          filter
        );
        const responseKelompok = response.data;
        this.setState({responseKelompok, filterWilayah: 31});
      } catch (error) {
        handleLogError(error);
      }
    }
    this.setState({isLoadingPage: false});
  };
  handleOptionsChangeKecamatan = async (e, {value}) => {
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
    const {keycloak} = this.props;
    const {size, sortBy, direction, filter} = this.state;
    if (value !== "") {
      try {
        const getKelurahanOptions = await kelompokApi.getKelompokOptionsKelurahan(value, keycloak.token);
        this.setState({
          kelurahanOptions: getKelurahanOptions.data,
          isLoadingOptionKelurahan: false,
          clearableKelurahan: true
        });
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({responseKelompok: response.data});
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        this.setState({isLoadingOptionKelurahan: false});
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          this.state.valueKecamatan,
          filter
        );
        this.setState({responseKelompok: response.data});
      } catch (error) {
        handleLogError(error);
      }
      this.setState({isLoadingOptionKecamatan: false});
    }
    this.setState({isLoadingPage: false});
  };
  handleOptionsChangeKelurahan = async (e, {value}) => {
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
    const {keycloak} = this.props;
    const {size, sortBy, direction, filter} = this.state;
    if (value !== "") {
      try {
        const getRwOptions = await kelompokApi.getKelompokOptionsRw(value, keycloak.token);
        this.setState({rwOptions: getRwOptions.data, isLoadingOptionRw: false, clearableRw: true});
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({responseKelompok: response.data});
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        this.setState({isLoadingOptionRw: false});
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          this.state.valueKecamatan,
          filter
        );
        this.setState({responseKelompok: response.data});
      } catch (error) {
        handleLogError(error);
      }
      this.setState({isLoadingOptionKelurahan: false});
    }
    this.setState({isLoadingPage: false});
  };
  handleOptionsChangeRw = async (e, {value}) => {
    this.setState({
      isLoadingPage: true,
      rtOptions: [],
      isLoadingOptionRt: true,
      valueRw: value,
      valueRt: "",
      filterWilayah: value
    });
    const {keycloak} = this.props;
    const {size, sortBy, direction, filter} = this.state;
    if (value !== "") {
      try {
        const getRtOptions = await kelompokApi.getKelompokOptionsRt(value, keycloak.token);
        this.setState({rtOptions: getRtOptions.data, isLoadingOptionRt: false, clearableRt: true});
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          value,
          filter
        );
        this.setState({responseKelompok: response.data});
      } catch (error) {
        handleLogError(error);
      }
    } else {
      try {
        this.setState({isLoadingOptionRt: false});
        const response = await kelompokApi.getKelompok(
          keycloak.token,
          1,
          size,
          sortBy,
          direction,
          this.state.valueKelurahan,
          filter
        );
        this.setState({responseKelompok: response.data});
      } catch (error) {
        handleLogError(error);
      }
      this.setState({isLoadingOptionRt: false});
    }
    this.setState({isLoadingPage: false});
  };
  handleOptionsChangeRt = async (e, {value}) => {
    this.setState({
      isLoadingPage: true,
      valueRt: value,
      filterWilayah: value
    });
    const {keycloak} = this.props;
    const {size, sortBy, direction, filter} = this.state;
    try {
      const response = await kelompokApi.getKelompok(
        keycloak.token,
        1,
        size,
        sortBy,
        direction,
        value ? value : this.state.valueRw,
        filter
      );
      this.setState({responseKelompok: response.data});
    } catch (error) {
      handleLogError(error);
    }
    this.setState({isLoadingPage: false});
  };

  render() {
    const {keycloak} = this.props;
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
        isLoadingOptionKecamatan,
        isLoadingOptionKelurahan,
        isLoadingOptionRw,
        isLoadingOptionRt,
        // kelompokOptions,
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
                  placeholder="Kota Tugas"
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
                  placeholder="Kecamatan Tugas"
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
                  placeholder="Kelurahan Tugas"
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
                  placeholder="Rw Tugas"
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
                  placeholder="Rt Tugas"
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
                  Total Data : {responseKelompok.totalItems}
                  {" Rt"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              {/*<Grid.Column>*/}
              {/*  {isPusdatin(keycloak) ||*/}
              {/*  isProvinsi(keycloak) ||*/}
              {/*  isKota(keycloak) ||*/}
              {/*  isKecamatan(keycloak) ||*/}
              {/*  isKelurahan(keycloak) ||*/}
              {/*  isRw(keycloak) ? (*/}
              {/*    <Dropdown*/}
              {/*      clearable*/}
              {/*      fluid*/}
              {/*      options={kelompokOptions}*/}
              {/*      placeholder="Filter Kelompok By Wilayah"*/}
              {/*      onChange={this.handleOptionsChange}*/}
              {/*      search*/}
              {/*      selection*/}
              {/*      scrolling*/}
              {/*    />*/}
              {/*  ) : (*/}
              {/*    <></>*/}
              {/*  )}*/}
              {/*</Grid.Column>*/}
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
            <Loader active/>
          ) : (
            <Table compact selectable definition striped>
              <Table.Header fullWidth>
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>Id</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Nama Kelompok</Table.HeaderCell>
                  <Table.HeaderCell>NIK Kader</Table.HeaderCell>
                  <Table.HeaderCell>Nama Kader</Table.HeaderCell>
                  <Table.HeaderCell>RT</Table.HeaderCell>
                  <Table.HeaderCell>RW</Table.HeaderCell>
                  <Table.HeaderCell>Kelurahan</Table.HeaderCell>
                  <Table.HeaderCell>Target Bangunan</Table.HeaderCell>
                  {/*<Table.HeaderCell>Jumlah Bangunan</Table.HeaderCell>*/}
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
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {kelompok.petugasKelompok ? (
                        <Table.Cell>{kelompok.petugasKelompok.nama}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {kelompok.rtKelompok ? (
                        <Table.Cell>{kelompok.rtKelompok.labelRt}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {kelompok.rtKelompok ? (
                        <Table.Cell>{kelompok.rtKelompok.rw.labelRw}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {kelompok.rtKelompok ? (
                        <Table.Cell>{kelompok.rtKelompok.rw.kelurahan.namaKelurahan}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {kelompok.targetBangunanKelompok ? (
                        <Table.Cell>{kelompok.targetBangunanKelompok}</Table.Cell>
                      ) : (
                        <Table.Cell error>
                          {" "}
                          <Icon name="attention"/>
                        </Table.Cell>
                      )}
                      {/*{kelompok.jumlahBangunan ? (*/}
                      {/*  <Table.Cell>{kelompok.jumlahBangunan}</Table.Cell>*/}
                      {/*) : (*/}
                      {/*  <Table.Cell error>*/}
                      {/*    {" "}*/}
                      {/*    <Icon name="attention"/>*/}
                      {/*  </Table.Cell>*/}
                      {/*)}*/}
                    </Table.Row>
                  ))
                ) : (
                  <></>
                )}
              </Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan="2">
                    {(isKelurahan(keycloak) || isPusdatin(keycloak)) ? <Button
                      onClick={() => this.props.history.push("/kelompok/tambah")}
                      icon labelPosition="left" primary size="small">
                      <Icon name="add"/> Kelompok
                    </Button> : <></>}
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

export default withKeycloak(Kelompok);