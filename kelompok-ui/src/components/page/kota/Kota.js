import React, {Component} from 'react';
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
  Pagination,
  Popup,
  Table
} from "semantic-ui-react";
import {handleLogError, isProvinsi, isPusdatin} from "../../util/Helpers";
import {kelompokApi} from "../../util/KelompokApi";
import {withKeycloak} from '@react-keycloak/web'
import {Redirect} from 'react-router-dom'
import debounce from "lodash.debounce";

const regex = new RegExp("^[a-zA-Z0-9 ]+$");

class Kota extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "id",
    filter: undefined,
    filterProvinsi: undefined,
    filterValid: true,
    isLoading: false,
    responseKota: [],
    provinsiOptions: [],
    popupMessage: undefined
  }

  async componentDidMount() {
    this.setState({isLoading: true})
    const {keycloak} = this.props
    try {
      if (isPusdatin(keycloak)) {
        const getProvinsiOptions = await kelompokApi.getProvinsiOptions(keycloak.token)
        const provinsiOptions = getProvinsiOptions.data
        this.setState({provinsiOptions})
      }
      await this.handleGetKota();
    } catch (error) {
      handleLogError(error)
    }
  }

  handleGetKota = async () => {
    const {keycloak} = this.props
    this.setState({isLoading: true})
    try {
      const {size, sortBy, direction, filterProvinsi, filter} = this.state
      const response = await kelompokApi.getKota(keycloak.token, 1, size, sortBy, direction, filterProvinsi, filter)
      const responseKota = response.data
      this.setState({isLoading: false, responseKota})
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSearch = debounce(async (filter) => {
    this.setState({isLoading: true})
    if (filter !== "" && !regex.test(filter)) {
      this.setState({filterValid: false});
    } else {
      this.setState({filterValid: true, filter: filter});
      const {keycloak} = this.props
      const {size, sortBy, direction, filterProvinsi} = this.state
      if (filter) {
        try {
          const response = await kelompokApi.getKota(keycloak.token, 1, size, sortBy, direction, filterProvinsi, filter)
          const responseKota = response.data
          this.setState({isLoading: false, responseKota})
        } catch (error) {
          handleLogError(error)
        }
      } else {
        this.setState({filter: null, filterValid: true})
        await this.handleGetKota()
      }
    }
  }, 350);

  handleOnChangeSize = async (e, {value}) => {
    this.setState({isLoading: true, size: value})
    const {keycloak} = this.props
    try {
      const {sortBy, direction, filterProvinsi, filter} = this.state
      const response = await kelompokApi.getKota(keycloak.token, 1, value, sortBy, direction, filterProvinsi, filter)
      const responseKota = response.data
      this.setState({isLoading: false, responseKota})
    } catch (error) {
      handleLogError(error)
    }
  }
  handlePaginationChange = async (e, {activePage}) => {
    const {keycloak} = this.props
    this.setState({isLoading: true, page: activePage})
    const {size, sortBy, direction, filterProvinsi, filter} = this.state
    try {
      const response = await kelompokApi.getKota(keycloak.token, activePage, size, sortBy, direction, filterProvinsi, filter)
      const responseKota = response.data
      this.setState({isLoading: false, responseKota})
    } catch (error) {
      handleLogError(error)
    }
  }
  handleDropdownChange = async (e, {value}) => {
    const {keycloak} = this.props
    this.setState({isLoading: true, filterProvinsi: value})
    const {size, sortBy, direction, filter} = this.state
    if (value !== "") {
      try {
        const response = await kelompokApi.getKota(keycloak.token, 1, size, sortBy, direction, value, filter)
        const responseKota = response.data
        this.setState({isLoading: false, responseKota})
      } catch (error) {
        handleLogError(error)
      }
    } else {
      try {
        const response = await kelompokApi.getKota(keycloak.token, 1, size, sortBy, direction, undefined, filter)
        const responseKota = response.data
        this.setState({isLoading: false, responseKota, filterProvinsi: undefined})
      } catch (error) {
        handleLogError(error)
      }
    }
  }

  render() {
    const {keycloak} = this.props
    if (isPusdatin(keycloak) || isProvinsi(keycloak)) {
      const {size, filterValid, isLoading, responseKota, provinsiOptions, filter} = this.state
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responseKota.totalItems === 0) {
        popupMessage = "Tidak ada data Kota.";
      }
      const perPage = [
        {key: "0", value: "10", text: "10"},
        {key: "1", value: "25", text: "25"},
        {key: "2", value: "50", text: "50"},
        {key: "3", value: "100", text: "100"}
      ]
      return (
        <Container className={'content'}>
          <Header as='h1' textAlign='center'>
            Master Kota
          </Header>
          <Grid columns='equal' verticalAlign='middle'>
            <GridRow>
              <Grid.Column>
                <React.Fragment>
                  Data per halaman :{" "}
                  <Dropdown
                    inline={true}
                    placeholder={String(size)}
                    options={perPage}
                    onChange={this.handleOnChangeSize}
                    defaultValue={String(size)}
                  />{" "}
                  Total Data : {responseKota.totalItems}{" Kota"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {isPusdatin(keycloak) ?
                  <Dropdown
                    fluid
                    clearable
                    options={provinsiOptions}
                    search
                    selection
                    placeholder='Filter Provinsi'
                    onChange={this.handleDropdownChange}
                  /> : <></>}
              </Grid.Column>
              <Grid.Column>
                <Popup
                  trigger={
                    <Input
                      placeholder={"Cari Kota"}
                      name={"filter"}
                      error={!filterValid}
                      fluid
                      size='small'
                      icon={"search"}
                      loading={isLoading}
                      onChange={(e) => this.handleSearch(e.target.value)}
                    />
                  }
                  content={popupMessage}
                  on={"click"}
                  open={!filterValid || responseKota.totalItems === 0}
                  position={"right center"}
                />
              </Grid.Column>
            </GridRow>
          </Grid>
          <Table compact selectable singleLine definition striped>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.Cell>
                  <Label ribbon>Id Kota</Label>
                </Table.Cell>
                <Table.HeaderCell>Kode Kota</Table.HeaderCell>
                <Table.HeaderCell>Kode Kota (Kemendagri)</Table.HeaderCell>
                <Table.HeaderCell>Nama Kota</Table.HeaderCell>
                <Table.HeaderCell>Provinsi</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {responseKota.totalItems > 0 ? (responseKota.data.map(kota =>
                <Table.Row key={kota.id} onClick={() => {
                  this.props.history.push(`/kota/${kota.id}`);
                }}>
                  <Table.Cell>{kota.id}</Table.Cell>
                  <Table.Cell>{kota.kodeKota}</Table.Cell>
                  <Table.Cell>{kota.kodeKotaCapil}</Table.Cell>
                  <Table.Cell>{kota.namaKota}</Table.Cell>
                  <Table.Cell>{kota.masterProvinsi ? kota.masterProvinsi.namaProvinsi :
                    <i>Belum punya Provinsi</i>}</Table.Cell>
                </Table.Row>)) : <></>}
            </Table.Body>
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>
                  <Button onClick={() => this.props.history.push('/kota/tambah')}
                          icon
                          labelPosition='left'
                          primary
                          size='small'>
                    <Icon name='add'/> Tambah Kota
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell colSpan='3'>
                  {responseKota.totalItems > 0 && responseKota.totalPages > 1 ? (
                    <Pagination
                      floated='right'
                      onPageChange={this.handlePaginationChange}
                      activePage={responseKota.currentPage}
                      totalPages={responseKota.totalPages}
                      firstItem={{content: <Icon name='angle double left'/>, icon: true}}
                      lastItem={{content: <Icon name='angle double right'/>, icon: true}}
                      prevItem={{content: <Icon name='angle left'/>, icon: true}}
                      nextItem={{content: <Icon name='angle right'/>, icon: true}}
                      pointing
                      secondary
                    />) : <></>}
                </Table.HeaderCell>
              </Table.Row>
            </Table.Footer>
          </Table>
        </Container>
      )
    } else {
      return <Redirect to='/'/>
    }
  }
}

export default withKeycloak(Kota)