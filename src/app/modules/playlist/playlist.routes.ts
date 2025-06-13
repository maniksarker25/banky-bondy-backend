import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import PlaylistController from './playlist.controller';
import validateRequest from '../../middlewares/validateRequest';
import PlaylistValidations from './playlist.validation';

const router = express.Router();

// Create Playlist
router.post(
    '/create-playlist',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(PlaylistValidations.createPlaylistValidationSchema),
    PlaylistController.createPlaylist
);

// Get All Playlists
router.get(
    '/all-playlists',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
    PlaylistController.getAllPlaylists
);
router.get(
    '/my-playlists',
    auth(USER_ROLE.user),
    PlaylistController.getMyPlaylists
);

// Get Playlist by ID
router.get(
    '/single-playlist/:playlistId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.user),
    PlaylistController.getPlaylistById
);

// Update Playlist-----
router.patch(
    '/update-playlist/:playlistId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    validateRequest(PlaylistValidations.updatePlaylistValidationSchema),
    PlaylistController.updatePlaylist
);

// Delete Playlist
router.delete(
    '/delete-playlist/:playlistId',
    auth(USER_ROLE.superAdmin, USER_ROLE.admin),
    PlaylistController.deletePlaylist
);

export const playlistRoutes = router;
