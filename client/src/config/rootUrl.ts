export default (process.env.PROD ? '' : 'http://localhost:4000');
export const WS_ROOT_URL = `ws://${process.env.PROD ? window.location.host : 'localhost:4000'}`;
