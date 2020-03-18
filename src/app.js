const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// Define path for Express config
const app = express()
const pathDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(pathDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Kalai'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Kalai'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'Need help in getting weather app details',
        title: 'About me',
        name: 'Kalai'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide address!'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            })
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                address: req.query.address,
                forecast: forecastData,
                location

            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('page404', {
        title: '404',
        error: 'Help article not found',
        name: 'Kalai'
    })
})

app.get('*', (req, res) => {
    res.render('page404', {
        title: '404',
        error: 'Page not found',
        name: 'Kalai'
    })
})

app.listen(3000, () => {
    console.log('Server started on port 3000.')
})