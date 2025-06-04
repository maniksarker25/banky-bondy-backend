import { Router } from 'express';
import { userRoutes } from '../modules/user/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { normalUserRoutes } from '../modules/normalUser/normalUser.routes';
import { notificationRoutes } from '../modules/notification/notification.routes';
import { categoryRoutes } from '../modules/category/category.routes';
import { bannerRoutes } from '../modules/banner/banner.routes';
import { metaRoutes } from '../modules/meta/meta.routes';
import { feedbackRoutes } from '../modules/feedback/feedback.routes';
import { transactionRoutes } from '../modules/transaction/transaction.routes';
import { topicRoutes } from '../modules/topic/topic.routes';
import { reportRoutes } from '../modules/report/report.routes';
import { skillRoutes } from '../modules/skill/skill.routes';
import { relativeRoutes } from '../modules/relative/relative.routes';
import { projectRoutes } from '../modules/project/project.routes';

const router = Router();

const moduleRoutes = [
    {
        path: '/auth',
        router: authRoutes,
    },
    {
        path: '/user',
        router: userRoutes,
    },
    {
        path: '/normal-user',
        router: normalUserRoutes,
    },

    {
        path: '/manage',
        router: ManageRoutes,
    },
    {
        path: '/notification',
        router: notificationRoutes,
    },
    {
        path: '/category',
        router: categoryRoutes,
    },

    {
        path: '/banner',
        router: bannerRoutes,
    },
    {
        path: '/meta',
        router: metaRoutes,
    },
    {
        path: '/feedback',
        router: feedbackRoutes,
    },

    {
        path: '/transaction',
        router: transactionRoutes,
    },

    {
        path: '/topic',
        router: topicRoutes,
    },
    {
        path: '/report',
        router: reportRoutes,
    },
    {
        path: '/skill',
        router: skillRoutes,
    },
    {
        path: '/relative',
        router: relativeRoutes,
    },
    {
        path: '/project',
        router: projectRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
