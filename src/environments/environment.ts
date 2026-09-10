export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:9090', // ajusta al puerto donde corre tu Keycloak
    realm: 'springboot-realm-smartorder-dev',
    clientId: 'spring-client-smart-order'
  }
};