import React, { Component } from 'react'
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
} from 'semantic-ui-react'
import { alphanumeric, handleLogError, isKota, isProvinsi, isPusdatin, itemPerPage } from '../../util/Helpers'
import { kelompokApi } from '../../util/KelompokApi'
import { withKeycloak } from '@react-keycloak/web'
import { Redirect } from 'react-router-dom'
import debounce from 'lodash.debounce'

class Kecamatan extends Component {
  state = {
    size: 10,
    direction: 'ASC',
    sortBy: 'kodeKecamatan',
    filterValid: true,
    isLoading: false,
    responseKecamatan: [],
    kotaOptions: []
  }

  async componentDidMount () {
    this.setState({ isLoading: true })
    const { keycloak } = this.props
    try {
      const getKotaOptions = await kelompokApi.getKecamatanOptionsKota(keycloak.token)
      const kotaOptions = getKotaOptions.data
      this.setState({ kotaOptions })
      await this.handleGetKecamatan()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleGetKecamatan = async () => {
    const { keycloak } = this.props
    this.setState({ isLoading: true })
    try {
      const { size, sortBy, direction, filterKota, filter } = this.state
      const response = await kelompokApi.getKecamatan(keycloak.token, 1, size, sortBy, direction, filterKota, filter)
      const responseKecamatan = response.data
      this.setState({ isLoading: false, responseKecamatan })
    } catch (error) {
      handleLogError(error)
    }
  }

  handleSearch = debounce(async (filter) => {
    this.setState({ isLoading: true })
    if (filter !== '' && !alphanumeric.test(filter)) {
      this.setState({ filterValid: false })
    } else {
      this.setState({ filterValid: true, filter: filter })
      const { keycloak } = this.props
      const { size, sortBy, direction, filterKota } = this.state
      if (filter) {
        try {
          const response = await kelompokApi.getKecamatan(keycloak.token, 1, size, sortBy, direction, filterKota, filter)
          const responseKecamatan = response.data
          this.setState({ isLoading: false, responseKecamatan })
        } catch (error) {
          handleLogError(error)
        }
      } else {
        this.setState({ filter: null, filterValid: true })
        await this.handleGetKecamatan()
      }
    }
  }, 350)

  handleOnChangeSize = async (e, { value }) => {
    this.setState({ isLoading: true, size: value })
    const { keycloak } = this.props
    try {
      const { sortBy, direction, filterKota, filter } = this.state
      const response = await kelompokApi.getKecamatan(keycloak.token, 1, value, sortBy, direction, filterKota, filter)
      const responseKecamatan = response.data
      this.setState({ isLoading: false, responseKecamatan })
    } catch (error) {
      handleLogError(error)
    }
  }
  handlePaginationChange = async (e, { activePage }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, page: activePage })
    const { size, sortBy, direction, filterKota, filter } = this.state
    try {
      const response = await kelompokApi.getKecamatan(keycloak.token, activePage, size, sortBy, direction, filterKota, filter)
      const responseKecamatan = response.data
      this.setState({ isLoading: false, responseKecamatan })
    } catch (error) {
      handleLogError(error)
    }
  }
  handleDropdownChange = async (e, { value }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, filterKota: value })
    const { size, sortBy, direction, filter } = this.state
    if (value !== '') {
      try {
        const response = await kelompokApi.getKecamatan(keycloak.token, 1, size, sortBy, direction, value, filter)
        const responseKecamatan = response.data
        this.setState({ isLoading: false, responseKecamatan })
      } catch (error) {
        handleLogError(error)
      }
    } else {
      try {
        const response = await kelompokApi.getKecamatan(keycloak.token, 1, size, sortBy, direction, undefined, filter)
        const responseKecamatan = response.data
        this.setState({ isLoading: false, responseKecamatan, filterKota: undefined })
      } catch (error) {
        handleLogError(error)
      }
    }
  }

  render () {
    const { keycloak } = this.props
    if (isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak)) {
      const { size, filterValid, isLoading, responseKecamatan, kotaOptions, filter } = this.state
      let popupMessage = ''
      if (!filterValid) {
        popupMessage = 'Karakter Tidak valid.'
      } else if (responseKecamatan.totalItems === 0) {
        popupMessage = 'Tidak ada data Kecamatan.'
      }
      return (
        <Container className={'isi'}>
          <Header as='h1' textAlign='center'>
            Master Kecamatan
          </Header>
          <Grid columns='equal' verticalAlign='middle'>
            <GridRow>
              <Grid.Column>
                <React.Fragment>
                  Data per halaman :{' '}
                  <Dropdown
                    inline={true}
                    placeholder={String(size)}
                    options={itemPerPage()}
                    onChange={this.handleOnChangeSize}
                    defaultValue={String(size)}
                  />{' '}
                  Total Data : {responseKecamatan.totalItems}{' Kecamatan'}
                  {filter ? ' (filter)' : ''}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {(isPusdatin(keycloak) || isProvinsi(keycloak)) ?
                  <Dropdown
                    clearable
                    fluid
                    options={kotaOptions}
                    placeholder='Filter Kota'
                    onChange={this.handleDropdownChange}
                    search
                    selection
                    scrolling
                  /> : <></>}
              </Grid.Column>
              <Grid.Column>
                <Popup
                  trigger={
                    <Input
                      placeholder={'Cari Kecamatan'}
                      name={'filter'}
                      error={!filterValid}
                      fluid
                      size='small'
                      icon={'search'}
                      loading={isLoading}
                      onChange={(e) => this.handleSearch(e.target.value)}
                    />
                  }
                  content={popupMessage}
                  on={'click'}
                  open={!filterValid || responseKecamatan.totalItems === 0}
                  position={'right center'}
                />
              </Grid.Column>
            </GridRow>
          </Grid>
          {isLoading ? <Loader active/> :
            <Table compact selectable singleLine definition striped>
              <Table.Header fullWidth>
                <Table.Row>
                  <Table.Cell>
                    <Label ribbon>Kode Kecamatan</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Kode Kecamatan (Kemendagri)</Table.HeaderCell>
                  <Table.HeaderCell>Nama Kecamatan</Table.HeaderCell>
                  <Table.HeaderCell>Kota</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseKecamatan.totalItems > 0 ? (responseKecamatan.data.map(kecamatan =>
                  <Table.Row key={kecamatan.kodeKecamatan} onClick={() => {
                    this.props.history.push(`/kecamatan/${kecamatan.kodeKecamatan}`)
                  }}>
                    <Table.Cell>{kecamatan.kodeKecamatan}</Table.Cell>
                    <Table.Cell>{kecamatan.kodeKecamatanCapil}</Table.Cell>
                    <Table.Cell>{kecamatan.namaKecamatan}</Table.Cell>
                    <Table.Cell>{kecamatan.kota ? kecamatan.kota.namaKota :
                      <i>Belum punya Kota</i>}</Table.Cell>
                  </Table.Row>)) : <></>}
              </Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan='2'>
                    <Button onClick={() => this.props.history.push('/kecamatan/tambah')}
                            icon
                            labelPosition='left'
                            primary
                            size='small'>
                      <Icon name='add'/> Tambah Kecamatan
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan='2'>
                    {responseKecamatan.totalItems > 0 && responseKecamatan.totalPages > 1 ? (
                      <Pagination
                        floated='right'
                        onPageChange={this.handlePaginationChange}
                        activePage={responseKecamatan.currentPage}
                        totalPages={responseKecamatan.totalPages}
                        firstItem={{ content: <Icon name='angle double left'/>, icon: true }}
                        lastItem={{ content: <Icon name='angle double right'/>, icon: true }}
                        prevItem={{ content: <Icon name='angle left'/>, icon: true }}
                        nextItem={{ content: <Icon name='angle right'/>, icon: true }}
                        pointing
                        secondary
                      />) : <></>}
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>
          }
        </Container>
      )
    } else {
      return <Redirect to='/'/>
    }
  }
}

export default withKeycloak(Kecamatan)