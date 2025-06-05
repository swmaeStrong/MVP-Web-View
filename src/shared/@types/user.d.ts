declare namespace Token {
  interface TokenResponse {
    accessToken: string
    refreshToken: string
  }

  interface TokenRequest {
    refreshToken: string
  }
}
