import type {
  NextFunction,
  Request,
  Response,
  Router,
  RouterOptions,
} from 'express';
import express from 'express';
const router: Router = express.Router();

/* GET users listing. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  res.send('respond with a resource hello world');
});

export default router;
