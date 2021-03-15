//TODO Config Frontend
// const prod = {
//   url: {
//     KEYCLOAK_BASE_URL: "https://carik.jakarta.go.id",
//     API_BASE_URL: "https://carik.jakarta.go.id/kelompokapi",
//     AVATARS_DICEBEAR_URL: "https://avatars.dicebear.com/v2",
//     SOA_DKI: "https://soadki.jakarta.go.id/rest/gov/dki/dukcapil/ws"
//   }
// };
const prod = {
  url: {
    KEYCLOAK_BASE_URL: "https://sso.dasawisma.id",
    API_BASE_URL: "https://kelompokapi.dasawisma.id",
    AVATARS_DICEBEAR_URL: "https://avatars.dicebear.com/v2",
    SOA_DKI: "https://soadki.jakarta.go.id/rest/gov/dki/dukcapil/ws"
  }
};
const dev = {
  url: {
    KEYCLOAK_BASE_URL: "http://sso.docker.id",
    API_BASE_URL: "http://kelompokapi.docker.id",
    AVATARS_DICEBEAR_URL: "https://avatars.dicebear.com/v2",
    SOA_DKI: "https://soadki.jakarta.go.id/rest/gov/dki/dukcapil/ws"
  }
};
console.log(process.env.NODE_ENV);
export const config = process.env.NODE_ENV === "development" ? dev : prod;
