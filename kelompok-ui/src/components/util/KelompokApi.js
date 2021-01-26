import axios from 'axios'
import { config } from '../../Constants'

export const kelompokApi = {
  getUserExtrasMe, saveUserExtrasMe,
  getProvinsi,
  getProvinsiByKode, getProvinsiByKodeCapil, saveProvinsi, deleteProvinsi,
  getKota,
  getKotaByKode, getKotaByKodeCapil, getKotaOptionsProvinsi, saveKota, deleteKota,
  getKecamatan,
  getKecamatanByKode, getKecamatanByKodeCapil, getKecamatanOptionsKota, saveKecamatan, deleteKecamatan,
  getKelurahan,
  getKelurahanByKode, getKelurahanByKodeCapil, getKelurahanOptionsKecamatan, saveKelurahan, deleteKelurahan,
  getRw,
  getRwByKode, getRwOptionsKelurahan, saveRw, deleteRw,
  getRt,
  getRtByKode, getRtOptionsRw, saveRt, deleteRt,
  getKader,
  getKaderByNoKader, saveKader, deleteKader, getKaderOptionsPetugas,
  getKaderOptionsKota, getKaderOptionsKecamatan, getKaderOptionsKelurahan, getKaderOptionsRw, getKaderOptionsRt,
  getPetugas,
  getPetugasByNik, savePetugas, deletePetugas,
  getKelompok,
  getKelompokById, saveKelompok, deleteKelompok
}

