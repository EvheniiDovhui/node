import express from 'express'
import cors from 'cors'
import { v4 } from 'uuid'
import { promises as fs } from 'fs'

const app = express()
// check
app.get('/ping', (req, res) => {
	res.status(400).json({ message: 'pong' })
})

app.use(express.json())

//middleware global
app.use((req, res, next) => {
	console.log('Наше проміжне ПЗ')

	req.time = new Date().toLocaleTimeString()
	next()
})
//middleware one
app.use('/users/:id', async (req, res, next) => {
	try {
		const { id } = req.params

		const usersDB = await fs.readFile('./data.json')
		const users = JSON.parse(usersDB)
		const user = users.find(u => u.id === id)
		if (!user) {
			return res.status(404).json({
				message: 'User not found',
			})
		}
		req.user = user
		next()
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'server error',
		})
	}
})

app.post('/users', async (req, res) => {
	try {
		const { name, year, day } = req.body

		const newUser = {
			id: v4(),
			name,
			year,
			day,
		}

		const usersDB = await fs.readFile('./data.json')
		const users = JSON.parse(usersDB)

		users.push(newUser)

		await fs.writeFile('./data.json', JSON.stringify(users))

		res.status(201).json({
			message: 'User created',
			user: newUser,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'server error',
		})
	}
})

//read many

app.get('/users', async (req, res) => {
	console.log(req.time)
	const usersDB = await fs.readFile('./data.json')
	const users = JSON.parse(usersDB)

	try {
		res.status(200).json({
			msg: 'success',
			user: users,
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({
			message: 'server error',
		})
	}
})
//read one
app.get('/users/:id', (req, res) => {
	// const { id } = req.params

	// const usersDB = await fs.readFile('./data.json')
	// const users = JSON.parse(usersDB)

	// const user = users.find(u => u.id === id)

	const { user } = req

	res.status(200).json({
		msg: 'success',
		user,
	})
})
// server init

const PORT = 3001

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}!`)
})
