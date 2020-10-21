import { getRepository } from "typeorm"
import { Request, Response } from "express"
import { User } from "../entity/User"
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import * as nodemailer from 'nodemailer'
import * as crypto from 'crypto'

export const login = async (request: Request, response: Response) => {
	const { email, password } = request.body

	const user = await getRepository(User).find({
		where: {
			email
		},
	})

	if (user.length === 1) {

		if (await bcrypt.compare(password, user[0].password)) {

			const token = jwt.sign({
				id: user[0].id
			}, process.env.APP_SECRET, {
				expiresIn: '1d'
			})

			const data = {
				id: user[0].id,
				name: user[0].name,
				email: user[0].email,
				token
			}

			return response.json(data)

		} else {

			return response.status(404).json({ message: 'User not found'})

		}

	} 

	return response.status(404).json({ message: 'User not found'})
}

export const listUsers = async (request: Request, response: Response) => {
	const users = await getRepository(User).find()

	return response.json(users)
}

export const saveUser = async (request: Request, response: Response) => {
	const { name, email, password } = request.body

	try {
		
		const passwordHash = await bcrypt.hash(password, 8)
		
		const user = await getRepository(User).save({
			name,
			email,
			password: passwordHash
		})
		
		return response.status(201).json(user)

	} catch (error) {
		
		return response.status(422).json({ error })
	}
}

export const forgotPassword = async (request: Request, response: Response) => {
	const { email } = request.body

	try {

		const user = await getRepository(User).find({
			email
		})

		const transporter = nodemailer.createTransport({
			host: "smtp.mailtrap.io",
			port: 2525,
			auth: {
				user: "88d4b793cd909c",
				pass: "4a2a594bb1a993"
			}
		})

		const newPassword = crypto.randomBytes(4).toString('HEX')

		transporter.sendMail(
			{
				from: 'Admin <78f6ffae57-c601b7@inbox.mailtrap.io>',
				to: email,
				subject: 'Password Recovery',
				html: `<p>Your new password: ${newPassword}</p>`	
			}
		).then(async() => {

			const password = await bcrypt.hash(newPassword, 8)
			getRepository(User).update(user[0].id, {
				password
			}).then(
				() => response.status(200).json({ message: 'Email successfully sent' })
			).catch(
				() => response.status(404).json({ error: 'User not found' })
			)

		}).catch(
			() => response.status(404).json({ error: 'Fail to send email' })
		)

	} catch (error) {
		return response.status(404).json({ error })
	}
}