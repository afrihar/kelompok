import React, { Component } from 'react'
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
} from '../../util/Helpers'
import { Redirect } from 'react-router-dom'
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
import { kelompokApi } from '../../util/KelompokApi'
import { withKeycloak } from '@react-keycloak/web'
import debounce from 'lodash.debounce'

class Kader extends Component {
  state = {
    size: 10,
    direction: 'ASC',
    sortBy: 'noKader',
    filterValid: true,
    isLoading: false,
    responseKader: []
  }

  async componentDidMount () {
    this.setState({ isLoading: true })
    try {
      const { keycloak } = this.props
      let getKaderOptions
      if (isPusdatin(keycloak) || isProvinsi(keycloak)) {
        getKaderOptions = await kelompokApi.getKaderOptionsKota(keycloak.token)
      } else if (isKota(keycloak)) {
        getKaderOptions = await kelompokApi.getKaderOptionsKecamatan(keycloak.tokenParsed['kode_wilayah'], keycloak.token)
      } else if (isKecamatan(keycloak)) {
        getKaderOptions = await kelompokApi.getKaderOptionsKelurahan(keycloak.tokenParsed['kode_wilayah'], keycloak.token)
      } else if (isKelurahan(keycloak)) {
        getKaderOptions = await kelompokApi.getKaderOptionsRw(keycloak.tokenParsed['kode_wilayah'], keycloak.token)
      } else if (isRw(keycloak)) {
        getKaderOptions = await kelompokApi.getKaderOptionsRt(keycloak.tokenParsed['kode_wilayah'], keycloak.token)
      }
      if (getKaderOptions !== undefined) {
        const kaderOptions = getKaderOptions.data
        this.setState({ kaderOptions })
      }
      await this.handleGetKader()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleGetKader = async () => {
    const { keycloak } = this.props
    this.setState({ isLoading: true })
    try {
      const { size, sortBy, direction, filterWilayah, filter } = this.state
      const response = await kelompokApi.getKader(keycloak.token, 1, size, sortBy, direction, filterWilayah, filter)
      const responseKader = response.data
      this.setState({ isLoading: false, responseKader })
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
      const { size, sortBy, direction, filterWilayah } = this.state
      if (filter) {
        try {
          const response = await kelompokApi.getKader(keycloak.token, 1, size, sortBy, direction, filterWilayah, filter)
          const responseKader = response.data
          this.setState({ isLoading: false, responseKader })
        } catch (error) {
          handleLogError(error)
        }
      } else {
        this.setState({ filter: null, filterValid: true })
        await this.handleGetKader()
      }
    }
  }, 350)
  handleOnSizeChange = async (e, { value }) => {
    this.setState({ isLoading: true, size: value })
    const { keycloak } = this.props
    try {
      const { sortBy, direction, filterWilayah, filter } = this.state
      const response = await kelompokApi.getKader(keycloak.token, 1, value, sortBy, direction, filterWilayah, filter)
      const responseKader = response.data
      this.setState({ isLoading: false, responseKader })
    } catch (error) {
      handleLogError(error)
    }
  }
  handlePaginationChange = async (e, { activePage }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, page: activePage })
    const { size, sortBy, direction, filterWilayah, filter } = this.state
    try {
      const response = await kelompokApi.getKader(keycloak.token, activePage, size, sortBy, direction, filterWilayah, filter)
      const responseKader = response.data
      this.setState({ isLoading: false, responseKader })
    } catch (error) {
      handleLogError(error)
    }
  }
  handleOptionsChange = async (e, { value }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, filterWilayah: value })
    const { size, sortBy, direction, filter } = this.state
    if (value !== '') {
      try {
        const response = await kelompokApi.getKader(keycloak.token, 1, size, sortBy, direction, value, filter)
        const responseKader = response.data
        this.setState({ isLoading: false, responseKader })
      } catch (error) {
        handleLogError(error)
      }
    } else {
      try {
        const response = await kelompokApi.getKader(keycloak.token, 1, size, sortBy, direction, undefined, filter)
        const responseKader = response.data
        this.setState({ isLoading: false, responseKader, filterWilayah: undefined })
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
      || isKelurahan(keycloak)
      || isRw(keycloak)
      || isRt(keycloak)) {
      const { size, filterValid, isLoading, responseKader, kaderOptions, filter } = this.state
      let popupMessage = ''
      if (!filterValid) {
        popupMessage = 'Karakter Tidak valid.'
      } else if (responseKader.totalItems === 0) {
        popupMessage = 'Tidak ada data Kader.'
      }
      return (
        <Container className={'isi'}>
          <Header as='h1' textAlign='center'>
            Ketua Dasawisma
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
                    onChange={this.handleOnSizeChange}
                    defaultValue={String(size)}
                  />{' '}
                  Total Data : {responseKader.totalItems}{' Rt'}
                  {filter ? ' (filter)' : ''}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {(isPusdatin(keycloak)
                  || isProvinsi(keycloak)
                  || isKota(keycloak)
                  || isKecamatan(keycloak)
                  || isKelurahan(keycloak)
                  || isRw(keycloak)
                ) ?
                  <Dropdown
                    clearable
                    fluid
                    options={kaderOptions}
                    placeholder='Filter Kader'
                    onChange={this.handleOptionsChange}
                    search
                    selection
                    scrolling
                  /> : <></>}
              </Grid.Column>
              <Grid.Column>
                <Popup
                  trigger={
                    <Input
                      placeholder={'Cari Kader'}
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
                  open={!filterValid || responseKader.totalItems === 0}
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
                    <Label ribbon>Nomor Kader</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Kelurahan Penugasan</Table.HeaderCell>
                  <Table.HeaderCell>RW Penugasan</Table.HeaderCell>
                  <Table.HeaderCell>RT Penugasan</Table.HeaderCell>
                  <Table.HeaderCell>NIK Petugas</Table.HeaderCell>
                  <Table.HeaderCell>Nama Petugas</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseKader.totalItems > 0 ? (responseKader.data.map(kader =>
                  <Table.Row key={kader.noKader} onClick={() => {
                    this.props.history.push(`/kader/${kader.noKader}`)
                  }}>
                    <Table.Cell>{kader.noKader}</Table.Cell>
                    <Table.Cell>{kader.rt ? kader.rt.rw.kelurahan.namaKelurahan :
                      <i>-</i>}</Table.Cell>
                    <Table.Cell>{kader.rt ? kader.rt.rw.labelRw :
                      <i>-</i>}</Table.Cell>
                    <Table.Cell>{kader.rt ? kader.rt.labelRt :
                      <i>-</i>}</Table.Cell>
                    <Table.Cell>{kader.petugas ? kader.petugas.nik :
                      <i>-</i>}</Table.Cell>
                    <Table.Cell>{kader.petugas ? kader.petugas.nama :
                      <i>-</i>}</Table.Cell>
                  </Table.Row>)) : <></>}</Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan='2'>
                    <Button
                      onClick={() => this.props.history.push('/kader/tambah')}
                      icon
                      labelPosition='left'
                      primary
                      size='small'>
                      <Icon name='add'/> Tambah Ketua Dawis
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan='4'>
                    {responseKader.totalItems > 0 && responseKader.totalPages > 1 ? (
                      <Pagination
                        floated='right'
                        onPageChange={this.handlePaginationChange}
                        activePage={responseKader.currentPage}
                        totalPages={responseKader.totalPages}
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

export default withKeycloak(Kader)