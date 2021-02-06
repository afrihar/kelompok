import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/page/Home";
import { kelompokApi } from "./components/util/KelompokApi";
import PrivateRoute from "./components/util/PrivateRoute";
import UserSettings from "./components/page/UserSettings";
import { Dimmer, Header, Icon } from "semantic-ui-react";
import { config } from "./Constants";
import Provinsi from "./components/page/provinsi/Provinsi";
import ProvinsiDetail from "./components/page/provinsi/ProvinsiDetail";
import Kota from "./components/page/kota/Kota";
import KotaDetail from "./components/page/kota/KotaDetail";
import { handleLogError } from "./components/util/Helpers";
import Kecamatan from "./components/page/kecamatan/Kecamatan";
import KecamatanDetail from "./components/page/kecamatan/KecamatanDetail";
import Kelurahan from "./components/page/kelurahan/Kelurahan";
import Rw from "./components/page/rw/Rw";
import Rt from "./components/page/rt/Rt";
import KelurahanDetail from "./components/page/kelurahan/KelurahanDetail";
import RwDetail from "./components/page/rw/RwDetail";
import RtDetail from "./components/page/rt/RtDetail";
import Footer from "./components/util/Footer";
import NavBar from "./components/util/NavBar";
import Petugas from "./components/page/petugas/Petugas";
import PetugasTambah from "./components/page/petugas/PetugasTambah";
import PetugasDetail from "./components/page/petugas/PetugasDetail";

function App() {
  //TODO Keycloak Realm Config
  const keycloak = new Keycloak({
    url: `${config.url.KEYCLOAK_BASE_URL}/auth`,
    realm: "simpkk",
    clientId: "kelompok-dasawisma"
  });
  const initOptions = { pkceMethod: "S256" };

  const handleOnEvent = async (event, error) => {
    if (event === "onAuthSuccess") {
      if (keycloak.authenticated) {
        let response = await kelompokApi.getUserExtrasMe(keycloak.token);
        if (response.status === 404) {
          const userExtra = {
            avatar: keycloak.tokenParsed["preferred_username"]
          };
          response = await kelompokApi.saveUserExtrasMe(
            keycloak.token,
            userExtra
          );
          console.log(
            "UserExtra created for " +
            keycloak.tokenParsed["preferred_username"]
          );
        }
        keycloak["avatar"] = response.data.avatar;
      }
    } else if (error) {
      handleLogError(error);
    }
  };

  const loadingComponent = (
    <Dimmer inverted active={true} page>
      <Header style={{ color: "#4d4d4d" }} as="h2" icon inverted>
        <Icon loading name="spinner" />
        <Header.Content>
          Memuat Server Autentikasi & Otorisasi
          <Header.Subheader style={{ color: "#4d4d4d" }}>
            atau sedang menjalankan aliran kode otorisasi menggunakan PKCE
          </Header.Subheader>
        </Header.Content>
      </Header>
    </Dimmer>
  );
  return (
    <ReactKeycloakProvider authClient={keycloak} onEvent={(event, error) => handleOnEvent(event, error)}
                           initOptions={initOptions} LoadingComponent={loadingComponent}>
      <Router>
        <NavBar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/home" component={Home} />
          <PrivateRoute path="/settings" component={UserSettings} />
          <PrivateRoute path="/provinsi" exact component={Provinsi} />
          <PrivateRoute path="/provinsi/:kodeProvinsi" component={ProvinsiDetail} />
          <PrivateRoute path="/kota" exact component={Kota} />
          <PrivateRoute path="/kota/:kodeKota" component={KotaDetail} />
          <PrivateRoute path="/kecamatan" exact component={Kecamatan} />
          <PrivateRoute path="/kecamatan/:kodeKecamatan" component={KecamatanDetail} />
          <PrivateRoute path="/kelurahan" exact component={Kelurahan} />
          <PrivateRoute path="/kelurahan/:kodeKelurahan" component={KelurahanDetail} />
          <PrivateRoute path="/rw" exact component={Rw} />
          <PrivateRoute path="/rw/:kodeRw" component={RwDetail} />
          <PrivateRoute path="/rt" exact component={Rt} />
          <PrivateRoute path="/rt/:kodeRt" component={RtDetail} />
          <PrivateRoute path="/petugas" exact component={Petugas} />
          <PrivateRoute path="/petugas/tambah" component={PetugasTambah} />
          <PrivateRoute path="/petugas/:nik" component={PetugasDetail} />
          <Route component={Home} />
        </Switch>
        <Footer />
      </Router>
    </ReactKeycloakProvider>
  );
}

export default App;