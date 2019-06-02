const close = () => {
    window.MessengerExtensions.requestCloseBrowser(function success() {
        return;
    }, function error(err) {
        console.error(
          err,
          'Unable to close window.',
          'You may be viewing outside of the Messenger app.'
        );
    });
};

export default {
  close,
};