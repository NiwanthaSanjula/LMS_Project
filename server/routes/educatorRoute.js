import express from 'express'
import { updateRoleToEducator } from '../controllers/educatorContoller.js'

const educatorRouter = express.Router()

//Add educator role
educatorRouter.get('/update-role', updateRoleToEducator)

export default educatorRouter