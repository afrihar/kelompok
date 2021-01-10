import React from 'react'
import {useKeycloak} from '@react-keycloak/web'
import {NavLink, withRouter} from 'react-router-dom'
import {Container, Dropdown, Image, Menu} from 'semantic-ui-react'
import {isKelurahan, isPusdatin} from './Helpers'
import {createMedia} from "@artsy/fresnel";

const {MediaContextProvider, Media} = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

function Navbar(props) {
  const {keycloak} = useKeycloak()
  const handleLogInOut = () => {
    if (keycloak.authenticated) {
      props.history.push('/')
      keycloak.logout()
    } else {
      keycloak.login()
    }
  }
  const checkAuthenticated = () => {
    if (!keycloak.authenticated) {
      handleLogInOut()
    }
  }
  // const getUsername = () => {
  //   return keycloak.authenticated && keycloak.tokenParsed && keycloak.tokenParsed['preferred_username']
  // }
  // const getName = () => {
  //   return keycloak.authenticated && keycloak.tokenParsed && keycloak.tokenParsed['name']
  // }
  const getFirstname = () => {
    return keycloak.authenticated && keycloak.tokenParsed && keycloak.tokenParsed['given_name']
  }
  const getLastname = () => {
    return keycloak.authenticated && keycloak.tokenParsed && keycloak.tokenParsed['family_name']
  }
  const getLogInOutText = () => {
    return keycloak.authenticated ? "Logout" : "Login"
  }
  const getMenuMasterProvinsi = () => {
    return keycloak.authenticated && isPusdatin(keycloak) ?
      <Dropdown.Item as={NavLink} exact to="/provinsi" onClick={checkAuthenticated}> Provinsi</Dropdown.Item> : <></>
  }
  const getMenuMasterKota = () => {
    return keycloak.authenticated && isPusdatin(keycloak) ?
      <Dropdown.Item as={NavLink} exact to="/kota" onClick={checkAuthenticated}> Kota</Dropdown.Item> : <></>
  }
  const getMenuMasterKecamatan = () => {
    return keycloak.authenticated && isPusdatin(keycloak) ?
      <Dropdown.Item as={NavLink} exact to="/kecamatan" onClick={checkAuthenticated}> Kecamatan</Dropdown.Item> : <></>
  }
  const getMenuMasterKelurahan = () => {
    return keycloak.authenticated && isPusdatin(keycloak) ?
      <Dropdown.Item as={NavLink} exact to="/kelurahan" onClick={checkAuthenticated}> Kelurahan</Dropdown.Item> : <></>
  }
  const getMenuMasterRw = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="/rw" onClick={checkAuthenticated}> RW</Dropdown.Item> : <></>
  }
  const getMenuMasterRt = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="/rt" onClick={checkAuthenticated}>RT</Dropdown.Item> : <></>
  }
  const getMenuMasterPetugas = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="/petugas" onClick={checkAuthenticated}>Petugas</Dropdown.Item> : <></>
  }
  const getMenuMasterKader = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="/kader" onClick={checkAuthenticated}>Kader</Dropdown.Item> : <></>
  }
  const getMenuKelompok = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="" onClick={checkAuthenticated}>Kelompok</Dropdown.Item> : <></>
  }
  const getMenuBangunan = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="" onClick={checkAuthenticated}>Bangunan</Dropdown.Item> : <></>
  }
  const getMenuRumahTangga = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="" onClick={checkAuthenticated}>Rumah Tangga</Dropdown.Item> : <></>
  }
  const getMenuKeluarga = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="" onClick={checkAuthenticated}>Keluarga</Dropdown.Item> : <></>
  }
  const getMenuIndividu = () => {
    return keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
      <Dropdown.Item as={NavLink} exact to="" onClick={checkAuthenticated}>Individu</Dropdown.Item> : <></>
  }
  return (
    <MediaContextProvider>
      <Media greaterThan='mobile'>
        <Menu fixed='top'>
          <Container>
            <Menu.Item header as={NavLink} exact to="/">
              <Image size='mini' src='/carik.svg' style={{marginRight: '1.5em'}}/>Kelompok
            </Menu.Item>
            {keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
              <Dropdown item text='Transaksi'>
                <Dropdown.Menu>
                  {getMenuKelompok()}
                  {getMenuBangunan()}
                  {getMenuRumahTangga()}
                  {getMenuKeluarga()}
                  {getMenuIndividu()}
                </Dropdown.Menu>
              </Dropdown> : <></>
            }
            {keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
              <Dropdown item text='Master'>
                <Dropdown.Menu>
                  <Dropdown.Header content='Wilayah' />
                  {getMenuMasterProvinsi()}
                  {getMenuMasterKota()}
                  {getMenuMasterKecamatan()}
                  {getMenuMasterKelurahan()}
                  {getMenuMasterRw()}
                  {getMenuMasterRt()}
                  <Dropdown.Divider/>
                  {getMenuMasterKader()}
                  <Dropdown.Divider/>
                  {getMenuMasterPetugas()}
                  <Dropdown.Divider/>
                  <Dropdown.Header content='Option' />
                </Dropdown.Menu>
              </Dropdown> : <></>
            }
            <Menu.Menu position='right'>
              {keycloak.authenticated &&
              <Dropdown text={`${getFirstname()}  ${getLastname()}`} pointing className='link item'>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/settings">User Settings</Dropdown.Item>
                  <Dropdown.Item onClick={() => keycloak.accountManagement()}>Manage Account</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>}
              <Menu.Item as={NavLink} exact to="/login" onClick={handleLogInOut}>{getLogInOutText()}</Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
      </Media>
      <Media as={Menu} at='mobile'>
        <Menu attached stackable compact>
          <Container>
            <Menu.Item header as={NavLink} exact to="/">
              <Image size='mini' src='/carik.svg'/>
            </Menu.Item>
            {keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
              <Dropdown item text='Transaksi'>
                <Dropdown.Menu>
                  {getMenuKelompok()}
                  {getMenuBangunan()}
                  {getMenuRumahTangga()}
                  {getMenuKeluarga()}
                  {getMenuIndividu()}
                </Dropdown.Menu>
              </Dropdown> : <></>
            }
            {keycloak.authenticated && (isPusdatin(keycloak) || isKelurahan(keycloak)) ?
              <Dropdown item text='Master'>
                <Dropdown.Menu>
                  {getMenuMasterKader()}
                  {getMenuMasterPetugas()}
                  <Dropdown.Divider/>
                  <Dropdown.Header icon='tags' content='Wilayah'/>
                  {getMenuMasterProvinsi()}
                  {getMenuMasterKota()}
                  {getMenuMasterKecamatan()}
                  {getMenuMasterKelurahan()}
                  {getMenuMasterRw()}
                  {getMenuMasterRt()}
                </Dropdown.Menu>
              </Dropdown> : <></>
            }
            <Menu.Menu position='right'>
              {keycloak.authenticated &&
              <Dropdown text={`${getFirstname()}  ${getLastname()}`} pointing className='link item'>
                <Dropdown.Menu>
                  <Dropdown.Item as={NavLink} to="/settings">User Settings</Dropdown.Item>
                  <Dropdown.Item onClick={() => keycloak.accountManagement()}>Manage Account</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>}
              <Menu.Item as={NavLink} exact to="/login" onClick={handleLogInOut}>{getLogInOutText()}</Menu.Item>
            </Menu.Menu>
          </Container>
        </Menu>
      </Media>
    </MediaContextProvider>
  )
}

export default withRouter(Navbar)