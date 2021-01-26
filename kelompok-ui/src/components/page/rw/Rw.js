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
import {
  alphanumeric,
  handleLogError,
  isKecamatan,
  isKelurahan,
  isKota,
  isProvinsi,
  isPusdatin,
  itemPerPage,
} from '../../util/Helpers'
import { withKeycloak } from '@react-keycloak/web'
import { Redirect } from 'react-router-dom'
import { kelompokApi } from '../../util/KelompokApi'
import debounce from 'lodash.debounce'

class Rw extends Component {
  state = {
    size: 10,
    direction: 'ASC',
    sortBy: 'kodeRw',
    filterValid: true,
    isLoading: false,
    responseRw: []
  }

  async componentDidMount () {
    this.setState({ isLoading: true })
    const { keycloak } = this.props
    try {
      const getKelurahanOptions = await kelompokApi.getRwOptionsKelurahan(keycloak.token)
      const kelurahanOptions = getKelurahanOptions.data
      this.setState({ kelurahanOptions })
      await this.handleGetRw()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleGetRw = async () => {
    const { keycloak } = this.props
    this.setState({ isLoading: true })
    try {
      const { size, sortBy, direction, filterKelurahan, filter } = this.state
      const response = await kelompokApi.getRw(keycloak.token, 1, size, sortBy, direction, filterKelurahan, filter)
      const responseRw = response.data
      this.setState({ isLoading: false, responseRw })
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
      const { size, sortBy, direction, filterKelurahan } = this.state
      if (filter) {
        try {
          const response = await kelompokApi.getRw(keycloak.token, 1, size, sortBy, direction, filterKelurahan, filter)
          const responseRw = response.data
          this.setState({ isLoading: false, responseRw })
        } catch (error) {
          handleLogError(error)
        }
      } else {
        this.setState({ filter: null, filterValid: true })
        await this.handleGetRw()
      }
    }
  }, 350)

  handleOnChangeSize = async (e, { value }) => {
    this.setState({ isLoading: true, size: value })
    const { keycloak } = this.props
    try {
      const { sortBy, direction, filterKelurahan, filter } = this.state
      const response = await kelompokApi.getRw(keycloak.token, 1, value, sortBy, direction, filterKelurahan, filter)
      const responseRw = response.data
      this.setState({ isLoading: false, responseRw })
    } catch (error) {
      handleLogError(error)
    }
  }
  handlePaginationChange = async (e, { activePage }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, page: activePage })
    const { size, sortBy, direction, filterKelurahan, filter } = this.state
    try {
      const response = await kelompokApi.getRw(keycloak.token, activePage, size, sortBy, direction, filterKelurahan, filter)
      const responseRw = response.data
      this.setState({ isLoading: false, responseRw })
    } catch (error) {
      handleLogError(error)
    }
  }
  handleDropdownChange = async (e, { value }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, filterKelurahan: value })
    const { size, sortBy, direction, filter } = this.state
    if (value !== '') {
      try {
        const response = await kelompokApi.getRw(keycloak.token, 1, size, sortBy, direction, value, filter)
        const responseRw = response.data
        this.setState({ isLoading: false, responseRw })
      } catch (error) {
        handleLogError(error)
      }
    } else {
      try {
        const response = await kelompokApi.getRw(keycloak.token, 1, size, sortBy, direction, undefined, filter)
        const responseRw = response.data
        this.setState({ isLoading: false, responseRw, filterKelurahan: undefined })
      } catch (error) {
        handleLogError(error)
      }
    }
  }

  render () {
    const { keycloak } = this.props
    if (isPusdatin(keycloak)
      || isProvinsi(keycloak)
      || isKota(keycloak)
      || isKecamatan(keycloak)
      || isKelurahan(keycloak)) {
      const { size, filterValid, isLoading, responseRw, kelurahanOptions, filter } = this.state
      let popupMessage = ''
      if (!filterValid) {
        popupMessage = 'Karakter Tidak valid.'
      } else if (responseRw.totalItems === 0) {
        popupMessage = 'Tidak ada data Rw.'
      }
      return (
        <Container className={'isi'}>
          <Header as='h1' textAlign='center'>
            Master Rw
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
                  Total Data : {responseRw.totalItems}{' Rw'}
                  {filter ? ' (filter)' : ''}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak) || isKecamatan(keycloak) ?
                  <Dropdown
                    clearable
                    fluid
                    options={kelurahanOptions}
                    placeholder='Filter Kelurahan'
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
                      placeholder={'Cari Rw'}
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
                  open={!filterValid || responseRw.totalItems === 0}
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
                    <Label ribbon>Kode Rw</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Label Rw</Table.HeaderCell>
                  <Table.HeaderCell>Nama Ketua Rw</Table.HeaderCell>
                  <Table.HeaderCell>No HP Rw</Table.HeaderCell>
                  <Table.HeaderCell>No Telp Rw</Table.HeaderCell>
                  <Table.HeaderCell>No Telp Alt Rw</Table.HeaderCell>
                  <Table.HeaderCell>Kelurahan</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseRw.totalItems > 0 ? (responseRw.data.map(rw =>
                  <Table.Row key={rw.kodeRw} onClick={() => {
                    this.props.history.push(`/rw/${rw.kodeRw}`)
                  }}>
                    <Table.Cell>{rw.kodeRw}</Table.Cell>
                    <Table.Cell>{rw.labelRw}</Table.Cell>
                    <Table.Cell>{rw.namaKetuaRw}</Table.Cell>
                    <Table.Cell>{rw.noHpRw}</Table.Cell>
                    <Table.Cell>{rw.noTelpRw}</Table.Cell>
                    <Table.Cell>{rw.noTelpRwAlt}</Table.Cell>
                    <Table.Cell>{rw.kelurahan ? rw.kelurahan.namaKelurahan :
                      <i>Belum punya Kelurahan</i>}</Table.Cell>
                  </Table.Row>)) : <></>}
              </Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan='2'>
                    <Button
                      onClick={() => this.props.history.push('/rw/tambah')}
                      icon
                      labelPosition='left'
                      primary
                      size='small'>
                      <Icon name='add'/> Tambah Rw
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan='5'>
                    {responseRw.totalItems > 0 && responseRw.totalPages > 1 ? (
                      <Pagination
                        floated='right'
                        onPageChange={this.handlePaginationChange}
                        activePage={responseRw.currentPage}
                        totalPages={responseRw.totalPages}
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

export default withKeycloak(Rw)