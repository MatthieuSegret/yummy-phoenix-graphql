export default function normalizeMessages(messages) {
  if (!messages || messages.length === 0) {
    return null;
  }
  const messagesNormalized = {};
  messages.map(messageValidation => {
    return (messagesNormalized[messageValidation.field] = messageValidation.message);
  });
  return messagesNormalized;
}
