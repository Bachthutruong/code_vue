import { Notify } from 'quasar';

class NotifyServices {
  showMessageSuccess(message: string, timeout = 3000) {
    Notify.create({
      message: message,
      type: 'positive',
      position: 'top',
      timeout,
    });
  }
  showMessageError(message: string, timeout = 3000) {
    Notify.create({
      message: message,
      type: 'negative',
      position: 'top',
      timeout,
    });
  }
  showMessageWarning(message: string, timeout = 3000) {
    Notify.create({
      message: message,
      type: 'warning',
      position: 'top',
      timeout,
    });
  }
}
export default new NotifyServices();
