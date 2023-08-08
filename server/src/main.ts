import Fastify from 'fastify'
import routes from './routes/index.js'
import fastifySwagger from '@fastify/swagger'
import { swaggerConfig } from './config/swagger.js'
import AppError from './lib/AppError.js'

const server = Fastify({
  logger: true,
})

await server.register(fastifySwagger, swaggerConfig)

server.setErrorHandler(async (error, request, reply) => {
  reply.statusCode = error.statusCode ?? 500 // error.statusCode가 null 혹은 undefined면 500을 사용
  if (error instanceof AppError) {
    // error객체가 AppError 클래스의 인스턴스인지 확인함
    return {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    }
  }
  return error
})

server.register(routes)

server.listen({ port: 4000 })
