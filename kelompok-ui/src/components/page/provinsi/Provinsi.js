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
import {handleLogError, isKelurahan, isPusdatin} from "../../util/Helpers";
import {withKeycloak} from '@react-keycloak/web'
import {Redirect} from 'react-router-dom'
import {kelompokApi} from "../../util/KelompokApi";
import debounce from "lodash.debounce";

const regex = new RegExp("^[a-zA-Z0-9 ]+$");

class Provinsi extends Component {
  state = {
    size: 10,
    direction: "ASC",
    sortBy: "id",
    filter: undefined,
    filterValid: true,
    isLoading: false,
    responseProvinsi: [],
    popupMessage: undefined
  }

  async componentDidMount() {
    this.setState({isLoading: true})
    try {
      await this.handleGetProvinsi();
    } catch (error) {
      handleLogError(error)
    }
  }

  handleGetProvinsi = async () => {
    const {keycloak} = this.props
    this.setState({isLoading: true})
    try {
      const {size, sortBy, direction, filter} = this.state
      const response = await kelompokApi.getProvinsi(keycloak.token, 1, size, sortBy, direction, filter)
      const responseProvinsi = response.data
      this.setState({isLoading: false, responseProvinsi})
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
      const {size, sortBy, direction} = this.state
      if (filter) {
        try {
          const response = await kelompokApi.getProvinsi(keycloak.token, 1, size, sortBy, direction, filter)
          const responseProvinsi = response.data
          this.setState({isLoading: false, responseProvinsi})
        } catch (error) {
          handleLogError(error)
        }
      } else {
        this.setState({filter: null, filterValid: true})
        await this.handleGetProvinsi()
      }
    }
  }, 350);

  handleOnChangeSize = async (e, {value}) => {
    this.setState({isLoading: true, size: value})
    const {keycloak} = this.props
    try {
      const {sortBy, direction, filter} = this.state
      const response = await kelompokApi.getProvinsi(keycloak.token, 1, value, sortBy, direction, filter)
      const responseProvinsi = response.data
      this.setState({isLoading: false, responseProvinsi})
    } catch (error) {
      handleLogError(error)
    }
  }
  handlePaginationChange = async (e, {activePage}) => {
    const {keycloak} = this.props
    this.setState({isLoading: true, page: activePage})
    const {size, sortBy, direction, filter} = this.state
    try {
      const response = await kelompokApi.getProvinsi(keycloak.token, activePage, size, sortBy, direction, filter)
      const responseProvinsi = response.data
      this.setState({isLoading: false, responseProvinsi})
    } catch (error) {
      handleLogError(error)
    }
  }

  render() {
    const {keycloak} = this.props
    if (isPusdatin(keycloak) || isKelurahan(keycloak)) {
      const {size, filterValid, isLoading, responseProvinsi, filter} = this.state
      let popupMessage = "";
      if (!filterValid) {
        popupMessage = "Karakter Tidak valid.";
      } else if (responseProvinsi.totalItems === 0) {
        popupMessage = "Tidak ada data Provinsi.";
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
            Master Provinsi
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
                  Total Data : {responseProvinsi.totalItems}{" Provinsi"}
                  {filter ? " (filter)" : ""}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column> </Grid.Column>
              <Grid.Column>
                <Popup
                  trigger={
                    <Input
                      placeholder={"Cari Provinsi"}
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
                  open={!filterValid || responseProvinsi.totalItems === 0}
                  position={"right center"}
                />
              </Grid.Column>
            </GridRow>
          </Grid>
          <Table compact selectable singleLine definition striped>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.Cell>
                  <Label ribbon>Id Provinsi</Label>
                </Table.Cell>
                <Table.HeaderCell>Kode Provinsi</Table.HeaderCell>
                <Table.HeaderCell>Kode Provinsi (Kemdagri)</Table.HeaderCell>
                <Table.HeaderCell>Nama Provinsi</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {responseProvinsi.totalItems > 0 ? (responseProvinsi.data.map(provinsi =>
                <Table.Row key={provinsi.id} onClick={() => {
                  this.props.history.push(`/provinsi/${provinsi.id}`);
                }}>
                  <Table.Cell>{provinsi.id}</Table.Cell>
                  <Table.Cell>{provinsi.kodeProvinsi}</Table.Cell>
                  <Table.Cell>{provinsi.kodeProvinsiCapil}</Table.Cell>
                  <Table.Cell>{provinsi.namaProvinsi}</Table.Cell>
                </Table.Row>)) : <></>}
            </Table.Body>
            <Table.Footer fullWidth>
              <Table.Row>
                <Table.HeaderCell colSpan='2'>
                  <Button
                    onClick={() => this.props.history.push('/provinsi/tambah')}
                    icon
                    labelPosition='left'
                    primary
                    size='small'>
                    <Icon name='add'/> Tambah Provinsi
                  </Button>
                </Table.HeaderCell>
                <Table.HeaderCell colSpan='6'>
                  {responseProvinsi.totalItems > 0 && responseProvinsi.totalPages > 1 ? (
                    <Pagination
                      floated='right'
                      onPageChange={this.handlePaginationChange}
                      activePage={responseProvinsi.currentPage}
                      totalPages={responseProvinsi.totalPages}
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

export default withKeycloak(Provinsi)