import * as cloudinary from 'cloudinary'
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from 'src/environments'

/**
 * Returns image url by upload file.
 *
 * @remarks
 * This method is part of the {@link shared/upload}.
 *
 * @param createReadStream - 1st input number
 * @returns The string mean of `createReadStream`
 *
 * @beta
 */
export const uploadFile = async (file: any): Promise<string> => {
	cloudinary.v2.config({
		cloud_name: CLOUDINARY_CLOUD_NAME!,
		api_key: CLOUDINARY_API_KEY!,
		api_secret: CLOUDINARY_API_SECRET!
	})

	const uniqueFilename = new Date().toISOString()

	const result = await new Promise(async (resolve, reject) => {
		cloudinary.v2.uploader
			.upload_stream(
				{
					folder: 'rest',
					public_id: uniqueFilename,
					tags: 'rest'
				}, // directory and tags are optional
				(err, image) => {
					if (err) {
						reject(err)
					}
					resolve(image)
				}
			)
			.end(file.buffer)
	})

	// tslint:disable-next-line:no-string-literal
	return result['secure_url']
}
