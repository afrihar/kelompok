import {config} from '../../Constants'

export const getAvatarUrl = (text) => {
  return `${config.url.AVATARS_DICEBEAR_URL}/avataaars/${text}.svg`
}

export const isPusdatin = (keycloak) => {
  return keycloak && keycloak.tokenParsed && keycloak.tokenParsed.resource_access['kelompok-dasawisma'].roles.includes('PUSDATIN')
}

export const isProvinsi = (keycloak) => {
  return keycloak && keycloak.tokenParsed && keycloak.tokenParsed.resource_access['kelompok-dasawisma'].roles.includes('PROVINSI')
}

export const isKota = (keycloak) => {
  return keycloak && keycloak.tokenParsed && keycloak.tokenParsed.resource_access['kelompok-dasawisma'].roles.includes('KOTA')
}

export const isKecamatan = (keycloak) => {
  return keycloak && keycloak.tokenParsed && keycloak.tokenParsed.resource_access['kelompok-dasawisma'].roles.includes('KECAMATAN')
}

export const isKelurahan = (keycloak) => {
  return keycloak && keycloak.tokenParsed && keycloak.tokenParsed.resource_access['kelompok-dasawisma'].roles.includes('KELURAHAN')
}

export const isRw = (keycloak) => {
  return keycloak && keycloak.tokenParsed && keycloak.tokenParsed.resource_access['kelompok-dasawisma'].roles.includes('RW')
}

// export const isRt = (keycloak) => {
//   return keycloak && keycloak.tokenParsed && keycloak.tokenParsed.resource_access['kelompok-dasawisma'].roles.includes('RT')
// }

export const handleLogError = (error) => {
  if (error.response) {
    console.log('error.response.data');
    console.log(error.response.data);
  } else if (error.request) {
    console.log('error.request');
    console.log(error.request);
  } else {
    console.log('error.message');
    console.log(error.message);
  }
}