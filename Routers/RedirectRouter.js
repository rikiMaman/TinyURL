import express from "express"

import RedirectController from '../Controllers/RedirectController.js'

const RedirectRouter= express.Router();
RedirectRouter.get('/:uniqueId', RedirectController.redirectLink)
export default RedirectRouter;
