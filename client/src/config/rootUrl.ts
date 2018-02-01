export default (process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '');
export const WS_ROOT_URL = process.env.NODE_ENV === 'development' ? 'ws://localhost:4000' : '';
