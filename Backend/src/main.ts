
import * as path from "path"
import * as config from "config"
import * as fileUpload from "express-fileupload"
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from "@nestjs/common"
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from "@nestjs/common"

import { AppModule } from './app.module'


const serverConfig = config.get("server")
const staticFilesPath = path.join(__dirname, "../public")
export let app

async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(AppModule)
  const logger = new Logger("Root")

  app.enableCors()
  app.useStaticAssets(staticFilesPath)
  app.use(fileUpload())
  app.useGlobalPipes(new ValidationPipe())

  const port = process.env.PORT || serverConfig.port
  await app.listen(port)

  console.clear()
  logger.verbose(`Application running on port ${port}`)
}
bootstrap()