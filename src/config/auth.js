// Arquivo que contem configurações referentes a parte de autenticação JWT

export default {
  // gympointalexandrefelix1991 -> c9151d2d25552685caebe672c285ea71
  secret: process.env.APP_URL,
  expiresIn: '7d',
};
