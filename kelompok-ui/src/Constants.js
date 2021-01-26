//TODO Config Frontend
const prod = {
  url: {
    KEYCLOAK_BASE_URL: 'https://sso.dasawisma.id',
    API_BASE_URL: 'https://kelompokapi.dasawisma.id',
    AVATARS_DICEBEAR_URL: 'https://avatars.dicebear.com/v2'
  }
}

const dev = {
  url: {
    KEYCLOAK_BASE_URL: 'http://sso.kelompok.vm',
    API_BASE_URL: 'http://backend.kelompok.vm',
    AVATARS_DICEBEAR_URL: 'https://avatars.dicebear.com/v2'
  }
}

export const config = process.env.NODE_ENV === 'development' ? dev : prod