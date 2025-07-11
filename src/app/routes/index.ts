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
import { audioRoutes } from '../modules/audio/audio.routes';
import { audioBookmarkRoutes } from '../modules/audioBookmark/audio.bookmark.routes';
import { playlistRoutes } from '../modules/playlist/playlist.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { projectJoinRequestRoutes } from '../modules/projectJoinRequest/projectJoinRequest.routes';
import { projectMemberRoutes } from '../modules/projectMember/projectMember.routes';
import { projectDocumentRoutes } from '../modules/projectDocument/projectDocument.routes';
import { projectImageRoutes } from '../modules/projectImage/projectImage.routes';
import { institutionRoutes } from '../modules/institution/institution.routes';
import { institutionMemberRoutes } from '../modules/institutionMember/institutionMember.routes';
import { institutionConversationRoutes } from '../modules/institutionConversation/institutionConversation.routes';
import { commentRoutes } from '../modules/comment/comment.routes';
import { bondRoutes } from '../modules/bond/bond.routes';
import { bondRequestRoutes } from '../modules/bondRequest/bondRequest.routes';
import { friendRequestRoutes } from '../modules/friendRequest/friendRequest.routes';
import { bondLinkRoutes } from '../modules/bondLink/bondLink.routes';
import { DonateRoutes } from '../modules/donate/donate.routes';

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
        path: '/admin',
        router: AdminRoutes,
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
    {
        path: '/audio',
        router: audioRoutes,
    },
    {
        path: '/audio-bookmark',
        router: audioBookmarkRoutes,
    },
    {
        path: '/playlist',
        router: playlistRoutes,
    },
    {
        path: '/project-join-request',
        router: projectJoinRequestRoutes,
    },
    {
        path: '/project-member',
        router: projectMemberRoutes,
    },
    {
        path: '/project-document',
        router: projectDocumentRoutes,
    },
    {
        path: '/project-image',
        router: projectImageRoutes,
    },
    {
        path: '/institution',
        router: institutionRoutes,
    },
    {
        path: '/institution-member',
        router: institutionMemberRoutes,
    },
    {
        path: '/institution-conversation',
        router: institutionConversationRoutes,
    },
    {
        path: '/comment',
        router: commentRoutes,
    },
    {
        path: '/bond',
        router: bondRoutes,
    },
    {
        path: '/bond-request',
        router: bondRequestRoutes,
    },
    {
        path: '/friend-request',
        router: friendRequestRoutes,
    },
    {
        path: '/bond-link',
        router: bondLinkRoutes,
    },
    {
        path: '/donate',
        router: DonateRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
