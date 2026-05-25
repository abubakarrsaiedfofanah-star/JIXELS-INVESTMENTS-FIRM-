window.JixelsFooter = (() => {
  const whatsappNumber = "254713111666";
  const defaultWhatsappText = "Hello Jixels, I would like to learn more about your products, partnerships or support.";

  const buildWhatsappUrl = (message) => {
    const encodedMessage = encodeURIComponent(message);
    return whatsappNumber
      ? `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
      : `https://wa.me/?text=${encodedMessage}`;
  };

  const init = () => {
    document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
      link.href = buildWhatsappUrl(defaultWhatsappText);
    });
  };

  return { init, buildWhatsappUrl };
})();
