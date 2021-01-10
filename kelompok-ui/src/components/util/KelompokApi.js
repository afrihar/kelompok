import axios from 'axios'
import {config} from '../../Constants'

export const kelompokApi = {
  getUserExtrasMe, saveUserExtrasMe,
  getProvinsi, getProvinsiById, getProvinsiOptions, saveProvinsi, deleteProvinsi,
  getKota, getKotaById, getKotaOptions, saveKota, deleteKota,
  getKecamatan, getKecamatanById, getKecamatanOptions, saveKecamatan, deleteKecamatan,
  getKelurahan, getKelurahanById, getKelurahanOptions, saveKelurahan, deleteKelurahan,
  getRw, getRwById, getRwOptions, saveRw, deleteRw,
  getRt, getRtById, getRtOptions, saveRt, deleteRt
}

// UserExtras
function getUserExtrasMe(token) {
  return instance.get(`/api/userextras/me`, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

function saveUserExtrasMe(token, userExtra) {
  return instance.post(`/api/userextras/me`, userExtra, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

// Provinsi
function getProvinsi(token, page, size, sortBy, direction, filter) {
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

function getProvinsiById(idProvinsi, token) {
  return instance.get(`/api/provinsi/${idProvinsi}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getProvinsiOptions(token) {
  return instance.get(`/api/provinsi/options`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveProvinsi(provinsi, token) {
  return instance.post('/api/provinsi', provinsi, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteProvinsi(idProvinsi, token) {
  return instance.delete(`/api/provinsi/${idProvinsi}`, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

// Kota
function getKota(token, page, size, sortBy, direction, filterProvinsi, filter) {
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

function getKotaById(idKota, token) {
  return instance.get(`/api/kota/${idKota}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKotaOptions(token) {
  return instance.get(`/api/kota/options`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKota(kota, token) {
  return instance.post('/api/kota', kota, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKota(idKota, token) {
  return instance.delete(`/api/kota/${idKota}`, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

// Kecamatan
function getKecamatan(token, page, size, sortBy, direction, filterKota, filter) {
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

function getKecamatanById(idKecamatan, token) {
  return instance.get(`/api/kecamatan/${idKecamatan}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKecamatanOptions(token) {
  return instance.get(`/api/kecamatan/options`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKecamatan(kecamatan, token) {
  return instance.post('/api/kecamatan', kecamatan, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKecamatan(idKecamatan, token) {
  return instance.delete(`/api/kecamatan/${idKecamatan}`, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

// Kelurahan
function getKelurahan(token, page, size, sortBy, direction, filterKecamatan, filter) {
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

function getKelurahanById(idKelurahan, token) {
  return instance.get(`/api/kelurahan/${idKelurahan}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getKelurahanOptions(token) {
  return instance.get(`/api/kelurahan/options`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveKelurahan(kelurahan, token) {
  return instance.post('/api/kelurahan', kelurahan, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteKelurahan(idKelurahan, token) {
  return instance.delete(`/api/kelurahan/${idKelurahan}`, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

// RW
function getRw(token, page, size, sortBy, direction, filterKelurahan, filter) {
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

function getRwById(idRw, token) {
  return instance.get(`/api/rw/${idRw}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getRwOptions(token) {
  return instance.get(`/api/rw/options`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveRw(rw, token) {
  return instance.post('/api/rw', rw, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteRw(idRw, token) {
  return instance.delete(`/api/rw/${idRw}`, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

// RT
function getRt(token, page, size, sortBy, direction, filterRw, filter) {
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

function getRtById(idRt, token) {
  return instance.get(`/api/rt/${idRt}`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function getRtOptions(token) {
  return instance.get(`/api/rt/options`, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function saveRt(rt, token) {
  return instance.post('/api/rt', rt, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': bearerAuth(token)
    }
  })
}

function deleteRt(idRt, token) {
  return instance.delete(`/api/rt/${idRt}`, {
    headers: {'Authorization': bearerAuth(token)}
  })
}

// -- Axios
const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

instance.interceptors.response.use(response => {
  return response;
}, function (error) {
  if (error.response.status === 404) {
    return {status: error.response.status};
  }
  return Promise.reject(error.response);
});

// -- Helper functions
function bearerAuth(token) {
  return `Bearer ${token}`
}