/**
 * Skip-to-content: both halves of one mechanism, kept in one slice.
 *
 * `SkipLink` and `MainLandmark` are useless apart and break quietly when they disagree, so
 * they ship together with the single `MAIN_CONTENT_ID` that binds them.
 */
export { MAIN_CONTENT_ID } from './ids';
export { MainLandmark } from './MainLandmark';
export { SkipLink } from './SkipLink';
