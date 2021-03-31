import { SetMetadata } from '@nestjs/common'
export const Parser = (data: string[]) => SetMetadata("data", data)