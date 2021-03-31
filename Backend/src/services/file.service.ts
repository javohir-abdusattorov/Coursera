
import * as fs from "fs"
import * as path from "path"
import * as multer from "multer"
import * as crypto from "crypto"
import { Injectable } from '@nestjs/common'


@Injectable()
export class FileService {

	private async uploadFile(file, uploadPath, getPath, fileName): Promise<string> {
		const name = `${fileName}${path.parse(file.name).ext}`
		const filePath = path.join(uploadPath, name)
		await file.mv(filePath)

		return `${getPath}/${name}`
	}

	validateFileType(file, type): boolean {
    const fileMimeType = file.mimetype.split('/')[0]
    if (type == "image" && fileMimeType == "image") return true
    else if (type == "video" && fileMimeType == "video") return true

    return false
	}

	async uploadCourseVideo(file): Promise<string> {
		const uploadPath = path.join(__dirname, "../../public/public-assets/course")
		const fileName = `[course]-${new Date().getTime()}-${crypto.randomBytes(24).toString("hex")}`
		return this.uploadFile(file, uploadPath, `public-assets/course`, fileName)
	}

	async uploadUserImage(file): Promise<string> {
		const uploadPath = path.join(__dirname, "../../public/public-assets/user")
		const fileName = `[user]-${new Date().getTime()}-${crypto.randomBytes(24).toString("hex")}`
		return this.uploadFile(file, uploadPath, `public-assets/user`, fileName)
	}

	async uploadCourseImage(file): Promise<string> {
		const uploadPath = path.join(__dirname, "../../public/public-assets/course-poster")
		const fileName = `[course-poster]-${new Date().getTime()}-${crypto.randomBytes(24).toString("hex")}`
		return this.uploadFile(file, uploadPath, `public-assets/course-poster`, fileName)
	}

	deleteFiles(files: string[]): void {
		for (let file of files) {
			const filePath = path.join(__dirname, `../../public/${file}`)
			if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
		}
	}
}