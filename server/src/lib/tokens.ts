import jwt from 'jsonwebtoken'

const tokensDuration = {
  access_token: '1h',
  refresh_token: '30d',
} as const

const JWT_SECRET = process.env['JWT_SECRET'] ?? 'DevSecretKey'

// 만약 JWT_SECRET 토큰을 못찾으면 warning msg를 보여줄 예정.
if (process.env['JWT_SECRET'] === undefined) {
  console.warn('JWT_SECRET is not defined in .env file')
}

export function generateToken(payload: TokenPayload) {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn: tokensDuration[payload.type],
      },
      (err, token) => {
        if (err || !token) {
          reject(err)
          return
        }
        resolve(token) // token이 promise 객체인데, 이걸 성공 상태로 변경하고 promise 결과값으로 token을 return.
      },
    )
  })
}
export function validateToken<T>(token: string) {
  return new Promise<DecodedToken<T>>((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err)
      }
      resolve(decoded as DecodedToken<T>)
    })
  })
}

interface AccessTokenPayload {
  type: 'access_token'
  userId: number
  tokenId: number
  username: string
}

interface RefreshTokenPayload {
  type: 'refresh_token'
  tokenId: number
  rotationCounter: number
}
type TokenPayload = AccessTokenPayload | RefreshTokenPayload

type DecodedToken<T> = {
  iat: number
  exp: number
} & T
