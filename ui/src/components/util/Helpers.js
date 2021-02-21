import { config } from "../../Constants";

export const alphanumeric = new RegExp("^[a-zA-Z0-9 ]+$");
export const noKader = new RegExp("^[bkps-u]\\d{5}$");
export const getPrefixKader = (kodeKota) => {
  switch (kodeKota) {
    case "3101":
      return "k";
    case "3171":
      return "s";
    case "3172":
      return "t";
    case "3173":
      return "p";
    case "3174":
      return "b";
    case "3175":
      return "u";
    default:
      return "";
  }
};
export const getAvatarUrl = (text) => {
  if (text === undefined) {
    return `/carik.svg`;
  } else {
    return `${config.url.AVATARS_DICEBEAR_URL}/avataaars/${text}.svg`;
  }
};
export const isPusdatin = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "PUSDATIN"
    )
  );
};
export const isProvinsi = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "PROVINSI"
    )
  );
};
export const isKota = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "KOTA"
    )
  );
};
export const isKecamatan = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "KECAMATAN"
    )
  );
};
export const isKelurahan = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "KELURAHAN"
    )
  );
};
export const isRw = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "RW"
    )
  );
};
export const isRt = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "RT"
    )
  );
};
export const isKader = (keycloak) => {
  return (
    keycloak &&
    keycloak.tokenParsed &&
    keycloak.tokenParsed.resource_access["kelompok-dasawisma"].roles.includes(
      "KADER"
    )
  );
};
export const getKodeWilayah = (keycloak) => {
  if (keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return keycloak.tokenParsed["kode_wilayah"].toString();
  } else {
    return "";
  }
};

export const getKodeProvinsi = (keycloak) => {
  if (isProvinsi(keycloak)) {
    return getKodeWilayah(keycloak);
  } else if (keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak).substr(0, 2);
  } else {
    return "";
  }
};

export const getKodeKota = (keycloak) => {
  if (isProvinsi(keycloak)) {
    return "";
  } else if (isKota(keycloak) && keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak);
  } else if (keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak).substr(0, 4);
  } else {
    return "";
  }
};

export const getKodeKecamatan = (keycloak) => {
  if (isProvinsi(keycloak) || isKota(keycloak)) {
    return "";
  } else if (isKecamatan(keycloak) && keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak);
  } else if (keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak).substr(0, 6);
  } else {
    return "";
  }
};

export const getKodeKelurahan = (keycloak) => {
  if (isProvinsi(keycloak) || isKota(keycloak) || isKecamatan(keycloak)) {
    return "";
  } else if (isKelurahan(keycloak) && keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak);
  } else if (keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak).substr(0, 9);
  } else {
    return "";
  }
};

export const getKodeRw = (keycloak) => {
  if (isProvinsi(keycloak) || isKota(keycloak) || isKecamatan(keycloak) || isKelurahan(keycloak)) {
    return "";
  } else if (isRw(keycloak) && keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak);
  } else if (keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak).substr(0, 12);
  } else {
    return "";
  }
};

export const getKodeRt = (keycloak) => {
  if (isProvinsi(keycloak) || isKota(keycloak) || isKecamatan(keycloak) || isKelurahan(keycloak) || isRw(keycloak)) {
    return "";
  } else if ((isRt(keycloak) || isKader(keycloak)) && keycloak && keycloak.tokenParsed && keycloak.tokenParsed["kode_wilayah"]) {
    return getKodeWilayah(keycloak);
  } else {
    return "";
  }
};

export const handleLogError = (error) => {
  if (error.response) {
    console.log("error.response.data");
    console.log(error.response.data);
  } else if (error.request) {
    console.log("error.request");
    console.log(error.request);
  } else {
    console.log("error.message");
    console.log(error.message);
  }
};

export function itemPerPage() {
  return [
    { key: "0", value: "10", text: "10" },
    { key: "1", value: "25", text: "25" },
    { key: "2", value: "50", text: "50" },
    { key: "3", value: "100", text: "100" }
  ];
}