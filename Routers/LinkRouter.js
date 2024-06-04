import express from 'express'
import LinkController from '../Controllers/LinkController.js'

const LinkRouter= express.Router();

LinkRouter.get('/', LinkController.getAll)
LinkRouter.get('/:id', LinkController.getById)
LinkRouter.post('/', LinkController.add)
LinkRouter.put('/:id', LinkController.update)
LinkRouter.delete('/:id', LinkController.delete)
LinkRouter.get('/:id/target', LinkController.getTargets)
LinkRouter.post('/:id/target', LinkController.addTarget)

export default LinkRouter;