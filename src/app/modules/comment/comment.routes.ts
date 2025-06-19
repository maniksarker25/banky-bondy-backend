import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import CommentController from './comment.controller';
import { uploadFile } from '../../helper/fileUploader';
import validateRequest from '../../middlewares/validateRequest';
import CommentValidations from './comment.validation';

const router = express.Router();

router.get(
    '/get-conversation-comments/:id',
    auth(USER_ROLE.user),
    CommentController.getReviewComments
);
router.get(
    '/get-comment-replies/:id',
    auth(USER_ROLE.user),
    CommentController.getCommentReplies
);
router.get(
    '/get-comment-likers/:id',
    auth(USER_ROLE.user),
    CommentController.getCommentLikers
);

router.post(
    '/create-comment',
    auth(USER_ROLE.user),
    uploadFile(),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    validateRequest(CommentValidations.createCommentSchema),
    CommentController.createComment
);
router.post(
    '/create-reply',
    auth(USER_ROLE.user),
    uploadFile(),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    validateRequest(CommentValidations.createReplySchema),
    CommentController.createReply
);

router.delete(
    '/delete-comment/:id',
    auth(USER_ROLE.user),
    CommentController.deleteComment
);

router.patch(
    '/update-comment/:id',
    auth(USER_ROLE.user),
    uploadFile(),
    (req: Request, res: Response, next: NextFunction) => {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }
        next();
    },
    validateRequest(CommentValidations.updateCommentValidationSchema),
    CommentController.updateComment
);
router.patch(
    '/like-unlike/:id',
    auth(USER_ROLE.user),
    CommentController.likeUnlikeReview
);

router.get(
    '/get-my-comments',
    auth(USER_ROLE.user),
    CommentController.getMyComments
);

router.get('/get-my-likes', auth(USER_ROLE.user), CommentController.getMyLikes);

export const commentRoutes = router;
