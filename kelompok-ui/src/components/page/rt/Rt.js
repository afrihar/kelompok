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
  isRw,
  itemPerPage
} from '../../util/Helpers'
import { withKeycloak } from '@react-keycloak/web'
import { Redirect } from 'react-router-dom'
import { kelompokApi } from '../../util/KelompokApi'
import debounce from 'lodash.debounce'

class Rt extends Component {
  state = {
    size: 10,
    direction: 'ASC',
    sortBy: 'kodeRt',
    filterValid: true,
    isLoading: false,
    responseRt: []
  }

  async componentDidMount () {
    this.setState({ isLoading: true })
    try {
      const { keycloak } = this.props
      const getRwOptions = await kelompokApi.getRtOptionsRw(keycloak.token)
      const rwOptions = getRwOptions.data
      this.setState({ rwOptions })
      await this.handleGetRt()
    } catch (error) {
      handleLogError(error)
    }
  }

  handleGetRt = async () => {
    const { keycloak } = this.props
    this.setState({ isLoading: true })
    try {
      const { size, sortBy, direction, filterRw, filter } = this.state
      const response = await kelompokApi.getRt(keycloak.token, 1, size, sortBy, direction, filterRw, filter)
      const responseRt = response.data
      this.setState({ isLoading: false, responseRt })
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
      const { size, sortBy, direction, filterRw } = this.state
      if (filter) {
        try {
          const response = await kelompokApi.getRt(keycloak.token, 1, size, sortBy, direction, filterRw, filter)
          const responseRt = response.data
          this.setState({ isLoading: false, responseRt })
        } catch (error) {
          handleLogError(error)
        }
      } else {
        this.setState({ filter: null, filterValid: true })
        await this.handleGetRt()
      }
    }
  }, 350)
  handleOnSizeChange = async (e, { value }) => {
    this.setState({ isLoading: true, size: value })
    const { keycloak } = this.props
    try {
      const { sortBy, direction, filterRw, filter } = this.state
      const response = await kelompokApi.getRt(keycloak.token, 1, value, sortBy, direction, filterRw, filter)
      const responseRt = response.data
      this.setState({ isLoading: false, responseRt })
    } catch (error) {
      handleLogError(error)
    }
  }
  handlePaginationChange = async (e, { activePage }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, page: activePage })
    const { size, sortBy, direction, filterRw, filter } = this.state
    try {
      const response = await kelompokApi.getRt(keycloak.token, activePage, size, sortBy, direction, filterRw, filter)
      const responseRt = response.data
      this.setState({ isLoading: false, responseRt })
    } catch (error) {
      handleLogError(error)
    }
  }
  handleDropdownChange = async (e, { value }) => {
    const { keycloak } = this.props
    this.setState({ isLoading: true, filterRw: value })
    const { size, sortBy, direction, filter } = this.state
    if (value !== '') {
      try {
        const response = await kelompokApi.getRt(keycloak.token, 1, size, sortBy, direction, value, filter)
        const responseRt = response.data
        this.setState({ isLoading: false, responseRt })
      } catch (error) {
        handleLogError(error)
      }
    } else {
      try {
        const response = await kelompokApi.getRt(keycloak.token, 1, size, sortBy, direction, undefined, filter)
        const responseRt = response.data
        this.setState({ isLoading: false, responseRt, filterRw: undefined })
      } catch (error) {
        handleLogError(error)
      }
    }
  }

  render () {
    const { keycloak } = this.props
    if (isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak) || isKecamatan(keycloak) || isKelurahan(keycloak) || isRw(keycloak)) {
      const { size, filterValid, isLoading, responseRt, rwOptions, filter } = this.state
      let popupMessage = ''
      if (!filterValid) {
        popupMessage = 'Karakter Tidak valid.'
      } else if (responseRt.totalItems === 0) {
        popupMessage = 'Tidak ada data Rt.'
      }
      return (
        <Container className={'isi'}>
          <Header as='h1' textAlign='center'>
            Master Rt
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
                  Total Data : {responseRt.totalItems}{' Rt'}
                  {filter ? ' (filter)' : ''}
                </React.Fragment>
              </Grid.Column>
              <Grid.Column>
                {(isPusdatin(keycloak) || isProvinsi(keycloak) || isKota(keycloak) || isKecamatan(keycloak) || isKelurahan(keycloak)) ?
                  <Dropdown
                    clearable
                    fluid
                    options={rwOptions}
                    placeholder='Filter Rw'
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
                      placeholder={'Cari Rt'}
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
                  open={!filterValid || responseRt.totalItems === 0}
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
                    <Label ribbon>Kode Rt</Label>
                  </Table.Cell>
                  <Table.HeaderCell>Label Rt</Table.HeaderCell>
                  <Table.HeaderCell>Nama Ketua Rt</Table.HeaderCell>
                  <Table.HeaderCell>No HP Rt</Table.HeaderCell>
                  <Table.HeaderCell>No Telp Rt</Table.HeaderCell>
                  <Table.HeaderCell>No Telp Alt Rt</Table.HeaderCell>
                  <Table.HeaderCell>Rw</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {responseRt.totalItems > 0 ? (responseRt.data.map(rt =>
                  <Table.Row key={rt.kodeRt} onClick={() => {
                    this.props.history.push(`/rt/${rt.kodeRt}`)
                  }}>
                    <Table.Cell>{rt.kodeRt}</Table.Cell>
                    <Table.Cell>{rt.labelRt}</Table.Cell>
                    <Table.Cell>{rt.namaKetuaRt}</Table.Cell>
                    <Table.Cell>{rt.noHpRt}</Table.Cell>
                    <Table.Cell>{rt.noTelpRt}</Table.Cell>
                    <Table.Cell>{rt.noTelpRtAlt}</Table.Cell>
                    <Table.Cell>{rt.rw ? rt.rw.labelRw :
                      <i>Belum punya Rw</i>}</Table.Cell>
                  </Table.Row>)) : <></>}
              </Table.Body>
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan='2'>
                    <Button
                      onClick={() => this.props.history.push('/rt/tambah')}
                      icon
                      labelPosition='left'
                      primary
                      size='small'>
                      <Icon name='add'/> Tambah Rt
                    </Button>
                  </Table.HeaderCell>
                  <Table.HeaderCell colSpan='5'>
                    {responseRt.totalItems > 0 && responseRt.totalPages > 1 ? (
                      <Pagination
                        floated='right'
                        onPageChange={this.handlePaginationChange}
                        activePage={responseRt.currentPage}
                        totalPages={responseRt.totalPages}
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

export default withKeycloak(Rt)