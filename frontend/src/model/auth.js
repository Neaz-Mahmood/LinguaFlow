/**
 * @typedef {Object} AuthUser
 * @property {number} id
 * @property {string|null} email
 * @property {string|null} name
 * @property {boolean} onboardingCompleted
 * @property {string} [targetLanguage]
 * @property {string} [nativeLanguage]
 * @property {string} [currentLevel]
 * @property {string[]} [goals]
 * @property {string} [uiLocale]
 * @property {string} [themeMode]
 * @property {number} [dailyCommitment]
 * @property {string} [strategyPreference]
 */

/**
 * @typedef {'auth'|'onboarding'|'flow'} ViewState
 */

/**
 * @typedef {Object} AuthSuccessPayload
 * @property {AuthUser} user
 * @property {boolean} needsOnboarding
 * @property {string} [accessToken]
 */

/**
 * @typedef {Object} SignInInput
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} SignUpInput
 * @property {string} email
 * @property {string} password
 * @property {string} name
 * @property {string} confirmPassword
 */

export {};
