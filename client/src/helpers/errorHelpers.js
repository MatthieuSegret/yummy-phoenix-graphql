export default function normalizeMessages(messages) {
  if (!messages || messages.length === 0) {
    return null;
  }
  const messagesNormalized = {};
  messages.map(messageValidation => {
    return (messagesNormalized[messageValidation.field || 'base'] = messageValidation.message);
  });
  return messagesNormalized;
}
