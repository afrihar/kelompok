import React from 'react'
import {Container, Header, Image} from 'semantic-ui-react'
import {useKeycloak} from "@react-keycloak/web";
import {getAvatarUrl} from "../util/Helpers";

const Home = () => {
  const kc = useKeycloak();
  return (
      <Container className={'content'} text>
        {kc.keycloak.authenticated &&
        <Header as='h2' icon textAlign='center'>
          <Header.Content>
            Selamat Datang {kc.keycloak.tokenParsed['given_name']} {kc.keycloak.tokenParsed['family_name']}
          </Header.Content>
        </Header>}
        {kc.keycloak.authenticated && <Image size='tiny' centered circular src={getAvatarUrl(kc.keycloak['avatar'])}/>}
        {kc.keycloak.authenticated &&
        <Header as='h3' className="ui center aligned header">
          Anda login sebagai {kc.keycloak.tokenParsed['preferred_username']}
        </Header>}
        {!kc.keycloak.authenticated &&
        <Image src='/complex-suburban.png' size='large' rounded centered/>
        }
        {!kc.keycloak.authenticated &&
        <Header as='h1' className="ui center aligned header">Sistem Informasi Kelompok Dasawisma</Header>
        }
      </Container>
  )
}
export default Home