// UserExtras
function getUserExtrasMe (token) {
  return instance.get(`/api/userextras/me`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

function saveUserExtrasMe (token, userExtra) {
  return instance.post(`/api/userextras/me`, userExtra, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// Provinsi
function getProvinsi (token, page, size, sortBy, direction, filter) {
  return instance.get('/api/provinsi', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filter': filter
    }
  })
}

function getProvinsiByKode (kodeProvinsi, token) {
  return instance.get(`/api/provinsi/${kodeProvinsi}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getProvinsiByKodeCapil (kodeProvinsiCapil, token) {
  return instance.get(`/api/provinsi/kode-capil/${kodeProvinsiCapil}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveProvinsi (provinsi, token) {
  return instance.post('/api/provinsi', provinsi, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteProvinsi (idProvinsi, token) {
  return instance.delete(`/api/provinsi/${idProvinsi}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// Kota
function getKota (token, page, size, sortBy, direction, filterProvinsi, filter) {
  return instance.get('/api/kota', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterProvinsi': filterProvinsi,
      'filter': filter
    }
  })
}

function getKotaByKode (kodeKota, token) {
  return instance.get(`/api/kota/${kodeKota}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKotaByKodeCapil (kodeKotaCapil, token) {
  return instance.get(`/api/kota/kode-capil/${kodeKotaCapil}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKotaOptionsProvinsi (token) {
  return instance.get(`/api/kota/options-provinsi`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKota (kota, token) {
  return instance.post('/api/kota', kota, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKota (idKota, token) {
  return instance.delete(`/api/kota/${idKota}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// Kecamatan
function getKecamatan (token, page, size, sortBy, direction, filterKota, filter) {
  return instance.get('/api/kecamatan', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterKota': filterKota,
      'filter': filter
    }
  })
}

function getKecamatanByKode (kodeKecamatan, token) {
  return instance.get(`/api/kecamatan/${kodeKecamatan}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKecamatanByKodeCapil (kodeKecamatanCapil, token) {
  return instance.get(`/api/kecamatan/kode-capil/${kodeKecamatanCapil}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKecamatanOptionsKota (token) {
  return instance.get(`/api/kecamatan/options-kota`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKecamatan (kecamatan, token) {
  return instance.post('/api/kecamatan', kecamatan, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKecamatan (idKecamatan, token) {
  return instance.delete(`/api/kecamatan/${idKecamatan}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// Kelurahan
function getKelurahan (token, page, size, sortBy, direction, filterKecamatan, filter) {
  return instance.get('/api/kelurahan', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterKecamatan': filterKecamatan,
      'filter': filter
    }
  })
}

function getKelurahanByKode (kodeKelurahan, token) {
  return instance.get(`/api/kelurahan/${kodeKelurahan}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKelurahanByKodeCapil (kodeKelurahanCapil, token) {
  return instance.get(`/api/kelurahan/kode-capil/${kodeKelurahanCapil}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKelurahanOptionsKecamatan (token) {
  return instance.get(`/api/kelurahan/options-kecamatan`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKelurahan (kelurahan, token) {
  return instance.post('/api/kelurahan', kelurahan, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKelurahan (idKelurahan, token) {
  return instance.delete(`/api/kelurahan/${idKelurahan}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// RW
function getRw (token, page, size, sortBy, direction, filterKelurahan, filter) {
  return instance.get('/api/rw', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterKelurahan': filterKelurahan,
      'filter': filter
    }
  })
}

function getRwByKode (kodeRw, token) {
  return instance.get(`/api/rw/${kodeRw}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getRwOptionsKelurahan (token) {
  return instance.get(`/api/rw/options-kelurahan`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveRw (rw, token) {
  return instance.post('/api/rw', rw, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteRw (idRw, token) {
  return instance.delete(`/api/rw/${idRw}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// RT
function getRt (token, page, size, sortBy, direction, filterRw, filter) {
  return instance.get('/api/rt', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterRw': filterRw,
      'filter': filter
    }
  })
}

function getRtByKode (kodeRt, token) {
  return instance.get(`/api/rt/${kodeRt}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getRtOptionsRw (token) {
  return instance.get(`/api/rt/options-rw`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveRt (rt, token) {
  return instance.post('/api/rt', rt, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteRt (idRt, token) {
  return instance.delete(`/api/rt/${idRt}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// Kader (Ketua Dasawisma)
function getKader (token, page, size, sortBy, direction, filterWilayah, filter) {
  return instance.get('/api/kader', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterWilayah': filterWilayah,
      'filter': filter
    }
  })
}

function getKaderByNoKader (noKader, token) {
  return instance.get(`/api/kader/${noKader}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKaderOptionsKota (token) {
  return instance.get(`/api/kader/options-kota`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKaderOptionsKecamatan (kodeKota, token) {
  return instance.get(`/api/kader/options-kecamatan/${kodeKota}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKaderOptionsKelurahan (kodeKecamatan, token) {
  return instance.get(`/api/kader/options-kelurahan/${kodeKecamatan}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKaderOptionsRw (kodeKelurahan, token) {
  return instance.get(`/api/kader/options-rw/${kodeKelurahan}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKaderOptionsRt (kodeRw, token) {
  return instance.get(`/api/kader/options-rt/${kodeRw}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKaderOptionsPetugas (kodeRt, token) {
  return instance.get(`/api/kader/options-petugas/${kodeRt}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKader (kader, token) {
  return instance.post('/api/kader', kader, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKader (idKader, token) {
  return instance.delete(`/api/kader/${idKader}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// Petugas
function getPetugas (token, page, size, sortBy, direction, filterWilayah, filter) {
  return instance.get('/api/petugas', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterWilayah': filterWilayah,
      'filter': filter
    }
  })
}

function getPetugasByNik (nik, token) {
  return instance.get(`/api/petugas/${nik}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function savePetugas (petugas, token) {
  return instance.post('/api/petugas', petugas, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deletePetugas (nik, token) {
  return instance.delete(`/api/petugas/${nik}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// Kelompok
function getKelompok (token, page, size, sortBy, direction, filterWilayah, filter) {
  return instance.get('/api/kelompok', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    },
    params: {
      'page': page,
      'size': size,
      'sortBy': sortBy,
      'direction': direction,
      'filterWilayah': filterWilayah,
      'filter': filter
    }
  })
}

function getKelompokById (idKelompok, token) {
  return instance.get(`/api/kelompok/${idKelompok}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKelompok (kelompok, token) {
  return instance.post('/api/kelompok', kelompok, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKelompok (idKelompok, token) {
  return instance.delete(`/api/kelompok/${idKelompok}`, {
    headers: { 'Authorization': bearerAuth(token) }
  })
}

// -- Axios
const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

instance.interceptors.response.use(response => {
  return response
}, function (error) {
  if (error.response.status === 404) {
    return { status: error.response.status }
  }
  return Promise.reject(error.response)
})

// -- Helper functions
function bearerAuth (token) {
  return `Bearer ${token}`
}