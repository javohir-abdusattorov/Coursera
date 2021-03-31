
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'


@Injectable()
export class ParserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const data: string[] = this.reflector.get<string[]>('data', context.getHandler())
    if (!data || !data.length) return true

    const req = context.switchToHttp().getRequest()
  	this.parseBody(data, req)
    return true
  }

  parseBody(data: string[], req) {
  	for (const item of data) {
  		const [key, type] = item.split("::")
    	if (req.body[key] && typeof(req.body[key]) == "string") {
    		const bodyItem = req.body[key]
    		let parsed

    		if (type == "number") {
    			parsed = +bodyItem
    		}	else if (type == "date") {
    			if (typeof(+bodyItem) !== "number") throw new BadRequestException([`"${key}" must be date number`])
    			parsed = new Date(+bodyItem)
    		}	else if (type == "json") {
    			try { parsed = JSON.parse(bodyItem) }
    			catch (err) { throw new BadRequestException([`"${key}" must be valid JSON`]) }
    		}
    		req.body[key] = parsed
    	}
    }
  }
}