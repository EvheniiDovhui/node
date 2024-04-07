import express from 'express'

const app = express()

app.use((req, res, next) => {
	console.log('Наше проміжне ПЗ')
	next()
})

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.get('/contact', (req, res) => {
	res.send('<h1>Contact page</h1>')
})

app.listen(3000, () => {
	console.log('Example app listening on port 3000!')
})
