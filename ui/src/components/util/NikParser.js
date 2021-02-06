const wilayah = require("./wilayah.json");
exports.nikParser = function(nik) {
  return ({
    isValid: function() {
      const _this = this;
      const isValidLength = function() {
        return nik.length === 16;
      };
      const isValidProvinsi = function() {
        return !!_this.province();
      };
      const isValidKabupatenKota = function() {
        return !!_this.kabupatenKota();
      };
      const isValidKecamatan = function() {
        return !!_this.kecamatan();
      };
      const isValidLahir = function() {
        return !!_this.lahir();
      };
      const isValidKelamin = function() {
        return !!_this.kelamin();
      };
      const isValidKodeUnik = function() {
        if (parseInt(_this.kodeUnik()) > 0)
          return true;
      };
      return isValidLength()
        && isValidProvinsi()
        && isValidKabupatenKota()
        && isValidKecamatan()
        && isValidLahir()
        && isValidKelamin()
        && isValidKodeUnik();
    },
    provinceId: function() {
      return nik.substring(0, 2);
    },
    province: function() {
      if (wilayah.provinsi[this.provinceId()])
        return wilayah.provinsi[this.provinceId()];
    },
    kabupatenKotaId: function() {
      return nik.substring(0, 4);
    },
    kabupatenKota: function() {
      if (wilayah.kabkot[this.kabupatenKotaId()])
        return wilayah.kabkot[this.kabupatenKotaId()];
    },
    kecamatanId: function() {
      return nik.substring(0, 6);
    },
    kecamatan: function() {
      if (wilayah.kecamatan[this.kecamatanId()])
        return wilayah.kecamatan[this.kecamatanId()].split(" -- ")[0];
    },
    kodepos: function() {
      if (wilayah.kecamatan[this.kecamatanId()])
        return wilayah.kecamatan[this.kecamatanId()].slice(-5);
    },
    lahir: function() {
      let date;
      if (Number(nik.substring(6, 8)) > 40) date = Number(nik.substring(6, 8)) - 40;
      else date = Number(nik.substring(6, 8));
      const month = Number(nik.substring(8, 10));
      const year = Number(nik.substring(10, 12));
      return new Date(year, month - 1, date);
    },
    kelamin: function() {
      if (Number(nik.substring(6, 8)) > 0 && Number(nik.substring(6, 8)) < 32) return "L";
      else if (Number(nik.substring(6, 8)) > 40 && Number(nik.substring(6, 8)) < 72) return "P";
    },
    kodeUnik: function() {
      return nik.substring(12, 16);
    }
  });
};