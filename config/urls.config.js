/**
 * URL Configuration for Careerflow.ai
 * Centralized place for all URLs and routes
 */

const BASE_URL = 'https://app.careerflow.ai';

const ROUTES = {
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  profile: '/profile',
};

const URLS = {
  login: `${BASE_URL}${ROUTES.login}`,
  signup: `${BASE_URL}${ROUTES.signup}`,
  dashboard: `${BASE_URL}${ROUTES.dashboard}`,
  profile: `${BASE_URL}${ROUTES.profile}`,
};

module.exports = {
  BASE_URL,
  ROUTES,
  URLS,
};
